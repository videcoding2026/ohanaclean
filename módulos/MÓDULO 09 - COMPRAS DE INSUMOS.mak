╔══════════════════════════════════════════════════════════════╗
║            MÓDULO 08 - COMPRAS DE INSUMOS                   ║
║               ✅ FECHADO - VERSÃO ATUALIZADA                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Registrar e controlar compras de insumos           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DADOS DA COMPRA                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Número automático (CMP-26-0001)                        ║
║  ├── Data da compra                  (obrigatório)          ║
║  ├── Fornecedor                      (obrigatório)          ║
║  ├── Tipo: 🏭 Direto | 🛍️ Marketplace                      ║
║  ├── Número da nota / pedido         (opcional)             ║
║  └── Upload do comprovante           (opcional)             ║
║      └── NF | Cupom | Comprovante marketplace               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ITENS DA COMPRA                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── SELEÇÃO DE INSUMO COM VARIANTES:                       ║
║  │   ├── PASSO 1: Selecionar insumo pai                    ║
║  │   │   └── Ex: "Essência"                                ║
║  │   ├── PASSO 2: Se insumo tem variantes:                 ║
║  │   │   └── Selecionar variante específica                ║
║  │   │       Ex: "Essência → Floral"                       ║
║  │   │           "Embalagem → Frasco 500ml"                ║
║  │   │           "Corante → Azul"                          ║
║  │   └── PASSO 3: Se insumo sem variantes:                 ║
║  │       └── Segue direto para quantidade                  ║
║  │                                                          ║
║  ├── VALIDAÇÕES NA SELEÇÃO:                                 ║
║  │   ├── ⚠️ Alerta se variante inativa:                   ║
║  │   │   "A variante [X] está inativa.                     ║
║  │   │    Selecione outra variante."                       ║
║  │   └── ⚠️ Alerta se insumo sem variante                 ║
║  │       cadastrada para esse fornecedor                   ║
║  │                                                          ║
║  ├── POR ITEM DA COMPRA:                                    ║
║  │   ├── Insumo pai + variante       (obrigatório)         ║
║  │   │   Ex: "Essência - Floral"                           ║
║  │   ├── Quantidade comprada         (obrigatório)         ║
║  │   ├── Unidade de medida           (obrigatório)         ║
║  │   │   └── Herda da variante (pode ajustar)             ║
║  │   ├── Preço unitário              (obrigatório)         ║
║  │   ├── Subtotal (automático)                             ║
║  │   ├── Número do lote              (opcional)            ║
║  │   └── Data de validade            (opcional)            ║
║  │       └── Somente se variante tem validade = SIM        ║
║  │           (oculto se validade = NÃO)                    ║
║  │                                                          ║
║  ├── MÚLTIPLOS ITENS / VARIANTES:                           ║
║  │   ├── Botão "+ Adicionar item"                          ║
║  │   ├── Pode comprar variantes diferentes                 ║
║  │   │   do mesmo insumo pai na mesma compra:              ║
║  │   │   Ex: Essência Floral + Essência Limão              ║
║  │   └── Cada variante = item separado na compra           ║
║  │                                                          ║
║  ├── FRETE:                                                 ║
║  │   ├── [✅] Frete grátis                                 ║
║  │   └── [💰] Valor do frete                               ║
║  │       └── Distribuído proporcionalmente                 ║
║  │           por variante/item (pelo valor)                ║
║  │           Ex: Essência Floral (60%): +R$6,00            ║
║  │               Essência Limão  (40%): +R$4,00            ║
║  │                                                          ║
║  ├── TOTALIZADORES:                                         ║
║  │   ├── Subtotal dos itens/variantes                      ║
║  │   ├── (+) Frete                                         ║
║  │   └── (=) Total da compra                               ║
║  │                                                          ║
║  └── 💡 SUGESTÃO INTELIGENTE POR VARIANTE:                 ║
║      └── Ao selecionar fornecedor:                         ║
║          "Variantes que você costuma comprar               ║
║           deste fornecedor:                                ║
║           ├── Essência - Floral (última: 2L)              ║
║           ├── Essência - Limão  (última: 1L)              ║
║           └── Corante - Azul    (última: 500ml)           ║
║           Deseja adicionar?"                               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CUSTO REAL POR VARIANTE                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Custo real = preço unitário + frete proporcional       ║
║  ├── Calculado individualmente por variante                 ║
║  ├── Atualiza o PMP específico da variante:                 ║
║  │   └── Não mistura PMP entre variantes                   ║
║  │       Ex: PMP Essência Floral ≠ PMP Essência Limão      ║
║  └── Histórico de PMP por variante                         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CONDIÇÕES DE PAGAMENTO                                       ║
╠══════════════════════════════════════════════════════════════╣
║  ├── SE MARKETPLACE:                                        ║
║  │   ├── 💳 Cartão de crédito (1x a 12x)                  ║
║  │   └── 📱 PIX                                            ║
║  │                                                          ║
║  ├── SE FORNECEDOR DIRETO:                                  ║
║  │   ├── 💳 Cartão de crédito/débito                      ║
║  │   ├── 📱 PIX                                            ║
║  │   ├── 📄 Boleto bancário                               ║
║  │   ├── 🏦 Transferência bancária                        ║
║  │   └── 💵 Dinheiro                                       ║
║  │                                                          ║
║  └── Pré-preenchido com condições do fornecedor            ║
║      (alterável se necessário)                              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ STATUS DA COMPRA                                             ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🟡 Pedida (aguardando entrega)                         ║
║  ├── 🔵 Em trânsito                                         ║
║  ├── 🟢 Recebida                                            ║
║  ├── ⚠️ Recebida parcialmente                               ║
║  └── ❌ Cancelada / Devolvida                               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ RECEBIMENTO DA COMPRA                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Botão "✅ Receber Tudo Conforme" (rápido)              ║
║  ├── Ou conferência item por item / variante                ║
║  ├── Data de recebimento                                    ║
║  ├── Quantidade recebida por variante                       ║
║  │   └── (pré-preenchida com o pedido)                     ║
║  ├── Observações (opcional)                                 ║
║  │                                                          ║
║  └── AO CONFIRMAR (automático por variante):                ║
║      ├── ✅ Entrada no estoque da variante específica       ║
║      │   Ex: Essência Floral +2L no estoque               ║
║      │       Essência Limão  +1L no estoque               ║
║      ├── ✅ Atualização do PMP da variante                  ║
║      │   (incluindo frete proporcional)                     ║
║      ├── ✅ Status → Recebida                               ║
║      └── ✅ Convite para avaliar fornecedor                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ GERAÇÃO AUTOMÁTICA - CONTAS A PAGAR                         ║
╠══════════════════════════════════════════════════════════════╣
║  ├── PIX / À vista: 1 lançamento na data                    ║
║  └── Cartão parcelado: N lançamentos mensais                ║
║      com datas de vencimento automáticas                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DEVOLUÇÃO DE COMPRA                                          ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Vínculo com compra original                            ║
║  ├── Seleção da variante a devolver:                        ║
║  │   Ex: devolver somente "Essência Floral"                ║
║  │       mantendo "Essência Limão" da mesma compra         ║
║  ├── Quantidade devolvida por variante                      ║
║  ├── Motivo da devolução                                    ║
║  ├── Resolução: reenvio | crédito | estorno                 ║
║  └── AO CONFIRMAR:                                          ║
║      ├── Baixa automática na variante devolvida             ║
║      ├── Ajuste no PMP da variante                         ║
║      └── Ajuste na conta a pagar                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE COMPRAS SUGERIDAS POR VARIANTE                     ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Variantes abaixo do estoque mínimo                     ║
║  ├── Quantidade sugerida por variante                       ║
║  │   └── (baseada no consumo dos últimos 30/60/90 dias)    ║
║  ├── Melhor fornecedor por variante (menor preço)           ║
║  └── Exportar lista (PDF):                                  ║
║      Ex: "Lista de Compras Sugeridas:                       ║
║           ├── Essência Floral: comprar 2L                  ║
║           │   Fornecedor: [Nome] R$ x,xx/L                 ║
║           └── Corante Azul: comprar 500ml                  ║
║               Fornecedor: [Nome] R$ x,xx/ml"               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPARATIVO DE PREÇOS POR VARIANTE                          ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Por variante, comparativo entre fornecedores:          ║
║  │   ┌──────────────┬─────────┬────────┬────────┐         ║
║  │   │ Fornecedor   │Variante │ Preço  │ Prazo  │         ║
║  │   ├──────────────┼─────────┼────────┼────────┤         ║
║  │   │ Fornecedor A │ Floral  │R$12,00 │ 3 dias │         ║
║  │   │ Shopee Loja X│ Floral  │R$10,50 │10 dias │         ║
║  │   └──────────────┴─────────┴────────┴────────┘         ║
║  │   💡 Menor preço: Shopee Loja X                         ║
║  │                                                          ║
║  └── Evolução do preço por variante (gráfico)              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 04 (Fornecedores): Dados do fornecedor,        ║
║  │   condições de pagamento e tabela de preços.            ║
║  ├── Módulo 07 (Insumos): Estrutura insumo pai + variante; ║
║  │   validação de variante ativa; atualização de estoque   ║
║  │   e PMP da variante comprada.                           ║
║  ├── Módulo 10 (Estoque de Insumos): Entrada de estoque    ║
║  │   via recebimento; movimentações e lotes.               ║
║  ├── Módulo 16 (Contas a Pagar): Geração automática de     ║
║  │   lançamentos financeiros conforme condição de pgto.    ║
║  ├── Módulo 19 (Notificações): Alertas de compra atrasada, ║
║  │   tabela desatualizada, variante inativa.               ║
║  └── Módulo 20 (Logs): Registro de criação, recebimento    ║
║      e devolução de compras.                               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE COMPRAS                                             ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Busca por número / fornecedor / insumo / variante      ║
║  ├── Filtro por status / período / tipo                     ║
║  ├── Total comprado no período (R$)                         ║
║  └── Exportar (Excel / PDF)                                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Lista de Compras                                    ║
║  ├── 🖥️ Nova Compra                                         ║
║  │   └── Com seleção insumo + variante                      ║
║  ├── 🖥️ Detalhe da Compra                                   ║
║  │   └── Com detalhamento por variante                      ║
║  ├── 🖥️ Recebimento de Compra                               ║
║  │   └── Conferência por variante                           ║
║  ├── 🖥️ Devolução de Compra                                 ║
║  │   └── Seleção de variante a devolver                     ║
║  └── 🖥️ Lista de Compras Sugeridas                          ║
║      └── Agrupada por variante                              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
║ (mantida - variantes agregam lógica mas                     ║
║  não aumentam complexidade estrutural)                      ║
╚══════════════════════════════════════════════════════════════╝