# Cronograma de Desenvolvimento: Ohana Clean (LLMARENA)

Este cronograma foi estruturado visando o desenvolvimento seguro, progressivo e com o menor índice de erros possível. A ordem das fases respeita as dependências do sistema: não faz sentido criar o módulo de "Vendas" antes de ter "Produtos" e "Clientes", por exemplo.

O desenvolvimento será fortemente acelerado pela adoção do **Shadcn UI** e pelas definições do `SystemDesign.md`, que padronizam a criação das telas.

---

## Fase 1: Fundação, Acessos e Layout Global
**Foco:** Estabelecer o alicerce do projeto, garantir que o design system esteja aplicado em toda a raiz do projeto e que o controle de acesso funcione.

1. **Setup Inicial (Configuração do Repositório):**
   - Instalação **Vite + React** com **TypeScript** e **Tailwind CSS**.
   - Inicialização do banco de dados e backend via **Convex** (BaaS real-time).
   - Configuração do **Shadcn UI** e integração das variáveis do `SystemDesign.md` (`globals.css` e `tailwind.config`).
   - Criação do Layout Base (Sidebar responsiva, Cabeçalho, suporte a Dark/Light mode).
2. **MÓDULO 01 - AUTENTICAÇÃO E SEGURANÇA:**
   - Telas de Login, Recuperação de Senha.
   - Lógica de autenticação e proteção de rotas (Middleware).
3. **MÓDULO 02 - CONFIGURAÇÕES DA EMPRESA:**
   - Tela para dados globais da empresa, cruciais para geração de PDFs e emissão de documentos.
4. **MÓDULO 03 - GESTÃO DE USUÁRIOS E PERMISSÕES:**
   - Criação de perfis, RBAC (Role-Based Access Control).

---

## Fase 2: Cadastros Essenciais (Entidades Independentes)
**Foco:** Criar as tabelas e cadastros que alimentarão todo o resto do sistema. Eles não dependem de operações complexas.

1. **MÓDULO 04 - CADASTRO DE FORNECEDORES:**
   - Componentes chave: `DataTable` com filtros, `Dialog` para criação/edição.
2. **MÓDULO 08 - CADASTRO DE CLIENTES:**
   - Reutilização da lógica do módulo anterior (tabelas e modais).
3. **MÓDULO 05 - GESTÃO DE INSUMOS:**
   - Módulo que originou o `SystemDesign.md`. Validação completa de badges, status visual e alertas de estoque mínimo.
4. **MÓDULO 07 - CADASTRO DE PRODUTOS:**
   - Produtos finais que serão vendidos (ainda sem a complexidade da fórmula).

---

## Fase 3: Core Operacional da Indústria
**Foco:** O coração da fabricação. Como os insumos se transformam em produtos.

1. **MÓDULO 06 - GESTÃO DE FÓRMULAS:**
   - Conexão entre Produtos (Mod 07) e Insumos (Mod 05).
   - Telas mais complexas de relacionamento (1 Produto = N Insumos).
2. **MÓDULO 10 - CONTROLE DE ESTOQUE:**
   - Visualização gerencial de saldos, entradas e saídas automáticas e manuais.
3. **MÓDULO 09 - COMPRAS DE INSUMOS:**
   - Geração de pedidos de compra baseados no estoque mínimo e associação aos Fornecedores (Mod 04).

---

## Fase 4: Produção, Precificação e Vendas
**Foco:** O fluxo de geração de receita.

1. **MÓDULO 11 - GESTÃO DE PRODUÇÃO:**
   - Emissão de Ordens de Produção (baixa Insumos, gera Produtos finalizados).
   - Uso intenso de `Badges` coloridas para status da produção (Pendente, Em Andamento, Concluída).
2. **MÓDULO 12 - TABELA DE PREÇOS:**
   - Precificação baseada no custo dos insumos da fórmula + margem de lucro.
3. **MÓDULO 13 - PEDIDOS E VENDAS:**
   - Frente de caixa/vendas corporativas. Seleção de Clientes (Mod 08), inserção de Produtos (Mod 07) usando os Preços (Mod 12).
   - Baixa final no Estoque (Mod 10).

---

## Fase 5: Financeiro, Gestão e Auditoria
**Foco:** Módulos de apoio, gerência e fechamento do ciclo de vida da informação.

1. **MÓDULO 14 - GESTÃO FINANCEIRA:**
   - Contas a Pagar (originado por Compras - Mod 09).
   - Contas a Receber (originado por Vendas - Mod 13).
2. **MÓDULO 15 - INTELIGÊNCIA GERENCIAL:**
   - Dashboards analíticos, gráficos, KPIs financeiros e de produção.
3. **MÓDULO 16 - NOTIFICAÇÕES E ALERTAS:**
   - Alertas visuais (Toast/Snackbar) para estoque baixo, vencimentos e contas atrasadas.
4. **MÓDULO 17 - LOGS E AUDITORIA:**
   - Tabela de rastreamento de ações de usuários (somente leitura para administradores).

---

### Metodologia de Implementação Contínua
Para cada módulo, o fluxo de desenvolvimento será padronizado:
1. **Estrutura de Dados:** Definição do modelo/interface (Typescript).
2. **Componentes UI (Shadcn):** Reaproveitamento dos blocos de interface guiados pelo `SystemDesign.md`.
3. **Integração de Lógica:** Hooks e estado da tela.
4. **Testes Visuais e Fluxo:** Garantir o funcionamento sem erros e validação do Dark Mode.
