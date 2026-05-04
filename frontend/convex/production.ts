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

async function generateNumero(ctx: any): Promise<string> {
  const company = await ctx.db.query("companies").order("desc").first()
  const prefixo = company?.prefixoProducao || "OPD"
  const ano = new Date().getFullYear().toString().slice(-2)
  const ordens = await ctx.db.query("productionOrders").withIndex("by_numero", (q: any) => q.gte("numero", `${prefixo}-${ano}-`).lt("numero", `${prefixo}-${ano}-\uffff`)).order("desc").take(1)
  const ultimoNum = ordens.length > 0 ? parseInt(ordens[0].numero!.split("-")[2] || "0", 10) : 0
  return `${prefixo}-${ano}-${String(ultimoNum + 1).padStart(4, "0")}`
}

async function generateLote(ctx: any): Promise<string> {
  const ano = new Date().getFullYear().toString().slice(-2)
  const lotes = await ctx.db.query("productionLogs").withIndex("by_lote", (q: any) => q.gte("lote", `LOT-${ano}-`).lt("lote", `LOT-${ano}-\uffff`)).order("desc").take(1)
  const ultimoNum = lotes.length > 0 ? parseInt(lotes[0].lote!.split("-")[2] || "0", 10) : 0
  return `LOT-${ano}-${String(ultimoNum + 1).padStart(4, "0")}`
}

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.status) return await ctx.db.query("productionOrders").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    return await ctx.db.query("productionOrders").order("desc").take(200)
  },
})

export const get = query({
  args: { orderId: v.id("productionOrders") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.get(args.orderId)
  },
})

export const getItems = query({
  args: { orderId: v.id("productionOrders") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("productionItems").withIndex("by_productionOrderId", (q: any) => q.eq("productionOrderId", args.orderId)).order("asc").collect()
  },
})

export const getLogs = query({
  args: { orderId: v.id("productionOrders") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("productionLogs").withIndex("by_productionOrderId", (q: any) => q.eq("productionOrderId", args.orderId)).order("asc").collect()
  },
})

export const create = mutation({
  args: {
    productId: v.id("products"),
    formulaId: v.id("formulas"),
    quantidadePlanejada: v.number(),
    dataPrevista: v.optional(v.number()),
    observacoes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Producao"])

    const formula = await ctx.db.get(args.formulaId)
    if (!formula) throw new Error("Formula nao encontrada")

    const ingredients = await ctx.db.query("formulaIngredients").withIndex("by_formulaId", (q: any) => q.eq("formulaId", args.formulaId)).order("asc").collect()
    if (ingredients.length === 0) throw new Error("Formula sem ingredientes")

    const escala = args.quantidadePlanejada

    // Verifica estoque por variante e reserva
    const warnings: string[] = []
    let podeProduzir = true

    for (const ing of ingredients) {
      const estoqueDisponivel = ing.varianteId
        ? ((await ctx.db.get(ing.varianteId))?.quantidade || 0) - ((await ctx.db.get(ing.varianteId))?.reservado || 0)
        : (await ctx.db.query("insumoVariants").withIndex("by_insumoId", (q: any) => q.eq("insumoId", ing.insumoId)).first())?.quantidade || 0

      const qtdNecessaria = ing.quantidade * escala
      if (estoqueDisponivel < qtdNecessaria) {
        podeProduzir = false
      }
    }

    const numero = await generateNumero(ctx)
    const orderId = await ctx.db.insert("productionOrders", {
      ...args, numero, status: "Planejada",
      responsavelId: userId, responsavelNome: profile.fullName,
      createdAt: Date.now(), updatedAt: Date.now(),
    } as any)

    for (const ing of ingredients) {
      const qtdPrevista = (ing.quantidade || 0) * escala
      await ctx.db.insert("productionItems", {
        productionOrderId: orderId,
        insumoId: ing.insumoId, varianteId: ing.varianteId,
        quantidadePrevista: qtdPrevista,
        ordem: ing.ordem || 1,
        createdAt: Date.now(), updatedAt: Date.now(),
      } as any)
    }

    if (podeProduzir) {
      // Reserva estoque por variante
      for (const ing of ingredients) {
        if (ing.varianteId) {
          const variante = await ctx.db.get(ing.varianteId)
          if (variante) {
            const reservadoAtual = variante.reservado || 0
            const qtdPrevista = (ing.quantidade || 0) * escala
            await ctx.db.patch(ing.varianteId, { reservado: reservadoAtual + qtdPrevista, updatedAt: Date.now() } as any)
          }
        }
      }
    }

    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "CRIAR", entity: "OrdemProducao", entityId: orderId, description: `OP ${numero} criada` })
    return { orderId, numero, podeProduzir, warnings }
  },
})

