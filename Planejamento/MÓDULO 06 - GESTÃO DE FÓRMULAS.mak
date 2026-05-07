╔══════════════════════════════════════════════════════════════╗
║              MÓDULO 06 - GESTÃO DE FÓRMULAS                 ║
║               ✅ FECHADO - VERSÃO ATUALIZADA                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Cadastrar e gerenciar fórmulas de fabricação       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 01 - DADOS GERAIS                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Código automático (FRM-001)                             ║
║  ├── Nome da fórmula              (obrigatório)             ║
║  ├── Produto vinculado            (obrigatório)             ║
║  ├── Versão automática (v1.0...)  (automático)              ║
║  ├── Descrição / Observações      (opcional)                ║
║  ├── Rendimento BASE de referência                          ║
║  │   └── Ex: receita para 100L                             ║
║  │       (lote real varia por demanda)                      ║
║  ├── Unidade: L | ml | kg | g | un                         ║
║  ├── Tempo estimado de produção   (opcional)                ║
║  ├── Toggle: Habilitar controle de qualidade [S/N]          ║
║  └── Status: 🟢 Ativa | 🟡 Em teste | 🔴 Inativa           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 02 - COMPOSIÇÃO E ORDEM DE ADIÇÃO                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── SELEÇÃO DE INSUMO COM VARIANTES:                       ║
║  │   ├── PASSO 1: Selecionar insumo pai                    ║
║  │   │   └── Ex: "Essência"                                ║
║  │   ├── PASSO 2: Se insumo tem variantes:                 ║
║  │   │   └── Selecionar variante específica                ║
║  │   │       Ex: "Essência → Floral"                       ║
║  │   └── PASSO 3: Se insumo sem variantes:                 ║
║  │       └── Segue direto para quantidade                  ║
║  │                                                          ║
║  ├── LISTA DE INSUMOS DA FÓRMULA:                           ║
║  │   ├── Nº de ordem (drag and drop)                       ║
║  │   ├── Insumo pai + variante selecionada                 ║
║  │   │   Ex: "Essência - Floral"                           ║
║  │   │       "Embalagem - Frasco 500ml"                    ║
║  │   │       "Corante - Azul"                              ║
║  │   ├── Quantidade para receita base                      ║
║  │   ├── Unidade de medida                                 ║
║  │   ├── Percentual na fórmula (auto %)                    ║
║  │   ├── Temperatura necessária (opcional)                 ║
║  │   ├── Tempo de mistura       (opcional)                 ║
║  │   └── ⚠️ Observação crítica  (opcional)                 ║
║  │                                                          ║
║  ├── VALIDAÇÕES:                                            ║
║  │   ├── Percentual total deve = 100%                      ║
║  │   ├── ⚠️ Alerta se percentual ≠ 100%                   ║
║  │   └── ⚠️ Alerta se variante inativa                    ║
║  │       "A variante [X] está inativa.                     ║
║  │        Selecione outra variante."                       ║
║  │                                                          ║
║  ├── TOTALIZADORES:                                         ║
║  │   ├── Peso/Volume total                                 ║
║  │   └── Quantidade de insumos/variantes                   ║
║  │                                                          ║
║  └── CHECKLIST SEQUENCIAL:                                  ║
║      └── Gerado automaticamente com                        ║
║          nome completo (insumo + variante)                  ║
║          Ex: "Adicionar 50ml Essência - Floral"            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 03 - CUSTOS                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── CUSTO POR VARIANTE:                                    ║
║  │   └── Sistema usa o Preço Médio Ponderado               ║
║  │       específico de cada variante                       ║
║  │       Ex: Essência Floral: R$ x,xx / L                  ║
║  │           Essência Limão:  R$ x,xx / L                  ║
║  │           (preços diferentes por variante)              ║
║  │                                                          ║
║  ├── COMPOSIÇÃO DO CUSTO DO LOTE:                           ║
║  │   ├── Insumo A (sem variante): R$ xx,xx                 ║
║  │   ├── Essência - Floral:       R$ xx,xx                 ║
║  │   ├── Corante - Azul:          R$ xx,xx                 ║
║  │   └── Embalagem - 500ml:       R$ xx,xx                 ║
║  │                                                          ║
║  ├── CUSTO AUTOMÁTICO:                                      ║
║  │   ├── Custo de cada variante na fórmula:                ║
║  │   │   └── Qtde × PMP da variante                       ║
║  │   ├── Custo total do lote                               ║
║  │   ├── Custo por litro/kg                                ║
║  │   └── Custo por embalagem (500ml, 1L, 2L, 5L)          ║
║  │                                                          ║
║  ├── ATUALIZAÇÃO AUTOMÁTICA:                                ║
║  │   └── Quando PMP de uma variante muda                   ║
║  │       o custo da fórmula atualiza                       ║
║  │       automaticamente em tempo real                     ║
║  │                                                          ║
║  ├── CUSTOS ADICIONAIS (opcionais):                         ║
║  │   ├── 💡 Energia elétrica (R$/lote)                    ║
║  │   ├── 💧 Água (R$/lote)                                ║
║  │   ├── 👷 Mão de obra (R$/hora × horas)                 ║
║  │   └── ➕ Outros customizáveis                           ║
║  │                                                          ║
║  ├── TOTAIS:                                                ║
║  │   ├── Custo insumos/variantes: R$ xx,xx                 ║
║  │   ├── (+) Custos adicionais:   R$ xx,xx                 ║
║  │   └── (=) Custo total lote:    R$ xx,xx                 ║
║  │                                                          ║
║  ├── Gráfico pizza (composição do custo por variante)       ║
║  └── Visibilidade conforme Módulo 03 (R$ xx,xx)            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 04 - CONTROLE DE QUALIDADE (opcional)                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Habilitado via toggle (Aba 01)                         ║
║  ├── Parâmetros (todos opcionais):                          ║
║  │   ├── pH: mínimo [___] máximo [___]                    ║
║  │   ├── Viscosidade esperada                              ║
║  │   ├── Cor esperada                                      ║
║  │   ├── Aroma esperado                                    ║
║  │   ├── Aspecto visual                                    ║
║  │   └── ➕ Parâmetros customizados                        ║
║  ├── Resultado: ✅ Aprovado | ❌ Reprovado                 ║
║  ├── Notificação ao Admin se reprovado                      ║
║  └── Histórico e taxa de aprovação (%)                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABA 05 - HISTÓRICO DE VERSÕES                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Linha do tempo de versões                              ║
║  ├── Por versão registra:                                   ║
║  │   ├── Data, usuário e motivo                            ║
║  │   └── O que mudou (antes × depois):                     ║
║  │       ├── Troca de variante:                            ║
║  │       │   "Essência: Floral → Limão"                   ║
║  │       ├── Mudança de quantidade:                        ║
║  │       │   "Essência Floral: 50ml → 45ml"               ║
║  │       └── Adição/remoção de insumo/variante             ║
║  ├── Comparativo lado a lado entre versões                  ║
║  │   ├── Mostra insumo + variante de cada versão           ║
║  │   └── Destaca variantes que mudaram                     ║
║  ├── Impacto no custo entre versões                         ║
║  │   └── Por variante que mudou                            ║
║  ├── Avaliações e observações pós produção                  ║
║  ├── Classificação da produção (⭐ 1 a 5)                  ║
║  └── Restaurar versão anterior (gera nova versão)          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 05 (Produtos): Fórmula vinculada ao produto;    ║
║  │   custo da fórmula base para precificação.              ║
║  ├── Módulo 07 (Insumos): Usa insumos e variantes          ║
║  │   cadastrados; PMP das variantes alimenta custos.       ║
║  ├── Módulo 09 (Produção): Checklist e ordem de adição     ║
║  │   são usados na execução da OP; verificação de estoque  ║
║  │   por variante.                                         ║
║  ├── Módulo 10 (Estoque Insumos): Consumo de insumos       ║
║  │   afeta PMP, que atualiza custo da fórmula.             ║
║  ├── Módulo 13 (Tabela Preços): Custo da fórmula compõe    ║
║  │   custo do produto final para precificação.             ║
║  ├── Módulo 19 (Notificações): Alerta sobre variante       ║
║  │   inativa ou falta de insumos na simulação.             ║
║  └── Módulo 20 (Logs): Histórico de versões da fórmula.    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ SIMULADOR DE PRODUÇÃO E PREÇOS                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── SIMULADOR 1 - PRODUÇÃO:                                ║
║  │   ├── Informa quantidade desejada                       ║
║  │   ├── Lista insumos E variantes necessários:            ║
║  │   │   ├── Insumo A: X kg                               ║
║  │   │   ├── Essência - Floral: X ml                      ║
║  │   │   └── Corante - Azul: X ml                         ║
║  │   ├── Verificação de estoque por variante:              ║
║  │   │   ├── ✅ Essência Floral: tem 2L, precisa 0,5L     ║
║  │   │   └── ❌ Corante Azul: tem 0,1L, precisa 0,3L     ║
║  │   │       "Falta 0,2L do Corante Azul"                 ║
║  │   ├── Custo total por variante                          ║
║  │   ├── Quantidade de unidades por embalagem              ║
║  │   └── Exporta lista de insumos/variantes (PDF)          ║
║  │       └── Para usar como lista de compras               ║
║  │                                                          ║
║  └── SIMULADOR 2 - PREÇOS:                                 ║
║      ├── Informa quantidade e margem desejada              ║
║      ├── Custo por variante de embalagem                   ║
║      │   └── Ex: custo com Frasco 500ml                   ║
║      │             custo com Galão 5L                      ║
║      ├── Preço sugerido por embalagem                      ║
║      ├── Lucro por unidade e total                         ║
║      └── Exporta simulação (PDF)                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ LISTA DE FÓRMULAS                                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Busca por nome / produto / código                      ║
║  ├── Filtro por categoria / status / versão                 ║
║  └── Exportar ficha da fórmula (PDF):                       ║
║      ├── Versão produção:                                   ║
║      │   ├── Sem custos                                    ║
║      │   └── Insumo + variante + quantidade                ║
║      └── Versão gerencial:                                  ║
║          ├── Com custos por variante                       ║
║          └── Custo total do lote                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 🖥️ Lista de Fórmulas                                   ║
║  ├── 🖥️ Cadastro/Edição (5 abas)                            ║
║  │   ├── Aba 01: Dados Gerais                               ║
║  │   ├── Aba 02: Composição e Ordem de Adição              ║
║  │   │   └── Com seleção de insumo + variante              ║
║  │   ├── Aba 03: Custos                                     ║
║  │   │   └── Com custo por variante                        ║
║  │   ├── Aba 04: Controle de Qualidade                      ║
║  │   └── Aba 05: Histórico de Versões                       ║
║  │       └── Com histórico de troca de variantes           ║
║  ├── 🖥️ Comparativo de Versões                              ║
║  │   └── Com destaque para variantes alteradas             ║
║  └── 🖥️ Simulador (Produção e Preços)                       ║
║      └── Com verificação de estoque por variante           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐⭐ Alta                                   ║
║ (mantida - variantes já estavam previstas na integração)    ║
╚══════════════════════════════════════════════════════════════╝