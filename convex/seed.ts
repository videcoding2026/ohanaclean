/**
 * SEED DE DADOS FICTÍCIOS PARA TESTES DE DESENVOLVIMENTO
 * 
 * ⚠️ TODOS OS DADOS INSERIDOS POR ESTA FUNÇÃO SÃO FICTÍCIOS.
 * Nenhum dado real de fornecedores, clientes ou produtos está presente.
 * 
 * Para executar: chamar a mutation "seed.run" pelo Convex Dashboard
 * ou adicionar um botão "Popular Dados" no frontend.
 * 
 * A seed é idempotente: se já existirem dados de teste, ela pula a inserção.
 */

import { mutation, internalMutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

async function requireAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error("Not authenticated")
  const profile = await ctx.db.query("userProfiles").withIndex("by_userId", (q: any) => q.eq("userId", userId)).first()
  if (!profile || profile.role !== "Admin") throw new Error("Apenas Admin pode executar seed")
  return { userId, profile }
}

export const run = mutation({
  handler: async (ctx) => {
    const { userId, profile } = await requireAdmin(ctx)
    
    // Verifica se já existe seed (idempotente)
    const existe = await ctx.db.query("auditLogs").withIndex("by_module", (q: any) => q.eq("module", "SEED")).first()
    if (existe) throw new Error("Dados de teste ja foram inseridos. Delete os dados existentes primeiro.")
    
    const descricao = "DADOS FICTICIOS PARA TESTES DE DESENVOLVIMENTO"
    const now = Date.now()

    // =====================================================
    // FORNECEDORES
    // =====================================================
    const forn1 = await ctx.db.insert("suppliers", {
      supplierType: "direto", personType: "PJ",
      pjRazaoSocial: "Quimflex Industria Quimica Ltda (TESTE)",
      pjNomeFantasia: "Quimflex (TESTE)",
      pjCnpj: "00000000000000", pjInscricaoEstadual: "000000000000",
      cep: "00000-000", logradouro: "Rua Ficticia", numero: "100", bairro: "Centro", cidade: "Sao Paulo", estado: "SP",
      telefone: "(11) 99999-0001", email: "teste@quimflex.ficticio",
      categoria: "Quimicos", status: "Ativo",
      condPagamento: "30d", formaPagamento: "Boleto", prazoEntregaDias: 5,
      createdAt: now, updatedAt: now,
    } as any)
    
    const forn2 = await ctx.db.insert("suppliers", {
      supplierType: "direto", personType: "PJ",
      pjRazaoSocial: "Essencia Natural Ltda (TESTE)",
      pjNomeFantasia: "Essencia Natural (TESTE)",
      pjCnpj: "11111111111111",
      cep: "00000-000", logradouro: "Av Ficticia", numero: "200", bairro: "Industrial", cidade: "Campinas", estado: "SP",
      telefone: "(19) 99999-0002", email: "teste@essencia.ficticio",
      categoria: "Essencias", status: "Ativo",
      condPagamento: "A vista", formaPagamento: "PIX", prazoEntregaDias: 3,
      createdAt: now, updatedAt: now,
    } as any)

    const forn3 = await ctx.db.insert("suppliers", {
      supplierType: "marketplace", personType: "PJ",
      pjNomeFantasia: "Mercado Livre (TESTE)", marketplaceName: "ML Embalagens", marketplaceLink: "https://mercadolivre.com.br/teste",
      telefone: "(11) 99999-0003", email: "teste@ml.ficticio",
      categoria: "Embalagens", status: "Ativo",
      condPagamento: "A vista", formaPagamento: "Cartao",
      createdAt: now, updatedAt: now,
    } as any)
    
    // =====================================================
    // CLIENTES
    // =====================================================
    await ctx.db.insert("clients", {
      personType: "PF", pfName: "Maria Silva (TESTE)", pfCpf: "00000000000",
      telefone: "(11) 99999-1001", email: "maria@teste.ficticio",
      cep: "00000-000", logradouro: "Rua das Flores", numero: "50", bairro: "Jardins", cidade: "Sao Paulo", estado: "SP",
      segmento: "Residencial", status: "Ativo",
      createdAt: now, updatedAt: now,
    } as any)

    await ctx.db.insert("clients", {
      personType: "PJ", pjRazaoSocial: "Hotel Paraiso Ltda (TESTE)", pjNomeFantasia: "Hotel Paraiso", pjCnpj: "22222222222222",
      telefone: "(21) 99999-1002", email: "reservas@hotelparaiso.ficticio",
      cep: "00000-000", logradouro: "Av Atlantica", numero: "1000", bairro: "Copacabana", cidade: "Rio de Janeiro", estado: "RJ",
      segmento: "Hotelaria", status: "Ativo",
      createdAt: now, updatedAt: now,
    } as any)

    // =====================================================
    // INSUMOS com VARIANTES (com quantidade em estoque)
    // =====================================================
    
    // Insumo 1: Álcool Etílico
    const insAlcool = await ctx.db.insert("insumos", {
      nome: "Alcool Etilico (TESTE)", categoria: "Solventes", status: "Ativo",
      unidadeCompra: "L", unidadeUso: "ml",
      temVariantes: true,
      createdAt: now, updatedAt: now,
    } as any)
    const varAlcool70 = await ctx.db.insert("insumoVariants", {
      insumoId: insAlcool, nome: "70% (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 5000, estoqueMaximo: 40000,
      quantidade: 15000, precoMedio: 0.015,
      localizacao: "Almox A - Prateleira 1",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    const varAlcool96 = await ctx.db.insert("insumoVariants", {
      insumoId: insAlcool, nome: "96% (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 2000, estoqueMaximo: 20000,
      quantidade: 8000, precoMedio: 0.022,
      localizacao: "Almox A - Prateleira 1",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    
    // Insumo 2: Essência Lavanda
    const insEssencia = await ctx.db.insert("insumos", {
      nome: "Essencia de Lavanda (TESTE)", categoria: "Essencias", status: "Ativo",
      unidadeCompra: "ml", unidadeUso: "ml",
      temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varEssencia = await ctx.db.insert("insumoVariants", {
      insumoId: insEssencia, nome: "Padrao (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 200, estoqueMaximo: 3000,
      quantidade: 500, precoMedio: 0.35, localizacao: "Almox B - Armario 3",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    
    // Insumo 3: Glicerina
    const insGlicerina = await ctx.db.insert("insumos", {
      nome: "Glicerina Vegetal (TESTE)", categoria: "Emolientes", status: "Ativo",
      unidadeCompra: "L", unidadeUso: "ml",
      temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varGlicerina = await ctx.db.insert("insumoVariants", {
      insumoId: insGlicerina, nome: "Padrao (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 1000, estoqueMaximo: 10000,
      quantidade: 3500, precoMedio: 0.04, localizacao: "Almox A - Prateleira 2",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    
    // Insumo 4: Corante
    const insCorante = await ctx.db.insert("insumos", {
      nome: "Corante Azul (TESTE)", categoria: "Corantes", status: "Ativo",
      unidadeCompra: "ml", unidadeUso: "ml",
      temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varCorante = await ctx.db.insert("insumoVariants", {
      insumoId: insCorante, nome: "Azul (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 50, estoqueMaximo: 1000,
      quantidade: 300, precoMedio: 0.10, localizacao: "Almox B - Armario 1",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    // Insumo 5: Frasco PET (entrada abaixo do mínimo)
    const insFrasco = await ctx.db.insert("insumos", {
      nome: "Frasco PET 500ml (TESTE)", categoria: "Embalagens", status: "Ativo",
      unidadeCompra: "un", unidadeUso: "un",
      temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varFrasco = await ctx.db.insert("insumoVariants", {
      insumoId: insFrasco, nome: "Cristal (TESTE)", unidadeMedida: "un",
      estoqueMinimo: 500, estoqueMaximo: 10000,
      quantidade: 200, precoMedio: 1.50, localizacao: "Almox C - Palete 5",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    // Insumo 6: Tampa Spray
    const insTampa = await ctx.db.insert("insumos", {
      nome: "Tampa Spray Gatilho (TESTE)", categoria: "Embalagens", status: "Ativo",
      unidadeCompra: "un", unidadeUso: "un",
      temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varTampa = await ctx.db.insert("insumoVariants", {
      insumoId: insTampa, nome: "Branca (TESTE)", unidadeMedida: "un",
      estoqueMinimo: 300, estoqueMaximo: 8000,
      quantidade: 4500, precoMedio: 0.90, localizacao: "Almox C - Palete 6",
      status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    // =====================================================
    // PRODUTOS COM EMBALAGENS
    // =====================================================
    
    const prod1 = await ctx.db.insert("products", {
      nome: "Limpa Vidros (TESTE)", descricao: "Limpa vidros profissional, secagem rapida sem manchas.",
      categoria: "Limpeza", status: "Ativo",
      modoUso: "Aplicar diretamente e passar pano seco.",
      ph: "7.0", corAspecto: "Azul claro translucido",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("productPackagings", {
      productId: prod1, nome: "Spray 500ml (TESTE)", volume: 500, unidadeVolume: "ml",
      tipo: "Frasco", codigoBarras: "0000000000001",
      custoEmbalagem: 2.50, margem: 45, precoSugerido: 8.90, precoVenda: 9.90,
      quantidade: 120, quantidadeMinima: 50, quantidadeMaxima: 500,
      localizacao: "Estoque P1", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("productPackagings", {
      productId: prod1, nome: "Galao 5L (TESTE)", volume: 5000, unidadeVolume: "ml",
      tipo: "Galao", codigoBarras: "0000000000002",
      custoEmbalagem: 5.00, margem: 40, precoSugerido: 29.90, precoVenda: 32.90,
      quantidade: 30, quantidadeMinima: 10, quantidadeMaxima: 100,
      localizacao: "Estoque P1", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)

    const prod2 = await ctx.db.insert("products", {
      nome: "Desinfetante Lavanda (TESTE)", descricao: "Desinfetante com fragrancia de lavanda, acao bactericida.",
      categoria: "Limpeza", status: "Ativo",
      modoUso: "Diluir 1 parte do produto para 10 partes de agua.",
      ph: "9.5", corAspecto: "Lilas", fragrancia: "Lavanda",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("productPackagings", {
      productId: prod2, nome: "Frasco 1L (TESTE)", volume: 1000, unidadeVolume: "ml",
      tipo: "Frasco", codigoBarras: "0000000000003",
      custoEmbalagem: 3.20, margem: 50, precoSugerido: 12.50, precoVenda: 13.90,
      quantidade: 80, quantidadeMinima: 30, quantidadeMaxima: 300,
      localizacao: "Estoque P2", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)

    // =====================================================
    // FÓRMULAS
    // =====================================================
    const formula1 = await ctx.db.insert("formulas", {
      nome: "Limpa Vidros Padrao (TESTE)", productId: prod1,
      descricao: "Formula base para limpa vidros profissional.",
      unidade: "L", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)
    
    await ctx.db.insert("formulaIngredients", {
      formulaId: formula1, insumoId: insAlcool, varianteId: varAlcool70,
      quantidade: 0.200, unidade: "ml", ordem: 1, observacao: "Alcool 70% - base solvente",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("formulaIngredients", {
      formulaId: formula1, insumoId: insCorante, varianteId: varCorante,
      quantidade: 0.002, unidade: "ml", ordem: 2, observacao: "Corante azul - apenas coloracao",
      createdAt: now, updatedAt: now,
    } as any)
    // Água (não tem em estoque, é tratada separadamente)

    const formula2 = await ctx.db.insert("formulas", {
      nome: "Desinfetante Lavanda (TESTE)", productId: prod2,
      descricao: "Formula base para desinfetante com essencia de lavanda.",
      unidade: "L", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)
    
    await ctx.db.insert("formulaIngredients", {
      formulaId: formula2, insumoId: insAlcool, varianteId: varAlcool96,
      quantidade: 0.300, unidade: "ml", ordem: 1, observacao: "Alcool 96% - base desinfetante",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("formulaIngredients", {
      formulaId: formula2, insumoId: insEssencia, varianteId: varEssencia,
      quantidade: 0.010, unidade: "ml", ordem: 2, observacao: "Essencia de lavanda - fragrancia",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("formulaIngredients", {
      formulaId: formula2, insumoId: insGlicerina, varianteId: varGlicerina,
      quantidade: 0.005, unidade: "ml", ordem: 3, observacao: "Glicerina - emoliente e fixador",
      createdAt: now, updatedAt: now,
    } as any)

    // =====================================================
    // COMPRAS (workflow completo)
    // =====================================================

    // Compra 1: Alcools e Glicerina da Quimflex (Rascunho → Pedida → Em transito → Recebida)
    const compra1 = await ctx.db.insert("purchases", {
      fornecedorId: forn1, tipo: "direto",
      numero: "CMP-25-0001",
      dataCompra: now - 7 * 86400000,
      tipoPagamento: "Boleto", condPagamento: "30d",
      frete: 50, freteGratis: false,
      total: 0, status: "Recebida",
      dataPagamento: now - 6 * 86400000,
      dataRecebimento: now - 3 * 86400000,
      codigoRastreio: "BR0000000001",
      numeroNota: "NF-000001",
      createdAt: now - 7 * 86400000, updatedAt: now,
    } as any)

    await ctx.db.insert("purchaseItems", {
      purchaseId: compra1, insumoId: insAlcool, varianteId: varAlcool70,
      quantidade: 5000, unidade: "ml", precoUnitario: 0.012, subtotal: 60,
      quantidadeRecebida: 5000, statusRecebimento: "recebido",
      createdAt: now - 7 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseItems", {
      purchaseId: compra1, insumoId: insAlcool, varianteId: varAlcool96,
      quantidade: 3000, unidade: "ml", precoUnitario: 0.020, subtotal: 60,
      quantidadeRecebida: 3000, statusRecebimento: "recebido",
      createdAt: now - 7 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseItems", {
      purchaseId: compra1, insumoId: insGlicerina, varianteId: varGlicerina,
      quantidade: 2000, unidade: "ml", precoUnitario: 0.035, subtotal: 70,
      quantidadeRecebida: 2000, statusRecebimento: "recebido",
      createdAt: now - 7 * 86400000, updatedAt: now,
    } as any)
    
    // Atualiza total
    const total1 = 60 + 60 + 70 + 50 // items + frete
    await ctx.db.patch(compra1, { total: total1, updatedAt: now })
    
    // Contas a pagar
    await ctx.db.insert("contasPagar", {
      purchaseId: compra1, fornecedorId: forn1, fornecedorNome: "Quimflex (TESTE)",
      descricao: "Compra de insumos (1/1)", valor: total1,
      dataVencimento: now + 23 * 86400000, dataPagamento: now - 6 * 86400000,
      formaPagamento: "Boleto", status: "Paga", parcela: "1/1",
      createdAt: now, updatedAt: now,
    } as any)

    // Histórico de status
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra1, statusAnterior: "", statusNovo: "Rascunho",
      data: now - 7 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: true,
      observacao: "Criacao do rascunho",
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra1, statusAnterior: "Rascunho", statusNovo: "Pedida",
      data: now - 6.5 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: false,
      observacao: "Pedido confirmado - CMP-25-0001",
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra1, statusAnterior: "Pedida", statusNovo: "Em transito",
      data: now - 5 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: false,
      observacao: "Pagamento confirmado + rastreio BR0000000001",
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra1, statusAnterior: "Em transito", statusNovo: "Recebida",
      data: now - 3 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: false,
      observacao: "Compra recebida integralmente",
    } as any)

    // Stock movements da compra1
    await ctx.db.insert("stockMovements", {
      itemType: "insumo", insumoId: insAlcool, varianteId: varAlcool70,
      tipo: "entrada", quantidade: 5000, saldoAnterior: 10000, saldoAtual: 15000,
      origem: "compra", referenciaId: compra1,
      observacao: "Recebimento compra CMP-25-0001",
      userId, createdAt: now - 3 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("stockMovements", {
      itemType: "insumo", insumoId: insAlcool, varianteId: varAlcool96,
      tipo: "entrada", quantidade: 3000, saldoAnterior: 5000, saldoAtual: 8000,
      origem: "compra", referenciaId: compra1,
      observacao: "Recebimento compra CMP-25-0001",
      userId, createdAt: now - 3 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("stockMovements", {
      itemType: "insumo", insumoId: insGlicerina, varianteId: varGlicerina,
      tipo: "entrada", quantidade: 2000, saldoAnterior: 1500, saldoAtual: 3500,
      origem: "compra", referenciaId: compra1,
      observacao: "Recebimento compra CMP-25-0001",
      userId, createdAt: now - 3 * 86400000, updatedAt: now,
    } as any)

    // Compra 2: Frascos do Mercado Livre (em transito)
    const compra2 = await ctx.db.insert("purchases", {
      fornecedorId: forn3, tipo: "marketplace",
      numero: "CMP-25-0002",
      dataCompra: now - 2 * 86400000,
      tipoPagamento: "Cartao", condPagamento: "A vista",
      frete: 0, freteGratis: true,
      total: 750, status: "Em transito",
      dataPagamento: now - 2 * 86400000,
      codigoRastreio: "BR0000000002",
      createdAt: now - 2 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseItems", {
      purchaseId: compra2, insumoId: insFrasco, varianteId: varFrasco,
      quantidade: 500, unidade: "un", precoUnitario: 1.50, subtotal: 750,
      statusRecebimento: "pendente",
      createdAt: now - 2 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("contasPagar", {
      purchaseId: compra2, fornecedorId: forn3, fornecedorNome: "Mercado Livre (TESTE)",
      descricao: "Compra de insumos (1/1)", valor: 750,
      dataVencimento: now - 2 * 86400000, dataPagamento: now - 2 * 86400000,
      formaPagamento: "Cartao", status: "Paga", parcela: "1/1",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra2, statusAnterior: "", statusNovo: "Pedida",
      data: now - 2 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: true,
      observacao: "Compra marketplace registrada",
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra2, statusAnterior: "Pedida", statusNovo: "Em transito",
      data: now - 1.5 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: false,
      observacao: "Rastreio: BR0000000002",
    } as any)

    // Compra 3: Essencia da Essencia Natural (Pedida - aguardando)
    const compra3 = await ctx.db.insert("purchases", {
      fornecedorId: forn2, tipo: "direto",
      numero: "CMP-25-0003",
      dataCompra: now - 1 * 86400000,
      tipoPagamento: "PIX", condPagamento: "A vista",
      frete: 15, freteGratis: false,
      total: 365, status: "Pedida",
      dataPagamento: now - 1 * 86400000,
      createdAt: now - 1 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseItems", {
      purchaseId: compra3, insumoId: insEssencia, varianteId: varEssencia,
      quantidade: 1000, unidade: "ml", precoUnitario: 0.35, subtotal: 350,
      statusRecebimento: "pendente",
      createdAt: now - 1 * 86400000, updatedAt: now,
    } as any)
    await ctx.db.insert("contasPagar", {
      purchaseId: compra3, fornecedorId: forn2, fornecedorNome: "Essencia Natural (TESTE)",
      descricao: "Compra de insumos (1/1)", valor: 365,
      dataVencimento: now - 1 * 86400000, dataPagamento: now - 1 * 86400000,
      formaPagamento: "PIX", status: "Paga", parcela: "1/1",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra3, statusAnterior: "", statusNovo: "Rascunho",
      data: now - 1.1 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: true,
      observacao: "Criacao do rascunho",
    } as any)
    await ctx.db.insert("purchaseHistories", {
      purchaseId: compra3, statusAnterior: "Rascunho", statusNovo: "Pedida",
      data: now - 1 * 86400000, usuarioId: userId, usuarioNome: profile.fullName, automatico: false,
      observacao: "Pedido confirmado - CMP-25-0003",
    } as any)

    // Compra 4: Rascunho (para testar edição)
    const compra4 = await ctx.db.insert("purchases", {
      fornecedorId: forn1, tipo: "direto",
      dataCompra: now,
      tipoPagamento: "Transferencia", condPagamento: "30/60d",
      frete: 0, freteGratis: true,
      total: 300, status: "Rascunho",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseItems", {
      purchaseId: compra4, insumoId: insCorante, varianteId: varCorante,
      quantidade: 500, unidade: "ml", precoUnitario: 0.08, subtotal: 40,
      statusRecebimento: "pendente",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("purchaseItems", {
      purchaseId: compra4, insumoId: insTampa, varianteId: varTampa,
      quantidade: 200, unidade: "un", precoUnitario: 0.80, subtotal: 160,
      statusRecebimento: "pendente",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.patch(compra4, { total: 40 + 160, updatedAt: now })

    // =====================================================
    // REGISTRO DE AUDITORIA (marca seed como executada)
    // =====================================================
    await ctx.db.insert("auditLogs", {
      userId, timestamp: now, module: "SEED",
      action: "OUTRO", entity: "Sistema",
      entityId: "seed",
      description: "Dados ficticios de teste inseridos com sucesso",
    })

    return {
      success: true,
      message: `${descricao}\n\nResumo:\n- 3 Fornecedores (2 direto + 1 marketplace)\n- 2 Clientes (PF + PJ)\n- 6 Insumos com variantes\n- 2 Produtos com embalagens\n- 2 Formulas\n- 4 Compras (Recebida, Em transito, Pedida, Rascunho)\n- 3 Movimentacoes de estoque\n\n⚠️ TODOS OS DADOS SAO FICTICIOS.`,
    }
  },
})

/**
 * Versão interna — executável pelo Convex Dashboard sem autenticação.
 * Abra o Dashboard → Functions → seed:init → Run
 */
export const init = internalMutation({
  handler: async (ctx) => {
    const existe = await ctx.db.query("auditLogs").withIndex("by_module", (q: any) => q.eq("module", "SEED")).first()
    if (existe) throw new Error("Dados de teste ja foram inseridos.")

    const admin = await ctx.db.query("userProfiles").filter((q: any) => q.eq(q.field("role"), "Admin")).first()
    if (!admin) throw new Error("Nenhum usuario Admin encontrado. Crie um admin primeiro.")

    const descricao = "DADOS FICTICIOS PARA TESTES DE DESENVOLVIMENTO"
    const now = Date.now()
    const userId = admin.userId
    const userName = admin.fullName

    // =====================================================
    // FORNECEDORES
    // =====================================================
    const forn1 = await ctx.db.insert("suppliers", {
      supplierType: "direto", personType: "PJ",
      pjRazaoSocial: "Quimflex Industria Quimica Ltda (TESTE)",
      pjNomeFantasia: "Quimflex (TESTE)",
      pjCnpj: "00000000000000", pjInscricaoEstadual: "000000000000",
      cep: "00000-000", logradouro: "Rua Ficticia", numero: "100", bairro: "Centro", cidade: "Sao Paulo", estado: "SP",
      telefone: "(11) 99999-0001", email: "teste@quimflex.ficticio",
      categoria: "Quimicos", status: "Ativo",
      condPagamento: "30d", formaPagamento: "Boleto", prazoEntregaDias: 5,
      createdAt: now, updatedAt: now,
    } as any)
    
    const forn2 = await ctx.db.insert("suppliers", {
      supplierType: "direto", personType: "PJ",
      pjRazaoSocial: "Essencia Natural Ltda (TESTE)",
      pjNomeFantasia: "Essencia Natural (TESTE)",
      pjCnpj: "11111111111111",
      cep: "00000-000", logradouro: "Av Ficticia", numero: "200", bairro: "Industrial", cidade: "Campinas", estado: "SP",
      telefone: "(19) 99999-0002", email: "teste@essencia.ficticio",
      categoria: "Essencias", status: "Ativo",
      condPagamento: "A vista", formaPagamento: "PIX", prazoEntregaDias: 3,
      createdAt: now, updatedAt: now,
    } as any)

    const forn3 = await ctx.db.insert("suppliers", {
      supplierType: "marketplace", personType: "PJ",
      pjNomeFantasia: "Mercado Livre (TESTE)", marketplaceName: "ML Embalagens", marketplaceLink: "https://mercadolivre.com.br/teste",
      telefone: "(11) 99999-0003", email: "teste@ml.ficticio",
      categoria: "Embalagens", status: "Ativo",
      condPagamento: "A vista", formaPagamento: "Cartao",
      createdAt: now, updatedAt: now,
    } as any)

    await ctx.db.insert("clients", {
      personType: "PF", pfName: "Maria Silva (TESTE)", pfCpf: "00000000000",
      telefone: "(11) 99999-1001", email: "maria@teste.ficticio",
      cep: "00000-000", logradouro: "Rua das Flores", numero: "50", bairro: "Jardins", cidade: "Sao Paulo", estado: "SP",
      segmento: "Residencial", status: "Ativo",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("clients", {
      personType: "PJ", pjRazaoSocial: "Hotel Paraiso Ltda (TESTE)", pjNomeFantasia: "Hotel Paraiso", pjCnpj: "22222222222222",
      telefone: "(21) 99999-1002", email: "reservas@hotelparaiso.ficticio",
      cep: "00000-000", logradouro: "Av Atlantica", numero: "1000", bairro: "Copacabana", cidade: "Rio de Janeiro", estado: "RJ",
      segmento: "Hotelaria", status: "Ativo",
      createdAt: now, updatedAt: now,
    } as any)

    const insAlcool = await ctx.db.insert("insumos", {
      nome: "Alcool Etilico (TESTE)", categoria: "Solventes", status: "Ativo",
      unidadeCompra: "L", unidadeUso: "ml", temVariantes: true,
      createdAt: now, updatedAt: now,
    } as any)
    const varAlcool70 = await ctx.db.insert("insumoVariants", {
      insumoId: insAlcool, nome: "70% (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 5000, estoqueMaximo: 40000, quantidade: 15000, precoMedio: 0.015,
      localizacao: "Almox A - Prateleira 1", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    const varAlcool96 = await ctx.db.insert("insumoVariants", {
      insumoId: insAlcool, nome: "96% (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 2000, estoqueMaximo: 20000, quantidade: 8000, precoMedio: 0.022,
      localizacao: "Almox A - Prateleira 1", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    
    const insEssencia = await ctx.db.insert("insumos", {
      nome: "Essencia de Lavanda (TESTE)", categoria: "Essencias", status: "Ativo",
      unidadeCompra: "ml", unidadeUso: "ml", temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varEssencia = await ctx.db.insert("insumoVariants", {
      insumoId: insEssencia, nome: "Padrao (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 200, estoqueMaximo: 3000, quantidade: 500, precoMedio: 0.35,
      localizacao: "Almox B - Armario 3", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    
    const insGlicerina = await ctx.db.insert("insumos", {
      nome: "Glicerina Vegetal (TESTE)", categoria: "Emolientes", status: "Ativo",
      unidadeCompra: "L", unidadeUso: "ml", temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varGlicerina = await ctx.db.insert("insumoVariants", {
      insumoId: insGlicerina, nome: "Padrao (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 1000, estoqueMaximo: 10000, quantidade: 3500, precoMedio: 0.04,
      localizacao: "Almox A - Prateleira 2", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    
    const insCorante = await ctx.db.insert("insumos", {
      nome: "Corante Azul (TESTE)", categoria: "Corantes", status: "Ativo",
      unidadeCompra: "ml", unidadeUso: "ml", temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varCorante = await ctx.db.insert("insumoVariants", {
      insumoId: insCorante, nome: "Azul (TESTE)", unidadeMedida: "ml",
      estoqueMinimo: 50, estoqueMaximo: 1000, quantidade: 300, precoMedio: 0.10,
      localizacao: "Almox B - Armario 1", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    const insFrasco = await ctx.db.insert("insumos", {
      nome: "Frasco PET 500ml (TESTE)", categoria: "Embalagens", status: "Ativo",
      unidadeCompra: "un", unidadeUso: "un", temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varFrasco = await ctx.db.insert("insumoVariants", {
      insumoId: insFrasco, nome: "Cristal (TESTE)", unidadeMedida: "un",
      estoqueMinimo: 500, estoqueMaximo: 10000, quantidade: 200, precoMedio: 1.50,
      localizacao: "Almox C - Palete 5", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    const insTampa = await ctx.db.insert("insumos", {
      nome: "Tampa Spray Gatilho (TESTE)", categoria: "Embalagens", status: "Ativo",
      unidadeCompra: "un", unidadeUso: "un", temVariantes: false,
      createdAt: now, updatedAt: now,
    } as any)
    const varTampa = await ctx.db.insert("insumoVariants", {
      insumoId: insTampa, nome: "Branca (TESTE)", unidadeMedida: "un",
      estoqueMinimo: 300, estoqueMaximo: 8000, quantidade: 4500, precoMedio: 0.90,
      localizacao: "Almox C - Palete 6", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    const prod1 = await ctx.db.insert("products", {
      nome: "Limpa Vidros (TESTE)", descricao: "Limpa vidros profissional, secagem rapida sem manchas.",
      categoria: "Limpeza", status: "Ativo", modoUso: "Aplicar diretamente e passar pano seco.",
      ph: "7.0", corAspecto: "Azul claro translucido",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("productPackagings", {
      productId: prod1, nome: "Spray 500ml (TESTE)", volume: 500, unidadeVolume: "ml",
      tipo: "Frasco", codigoBarras: "0000000000001",
      custoEmbalagem: 2.50, margem: 45, precoSugerido: 8.90, precoVenda: 9.90,
      quantidade: 120, quantidadeMinima: 50, quantidadeMaxima: 500,
      localizacao: "Estoque P1", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("productPackagings", {
      productId: prod1, nome: "Galao 5L (TESTE)", volume: 5000, unidadeVolume: "ml",
      tipo: "Galao", codigoBarras: "0000000000002",
      custoEmbalagem: 5.00, margem: 40, precoSugerido: 29.90, precoVenda: 32.90,
      quantidade: 30, quantidadeMinima: 10, quantidadeMaxima: 100,
      localizacao: "Estoque P1", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    const prod2 = await ctx.db.insert("products", {
      nome: "Desinfetante Lavanda (TESTE)", descricao: "Desinfetante com fragrancia de lavanda, acao bactericida.",
      categoria: "Limpeza", status: "Ativo", modoUso: "Diluir 1 parte do produto para 10 partes de agua.",
      ph: "9.5", corAspecto: "Lilas", fragrancia: "Lavanda",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("productPackagings", {
      productId: prod2, nome: "Frasco 1L (TESTE)", volume: 1000, unidadeVolume: "ml",
      tipo: "Frasco", codigoBarras: "0000000000003",
      custoEmbalagem: 3.20, margem: 50, precoSugerido: 12.50, precoVenda: 13.90,
      quantidade: 80, quantidadeMinima: 30, quantidadeMaxima: 300,
      localizacao: "Estoque P2", status: "Ativa", createdAt: now, updatedAt: now,
    } as any)

    const formula1 = await ctx.db.insert("formulas", {
      nome: "Limpa Vidros Padrao (TESTE)", productId: prod1,
      descricao: "Formula base para limpa vidros profissional.",
      unidade: "L", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("formulaIngredients", { formulaId: formula1, insumoId: insAlcool, varianteId: varAlcool70, quantidade: 0.200, unidade: "ml", ordem: 1, observacao: "Alcool 70%", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("formulaIngredients", { formulaId: formula1, insumoId: insCorante, varianteId: varCorante, quantidade: 0.002, unidade: "ml", ordem: 2, observacao: "Corante azul", createdAt: now, updatedAt: now } as any)

    const formula2 = await ctx.db.insert("formulas", {
      nome: "Desinfetante Lavanda (TESTE)", productId: prod2,
      descricao: "Formula base para desinfetante com essencia de lavanda.",
      unidade: "L", status: "Ativa",
      createdAt: now, updatedAt: now,
    } as any)
    await ctx.db.insert("formulaIngredients", { formulaId: formula2, insumoId: insAlcool, varianteId: varAlcool96, quantidade: 0.300, unidade: "ml", ordem: 1, observacao: "Alcool 96%", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("formulaIngredients", { formulaId: formula2, insumoId: insEssencia, varianteId: varEssencia, quantidade: 0.010, unidade: "ml", ordem: 2, observacao: "Essencia lavanda", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("formulaIngredients", { formulaId: formula2, insumoId: insGlicerina, varianteId: varGlicerina, quantidade: 0.005, unidade: "ml", ordem: 3, observacao: "Glicerina", createdAt: now, updatedAt: now } as any)

    // Compras (consolidado)
    const compra1 = await ctx.db.insert("purchases", { fornecedorId: forn1, tipo: "direto", numero: "CMP-25-0001", dataCompra: now - 7*86400000, tipoPagamento: "Boleto", condPagamento: "30d", frete: 50, status: "Recebida", dataPagamento: now - 6*86400000, dataRecebimento: now - 3*86400000, codigoRastreio: "BR0000000001", numeroNota: "NF-000001", total: 240, createdAt: now - 7*86400000, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra1, insumoId: insAlcool, varianteId: varAlcool70, quantidade: 5000, unidade: "ml", precoUnitario: 0.012, subtotal: 60, quantidadeRecebida: 5000, statusRecebimento: "recebido", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra1, insumoId: insAlcool, varianteId: varAlcool96, quantidade: 3000, unidade: "ml", precoUnitario: 0.020, subtotal: 60, quantidadeRecebida: 3000, statusRecebimento: "recebido", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra1, insumoId: insGlicerina, varianteId: varGlicerina, quantidade: 2000, unidade: "ml", precoUnitario: 0.035, subtotal: 70, quantidadeRecebida: 2000, statusRecebimento: "recebido", createdAt: now, updatedAt: now } as any)
    await ctx.db.patch(compra1, { total: 240, updatedAt: now })
    await ctx.db.insert("contasPagar", { purchaseId: compra1, fornecedorId: forn1, fornecedorNome: "Quimflex (TESTE)", descricao: "Compra de insumos (1/1)", valor: 240, dataVencimento: now + 23*86400000, dataPagamento: now - 6*86400000, formaPagamento: "Boleto", status: "Paga", parcela: "1/1", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("purchaseHistories", { purchaseId: compra1, statusAnterior: "", statusNovo: "Rascunho", data: now - 7*86400000, usuarioId: userId, usuarioNome: userName, automatico: true, observacao: "Criacao do rascunho" } as any)
    await ctx.db.insert("purchaseHistories", { purchaseId: compra1, statusAnterior: "Rascunho", statusNovo: "Pedida", data: now - 6.5*86400000, usuarioId: userId, usuarioNome: userName, observacao: "Pedido confirmado" } as any)
    await ctx.db.insert("purchaseHistories", { purchaseId: compra1, statusAnterior: "Pedida", statusNovo: "Em transito", data: now - 5*86400000, usuarioId: userId, usuarioNome: userName, observacao: "Pagamento + rastreio" } as any)
    await ctx.db.insert("purchaseHistories", { purchaseId: compra1, statusAnterior: "Em transito", statusNovo: "Recebida", data: now - 3*86400000, usuarioId: userId, usuarioNome: userName, observacao: "Recebida integralmente" } as any)
    await ctx.db.insert("stockMovements", { itemType: "insumo", insumoId: insAlcool, varianteId: varAlcool70, tipo: "entrada", quantidade: 5000, saldoAnterior: 10000, saldoAtual: 15000, origem: "compra", referenciaId: compra1, userId, createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("stockMovements", { itemType: "insumo", insumoId: insAlcool, varianteId: varAlcool96, tipo: "entrada", quantidade: 3000, saldoAnterior: 5000, saldoAtual: 8000, origem: "compra", referenciaId: compra1, userId, createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("stockMovements", { itemType: "insumo", insumoId: insGlicerina, varianteId: varGlicerina, tipo: "entrada", quantidade: 2000, saldoAnterior: 1500, saldoAtual: 3500, origem: "compra", referenciaId: compra1, userId, createdAt: now, updatedAt: now } as any)

    const compra2 = await ctx.db.insert("purchases", { fornecedorId: forn3, tipo: "marketplace", numero: "CMP-25-0002", dataCompra: now - 2*86400000, tipoPagamento: "Cartao", condPagamento: "A vista", frete: 0, freteGratis: true, total: 750, status: "Em transito", dataPagamento: now - 2*86400000, codigoRastreio: "BR0000000002", createdAt: now - 2*86400000, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra2, insumoId: insFrasco, varianteId: varFrasco, quantidade: 500, unidade: "un", precoUnitario: 1.50, subtotal: 750, statusRecebimento: "pendente", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("contasPagar", { purchaseId: compra2, fornecedorId: forn3, fornecedorNome: "Mercado Livre (TESTE)", descricao: "Compra de insumos (1/1)", valor: 750, dataVencimento: now - 2*86400000, dataPagamento: now - 2*86400000, formaPagamento: "Cartao", status: "Paga", parcela: "1/1", createdAt: now, updatedAt: now } as any)

    const compra3 = await ctx.db.insert("purchases", { fornecedorId: forn2, tipo: "direto", numero: "CMP-25-0003", dataCompra: now - 1*86400000, tipoPagamento: "PIX", condPagamento: "A vista", frete: 15, total: 365, status: "Pedida", dataPagamento: now - 1*86400000, createdAt: now - 1*86400000, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra3, insumoId: insEssencia, varianteId: varEssencia, quantidade: 1000, unidade: "ml", precoUnitario: 0.35, subtotal: 350, statusRecebimento: "pendente", createdAt: now, updatedAt: now } as any)

    const compra4 = await ctx.db.insert("purchases", { fornecedorId: forn1, tipo: "direto", dataCompra: now, tipoPagamento: "Transferencia", condPagamento: "30/60d", frete: 0, freteGratis: true, total: 200, status: "Rascunho", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra4, insumoId: insCorante, varianteId: varCorante, quantidade: 500, unidade: "ml", precoUnitario: 0.08, subtotal: 40, statusRecebimento: "pendente", createdAt: now, updatedAt: now } as any)
    await ctx.db.insert("purchaseItems", { purchaseId: compra4, insumoId: insTampa, varianteId: varTampa, quantidade: 200, unidade: "un", precoUnitario: 0.80, subtotal: 160, statusRecebimento: "pendente", createdAt: now, updatedAt: now } as any)

    await ctx.db.insert("auditLogs", { userId, timestamp: now, module: "SEED", action: "OUTRO", entity: "Sistema", entityId: "seed", description: "Dados ficticios de teste inseridos com sucesso" })

    return { success: true, message: `${descricao}\n\nResumo:\n- 3 Fornecedores\n- 2 Clientes\n- 6 Insumos com variantes\n- 2 Produtos com embalagens\n- 2 Formulas\n- 4 Compras (Recebida, Em transito, Pedida, Rascunho)\n- 3 Movimentacoes de estoque\n\n⚠️ TODOS OS DADOS SAO FICTICIOS.` }
  },
})
