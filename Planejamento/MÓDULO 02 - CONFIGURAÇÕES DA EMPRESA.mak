╔══════════════════════════════════════════════════════════════╗
║        MÓDULO 02 - CONFIGURAÇÕES DA EMPRESA                 ║
║                    ✅ FECHADO                                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Configurar os dados gerais do sistema              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS DA EMPRESA                                    ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Tipo: 🔘 Pessoa Física | 🔘 Pessoa Jurídica            ║
║  │                                                           ║
║  ├── SE PESSOA FÍSICA (PF):                                 ║
║  │   ├── Nome Completo              (obrigatório)           ║
║  │   ├── CPF                        (obrigatório)           ║
║  │   └── Data de Nascimento         (opcional)              ║
║  │                                                           ║
║  ├── SE PESSOA JURÍDICA (PJ):                               ║
║  │   ├── Razão Social               (obrigatório)           ║
║  │   ├── Nome Fantasia              (obrigatório)           ║
║  │   ├── CNPJ                       (obrigatório)           ║
║  │   ├── Inscrição Estadual         (obrigatório)           ║
║  │   ├── Inscrição Municipal        (opcional)              ║
║  │   └── Data de Fundação           (opcional)              ║
║  │                                                           ║
║  ├── ENDEREÇO (ambos os tipos):                             ║
║  │   ├── CEP (busca automática)     (obrigatório)           ║
║  │   ├── Logradouro / Número        (obrigatório)           ║
║  │   ├── Complemento               (opcional)               ║
║  │   ├── Bairro                    (obrigatório)            ║
║  │   ├── Cidade / Estado           (obrigatório)            ║
║  │   └── País                      (obrigatório)            ║
║  │                                                           ║
║  ├── CONTATOS (ambos os tipos):                             ║
║  │   ├── Telefone principal        (obrigatório)            ║
║  │   ├── WhatsApp comercial        (opcional)               ║
║  │   ├── Email comercial           (obrigatório)            ║
║  │   ├── Site                      (opcional)               ║
║  │   ├── Facebook (URL da página)  (opcional)               ║
║  │   └── Instagram (@ do perfil)   (opcional)               ║
║  │                                                           ║
║  └── Upload do logotipo            (opcional)               ║
║      └── Aparece em PDFs e relatórios                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - DOCUMENTOS                                          ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Modelo de cabeçalho dos PDFs                           ║
║  │   └── Logo + Nome + CPF/CNPJ + Endereço                 ║
║  │       + Redes sociais (se preenchidas)                   ║
║  ├── Rodapé personalizado                                   ║
║  ├── Numeração automática:                                  ║
║  │   ├── Pedidos:    PED-26-0001  (reinicia por ano)        ║
║  │   ├── Vendas:     VEN-26-0001  (reinicia por ano)        ║
║  │   ├── Produção:   OPD-26-0001  (reinicia por ano)        ║
║  │   ├── Compras:    CMP-26-0001  (reinicia por ano)        ║
║  │   ├── Recibo:     REC-26-0001  (reinicia por ano)        ║
║  │   └── Orçamento:  ORC-26-0001  (reinicia por ano)        ║
║  ├── Número cancelado não é reutilizado ✅                  ║
║  ├── Prefixos configuráveis pelo Admin                      ║
║  └── Preview do documento em tempo real                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - PARÂMETROS DO SISTEMA                               ║
╠══════════════════════════════════════════════════════════════╣
║  ├── ESTOQUE:                                               ║
║  │   ├── Método de custo: Preço Médio Ponderado            ║
║  │   ├── [S/N] Estoque negativo - Insumos                  ║
║  │   └── [S/N] Estoque negativo - Produto Final            ║
║  │                                                          ║
║  ├── VENDAS:                                               ║
║  │   ├── Permitir venda sem estoque: ✅ SIM                ║
║  │   └── Notificar produção ao vender sem estoque: ✅      ║
║  │                                                          ║
║  └── FINANCEIRO:                                           ║
║      ├── Moeda: R$ (Real Brasileiro)                       ║
║      ├── Casas decimais - Valores: 2                       ║
║      └── Casas decimais - Quantidades: 3                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - ALERTAS E NOTIFICAÇÕES                              ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Canal principal: 🔔 Notificação no sistema             ║
║  ├── Canal opcional:  📧 Email (por tipo de alerta)         ║
║  │                                                          ║
║  ├── ALERTAS DE ESTOQUE:                                   ║
║  │   ├── 🔴 Insumo abaixo do mínimo                       ║
║  │   ├── 🔴 Produto abaixo do mínimo                      ║
║  │   └── 🔵 Produto/Insumo próximo ao vencimento:         ║
║  │         ├── [✅] 🔵 60 dias - Planejar uso/venda       ║
║  │         ├── [✅] 🟡 30 dias - Priorizar uso/venda      ║
║  │         ├── [✅] 🟠 15 dias - Ação imediata            ║
║  │         └── [✅] 🔴  7 dias - Crítico                  ║
║  │                                                          ║
║  ├── ALERTAS FINANCEIROS:                                  ║
║  │   ├── 🔴 Conta a receber vencida                       ║
║  │   ├── 🟡 Conta a receber vence em 3 dias               ║
║  │   ├── 🔴 Conta a pagar vencida                         ║
║  │   └── 🟡 Conta a pagar vence em 3 dias                 ║
║  │                                                          ║
║  ├── ALERTAS DE PRODUÇÃO:                                  ║
║  │   ├── 🔴 Insumo insuficiente para produção             ║
║  │   ├── 🟡 Ordem de produção planejada para hoje         ║
║  │   └── 🟢 Venda gerada sem estoque                      ║
║  │                                                          ║
║  └── ALERTAS DE USUÁRIOS:                                  ║
║      └── 🔴 Usuário bloqueado solicitando acesso           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 05 - IMPORTAÇÃO DE DADOS                                 ║
╠══════════════════════════════════════════════════════════════╣
║  ├── TIPOS DE IMPORTAÇÃO:                                   ║
║  │   ├── 👤 Clientes                                       ║
║  │   ├── 🧴 Produtos e Embalagens                          ║
║  │   ├── 🧪 Insumos                                        ║
║  │   └── 🏪 Fornecedores                                   ║
║  │                                                          ║
║  ├── FORMATOS ACEITOS:                                      ║
║  │   ├── ✅ Excel (.xlsx e .xls)                           ║
║  │   ├── ✅ CSV (.csv) separador: (;) UTF-8                ║
║  │   └── ✅ Google Sheets (exportar como .xlsx ou .csv)    ║
║  │                                                          ║
║  ├── FLUXO DE IMPORTAÇÃO:                                   ║
║  │   ├── 1. Download do modelo formatado                   ║
║  │   ├── 2. Preenchimento pelo usuário                     ║
║  │   ├── 3. Upload do arquivo                              ║
║  │   ├── 4. Validação e relatório de erros                 ║
║  │   ├── 5. Prévia dos dados                               ║
║  │   └── 6. Confirmação e importação                       ║
║  │                                                          ║
║  └── REGRAS:                                               ║
║      ├── 🔴 Campo obrigatório                              ║
║      ├── 🟡 Campo opcional                                 ║
║      ├── Não duplica registros existentes                  ║
║      ├── Opção de atualizar se já existir                  ║
║      └── Guia de exportação do Google Sheets               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 01 (Autenticação): Usa dados da empresa para   ║
║  │   emails e personalização da tela de login.             ║
║  ├── Módulo 03 (Usuários): Configurações de sessão e       ║
║  │   perfis definidas aqui são aplicadas no controle de    ║
║  │   acesso.                                               ║
║  ├── Módulos 04, 05, 07, 12: Modelos de importação para   ║
║  │   fornecedores, produtos, insumos e clientes.           ║
║  ├── Módulo 13 (Tabela Preços): Margem mínima e metas de   ║
║  │   vendas podem ser configuradas globalmente.            ║
║  ├── Módulo 14 (Vendas) e 08 (Compras): Numeração         ║
║  │   automática de documentos.                             ║
║  ├── Módulo 15 (Financeiro): Moeda, casas decimais,        ║
║  │   alertas de vencimento usados em contas a receber/pagar.║
║  ├── Módulo 17 (Dashboard): Metas de vendas configuradas   ║
║  │   aqui são exibidas no dashboard.                       ║
║  ├── Módulo 19 (Notificações): Thresholds de alertas      ║
║  │   (estoque mínimo, vencimento) alimentam o sistema de   ║
║  │   notificações.                                         ║
║  ├── Módulo 20 (Logs): Período de retenção de logs         ║
║  │   configurado aqui.                                     ║
║  └── Módulo 12 (Clientes): Critérios de score, níveis      ║
║      e benefícios configurados na ABA 06 aqui.            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 06 - SCORE DE CLIENTES                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── CRIÉRIOS DE PONTUAÇÃO (3 configuráveis):              ║
║  │   ├── Critério 1: Volume de Compras                      ║
║  │   │   ├── Peso: [___]%                                  ║
║  │   │   ├── Faixa A: acima R$[___]/mês → [__]pts          ║
║  │   │   ├── Faixa B: R$[__] a R$[__]/mês → [__]pts       ║
║  │   │   └── Faixa C: abaixo R$[___]/mês → [__]pts         ║
║  │   ├── Critério 2: Frequência de Compra                   ║
║  │   │   ├── Peso: [___]%                                  ║
║  │   │   ├── Alta: +[__] compras/mês → [__]pts             ║
║  │   │   ├── Média: [__] compras/mês → [__]pts             ║
║  │   │   └── Baixa: -[__] compras/mês → [__]pts            ║
║  │   ├── Critério 3: Pontualidade de Pagamento              ║
║  │   │   ├── Peso: [___]%                                  ║
║  │   │   ├── Sempre em dia → [__]pts                       ║
║  │   │   ├── Atraso até [__] dias → [__]pts                ║
║  │   │   └── Atraso +[__] dias → [__]pts                   ║
║  │   └── ⚠️ Soma dos pesos = 100% (validação automática)   ║
║  │                                                          ║
║  ├── NÍVEIS DE FIDELIDADE (nomes e faixas configuráveis):  ║
║  │   ├── 🥇 Nível 1: nome [___] → [__] a [__] pts          ║
║  │   ├── 🥈 Nível 2: nome [___] → [__] a [__] pts          ║
║  │   └── 🥉 Nível 3: nome [___] → [__] a [__] pts          ║
║  │                                                          ║
║  ├── BENEFÍCIOS POR NÍVEL:                                   ║
║  │   ├── 🥇 Nível 1: desconto extra [__]%                  ║
║  │   ├── 🥈 Nível 2: condição especial de pagamento         ║
║  │   └── 🥉 Nível 3: sem benefício adicional              ║
║  │                                                          ║
║  ├── Recalculado automaticamente todo dia 1º do mês         ║
║  └── Notifica Admin em mudança de nível de qualquer cliente  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS:                                                       ║
║  └── 🖥️ Página única com 6 abas                             ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
╚══════════════════════════════════════════════════════════════╝