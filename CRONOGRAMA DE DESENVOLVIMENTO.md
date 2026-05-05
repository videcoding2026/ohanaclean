# Cronograma de Desenvolvimento: Ohana Clean (LLMARENA)

Este cronograma reflete o estado real da implementação, incluindo todas as alterações e antecipações que ocorreram durante o desenvolvimento. A ordem das fases respeita as dependências do sistema.

O desenvolvimento é acelerado pelo **Shadcn UI**, **Convex** e pelas definições do `SystemDesign.md`.

---

## Fase 1: Fundação, Acessos e Layout Global ✅ CONCLUÍDA
**Foco:** Estabelecer o alicerce do projeto, garantir que o design system esteja aplicado e que o controle de acesso funcione.

| Item | Descrição | Status |
|------|-----------|--------|
| Setup Inicial | Vite + React + TS + Tailwind + Convex + Shadcn UI + Layout (sidebar, dark/light mode) | ✅ |
| MÓDULO 01 | **Autenticação e Segurança** — Login, ForgotPassword, AccountBlocked, bloqueio progressivo (3/6/9 falhas), proteção de rotas, Redirect automático, tradução de erros Convex | ✅ |
| MÓDULO 02 | **Configurações da Empresa** — 6 abas (Dados Gerais, Contato, Documentos, Parâmetros, Score, Alertas), upload de logo via Convex Storage, prefixos de documentos, métodos de custeio | ✅ |
| MÓDULO 03 | **Usuários e Permissões** — CRUD com matriz RBAC 11×6 (Admin, Produção, Estoque, Vendas, Financeiro, Visualizador), FirstBootCheck, SetupAdmin, bloqueio de conta | ✅ |

**Tabelas criadas:** companies, users (Convex Auth), userProfiles, auditLogs

---

## Fase 2: Cadastros Essenciais (Entidades Independentes) ✅ CONCLUÍDA
**Foco:** Criar as tabelas e cadastros que alimentarão todo o resto do sistema.

| Item | Descrição | Status |
|------|-----------|--------|
| MÓDULO 04 | **Fornecedores** — 6 abas (Dados Gerais, Contato, Endereço, Dados Bancários, Documentos, Marketplace), PF/PJ, supplierType (direto/marketplace), marketplaceName, marketplaceLink | ✅ |
| MÓDULO 08 | **Clientes** — 4 abas (Dados Gerais, Contato, Endereço, Score/Classificação), PF/PJ, histórico de score | ✅ |
| MÓDULO 05 | **Insumos** — 6 abas, variantes (insumoVariants) com dialog, controle de validade, unidade de medida, estoque mínimo/máximo, fornecedor preferencial, **precoMedio (PMP)** | ✅ |
| MÓDULO 07 | **Produtos** — 4 abas (Dados Gerais, Embalagens com dialog de precificação, Composição, Especificações), status (Ativo/Em desenvolvimento/Inativo) | ✅ |

**Tabelas criadas:** suppliers, clients, insumos, insumoVariants, products, productPackagings

---

## Fase 3: Core Operacional da Indústria ✅ CONCLUÍDA
**Foco:** O coração da fabricação. Como os insumos se transformam em produtos.

| Item | Descrição | Status |
|------|-----------|--------|
| MÓDULO 06 | **Fórmulas** — 5 abas, composição com ingredientes + variantes, máscara decimal 0,000 kg/L, auto-preenchimento unidade, enter adiciona ingrediente, ingredientes em cache, vínculo Produto-Insumo | ✅ |
| MÓDULO 09 | **Compras de Insumos** — workflow completo com 8 status, multi-page (lista/nova/detalhe/receber/devolver), marketplace/direto, auto-numeração, PMP, contasPagar, timeline de status, devoluções | ✅ |
| MÓDULO 10 | **Controle de Estoque** — 4 abas (Insumos/Produtos/Movimentações/Inventário), dashboard com KPIs, histórico por variante/produto, ajuste manual, transferência entre locais, inventário físico com fluxo completo | ✅ |

**Ordem alterada:** MÓDULO 09 (Compras) implementado antes do MÓDULO 10 (Estoque). Invertido por dependência do PMP.

### MÓDULO 09 - Compras de Insumos (detalhamento)

