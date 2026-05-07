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

M08 - COMPRAS DE INSUMOS  ⭐⭐⭐⭐ Alta
  Solicitação, pedido e recebimento de compras por variante,
  conferência parcial, devolução a fornecedor, histórico de
  preços. Atualiza PMP e gera Conta a Pagar automaticamente.
  Integra: M04, M07, M10, M16, M19, M20.

M09 - GESTÃO DE PRODUÇÃO  ⭐⭐⭐⭐⭐ Muito Alta
  Ordem de Produção: planejamento, execução, CQ e conclusão.
  Reserva e baixa de insumos por variante (FEFO), cálculo de
  custo real, rastreabilidade lote ↔ insumo, quarentena.
  Integra: M06, M07, M10, M11, M14, M19, M20.

M10 - ESTOQUE DE INSUMOS  ⭐⭐⭐ Média
  Posição de estoque por insumo/variante, movimentações,
  controle FEFO por lote, ajustes manuais auditados,
  valorização PMP, previsão de ruptura, relatórios.
  Integra: M07, M08, M09, M11, M15, M16, M19, M20.

M11 - ESTOQUE DE PRODUTOS ACABADOS  ⭐⭐⭐⭐ Alta
  Posição de estoque fracionado e a granel, amostras e uso
  interno, ajustes manuais, sugestão automática de produção,
  inventário físico (conjunto com M10), valor potencial.
  Integra: M05, M09, M10, M13, M14, M15, M16, M19, M20.

M12 - CADASTRO DE CLIENTES  ⭐⭐⭐ Média
  Clientes PF/PJ, classificação por tipo/segmento, dados
  comerciais, sistema de score configurável (critérios,
  níveis e benefícios). Histórico financeiro e de amostras.
  Integra: M02, M11, M13, M14, M15, M19, M20.

M13 - TABELA DE PREÇOS  ⭐⭐⭐⭐ Alta
  Múltiplas tabelas por perfil de cliente, tabelas derivadas,
  descontos progressivos, promoções por período, preços
  individuais por cliente, simulador integrado à venda.
  Integra: M05, M06, M11, M12, M14, M15, M19, M20.

M14 - PEDIDOS E VENDAS  ⭐⭐⭐⭐ Alta
  Orçamento (não reserva) e Pedido (reserva imediata),
  fluxo completo de status, romaneio de separação,
  devolução com quarentena, documentos PDF.
  Gera contas a receber ao concluir.
  Integra: M02, M03, M09, M11, M12, M13, M15, M19, M20.

M15 - FINANCEIRO: CONTAS A RECEBER  ⭐⭐⭐ Média
  Geração automática via Módulo 14, parcelamento,
  registros de recebimentos (total/parcial), estornos,
  alertas de vencimento e inadimplência.
  Integra: M12, M14, M16, M19, M20.

M16 - FINANCEIRO: CONTAS A PAGAR  ⭐⭐⭐ Média
  Geração automática via Módulo 08 (ao receber compra),
  calendário de pagamentos, fluxo de caixa projetado,
  relatório de aging. Integra: M04, M08, M15, M19, M20.

M17 - DASHBOARD E INDICADORES  ⭐⭐⭐ Média
  KPIs em tempo real: Vendas, Produção, Estoque, Financeiro.
  Gráficos interativos, alertas rápidos. Visibilidade dos
  cards controlada por perfil de acesso.
  Integra: M02, M03, M09, M10, M11, M14, M15, M16, M18, M19.

M18 - RELATÓRIOS GERENCIAIS  ⭐⭐⭐⭐ Alta
  Relatórios por categoria: Estoque, Produção, Vendas,
  Financeiro, Compras, Clientes. Filtros dinâmicos,
  gráficos, drill-down, exportação PDF/Excel/CSV.
  Agendamento automático por email.
  Integra: todos os módulos de dados.

M19 - NOTIFICAÇÕES E ALERTAS  ⭐⭐⭐ Média
  Recebe eventos de todos os módulos, dispara notificações
  in-app (sino) e por email. Preferências por usuário.
  Alertas críticos forçados pelo Admin.
  Integra: todos os módulos.

M20 - LOGS E AUDITORIA  ⭐⭐⭐ Média
  Registro automático de todas as ações: criar, editar,
  excluir, logar, pagar, ajustar estoque. Armazena antes/
  depois em JSON. Acesso exclusivo do Admin.
  Integra: todos os módulos (somente leitura de saída).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. INVENTÁRIO DE TELAS DO SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 01 (2 telas)
  Login | Recuperação de Senha

