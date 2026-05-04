import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

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

export async function logMovement(ctx: any, data: {
  itemType: "insumo" | "produto"; insumoId?: any; varianteId?: any;
  productId?: any; productPackagingId?: any;
  tipo: "entrada" | "saida" | "ajuste" | "transferencia";
  quantidade: number; saldoAnterior: number; saldoAtual: number;
  origem?: string; referenciaId?: string;
  localOrigem?: string; localDestino?: string;
  observacao?: string; userId?: string;
}) {
  await ctx.db.insert("stockMovements", {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as any)
}

export const list = query({
  handler: async (ctx) => {
    await requireAuth(ctx)
    const variants = await ctx.db.query("insumoVariants").order("asc").take(500)
    const insumos = await ctx.db.query("insumos").order("asc").take(500)
    const packagings = await ctx.db.query("productPackagings").order("asc").take(500)
    const products = await ctx.db.query("products").order("asc").take(500)

    const insumoStock = []
    for (const v of variants) {
      const insumo = insumos.find((i: any) => i._id === v.insumoId)
      insumoStock.push({
        _id: v._id, itemType: "insumo", nome: v.nome, insumoNome: insumo?.nome || "—",
        insumoId: v.insumoId, categoria: insumo?.categoria || "—",
        quantidade: v.quantidade || 0, estoqueMinimo: v.estoqueMinimo || 0,
        estoqueMaximo: v.estoqueMaximo || 0, precoMedio: v.precoMedio || 0,
        unidadeMedida: v.unidadeMedida || insumo?.unidadeUso || "un",
        localizacao: v.localizacao || "", temValidade: v.temValidade || false,
        dataValidade: v.dataValidade || null, status: v.status, sku: "",
      })
    }

    const produtoStock = []
    for (const pkg of packagings) {
      const product = products.find((p: any) => p._id === pkg.productId)
      produtoStock.push({
        _id: pkg._id, itemType: "produto", nome: pkg.nome, insumoNome: product?.nome || "",
        productId: pkg.productId, categoria: product?.categoria || "—",
        quantidade: pkg.quantidade || 0, estoqueMinimo: pkg.quantidadeMinima || 0,
        estoqueMaximo: pkg.quantidadeMaxima || 0, precoMedio: pkg.custoEmbalagem || 0,
        unidadeMedida: pkg.unidadeVolume || "un", localizacao: pkg.localizacao || "",
        temValidade: false, dataValidade: null, status: pkg.status, sku: pkg.codigoBarras || "",
        volume: pkg.volume, precoSugerido: pkg.precoSugerido, precoVenda: pkg.precoVenda,
        margem: pkg.margem,
      })
    }

    return { insumos: insumoStock, produtos: produtoStock }
  },
})

export const getHistory = query({
  args: {
    itemType: v.optional(v.union(v.literal("insumo"), v.literal("produto"))),
    varianteId: v.optional(v.id("insumoVariants")),
    insumoId: v.optional(v.id("insumos")),
    productPackagingId: v.optional(v.id("productPackagings")),
    productId: v.optional(v.id("products")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.varianteId) return await ctx.db.query("stockMovements").withIndex("by_varianteId", (q: any) => q.eq("varianteId", args.varianteId)).order("desc").take(args.limit || 100)
    if (args.insumoId) return await ctx.db.query("stockMovements").withIndex("by_insumoId", (q: any) => q.eq("insumoId", args.insumoId)).order("desc").take(args.limit || 100)
    if (args.productPackagingId) return await ctx.db.query("stockMovements").withIndex("by_productPackagingId", (q: any) => q.eq("productPackagingId", args.productPackagingId)).order("desc").take(args.limit || 100)
    if (args.productId) return await ctx.db.query("stockMovements").withIndex("by_productId", (q: any) => q.eq("productId", args.productId)).order("desc").take(args.limit || 100)
    if (args.itemType) return await ctx.db.query("stockMovements").withIndex("by_itemType", (q: any) => q.eq("itemType", args.itemType)).order("desc").take(args.limit || 200)
    return await ctx.db.query("stockMovements").order("desc").take(args.limit || 200)
  },
})

export const adjust = mutation({
  args: {
    itemType: v.union(v.literal("insumo"), v.literal("produto")),
    varianteId: v.optional(v.id("insumoVariants")),
    productPackagingId: v.optional(v.id("productPackagings")),
    novaQuantidade: v.number(),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])

    if (args.itemType === "insumo" && args.varianteId) {
      const variante = await ctx.db.get(args.varianteId)
      if (!variante) throw new Error("Variante nao encontrada")
      const saldoAnterior = variante.quantidade || 0
      await ctx.db.patch(args.varianteId, { quantidade: args.novaQuantidade, updatedAt: Date.now() } as any)
      await logMovement(ctx, { itemType: "insumo", insumoId: variante.insumoId, varianteId: args.varianteId, tipo: "ajuste", quantidade: Math.abs(args.novaQuantidade - saldoAnterior), saldoAnterior, saldoAtual: args.novaQuantidade, origem: "ajuste_manual", observacao: args.observacao || "Ajuste manual", userId })
    } else if (args.itemType === "produto" && args.productPackagingId) {
      const pkg = await ctx.db.get(args.productPackagingId)
      if (!pkg) throw new Error("Embalagem nao encontrada")
      const saldoAnterior = pkg.quantidade || 0
      await ctx.db.patch(args.productPackagingId, { quantidade: args.novaQuantidade, updatedAt: Date.now() } as any)
      await logMovement(ctx, { itemType: "produto", productId: pkg.productId, productPackagingId: args.productPackagingId, tipo: "ajuste", quantidade: Math.abs(args.novaQuantidade - saldoAnterior), saldoAnterior, saldoAtual: args.novaQuantidade, origem: "ajuste_manual", observacao: args.observacao || "Ajuste manual", userId })
    } else throw new Error("Parametros insuficientes")

    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Estoque", action: "EDITAR", entity: "Estoque", entityId: args.varianteId || args.productPackagingId, description: `Ajuste manual: ${args.observacao || ""}` })
  },
})