export const startExecution = mutation({
  args: { orderId: v.id("productionOrders") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const order = await ctx.db.get(args.orderId)
    if (!order || order.status !== "Planejada") throw new Error("Ordem invalida para inicio")
    await ctx.db.patch(args.orderId, { status: "Em andamento", dataInicio: Date.now(), updatedAt: Date.now() })
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "EDITAR", entity: "OrdemProducao", entityId: args.orderId, description: "Producao iniciada" })
  },
})

export const updateChecklist = mutation({
  args: {
    itemId: v.id("productionItems"),
    quantidadeReal: v.optional(v.number()),
    varianteSubstitutaId: v.optional(v.id("insumoVariants")),
    proporcaoSubstituicao: v.optional(v.number()),
    justificativa: v.optional(v.string()),
    checked: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const item = await ctx.db.get(args.itemId)
    if (!item) throw new Error("Item nao encontrado")

    const updates: any = { updatedAt: Date.now() }
    if (args.quantidadeReal !== undefined) updates.quantidadeReal = args.quantidadeReal
    if (args.varianteSubstitutaId) { updates.varianteSubstitutaId = args.varianteSubstitutaId; updates.proporcaoSubstituicao = args.proporcaoSubstituicao }
    if (args.justificativa !== undefined) updates.justificativa = args.justificativa
    if (args.checked !== undefined) updates.checked = args.checked
    await ctx.db.patch(args.itemId, updates)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "EDITAR", entity: "ProducaoItem", entityId: args.itemId, description: "Checklist atualizado" })
  },
})

