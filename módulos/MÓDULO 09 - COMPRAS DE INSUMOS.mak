╔══════════════════════════════════════════════════════════════╗
║            MÓDULO 09 - COMPRAS DE INSUMOS                   ║
║          ✅ ATUALIZADO - FLUXO DE STATUS COMPLETO            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Registrar e controlar compras de insumos           ║
║          com fluxo completo de status e timeline             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DADOS DA COMPRA                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Número automático (CMP-26-0001)                        ║
║  │   └── Gerado ao confirmar pedido (não no rascunho)       ║
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
║ STATUS DA COMPRA (fluxo completo)                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FLUXO FORNECEDOR DIRETO:                                    ║
║  🟫 Rascunho → 🟡 Pedida → 🟠 Aguardando Pagamento          ║
║                           → 🔵 Em trânsito → 🟢 Recebida    ║
║                                            → ⚠️ Receb. Parc ║
║                                            → ❌ Cancelada     ║
║                              🟢 Recebida → 🔴 Devolvida      ║
║                                                              ║
║  FLUXO MARKETPLACE:                                          ║
║  🟡 Pedida → 🔵 Em trânsito → 🟢 Recebida                  ║
║                                            → ⚠️ Receb. Parc ║
║                                            → ❌ Cancelada     ║
║                              🟢 Recebida → 🔴 Devolvida      ║
║                                                              ║
║  🟫 Rascunho: Compra editável, sem efeitos colaterais       ║
║              Delete permitido, não gera Contas a Pagar       ║
║              Ações: [Editar] [Confirmar Pedido] [Cancelar]   ║
║                                                              ║
║  🟡 Pedida: Compra confirmada, não editável                  ║
║            Gera Contas a Pagar automaticamente                ║
║            Ações: [Confirmar Pagamento] [Rastreio]           ║
║                    [Receber] [Cancelar]                       ║
║                                                              ║
║  🟠 Aguardando Pagamento: Boleto/TED pendente                ║
║           Ações: [Confirmar Pagamento] [Rastreio] [Cancelar] ║
║                                                              ║
║  🔵 Em trânsito: A caminho do destinatário                   ║
║          Ações: [Rastreio] [Receber] [Cancelar]               ║
║                                                              ║
║  🟢 Recebida: Tudo conforme                                  ║
║     ├── Estoque atualizado por variante                      ║
║     ├── PMP recalculado por variante                         ║
║     └── Ações: [Devolver] [Avaliar fornecedor]              ║
║                                                              ║
║  ⚠️ Recebida Parcialmente: Parte dos itens chegou            ║
║     ├── Itens recebidos → estoque + PMP                     ║
║     ├── Itens pendentes → aguardando                        ║
║     ├── NÃO pode cancelar (já tem estoque)                  ║
║     └── Ações: [Receber Pendentes] [Devolver]               ║
║                                                              ║
║  ❌ Cancelada: Compra cancelada                               ║
║     ├── Se Rascunho → delete físico (sem efeitos)            ║
║     ├── Se Pedida/Aguardando/Trânsito → estorna Contas      ║
║     ├── Se já recebeu (parcial/total) → não pode cancelar   ║
║     └── Motivo do cancelamento obrigatório                   ║
║                                                              ║
║  🔴 Devolvida: Todos os itens devolvidos                     ║
║     ├── Baixa automática no estoque                          ║
║     ├── Ajuste no PMP                                        ║
║     └── Registro em purchaseReturns                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TIMELINE / HISTÓRICO DE STATUS                              ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Registro automático em purchaseHistories               ║
║  ├── Cada transição registra:                               ║
║  │   ├── Status anterior → Status novo                      ║
║  │   ├── Data e hora                                        ║
║  │   ├── Usuário responsável                               ║
║  │   ├── Observação                                        ║
║  │   └── Se foi automático ou manual                       ║
║  └── Visualizado como timeline na tela de detalhes          ║
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
║  │   └── Já nasce como Pedida (pagamento já feito)         ║
║  │                                                          ║
║  ├── SE FORNECEDOR DIRETO:                                  ║
║  │   ├── 💳 Cartão de crédito/débito                      ║
║  │   ├── 📱 PIX                                            ║
║  │   ├── 📄 Boleto bancário                               ║
║  │   ├── 🏦 Transferência bancária                        ║
║  │   └── 💵 Dinheiro                                       ║
║  │   └── Nasce como Rascunho (precisa confirmar)          ║
║  │                                                          ║
║  └── Regra de status por pagamento:                         ║
║      ├── PIX / Cartão débito / Dinheiro → já pago           ║
║      │   └── Rascunho → Confirmar → Pedida → Em trânsito   ║
║      ├── Cartão crédito → já pago (parcelado)              ║
║      │   └── Rascunho → Confirmar → Pedida → Em trânsito   ║
║      └── Boleto / Transferência → pagamento pendente       ║
║          └── Rascunho → Confirmar → Aguardando Pagamento    ║
║              → Confirmar Pagamento → Em trânsito            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ RECEBIMENTO DA COMPRA                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Botão "✅ Preencher Tudo Conforme" (rápido)            ║
║  ├── Conferência item por item / variante                   ║
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
║      ├── ✅ Item → status "recebido"                        ║
║      ├── ✅ Se todos → Status → 🟢 Recebida                 ║
║      ├── ✅ Se parcial → Status → ⚠️ Recebida Parcial        ║
║      └── ✅ Convite para avaliar fornecedor                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CONFIRMAÇÃO DE PAGAMENTO (manual)                            ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Modal com:                                             ║
║  │   ├── Data do pagamento (obrigatório)                   ║
║  │   ├── Comprovante (opcional, upload)                    ║
║  │   └── Observação (opcional)                             ║
║  ├── Atualiza Contas a Pagar → status "Paga"              ║
║  └── Status → 🔵 Em trânsito                                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ GERAÇÃO AUTOMÁTICA - CONTAS A PAGAR                         ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Geradas ao CONFIRMAR PEDIDO (não ao receber!)          ║
║  ├── PIX / À vista: 1 lançamento na data, status "Paga"     ║
║  ├── Cartão parcelado: N lançamentos mensais, status "Paga" ║
║  │   com datas de vencimento automáticas                    ║
║  ├── Boleto: 1 lançamento, status "Aberta"                 ║
║  └── Ao confirmar pagamento: atualiza status para "Paga"    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DEVOLUÇÃO DE COMPRA                                          ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Só disponível se Recebida ou Recebida Parcial          ║
║  ├── Seleção da variante a devolver:                        ║
║  │   Ex: devolver somente "Essência Floral"                ║
║  │       mantendo "Essência Limão" da mesma compra         ║
║  ├── Quantidade devolvida por variante                      ║
║  │   └── Máximo = quantidade já recebida                    ║
║  ├── Motivo da devolução (dropdown):                        ║
║  │   ├── Produto com defeito                               ║
║  │   ├── Produto errado                                    ║
║  │   ├── Avaria no transporte                              ║
║  │   ├── Fora do prazo                                     ║
║  │   ├── Arrependimento                                    ║
║  │   └── Outro (texto livre)                               ║
║  ├── Resolução: reenvio | crédito | estorno                 ║
║  └── AO CONFIRMAR:                                          ║
║      ├── Baixa automática na variante devolvida             ║
║      ├── Ajuste no PMP da variante                         ║
║      ├── Registro em purchaseReturns                       ║
║      ├── Se todos devolvidos → Status 🔴 Devolvida          ║
║      └── Se parcial → mantém status anterior               ║
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
║  ├── M04 (Fornecedores): Dados do fornecedor, cond. pgto    ║
║  ├── M05 (Insumos): Estrutura insumo pai + variante;        ║
║  │   validação de variante ativa; atualização de estoque    ║
║  │   e PMP da variante comprada via campo quantidade.       ║
║  ├── M10 (Estoque): Entrada de estoque via recebimento;     ║
║  │   baixa de estoque via devolução; movimentações.         ║
║  ├── M14 (Financeiro): Geração automática de Contas a Pagar ║
║  │   ao CONFIRMAR PEDIDO. Atualização ao confirmar pgto.   ║
║  │   Estorno ao cancelar. Ajuste na devolução.              ║
║  ├── M16 (Notificações): Alertas de compra atrasada,        ║
║  │   pagamento pendente, recebimento, boleto vencendo.      ║
║  └── M17 (Logs): Registro de todas as transições de status, ║
║      criação, recebimento e devolução de compras.           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE COMPRAS                                             ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Busca por número / fornecedor / insumo / variante      ║
║  ├── Filtro por status / período / tipo (direto|marketplace)║
║  ├── KPIs: Total no período, Pendentes, Recebidas           ║
║  ├── Total comprado no período (R$)                         ║
║  └── Exportar (Excel / PDF)                                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Lista de Compras        (/compras)                 ║
║  │   └── KPIs + filtros + tabela com status badges         ║
║  ├── 🖥️ Nova Compra              (/compras/nova)           ║
║  │   ├── Toggle: Direto vs Marketplace                     ║
║  │   ├── Seleção insumo + variante                         ║
║  │   ├── Frete grátis / valor                              ║
║  │   └── Botões: Salvar Rascunho + Confirmar Pedido        ║
║  │       (Marketplace: só "Registrar Compra")              ║
║  ├── 🖥️ Detalhe da Compra        (/compras/:id)           ║
║  │   ├── Dados + Itens + Contas a Pagar                    ║
║  │   ├── Timeline de status                                ║
║  │   ├── Ações por status (botões condicionais)            ║
║  │   └── Modais: Confirmar Pagamento / Rastreio / Cancelar ║
║  ├── 🖥️ Recebimento de Compra    (/compras/:id/receber)   ║
║  │   ├── Preencher Tudo Conforme                           ║
║  │   ├── Conferência por variante (qtd recebida)           ║
║  │   └── Data do recebimento + observação                  ║
║  ├── 🖥️ Devolução de Compra     (/compras/:id/devolver)   ║
║  │   ├── Seleção de itens recebidos                        ║
║  │   ├── Qtd, motivo, resolução por item                   ║
║  │   └── Confirmação com baixa no estoque                  ║
║  └── 🖥️ Lista de Compras Sugeridas (futuro)               ║
║      └── Agrupada por variante                              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ MODELO DE DADOS                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ┌── purchases (compra principal)                           ║
║  │   ├── purchaseItems (itens da compra)                   ║
║  │   ├── purchaseHistories (timeline de status)            ║
║  │   ├── purchaseReturns (devoluções)                      ║
║  │   └── contasPagar (vinculadas à compra)                 ║
║  └── insumoVariants.quantidade (estoque da variante)       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐ Alta (subiu com fluxo de status)     ║
╚══════════════════════════════════════════════════════════════╝