export const transfer = mutation({
  args: {
    itemType: v.union(v.literal("insumo"), v.literal("produto")),
    varianteId: v.optional(v.id("insumoVariants")),
    productPackagingId: v.optional(v.id("productPackagings")),
    quantidade: v.number(),
    localDestino: v.string(),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    if (args.itemType === "insumo" && args.varianteId) {
      const variante = await ctx.db.get(args.varianteId)
      if (!variante || (variante.quantidade || 0) < args.quantidade) throw new Error("Saldo insuficiente")
      const localOrigem = variante.localizacao || "—"
      const saldoAnterior = variante.quantidade || 0
      const saldoAtual = saldoAnterior - args.quantidade
      await ctx.db.patch(args.varianteId, { quantidade: saldoAtual, updatedAt: Date.now() } as any)
      await logMovement(ctx, { itemType: "insumo", insumoId: variante.insumoId, varianteId: args.varianteId, tipo: "transferencia", quantidade: args.quantidade, saldoAnterior, saldoAtual, origem: "transferencia", localOrigem, localDestino: args.localDestino, observacao: args.observacao, userId })
    } else if (args.itemType === "produto" && args.productPackagingId) {
      const pkg = await ctx.db.get(args.productPackagingId)
      if (!pkg || (pkg.quantidade || 0) < args.quantidade) throw new Error("Saldo insuficiente")
      const localOrigem = pkg.localizacao || "—"
      const saldoAnterior = pkg.quantidade || 0
      const saldoAtual = saldoAnterior - args.quantidade
      await ctx.db.patch(args.productPackagingId, { quantidade: saldoAtual, updatedAt: Date.now() } as any)
      await logMovement(ctx, { itemType: "produto", productId: pkg.productId, productPackagingId: args.productPackagingId, tipo: "transferencia", quantidade: args.quantidade, saldoAnterior, saldoAtual, origem: "transferencia", localOrigem, localDestino: args.localDestino, observacao: args.observacao, userId })
    } else throw new Error("Parametros insuficientes")
  },
})

export const startInventory = mutation({
  args: { escopo: v.union(v.literal("completo"), v.literal("insumos"), v.literal("produtos")) },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const inventarioId = await ctx.db.insert("inventarios", { escopo: args.escopo, status: "em_andamento", dataInicio: Date.now(), createdAt: Date.now(), updatedAt: Date.now() })

    if (args.escopo === "insumos" || args.escopo === "completo") {
      const variants = await ctx.db.query("insumoVariants").take(500)
      for (const v of variants) {
        await ctx.db.insert("inventarioItems", { inventarioId, itemType: "insumo", varianteId: v._id, nome: v.nome, unidade: v.unidadeMedida || "un", saldoSistema: v.quantidade || 0, status: "pendente", createdAt: Date.now(), updatedAt: Date.now() })
      }
    }
    if (args.escopo === "produtos" || args.escopo === "completo") {
      const packagings = await ctx.db.query("productPackagings").take(500)
      for (const p of packagings) {
        await ctx.db.insert("inventarioItems", { inventarioId, itemType: "produto", productPackagingId: p._id, nome: p.nome, unidade: p.unidadeVolume || "un", saldoSistema: p.quantidade || 0, status: "pendente", createdAt: Date.now(), updatedAt: Date.now() })
      }
    }

    const total = await ctx.db.query("inventarioItems").withIndex("by_inventarioId", (q: any) => q.eq("inventarioId", inventarioId)).collect()
    await ctx.db.patch(inventarioId, { totalItens: total.length })

    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Estoque", action: "CRIAR", entity: "Inventario", entityId: inventarioId, description: `Inventario iniciado (${args.escopo})` })
    return inventarioId
  },
})

