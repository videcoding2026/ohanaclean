╔══════════════════════════════════════════════════════════════╗
║            MÓDULO 09 - GESTÃO DE PRODUÇÃO                   ║
║               ✅ FECHADO - VERSÃO ATUALIZADA                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Planejar, executar e controlar a produção          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CRIAÇÃO DA ORDEM DE PRODUÇÃO                                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Número automático (OPD-26-0001)                         ║
║  ├── Criada por Admin ou Produção                            ║
║  ├── Produto e fórmula vinculados                            ║
║  ├── Quantidade a produzir (cálculo proporcional)            ║
║  ├── Data prevista e responsável                             ║
║  │                                                           ║
║  ├── VERIFICAÇÃO AUTOMÁTICA POR VARIANTE:                    ║
║  │   └── Sistema verifica cada insumo E variante            ║
║  │       definidos na fórmula:                              ║
║  │       ├── ✅ Essência Floral: precisa 50ml, tem 2L       ║
║  │       ├── ✅ Corante Azul: precisa 30ml, tem 500ml       ║
║  │       └── ❌ Lauril: precisa 5kg, tem 3kg               ║
║  │           "Falta 2kg de Lauril"                          ║
║  │                                                           ║
║  ├── SE VARIANTE INSUFICIENTE:                               ║
║  │   ├── Lista quais variantes faltam e quanto              ║
║  │   ├── 3 opções:                                          ║
║  │   │   ├── Ajustar quantidade de produção                 ║
║  │   │   ├── Produzir com o que tem                         ║
║  │   │   └── Cancelar                                       ║
║  │   └── 💡 Sugerir variante substituta se disponível:      ║
║  │       "Essência Floral em falta.                         ║
║  │        Substituta: Essência Lavanda                      ║
║  │        Estoque: 1,5L | Proporção: 1:1"                   ║
║  │       [USAR SUBSTITUTA] [AGUARDAR]                       ║
║  │                                                           ║
║  └── RESERVA DE ESTOQUE POR VARIANTE:                        ║
║      ├── Ao criar OP, cada variante é reservada             ║
║      │   individualmente                                    ║
║      └── Saldo disponível = Estoque - Reservado             ║
║          Ex: Essência Floral: 2L total                      ║
║              - 0,5L reservado para OP-001                   ║
║              = 1,5L disponível para novas OPs               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ EXECUÇÃO DA PRODUÇÃO                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── CONFIRMAÇÃO DE EPIs:                                    ║
║  │   └── EPIs exibidos por insumo/variante                  ║
║  │       (conforme FISPQ cadastrada)                        ║
║  │                                                           ║
║  ├── CHECKLIST SEQUENCIAL COM VARIANTES:                     ║
║  │   └── Exibe nome completo: insumo + variante             ║
║  │       ☐ Passo 1: Adicionar 5kg Lauril Sulfato           ║
║  │       ☐ Passo 2: Misturar por 5 minutos                 ║
║  │       ☐ Passo 3: Adicionar 50ml Essência - Floral       ║
║  │       ☐ Passo 4: Adicionar 30ml Corante - Azul          ║
║  │       ☐ Passo 5: Verificar pH                            ║
║  │                                                           ║
║  ├── REGISTRO DE INSUMOS/VARIANTES UTILIZADOS:              ║
║  │   ├── Por variante:                                      ║
║  │   │   ├── Quantidade prevista (fórmula)                  ║
║  │   │   └── Quantidade real utilizada                      ║
║  │   │       └── Pré-preenchida com o previsto             ║
║  │   ├── SE AJUSTE NA VARIANTE:                             ║
║  │   │   ├── Campo muda de cor: 🟡 amarelo                  ║
║  │   │   ├── Justificativa obrigatória                      ║
║  │   │   └── ⚠️ Alerta se desvio > 10%                     ║
║  │   └── SE VARIANTE SUBSTITUÍDA:                           ║
║  │       ├── Registra qual variante foi usada              ║
║  │       ├── Registra proporção aplicada                   ║
║  │       └── Registra no histórico da fórmula              ║
║  │                                                           ║
║  └── Barra de progresso visual (X/Y passos)                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CONCLUSÃO DA PRODUÇÃO                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Quantidade real produzida                               ║
║  ├── Rendimento / Eficiência (%)                             ║
║  ├── Perdas e quebras com motivo                             ║
║  ├── Lote automático (LOT-26-0001)                           ║
║  ├── Data fabricação e validade                              ║
║  ├── Controle de qualidade (se habilitado)                   ║
║  │                                                           ║
║  ├── BAIXA DE ESTOQUE POR VARIANTE:                          ║
║  │   └── AO CONFIRMAR CONCLUSÃO:                            ║
║  │       ├── Baixa individual por variante:                 ║
║  │       │   ├── Lauril: -5kg do estoque                   ║
║  │       │   ├── Essência Floral: -50ml do estoque         ║
║  │       │   └── Corante Azul: -30ml do estoque            ║
║  │       ├── Método FEFO por variante                       ║
║  │       │   (lote mais próximo do vencimento)              ║
║  │       └── Saldo de cada variante atualizado              ║
║  │                                                           ║
║  ├── AO CONFIRMAR (demais automáticos):                      ║
║  │   ├── ✅ Entrada no estoque de produtos                  ║
║  │   ├── ✅ Custo real calculado por variante               ║
║  │   └── ✅ Convite para avaliar a produção                 ║
║  │                                                           ║
║  └── Observação pós produção (versão da fórmula)            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CUSTO REAL POR VARIANTE                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Custo calculado por variante utilizada:                 ║
║  │   ├── Lauril: Qtde × PMP do Lauril                      ║
║  │   ├── Essência Floral: Qtde × PMP Ess.Floral            ║
║  │   └── Corante Azul: Qtde × PMP Cor.Azul                 ║
║  ├── (+) Custos adicionais                                  ║
║  ├── (=) Custo total do lote                                ║
║  ├── (÷) Quantidade produzida = custo/L                     ║
║  ├── Comparativo estimado × real por variante               ║
║  └── Evolução do custo ao longo do tempo (gráfico)          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ QUARENTENA                                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Lote reprovado no CQ → quarentena                       ║
║  ├── Não disponível para venda                               ║
║  ├── Prazo máximo configurável (alerta)                      ║
║  └── 3 destinos possíveis:                                   ║
║      ├── ♻️ Reprocessar (nova OP vinculada)                 ║
║      ├── ✅ Liberar (após correção + novo CQ)               ║
║      └── 🗑️ Descartar (registra perda)                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ FRACIONAMENTO EM EMBALAGENS                                 ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Na hora da produção OU depois                           ║
║  ├── Produto pode ficar "a granel"                           ║
║  ├── Fracionar por embalagem:                                ║
║  │   ├── 500ml, 1L, 2L, 5L                                 ║
║  │   └── Validação de volume total                          ║
║  ├── Venda a granel disponível                               ║
║  └── Custo = líquido + embalagem física (variante)          ║
║      Ex: custo líquido + Embalagem - Frasco 500ml           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ RASTREABILIDADE DE LOTES COM VARIANTES                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── CONSULTA POR LOTE - EXIBE TUDO:                         ║
║  │   ├── 📋 ORIGEM:                                         ║
║  │   │   ├── Ordem de Produção: OPD-26-0001                ║
║  │   │   ├── Data de fabricação e validade                 ║
║  │   │   ├── Responsável e fórmula/versão                  ║
║  │   │   └── Variantes substituídas (se houver)            ║
║  │   │                                                      ║
║  │   ├── 🧪 INSUMOS E VARIANTES UTILIZADOS:                 ║
║  │   │   ├── Insumo + variante específica usada            ║
║  │   │   │   Ex: "Essência - Floral (não Limão)"           ║
║  │   │   ├── Quantidade real de cada variante              ║
║  │   │   ├── Lote de cada variante consumida               ║
║  │   │   └── Fornecedor de cada variante                   ║
║  │   │                                                      ║
║  │   ├── 🔬 QUALIDADE:                                      ║
║  │   │   ├── Resultado do CQ                               ║
║  │   │   └── Parâmetros verificados                        ║
║  │   │                                                      ║
║  │   ├── 📦 FRACIONAMENTO:                                  ║
║  │   │   ├── Embalagens geradas (variantes usadas)         ║
║  │   │   └── Quantidade de cada                            ║
║  │   │                                                      ║
║  │   └── 🛒 DESTINO:                                        ║
║  │       ├── Pedidos que venderam esse lote                ║
║  │       ├── Clientes que receberam                        ║
║  │       └── Estoque restante do lote                      ║
║  │                                                           ║
║  └── RASTREABILIDADE REVERSA:                                ║
║      └── Cliente → Pedido → Lote →                          ║
║          Variantes utilizadas → Fornecedores               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 05 (Produtos): Produto e embalagens usados     ║
║  │   na produção e no fracionamento.                       ║
║  ├── Módulo 06 (Fórmulas): Fórmula, versão, ordem de      ║
║  │   adição e custos adicionais; sugestão de substituta.   ║
║  ├── Módulo 07 (Insumos): Reserva e baixa de estoque      ║
║  │   por variante; FEFO; PMP para custo real.             ║
║  ├── Módulo 10 (Estoque de Insumos): Atualização de       ║
║  │   saldos após baixa; registros de movimentação.         ║
║  ├── Módulo 11 (Estoque de Produtos Acabados): Entrada     ║
║  │   de produtos acabados no estoque (granel/fracionado).  ║
║  ├── Módulo 14 (Vendas): Lotes vinculados a pedidos        ║
║  │   para rastreabilidade.                                 ║
║  ├── Módulo 19 (Notificações): Alertas de produção         ║
║  │   planejada, insumo insuficiente, CQ reprovado.         ║
║  └── Módulo 20 (Logs): Registro de criação, execução e     ║
║      conclusão de OP; alterações no checklist.             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ STATUS DA OP                                                ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🟡 Planejada                                            ║
║  ├── ⚠️ Planejada - Variante/Insumo pendente                ║
║  ├── 🔵 Em andamento                                        ║
║  ├── 🟢 Concluída                                           ║
║  ├── 🟠 Concluída - Lote em quarentena                      ║
║  └── ❌ Cancelada                                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Lista de Ordens de Produção                         ║
║  ├── 🖥️ Nova Ordem de Produção                              ║
║  │   └── Verificação de estoque por variante                ║
║  ├── 🖥️ Execução da Produção                                ║
║  │   └── Checklist com insumo + variante                    ║
║  ├── 🖥️ Conclusão da Produção                               ║
║  │   └── Baixa por variante                                 ║
║  ├── 🖥️ Fracionamento em Embalagens                         ║
║  │   └── Com variante de embalagem                          ║
║  ├── 🖥️ Detalhe da OP                                       ║
║  │   └── Custo real por variante                            ║
║  ├── 🖥️ Produtos em Quarentena                              ║
║  └── 🖥️ Rastreabilidade de Lote                             ║
║      └── Com variantes utilizadas                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐⭐ Muito Alta                           ║
║ (mantida - variantes já estavam previstas                   ║
║  na integração com fórmulas e estoque)                      ║
╚══════════════════════════════════════════════════════════════╝