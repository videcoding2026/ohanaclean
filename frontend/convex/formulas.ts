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
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.status) return await ctx.db.query("formulas").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    return await ctx.db.query("formulas").order("desc").take(200)
  },
})

export const get = query({
  args: { formulaId: v.id("formulas") },
  handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.get(args.formulaId) },
})

export const create = mutation({
  args: {
    nome: v.string(), productId: v.id("products"), descricao: v.optional(v.string()),
    rendimento: v.optional(v.number()), unidade: v.optional(v.string()), tempoEstimado: v.optional(v.string()),
    temCQ: v.optional(v.boolean()), status: v.union(v.literal("Ativa"), v.literal("Em teste"), v.literal("Inativa")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const id = await ctx.db.insert("formulas", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Formulas", action: "CRIAR", entity: "Formula", entityId: id, description: `Formula ${args.nome} criada` })
    return id
  },
})

export const update = mutation({
  args: {
    formulaId: v.id("formulas"), nome: v.optional(v.string()),
    productId: v.optional(v.id("products")), descricao: v.optional(v.string()),
    rendimento: v.optional(v.number()), unidade: v.optional(v.string()), tempoEstimado: v.optional(v.string()),
    temCQ: v.optional(v.boolean()), status: v.optional(v.union(v.literal("Ativa"), v.literal("Em teste"), v.literal("Inativa"))),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const { formulaId, ...updates } = args
    await ctx.db.patch(formulaId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Formulas", action: "EDITAR", entity: "Formula", entityId: formulaId, description: "Formula atualizada" })
  },
})

export const remove = mutation({
  args: { formulaId: v.id("formulas") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    const ingredients = await ctx.db.query("formulaIngredients").withIndex("by_formulaId", (q: any) => q.eq("formulaId", args.formulaId)).collect()
    for (const ing of ingredients) await ctx.db.delete(ing._id)
    await ctx.db.delete(args.formulaId)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Formulas", action: "EXCLUIR", entity: "Formula", entityId: args.formulaId, description: "Formula removida" })
  },
})

export const listIngredients = query({
  args: { formulaId: v.id("formulas") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.query("formulaIngredients").withIndex("by_formulaId", (q: any) => q.eq("formulaId", args.formulaId)).order("asc").collect()
  },
})

export const addIngredient = mutation({
  args: {
    formulaId: v.id("formulas"), ordem: v.number(), insumoId: v.id("insumos"),
    varianteId: v.optional(v.id("insumoVariants")), quantidade: v.number(), unidade: v.optional(v.string()),
    temperatura: v.optional(v.string()), tempoMistura: v.optional(v.string()), observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const id = await ctx.db.insert("formulaIngredients", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Formulas", action: "CRIAR", entity: "Ingrediente", entityId: id, description: "Ingrediente adicionado a formula" })
  },
})

export const updateIngredient = mutation({
  args: {
    ingredientId: v.id("formulaIngredients"), ordem: v.optional(v.number()),
    quantidade: v.optional(v.number()), unidade: v.optional(v.string()),
    varianteId: v.optional(v.id("insumoVariants")),
    temperatura: v.optional(v.string()), tempoMistura: v.optional(v.string()), observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    const { ingredientId, ...updates } = args
    await ctx.db.patch(ingredientId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Formulas", action: "EDITAR", entity: "Ingrediente", description: "Ingrediente atualizado" })
  },
})

export const removeIngredient = mutation({
  args: { ingredientId: v.id("formulaIngredients") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Producao"])
    await ctx.db.delete(args.ingredientId)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Formulas", action: "EXCLUIR", entity: "Ingrediente", description: "Ingrediente removido" })
  },
})
