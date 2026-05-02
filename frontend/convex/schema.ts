import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema(
  {
    ...authTables,

    companies: defineTable({
      type: v.optional(v.union(v.literal("PF"), v.literal("PJ"))),
      // PF fields
      pfName: v.optional(v.string()),
      pfCpf: v.optional(v.string()),
      pfBirthDate: v.optional(v.string()),
      // PJ fields
      pjRazaoSocial: v.optional(v.string()),
      pjNomeFantasia: v.optional(v.string()),
      pjCnpj: v.optional(v.string()),
      pjInscricaoEstadual: v.optional(v.string()),
      pjInscricaoMunicipal: v.optional(v.string()),
      pjDataFundacao: v.optional(v.string()),
      // Endereco
      cep: v.optional(v.string()),
      logradouro: v.optional(v.string()),
      numero: v.optional(v.string()),
      complemento: v.optional(v.string()),
      bairro: v.optional(v.string()),
      cidade: v.optional(v.string()),
      estado: v.optional(v.string()),
      pais: v.optional(v.string()),
      // Contatos
      telefone: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      email: v.optional(v.string()),
      site: v.optional(v.string()),
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      // Logo
      logoStorageId: v.optional(v.id("_storage")),

      // Documentos (Aba 02)
      pdfHeaderTemplate: v.optional(v.string()),
      pdfFooterText: v.optional(v.string()),
      // Prefixos de numeracao
      prefixoPedido: v.optional(v.string()),
      prefixoVenda: v.optional(v.string()),
      prefixoProducao: v.optional(v.string()),
      prefixoCompra: v.optional(v.string()),
      prefixoRecibo: v.optional(v.string()),
      prefixoOrcamento: v.optional(v.string()),

      // Parametros (Aba 03)
      // Estoque
      metodoCusto: v.optional(v.string()),
      estoqueNegativoInsumos: v.optional(v.boolean()),
      estoqueNegativoProdutoFinal: v.optional(v.boolean()),
      // Vendas
      permitirVendaSemEstoque: v.optional(v.boolean()),
      notificarProducaoSemEstoque: v.optional(v.boolean()),
      // Financeiro
      moeda: v.optional(v.string()),
      casasDecimaisValores: v.optional(v.number()),
      casasDecimaisQuantidades: v.optional(v.number()),

      // Alertas (Aba 04)
      alertsEnabled: v.optional(v.boolean()),
      alertsEmailEnabled: v.optional(v.boolean()),
      // Scores (Aba 05)
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

      updatedAt: v.number(),
      createdAt: v.optional(v.number()),
    }),

    userProfiles: defineTable({
      userId: v.id("users"),
      fullName: v.string(),
      phone: v.optional(v.string()),
      photoStorageId: v.optional(v.id("_storage")),
      role: v.union(
        v.literal("Admin"),
        v.literal("Producao"),
        v.literal("Estoque"),
        v.literal("Vendas"),
        v.literal("Financeiro"),
        v.literal("Visualizador")
      ),
      position: v.optional(v.string()),
      admissionDate: v.optional(v.string()),
      status: v.union(v.literal("Ativo"), v.literal("Inativo")),
      sessionTimeoutMinutes: v.optional(v.number()),
      twoFactorEnabled: v.optional(v.boolean()),
      failedLoginAttempts: v.optional(v.number()),
      blockedUntil: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_status", ["status"])
      .index("by_role", ["role"]),

    auditLogs: defineTable({
      userId: v.optional(v.id("users")),
      userName: v.optional(v.string()),
      timestamp: v.number(),
      ip: v.optional(v.string()),
      module: v.string(),
      action: v.union(
        v.literal("CRIAR"),
        v.literal("EDITAR"),
        v.literal("EXCLUIR"),
        v.literal("LOGIN"),
        v.literal("LOGOUT"),
        v.literal("BLOQUEIO"),
        v.literal("DESBLOQUEIO"),
        v.literal("OUTRO")
      ),
      entity: v.string(),
      entityId: v.optional(v.string()),
      description: v.string(),
      detailsBefore: v.optional(v.string()),
      detailsAfter: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_module", ["module"])
      .index("by_action", ["action"])
      .index("by_timestamp", ["timestamp"]),
  },
  { schemaValidation: true }
)