Este módulo cresceu significativamente em relação ao planejamento original, tornando-se o módulo mais complexo do sistema até o momento.

#### Arquitetura de Páginas (multi-page)
| Rota | Página | Arquivo |
|------|--------|---------|
| `/compras` | Lista com filtros, cards de KPI, busca | `PurchasesPage.tsx` |
| `/compras/nova` | Criação (direto/marketplace toggle, itens, rascunho/confirmar) | `NewPurchase.tsx` |
| `/compras/:id` | Detalhe com ações por status, timeline, contas a pagar, devoluções | `PurchaseDetail.tsx` |
| `/compras/:id/receber` | Recebimento de itens (total/parcial, PMP) | `ReceivePurchase.tsx` |
| `/compras/:id/devolver` | Devolução de itens (motivo, resolução: reenvio/crédito/estorno) | `ReturnPurchase.tsx` |

#### Workflow de Status
```
Rascunho ──[Confirmar Pedido]──→ Aguard. Pagamento ──[Pagamento]──→ Em transito ──[Receber]──→ Recebida
    │                                  │                                                        │
    └──[Marketplace]──→ Pedida ────────┘                                              Recebida parcialmente
                                                                                            │
                                                                                     [Devolver]──→ Devolvida

Cancelada ←────[Cancelar]─────── (disponível em Rascunho, Pedida, Aguard. Pagamento, Em transito)
```

#### Funcionalidades implementadas
- **Toggle Direto vs Marketplace**: filtra fornecedores por `supplierType` automaticamente
- **Auto-numeração**: geração de número de pedido (`CMP-YY-NNNN`) via prefixo da empresa
- **Rascunho**: salvar sem confirmar, editar via `?edit=` (updateDraft), confirmar via `?confirm=`
- **Contas a Pagar** (antecipação MÓDULO 14): criação automática ao confirmar pedido
  - PIX/Dinheiro: parcela única, paga na hora
  - Cartão: parcelamento (1x, 30/60d, 30/60/90d)
  - Boleto: parcela única, status "Aberta"
- **PMP (Preço Médio Ponderado)**: recalculado ao receber itens, armazenado em `insumoVariants.precoMedio`
- **Timeline de Status** (purchaseHistories): registro completo de cada transição com usuário, data/hora e observação
- **Devoluções** (purchaseReturns): registro de motivo e resolução, ajuste de quantidade no estoque da variante
- **Modais de Sucesso** (SystemDesign.md §5): animação `animate-pulse`, valor total destacado, botão "Ir para Lista"
- **Botões Flutuantes** (SystemDesign.md §4): ações na lista com `group-hover/row opacity-0→100`, ícones 👁️ ✏️ 🗑️
- **Status Badges** com ícones e cores por status (8 estados visuais)

#### Tabelas novas criadas
| Tabela | Descrição | Índices |
|--------|-----------|---------|
| purchases | Compras (header) | by_status, by_fornecedorId, by_numero |
| purchaseItems | Itens da compra | by_purchaseId |
| purchaseHistories | Timeline de status | by_purchaseId, by_data |
| purchaseReturns | Devoluções | by_purchaseId |
| contasPagar | Contas a pagar | by_purchaseId, by_status, by_dataVencimento |
| insumoVariants | +campo `precoMedio` (PMP) | — (schema alterado) |
| companies | +campo `prefixoCompra` | — (schema alterado) |

#### Novos utilitários
| Função | Arquivo | Descrição |
|--------|---------|-----------|
| `maskMoney()` | `src/lib/masks.ts` | Máscara monetária (ex: 2535 → 25,35) |
| `parseMoney()` | `src/lib/masks.ts` | Converte máscara → número (ex: "25,35" → 25.35) |

#### Dependências entre módulos na Fase 3
```
MÓDULO 06 (Fórmulas) ← depende de → MÓDULO 05 (Insumos) + MÓDULO 07 (Produtos)
MÓDULO 09 (Compras)  ← depende de → MÓDULO 04 (Fornecedores) + MÓDULO 05 (Insumos)
MÓDULO 10 (Estoque)  ← depende de → MÓDULO 05 (Insumos) + MÓDULO 09 (Compras)
```

---

## Fase 4: Produção, Precificação e Vendas 🔄 EM ANDAMENTO
**Foco:** O fluxo de geração de receita.

