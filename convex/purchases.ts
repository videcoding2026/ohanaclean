import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { logMovement } from "./stock"

async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error("Not authenticated")
  return userId
}

async function requireRole(ctx: any, allowed: string[]) {
  const userId = await requireAuth(ctx)
  const profile = await ctx.db.query("userProfiles").withIndex("by_userId", (q: any) => q.eq("userId", userId)).first()
  if (!profile || !allowed.includes(profile.role)) throw new Error("Acesso negado")
  return { userId, profile }
}

async function addHistory(ctx: any, purchaseId: any, statusAnterior: string, statusNovo: string, usuarioId: any, usuarioNome: string, observacao?: string, automatico?: boolean) {
  await ctx.db.insert("purchaseHistories", {
    purchaseId, statusAnterior, statusNovo,
    data: Date.now(), usuarioId, usuarioNome,
    observacao, automatico: automatico || false,
  })
}

async function generateNumber(ctx: any): Promise<string> {
  const company = await ctx.db.query("companies").order("desc").first()
  const prefixo = company?.prefixoCompra || "CMP"
  const now = new Date()
  const ano = now.getFullYear().toString().slice(-2)
  const compras = await ctx.db.query("purchases").withIndex("by_numero", (q: any) => q.gte("numero", `${prefixo}-${ano}-`).lt("numero", `${prefixo}-${ano}-\uffff`)).order("desc").take(1)
  const ultimoNum = compras.length > 0 ? parseInt(compras[0].numero!.split("-")[2] || "0", 10) : 0
  const seq = String(ultimoNum + 1).padStart(4, "0")
  return `${prefixo}-${ano}-${seq}`
}

async function updatePMP(ctx: any, item: { insumoId: any; varianteId?: any; quantidade: number; precoUnitario: number; subtotal: number }, frete: number, totalCompra: number) {
  const proporcao = totalCompra > 0 ? item.subtotal / totalCompra : 0
  const freteProporcional = frete * proporcao
  const custoReal = item.precoUnitario + (item.quantidade > 0 ? freteProporcional / item.quantidade : 0)

  if (item.varianteId) {
    const variante = await ctx.db.get(item.varianteId)
    if (!variante) return
    const qtdAtual = variante.quantidade || 0
    const pmpAtual = variante.precoMedio || 0
    const qtdNova = item.quantidade
    const valorAtual = qtdAtual * pmpAtual
    const valorNovo = qtdNova * custoReal
    const pmpNovo = (qtdAtual + qtdNova) > 0 ? (valorAtual + valorNovo) / (qtdAtual + qtdNova) : custoReal
    await ctx.db.patch(item.varianteId, { precoMedio: pmpNovo, quantidade: qtdAtual + qtdNova, updatedAt: Date.now() } as any)
  } else {
    const insumo = await ctx.db.get(item.insumoId)
    if (!insumo) return
    const qtdAtual = insumo.quantidade || 0
    const pmpAtual = insumo.precoMedio || 0
    const qtdNova = item.quantidade
    const valorAtual = qtdAtual * pmpAtual
    const valorNovo = qtdNova * custoReal
    const pmpNovo = (qtdAtual + qtdNova) > 0 ? (valorAtual + valorNovo) / (qtdAtual + qtdNova) : custoReal
    await ctx.db.patch(item.insumoId, { precoMedio: pmpNovo, quantidade: qtdAtual + qtdNova, updatedAt: Date.now() } as any)
  }
}

