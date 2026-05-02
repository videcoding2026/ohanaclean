import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import type { MutationCtx } from "./_generated/server"

async function requireAdmin(ctx: MutationCtx) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error("Not authenticated")
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first()
  if (!profile || profile.role !== "Admin") {
    throw new Error("Apenas Admin pode realizar esta operacao")
  }
  return { userId, profile }
}

async function upsertCompany(ctx: MutationCtx, data: Record<string, unknown>) {
  const existing = await ctx.db.query("companies").first()
  const merged = { ...data, updatedAt: Date.now() }
  if (existing) {
    await ctx.db.patch(existing._id, merged)
  } else {
    await ctx.db.insert("companies", { ...merged, createdAt: Date.now() } as any)
  }
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    const company = await ctx.db.query("companies").first()
    return company
  },
})

export const save = mutation({
  args: {
    type: v.optional(v.union(v.literal("PF"), v.literal("PJ"))),
    pfName: v.optional(v.string()),
    pfCpf: v.optional(v.string()),
    pfBirthDate: v.optional(v.string()),
    pjRazaoSocial: v.optional(v.string()),
    pjNomeFantasia: v.optional(v.string()),
    pjCnpj: v.optional(v.string()),
    pjInscricaoEstadual: v.optional(v.string()),
    pjInscricaoMunicipal: v.optional(v.string()),
    pjDataFundacao: v.optional(v.string()),
    cep: v.optional(v.string()),
    logradouro: v.optional(v.string()),
    numero: v.optional(v.string()),
    complemento: v.optional(v.string()),
    bairro: v.optional(v.string()),
    cidade: v.optional(v.string()),
    estado: v.optional(v.string()),
    pais: v.optional(v.string()),
    telefone: v.string(),
    whatsapp: v.optional(v.string()),
    email: v.string(),
    site: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx)
    await upsertCompany(ctx, args)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "ConfigEmpresa",
      action: "EDITAR",
      entity: "Empresa",
      description: "Dados cadastrais da empresa atualizados",
    })
  },
})

export const saveParams = mutation({
  args: {
    metodoCusto: v.optional(v.string()),
    estoqueNegativoInsumos: v.optional(v.boolean()),
    estoqueNegativoProdutoFinal: v.optional(v.boolean()),
    permitirVendaSemEstoque: v.optional(v.boolean()),
    notificarProducaoSemEstoque: v.optional(v.boolean()),
    moeda: v.optional(v.string()),
    casasDecimaisValores: v.optional(v.number()),
    casasDecimaisQuantidades: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx)
    await upsertCompany(ctx, args)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "ConfigEmpresa",
      action: "EDITAR",
      entity: "Parametros",
      description: "Parametros da empresa atualizados",
    })
  },
})

export const saveDocuments = mutation({
  args: {
    pdfHeaderTemplate: v.optional(v.string()),
    pdfFooterText: v.optional(v.string()),
    prefixoPedido: v.optional(v.string()),
    prefixoVenda: v.optional(v.string()),
    prefixoProducao: v.optional(v.string()),
    prefixoCompra: v.optional(v.string()),
    prefixoRecibo: v.optional(v.string()),
    prefixoOrcamento: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx)
    await upsertCompany(ctx, args)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "ConfigEmpresa",
      action: "EDITAR",
      entity: "Documentos",
      description: "Configuracoes de documentos atualizadas",
    })
  },
})

export const saveAlerts = mutation({
  args: {
    alertsEnabled: v.optional(v.boolean()),
    alertsEmailEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx)
    await upsertCompany(ctx, args)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "ConfigEmpresa",
      action: "EDITAR",
      entity: "Alertas",
      description: "Configuracoes de alertas atualizadas",
    })
  },
})

export const saveScore = mutation({
  args: {
    scoreCrit1Weight: v.optional(v.number()),
    scoreCrit1RangeAValue: v.optional(v.number()),
    scoreCrit1RangeAPoints: v.optional(v.number()),
    scoreCrit1RangeBMin: v.optional(v.number()),
    scoreCrit1RangeBMax: v.optional(v.number()),
    scoreCrit1RangeBPoints: v.optional(v.number()),
    scoreCrit1RangeCValue: v.optional(v.number()),
    scoreCrit1RangeCPoints: v.optional(v.number()),
    scoreCrit2Weight: v.optional(v.number()),
    scoreCrit2HighCount: v.optional(v.number()),
    scoreCrit2HighPoints: v.optional(v.number()),
    scoreCrit2MedCount: v.optional(v.number()),
    scoreCrit2MedPoints: v.optional(v.number()),
    scoreCrit2LowCount: v.optional(v.number()),
    scoreCrit2LowPoints: v.optional(v.number()),
    scoreCrit3Weight: v.optional(v.number()),
    scoreCrit3OndayPoints: v.optional(v.number()),
    scoreCrit3DelayUpToDays: v.optional(v.number()),
    scoreCrit3DelayUpToPoints: v.optional(v.number()),
    scoreCrit3DelayOverDays: v.optional(v.number()),
    scoreCrit3DelayOverPoints: v.optional(v.number()),
    scoreLevel1Name: v.optional(v.string()),
    scoreLevel1Min: v.optional(v.number()),
    scoreLevel1Max: v.optional(v.number()),
    scoreLevel1Benefit: v.optional(v.string()),
    scoreLevel2Name: v.optional(v.string()),
    scoreLevel2Min: v.optional(v.number()),
    scoreLevel2Max: v.optional(v.number()),
    scoreLevel2Benefit: v.optional(v.string()),
    scoreLevel3Name: v.optional(v.string()),
    scoreLevel3Min: v.optional(v.number()),
    scoreLevel3Max: v.optional(v.number()),
    scoreLevel3Benefit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx)
    await upsertCompany(ctx, args)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "ConfigEmpresa",
      action: "EDITAR",
      entity: "Score",
      description: "Criterios de score de clientes atualizados",
    })
  },
})

export const saveLogo = mutation({
  args: { logoStorageId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx)
    await upsertCompany(ctx, { logoStorageId: args.logoStorageId })
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "ConfigEmpresa",
      action: "EDITAR",
      entity: "Logo",
      description: "Logotipo da empresa atualizado",
    })
  },
})
