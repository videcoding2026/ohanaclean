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
  args: { status: v.optional(v.string()), categoria: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.status) return await ctx.db.query("products").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    if (args.categoria) return await ctx.db.query("products").withIndex("by_categoria", (q: any) => q.eq("categoria", args.categoria)).order("desc").take(200)
    return await ctx.db.query("products").order("desc").take(200)
  },
})

export const get = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.get(args.productId) },
})

export const create = mutation({
  args: {
    nome: v.string(),
    descricao: v.optional(v.string()),
    categoria: v.string(),
    status: v.union(v.literal("Ativo"), v.literal("Em desenvolvimento"), v.literal("Inativo")),
    modoUso: v.optional(v.string()),
    precaucoes: v.optional(v.string()),
    composicao: v.optional(v.string()),
    ph: v.optional(v.string()),
    corAspecto: v.optional(v.string()),
    fragrancia: v.optional(v.string()),
    temperaturaIdeal: v.optional(v.string()),
    localArmazenagem: v.optional(v.string()),
    validadeMedia: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const id = await ctx.db.insert("products", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Produtos", action: "CRIAR", entity: "Produto", description: `Produto ${args.nome} criado` })
    return id
  },
})

export const update = mutation({
  args: {
    productId: v.id("products"),
    nome: v.optional(v.string()),
    descricao: v.optional(v.string()),
    categoria: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Ativo"), v.literal("Em desenvolvimento"), v.literal("Inativo"))),
    modoUso: v.optional(v.string()),
    precaucoes: v.optional(v.string()),
    composicao: v.optional(v.string()),
    ph: v.optional(v.string()),
    corAspecto: v.optional(v.string()),
    fragrancia: v.optional(v.string()),
    temperaturaIdeal: v.optional(v.string()),
    localArmazenagem: v.optional(v.string()),
    validadeMedia: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const { productId, ...updates } = args
    await ctx.db.patch(productId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Produtos", action: "EDITAR", entity: "Produto", description: "Produto atualizado" })
  },
})

export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    await ctx.db.delete(args.productId)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Produtos", action: "EXCLUIR", entity: "Produto", description: "Produto removido" })
  },
})

export const listPackagings = query({
  args: { productId: v.optional(v.id("products")) },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.productId) return await ctx.db.query("productPackagings").withIndex("by_productId", (q: any) => q.eq("productId", args.productId)).collect()
    return []
  },
})

export const createPackaging = mutation({
  args: {
    productId: v.id("products"),
    nome: v.string(),
    volume: v.optional(v.number()),
    unidadeVolume: v.optional(v.string()),
    tipo: v.optional(v.string()),
    codigoBarras: v.optional(v.string()),
    custoEmbalagem: v.optional(v.number()),
    margem: v.optional(v.number()),
    precoSugerido: v.optional(v.number()),
    precoVenda: v.optional(v.number()),
    status: v.union(v.literal("Ativa"), v.literal("Inativa")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    await ctx.db.insert("productPackagings", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Produtos", action: "CRIAR", entity: "Embalagem", description: `Embalagem ${args.nome} criada` })
  },
})

export const updatePackaging = mutation({
  args: {
    packagingId: v.id("productPackagings"),
    nome: v.optional(v.string()),
    volume: v.optional(v.number()),
    unidadeVolume: v.optional(v.string()),
    tipo: v.optional(v.string()),
    codigoBarras: v.optional(v.string()),
    custoEmbalagem: v.optional(v.number()),
    margem: v.optional(v.number()),
    precoSugerido: v.optional(v.number()),
    precoVenda: v.optional(v.number()),
    status: v.optional(v.union(v.literal("Ativa"), v.literal("Inativa"))),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const { packagingId, ...updates } = args
    await ctx.db.patch(packagingId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Produtos", action: "EDITAR", entity: "Embalagem", description: "Embalagem atualizada" })
  },
})

export const removePackaging = mutation({
  args: { packagingId: v.id("productPackagings") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    await ctx.db.delete(args.packagingId)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Produtos", action: "EXCLUIR", entity: "Embalagem", description: "Embalagem removida" })
  },
})