export const getInventarios = query({
  handler: async (ctx) => {
    await requireAuth(ctx)
    return await ctx.db.query("inventarios").order("desc").take(50)
  },
})

export const getInventarioItems = query({
  args: { inventarioId: v.id("inventarios") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("inventarioItems").withIndex("by_inventarioId", (q: any) => q.eq("inventarioId", args.inventarioId)).order("asc").collect()
  },
})

export const updateContagem = mutation({
  args: {
    itemId: v.id("inventarioItems"),
    quantidadeFisica: v.number(),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const item = await ctx.db.get(args.itemId)
    if (!item) throw new Error("Item nao encontrado")
    const diferenca = args.quantidadeFisica - item.saldoSistema
    await ctx.db.patch(args.itemId, { quantidadeFisica: args.quantidadeFisica, diferenca, status: "conferido", observacao: args.observacao, updatedAt: Date.now() })

    const inventario = await ctx.db.get(item.inventarioId)
    if (inventario) {
      const todos = await ctx.db.query("inventarioItems").withIndex("by_inventarioId", (q: any) => q.eq("inventarioId", item.inventarioId)).collect()
      const conferidos = todos.filter((i: any) => i.status === "conferido" || i.status === "ajustado")
      const diferencias = todos.filter((i: any) => i.diferenca && i.diferenca !== 0)
      await ctx.db.patch(item.inventarioId, { itensContados: conferidos.length, diferencias: diferencias.length, updatedAt: Date.now() })
    }
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Estoque", action: "EDITAR", entity: "Inventario", entityId: item.inventarioId, description: `Contagem atualizada` })
  },
})

export const approveInventory = mutation({
  args: { inventarioId: v.id("inventarios") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    const inventario = await ctx.db.get(args.inventarioId)
    if (!inventario || inventario.status !== "em_andamento") throw new Error("Inventario invalido")

    const items = await ctx.db.query("inventarioItems").withIndex("by_inventarioId", (q: any) => q.eq("inventarioId", args.inventarioId)).collect()
    let ajustesAplicados = 0
    for (const item of items) {
      if (item.diferenca && item.diferenca !== 0 && item.status === "conferido") {
        if (item.itemType === "insumo" && item.varianteId) {
          const variante = await ctx.db.get(item.varianteId)
          if (variante) {
            const saldoAnt = variante.quantidade || 0
            await ctx.db.patch(item.varianteId, { quantidade: item.quantidadeFisica, updatedAt: Date.now() } as any)
            await logMovement(ctx, { itemType: "insumo", insumoId: variante.insumoId, varianteId: item.varianteId, tipo: "ajuste", quantidade: Math.abs(item.diferenca), saldoAnterior: saldoAnt, saldoAtual: item.quantidadeFisica || 0, origem: "ajuste_manual", observacao: `Inventario #${args.inventarioId.slice(-6)}`, userId })
          }
        } else if (item.itemType === "produto" && item.productPackagingId) {
          const pkg = await ctx.db.get(item.productPackagingId)
          if (pkg) {
            const saldoAnt = pkg.quantidade || 0
            await ctx.db.patch(item.productPackagingId, { quantidade: item.quantidadeFisica, updatedAt: Date.now() } as any)
            await logMovement(ctx, { itemType: "produto", productId: pkg.productId, productPackagingId: item.productPackagingId, tipo: "ajuste", quantidade: Math.abs(item.diferenca), saldoAnterior: saldoAnt, saldoAtual: item.quantidadeFisica || 0, origem: "ajuste_manual", observacao: `Inventario #${args.inventarioId.slice(-6)}`, userId })
          }
        }
        await ctx.db.patch(item._id, { status: "ajustado", updatedAt: Date.now() })
        ajustesAplicados++
      }
    }

    await ctx.db.patch(args.inventarioId, { status: "aprovado", dataFim: Date.now(), aprovadoPor: userId, updatedAt: Date.now() })
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Estoque", action: "OUTRO", entity: "Inventario", entityId: args.inventarioId, description: `Inventario aprovado com ${ajustesAplicados} ajustes` })
  },
})
