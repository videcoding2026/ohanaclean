╔══════════════════════════════════════════════════════════════╗
║              MÓDULO 07 - GESTÃO DE INSUMOS                  ║
║               ✅ FECHADO - VERSÃO ATUALIZADA                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Cadastrar e controlar todos os insumos             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS GERAIS                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Código automático (INS-001)     (automático)           ║
║  ├── Nome do insumo                  (obrigatório)          ║
║  │   └── Este é o INSUMO PAI                               ║
║  │       Ex: "Essência", "Embalagem", "Corante"            ║
║  ├── Nome técnico / químico          (opcional)             ║
║  ├── Descrição                       (opcional)             ║
║  ├── Categoria:                      (obrigatório)          ║
║  │   ├── 🧬 Base química                                   ║
║  │   ├── 🌿 Tensoativo                                     ║
║  │   ├── 🎨 Corante                                        ║
║  │   ├── 🌸 Perfume / Fragrância                          ║
║  │   ├── 🧂 Conservante                                    ║
║  │   ├── 💧 Solvente                                       ║
║  │   ├── 🔵 Espessante                                     ║
║  │   ├── 📦 Embalagem                                      ║
║  │   ├── 🏷️ Rótulo                                         ║
║  │   └── ➕ Outros                                         ║
║  ├── Unidade de compra (kg|g|L|ml|un)(obrigatório)         ║
║  ├── Unidade de uso na fórmula       (obrigatório)         ║
║  ├── Densidade (g/ml)                (opcional)            ║
║  │   └── Para conversão kg ↔ L                            ║
║  ├── Tem validade?                   [S/N]                 ║
║  │   ├── ✅ SIM: campo de validade ativo nas compras      ║
║  │   └── ❌ NÃO: validade oculta (ex: embalagens)        ║
║  ├── Insumo substituto               (opcional)            ║
║  │   ├── Insumo/Variante vinculado                        ║
║  │   ├── Proporção de substituição                        ║
║  │   └── Observação da substituição                       ║
║  └── Status: 🟢 Ativo | 🔴 Inativo                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - VARIANTES                                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── TOGGLE: "Este insumo possui variantes?" [S/N]          ║
║  │                                                          ║
║  ├── SE NÃO: insumo simples sem variantes                   ║
║  │   └── Ex: Lauril Sulfato, Água Oxigenada                ║
║  │                                                          ║
║  └── SE SIM: cadastro de variantes ativado                  ║
║      │                                                      ║
║      ├── EXEMPLOS DE USO:                                   ║
║      │   ├── 🌸 Essência:                                  ║
║      │   │   ├── VAR-01: Floral                           ║
║      │   │   ├── VAR-02: Limão                            ║
║      │   │   ├── VAR-03: Lavanda                          ║
║      │   │   └── VAR-04: Pinho                            ║
║      │   ├── 📦 Embalagem:                                ║
║      │   │   ├── VAR-01: Frasco 500ml                     ║
║      │   │   ├── VAR-02: Frasco 1L                        ║
║      │   │   ├── VAR-03: Galão 2L                         ║
║      │   │   └── VAR-04: Galão 5L                         ║
║      │   ├── 🎨 Corante:                                  ║
║      │   │   ├── VAR-01: Azul                             ║
║      │   │   ├── VAR-02: Verde                            ║
║      │   │   └── VAR-03: Amarelo                          ║
║      │   └── 🏷️ Rótulo:                                   ║
║      │       ├── VAR-01: Detergente 500ml                 ║
║      │       ├── VAR-02: Detergente 1L                    ║
║      │       └── VAR-03: Amaciante 2L                     ║
║      │                                                      ║
║      └── POR VARIANTE CADASTRA:                             ║
║          ├── Código automático (INS-001-VAR-01)            ║
║          ├── Nome da variante        (obrigatório)         ║
║          ├── Descrição               (opcional)            ║
║          ├── Tem validade?           [S/N]                 ║
║          │   └── Independente do insumo pai               ║
║          ├── Unidade de medida                             ║
║          │   └── Herda do pai (pode sobrescrever)         ║
║          ├── Estoque mínimo          (próprio)             ║
║          ├── Estoque máximo          (próprio/opcional)    ║
║          ├── Localização             (própria)             ║
║          ├── Fornecedor preferencial (opcional)            ║
║          └── Status: 🟢 Ativa | 🔴 Inativa                ║
║                                                              ║
║  ├── GESTÃO DAS VARIANTES:                                  ║
║  │   ├── Adicionar nova variante (botão +)                 ║
║  │   ├── Editar variante existente                         ║
║  │   ├── Inativar variante                                 ║
║  │   │   └── Não aparece em fórmulas/compras novas        ║
║  │   └── Reativar variante                                 ║
║  │                                                          ║
║  └── VISÃO CONSOLIDADA:                                     ║
║      └── Insumo pai mostra:                                ║
║          ├── Quantidade de variantes ativas                ║
║          └── Saldo total (soma das variantes)              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - ESTOQUE E LOCALIZAÇÃO                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── SE SEM VARIANTES:                                      ║
║  │   ├── Saldo único do insumo                             ║
║  │   ├── Valor total em estoque (R$)                       ║
║  │   ├── Estoque mínimo e máximo                           ║
║  │   └── Localização única                                 ║
║  │                                                          ║
║  ├── SE COM VARIANTES:                                      ║
║  │   ├── Saldo por variante (individual)                   ║
║  │   ├── Saldo total consolidado (soma)                    ║
║  │   ├── Estoque mínimo por variante                       ║
║  │   ├── Localização por variante                          ║
║  │   └── Alertas individuais por variante                  ║
║  │                                                          ║
║  ├── CONTROLE POR LOTE (por variante):                      ║
║  │   ├── Número do lote                                    ║
║  │   ├── Data de validade (se habilitada)                  ║
║  │   └── Método FEFO automático                            ║
║  │                                                          ║
║  └── ALERTAS DE ESTOQUE:                                    ║
║      ├── 🔴 Abaixo do mínimo (por variante)               ║
║      └── Vencimento: 🔵60d 🟡30d 🟠15d 🔴7d              ║
║          (somente se tem validade = SIM)                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - CUSTOS E FORNECEDORES                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── SE SEM VARIANTES:                                      ║
║  │   ├── Custo único (Preço Médio Ponderado)               ║
║  │   └── Fornecedores do insumo                            ║
║  │                                                          ║
║  ├── SE COM VARIANTES:                                      ║
║  │   ├── Custo por variante (PMP individual)               ║
║  │   ├── Fornecedores por variante                         ║
║  │   └── Comparativo de preços por variante                ║
║  │                                                          ║
║  ├── HISTÓRICO DE PREÇOS (gráfico)                          ║
║  ├── COMPARATIVO ENTRE FORNECEDORES:                        ║
║  │   ┌────────────────┬────────┬──────────┐               ║
║  │   │ Fornecedor     │ Preço  │ Prazo    │               ║
║  │   ├────────────────┼────────┼──────────┤               ║
║  │   │ Fornecedor A   │ R$5,00 │ 3 dias   │               ║
║  │   │ Fornecedor B   │ R$4,50 │ 7 dias   │               ║
║  │   └────────────────┴────────┴──────────┘               ║
║  │   💡 Menor preço: Fornecedor B                          ║
║  │                                                          ║
║  └── Fórmulas que usam esse insumo/variante                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 05 - FICHA TÉCNICA E SEGURANÇA                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Fabricante do insumo            (opcional)            ║
║  ├── CAS Number                      (opcional)            ║
║  ├── pH                              (opcional)            ║
║  ├── Densidade (g/ml)                (opcional)            ║
║  ├── Aparência / Cor                 (opcional)            ║
║  ├── Odor                            (opcional)            ║
║  ├── Classificação de risco          (opcional)            ║
║  ├── EPIs necessários:               (opcional)            ║
║  │   ├── 🧤 Luvas                                         ║
║  │   ├── 👓 Óculos de proteção                            ║
║  │   ├── 😷 Máscara                                       ║
║  │   └── 🦺 Avental                                       ║
║  ├── Incompatibilidades              (opcional)            ║
║  └── FISPQ (upload PDF):            (opcional)            ║
║      ├── ✅ Disponível                                     ║
║      ├── ⚠️ Pendente                                       ║
║      └── ❌ Vencida                                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 06 - HISTÓRICO E MOVIMENTAÇÕES                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── SE SEM VARIANTES:                                      ║
║  │   └── Histórico único do insumo                         ║
║  │                                                          ║
║  ├── SE COM VARIANTES:                                      ║
║  │   ├── Filtro por variante específica                    ║
║  │   └── Ou todas as variantes juntas                      ║
║  │                                                          ║
║  ├── TIPOS DE MOVIMENTAÇÃO:                                 ║
║  │   ├── ⬆️ Entradas (compras)                             ║
║  │   ├── ⬇️ Saídas (produções)                             ║
║  │   ├── 🔄 Transferências entre locais                    ║
║  │   └── ✏️ Ajustes manuais (com justificativa)            ║
║  │                                                          ║
║  ├── POR MOVIMENTAÇÃO:                                      ║
║  │   ├── Data e hora                                       ║
║  │   ├── Tipo e variante envolvida                         ║
║  │   ├── Quantidade e saldo resultante                     ║
║  │   ├── Referência (nº compra ou OP)                      ║
║  │   └── Usuário responsável                               ║
║  │                                                          ║
║  └── Histórico de substituições por variante               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 📋 MÓDULO 06 - FÓRMULAS:                               ║
║  │   └── Ao adicionar insumo com variantes:                ║
║  │       ├── Seleciona insumo pai                          ║
║  │       └── Seleciona variante específica                 ║
║  │           Ex: Essência → Floral                         ║
║  ├── 🛒 MÓDULO 08 - COMPRAS:                                ║
║  │   └── Compra por variante específica                    ║
║  │       Ex: comprar "Essência - Floral"                   ║
║  │       (não "Essência" genérico)                         ║
║  ├── 🏭 MÓDULO 09 - PRODUÇÃO:                               ║
║  │   └── Baixa de estoque por variante                     ║
║  │       conforme definido na fórmula                      ║
║  ├── 📊 MÓDULO 10 - ESTOQUE DE INSUMOS:                     ║
║  │   └── Saldo e alertas individuais                       ║
║  │       por variante                                      ║
║  ├── 🏪 MÓDULO 04 - FORNECEDORES:                           ║
║  │   └── Vínculo de fornecedor preferencial                ║
║  │       por variante                                      ║
║  ├── 📦 MÓDULO 05 - PRODUTOS:                               ║
║  │   └── Embalagens aqui cadastradas                       ║
║  │       podem ser referenciadas como insumos              ║
║  ├── ⚙️ MÓDULO 02 - CONFIGURAÇÕES:                          ║
║  │   └── Unidades de medida, casas decimais                ║
║  │       e método de custo (PMP) usados                    ║
║  ├── 🔔 MÓDULO 19 - NOTIFICAÇÕES:                           ║
║  │   └── Alertas de estoque mínimo e                       ║
║  │       vencimento disparam notificações                  ║
║  └── 📝 MÓDULO 20 - LOGS:                                   ║
║      └── Toda criação/edição/exclusão de                   ║
║          insumos e variantes é registrada                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE INSUMOS                                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca por nome / código / nome técnico                 ║
║  ├── Busca por variante                                     ║
║  ├── Filtro por categoria / status / local                  ║
║  ├── Indicadores visuais:                                   ║
║  │   ├── 🔴 Abaixo do estoque mínimo                      ║
║  │   ├── 🔵 Próximo ao vencimento                         ║
║  │   ├── 🎨 Tem variantes (badge com quantidade)           ║
║  │   └── 📄 Status da FISPQ                               ║
║  ├── Ordenação: nome | estoque | validade                   ║
║  └── Exportar lista (Excel / PDF)                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INVENTÁRIO FÍSICO                                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Abertura pelo Admin                                    ║
║  ├── Contagem por insumo E por variante                     ║
║  ├── Comparativo: sistema × contagem                        ║
║  ├── Ajuste com motivo obrigatório                          ║
║  └── Histórico de inventários realizados                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🖥️ Lista de Insumos                                    ║
║  │   └── (com indicador de variantes)                      ║
║  ├── 🖥️ Cadastro/Edição de Insumo (6 abas)                  ║
║  │   ├── Aba 01: Dados Gerais                               ║
║  │   ├── Aba 02: Variantes                                  ║
║  │   ├── Aba 03: Estoque e Localização                      ║
║  │   ├── Aba 04: Custos e Fornecedores                      ║
║  │   ├── Aba 05: Ficha Técnica e Segurança                  ║
║  │   └── Aba 06: Histórico e Movimentações                  ║
║  └── 🖥️ Inventário Físico                                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐ Alta                                   ║
║ (subiu de ⭐⭐⭐ pela inclusão do sistema de variantes)      ║
╚══════════════════════════════════════════════════════════════╝