MÓDULO 02 (1 tela com 5+ abas)
  Configurações da Empresa (Dados, Logo, Documentos, Alertas,
  Financeiro, Score de Clientes)

MÓDULO 03 (2 telas)
  Lista de Usuários | Cadastro/Edição de Usuário

MÓDULO 04 (3 telas)
  Lista de Fornecedores | Cadastro/Edição (5 abas) |
  Detalhe do Fornecedor

MÓDULO 05 (3 telas)
  Lista de Produtos | Cadastro/Edição | Detalhe do Produto

MÓDULO 06 (4 telas)
  Lista de Fórmulas | Cadastro/Edição | Histórico de Versões |
  Comparativo de Versões

MÓDULO 07 (4 telas)
  Lista de Insumos | Cadastro/Edição (5 abas) |
  Detalhe do Insumo | Gerenciar Variantes

MÓDULO 08 (5 telas)
  Lista de Compras | Nova Compra | Recebimento |
  Devolução ao Fornecedor | Relatórios de Compras

MÓDULO 09 (6 telas)
  Lista de OPs | Nova OP | Execução da OP |
  Controle de Qualidade | Quarentena | Rastreabilidade de Lote

MÓDULO 10 (6 telas)
  Posição de Estoque | Detalhe do Insumo/Variante |
  Movimentações | Ajuste Manual | Transferência entre Locais |
  Relatórios de Estoque de Insumos

MÓDULO 11 (10 telas)
  Posição de Estoque | Detalhe do Produto |
  Movimentações | Registrar Amostra/Uso Interno |
  Ajuste Manual | Fracionamento de Granel |
  Produtos em Quarentena | Sugestões de Produção |
  Inventário Físico | Relatórios de Estoque de Produtos

MÓDULO 12 (3 telas)
  Lista de Clientes | Cadastro/Edição (4 abas) |
  Detalhe do Cliente

MÓDULO 13 (5 telas)
  Lista de Tabelas | Cadastro/Edição (3 abas) |
  Reajuste em Lote | Gestão de Promoções | Simulador de Preços

MÓDULO 14 (6 telas)
  Lista de Pedidos/Orçamentos | Novo Orçamento/Pedido |
  Detalhe do Pedido | Separação de Pedido |
  Devolução de Venda | Painel de Vendas

MÓDULO 15 (3 telas)
  Lista de Contas a Receber | Registro de Pagamento (modal) |
  Relatório de Inadimplência

MÓDULO 16 (5 telas)
  Lista de Contas a Pagar | Registro de Pagamento (modal) |
  Calendário de Pagamentos | Relatórios | Fluxo de Caixa

MÓDULO 17 (1 tela)
  Dashboard Principal (cards + gráficos + alertas)

MÓDULO 18 (3 telas)
  Menu de Relatórios | Tela de Cada Relatório |
  Configuração de Agendamentos

MÓDULO 19 (3 telas)
  Sino/Dropdown (cabeçalho) | Central de Notificações |
  Configurações de Alertas

MÓDULO 20 (1 tela)
  Consulta de Logs (Admin)

TOTAL: ~76 telas mapeadas no sistema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. REGRAS DE NEGÓCIO CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RN01 - VARIANTES
  Todo insumo com múltiplas versões (essência, corante,
  embalagem, rótulo) deve ser tratado como Pai + Variantes.
  Cada variante possui saldo, PMP, validade e estoque mínimo
  independentes. Produção e compras sempre referenciam a
  variante específica, nunca o pai genérico.

RN02 - PMP (PREÇO MÉDIO PONDERADO)
  Fórmula: (Saldo Atual × PMP Atual + Qtd Entrada × Preço
  Entrada) ÷ (Saldo Atual + Qtd Entrada).
  Calculado automaticamente em toda entrada de compra,
  por variante. Nunca pode ser editado manualmente.

RN03 - FEFO (FIRST EXPIRED, FIRST OUT)
  Em toda saída de estoque (produção, venda), o sistema
  seleciona automaticamente o lote de menor validade.
  Insumos/produtos sem validade seguem FIFO padrão.

RN04 - CAMUFLAGEM DE VALORES
  Perfis Produção, Estoque e Vendas nunca veem valores de
  custo ou margem. Esses campos exibem "R$ xx,xx".
  A camuflagem é aplicada em todas as telas, relatórios e
  exportações para esses perfis.

