╔══════════════════════════════════════════════════════════════╗
║              MÓDULO 12 - CADASTRO DE CLIENTES               ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Gerenciar a base de clientes da empresa            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS GERAIS                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Tipo: 🔘 Pessoa Física | 🔘 Pessoa Jurídica            ║
║  │                                                          ║
║  ├── SE PESSOA FÍSICA (PF):                                 ║
║  │   ├── Nome Completo          (obrigatório)               ║
║  │   ├── CPF                    (obrigatório)               ║
║  │   └── Data de Nascimento     (opcional)                  ║
║  │       └── 🎂 Alerta de aniversário                      ║
║  │                                                          ║
║  ├── SE PESSOA JURÍDICA (PJ):                               ║
║  │   ├── Razão Social           (obrigatório)               ║
║  │   ├── Nome Fantasia          (obrigatório)               ║
║  │   ├── CNPJ                   (obrigatório)               ║
║  │   ├── Inscrição Estadual     (opcional)                  ║
║  │   └── Inscrição Municipal    (opcional)                  ║
║  │                                                          ║
║  ├── CLASSIFICAÇÃO:                                         ║
║  │   ├── Tipo de cliente:                                   ║
║  │   │   ├── 👤 Consumidor Final                           ║
║  │   │   ├── 🏪 Revendedor                                 ║
║  │   │   ├── 📦 Atacado                                    ║
║  │   │   └── 🚛 Distribuidor                               ║
║  │   ├── Segmento:                                          ║
║  │   │   ├── 🛒 Mercado / Mercearia                        ║
║  │   │   ├── 🧴 Loja de Produtos de Limpeza               ║
║  │   │   ├── 💇 Salão de Beleza                            ║
║  │   │   ├── 🍽️ Restaurante / Lanchonete                  ║
║  │   │   ├── 🏢 Condomínio / Síndico                      ║
║  │   │   ├── 🏫 Escola / Creche                            ║
║  │   │   ├── 🏥 Clínica / Consultório                      ║
║  │   │   ├── 🏨 Pousada / Hotel                            ║
║  │   │   └── ➕ Outro (personalizável pelo Admin)          ║
║  │   └── Origem do cliente:                                ║
║  │       ├── Indicação                                     ║
║  │       ├── Redes Sociais                                  ║
║  │       ├── WhatsApp                                       ║
║  │       ├── Amostra recebida                               ║
║  │       └── Outro                                          ║
║  │                                                          ║
║  ├── STATUS:                                                ║
║  │   ├── 🟢 Ativo                                          ║
║  │   ├── 🔴 Inativo                                        ║
║  │   └── 🚫 Bloqueado (motivo registrado)                  ║
║  │                                                          ║
║  └── TAGS / ETIQUETAS (opcional):                           ║
║      └── Ex: #VIP #Potencial #Fidelizado                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - CONTATOS E ENDEREÇO                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── ENDEREÇO ÚNICO:                                        ║
║  │   ├── CEP (busca automática)  (obrigatório)              ║
║  │   ├── Logradouro / Número     (obrigatório)              ║
║  │   ├── Complemento             (opcional)                 ║
║  │   ├── Bairro                  (obrigatório)              ║
║  │   ├── Cidade / Estado         (obrigatório)              ║
║  │   └── Referência / Ponto      (opcional)                 ║
║  │                                                          ║
║  ├── SE PESSOA FÍSICA:                                      ║
║  │   ├── Telefone principal      (obrigatório)              ║
║  │   ├── WhatsApp                (opcional)                 ║
║  │   ├── Email                   (opcional)                 ║
║  │   └── Melhor horário contato  (opcional)                 ║
║  │                                                          ║
║  └── SE PESSOA JURÍDICA:                                    ║
║      ├── Múltiplos contatos (botão +)                       ║
║      └── Por contato:                                       ║
║          ├── Nome                (obrigatório)              ║
║          ├── Cargo / Departamento(opcional)                 ║
║          ├── Telefone            (opcional)                 ║
║          ├── WhatsApp            (opcional)                 ║
║          ├── Email               (opcional)                 ║
║          └── Contato principal   [S/N]                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - DADOS COMERCIAIS                                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Tabela de preço vinculada    (obrigatório)              ║
║  ├── Desconto fixo (%)            (opcional)                ║
║  ├── Limite de crédito (R$)       (opcional)                ║
║  ├── Condição de pagamento padrão:                          ║
║  │   ├── À vista                                           ║
║  │   ├── 30 dias                                           ║
║  │   ├── 30/60 dias                                        ║
║  │   └── Personalizado                                     ║
║  ├── Forma de pagamento preferencial:                       ║
║  │   └── PIX | Dinheiro | Boleto | Cartão                  ║
║  └── Frete padrão:                                          ║
║      ├── A combinar                                         ║
║      ├── Grátis (acima de R$ X configurável)               ║
║      └── Por conta do cliente                               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - OBSERVAÇÕES                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Observações gerais (texto livre)                       ║
║  └── Tags / Etiquetas do cliente                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ SISTEMA DE SCORE - 100% CONFIGURÁVEL                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── CONFIGURADO PELO ADMIN (Módulo 02):                     ║
║  │                                                          ║
║  │   ├── CRITÉRIO 1: Volume de Compras                      ║
║  │   │   ├── Peso: [___]%                                  ║
║  │   │   ├── Faixa A: acima R$[___]/mês → [__]pts          ║
║  │   │   ├── Faixa B: R$[__] a R$[__]/mês → [__]pts       ║
║  │   │   └── Faixa C: abaixo R$[___]/mês → [__]pts         ║
║  │   │                                                      ║
║  │   ├── CRITÉRIO 2: Frequência de Compra                   ║
║  │   │   ├── Peso: [___]%                                  ║
║  │   │   ├── Alta: +[__] compras/mês → [__]pts             ║
║  │   │   ├── Média: [__] compras/mês → [__]pts             ║
║  │   │   └── Baixa: -[__] compras/mês → [__]pts            ║
║  │   │                                                      ║
║  │   ├── CRITÉRIO 3: Pontualidade                           ║
║  │   │   ├── Peso: [___]%                                  ║
║  │   │   ├── Sempre em dia → [__]pts                       ║
║  │   │   ├── Atraso até [__] dias → [__]pts                ║
║  │   │   └── Atraso +[__] dias → [__]pts                   ║
║  │   │                                                      ║
║  │   ├── ⚠️ Soma dos pesos = 100% (validação auto)         ║
║  │   │                                                      ║
║  │   ├── NÍVEIS (nomes e faixas configuráveis):             ║
║  │   │   ├── 🥇 Nível 1: nome [___] → [__] a [__] pts     ║
║  │   │   ├── 🥈 Nível 2: nome [___] → [__] a [__] pts     ║
║  │   │   └── 🥉 Nível 3: nome [___] → [__] a [__] pts     ║
║  │   │                                                      ║
║  │   └── BENEFÍCIOS POR NÍVEL:                              ║
║  │       ├── 🥇 Nível 1: desconto extra [__]%              ║
║  │       ├── 🥈 Nível 2: condição especial de pagamento     ║
║  │       └── 🥉 Nível 3: sem benefício adicional           ║
║  │                                                          ║
║  ├── Recalculado automaticamente todo dia 1º do mês         ║
║  └── Notificação ao Admin em mudança de nível               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DETALHE DO CLIENTE                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── INDICADORES:                                            ║
║  │   ├── Total de pedidos realizados                        ║
║  │   ├── Valor total comprado                               ║
║  │   ├── Ticket médio por pedido                            ║
║  │   ├── Frequência de compra                               ║
║  │   ├── Produto mais comprado                              ║
║  │   └── Cliente desde (data cadastro)                      ║
║  │                                                          ║
║  ├── 🏆 SCORE E NÍVEL ATUAL:                                 ║
║  │   ├── Nível atual com ícone                              ║
║  │   ├── Pontuação detalhada por critério                   ║
║  │   └── Histórico de níveis anteriores                     ║
║  │                                                          ║
║  ├── HISTÓRICO DE COMPRAS:                                   ║
║  │   ├── Lista de todos os pedidos                          ║
║  │   ├── Data, valor e status                               ║
║  │   └── Total por período                                  ║
║  │                                                          ║
║  ├── AMOSTRAS RECEBIDAS:                                     ║
║  │   ├── Histórico de amostras enviadas                     ║
║  │   └── Taxa de conversão em vendas (%)                    ║
║  │                                                          ║
║  └── FINANCEIRO:                                             ║
║      ├── Parcelas em aberto                                 ║
║      ├── Parcelas vencidas                                  ║
║      └── Histórico de pagamentos                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ALERTAS DO CLIENTE                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🔴 Parcela vencida há +7 dias                          ║
║  ├── 🚨 Parcela vencida há +15 dias (crítico)               ║
║  ├── 🟡 Cliente sem compra há X dias (configurável)         ║
║  ├── 🏆 Mudança de nível (subiu ou desceu)                  ║
║  └── 🎂 Aniversário do cliente PF                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ BLOQUEIO MANUAL                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Somente Admin pode bloquear / desbloquear              ║
║  ├── Motivo obrigatório                                     ║
║  ├── Histórico de bloqueios mantido                         ║
║  └── Cliente bloqueado:                                     ║
║      └── ⚠️ Alerta ao tentar criar novo pedido              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 02 (Config. Empresa): Define critérios de      ║
║  │   score, níveis e benefícios; parâmetros de alertas     ║
║  │   (dias sem compra, inadimplência).                     ║
║  ├── Módulo 11 (Estoque Produtos): Histórico de amostras   ║
║  │   enviadas e taxa de conversão exibidas aqui.           ║
║  ├── Módulo 13 (Tabela de Preços): Tabela vinculada ao    ║
║  │   cliente; preço individual (overrides).                ║
║  ├── Módulo 14 (Vendas): Histórico de compras,             ║
║  │   indicadores (ticket médio, frequência).               ║
║  ├── Módulo 15 (Contas a Receber): Parcelas em aberto,     ║
║  │   vencidas e histórico de pagamentos.                   ║
║  ├── Módulo 19 (Notificações): Dispara alertas de          ║
║  │   aniversário, mudança de nível, cliente bloqueado.     ║
║  └── Módulo 20 (Logs): Registra criação/edição/exclusão    ║
║      de clientes e bloqueios manuais.                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE CLIENTES                                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca: nome | CPF/CNPJ | telefone | email              ║
║  ├── Filtros:                                               ║
║  │   ├── Tipo (PF/PJ)                                       ║
║  │   ├── Classificação                                      ║
║  │   ├── Segmento                                           ║
║  │   ├── Status (ativo/inativo/bloqueado)                   ║
║  │   ├── Nível (configurado pelo Admin)                     ║
║  │   ├── Tags                                               ║
║  │   └── Cidade / Estado                                    ║
║  ├── Ordenação:                                             ║
║  │   ├── Por nome (A-Z)                                     ║
║  │   ├── Por maior comprador                                ║
║  │   ├── Por última compra                                  ║
║  │   └── Por score / nível                                  ║
║  └── Exportar: Excel | PDF                                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🖥️ Lista de Clientes                                   ║
║  │   └── (busca, filtros, nível, status)                    ║
║  ├── 🖥️ Cadastro/Edição de Cliente (4 abas)                 ║
║  │   ├── Aba 01: Dados Gerais                               ║
║  │   ├── Aba 02: Contatos e Endereço                        ║
║  │   ├── Aba 03: Dados Comerciais                           ║
║  │   └── Aba 04: Observações                                ║
║  └── 🖥️ Detalhe do Cliente                                  ║
║      ├── Indicadores e score                                ║
║      ├── Histórico de compras                               ║
║      ├── Amostras recebidas                                 ║
║      └── Financeiro                                         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
╚══════════════════════════════════════════════════════════════╝