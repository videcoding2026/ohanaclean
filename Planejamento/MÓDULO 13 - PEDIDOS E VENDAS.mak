╔══════════════════════════════════════════════════════════════╗
║              MÓDULO 14 - PEDIDOS E VENDAS                   ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Registrar e gerenciar orçamentos e pedidos         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CRIAÇÃO DO DOCUMENTO                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── TIPO DO DOCUMENTO:                                      ║
║  │   ├── 📋 Orçamento (ORC-26-0001)                        ║
║  │   │   ├── Não reserva estoque                           ║
║  │   │   ├── Validade configurável (7/15/30 dias)          ║
║  │   │   └── Converte para pedido com 1 clique             ║
║  │   └── 🛒 Pedido (PED-26-0001)                           ║
║  │       └── Reserva estoque imediatamente                 ║
║  │                                                          ║
║  ├── DADOS DO PEDIDO:                                        ║
║  │   ├── Número automático                                  ║
║  │   ├── Data (automática)                                  ║
║  │   ├── Cliente (busca por nome/CPF/CNPJ)                 ║
║  │   └── Vendedor (usuário logado)                         ║
║  │                                                          ║
║  └── AO SELECIONAR CLIENTE:                                 ║
║      ├── Tabela de preço carregada auto.                    ║
║      ├── Condição de pagamento padrão                       ║
║      ├── Forma de pagamento preferencial                    ║
║      ├── Desconto fixo do cliente                          ║
║      ├── Últimos 3 pedidos (histórico rápido)              ║
║      ├── ⚠️ Alerta se parcelas vencidas                    ║
║      └── 🚫 Bloqueio se cliente bloqueado                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ITENS DO PEDIDO                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca por nome / código / SKU                          ║
║  ├── POR ITEM:                                               ║
║  │   ├── Produto e embalagem                               ║
║  │   ├── Quantidade                                         ║
║  │   │   └── Verificação de estoque:                       ║
║  │   │       ├── ✅ Estoque suficiente                     ║
║  │   │       └── ⚠️ Insuficiente (avisa, não bloqueia)    ║
║  │   │           └── Notifica produção automaticamente     ║
║  │   ├── Preço da tabela (automático)                      ║
║  │   │   └── Prioridade: individual > tabela > padrão      ║
║  │   ├── Desconto progressivo (auto - Módulo 13)           ║
║  │   │   └── 💡 "Compre X a mais e ganhe Y% off"          ║
║  │   ├── Total do item                                      ║
║  │   ├── Custo unitário (oculto p/ vendas)                 ║
║  │   └── Margem % (oculto p/ vendas)                       ║
║  │                                                          ║
║  └── VENDA A GRANEL:                                         ║
║      ├── Produto sem embalagem definida                     ║
║      ├── Informar volume (L ou kg)                          ║
║      └── Preço por litro/kg                                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TOTAIS E CONDIÇÕES                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── TOTALIZADORES:                                          ║
║  │   ├── Subtotal dos itens: R$ xx,xx                      ║
║  │   ├── (-) Desconto geral [__]%: R$ xx,xx               ║
║  │   │   └── ⚠️ Alerta se > limite da tabela              ║
║  │   ├── (+) Frete: R$ xx,xx                               ║
║  │   └── (=) Total do pedido: R$ xx,xx                     ║
║  │                                                          ║
║  ├── MODALIDADE DE ENTREGA:                                  ║
║  │   ├── 🏪 RETIRADA NO LOCAL:                             ║
║  │   │   ├── Data prevista de retirada                     ║
║  │   │   └── Observação                                    ║
║  │   └── 🚚 ENTREGA:                                       ║
║  │       ├── Endereço (carrega do cliente)                 ║
║  │       ├── Data prevista de entrega                      ║
║  │       ├── Frete: Grátis | Valor | Incluso              ║
║  │       └── Observações de entrega                        ║
║  │                                                          ║
║  ├── CONDIÇÃO DE PAGAMENTO:                                  ║
║  │   ├── À vista | 30d | 30/60d | Personalizado            ║
║  │   └── Preview das parcelas antes de confirmar           ║
║  │                                                          ║
║  └── FORMA DE PAGAMENTO:                                     ║
║      ├── 💵 Dinheiro                                        ║
║      ├── 📱 PIX                                             ║
║      ├── 💳 Cartão débito/crédito                          ║
║      ├── 📄 Boleto                                          ║
║      └── 🤝 A prazo (gera contas a receber)                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ FLUXO DE STATUS                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📋 ORÇAMENTO                                                ║
║  └── ↓ cliente aprova (converte)                            ║
║  🛒 CONFIRMADO                                               ║
║  └── ↓ separar produtos                                     ║
║  📦 EM SEPARAÇÃO                                             ║
║  │   └── Romaneio gerado para estoque                      ║
║  └── ↓ produtos separados                                   ║
║  🏪 AGUARDANDO RETIRADA ou 🚚 SAIU PARA ENTREGA             ║
║  └── ↓ entregue / retirado                                  ║
║  ✅ CONCLUÍDO                                                ║
║  │   ├── Baixa definitiva no estoque (FEFO)                ║
║  │   ├── Gera lançamento financeiro (Módulo 15)            ║
║  │   └── Gera recibo (PDF)                                  ║
║  └── ❌ CANCELADO (qualquer etapa)                          ║
║      ├── Motivo obrigatório                                 ║
║      ├── Libera estoque reservado                           ║
║      └── Cancela lançamentos financeiros                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DOCUMENTOS GERADOS                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 📋 PDF DO ORÇAMENTO:                                    ║
║  │   ├── Logo + dados empresa e cliente                    ║
║  │   ├── Produtos, preços e totais                         ║
║  │   ├── Validade do orçamento                             ║
║  │   └── Condições comerciais                              ║
║  │                                                          ║
║  ├── 🛒 PDF DO PEDIDO:                                       ║
║  │   ├── Logo + dados empresa e cliente                    ║
║  │   ├── Produtos, preços e totais                         ║
║  │   ├── Condição e forma de pagamento                     ║
║  │   └── Modalidade de entrega/retirada                    ║
║  │                                                          ║
║  ├── 🧾 RECIBO DE PAGAMENTO (REC-26-0001):                   ║
║  │   ├── Dados empresa e cliente                           ║
║  │   ├── Valor pago e forma de pagamento                   ║
║  │   ├── Referência ao pedido                              ║
║  │   └── Campo de assinatura                               ║
║  │                                                          ║
║  ├── 📦 ROMANEIO DE SEPARAÇÃO (interno):                     ║
║  │   ├── Lista de produtos e quantidades                   ║
║  │   ├── Lote a separar (FEFO)                             ║
║  │   └── Campo de conferência por item (✓)                 ║
║  │                                                          ║
║  └── ENVIO DOS DOCUMENTOS:                                   ║
║      ├── Download PDF                                       ║
║      ├── Envio por email                                    ║
║      └── WhatsApp (fase futura)                             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DEVOLUÇÃO DE VENDA                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Acessado pelo detalhe do pedido                        ║
║  ├── Produto(s), quantidade e motivo                        ║
║  ├── Resolução: troca | crédito | estorno                   ║
║  ├── Produto OK → volta ao estoque                          ║
║  └── Produto com problema → quarentena                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ PAINEL DE VENDAS                                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Vendas do dia / semana / mês                           ║
║  ├── Pedidos em aberto / separação / entrega               ║
║  ├── Ticket médio do período                                ║
║  ├── Produto mais vendido                                   ║
║  ├── Cliente que mais comprou                               ║
║  └── Margem média das vendas                                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 02 (Config. Empresa): Numeração automática     ║
║  │   de documentos (PED, ORC, REC).                        ║
║  ├── Módulo 03 (Permissões): Controle de acesso;           ║
║  │   camuflagem de custo/margem para perfil Vendas.        ║
║  ├── Módulo 11 (Estoque Produtos): Reserva ao confirmar    ║
║  │   pedido; baixa definitiva (FEFO) ao concluir;           ║
║  │   devolução retorna ao estoque ou quarentena.           ║
║  ├── Módulo 12 (Clientes): Busca de cliente, carrega       ║
║  │   tabela de preço, condições padrão, histórico rápido;   ║
║  │   alertas de pendências e bloqueio.                     ║
║  ├── Módulo 13 (Tabela de Preços): Prioridade de preço     ║
║  │   (individual > tabela > padrão); desconto progressivo;  ║
║  │   simulador integrado; validação de desconto máximo.    ║
║  ├── Módulo 09 (Produção): Notificação automática quando   ║
║  │   estoque insuficiente para o pedido.                   ║
║  ├── Módulo 15 (Contas a Receber): Geração de lançamentos  ║
║  │   financeiros ao concluir pedido a prazo; baixa automática║
║  │   para pagamentos à vista; estorno em devoluções.       ║
║  ├── Módulo 19 (Notificações): Alertas de pedido aguardando║
║  │   separação, não entregue, orçamento próximo de expirar.║
║  └── Módulo 20 (Logs): Registro de criação, alteração de   ║
║      status, cancelamento e devolução de pedidos.          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE PEDIDOS                                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca por número / cliente / produto                   ║
║  ├── Filtros: status | período | vendedor                   ║
║  │           modalidade | forma de pagamento               ║
║  ├── Ordenação: data | valor | status                       ║
║  └── Exportar: Excel | PDF                                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🖥️ Lista de Pedidos / Orçamentos                       ║
║  ├── 🖥️ Novo Orçamento / Pedido                             ║
║  │   └── Com simulador de preços integrado                  ║
║  ├── 🖥️ Detalhe do Pedido                                   ║
║  │   ├── Status e histórico de alterações                  ║
║  │   ├── Documentos gerados                                 ║
║  │   └── Financeiro vinculado                               ║
║  ├── 🖥️ Separação de Pedido                                 ║
║  │   └── Checklist com romaneio                             ║
║  ├── 🖥️ Devolução de Venda                                  ║
║  └── 🖥️ Painel de Vendas                                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐ Alta                                   ║
╚══════════════════════════════════════════════════════════════╝