RN05 - RESERVA DE ESTOQUE
  Ao confirmar um Pedido (M14), o estoque é reservado
  imediatamente. A baixa definitiva ocorre apenas ao
  concluir o pedido (status CONCLUÍDO).
  Orçamentos NÃO reservam estoque.

RN06 - RASTREABILIDADE
  Cada lote de produto acabado (M11) deve poder ser
  rastreado até: Ordem de Produção → Insumos consumidos
  → Variantes específicas → Lotes de compra dos insumos.

RN07 - GERAÇÃO AUTOMÁTICA FINANCEIRA
  Contas a Receber: geradas ao concluir pedido (M14).
  Contas a Pagar: geradas ao receber compra (M08, status
  "Recebida"). Não há geração manual de lançamentos.

RN08 - SCORE DE CLIENTES
  Calculado todo dia 1º do mês automaticamente.
  Critérios configuráveis: Volume, Frequência, Pontualidade.
  Soma dos pesos deve totalizar 100%.
  Mudança de nível dispara notificação (M19).

RN09 - NUMERAÇÃO DE DOCUMENTOS
  Formato padrão: PREFIXO-AANO-NNNN
  Ex: PED-26-0001, ORC-26-0001, CMP-26-0001
  Configurado no Módulo 02. Nunca pode ser editado.

RN10 - INVENTÁRIO FÍSICO
  Pode ser geral (insumos + produtos) ou separado.
  Escopo configurado ao iniciar o inventário.
  Durante o inventário, movimentações normais continuam
  mas são marcadas para conciliação posterior.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. PRIORIDADE DE IMPLEMENTAÇÃO (ROADMAP MVP → COMPLETO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 1 - MVP (Fundação)
  M01 Autenticação
  M02 Configurações da Empresa
  M03 Gestão de Usuários
  M07 Gestão de Insumos (com variantes)
  M06 Gestão de Fórmulas
  M09 Gestão de Produção (fluxo básico)
  M10 Estoque de Insumos

FASE 2 - COMERCIAL
  M05 Cadastro de Produtos
  M11 Estoque de Produtos Acabados
  M04 Cadastro de Fornecedores
  M08 Compras de Insumos
  M12 Cadastro de Clientes
  M13 Tabela de Preços
  M14 Pedidos e Vendas

FASE 3 - FINANCEIRO E GESTÃO
  M15 Contas a Receber
  M16 Contas a Pagar
  M17 Dashboard e Indicadores
  M18 Relatórios Gerenciais

FASE 4 - TRANSVERSAIS (paralelo às fases anteriores)
  M19 Notificações e Alertas
  M20 Logs e Auditoria

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. REQUISITOS NÃO FUNCIONAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEGURANÇA
  ├── Autenticação JWT com expiração configurável
  ├── MFA via TOTP (Google Authenticator compatível)
  ├── HTTPS obrigatório em produção
  ├── Logs de auditoria imutáveis (append-only)
  └── LGPD: dados pessoais de clientes protegidos

PERFORMANCE
  ├── Dashboard atualiza a cada 5 minutos
  ├── Relatórios pesados com cache (Redis)
  ├── Cache invalidado automaticamente à meia-noite
  └── Tempo de resposta < 2s para operações padrão

DISPONIBILIDADE
  ├── SLA mínimo: 99,5% uptime
  └── Backup automático diário

USABILIDADE
  ├── Interface responsiva (desktop e tablet)
  ├── Design "Royal Capsule" - escuro, premium
  ├── Feedback visual em todas as ações (toasts)
  └── Atalhos de teclado nas telas principais

EXPORTAÇÃO E INTEGRAÇÕES
  ├── PDF gerado no servidor (logo, fontes, paginação)
  ├── Excel (.xlsx) com dados brutos
  ├── CSV para importação em sistemas contábeis
  └── WhatsApp para envio de documentos (fase futura)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. GLOSSÁRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PMP    Preço Médio Ponderado - método de custeio de estoque
FEFO   First Expired, First Out - saída pelo menor vencimento
FIFO   First In, First Out - saída pelo mais antigo
OP     Ordem de Produção
CQ     Controle de Qualidade
SKU    Stock Keeping Unit - código único por embalagem
FISPQ  Ficha de Informações de Segurança de Produto Químico
EPI    Equipamento de Proteção Individual
PF     Pessoa Física
PJ     Pessoa Jurídica
RBAC   Role-Based Access Control
DRE    Demonstrativo de Resultados do Exercício
LGPD   Lei Geral de Proteção de Dados Pessoais
FEFO   First Expired, First Out

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIM DO PRD - OHANA CLEAN v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