export const completeProduction = mutation({
  args: {
    orderId: v.id("productionOrders"),
    quantidadeProduzida: v.number(),
    dataFabricacao: v.optional(v.number()),
    dataValidade: v.optional(v.string()),
    cqAprovado: v.optional(v.boolean()),
    observacoes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const order = await ctx.db.get(args.orderId)
    if (!order || order.status !== "Em andamento") throw new Error("Status invalido para conclusao")

    const items = await ctx.db.query("productionItems").withIndex("by_productionOrderId", (q: any) => q.eq("productionOrderId", args.orderId)).collect()
    let custoTotal = 0
    const rendimento = order.quantidadePlanejada > 0 ? (args.quantidadeProduzida / order.quantidadePlanejada) * 100 : 100

    // Baixa estoque por variante, log stock movements
    for (const item of items) {
      const qtdReal = item.quantidadeReal || item.quantidadePrevista
      const varianteId = item.varianteSubstitutaId || item.varianteId

      if (varianteId) {
        const variante = await ctx.db.get(varianteId)
        if (variante) {
          const saldoAnterior = variante.quantidade || 0
          const reservadoAnterior = variante.reservado || 0
          const novaQuantidade = Math.max(0, saldoAnterior - qtdReal)
          const novoReservado = Math.max(0, reservadoAnterior - (item.quantidadePrevista || 0))

          await ctx.db.patch(varianteId, { quantidade: novaQuantidade, reservado: novoReservado, updatedAt: Date.now() } as any)

          await logMovement(ctx, {
            itemType: "insumo", insumoId: item.insumoId, varianteId,
            tipo: "saida", quantidade: qtdReal, saldoAnterior, saldoAtual: novaQuantidade,
            origem: "producao", referenciaId: args.orderId, userId,
            observacao: `Producao ${order.numero || ""}`,
          })

          const pmp = variante.precoMedio || 0
          custoTotal += qtdReal * pmp
        }
      }
    }

    // Entrada de produto acabado nas embalagens
    const packagings = await ctx.db.query("productPackagings").withIndex("by_productId", (q: any) => q.eq("productId", order.productId)).collect()
    if (packagings.length > 0) {
      const pkg = packagings[0] // primeira embalagem como default
      const volume = pkg.volume || 1
      const novasUnidades = Math.floor(args.quantidadeProduzida / volume)
      const saldoAnterior = pkg.quantidade || 0
      const novoSaldo = saldoAnterior + novasUnidades
      await ctx.db.patch(pkg._id, { quantidade: novoSaldo, updatedAt: Date.now() } as any)
      await logMovement(ctx, {
        itemType: "produto", productId: order.productId, productPackagingId: pkg._id,
        tipo: "entrada", quantidade: novasUnidades, saldoAnterior, saldoAtual: novoSaldo,
        origem: "producao", referenciaId: args.orderId, userId,
        observacao: `Producao ${order.numero || ""}`,
      })
    }

    const lote = await generateLote(ctx)
    const custoUnitario = args.quantidadeProduzida > 0 ? custoTotal / args.quantidadeProduzida : 0
    const cqOk = args.cqAprovado !== false
    const novoStatus = cqOk ? "Concluida" : "Quarentena"
    const logStatus = cqOk ? "aprovado" : "quarentena"

    await ctx.db.patch(args.orderId, {
      status: novoStatus, quantidadeProduzida: args.quantidadeProduzida,
      rendimento, custoTotal, custoUnitario, lote,
      dataFabricacao: args.dataFabricacao || Date.now(),
      dataValidade: args.dataValidade,
      dataConclusao: Date.now(),
      observacoes: args.observacoes,
      updatedAt: Date.now(),
    })

    await ctx.db.insert("productionLogs", {
      productionOrderId: args.orderId, lote, quantidade: args.quantidadeProduzida,
      dataFabricacao: args.dataFabricacao || Date.now(),
      dataValidade: args.dataValidade,
      status: logStatus, createdAt: Date.now(), updatedAt: Date.now(),
    } as any)

    // Libera reservas restantes
    for (const item of items) {
      if (item.varianteId) {
        const variante = await ctx.db.get(item.varianteId)
        if (variante && (variante.reservado || 0) > 0) {
          const reservadoRestante = Math.max(0, (variante.reservado || 0) - (item.quantidadePrevista || 0))
          await ctx.db.patch(item.varianteId, { reservado: reservadoRestante, updatedAt: Date.now() } as any)
        }
      }
    }

    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "EDITAR", entity: "OrdemProducao", entityId: args.orderId, description: `OP ${order.numero} concluida - Lote ${lote}` })
    return { lote, custoTotal, custoUnitario, rendimento }
  },
})

export const cancelOrder = mutation({
  args: { orderId: v.id("productionOrders"), motivo: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const order = await ctx.db.get(args.orderId)
    if (!order || order.status === "Concluida" || order.status === "Cancelada") throw new Error("Status invalido para cancelamento")

    // Libera reservas
    const items = await ctx.db.query("productionItems").withIndex("by_productionOrderId", (q: any) => q.eq("productionOrderId", args.orderId)).collect()
    for (const item of items) {
      if (item.varianteId) {
        const variante = await ctx.db.get(item.varianteId)
        if (variante && (variante.reservado || 0) > 0) {
          const reservadoRestante = Math.max(0, (variante.reservado || 0) - (item.quantidadePrevista || 0))
          await ctx.db.patch(item.varianteId, { reservado: reservadoRestante, updatedAt: Date.now() } as any)
        }
      }
    }

    await ctx.db.patch(args.orderId, { status: "Cancelada", observacoes: args.motivo, updatedAt: Date.now() })
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "EDITAR", entity: "OrdemProducao", entityId: args.orderId, description: `OP ${order.numero} cancelada: ${args.motivo}` })
  },
})

