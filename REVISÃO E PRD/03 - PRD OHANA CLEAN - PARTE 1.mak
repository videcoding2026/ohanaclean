╔══════════════════════════════════════════════════════════════╗
║   PRD - PRODUCT REQUIREMENTS DOCUMENT                       ║
║   OHANA CLEAN - SISTEMA DE GESTÃO LLMARENA                  ║
║   Versão 1.0 | Data: 2026-05-01 | Status: APROVADO         ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. VISÃO GERAL DO PRODUTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOME DO PRODUTO: CleanManager (Ohana Clean)
TIPO: SaaS B2B - Sistema de Gestão para Fabricantes de
      Produtos de Limpeza e Higiene (micro e pequenas empresas)

PROBLEMA QUE RESOLVE:
  Fabricantes artesanais e pequenos fabricantes de produtos de
  limpeza não possuem um sistema integrado que una: gestão de
  insumos com variantes (essências, corantes, embalagens),
  controle de fórmulas, rastreabilidade de lotes, gestão de
  produção, estoque e financeiro em um único lugar acessível.

PROPOSTA DE VALOR:
  Sistema completo e especializado para o segmento de limpeza,
  com: controle de variantes de insumos, PMP automático, FEFO,
  rastreabilidade completa lote a lote, camuflagem de custos
  por perfil, e dashboards gerenciais em tempo real.

PÚBLICO-ALVO:
  ├── Fabricantes artesanais de produtos de limpeza
  ├── Pequenas indústrias de higiene doméstica
  ├── Cooperativas e associações de produção
  └── Empresas com faturamento até R$ 5M/ano

MODELO DE NEGÓCIO: SaaS com planos por número de usuários
ACESSO: Web (responsivo) | Mobile (fase futura)
IDIOMA: Português Brasileiro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. PILARES TÉCNICOS FUNDAMENTAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ├── VARIANTES DE INSUMOS: Estrutura Pai → Variante
  │   (Ex: Essência → Floral, Lavanda, Limão)
  │   Cada variante tem código, saldo, PMP e validade próprios.
  │
  ├── PMP (PREÇO MÉDIO PONDERADO): Método padrão de custeio
  │   calculado automaticamente a cada entrada de compra,
  │   por variante de insumo e por embalagem de produto.
  │
  ├── FEFO (First Expired, First Out): Método de saída padrão
  │   para insumos e produtos. O lote de menor validade sai
  │   primeiro em produção e em vendas.
  │
  ├── RBAC (Role-Based Access Control): 6 perfis de acesso
  │   com camuflagem de valores financeiros sensíveis.
  │
  ├── RASTREABILIDADE COMPLETA: Do insumo comprado até o
  │   produto vendido, passando pelo lote de produção.
  │
  └── MULTI-MÓDULO INTEGRADO: 20 módulos que se comunicam
      automaticamente, eliminando retrabalho de dados.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. PERFIS DE USUÁRIO (RBAC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  👑 ADMINISTRADOR
  ├── Acesso total a todos os módulos
  ├── Vê todos os valores financeiros (custos, margens)
  ├── Configura parâmetros, usuários e permissões
  └── Único que acessa Logs (Módulo 20)

  👁️ VISUALIZADOR
  ├── Acesso de leitura a todos os módulos
  ├── Vê todos os valores financeiros (custos, margens)
  └── Não cria, edita, exclui ou exporta dados

  🏭 PRODUÇÃO
  ├── Acessa: Insumos, Fórmulas, Produção, Estoque Insumos
  ├── Valores financeiros: OCULTOS (R$ xx,xx)
  └── Não acessa: Vendas, Financeiro, Clientes

  📦 ESTOQUE
  ├── Acessa: Insumos, Compras, Estoque Insumos e Produtos
  ├── Valores financeiros: OCULTOS (R$ xx,xx)
  └── Não acessa: Fórmulas, Vendas, Financeiro

  🛒 VENDAS
  ├── Acessa: Clientes, Produtos, Tabela de Preços, Pedidos
  ├── Custo/Margem dos produtos: OCULTOS (R$ xx,xx)
  └── Não acessa: Fórmulas, Insumos, Financeiro

  💳 FINANCEIRO
  ├── Acessa: Contas a Receber, Contas a Pagar, Relatórios
  ├── Vê valores financeiros completos
  └── Não acessa: Fórmulas, Produção, operações de estoque

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. MÓDULOS DO SISTEMA (RESUMO EXECUTIVO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

M01 - AUTENTICAÇÃO E SEGURANÇA  ⭐⭐ Baixa
  Login seguro com email/senha, MFA opcional, bloqueio após
  tentativas, recuperação de senha por email, controle de
  sessão por perfil. Integra: M02, M03, M19, M20.

M02 - CONFIGURAÇÕES DA EMPRESA  ⭐⭐⭐ Média
  Dados da empresa, logo, moeda, numeração de documentos,
  metas de vendas, thresholds de alertas, score de clientes
  (NOVO: aba de configuração adicionada na revisão).
  Integra: todos os módulos como provedor de parâmetros.

M03 - GESTÃO DE USUÁRIOS E PERMISSÕES  ⭐⭐⭐ Média
  Cadastro de usuários, matriz RBAC, camuflagem de valores
  sensíveis por perfil. Regra central: Admin e Visualizador
  veem custos reais; demais veem "R$ xx,xx".
  Integra: M01, M19, M20.

M04 - CADASTRO DE FORNECEDORES  ⭐⭐ Baixa
  Dados completos PF/PJ, contatos, dados bancários,
  tabelas de preços importadas, avaliação de fornecedores,
  histórico de compras e pendências financeiras.
  Integra: M07, M08, M16, M19, M20.

M05 - CADASTRO DE PRODUTOS  ⭐⭐⭐ Média
  Produtos acabados com embalagens (SKUs), ficha técnica,
  código de barras, vinculação com fórmula, custo PMP
  calculado automaticamente. Integra: M06, M11, M13, M14.

M06 - GESTÃO DE FÓRMULAS  ⭐⭐⭐⭐ Alta
  Receitas de produção com insumos+variantes, concentrações,
  ordem de adição, parâmetros de CQ, múltiplas versões com
  histórico. Custo calculado automaticamente via PMP.
  Integra: M05, M07, M09, M10, M13, M19, M20.

M07 - GESTÃO DE INSUMOS  ⭐⭐⭐⭐ Alta
  Cadastro de insumos com estrutura Pai → Variantes,
  FISPQ, EPIs, múltiplos fornecedores, estoque mínimo/máximo
  por variante, alertas de vencimento configuráveis.
  Integra: M04, M06, M08, M09, M10, M19, M20.
