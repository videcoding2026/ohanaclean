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
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first()
  if (!profile || !allowed.includes(profile.role)) {
    throw new Error("Acesso negado")
  }
  return { userId, profile }
}

export const list = query({
  args: {
    status: v.optional(v.string()),
    categoria: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.status) {
      return await ctx.db.query("suppliers")
        .withIndex("by_status", (q: any) => q.eq("status", args.status))
        .order("desc").take(200)
    }
    if (args.categoria) {
      return await ctx.db.query("suppliers")
        .withIndex("by_categoria", (q: any) => q.eq("categoria", args.categoria))
        .order("desc").take(200)
    }
    return await ctx.db.query("suppliers").order("desc").take(200)
  },
})

export const get = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.get(args.supplierId)
  },
})

export const create = mutation({
  args: {
    supplierType: v.union(v.literal("direto"), v.literal("marketplace")),
    marketplaceName: v.optional(v.string()),
    marketplaceLink: v.optional(v.string()),
    personType: v.union(v.literal("PF"), v.literal("PJ")),
    pfName: v.optional(v.string()),
    pfCpf: v.optional(v.string()),
    pfBirthDate: v.optional(v.string()),
    pjRazaoSocial: v.optional(v.string()),
    pjNomeFantasia: v.optional(v.string()),
    pjCnpj: v.optional(v.string()),
    pjInscricaoEstadual: v.optional(v.string()),
    pjInscricaoMunicipal: v.optional(v.string()),
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
    site: v.optional(v.string()),
    categoria: v.optional(v.string()),
    status: v.union(v.literal("Ativo"), v.literal("Em analise"), v.literal("Inativo")),
    motivoInativo: v.optional(v.string()),
    condPagamento: v.optional(v.string()),
    formaPagamento: v.optional(v.string()),
    prazoEntregaDias: v.optional(v.number()),
    pedidoMinQtd: v.optional(v.number()),
    pedidoMinValor: v.optional(v.number()),
    descontoPadrao: v.optional(v.number()),
    banco: v.optional(v.string()),
    agencia: v.optional(v.string()),
    conta: v.optional(v.string()),
    tipoConta: v.optional(v.string()),
    chavePix: v.optional(v.string()),
    pixType: v.optional(v.string()),
    favorecido: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    await ctx.db.insert("suppliers", { ...args, createdAt: Date.now(), updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "Fornecedores",
      action: "CRIAR",
      entity: "Fornecedor",
      description: `Fornecedor ${args.pjNomeFantasia || args.pfName || args.telefone} criado`,
    })
  },
})

export const update = mutation({
  args: {
    supplierId: v.id("suppliers"),
    supplierType: v.optional(v.union(v.literal("direto"), v.literal("marketplace"))),
    marketplaceName: v.optional(v.string()),
    marketplaceLink: v.optional(v.string()),
    personType: v.optional(v.union(v.literal("PF"), v.literal("PJ"))),
    pfName: v.optional(v.string()),
    pfCpf: v.optional(v.string()),
    pfBirthDate: v.optional(v.string()),
    pjRazaoSocial: v.optional(v.string()),
    pjNomeFantasia: v.optional(v.string()),
    pjCnpj: v.optional(v.string()),
    pjInscricaoEstadual: v.optional(v.string()),
    pjInscricaoMunicipal: v.optional(v.string()),
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
    site: v.optional(v.string()),
    categoria: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Ativo"), v.literal("Em analise"), v.literal("Inativo"))),
    motivoInativo: v.optional(v.string()),
    condPagamento: v.optional(v.string()),
    formaPagamento: v.optional(v.string()),
    prazoEntregaDias: v.optional(v.number()),
    pedidoMinQtd: v.optional(v.number()),
    pedidoMinValor: v.optional(v.number()),
    descontoPadrao: v.optional(v.number()),
    banco: v.optional(v.string()),
    agencia: v.optional(v.string()),
    conta: v.optional(v.string()),
    tipoConta: v.optional(v.string()),
    chavePix: v.optional(v.string()),
    pixType: v.optional(v.string()),
    favorecido: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Estoque"])
    const { supplierId, ...updates } = args
    await ctx.db.patch(supplierId, { ...updates, updatedAt: Date.now() } as any)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "Fornecedores",
      action: "EDITAR",
      entity: "Fornecedor",
      entityId: supplierId,
      description: "Fornecedor atualizado",
    })
  },
})

export const remove = mutation({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin"])
    await ctx.db.delete(args.supplierId)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "Fornecedores",
      action: "EXCLUIR",
      entity: "Fornecedor",
      entityId: args.supplierId,
      description: "Fornecedor removido",
    })
  },
})