async function createContasPagar(ctx: any, purchaseId: any, fornecedorId: any, fornecedorNome: string, total: number, condPagamento: string, tipoPagamento: string, dataCompra: number, statusInicial: string) {
  const descricao = `Compra de insumos`
  const now = new Date(dataCompra)

  if (tipoPagamento === "PIX" || tipoPagamento === "Dinheiro" || tipoPagamento === "Cartao Debito" || tipoPagamento === "Transferencia") {
    await ctx.db.insert("contasPagar", {
      purchaseId, fornecedorId, fornecedorNome, descricao,
      valor: total,
      dataVencimento: dataCompra,
      dataPagamento: statusInicial === "Paga" ? dataCompra : undefined,
      formaPagamento: tipoPagamento,
      status: statusInicial === "Paga" ? "Paga" : "Aberta",
      parcela: "1/1",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  } else if (tipoPagamento === "Boleto") {
    await ctx.db.insert("contasPagar", {
      purchaseId, fornecedorId, fornecedorNome, descricao,
      valor: total,
      dataVencimento: dataCompra,
      formaPagamento: "Boleto",
      status: "Aberta",
      parcela: "1/1",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  } else if (tipoPagamento === "Cartao") {
    const parcelas = condPagamento === "30/60d" ? 2 : condPagamento === "30/60/90d" ? 3 : parseInt(condPagamento.replace(/\D/g, "") || "1", 10) || 1
    const valorParcela = Math.round((total / parcelas) * 100) / 100
    for (let i = 0; i < parcelas; i++) {
      const vencimento = new Date(now)
      vencimento.setMonth(vencimento.getMonth() + i)
      await ctx.db.insert("contasPagar", {
        purchaseId, fornecedorId, fornecedorNome,
        descricao: `Compra de insumos (${i + 1}/${parcelas})`,
        valor: valorParcela,
        dataVencimento: vencimento.getTime(),
        dataPagamento: statusInicial === "Paga" ? dataCompra : undefined,
        formaPagamento: "Cartao",
        status: statusInicial === "Paga" ? "Paga" : "Aberta",
        parcela: `${i + 1}/${parcelas}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }
  }
}

// ==================== QUERIES ====================

export const list = query({
  args: {
    status: v.optional(v.string()),
    fornecedorId: v.optional(v.id("suppliers")),
    tipo: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    let purchases: any[]
    if (args.status) {
      purchases = await ctx.db.query("purchases").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    } else if (args.fornecedorId) {
      purchases = await ctx.db.query("purchases").withIndex("by_fornecedorId", (q: any) => q.eq("fornecedorId", args.fornecedorId)).order("desc").take(200)
    } else {
      purchases = await ctx.db.query("purchases").order("desc").take(200)
    }

    if (args.tipo) {
      purchases = purchases.filter((p: any) => p.tipo === args.tipo)
    }
    if (args.search) {
      const s = args.search.toLowerCase()
      purchases = purchases.filter((p: any) =>
        (p.numero?.toLowerCase().includes(s)) ||
        (p.numeroNota?.toLowerCase().includes(s))
      )
    }
    return purchases
  },
})

export const get = query({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.get(args.purchaseId)
  },
})

export const listItems = query({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("purchaseItems").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).order("asc").collect()
  },
})

export const getHistory = query({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("purchaseHistories").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).order("desc").collect()
  },
})

export const getReturns = query({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("purchaseReturns").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).order("desc").collect()
  },
})

export const getContasByPurchase = query({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("contasPagar").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).order("asc").collect()
  },
})

// ==================== MUTATIONS ====================

export const create = mutation({
  args: {
    fornecedorId: v.optional(v.id("suppliers")),
    tipo: v.optional(v.union(v.literal("direto"), v.literal("marketplace"))),
    dataCompra: v.number(),
    numeroNota: v.optional(v.string()),
    tipoPagamento: v.optional(v.string()),
    condPagamento: v.optional(v.string()),
    freteGratis: v.optional(v.boolean()),
    frete: v.optional(v.number()),
    observacoes: v.optional(v.string()),
    items: v.array(v.object({
      insumoId: v.id("insumos"),
      varianteId: v.optional(v.id("insumoVariants")),
      quantidade: v.number(),
      unidade: v.optional(v.string()),
      precoUnitario: v.number(),
      subtotal: v.number(),
      numeroLote: v.optional(v.string()),
      dataValidade: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque"])
    const { items, ...purchaseData } = args
    const total = (items.reduce((sum, i) => sum + i.subtotal, 0) + (args.frete || 0))

    const fornecedor = args.fornecedorId ? await ctx.db.get(args.fornecedorId) : null
    const fornecedorNome = fornecedor?.pjNomeFantasia || fornecedor?.pfName || ""

    const isMarketplace = args.tipo === "marketplace"

    if (isMarketplace) {
      const numero = await generateNumber(ctx)
      const purchaseId = await ctx.db.insert("purchases", {
        ...purchaseData,
        numero,
        total,
        status: "Pedida",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as any)

      for (const item of items) {
        await ctx.db.insert("purchaseItems", {
          ...item,
          purchaseId,
          statusRecebimento: "pendente",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as any)
      }

      await createContasPagar(ctx, purchaseId, args.fornecedorId, fornecedorNome, total, args.condPagamento || "", args.tipoPagamento || "", args.dataCompra, "Paga")

      await addHistory(ctx, purchaseId, "", "Pedida", userId, profile.fullName, "Compra marketplace registrada", false)

      await ctx.db.insert("auditLogs", {
        userId, timestamp: Date.now(), module: "Compras", action: "CRIAR",
        entity: "Compra", entityId: purchaseId,
        description: `Compra ${numero} criada (marketplace)`,
      })
      return purchaseId
    }

    const purchaseId = await ctx.db.insert("purchases", {
      ...purchaseData,
      total,
      status: "Rascunho",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any)

    for (const item of items) {
      await ctx.db.insert("purchaseItems", {
        ...item,
        purchaseId,
        statusRecebimento: "pendente",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as any)
    }

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "CRIAR",
      entity: "Compra", entityId: purchaseId,
      description: `Compra em rascunho criada`,
    })
    return purchaseId
  },
})

export const updateDraft = mutation({
  args: {
    purchaseId: v.id("purchases"),
    fornecedorId: v.optional(v.id("suppliers")),
    tipo: v.optional(v.union(v.literal("direto"), v.literal("marketplace"))),
    dataCompra: v.number(),
    numeroNota: v.optional(v.string()),
    tipoPagamento: v.optional(v.string()),
    condPagamento: v.optional(v.string()),
    freteGratis: v.optional(v.boolean()),
    frete: v.optional(v.number()),
    observacoes: v.optional(v.string()),
    items: v.array(v.object({
      insumoId: v.id("insumos"),
      varianteId: v.optional(v.id("insumoVariants")),
      quantidade: v.number(),
      unidade: v.optional(v.string()),
      precoUnitario: v.number(),
      subtotal: v.number(),
      numeroLote: v.optional(v.string()),
      dataValidade: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status !== "Rascunho") throw new Error("Apenas rascunhos podem ser editados")

    const { purchaseId, items, ...updateData } = args
    const total = (items.reduce((sum, i) => sum + i.subtotal, 0) + (args.frete || 0))

    await ctx.db.patch(purchaseId, { ...updateData, total, updatedAt: Date.now() })

    const existingItems = await ctx.db.query("purchaseItems").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", purchaseId)).collect()
    for (const item of existingItems) {
      await ctx.db.delete(item._id)
    }
    for (const item of items) {
      await ctx.db.insert("purchaseItems", {
        ...item, purchaseId,
        statusRecebimento: "pendente",
        createdAt: Date.now(), updatedAt: Date.now(),
      } as any)
    }

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: purchaseId,
      description: `Rascunho de compra atualizado`,
    })
  },
})

export const confirmOrder = mutation({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status !== "Rascunho") throw new Error("Status invalido para confirmar pedido")

    const items = await ctx.db.query("purchaseItems").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).collect()
    if (items.length === 0) throw new Error("Adicione pelo menos um item")

    const numero = await generateNumber(ctx)
    const tipoPagamento = purchase.tipoPagamento || ""
    const necesitaAguardarPagamento = tipoPagamento === "Boleto" || tipoPagamento === "Transferencia"
    const novoStatus = necesitaAguardarPagamento ? "Aguardando Pagamento" : "Pedida"
    const statusAnterior = "Rascunho"

    await ctx.db.patch(args.purchaseId, { numero, status: novoStatus, updatedAt: Date.now() })

    const fornecedor = purchase.fornecedorId ? await ctx.db.get(purchase.fornecedorId) : null
    const fornecedorNome = fornecedor?.pjNomeFantasia || fornecedor?.pfName || ""

    const total = purchase.total || 0
    const pagoStatus = necesitaAguardarPagamento ? undefined : "Paga"

    if (tipoPagamento === "PIX" || tipoPagamento === "Dinheiro" || tipoPagamento === "Cartao Debito" || tipoPagamento === "Transferencia") {
      await createContasPagar(ctx, args.purchaseId, purchase.fornecedorId, fornecedorNome, total, purchase.condPagamento || "", tipoPagamento, purchase.dataCompra, pagoStatus || "Paga")
    } else if (tipoPagamento === "Cartao") {
      await createContasPagar(ctx, args.purchaseId, purchase.fornecedorId, fornecedorNome, total, purchase.condPagamento || "", "Cartao", purchase.dataCompra, "Paga")
    } else {
      await createContasPagar(ctx, args.purchaseId, purchase.fornecedorId, fornecedorNome, total, purchase.condPagamento || "", "Boleto", purchase.dataCompra, "Aberta")
    }

    await addHistory(ctx, args.purchaseId, statusAnterior, novoStatus, userId, profile.fullName, `Pedido confirmado - ${numero}`, false)

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: args.purchaseId,
      description: `Pedido confirmado: ${numero}`,
    })
  },
})

export const confirmPayment = mutation({
  args: {
    purchaseId: v.id("purchases"),
    dataPagamento: v.number(),
    comprovanteStorageId: v.optional(v.id("_storage")),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque", "Financeiro"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status !== "Pedida" && purchase.status !== "Aguardando Pagamento") throw new Error("Status invalido para confirmar pagamento")

    const statusAnterior = purchase.status
    await ctx.db.patch(args.purchaseId, {
      status: "Em transito",
      dataPagamento: args.dataPagamento,
      comprovantePagamentoId: args.comprovanteStorageId,
      observacaoPagamento: args.observacao,
      updatedAt: Date.now(),
    })

    const contas = await ctx.db.query("contasPagar").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).collect()
    for (const conta of contas) {
      await ctx.db.patch(conta._id, { status: "Paga", dataPagamento: args.dataPagamento, updatedAt: Date.now() })
    }

    await addHistory(ctx, args.purchaseId, statusAnterior, "Em transito", userId, profile.fullName, args.observacao || "Pagamento confirmado", false)

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: args.purchaseId,
      description: "Pagamento confirmado",
    })
  },
})

export const setTracking = mutation({
  args: {
    purchaseId: v.id("purchases"),
    codigoRastreio: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status !== "Pedida" && purchase.status !== "Aguardando Pagamento" && purchase.status !== "Em transito") throw new Error("Status invalido")

    await ctx.db.patch(args.purchaseId, { codigoRastreio: args.codigoRastreio, updatedAt: Date.now() })

    if (purchase.status === "Pedida" || purchase.status === "Aguardando Pagamento") {
      await ctx.db.patch(args.purchaseId, { status: "Em transito", updatedAt: Date.now() })
      await addHistory(ctx, args.purchaseId, purchase.status, "Em transito", userId, profile.fullName, `Rastreio: ${args.codigoRastreio}`, false)
    }

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: args.purchaseId,
      description: `Rastreio informado: ${args.codigoRastreio}`,
    })
  },
})

export const receiveItems = mutation({
  args: {
    purchaseId: v.id("purchases"),
    dataRecebimento: v.number(),
    observacao: v.optional(v.string()),
    items: v.array(v.object({
      itemId: v.id("purchaseItems"),
      quantidadeRecebida: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status !== "Em transito" && purchase.status !== "Recebida parcialmente") throw new Error("Status invalido para recebimento")

    const totalCompra = purchase.total || 0
    const frete = purchase.frete || 0

    let todosRecebidos = true
    let algumRecebido = false

    for (const incoming of args.items) {
      if (incoming.quantidadeRecebida <= 0) continue
      algumRecebido = true

      const dbItem = await ctx.db.get(incoming.itemId)
      if (!dbItem) continue

      const qtdRecebida = (dbItem.quantidadeRecebida || 0) + incoming.quantidadeRecebida
      await ctx.db.patch(incoming.itemId, {
        quantidadeRecebida: qtdRecebida,
        statusRecebimento: qtdRecebida >= dbItem.quantidade ? "recebido" : "pendente",
        updatedAt: Date.now(),
      })

      const variantePre = dbItem.varianteId ? await ctx.db.get(dbItem.varianteId) : null
      const saldoAnterior = variantePre?.quantidade || 0

      await updatePMP(ctx, {
        insumoId: dbItem.insumoId,
        varianteId: dbItem.varianteId,
        quantidade: incoming.quantidadeRecebida,
        precoUnitario: dbItem.precoUnitario,
        subtotal: (dbItem.precoUnitario * incoming.quantidadeRecebida),
      }, frete, totalCompra)

      const variantePos = dbItem.varianteId ? await ctx.db.get(dbItem.varianteId) : null
      await logMovement(ctx, {
        itemType: "insumo",
        insumoId: dbItem.insumoId,
        varianteId: dbItem.varianteId,
        tipo: "entrada",
        quantidade: incoming.quantidadeRecebida,
        saldoAnterior,
        saldoAtual: variantePos?.quantidade || (saldoAnterior + incoming.quantidadeRecebida),
        origem: "compra",
        referenciaId: args.purchaseId,
        userId,
      })
    }

    if (!algumRecebido) throw new Error("Informe a quantidade recebida para pelo menos um item")

    const allItems = await ctx.db.query("purchaseItems").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).collect()
    todosRecebidos = allItems.every((i: any) => (i.statusRecebimento === "recebido"))

    const statusAnterior = purchase.status
    const novoStatus = todosRecebidos ? "Recebida" : "Recebida parcialmente"

    await ctx.db.patch(args.purchaseId, {
      status: novoStatus,
      dataRecebimento: args.dataRecebimento,
      observacaoRecebimento: args.observacao,
      updatedAt: Date.now(),
    })

    const descricao = todosRecebidos ? "Compra recebida integralmente" : "Compra recebida parcialmente"
    await addHistory(ctx, args.purchaseId, statusAnterior, novoStatus, userId, profile.fullName, args.observacao || descricao, false)

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: args.purchaseId,
      description: descricao,
    })
  },
})

export const cancelPurchase = mutation({
  args: {
    purchaseId: v.id("purchases"),
    motivo: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status === "Recebida" || purchase.status === "Recebida parcialmente" || purchase.status === "Devolvida") {
      throw new Error("Compras ja recebidas nao podem ser canceladas. Use a devolucao.")
    }
    if (purchase.status === "Cancelada") throw new Error("Compra ja esta cancelada")

    const statusAnterior = purchase.status

    if (statusAnterior === "Rascunho") {
      const items = await ctx.db.query("purchaseItems").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).collect()
      for (const item of items) {
        await ctx.db.delete(item._id)
      }
      await addHistory(ctx, args.purchaseId, statusAnterior, "Cancelada", userId, profile.fullName, args.motivo, false)
      await ctx.db.delete(args.purchaseId)
    } else {
      await ctx.db.patch(args.purchaseId, { status: "Cancelada", motivoCancelamento: args.motivo, updatedAt: Date.now() })
      await addHistory(ctx, args.purchaseId, statusAnterior, "Cancelada", userId, profile.fullName, args.motivo, false)

      const contas = await ctx.db.query("contasPagar").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).collect()
      for (const conta of contas) {
        if (conta.status !== "Cancelada") {
          await ctx.db.patch(conta._id, { status: "Cancelada", observacao: `Cancelado: ${args.motivo}`, updatedAt: Date.now() })
        }
      }
    }

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: args.purchaseId,
      description: `Compra cancelada: ${args.motivo}`,
    })
  },
})

export const returnItems = mutation({
  args: {
    purchaseId: v.id("purchases"),
    items: v.array(v.object({
      itemId: v.id("purchaseItems"),
      quantidade: v.number(),
      motivo: v.string(),
      resolucao: v.union(v.literal("Reenvio"), v.literal("Credito"), v.literal("Estorno")),
      observacao: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Estoque"])
    const purchase = await ctx.db.get(args.purchaseId)
    if (!purchase) throw new Error("Compra nao encontrada")
    if (purchase.status !== "Recebida" && purchase.status !== "Recebida parcialmente") {
      throw new Error("Apenas compras recebidas podem ser devolvidas")
    }

    for (const incoming of args.items) {
      const dbItem = await ctx.db.get(incoming.itemId)
      if (!dbItem) continue
      if (incoming.quantidade > (dbItem.quantidadeRecebida || 0)) throw new Error("Quantidade a devolver maior que a recebida")

      const qtdRecebida = (dbItem.quantidadeRecebida || 0) - incoming.quantidade
      const novoStatus = qtdRecebida <= 0 ? "devolvido" : "recebido"

      await ctx.db.patch(incoming.itemId, {
        quantidadeRecebida: qtdRecebida,
        statusRecebimento: novoStatus,
        updatedAt: Date.now(),
      })

      const variante = dbItem.varianteId ? await ctx.db.get(dbItem.varianteId) : null
      const varianteNome = variante?.nome || ""

      await ctx.db.insert("purchaseReturns", {
        purchaseId: args.purchaseId,
        itemId: incoming.itemId,
        varianteId: dbItem.varianteId,
        varianteNome,
        quantidade: incoming.quantidade,
        motivo: incoming.motivo,
        resolucao: incoming.resolucao,
        data: Date.now(),
        observacao: incoming.observacao,
        usuarioId: userId,
        createdAt: Date.now(),
      })

      if (dbItem.varianteId && variante) {
        const qtdAtual = variante.quantidade || 0
        const qtdNova = Math.max(0, qtdAtual - incoming.quantidade)
        await ctx.db.patch(dbItem.varianteId, {
          quantidade: qtdNova,
          updatedAt: Date.now(),
        } as any)
        await logMovement(ctx, {
          itemType: "insumo",
          insumoId: dbItem.insumoId,
          varianteId: dbItem.varianteId,
          tipo: "saida",
          quantidade: incoming.quantidade,
          saldoAnterior: qtdAtual,
          saldoAtual: qtdNova,
          origem: "devolucao",
          referenciaId: args.purchaseId,
          observacao: incoming.motivo,
          userId,
        })
      } else if (!dbItem.varianteId) {
        const insumo = await ctx.db.get(dbItem.insumoId)
        if (insumo) {
          const qtdAtual = insumo.quantidade || 0
          const qtdNova = Math.max(0, qtdAtual - incoming.quantidade)
          await ctx.db.patch(dbItem.insumoId, { quantidade: qtdNova, updatedAt: Date.now() } as any)
          await logMovement(ctx, { itemType: "insumo", insumoId: dbItem.insumoId, tipo: "saida", quantidade: incoming.quantidade, saldoAnterior: qtdAtual, saldoAtual: qtdNova, origem: "devolucao", referenciaId: args.purchaseId, observacao: incoming.motivo, userId })
        }
      }
    }

    const allItems = await ctx.db.query("purchaseItems").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).collect()
    const todosDevolvidos = allItems.every((i: any) => i.statusRecebimento === "devolvido" || i.statusRecebimento === "pendente")

    const statusAnterior = purchase.status
    if (todosDevolvidos) {
      await ctx.db.patch(args.purchaseId, { status: "Devolvida", updatedAt: Date.now() })
      await addHistory(ctx, args.purchaseId, statusAnterior, "Devolvida", userId, profile.fullName, "Todos os itens devolvidos", false)
    }

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Compras", action: "EDITAR",
      entity: "Compra", entityId: args.purchaseId,
      description: `Devolucao de itens registrada`,
    })
  },
})
