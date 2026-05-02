╔══════════════════════════════════════════════════════════════╗
║         MÓDULO 10 - CONTROLE DE ESTOQUE                     ║
║         ✅ FECHADO - VERSÃO ATUALIZADA                       ║
╠══════════════════════════════════════════════════════════════╣
║  ORIGEM: Fusão de M10 (Est. Insumos) + M11 (Est. Produtos)  ║
║  FUNÇÃO: Controlar saldo, movimentações e inventário        ║
║          de todos os itens do sistema (insumos e produtos)  ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║ ABA 01 - ESTOQUE DE INSUMOS                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  POSIÇÃO DE ESTOQUE DE INSUMOS                              ║
║  ├── Lista de todos os insumos e variantes                  ║
║  ├── Por insumo/variante exibe:                             ║
║  │   ├── Código e nome (pai + variante)                     ║
║  │   ├── Categoria                                          ║
║  │   ├── Saldo atual (quantidade + unidade)                 ║
║  │   ├── Valor unitário (PMP) — camuflado por perfil        ║
║  │   ├── Valor total em estoque (R$) — camuflado            ║
║  │   ├── Estoque mínimo / máximo                            ║
║  │   ├── Status: 🟢 Normal | 🟡 Atenção | 🔴 Crítico       ║
║  │   ├── Localização                                        ║
║  │   └── Validade mais próxima (se aplicável)               ║
║  ├── Totalizadores:                                         ║
║  │   ├── Total de insumos e variantes                       ║
║  │   ├── Em estoque crítico                                 ║
║  │   └── Valor total do estoque (R$)                        ║
║  └── Filtros: categoria | status | local | vencimento       ║
║                                                              ║
║  CONTROLE POR LOTE                                          ║
║  ├── Múltiplos lotes por insumo/variante                    ║
║  ├── Método FEFO (primeiro que vence, sai primeiro)         ║
║  ├── Validade opcional (sem validade = "Indeterminada")     ║
║  └── Alertas: 🔵 60d | 🟡 30d | 🟠 15d | 🔴 7d           ║
║                                                              ║
║  CONSUMO E PREVISÕES                                        ║
║  ├── Consumo médio: [30d] [60d] [90d]                       ║
║  ├── Previsão de duração e data de ruptura                  ║
║  └── Sugestão de reposição → lista de compras               ║
║                                                              ║
║  VALORIZAÇÃO (PMP)                                          ║
║  ├── Valor por insumo/variante                              ║
║  ├── Valor total do estoque                                 ║
║  └── Snapshot automático dia 1º do mês                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - ESTOQUE DE PRODUTOS ACABADOS                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  POSIÇÃO DE ESTOQUE DE PRODUTOS                             ║
║  ├── Lista de produtos por embalagem (SKU)                  ║
║  ├── Por produto/embalagem exibe:                           ║
║  │   ├── Produto, embalagem, SKU, lote                      ║
║  │   ├── Saldo fracionado (caixas/unidades)                 ║
║  │   ├── Saldo a granel (kg/L)                              ║
║  │   ├── Reservado em pedidos (não disponível)              ║
║  │   ├── Disponível para venda                              ║
║  │   ├── Custo PMP (camuflado por perfil)                   ║
║  │   ├── Preço potencial de venda                           ║
║  │   └── Margem potencial (%) — somente Admin/Financeiro    ║
║  ├── Totalizadores por produto                              ║
║  └── Filtros: produto | embalagem | lote | vencimento       ║
║                                                              ║
║  AMOSTRAS E USO INTERNO                                     ║
║  ├── Tipo: 🎁 Amostra | 🏭 Uso Interno                     ║
║  ├── Destino, quantidade, responsável, observação           ║
║  ├── Baixa automática do estoque (FEFO)                     ║
║  └── Histórico por produto e por cliente                    ║
║                                                              ║
║  PRODUTOS EM QUARENTENA                                     ║
║  ├── Lotes reprovados no CQ (oriundos do Módulo 11)        ║
║  ├── Ações disponíveis (mesma lógica do Módulo 11):        ║
║  │   ├── 🔄 Reprocessar (devolve à produção)              ║
║  │   ├── ✅ Liberar (aprovado após revisão)                ║
║  │   └── 🗑️ Descartar (baixa com registro de perda)       ║
║  └── ⚠️ Tela compartilhada entre Módulos 10 e 11           ║
║                                                              ║
║  SUGESTÕES DE PRODUÇÃO                                      ║
║  ├── Automática: quando saldo < estoque mínimo              ║
║  ├── Sugestão com quantidade e fórmula vinculada            ║
║  └── Botão "Criar OP" (gera ordem no Módulo 11)            ║
║                                                              ║
║  FRACIONAMENTO DE GRANEL                                    ║
║  ├── Baixa de granel → entrada de fracionados               ║
║  ├── Rastreabilidade mantida por lote                       ║
║  └── Atualização automática de saldos                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - MOVIMENTAÇÕES E AJUSTES                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MOVIMENTAÇÕES UNIFICADAS (insumos + produtos)              ║
║  ├── ⬆️ Entrada: compra | produção concluída | ajuste +    ║
║  ├── ⬇️ Saída: produção | venda | descarte | ajuste -      ║
║  ├── 🔄 Transferência entre locais de armazenagem           ║
║  └── Filtro: 🔘 Insumos | 🔘 Produtos | 🔘 Todos           ║
║                                                              ║
║  AJUSTE MANUAL (insumos e produtos)                         ║
║  ├── Motivo obrigatório                                     ║
║  ├── Log de auditoria sempre registrado (Módulo 17)        ║
║  └── Notificação ao Admin quando outro perfil ajusta        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - INVENTÁRIO FÍSICO                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ESCOPO CONFIGURÁVEL AO INICIAR:                            ║
║  ├── 🔘 Inventário completo (insumos + produtos)            ║
║  ├── 🔘 Somente insumos                                     ║
║  └── 🔘 Somente produtos acabados                           ║
║                                                              ║
║  FLUXO DO INVENTÁRIO:                                       ║
║  ├── 1. Iniciar: gera lista de contagem                    ║
║  │   └── Movimentações normais continuam (marcadas)        ║
║  ├── 2. Contar: preencher quantidades físicas               ║
║  │   └── App mobile friendly (campo numérico simples)      ║
║  ├── 3. Conferir: visualizar diferenças sistema vs físico   ║
║  │   ├── ✅ Igual | ➕ Sobra | ➖ Falta                     ║
║  │   └── Diferenças destacadas em vermelho                  ║
║  ├── 4. Aprovar: Admin confirma os ajustes                  ║
║  │   └── Ajustes aplicados com log de auditoria             ║
║  └── 5. Relatório: histórico do inventário                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ ABA 01 - Estoque de Insumos                         ║
║  │   ├── Posição / Detalhe / Lotes                          ║
║  │   └── Transferência entre Locais                         ║
║  ├── 🖥️ ABA 02 - Estoque de Produtos                        ║
║  │   ├── Posição / Detalhe / Lotes                          ║
║  │   ├── Amostras e Uso Interno                             ║
║  │   ├── Quarentena                                         ║
║  │   ├── Fracionamento de Granel                            ║
║  │   └── Sugestões de Produção                              ║
║  ├── 🖥️ ABA 03 - Movimentações e Ajustes                    ║
║  └── 🖥️ ABA 04 - Inventário Físico                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║  ├── M05 (Insumos): Estrutura pai+variante, min/max         ║
║  ├── M07 (Produtos): Catálogo, SKUs, fórmula vinculada      ║
║  ├── M09 (Compras): Entradas de insumos via recebimento     ║
║  ├── M11 (Produção): Baixa de insumos e entrada de produtos ║
║  ├── M13 (Pedidos): Reserva e baixa de produtos em vendas  ║
║  ├── M14 (Financeiro): Valorização para relatórios contábeis║
║  ├── M15 (Análise): KPIs de estoque no dashboard           ║
║  ├── M16 (Notificações): Alertas mínimo/vencimento          ║
║  └── M17 (Logs): Registro de todos os ajustes              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ PERFIS DE ACESSO                                             ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 👑 Admin: acesso total, ajustes, inventário            ║
║  ├── 📦 Estoque: acesso total (valores mascarados)          ║
║  ├── 🏭 Produção: insumos R/O (saldos sem valores)         ║
║  ├── 🛒 Vendas: produtos R/O (disponível p/ venda)         ║
║  ├── 💳 Financeiro: valorização contábil                    ║
║  └── 👁️ Visualizador: tudo R/O com valores visíveis        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐⭐ Muito Alta                            ║
║ (fusão de dois módulos com lógicas complementares,          ║
║  inventário unificado, múltiplos perfis com visibilidades)  ║
╚══════════════════════════════════════════════════════════════╝
