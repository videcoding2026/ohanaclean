╔══════════════════════════════════════════════════════════════╗
║           MÓDULO 05 - CADASTRO DE PRODUTOS                  ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Cadastrar produtos, embalagens e fichas técnicas   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS GERAIS                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Código interno (automático: PRD-001)                    ║
║  ├── Nome do produto            (obrigatório)               ║
║  ├── Descrição                  (opcional)                  ║
║  ├── Categoria                  (obrigatório)               ║
║  │   ├── 🧺 Lava Roupas                                ║
║  │   ├── 🌸 Amaciante                                   ║
║  │   ├── 🍽️ Detergente                                 ║
║  │   ├── 🧹 Desinfetante                                ║
║  │   ├── ✨ Limpa Alumínio Pasta                        ║
║  │   ├── ✨ Limpa Alumínio Líquido                      ║
║  │   └── ➕ Outros (personalizável)                     ║
║  ├── Imagem do produto          (opcional)                  ║
║  └── Status:                                               ║
║      ├── 🟢 Ativo                                        ║
║      ├── 🟡 Em desenvolvimento                          ║
║      └── 🔴 Inativo                                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - EMBALAGENS E PREÇOS                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Presets disponíveis:                                    ║
║  │   ├── 500 ml (Frasco)                                   ║
║  │   ├── 1 L   (Frasco/Galão)                             ║
║  │   ├── 2 L   (Galão)                                    ║
║  │   └── 5 L   (Galão)                                    ║
║  │                                                          ║
║  ├── Por embalagem:                                         ║
║  │   ├── Nome da embalagem                                 ║
║  │   ├── Volume: [500] [ml | L | g | kg | un]              ║
║  │   ├── Tipo: Frasco | Galão | Balde | Sachê | Bisnaga    ║
║  │   ├── Código de barras / EAN (opcional)                 ║
║  │   ├── SKU automático (ex: PRD001-500ML)                 ║
║  │   ├── Custo da embalagem física (R$)                    ║
║  │   └── Status da embalagem                               ║
║  │                                                          ║
║  ├── PRECIFICAÇÃO:                                          ║
║  │   ├── Custo total = Fórmula + Embalagem                 ║
║  │   ├── Margem global padrão: 45%                         ║
║  │   ├── Margem específica por embalagem (opcional)        ║
║  │   ├── Preço sugerido automático                         ║
║  │   ├── Preço de venda manual                             ║
║  │   ├── Margem real (%)                                   ║
║  │   └── Lucro por unidade (R$)                            ║
║  │                                                          ║
║  └── 1 fórmula ativa por produto (base da receita)         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - FICHA TÉCNICA                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Modo de uso / Aplicação       (obrigatório)            ║
║  ├── Precauções de uso             (obrigatório)            ║
║  ├── Composição resumida           (obrigatório)            ║
║  ├── pH do produto                 (opcional)               ║
║  ├── Cor e aspecto                 (opcional)               ║
║  ├── Fragrância / Aroma            (opcional)               ║
║  ├── Temperatura ideal             (opcional)               ║
║  ├── Local de armazenagem          (opcional)               ║
║  └── Validade média                (obrigatório)            ║
║                                                              ║
║  └── Gerar PDF da Ficha Técnica (formato profissional)      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - HISTÓRICO E VÍNCULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Estoque atual por embalagem                            ║
║  ├── Histórico de produção                                  ║
║  ├── Histórico de vendas                                    ║
║  └── Fórmula vinculada (custo atualizado em tempo real)     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 06 (Fórmulas): Produto vinculado à fórmula;     ║
║  │   custo da fórmula alimenta custo total do produto.     ║
║  ├── Módulo 07 (Insumos): Embalagens podem ser tratadas     ║
║  │   como variantes de insumo (ex: Embalagem - 500ml).     ║
║  ├── Módulo 11 (Estoque Produtos): Exibe estoque atual      ║
║  │   por embalagem na Aba 04.                              ║
║  ├── Módulo 13 (Tabela Preços): Preços de venda definidos  ║
║  │   nas embalagens alimentam as tabelas.                  ║
║  ├── Módulo 14 (Vendas): SKU e embalagens são usados nos   ║
║  │   itens do pedido.                                      ║
║  └── Módulo 18 (Relatórios): Catálogo de produtos e        ║
║      fichas técnicas em PDF.                               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE PRODUTOS                                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca por nome / código                                ║
║  ├── Filtro por categoria / status                          ║
║  ├── Visualização: Lista ou Cards com imagem                ║
║  ├── Ordenação: Nome | Mais vendido | Estoque               ║
║  └── Gerar Catálogo PDF (seleção de produtos)               ║
║      └── Inclui imagens, preços, fichas técnicas            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Lista de Produtos                                   ║
║  └── 🖥️ Cadastro/Edição com 4 abas                          ║
║      ├── Aba 01: Dados Gerais                               ║
║      ├── Aba 02: Embalagens e Preços                        ║
║      ├── Aba 03: Ficha Técnica                              ║
║      └── Aba 04: Histórico e Vínculos                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
╚══════════════════════════════════════════════════════════════╝