| Item | Descrição | Status |
|------|-----------|--------|
| MÓDULO 11 | **Gestão de Produção** — Ordens de Produção com verificação de estoque por variante, checklist, baixa automática, custo real, lotes, **CQ/Quarentena** (reprovar → quarentena → liberar/reprocessar/descartar) | ✅ |
| MÓDULO 12 | **Tabela de Preços** — Tabelas de preço com 4 abas (Dados/Preços/Clientes/Histórico), base por outra tabela com ajuste %, reajuste em lote, histórico de alterações, vínculo com clientes | ✅ |
| MÓDULO 13 | **Pedidos e Vendas** — PDV com seleção cliente/produto, preço automático da tabela, Orçamento ↔ Pedido, fluxo de status (Conf→Separação→Entrega/Retirada→Concluído), contas a receber, baixa/estorno estoque, timeline | ✅ |

**Dependências:** MÓDULO 10 (Estoque) + MÓDULO 11 (Produção) → MÓDULO 13 (Vendas)

### MÓDULO 11 - Gestão de Produção (detalhamento)
... (ver seção acima)

### MÓDULO 13 - Pedidos e Vendas (detalhamento)

| Rota | Página | Função |
|------|--------|--------|
| `/pedidos` | OrdersPage | Lista com KPIs, filtros status/tipo, busca |
| `/pedidos/nova` | NewOrderPage | PDV: seleção cliente, tabela preço auto, produtos, descontos, frete, pagamento |
| `/pedidos/:id` | OrderDetailPage | Detalhe com ações por status, itens, contas a receber, timeline |

**Status workflow:** Orçamento → Confirmado → Em Separação → Aguardando Retirada / Saiu Entrega → Concluído (+ Cancelado). Orçamento converte para Pedido com 1 clique.

**Integrações:** Clientes (M08), Tabela de Preços (M12), Estoque de Produtos (M10), Contas a Receber (M14 parcial)

---

## Fase 5: Financeiro, Gestão e Auditoria 🔄 PARCIAL
**Foco:** Módulos de apoio, gerência e fechamento do ciclo de vida.

| Item | Descrição | Status |
|------|-----------|--------|
| MÓDULO 14 | **Gestão Financeira** — Contas a Pagar (CRUD + conciliação), Contas a Receber (originado de Vendas) | 🔄 ContasPagar parcial (criado via Compras, falta CRUD próprio e conciliação bancária) |
| MÓDULO 15 | **Inteligência Gerencial** — Dashboards analíticos, gráficos, KPIs | ❌ |
| MÓDULO 16 | **Notificações e Alertas** — Estoque baixo, vencimentos, contas atrasadas | ❌ |
| MÓDULO 17 | **Logs e Auditoria** — Tabela auditLogs já existe e é alimentada por todos os módulos | ✅ auditLogs implementado |

---

### Resumo de Progresso

| Fase | Módulos | Status |
|------|---------|--------|
| Fase 1 | M01, M02, M03 | ✅ 100% |
| Fase 2 | M04, M05, M07, M08 | ✅ 100% |
| Fase 3 | M06, M09, M10 | ✅ 100% |
| Fase 4 | M11, M12, M13 | ✅ 100% |
| Fase 5 | M14, M15, M16, M17 | 🔄 25% (M17 OK, M14 parcial) |

**Total:** 11 módulos concluídos, 1 parcial (M14), 3 pendentes

### Próximo passo recomendado
**MÓDULO 14 - Gestão Financeira** — completar Contas a Pagar (CRUD + conciliação) e Contas a Receber (já geradas por M13). Fase 5.

---

### Metodologia de Implementação Contínua
Para cada módulo, o fluxo de desenvolvimento é padronizado:
1. **Estrutura de Dados:** Definição do schema Convex + indexes + relações
2. **Backend:** Queries e mutations com RBAC, validação Zod, auditLogs
3. **Componentes UI (Shadcn):** Reaproveitamento dos blocos de interface guiados pelo `SystemDesign.md`
4. **Frontend:** Páginas com `useQuery`/`useMutation`, estados de loading/vazio/erro, dark mode
5. **Testes:** `npm run build` (tsc + vite), validação visual light/dark
