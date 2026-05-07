╔══════════════════════════════════════════════════════════════╗
║         MÓDULO 19 - NOTIFICAÇÕES E ALERTAS                ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Avisar usuários sobre eventos importantes do       ║
║          negócio em tempo real, via sistema e email.        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TIPOS DE ALERTAS (origem e regras)                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📦 ESTOQUE (origem: Módulos 10 e 11)                      ║
║  ├── Insumo abaixo do estoque mínimo                       ║
║  │   └── Dispara quando saldo ≤ mínimo configurado         ║
║  ├── Produto abaixo do estoque mínimo                      ║
║  ├── Produto/Insumo próximo ao vencimento:                 ║
║  │   ├── 🔵 60 dias - Planejamento                        ║
║  │   ├── 🟡 30 dias - Atenção                             ║
║  │   ├── 🟠 15 dias - Ação imediata                       ║
║  │   └── 🔴  7 dias - Crítico                             ║
║  └── Produto sem giro há X dias (parado)                   ║
║                                                              ║
║  💳 FINANCEIRO (origem: Módulos 15 e 16)                   ║
║  ├── Conta a receber vence hoje / amanhã                   ║
║  ├── Conta a receber vencida (há +7, +15 dias)            ║
║  ├── Conta a pagar vence hoje / amanhã                    ║
║  ├── Conta a pagar vencida                                 ║
║  ├── Cliente inadimplente (X% da carteira)                 ║
║  └── Saldo de caixa projetado negativo (X dias)            ║
║                                                              ║
║  🏭 PRODUÇÃO (origem: Módulo 09)                            ║
║  ├── Ordem de produção planejada para hoje                 ║
║  ├── Ordem de produção atrasada (não iniciada)             ║
║  ├── Insumo insuficiente para OP (criação)                ║
║  ├── Lote em quarentena há +X dias (sem decisão)          ║
║  └── Produção concluída com desvio >10%                   ║
║                                                              ║
║  🛒 VENDAS (origem: Módulo 14)                              ║
║  ├── Pedido aguardando separação há +X horas/dias          ║
║  ├── Pedido não entregue após prazo previsto               ║
║  ├── Orçamento próximo de expirar (avisa vendedor)         ║
║  └── Cliente com pedido cancelado/devolvido recente        ║
║                                                              ║
║  👥 CLIENTES (origem: Módulo 12)                            ║
║  ├── Aniversário de cliente (PF)                           ║
║  ├── Cliente sem compra há X dias                           ║
║  ├── Mudança de nível/score do cliente                     ║
║  └── Cliente bloqueado tenta fazer pedido (Admin alerta)  ║
║                                                              ║
║  🏪 COMPRAS (origem: Módulo 09)                             ║
║  ├── Pedido confirmado (quando status muda para Pedida)     ║
║  ├── Pagamento pendente (se Aguardando Pagamento)           ║
║  ├── Boleto próximo do vencimento (se configurado)          ║
║  ├── Pagamento confirmado                                   ║
║  ├── Compra em trânsito                                     ║
║  ├── Compra com entrega atrasada                            ║
║  ├── Compra recebida (estoque atualizado)                   ║
║  ├── Devolução registrada                                   ║
║  └── Tabela de preço de fornecedor desatualizada (>6m)     ║
║                                                              ║
║  ⚙️ SISTEMA (origem: Módulo 01 e 03)                       ║
║  ├── Usuário bloqueado solicita desbloqueio               ║
║  ├── Tentativas de login suspeitas (Admin)                ║
║  └── Backup realizado com falha (Admin)                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CANAIS DE NOTIFICAÇÃO                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🔔 SINO DE NOTIFICAÇÕES (in-app):                      ║
║  │   ├── Ícone com contador no topo do sistema            ║
║  │   ├── Dropdown com últimas 10 notificações             ║
║  │   ├── Marcar como lida individual ou em lote           ║
║  │   └── Link direto para o registro (ex: abre o pedido)  ║
║  │                                                          ║
║  ├── 📧 EMAIL AUTOMÁTICO:                                     ║
║  │   ├── Envio para email do usuário cadastrado           ║
║  │   └── Respeita preferências (aba Configurações)        ║
║  │                                                          ║
║  └── 🔔 PUSH NOTIFICATION (fase futura):                    ║
║      └── Navegador ou app mobile                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CENTRAL DE NOTIFICAÇÕES                                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── HISTÓRICO COMPLETO DE NOTIFICAÇÕES:                    ║
║  │   ├── Data e hora, tipo, mensagem, link                ║
║  │   ├── Status: não lida / lida                          ║
║  │   └── Filtro por tipo e período                        ║
║  └── Ações: marcar todas como lidas, limpar antigas        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CONFIGURAÇÕES DE ALERTAS (por usuário)                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── PREFERÊNCIAS DE CANAL:                                  ║
║  │   ├── Ativar/desativar notificações in-app             ║
║  │   └── Ativar/desativar email para cada tipo            ║
║  │                                                          ║
║  └── PREFERÊNCIAS DE TIPOS (checkboxes):                   ║
║      ├── Estoque, Financeiro, Produção, Vendas,           ║
║      │   Clientes, Compras, Sistema                        ║
║      └── Cada tipo pode ser ligado/desligado              ║
║                                                              ║
║  ⚠️ Admin pode forçar notificações críticas para todos     ║
║     (ex: contas vencidas, estoque mínimo).                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 02 (Configurações): Thresholds de alertas      ║
║  │   (estoque mínimo, vencimento, inadimplência) e canais. ║
║  ├── Módulo 03 (Permissões): Cada perfil recebe alertas    ║
║  │   de acordo com seus módulos acessíveis.                ║
║  ├── Módulo 07 (Insumos) e 11 (Estoque): Dados de         ║
║  │   estoque mínimo e vencimento.                          ║
║  ├── Módulo 08 (Compras): Atrasos de entrega e tabelas    ║
║  │   desatualizadas.                                       ║
║  ├── Módulo 09 (Produção): OPs planejadas/atrasadas,       ║
║  │   insumos insuficientes, CQ e quarentena.               ║
║  ├── Módulo 12 (Clientes): Aniversários, inatividade,      ║
║  │   mudança de score, bloqueios.                          ║
║  ├── Módulo 14 (Vendas): Pedidos parados, atrasos,         ║
║  │   orçamentos expirando.                                 ║
║  ├── Módulo 15/16 (Financeiro): Contas a vencer/vencidas,  ║
║  │   saldo projetado negativo.                             ║
║  ├── Módulo 17 (Dashboard): Alguns alertas aparecem        ║
║  │   na seção de alertas rápidos.                          ║
║  └── Módulo 20 (Logs): Registro de envio de notificações   ║
║      (para auditoria).                                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🔔 Ícone de sino no cabeçalho (dropdown)               ║
║  ├── 🖥️ Central de Notificações (histórico completo)        ║
║  └── 🖥️ Configurações de Alertas (preferências)             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
║ (múltiplos tipos e canais, preferências por usuário)        ║
╚══════════════════════════════════════════════════════════════╝