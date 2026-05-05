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
    if (args.status) {
      return await ctx.db.query("insumos").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    }
    if (args.categoria) {
      return await ctx.db.query("insumos").withIndex("by_categoria", (q: any) => q.eq("categoria", args.categoria)).order("desc").take(200)
    }
    return await ctx.db.query("insumos").order("desc").take(200)
  },
})

export const get = query({
  args: { insumoId: v.id("insumos") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.get(args.insumoId)
  },
})

export const create = mutation({
  args: {
    nome: v.string(),
    nomeTecnico: v.optional(v.string()),
    descricao: v.optional(v.string()),
    categoria: v.string(),
    unidadeCompra: v.string(),
    unidadeUso: v.string(),
    densidade: v.optional(v.number()),
    temValidade: v.optional(v.boolean()),
    dataValidade: v.optional(v.string()),
    insumoSubstitutoId: v.optional(v.id("insumos")),
    proporcaoSubstituicao: v.optional(v.number()),
    observacaoSubstituicao: v.optional(v.string()),
    status: v.union(v.literal("Ativo"), v.literal("Inativo")),
    temVariantes: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const id = await ctx.db.insert("insumos", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "CRIAR", entity: "Insumo", entityId: id, description: `Insumo ${args.nome} criado` })
    return id
  },
})

export const update = mutation({
  args: {
    insumoId: v.id("insumos"),
    nome: v.optional(v.string()),
    nomeTecnico: v.optional(v.string()),
    descricao: v.optional(v.string()),
    categoria: v.optional(v.string()),
    unidadeCompra: v.optional(v.string()),
    unidadeUso: v.optional(v.string()),
    densidade: v.optional(v.number()),
    temValidade: v.optional(v.boolean()),
    insumoSubstitutoId: v.optional(v.id("insumos")),
    proporcaoSubstituicao: v.optional(v.number()),
    observacaoSubstituicao: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Ativo"), v.literal("Inativo"))),
    dataValidade: v.optional(v.string()),
    temVariantes: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const { insumoId, ...updates } = args
    await ctx.db.patch(insumoId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "EDITAR", entity: "Insumo", entityId: insumoId, description: "Insumo atualizado" })
  },
})

export const listVariants = query({
  args: { insumoId: v.id("insumos") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("insumoVariants").withIndex("by_insumoId", (q: any) => q.eq("insumoId", args.insumoId)).collect()
  },
})

export const createVariant = mutation({
  args: {
    insumoId: v.id("insumos"),
    nome: v.string(),
    descricao: v.optional(v.string()),
    dataValidade: v.optional(v.string()),
    temValidade: v.optional(v.boolean()),
    unidadeMedida: v.optional(v.string()),
    estoqueMinimo: v.optional(v.number()),
    estoqueMaximo: v.optional(v.number()),
    localizacao: v.optional(v.string()),
    fornecedorPreferencialId: v.optional(v.string()),
    status: v.union(v.literal("Ativa"), v.literal("Inativa")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    await ctx.db.insert("insumoVariants", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "CRIAR", entity: "Variante", description: `Variante ${args.nome} criada` })
  },
})

export const updateVariant = mutation({
  args: {
    variantId: v.id("insumoVariants"),
    nome: v.optional(v.string()),
    descricao: v.optional(v.string()),
    dataValidade: v.optional(v.string()),
    temValidade: v.optional(v.boolean()),
    unidadeMedida: v.optional(v.string()),
    estoqueMinimo: v.optional(v.number()),
    estoqueMaximo: v.optional(v.number()),
    localizacao: v.optional(v.string()),
    fornecedorPreferencialId: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Ativa"), v.literal("Inativa"))),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const { variantId, ...updates } = args
    await ctx.db.patch(variantId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "EDITAR", entity: "Variante", entityId: variantId, description: "Variante atualizada" })
  },
})

export const removeVariant = mutation({
  args: { variantId: v.id("insumoVariants") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    await ctx.db.delete(args.variantId)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "EXCLUIR", entity: "Variante", description: "Variante removida" })
  },
})

export const remove = mutation({
  args: { insumoId: v.id("insumos") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    await ctx.db.delete(args.insumoId)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "EXCLUIR", entity: "Insumo", description: "Insumo removido" })
  },
})

export const updatePrecoMedio = mutation({
  args: { insumoId: v.id("insumos"), precoMedio: v.number() },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque", "Financeiro"])
    await ctx.db.patch(args.insumoId, { precoMedio: args.precoMedio, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Insumos", action: "EDITAR", entity: "Insumo", entityId: args.insumoId, description: `PMP atualizado para R$ ${args.precoMedio.toFixed(4)}` })
  },
})
