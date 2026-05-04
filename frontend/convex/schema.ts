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
      logoBase64: v.optional(v.string()),

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

    suppliers: defineTable({
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
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_categoria", ["categoria"]),

    clients: defineTable({
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
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"]),

    insumos: defineTable({
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
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_categoria", ["categoria"]),

    insumoVariants: defineTable({
      insumoId: v.id("insumos"),
      nome: v.string(),
      descricao: v.optional(v.string()),
      dataValidade: v.optional(v.string()),
      temValidade: v.optional(v.boolean()),
      unidadeMedida: v.optional(v.string()),
      estoqueMinimo: v.optional(v.number()),
      estoqueMaximo: v.optional(v.number()),
      quantidade: v.optional(v.number()),
      reservado: v.optional(v.number()),
      localizacao: v.optional(v.string()),
      fornecedorPreferencialId: v.optional(v.string()),
      precoMedio: v.optional(v.number()),
      status: v.union(v.literal("Ativa"), v.literal("Inativa")),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_insumoId", ["insumoId"])
      .index("by_status", ["status"]),

    products: defineTable({
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
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_categoria", ["categoria"]),

    productPackagings: defineTable({
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
      quantidade: v.optional(v.number()),
      quantidadeMinima: v.optional(v.number()),
      quantidadeMaxima: v.optional(v.number()),
      localizacao: v.optional(v.string()),
      status: v.union(v.literal("Ativa"), v.literal("Inativa")),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_productId", ["productId"]),

    formulas: defineTable({
      nome: v.string(),
      productId: v.id("products"),
      descricao: v.optional(v.string()),
      rendimento: v.optional(v.number()),
      unidade: v.optional(v.string()),
      tempoEstimado: v.optional(v.string()),
      temCQ: v.optional(v.boolean()),
      status: v.union(v.literal("Ativa"), v.literal("Em teste"), v.literal("Inativa")),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_productId", ["productId"])
      .index("by_status", ["status"]),

    formulaIngredients: defineTable({
      formulaId: v.id("formulas"),
      ordem: v.number(),
      insumoId: v.id("insumos"),
      varianteId: v.optional(v.id("insumoVariants")),
      quantidade: v.number(),
      unidade: v.optional(v.string()),
      temperatura: v.optional(v.string()),
      tempoMistura: v.optional(v.string()),
      observacao: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_formulaId", ["formulaId"]),

    purchases: defineTable({
      numero: v.optional(v.string()),
      fornecedorId: v.optional(v.id("suppliers")),
      tipo: v.optional(v.union(v.literal("direto"), v.literal("marketplace"))),
      numeroNota: v.optional(v.string()),
      dataCompra: v.number(),
      tipoPagamento: v.optional(v.string()),
      condPagamento: v.optional(v.string()),
      freteGratis: v.optional(v.boolean()),
      frete: v.optional(v.number()),
      comprovanteStorageId: v.optional(v.id("_storage")),
      codigoRastreio: v.optional(v.string()),
      motivoCancelamento: v.optional(v.string()),
      observacoes: v.optional(v.string()),
      dataPagamento: v.optional(v.number()),
      comprovantePagamentoId: v.optional(v.id("_storage")),
      observacaoPagamento: v.optional(v.string()),
      status: v.union(
        v.literal("Rascunho"),
        v.literal("Pedida"),
        v.literal("Aguardando Pagamento"),
        v.literal("Em transito"),
        v.literal("Recebida"),
        v.literal("Recebida parcialmente"),
        v.literal("Cancelada"),
        v.literal("Devolvida")
      ),
      dataRecebimento: v.optional(v.number()),
      observacaoRecebimento: v.optional(v.string()),
      total: v.optional(v.number()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_fornecedorId", ["fornecedorId"])
      .index("by_numero", ["numero"]),

    purchaseItems: defineTable({
      purchaseId: v.id("purchases"),
      insumoId: v.id("insumos"),
      varianteId: v.optional(v.id("insumoVariants")),
      quantidade: v.number(),
      quantidadeRecebida: v.optional(v.number()),
      unidade: v.optional(v.string()),
      precoUnitario: v.number(),
      subtotal: v.number(),
      freteProporcional: v.optional(v.number()),
      custoRealUnitario: v.optional(v.number()),
      numeroLote: v.optional(v.string()),
      dataValidade: v.optional(v.string()),
      statusRecebimento: v.optional(v.union(v.literal("pendente"), v.literal("recebido"), v.literal("devolvido"))),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_purchaseId", ["purchaseId"]),

    purchaseHistories: defineTable({
      purchaseId: v.id("purchases"),
      statusAnterior: v.string(),
      statusNovo: v.string(),
      data: v.number(),
      usuarioId: v.id("users"),
      usuarioNome: v.string(),
      observacao: v.optional(v.string()),
      automatico: v.optional(v.boolean()),
    })
      .index("by_purchaseId", ["purchaseId"])
      .index("by_data", ["data"]),

    purchaseReturns: defineTable({
      purchaseId: v.id("purchases"),
      itemId: v.id("purchaseItems"),
      varianteId: v.optional(v.id("insumoVariants")),
      varianteNome: v.optional(v.string()),
      quantidade: v.number(),
      motivo: v.string(),
      resolucao: v.union(v.literal("Reenvio"), v.literal("Credito"), v.literal("Estorno")),
      data: v.number(),
      observacao: v.optional(v.string()),
      usuarioId: v.id("users"),
      createdAt: v.number(),
    })
      .index("by_purchaseId", ["purchaseId"]),

    contasPagar: defineTable({
      purchaseId: v.optional(v.id("purchases")),
      fornecedorId: v.optional(v.id("suppliers")),
      fornecedorNome: v.optional(v.string()),
      descricao: v.string(),
      valor: v.number(),
      dataVencimento: v.number(),
      dataPagamento: v.optional(v.number()),
      formaPagamento: v.optional(v.string()),
      status: v.union(v.literal("Aberta"), v.literal("Vencida"), v.literal("Paga"), v.literal("Parcial"), v.literal("Cancelada")),
      parcela: v.optional(v.string()),
      comprovanteStorageId: v.optional(v.id("_storage")),
      observacao: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_purchaseId", ["purchaseId"])
      .index("by_status", ["status"])
      .index("by_dataVencimento", ["dataVencimento"]),

    stockMovements: defineTable({
      itemType: v.union(v.literal("insumo"), v.literal("produto")),
      insumoId: v.optional(v.id("insumos")),
      varianteId: v.optional(v.id("insumoVariants")),
      productId: v.optional(v.id("products")),
      productPackagingId: v.optional(v.id("productPackagings")),
      tipo: v.union(v.literal("entrada"), v.literal("saida"), v.literal("ajuste"), v.literal("transferencia")),
      quantidade: v.number(),
      saldoAnterior: v.number(),
      saldoAtual: v.number(),
      origem: v.optional(v.union(v.literal("compra"), v.literal("devolucao"), v.literal("producao"), v.literal("venda"), v.literal("descarte"), v.literal("ajuste_manual"), v.literal("fracionamento"), v.literal("amostra"))),
      referenciaId: v.optional(v.string()),
      localOrigem: v.optional(v.string()),
      localDestino: v.optional(v.string()),
      observacao: v.optional(v.string()),
      userId: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_insumoId", ["insumoId"])
      .index("by_varianteId", ["varianteId"])
      .index("by_productId", ["productId"])
      .index("by_productPackagingId", ["productPackagingId"])
      .index("by_itemType", ["itemType"])
      .index("by_tipo", ["tipo"])
      .index("by_origem", ["origem"]),

    inventarios: defineTable({
      escopo: v.union(v.literal("completo"), v.literal("insumos"), v.literal("produtos")),
      status: v.union(v.literal("em_andamento"), v.literal("conferencia"), v.literal("aprovado")),
      dataInicio: v.number(),
      dataFim: v.optional(v.number()),
      aprovadoPor: v.optional(v.string()),
      totalItens: v.optional(v.number()),
      itensContados: v.optional(v.number()),
      diferencias: v.optional(v.number()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"]),

    inventarioItems: defineTable({
      inventarioId: v.id("inventarios"),
      itemType: v.union(v.literal("insumo"), v.literal("produto")),
      varianteId: v.optional(v.id("insumoVariants")),
      productPackagingId: v.optional(v.id("productPackagings")),
      nome: v.optional(v.string()),
      unidade: v.optional(v.string()),
      saldoSistema: v.number(),
      quantidadeFisica: v.optional(v.number()),
      diferenca: v.optional(v.number()),
      status: v.union(v.literal("pendente"), v.literal("conferido"), v.literal("ajustado")),
      observacao: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_inventarioId", ["inventarioId"]),

    productionOrders: defineTable({
      numero: v.optional(v.string()),
      productId: v.id("products"),
      formulaId: v.id("formulas"),
      quantidadePlanejada: v.number(),
      quantidadeProduzida: v.optional(v.number()),
      dataPrevista: v.optional(v.number()),
      dataInicio: v.optional(v.number()),
      dataConclusao: v.optional(v.number()),
      responsavelId: v.optional(v.string()),
      responsavelNome: v.optional(v.string()),
      status: v.union(v.literal("Planejada"), v.literal("Em andamento"), v.literal("Concluida"), v.literal("Cancelada"), v.literal("Quarentena")),
      observacoes: v.optional(v.string()),
      rendimento: v.optional(v.number()),
      custoTotal: v.optional(v.number()),
      custoUnitario: v.optional(v.number()),
      lote: v.optional(v.string()),
      dataFabricacao: v.optional(v.number()),
      dataValidade: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_productId", ["productId"])
      .index("by_numero", ["numero"]),

    productionItems: defineTable({
      productionOrderId: v.id("productionOrders"),
      insumoId: v.id("insumos"),
      varianteId: v.optional(v.id("insumoVariants")),
      varianteSubstitutaId: v.optional(v.id("insumoVariants")),
      proporcaoSubstituicao: v.optional(v.number()),
      quantidadePrevista: v.number(),
      quantidadeReal: v.optional(v.number()),
      justificativa: v.optional(v.string()),
      ordem: v.number(),
      checked: v.optional(v.boolean()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_productionOrderId", ["productionOrderId"]),

    productionLogs: defineTable({
      productionOrderId: v.id("productionOrders"),
      lote: v.optional(v.string()),
      dataFabricacao: v.optional(v.number()),
      dataValidade: v.optional(v.string()),
      quantidade: v.number(),
      productPackagingId: v.optional(v.id("productPackagings")),
      status: v.union(v.literal("aprovado"), v.literal("quarentena"), v.literal("descartado"), v.literal("reprocessado")),
      observacao: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_productionOrderId", ["productionOrderId"])
      .index("by_lote", ["lote"]),
  },
  { schemaValidation: true }
)
