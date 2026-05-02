╔══════════════════════════════════════════════════════════════╗
║   PLANO DE REORGANIZAÇÃO DE MÓDULOS                         ║
║   Sistema Ohana Clean — De 20 para 17 Módulos              ║
╠══════════════════════════════════════════════════════════════╣
║  Data: 2026-05-01  |  Versão: Proposta v1.0                ║
║  Objetivo: Agrupar módulos relacionados sem perder função   ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LÓGICA DA REORGANIZAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  3 FUSÕES PROPOSTAS:
  ├── M10 + M11 → NOVO M10: Controle de Estoque (1 módulo)
  ├── M15 + M16 → NOVO M14: Gestão Financeira (1 módulo)
  └── M17 + M18 → NOVO M15: Inteligência Gerencial (1 módulo)

  RESULTADO: 20 módulos → 17 módulos

  CRITÉRIO PARA FUSÃO:
  ├── Mesmo tipo de operação (ambos são "estoque", "financeiro")
  ├── Usados pelo mesmo perfil de usuário
  ├── Dados que se complementam na mesma tela
  └── Nenhuma fusão perde funcionalidade

  CRITÉRIO PARA NÃO FUNDIR:
  ├── M04 (Fornecedores) ≠ M08 (Compras): master data vs transação
  ├── M05 (Produtos) ≠ M06 (Fórmulas): catálogo vs receita
  ├── M02 (Empresa) ≠ M03 (Usuários): configuração vs pessoas
  └── M19 (Notificações) ≠ M20 (Logs): diferentes públicos e fins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA COMPLETO — ESTRUTURA NOVA (17 MÓDULOS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔══════════════════════════════════════════════════════════════╗
║  ÁREA A — SISTEMA (3 módulos | sem mudança)                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 01 - AUTENTICAÇÃO E SEGURANÇA                        ║
║  ├── Origem: M01 (sem alteração)                            ║
║  ├── Função: Login, MFA, recuperação de senha               ║
║  └── Perfil: Todos (ponto de entrada do sistema)            ║
║                                                              ║
║  MÓDULO 02 - CONFIGURAÇÕES DA EMPRESA                        ║
║  ├── Origem: M02 (sem alteração, agora com 6 abas)          ║
║  ├── Função: Dados, documentos, alertas, financeiro, score  ║
║  └── Perfil: Somente Admin                                  ║
║                                                              ║
║  MÓDULO 03 - GESTÃO DE USUÁRIOS E PERMISSÕES                 ║
║  ├── Origem: M03 (sem alteração)                            ║
║  ├── Função: Cadastro de usuários, matriz RBAC              ║
║  └── Perfil: Somente Admin                                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA B — CADASTROS BASE (5 módulos | sem mudança)           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 04 - CADASTRO DE FORNECEDORES                        ║
║  ├── Origem: M04 (sem alteração)                            ║
║  ├── Função: Dados, contatos, histórico, tabela de preços   ║
║  └── Perfil: Admin, Estoque, Financeiro                     ║
║                                                              ║
║  MÓDULO 05 - GESTÃO DE INSUMOS                               ║
║  ├── Origem: M07 (sem alteração)                            ║
║  ├── Função: Cadastro pai+variante, FISPQ, EPI, estoque min ║
║  └── Perfil: Admin, Estoque, Produção (R/O)                 ║
║                                                              ║
║  MÓDULO 06 - GESTÃO DE FÓRMULAS                              ║
║  ├── Origem: M06 (sem alteração)                            ║
║  ├── Função: Receitas, CQ, custo, versões, checklist        ║
║  └── Perfil: Admin, Produção (R/O), Visualizador            ║
║                                                              ║
║  MÓDULO 07 - CADASTRO DE PRODUTOS                            ║
║  ├── Origem: M05 (sem alteração)                            ║
║  ├── Função: Produtos, embalagens, SKU, ficha técnica       ║
║  └── Perfil: Admin, Vendas (R/O), Visualizador              ║
║                                                              ║
║  MÓDULO 08 - CADASTRO DE CLIENTES                            ║
║  ├── Origem: M12 (sem alteração)                            ║
║  ├── Função: Dados, score, histórico, crédito               ║
║  └── Perfil: Admin, Vendas, Financeiro (R/O)                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA C — SUPRIMENTOS (1 módulo | sem mudança)               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 09 - COMPRAS DE INSUMOS                              ║
║  ├── Origem: M08 (sem alteração)                            ║
║  ├── Função: Solicitação, pedido, recebimento, devolução    ║
║  │   Atualiza PMP e gera Conta a Pagar automaticamente      ║
║  └── Perfil: Admin, Estoque, Financeiro (R/O)               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA D — ESTOQUE (1 módulo | FUSÃO DE M10 + M11)            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 10 - CONTROLE DE ESTOQUE ⭐ NOVO (fusão M10 + M11)  ║
║  ├── Origem: M10 (Estoque Insumos) + M11 (Est. Produtos)    ║
║  ├── Função: Posição, movimentações, ajustes e inventário   ║
║  │   para AMBOS os tipos de item (insumos e produtos)       ║
║  ├── ABA 01: Estoque de Insumos (vinha do M10)             ║
║  │   ├── Posição por insumo/variante                        ║
║  │   ├── Saldo, PMP, localização, status                    ║
║  │   └── Alertas de mínimo e vencimento                     ║
║  ├── ABA 02: Estoque de Produtos Acabados (vinha do M11)   ║
║  │   ├── Posição por produto/embalagem/lote                 ║
║  │   ├── Granel, amostras, uso interno                      ║
║  │   ├── Quarentena (Reprocessar/Liberar/Descartar)         ║
║  │   └── Sugestões de produção automáticas                  ║
║  ├── ABA 03: Movimentações (entradas/saídas/ajustes)        ║
║  │   ├── Histórico unificado de todos os itens              ║
║  │   └── Filtro por tipo: insumo ou produto                 ║
║  ├── ABA 04: Inventário Físico (antes separado nos 2)       ║
║  │   ├── Escopo configurável: insumos, produtos ou ambos    ║
║  │   ├── Contagem, conciliação, aprovação                   ║
║  │   └── Relatório de diferenças                            ║
║  └── Perfil: Admin, Estoque, Produção (insumos R/O)         ║
║                                                              ║
║  POR QUE FUNDIR M10 + M11?                                  ║
║  ├── Mesma operação: posição e movimentação de estoque      ║
║  ├── Inventário físico era compartilhado nos 2 módulos      ║
║  ├── Admin e Estoque usam os dois juntos o tempo todo       ║
║  └── Evita navegar entre 2 módulos para ver "o estoque"     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA E — PRODUÇÃO (1 módulo | sem mudança)                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 11 - GESTÃO DE PRODUÇÃO                              ║
║  ├── Origem: M09 (sem alteração, apenas renumerado)         ║
║  ├── Função: OP, execução, CQ, quarentena, lotes            ║
║  └── Perfil: Admin, Produção, Estoque (R/O)                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA F — COMERCIAL (2 módulos | sem mudança)                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 12 - TABELA DE PREÇOS                                ║
║  ├── Origem: M13 (sem alteração, apenas renumerado)         ║
║  ├── Função: Tabelas, descontos, promoções, simulador       ║
║  └── Perfil: Admin, Vendas (R/O)                            ║
║                                                              ║
║  MÓDULO 13 - PEDIDOS E VENDAS                                ║
║  ├── Origem: M14 (sem alteração, apenas renumerado)         ║
║  ├── Função: Orçamento, pedido, separação, devolução        ║
║  └── Perfil: Admin, Vendas, Financeiro (R/O)                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA G — FINANCEIRO (1 módulo | FUSÃO DE M15 + M16)         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 14 - GESTÃO FINANCEIRA ⭐ NOVO (fusão M15 + M16)    ║
║  ├── Origem: M15 (Contas a Receber) + M16 (Contas a Pagar) ║
║  ├── Função: Controle financeiro completo em uma tela só    ║
║  ├── ABA 01: Contas a Receber (vinha do M15)               ║
║  │   ├── Parcelas geradas por pedidos concluídos            ║
║  │   ├── Registros de recebimento (total/parcial)           ║
║  │   ├── Estornos e devoluções                              ║
║  │   └── Inadimplência e alertas de vencimento             ║
║  ├── ABA 02: Contas a Pagar (vinha do M16)                 ║
║  │   ├── Parcelas geradas por compras recebidas             ║
║  │   ├── Calendário de pagamentos                           ║
║  │   └── Aging report (0-30, 31-60, 61-90 dias)            ║
║  ├── ABA 03: Fluxo de Caixa (dado novo integrado)          ║
║  │   ├── Projeção combinada: a receber vs a pagar           ║
║  │   ├── Saldo líquido por período                          ║
║  │   └── Gráfico de barras agrupadas                        ║
║  └── Perfil: Admin, Financeiro, Visualizador                ║
║                                                              ║
║  POR QUE FUNDIR M15 + M16?                                  ║
║  ├── Profissional de Financeiro usa os dois ao mesmo tempo  ║
║  ├── Fluxo de caixa precisa dos 2 para existir             ║
║  ├── Mesmo perfil de acesso (Admin, Financeiro)             ║
║  └── A visão unificada é mais poderosa que separada         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA H — ANÁLISE E GESTÃO (1 módulo | FUSÃO DE M17 + M18)  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 15 - INTELIGÊNCIA GERENCIAL ⭐ NOVO (M17 + M18)     ║
║  ├── Origem: M17 (Dashboard) + M18 (Relatórios)            ║
║  ├── Função: Visibilidade total do negócio em 1 módulo      ║
║  ├── ABA 01: Dashboard (vinha do M17)                      ║
║  │   ├── KPIs em tempo real (cards)                         ║
║  │   ├── Gráficos de evolução                               ║
║  │   ├── Alertas rápidos                                    ║
║  │   └── Visibilidade por perfil                            ║
║  ├── ABA 02: Relatórios (vinha do M18)                     ║
║  │   ├── Relatórios por categoria (Estoque/Vendas/Finac.)   ║
║  │   ├── Filtros dinâmicos e drill-down                     ║
║  │   ├── Exportação PDF/Excel/CSV                           ║
║  │   └── Agendamentos por email                             ║
║  └── Perfil: Admin, Visualizador (total) + outros perfis   ║
║       conforme permissão de cada relatório                  ║
║                                                              ║
║  POR QUE FUNDIR M17 + M18?                                  ║
║  ├── Mesmo objetivo: ver e analisar dados do negócio        ║
║  ├── Dashboard é a entrada; Relatório é o aprofundamento    ║
║  ├── Drill-down natural: card no dashboard → relatório      ║
║  └── Admin usa sempre os dois juntos                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ÁREA I — SISTEMA TRANSVERSAL (2 módulos | sem mudança)      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÓDULO 16 - NOTIFICAÇÕES E ALERTAS                          ║
║  ├── Origem: M19 (sem alteração, apenas renumerado)         ║
║  ├── Função: Sino, central de notificações, preferências    ║
║  └── Perfil: Todos (personalizado por perfil)               ║
║                                                              ║
║  MÓDULO 17 - LOGS E AUDITORIA                                ║
║  ├── Origem: M20 (sem alteração, apenas renumerado)         ║
║  ├── Função: Registro de todas as ações do sistema          ║
║  └── Perfil: Somente Admin                                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TABELA DE CONVERSÃO: ANTES → DEPOIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  NUMERAÇÃO ANTIGA  →  NUMERAÇÃO NOVA       MUDANÇA
  ─────────────────────────────────────────────────────────
  M01 Autenticação  →  M01 Autenticação     Sem mudança
  M02 Config.Empr.  →  M02 Config.Empr.     Sem mudança
  M03 Usuários      →  M03 Usuários         Sem mudança
  M04 Fornecedores  →  M04 Fornecedores     Sem mudança
  M05 Produtos      →  M07 Produtos         Renumerado
  M06 Fórmulas      →  M06 Fórmulas         Sem mudança
  M07 Insumos       →  M05 Insumos          Renumerado
  M08 Compras       →  M09 Compras          Renumerado
  M09 Produção      →  M11 Produção         Renumerado
  M10 Est.Insumos   →  M10 Ctrl.Estoque     ⭐ FUNDIDO
  M11 Est.Produtos  →  (fundido ao M10)     ⭐ ABSORVIDO
  M12 Clientes      →  M08 Clientes         Renumerado
  M13 Preços        →  M12 Preços           Renumerado
  M14 Pedidos       →  M13 Pedidos          Renumerado
  M15 Ct.Receber    →  M14 Gest.Financeira  ⭐ FUNDIDO
  M16 Ct.Pagar      →  (fundido ao M14)     ⭐ ABSORVIDO
  M17 Dashboard     →  M15 Intel.Gerencial  ⭐ FUNDIDO
  M18 Relatórios    →  (fundido ao M15)     ⭐ ABSORVIDO
  M19 Notificações  →  M16 Notificações     Renumerado
  M20 Logs          →  M17 Logs             Renumerado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAMA DE FLUXO — NOVO SISTEMA (17 MÓDULOS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────────┐
  │  SISTEMA (M01 · M02 · M03)                     │
  │  Login · Configurações · Usuários               │
  └────────────────────┬────────────────────────────┘
                       │ base para todos
  ┌────────────────────▼────────────────────────────┐
  │  CADASTROS (M04 · M05 · M06 · M07 · M08)       │
  │  Fornec · Insumos · Fórmulas · Produtos · Clien.│
  └──────┬──────────────────┬──────────────┬────────┘
         │                  │              │
  ┌──────▼──────┐   ┌───────▼──────┐  ┌───▼──────────┐
  │ SUPRIMENTOS │   │   PRODUÇÃO   │  │  COMERCIAL   │
  │ M09 Compras │   │M11 Produção  │  │ M12 Preços   │
  └──────┬──────┘   └──────┬───────┘  │ M13 Pedidos  │
         │                 │          └──────┬────────┘
  ┌──────▼─────────────────▼──────────┐      │
  │     ESTOQUE (M10)                 │      │
  │ Insumos · Produtos · Inventário   │◄─────┘
  └────────────────────┬──────────────┘
                       │
  ┌────────────────────▼────────────────────────────┐
  │  FINANCEIRO (M14)                               │
  │  Contas a Receber · Contas a Pagar · Fluxo Cx.  │
  └────────────────────┬────────────────────────────┘
                       │
  ┌────────────────────▼────────────────────────────┐
  │  ANÁLISE (M15)                                  │
  │  Dashboard · Relatórios Gerenciais              │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────┐
  │  TRANSVERSAL  M16 Notificações · M17 Logs       │
  │  (recebem eventos de todos os módulos acima)    │
  └─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACTO NOS ARQUIVOS DE MÓDULO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  AÇÃO NECESSÁRIA      ARQUIVO                        ESFORÇO
  ──────────────────────────────────────────────────────────
  Renumerar            M05→M07, M07→M05               Baixo
  Renumerar            M08→M09, M09→M11               Baixo
  Renumerar            M12→M08, M13→M12, M14→M13      Baixo
  Renumerar            M19→M16, M20→M17               Baixo
  Fundir/reescrever    M10 + M11 → novo M10            Alto
  Fundir/reescrever    M15 + M16 → novo M14            Médio
  Fundir/reescrever    M17 + M18 → novo M15            Médio

  ⚠️ AGUARDANDO APROVAÇÃO ANTES DE APLICAR AS FUSÕES
  Este documento é uma PROPOSTA. Os arquivos de módulo
  não foram alterados ainda. Aguardando confirmação.

╚══════════════════════════════════════════════════════════════╝
