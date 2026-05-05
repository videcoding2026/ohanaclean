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

export const list = query({
  handler: async (ctx) => { await requireAuth(ctx); return await ctx.db.query("priceTables").order("desc").take(50) },
})

export const get = query({
  args: { tableId: v.id("priceTables") },
  handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.get(args.tableId) },
})

export const getItems = query({
  args: { tableId: v.id("priceTables") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("priceTableItems").withIndex("by_tableId", (q: any) => q.eq("tableId", args.tableId)).order("asc").collect()
  },
})

export const getClients = query({
  args: { tableId: v.id("priceTables") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("priceTableClients").withIndex("by_tableId", (q: any) => q.eq("tableId", args.tableId)).order("asc").collect()
  },
})

export const getHistory = query({
  args: { tableId: v.id("priceTables") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("priceHistories").withIndex("by_tableId", (q: any) => q.eq("tableId", args.tableId)).order("desc").take(100)
  },
})

export const create = mutation({
  args: {
    nome: v.string(), descricao: v.optional(v.string()),
    baseTableId: v.optional(v.id("priceTables")), baseAdjustment: v.optional(v.number()),
    validFrom: v.optional(v.number()), validTo: v.optional(v.number()),
    discountMax: v.optional(v.number()), marginMin: v.optional(v.number()),
    tipoCliente: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Vendas"])
    const tables = await ctx.db.query("priceTables").take(100)
    const codigo = `TAB-${String(tables.length + 1).padStart(3, "0")}`
    const tableId = await ctx.db.insert("priceTables", { ...args, codigo, status: "Ativa", createdAt: Date.now(), updatedAt: Date.now() })

    // Se baseada em outra tabela, copiar os preços com ajuste
    if (args.baseTableId) {
      const baseItems = await ctx.db.query("priceTableItems").withIndex("by_tableId", (q: any) => q.eq("tableId", args.baseTableId)).collect()
      const adjustment = (args.baseAdjustment || 0) / 100
      for (const item of baseItems) {
        const preco = item.precoVenda * (1 + adjustment)
        await ctx.db.insert("priceTableItems", { tableId, productPackagingId: item.productPackagingId, precoVenda: Math.round(preco * 100) / 100, margem: item.margem, custoUnitario: item.custoUnitario, createdAt: Date.now(), updatedAt: Date.now() })
      }
    }

    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Precos", action: "CRIAR", entity: "TabelaPreco", entityId: tableId, description: `Tabela ${codigo} criada` })
    return tableId
  },
})

export const update = mutation({
  args: {
    tableId: v.id("priceTables"), nome: v.string(), descricao: v.optional(v.string()),
    validFrom: v.optional(v.number()), validTo: v.optional(v.number()),
    discountMax: v.optional(v.number()), marginMin: v.optional(v.number()),
    status: v.union(v.literal("Ativa"), v.literal("Inativa")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Vendas"])
    const { tableId, ...updates } = args
    await ctx.db.patch(tableId, { ...updates, updatedAt: Date.now() })
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Precos", action: "EDITAR", entity: "TabelaPreco", entityId: tableId, description: "Tabela atualizada" })
  },
})

export const addItem = mutation({
  args: { tableId: v.id("priceTables"), productPackagingId: v.id("productPackagings"), precoVenda: v.number(), margem: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = (await requireRole(ctx, ["Admin", "Vendas"])).userId
    const pkg = await ctx.db.get(args.productPackagingId)
    const custo = pkg?.custoEmbalagem || 0
    const exists = await ctx.db.query("priceTableItems").withIndex("by_tableId", (q: any) => q.eq("tableId", args.tableId)).filter((q: any) => q.eq(q.field("productPackagingId"), args.productPackagingId)).first()
    if (exists) throw new Error("Produto ja existe nesta tabela")
    await ctx.db.insert("priceTableItems", { tableId: args.tableId, productPackagingId: args.productPackagingId, precoVenda: args.precoVenda, margem: args.margem, custoUnitario: custo, createdAt: Date.now(), updatedAt: Date.now() })
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Precos", action: "CRIAR", entity: "PrecoItem", entityId: args.tableId, description: "Item adicionado a tabela" })
  },
})

export const removeItem = mutation({
  args: { itemId: v.id("priceTableItems") },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["Admin", "Vendas"])
    await ctx.db.delete(args.itemId)
  },
})

export const assignClient = mutation({
  args: { tableId: v.id("priceTables"), clientId: v.id("clients") },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["Admin", "Vendas"])
    const exists = await ctx.db.query("priceTableClients").withIndex("by_tableId", (q: any) => q.eq("tableId", args.tableId)).filter((q: any) => q.eq(q.field("clientId"), args.clientId)).first()
    if (exists) throw new Error("Cliente ja vinculado")
    await ctx.db.insert("priceTableClients", { tableId: args.tableId, clientId: args.clientId, createdAt: Date.now(), updatedAt: Date.now() })
  },
})

export const removeClient = mutation({
  args: { linkId: v.id("priceTableClients") },
  handler: async (ctx, args) => { await requireRole(ctx, ["Admin", "Vendas"]); await ctx.db.delete(args.linkId) },
})

export const batchAdjust = mutation({
  args: {
    tableId: v.id("priceTables"), tipo: v.union(v.literal("percentual"), v.literal("fixo")),
    valor: v.number(), motivo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Vendas"])
    const items = await ctx.db.query("priceTableItems").withIndex("by_tableId", (q: any) => q.eq("tableId", args.tableId)).collect()
    for (const item of items) {
      const precoAnterior = item.precoVenda
      const precoNovo = args.tipo === "percentual" ? precoAnterior * (1 + args.valor / 100) : args.tipo === "fixo" ? precoAnterior + args.valor : precoAnterior
      await ctx.db.patch(item._id, { precoVenda: Math.round(Math.max(0, precoNovo) * 100) / 100, updatedAt: Date.now() })
      await ctx.db.insert("priceHistories", { tableId: args.tableId, productPackagingId: item.productPackagingId, precoAnterior, precoNovo: Math.round(Math.max(0, precoNovo) * 100) / 100, userId, userName: profile.fullName, motivo: args.motivo, createdAt: Date.now() })
    }
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Precos", action: "EDITAR", entity: "TabelaPreco", entityId: args.tableId, description: `Reajuste ${args.tipo} ${args.valor}${args.tipo === "percentual" ? "%" : " R$"}` })
  },
})

export const getClientTable = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const link = await ctx.db.query("priceTableClients").withIndex("by_clientId", (q: any) => q.eq("clientId", args.clientId)).first()
    if (!link) return null
    const table = await ctx.db.get(link.tableId)
    if (!table || table.status !== "Ativa") return null
    const items = await ctx.db.query("priceTableItems").withIndex("by_tableId", (q: any) => q.eq("tableId", table._id)).collect()
    return { table, items }
  },
})