export const listQuarentena = query({
  handler: async (ctx) => {
    await requireAuth(ctx)
    return await ctx.db.query("productionLogs").withIndex("by_lote", (q: any) => q.gte("lote", "").lt("lote", "\uffff")).filter((q: any) => q.or(q.eq(q.field("status"), "quarentena"), q.eq(q.field("status"), "descartado"), q.eq(q.field("status"), "reprocessado"))).order("desc").take(200)
  },
})

export const releaseQuarentena = mutation({
  args: { logId: v.id("productionLogs"), observacao: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const log = await ctx.db.get(args.logId)
    if (!log || log.status !== "quarentena") throw new Error("Lote invalido para liberacao")
    await ctx.db.patch(args.logId, { status: "aprovado", observacao: args.observacao, updatedAt: Date.now() })
    if (log.productionOrderId) {
      await ctx.db.patch(log.productionOrderId, { status: "Concluida", updatedAt: Date.now() })
    }
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "OUTRO", entity: "Quarentena", entityId: args.logId, description: `Lote ${log.lote} liberado da quarentena` })
  },
})

export const discardQuarentena = mutation({
  args: { logId: v.id("productionLogs"), motivo: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const log = await ctx.db.get(args.logId)
    if (!log || log.status !== "quarentena") throw new Error("Lote invalido para descarte")
    await ctx.db.patch(args.logId, { status: "descartado", observacao: args.motivo, updatedAt: Date.now() })
    if (log.productionOrderId) {
      const order = await ctx.db.get(log.productionOrderId)
      // Se tiver embalagens com quantidade, baixar
      if (log.productPackagingId) {
        const pkg = await ctx.db.get(log.productPackagingId)
        if (pkg && (pkg.quantidade || 0) >= log.quantidade) {
          const anterior = pkg.quantidade || 0
          const nova = Math.max(0, anterior - log.quantidade)
          await ctx.db.patch(log.productPackagingId, { quantidade: nova, updatedAt: Date.now() } as any)
          await logMovement(ctx, { itemType: "produto", productId: order?.productId, productPackagingId: log.productPackagingId, tipo: "saida", quantidade: log.quantidade, saldoAnterior: anterior, saldoAtual: nova, origem: "descarte", referenciaId: log.productionOrderId, observacao: args.motivo, userId })
        }
      }
    }
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "OUTRO", entity: "Quarentena", entityId: args.logId, description: `Lote ${log.lote} descartado: ${args.motivo}` })
  },
})

export const reprocessLot = mutation({
  args: { logId: v.id("productionLogs") },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Producao"])
    const log = await ctx.db.get(args.logId)
    if (!log || log.status !== "quarentena") throw new Error("Lote invalido para reprocessamento")
    const order = await ctx.db.get(log.productionOrderId)
    if (!order) throw new Error("Ordem original nao encontrada")

    const numero = await generateNumero(ctx)
    const newOrderId = await ctx.db.insert("productionOrders", {
      productId: order.productId, formulaId: order.formulaId,
      quantidadePlanejada: order.quantidadePlanejada,
      dataPrevista: Date.now() + 7 * 86400000,
      status: "Planejada", responsavelId: userId, responsavelNome: profile.fullName,
      numero, lote: log.lote, // vincula ao lote original
      observacoes: `Reprocessamento do lote ${log.lote} - OP original ${order.numero}`,
      createdAt: Date.now(), updatedAt: Date.now(),
    } as any)

    const items = await ctx.db.query("productionItems").withIndex("by_productionOrderId", (q: any) => q.eq("productionOrderId", order._id)).collect()
    for (const item of items) {
      await ctx.db.insert("productionItems", {
        productionOrderId: newOrderId, insumoId: item.insumoId,
        varianteId: item.varianteId, quantidadePrevista: item.quantidadePrevista,
        ordem: item.ordem, createdAt: Date.now(), updatedAt: Date.now(),
      } as any)
    }

    await ctx.db.patch(args.logId, { status: "reprocessado", observacao: `Reprocessado na OP ${numero}`, updatedAt: Date.now() })
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Producao", action: "OUTRO", entity: "Quarentena", entityId: args.logId, description: `Lote ${log.lote} reprocessado → OP ${numero}` })
    return { orderId: newOrderId, numero }
  },
})
