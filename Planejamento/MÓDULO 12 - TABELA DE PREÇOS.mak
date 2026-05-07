╔══════════════════════════════════════════════════════════════╗
║              MÓDULO 13 - TABELA DE PREÇOS                   ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Gerenciar preços de venda por perfil de cliente    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS DA TABELA                                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Código automático (TAB-001)                             ║
║  ├── Nome da tabela              (obrigatório)               ║
║  ├── Descrição                   (opcional)                  ║
║  ├── Baseada em outra tabela?    [S/N]                       ║
║  │   ├── SE SIM:                                            ║
║  │   │   ├── Tabela base                                    ║
║  │   │   ├── ➖ Desconto [__]% ou ➕ Acréscimo [__]%       ║
║  │   │   └── Atualização automática ao reajustar base       ║
║  │   └── SE NÃO: preços manuais por produto                 ║
║  ├── Desconto máximo permitido (%)                           ║
║  ├── Margem mínima configurável (%)                          ║
║  ├── Vigência:                                               ║
║  │   ├── Data início             (obrigatório)               ║
║  │   └── Data fim                (opcional)                  ║
║  └── Status: 🟢 Ativa | 🔴 Inativa                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - PREÇOS POR PRODUTO                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── POR PRODUTO/EMBALAGEM:                                  ║
║  │   ├── Custo unitário (PMP)    (automático)                ║
║  │   ├── Preço de venda          (obrigatório)               ║
║  │   ├── Margem R$ e %           (automático)                ║
║  │   └── ⚠️ Alerta se margem negativa ou abaixo do mínimo  ║
║  │                                                          ║
║  ├── DESCONTO PROGRESSIVO (opcional por produto):            ║
║  │   ├── Faixa 1: 1 a X un → preço normal                  ║
║  │   ├── Faixa 2: X+1 a Y un → -[__]%                     ║
║  │   ├── Faixa 3: Y+1 a Z un → -[__]%                     ║
║  │   └── Faixa 4: Z+1+ un → -[__]%                        ║
║  │                                                          ║
║  └── PREÇO MÍNIMO por produto (opcional)                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - CLIENTES VINCULADOS                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Lista de clientes usando esta tabela                   ║
║  ├── Sugestão automática por tipo de cliente:               ║
║  │   ├── Consumidor Final → Varejo                         ║
║  │   ├── Revendedor → Revendedor                           ║
║  │   ├── Atacado → Atacado                                 ║
║  │   └── Distribuidor → Distribuidor                       ║
║  └── Troca de tabela:                                       ║
║      ├── Pedidos em andamento: mantém tabela anterior       ║
║      └── Novos pedidos: usa nova tabela                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ PREÇOS INDIVIDUAIS POR CLIENTE                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Preço negociado por produto para cliente específico    ║
║  ├── Validade (início e fim opcionais)                      ║
║  └── PRIORIDADE DE PREÇO NA VENDA:                          ║
║      ├── 1º Preço individual do cliente                     ║
║      ├── 2º Tabela vinculada ao cliente                     ║
║      └── 3º Tabela padrão do tipo de cliente                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ REAJUSTE DE PREÇOS                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── REAJUSTE EM LOTE:                                       ║
║  │   ├── Toda a tabela ou por categoria/produto             ║
║  │   ├── ➕ Aumento % | ➖ Redução % | 💰 Valor fixo        ║
║  │   └── Preview antes de confirmar                         ║
║  │                                                          ║
║  ├── GATILHO INTELIGENTE:                                    ║
║  │   └── Quando custo de insumo sobe:                       ║
║  │       Alerta com impacto nos preços e margens            ║
║  │                                                          ║
║  ├── REAJUSTE PROGRAMADO:                                    ║
║  │   └── Agendar para data futura                           ║
║  │                                                          ║
║  └── HISTÓRICO DE PREÇOS:                                    ║
║      ├── Preço atual e anterior                             ║
║      ├── Data e usuário que alterou                         ║
║      └── Motivo do reajuste (opcional)                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ PROMOÇÕES POR PERÍODO                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Nome da promoção                                        ║
║  ├── Produto(s) e tabela(s) que se aplica                   ║
║  ├── Desconto % ou preço fixo promocional                   ║
║  ├── Data início e fim (obrigatório)                        ║
║  ├── Limite de unidades (opcional)                          ║
║  ├── Badge "PROMOÇÃO" no produto durante vigência           ║
║  ├── Volta ao preço normal ao expirar (automático)          ║
║  └── Alerta 3 dias antes de expirar                         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DESCONTO PROGRESSIVO POR QUANTIDADE                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Configurável por produto e tabela                      ║
║  ├── Até 4 faixas de quantidade                             ║
║  ├── Aplicado automaticamente na venda                      ║
║  ├── Dica visual: "Compre X a mais e ganhe Y% off"          ║
║  └── REGRA DE COMBINAÇÃO:                                    ║
║      ├── Progressivo + tabela: ✅ OK                        ║
║      ├── Progressivo + promoção: usa o maior                ║
║      └── Progressivo + desconto manual: respeita limite     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ SIMULADOR DE PREÇOS                                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Acesso: menu principal e dentro do pedido              ║
║  ├── SIMULAÇÃO POR PRODUTO:                                  ║
║  │   ├── Selecionar produto/embalagem                       ║
║  │   ├── Selecionar tabela ou cliente                       ║
║  │   ├── Informar quantidade                                ║
║  │   ├── Informar desconto (%)                              ║
║  │   └── Exibe em tempo real:                               ║
║  │       ├── Preço tabela: R$ xx,xx                         ║
║  │       ├── (-) Desconto: R$ xx,xx                         ║
║  │       ├── (=) Preço final: R$ xx,xx                      ║
║  │       ├── Custo: R$ xx,xx                                ║
║  │       ├── Margem R$ e %                                  ║
║  │       └── Lucro total: R$ xx,xx                          ║
║  │                                                          ║
║  ├── SIMULAÇÃO DE PEDIDO COMPLETO:                           ║
║  │   └── Vários produtos na mesma simulação                 ║
║  │                                                          ║
║  ├── COMPARATIVO ENTRE TABELAS:                              ║
║  │   └── Mesmo produto em todas as tabelas                  ║
║  │       (preço | margem | lucro)                           ║
║  │                                                          ║
║  └── Exportar simulação em PDF                              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 05 (Produtos): Custo unitário (PMP) do         ║
║  │   produto/embalagem para calcular margem.               ║
║  ├── Módulo 06 (Fórmulas): Custo da fórmula atualiza       ║
║  │   o custo do produto, impactando as tabelas.            ║
║  ├── Módulo 11 (Estoque Produtos): Preço potencial de      ║
║  │   venda é baseado na tabela ativa do cliente padrão.    ║
║  ├── Módulo 12 (Clientes): Vincula tabela de preço ao      ║
║  │   cliente; gerencia preços individuais (overrides).     ║
║  ├── Módulo 14 (Vendas): Prioridade de preço aplicada no   ║
║  │   pedido; desconto progressivo e promocional;           ║
║  │   simulador integrado à tela do pedido.                 ║
║  ├── Módulo 15 (Financeiro): Margem de lucro obtida via    ║
║  │   comparativo entre preço de venda e custo total.       ║
║  ├── Módulo 19 (Notificações): Gatilho inteligente de      ║
║  │   custo alerta quando margens são impactadas.           ║
║  └── Módulo 20 (Logs): Histórico de alterações de preços   ║
║      e reajustes nas tabelas.                              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE TABELAS                                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Nome, status, vigência                                  ║
║  ├── Quantidade de clientes vinculados                      ║
║  ├── Se é baseada em outra tabela                           ║
║  └── Ações: editar | reajustar | inativar                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🖥️ Lista de Tabelas de Preço                           ║
║  ├── 🖥️ Cadastro/Edição de Tabela (3 abas)                  ║
║  │   ├── Aba 01: Dados da Tabela                            ║
║  │   ├── Aba 02: Preços por Produto                         ║
║  │   └── Aba 03: Clientes Vinculados                        ║
║  ├── 🖥️ Reajuste em Lote                                    ║
║  ├── 🖥️ Gestão de Promoções                                 ║
║  └── 🖥️ Simulador de Preços                                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐ Alta                                   ║
║ (subiu de ⭐⭐⭐ pela inclusão de tabela baseada em outra,   ║
║  promoções, desconto progressivo e simulador completo)      ║
╚══════════════════════════════════════════════════════════════╝