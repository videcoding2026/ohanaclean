╔══════════════════════════════════════════════════════════════╗
║         MÓDULO 14 - GESTÃO FINANCEIRA                       ║
║         ✅ FECHADO - VERSÃO ATUALIZADA                       ║
╠══════════════════════════════════════════════════════════════╣
║  ORIGEM: Fusão de M15 (Ct.Receber) + M16 (Ct.Pagar)        ║
║  FUNÇÃO: Recebimentos, pagamentos e fluxo de caixa          ║
║  ⚠️ ATUALIZAÇÃO: Integração com Compras ajustada           ║
║    - Contas a Pagar: geradas ao CONFIRMAR PEDIDO (M09)     ║
║    - Não mais ao RECEBER (mudança de regra)                ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║ ABA 01 - CONTAS A RECEBER                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Geração automática ao CONCLUIR pedido (Módulo 13)      ║
║  ├── Parcelamento: à vista | 30d | 30/60d | personalizado   ║
║  │                                                          ║
║  ├── REGISTRO DE RECEBIMENTO:                               ║
║  │   ├── Valor total ou parcial                             ║
║  │   ├── Forma: 💵 Dinheiro | 📱 PIX | 📄 Boleto           ║
║  │   ├──       💳 Cartão | 🏦 Transferência | 📝 Cheque    ║
║  │   └── Comprovante e observações (opcional)               ║
║  │                                                          ║
║  ├── ESTORNOS: crédito ao cliente ou abate de parcelas      ║
║  │                                                          ║
║  ├── STATUS: 🟡 Aberta | 🔴 Vencida | 🟢 Paga             ║
║  │           ⚠️ Parcial | ❌ Cancelada                      ║
║  │                                                          ║
║  ├── ALERTAS: vence hoje | amanhã | 7d | vencida +15d      ║
║  │                                                          ║
║  ├── RELATÓRIOS:                                            ║
║  │   ├── Contas em aberto (cliente / faixa de idade)        ║
║  │   ├── Inadimplência (ranking, % da carteira)             ║
║  │   └── Previsão de recebimentos (30/60/90 dias)           ║
║  │                                                          ║
║  └── TELAS:                                                 ║
║      ├── 🖥️ Lista de Contas a Receber                       ║
║      ├── 🖥️ Registro de Recebimento (modal)                 ║
║      └── 🖥️ Relatório de Inadimplência                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - CONTAS A PAGAR                                     ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Geração automática ao CONFIRMAR PEDIDO (Módulo 09)     ║
║  │   ⚠️ ATUALIZADO: antes era "ao RECEBER", agora é       ║
║  │   "ao CONFIRMAR PEDIDO" (a dívida existe no pedido)     ║
║  │   Status inicial: Paga (PIX/cartão) ou Aberta (boleto)  ║
║  ├── Parcelamento: à vista | 30d | 30/60d | parcelado       ║
║  ├── Lançamentos manuais (aluguel, energia, serviços)       ║
║  │                                                          ║
║  ├── REGISTRO DE PAGAMENTO:                                 ║
║  │   ├── Valor total ou parcial                             ║
║  │   ├── Formas de pagamento (iguais ao ABA 01)            ║
║  │   └── Comprovante e observações (opcional)               ║
║  │                                                          ║
║  ├── STATUS: 🟡 Aberta | 🔴 Vencida | 🟢 Paga             ║
║  │           ⚠️ Parcial | ❌ Cancelada                      ║
║  │                                                          ║
║  ├── ALERTAS: vence hoje | amanhã | 7d | vencida +3d       ║
║  │                                                          ║
║  ├── RELATÓRIOS:                                            ║
║  │   ├── Contas em aberto (fornecedor / faixa de idade)     ║
║  │   └── Aging report (0-30 | 31-60 | 61-90 | +90 dias)   ║
║  │                                                          ║
║  └── TELAS:                                                 ║
║      ├── 🖥️ Lista de Contas a Pagar                         ║
║      ├── 🖥️ Registro de Pagamento (modal)                   ║
║      ├── 🖥️ Calendário de Pagamentos                        ║
║      └── 🖥️ Aging Report                                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - FLUXO DE CAIXA                                     ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Período: Semana | Mês | Trimestre | Ano                ║
║  ├── Entradas previstas (A Receber em aberto)               ║
║  ├── Saídas previstas (A Pagar em aberto)                   ║
║  ├── Saldo líquido projetado (✅ positivo / ⚠️ negativo)    ║
║  ├── Gráfico: barras agrupadas Entradas vs Saídas           ║
║  ├── Gráfico: linha de saldo acumulado                      ║
║  └── 🖥️ Tela de Fluxo de Caixa (gráficos + tabela)         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║  ├── M09 (Compras): gera contas a pagar automaticamente    ║
║  ├── M13 (Pedidos): gera contas a receber automaticamente  ║
║  ├── M04 (Fornecedores): dados bancários para pagamentos    ║
║  ├── M08 (Clientes): histórico financeiro, inadimplência    ║
║  ├── M02 (Config.): moeda, casas decimais, thresholds       ║
║  ├── M15 (Análise): KPIs financeiros no dashboard          ║
║  ├── M16 (Notificações): alertas de vencimento             ║
║  └── M17 (Logs): registro de todos os lançamentos          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ PERFIS: Admin ✅ | Financeiro ✅ | Visualizador 👁️         ║
║ COMPLEXIDADE: ⭐⭐⭐⭐ Alta                                   ║
╚══════════════════════════════════════════════════════════════╝
