╔══════════════════════════════════════════════════════════════╗
║           MÓDULO 04 - CADASTRO DE FORNECEDORES              ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Gerenciar os fornecedores de insumos               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS GERAIS                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Tipo de fornecedor:                                    ║
║  │   ├── 🏭 Fornecedor Direto                              ║
║  │   └── 🛍️ Marketplace                                    ║
║  │       └── Shopee | Mercado Livre |                      ║
║  │           Amazon | Outro                                ║
║  │                                                          ║
║  ├── SE PESSOA FÍSICA (PF):                                 ║
║  │   ├── Nome Completo          (obrigatório)              ║
║  │   ├── CPF                    (obrigatório)              ║
║  │   └── Data de Nascimento     (opcional)                 ║
║  │                                                          ║
║  ├── SE PESSOA JURÍDICA (PJ):                               ║
║  │   ├── Razão Social           (obrigatório)              ║
║  │   ├── Nome Fantasia          (obrigatório)              ║
║  │   ├── CNPJ                   (obrigatório)              ║
║  │   ├── Inscrição Estadual     (opcional)                 ║
║  │   └── Inscrição Municipal    (opcional)                 ║
║  │                                                          ║
║  ├── ENDEREÇO:                                              ║
║  │   ├── Fornecedor Direto: endereço completo              ║
║  │   └── Marketplace: endereço não obrigatório             ║
║  │       └── Link da loja + Nome do vendedor               ║
║  │                                                          ║
║  ├── CONTATOS:                                              ║
║  │   ├── Telefone principal     (obrigatório)              ║
║  │   ├── WhatsApp               (opcional)                 ║
║  │   ├── Email                  (opcional)                 ║
║  │   └── Site / Loja online     (opcional)                 ║
║  │                                                          ║
║  ├── Categoria:                                             ║
║  │   ├── Matéria Prima (insumos químicos)                  ║
║  │   ├── Embalagens                                        ║
║  │   ├── Equipamentos                                      ║
║  │   └── Outros                                            ║
║  │                                                          ║
║  └── Status:                                               ║
║      ├── 🟢 Ativo                                          ║
║      ├── 🟡 Em análise                                     ║
║      └── 🔴 Inativo (motivo obrigatório)                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - DADOS COMERCIAIS                                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Condição de pagamento padrão                           ║
║  │   (à vista | 30d | 30/60d | personalizado)              ║
║  ├── Forma de pagamento preferencial                        ║
║  │   (PIX | Boleto | Transferência | Cartão | Cheque)      ║
║  ├── Prazo de entrega médio (dias)                          ║
║  ├── Pedido mínimo em quantidade                            ║
║  ├── Pedido mínimo em valor (R$)                            ║
║  └── Desconto padrão (%) se houver                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - DADOS BANCÁRIOS                                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Banco                      (opcional)                  ║
║  ├── Agência                    (opcional)                  ║
║  ├── Conta                      (opcional)                  ║
║  ├── Tipo: Corrente / Poupança  (opcional)                  ║
║  ├── Chave PIX                  (opcional)                  ║
║  └── Nome do Favorecido         (opcional)                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - TABELA DE PREÇOS                                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Upload da tabela (PDF ou Excel)                        ║
║  ├── Data de recebimento                                    ║
║  ├── Data de validade (se houver)                           ║
║  ├── Preços por insumo cadastrado:                          ║
║  │   ├── Insumo vinculado                                  ║
║  │   ├── Preço unitário                                    ║
║  │   ├── Unidade de medida                                 ║
║  │   └── Quantidade mínima                                 ║
║  ├── Histórico de tabelas anteriores                        ║
║  └── ⚠️ Alerta se tabela com +6 meses                      ║
║         sem atualização                                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 05 - AVALIAÇÃO                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── CRITÉRIOS (1 a 5 estrelas cada):                       ║
║  │   ├── ⭐ Qualidade do produto                           ║
║  │   ├── ⭐ Prazo de entrega                               ║
║  │   ├── ⭐ Preço competitivo                              ║
║  │   └── ⭐ Embalagem / Conservação                        ║
║  ├── Média geral calculada automaticamente                  ║
║  ├── Observações da avaliação                               ║
║  ├── Histórico de avaliações                                ║
║  └── ⚠️ Alerta se nota média abaixo de 2.0                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 06 - HISTÓRICO DE COMPRAS                                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Lista de compras realizadas                            ║
║  ├── Data, valor e insumos comprados                        ║
║  ├── Total comprado no mês / ano                            ║
║  ├── Última compra realizada                                ║
║  ├── Ticket médio por compra                                ║
║  └── Prazo médio real de entrega                            ║
║      (calculado automaticamente)                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 07 (Insumos): Vincula fornecedor aos insumos    ║
║  │   e variantes.                                          ║
║  ├── Módulo 08 (Compras): Ao selecionar fornecedor, puxa   ║
║  │   dados comerciais, condições de pagamento e tabela.    ║
║  │   Alimenta histórico de compras na Aba 06.              ║
║  ├── Módulo 16 (Contas a Pagar): Usa dados bancários e     ║
║  │   condições de pagamento para gerar lançamentos.        ║
║  ├── Módulo 19 (Notificações): Alerta sobre tabela         ║
║  │   desatualizada e avaliação baixa.                      ║
║  └── Módulo 20 (Logs): Registra criação/edição/exclusão    ║
║      de fornecedores.                                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE FORNECEDORES                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca por nome / CNPJ / CPF                            ║
║  ├── Filtro por categoria                                   ║
║  ├── Filtro por tipo (direto/marketplace)                   ║
║  ├── Filtro por status                                      ║
║  ├── Filtro por estado                                      ║
║  ├── Ordenação por nome / última compra /                   ║
║  │   valor total / avaliação                               ║
║  └── Exportar lista (Excel / PDF)                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Lista de Fornecedores                               ║
║  └── 🖥️ Cadastro/Edição com 6 abas                          ║
║      ├── Aba 01: Dados Gerais                               ║
║      ├── Aba 02: Dados Comerciais                           ║
║      ├── Aba 03: Dados Bancários                            ║
║      ├── Aba 04: Tabela de Preços                           ║
║      ├── Aba 05: Avaliação                                  ║
║      └── Aba 06: Histórico de Compras                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
║ (subiu de ⭐⭐ pela inclusão de marketplace,                 ║
║  avaliação formal e tabela de preços)                       ║
╚══════════════════════════════════════════════════════════════╝