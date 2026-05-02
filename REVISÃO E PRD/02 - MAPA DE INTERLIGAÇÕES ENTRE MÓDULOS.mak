╔══════════════════════════════════════════════════════════════╗
║        MAPA DE INTERLIGAÇÕES ENTRE MÓDULOS                  ║
║           Sistema CleanManager - Análise Completa           ║
╠══════════════════════════════════════════════════════════════╣
║  Legenda:  ──►  Alimenta / Gera dado                        ║
║            ◄──  Consome / Lê dado                           ║
║            ◄──► Troca bidirecional de dados                 ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║  CAMADA 1 - FUNDAÇÃO DO SISTEMA (Módulos 01, 02, 03)        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  M01 AUTENTICAÇÃO ──► M02  (usa logo/nome da empresa)       ║
║  M01 AUTENTICAÇÃO ◄── M03  (recebe regras de sessão/2FA)    ║
║  M01 AUTENTICAÇÃO ──► M19  (dispara alertas de segurança)   ║
║  M01 AUTENTICAÇÃO ──► M20  (registra login/logout/bloqueios)║
║                                                              ║
║  M02 CONFIG.EMPRESA ──► M01  (dados para emails e login)    ║
║  M02 CONFIG.EMPRESA ──► M03  (parâmetros p/ novos usuários) ║
║  M02 CONFIG.EMPRESA ──► M04,05,07,12 (modelos importação)   ║
║  M02 CONFIG.EMPRESA ──► M13  (margem mínima, metas)         ║
║  M02 CONFIG.EMPRESA ──► M14,08  (numeração de documentos)   ║
║  M02 CONFIG.EMPRESA ──► M15,16  (moeda, casas decimais)     ║
║  M02 CONFIG.EMPRESA ──► M17  (metas de vendas)              ║
║  M02 CONFIG.EMPRESA ──► M19  (thresholds de alertas)        ║
║  M02 CONFIG.EMPRESA ──► M20  (período de retenção de logs)  ║
║  M02 CONFIG.EMPRESA ──► M12  (critérios de score) [NOVO]    ║
║                                                              ║
║  M03 PERMISSÕES ──► TODOS M04 a M20  (controla acesso)      ║
║  M03 PERMISSÕES ──► M01  (aplica tempo de sessão)           ║
║  M03 PERMISSÕES ──► M19  (notifica bloqueios/inativações)   ║
║  M03 PERMISSÕES ──► M20  (registra alterações de usuários)  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  CAMADA 2 - CADASTROS BASE (Módulos 04, 05, 06, 07, 12)     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  M04 FORNECEDORES ◄──► M07  (fornecedores vinculados)       ║
║  M04 FORNECEDORES ◄──► M08  (dados comerciais p/ compras)   ║
║  M04 FORNECEDORES ──► M16  (dados bancários p/ pagamento)   ║
║  M04 FORNECEDORES ◄── M08  (alimenta histórico de compras)  ║
║  M04 FORNECEDORES ──► M19  (alertas tabela desatualizada)   ║
║  M04 FORNECEDORES ──► M20  (log de criação/edição)          ║
║                                                              ║
║  M05 PRODUTOS ◄──► M06  (fórmula vinculada ao produto)      ║
║  M05 PRODUTOS ──► M07  (embalagens como variante de insumo) ║
║  M05 PRODUTOS ◄── M11  (exibe estoque atual por embalagem)  ║
║  M05 PRODUTOS ──► M13  (preços das embalagens)              ║
║  M05 PRODUTOS ──► M14  (SKU/embalagens usados em pedidos)   ║
║  M05 PRODUTOS ──► M18  (catálogo PDF)                       ║
║  M05 PRODUTOS ──► M20  (log de alterações)                  ║
║                                                              ║
║  M06 FÓRMULAS ──► M05  (custo da fórmula → custo produto)   ║
║  M06 FÓRMULAS ◄── M07  (usa insumos/variantes cadastrados)  ║
║  M06 FÓRMULAS ──► M09  (checklist e ordem de adição)        ║
║  M06 FÓRMULAS ◄── M10  (PMP atualiza custo da fórmula)     ║
║  M06 FÓRMULAS ──► M13  (custo fórmula → precificação)       ║
║  M06 FÓRMULAS ──► M19  (alerta variante inativa)            ║
║  M06 FÓRMULAS ──► M20  (histórico de versões)               ║
║                                                              ║
║  M07 INSUMOS ──► M06  (insumos pai + variantes p/ fórmulas) ║
║  M07 INSUMOS ──► M08  (compra por variante específica)      ║
║  M07 INSUMOS ──► M09  (baixa de estoque por variante)       ║
║  M07 INSUMOS ◄──► M10  (saldo e alertas por variante)       ║
║  M07 INSUMOS ──► M04  (vínculo fornecedor preferencial)     ║
║  M07 INSUMOS ──► M05  (embalagens referenciadas)            ║
║  M07 INSUMOS ──► M19  (alertas estoque mínimo/vencimento)   ║
║  M07 INSUMOS ──► M20  (log criação/edição de insumos)       ║
║                                                              ║
║  M12 CLIENTES ──► M13  (tabela de preço vinculada)          ║
║  M12 CLIENTES ◄── M14  (histórico de compras/indicadores)   ║
║  M12 CLIENTES ◄── M15  (parcelas em aberto/vencidas)        ║
║  M12 CLIENTES ◄── M11  (histórico de amostras)              ║
║  M12 CLIENTES ──► M19  (alertas aniversário/score/bloqueio) ║
║  M12 CLIENTES ──► M20  (log criação/edição/bloqueio)        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  CAMADA 3 - OPERAÇÕES (Módulos 08, 09, 10, 11, 13, 14)      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  M08 COMPRAS ──► M10  (entrada de estoque via recebimento)  ║
║  M08 COMPRAS ──► M16  (gera contas a pagar automaticamente) ║
║  M08 COMPRAS ◄── M04  (dados do fornecedor)                 ║
║  M08 COMPRAS ◄── M07  (estrutura insumo+variante)           ║
║  M08 COMPRAS ──► M19  (alertas atraso/tabela)               ║
║  M08 COMPRAS ──► M20  (log de compras)                      ║
║                                                              ║
║  M09 PRODUÇÃO ──► M11  (entrada produtos acabados)          ║
║  M09 PRODUÇÃO ──► M10  (baixa de insumos)                   ║
║  M09 PRODUÇÃO ◄── M06  (fórmula, checklist, custos)         ║
║  M09 PRODUÇÃO ◄── M07  (reserva e baixa por variante)       ║
║  M09 PRODUÇÃO ──► M14  (lotes vinculados a pedidos)         ║
║  M09 PRODUÇÃO ──► M19  (alertas OP planejada/CQ reprovado)  ║
║  M09 PRODUÇÃO ──► M20  (log execução/conclusão de OP)       ║
║                                                              ║
║  M10 ESTOQUE INSUMOS ◄──► M07  (saldo e PMP)                ║
║  M10 ESTOQUE INSUMOS ◄── M08  (entradas via compras)        ║
║  M10 ESTOQUE INSUMOS ◄── M09  (saídas via produção)         ║
║  M10 ESTOQUE INSUMOS ◄──► M11  (inventário físico conjunto) ║
║  M10 ESTOQUE INSUMOS ──► M15,16  (valorização contábil)     ║
║  M10 ESTOQUE INSUMOS ──► M19  (alertas mínimo/vencimento)   ║
║  M10 ESTOQUE INSUMOS ──► M20  (log de ajustes)              ║
║                                                              ║
║  M11 ESTOQUE PRODUTOS ◄── M09  (entrada de produtos)        ║
║  M11 ESTOQUE PRODUTOS ◄──► M10  (inventário físico)         ║
║  M11 ESTOQUE PRODUTOS ◄── M13  (preço potencial de venda)   ║
║  M11 ESTOQUE PRODUTOS ◄──► M14  (reserva/baixa via vendas)  ║
║  M11 ESTOQUE PRODUTOS ──► M15,16  (valorização contábil)    ║
║  M11 ESTOQUE PRODUTOS ──► M19  (alertas mínimo/vencimento)  ║
║  M11 ESTOQUE PRODUTOS ──► M20  (log de ajustes/inventários) ║
║                                                              ║
║  M13 TABELA PREÇOS ◄── M05  (custo unitário do produto)     ║
║  M13 TABELA PREÇOS ◄── M06  (custo fórmula impacta tabela)  ║
║  M13 TABELA PREÇOS ──► M11  (preço potencial p/ estoque)    ║
║  M13 TABELA PREÇOS ◄──► M12  (tabela vinculada ao cliente)  ║
║  M13 TABELA PREÇOS ──► M14  (prioridade de preço no pedido) ║
║  M13 TABELA PREÇOS ──► M15  (margem via custo vs. venda)    ║
║  M13 TABELA PREÇOS ──► M19  (alerta custo impacta margem)   ║
║  M13 TABELA PREÇOS ──► M20  (log de reajustes)              ║
║                                                              ║
║  M14 PEDIDOS/VENDAS ──► M15  (gera contas a receber)        ║
║  M14 PEDIDOS/VENDAS ◄──► M11  (reserva/baixa de estoque)    ║
║  M14 PEDIDOS/VENDAS ◄── M12  (dados do cliente)             ║
║  M14 PEDIDOS/VENDAS ◄── M13  (preços, descontos)            ║
║  M14 PEDIDOS/VENDAS ──► M09  (notifica produção)            ║
║  M14 PEDIDOS/VENDAS ──► M19  (alertas pedido/orçamento)     ║
║  M14 PEDIDOS/VENDAS ──► M20  (log de pedidos)               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  CAMADA 4 - FINANCEIRO (Módulos 15, 16)                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  M15 CONTAS A RECEBER ◄── M14  (gerada ao concluir pedido)  ║
║  M15 CONTAS A RECEBER ──► M12  (resumo financeiro cliente)  ║
║  M15 CONTAS A RECEBER ◄──► M16  (fluxo de caixa conjunto)  ║
║  M15 CONTAS A RECEBER ──► M19  (alertas vencimento)         ║
║  M15 CONTAS A RECEBER ──► M20  (log de recebimentos)        ║
║                                                              ║
║  M16 CONTAS A PAGAR ◄── M08  (gerada ao receber compra)     ║
║  M16 CONTAS A PAGAR ──► M04  (contas em aberto p/ fornec.)  ║
║  M16 CONTAS A PAGAR ◄──► M15  (fluxo de caixa conjunto)    ║
║  M16 CONTAS A PAGAR ──► M19  (alertas vencimento)           ║
║  M16 CONTAS A PAGAR ──► M20  (log de pagamentos)            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  CAMADA 5 - VISIBILIDADE (Módulos 17, 18, 19, 20)           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  M17 DASHBOARD ◄── M09,10,11,14,15,16  (dados dos KPIs)    ║
║  M17 DASHBOARD ◄── M02  (metas configuradas)                ║
║  M17 DASHBOARD ──► M18  (links "ver relatório completo")    ║
║  M17 DASHBOARD ◄── M19  (consolida alertas rápidos)         ║
║                                                              ║
║  M18 RELATÓRIOS ◄── M08,09,10,11,12,14,15,16  (dados)      ║
║  M18 RELATÓRIOS ◄── M02,03  (moeda, permissões)             ║
║  M18 RELATÓRIOS ◄── M17  (link drill-down do dashboard)     ║
║                                                              ║
║  M19 NOTIFICAÇÕES ◄── TODOS M01-M18  (recebe eventos)       ║
║  M19 NOTIFICAÇÕES ──► M20  (log de notificações enviadas)   ║
║  M19 NOTIFICAÇÕES ──► M17  (alertas rápidos no dashboard)   ║
║                                                              ║
║  M20 LOGS ◄── TODOS M01-M19  (recebe todos os eventos)      ║
║  M20 LOGS ──► (somente leitura, não gera ações)             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  FLUXO PRINCIPAL DO NEGÓCIO (Cadeia de Valor)               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  COMPRA ──► ESTOQUE INSUMOS ──► PRODUÇÃO ──► ESTOQUE        ║
║  M08         M10                M09          PRODUTOS M11   ║
║   │                              │                │         ║
║   ▼                              ▼                ▼         ║
║  M16                           M06              M14         ║
║  PAGAR                        FÓRMULA          VENDA        ║
║                                                   │         ║
║                                                   ▼         ║
║                                                  M15        ║
║                                                RECEBER      ║
║                                                              ║
║  SUPORTE TRANSVERSAL:                                        ║
║  M01 + M02 + M03 ──► Todos os módulos (segurança/config)   ║
║  M17 + M18 ──► Todos os módulos (visibilidade gerencial)    ║
║  M19 + M20 ──► Todos os módulos (alertas e auditoria)       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  CONFIRMAÇÃO: TODAS AS INTERLIGAÇÕES FAZEM SENTIDO          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ✅ A arquitetura é coerente e bem estruturada              ║
║  ✅ Não há módulos isolados (todos se integram)             ║
║  ✅ A cadeia de valor está completa e lógica                ║
║  ✅ Os módulos de suporte (01,02,03,19,20) são transversais ║
║  ✅ Módulos 10 e 11 são complementares (insumo/produto)     ║
║  ✅ Módulos 15 e 16 são complementares (receber/pagar)      ║
║  ✅ A separação de Módulo 17 (dashboard) e 18 (relatórios)  ║
║     faz sentido: 17 = tempo real, 18 = analítico/histórico  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
