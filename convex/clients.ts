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
    if (args.status) {
      return await ctx.db.query("clients").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    }
    return await ctx.db.query("clients").order("desc").take(200)
  },
})

export const get = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.get(args.clientId)
  },
})

export const create = mutation({
  args: {
    personType: v.union(v.literal("PF"), v.literal("PJ")),
    pfName: v.optional(v.string()),
    pfCpf: v.optional(v.string()),
    pfBirthDate: v.optional(v.string()),
    pjRazaoSocial: v.optional(v.string()),
    pjNomeFantasia: v.optional(v.string()),
    pjCnpj: v.optional(v.string()),
    pjInscricaoEstadual: v.optional(v.string()),
    pjInscricaoMunicipal: v.optional(v.string()),
    clientType: v.optional(v.string()),
    segmento: v.optional(v.string()),
    origem: v.optional(v.string()),
    cep: v.optional(v.string()),
    logradouro: v.optional(v.string()),
    numero: v.optional(v.string()),
    complemento: v.optional(v.string()),
    bairro: v.optional(v.string()),
    cidade: v.optional(v.string()),
    estado: v.optional(v.string()),
    telefone: v.string(),
    whatsapp: v.optional(v.string()),
    email: v.optional(v.string()),
    melhorHorario: v.optional(v.string()),
    descontoFixo: v.optional(v.number()),
    limiteCredito: v.optional(v.number()),
    condPagamento: v.optional(v.string()),
    formaPagamento: v.optional(v.string()),
    fretePadrao: v.optional(v.string()),
    observacoes: v.optional(v.string()),
    tags: v.optional(v.string()),
    status: v.union(v.literal("Ativo"), v.literal("Inativo"), v.literal("Bloqueado")),
    motivoBloqueio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Vendas"])
    await ctx.db.insert("clients", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Clientes", action: "CRIAR", entity: "Cliente",
      description: `Cliente ${args.pjNomeFantasia || args.pfName || ""} criado`,
    })
  },
})

export const update = mutation({
  args: {
    clientId: v.id("clients"),
    personType: v.optional(v.union(v.literal("PF"), v.literal("PJ"))),
    pfName: v.optional(v.string()),
    pfCpf: v.optional(v.string()),
    pfBirthDate: v.optional(v.string()),
    pjRazaoSocial: v.optional(v.string()),
    pjNomeFantasia: v.optional(v.string()),
    pjCnpj: v.optional(v.string()),
    pjInscricaoEstadual: v.optional(v.string()),
    pjInscricaoMunicipal: v.optional(v.string()),
    clientType: v.optional(v.string()),
    segmento: v.optional(v.string()),
    origem: v.optional(v.string()),
    cep: v.optional(v.string()),
    logradouro: v.optional(v.string()),
    numero: v.optional(v.string()),
    complemento: v.optional(v.string()),
    bairro: v.optional(v.string()),
    cidade: v.optional(v.string()),
    estado: v.optional(v.string()),
    telefone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    email: v.optional(v.string()),
    melhorHorario: v.optional(v.string()),
    descontoFixo: v.optional(v.number()),
    limiteCredito: v.optional(v.number()),
    condPagamento: v.optional(v.string()),
    formaPagamento: v.optional(v.string()),
    fretePadrao: v.optional(v.string()),
    observacoes: v.optional(v.string()),
    tags: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Ativo"), v.literal("Inativo"), v.literal("Bloqueado"))),
    motivoBloqueio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Vendas"])
    const { clientId, ...updates } = args
    await ctx.db.patch(clientId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Clientes", action: "EDITAR", entity: "Cliente", entityId: clientId,
      description: "Cliente atualizado",
    })
  },
})

export const remove = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    await ctx.db.delete(args.clientId)
    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Clientes", action: "EXCLUIR", entity: "Cliente",
      description: "Cliente removido",
    })
  },
})
