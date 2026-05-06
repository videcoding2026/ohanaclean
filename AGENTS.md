<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

# Ohana Clean - ERP

Stack: React 19, Vite 8, Convex (backend), Tailwind CSS 3, shadcn/ui (base-nova), React Router 7, Zod 4

Status: Desenvolvimento

Repo: https://github.com/videcoding2026/ohanaclean

---

## Comandos

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Iniciar Vite (frontend) |
| `npx convex dev` | Iniciar backend Convex |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | `eslint .` |
| `npm run convex:push` | `npx convex dev --once --typecheck=disable` |
| `npm run convex:env` | node scripts/setup-convex-env.cjs |

Rodar `npx convex dev` + `npm run dev` em terminais SEPARADOS.

---

## TypeScript 6.0 Quirks

- `verbatimModuleSyntax: true` -- type-only imports **must** use `import type` or `import { type ... }`.
- `erasableSyntaxOnly: true` -- no enums, no namespaces, no `constructor parameter properties`.
- `"ignoreDeprecations": "6.0"` suppresses TS 6.0 deprecation warnings.

---

## Provider Hierarchy (src/main.tsx)

```
import "./polyfills"   (localStorage fallback)
ConvexProvider
  ConvexAuthProvider   (@convex-dev/auth/react)
    ThemeProvider       (next-themes, attribute: class, defaultTheme: light, enableSystem: false)
      BrowserRouter
        Sonner Toaster
        App (Routes)
```

---

## Rotas

| Path | Pagina | Acesso |
|------|--------|--------|
| /login | LoginPage | Publico |
| /forgot-password | ForgotPasswordPage | Publico |
| /account-blocked | AccountBlockedPage | Publico |
| / | Dashboard | Autenticado |
| /usuarios | UsersPage | Admin |
| /fornecedores | SuppliersPage | Admin/Estoque |
| /clientes | ClientsPage | Autenticado |
| /insumos | InsumosPage | Autenticado |
| /produtos | ProductsPage | Autenticado |
| /formulas | FormulasPage | Autenticado |
| /compras | PurchasesPage | Autenticado |
| /compras/nova | NewPurchasePage | Autenticado |
| /compras/:id | PurchaseDetailPage | Autenticado |
| /compras/:id/receber | ReceivePurchasePage | Autenticado |
| /compras/:id/devolver | ReturnPurchasePage | Autenticado |
| /estoque | StockPage | Autenticado |
| /producao | ProductionPage | Autenticado |
| /producao/nova | NewProductionPage | Autenticado |
| /producao/:id | ProductionDetailPage | Autenticado |
| /precos | PriceTablePage | Autenticado |
| /precos/nova | PriceTableDetailPage | Autenticado |
| /precos/:id | PriceTableDetailPage | Autenticado |
| /pedidos | OrdersPage | Autenticado |
| /pedidos/nova | NewOrderPage | Autenticado |
| /pedidos/:id | OrderDetailPage | Autenticado |
| /settings | CompanySettingsPage | Admin |
| /design-system | SystemDesignPage | Admin |

Protecao: ProtectedRoute (redireciona para /login se nao autenticado).

Redirect: FirstBootCheck redireciona para SetupAdminPage se `users.isEmpty` for `true`.

---

## Fluxo de Autenticacao

Auth provider: `@convex-dev/auth` (Password). **Password reset NAO implementado.**

```typescript
// Login
signIn("password", { email, password, flow: "signIn" })
// Logout
signOut()
// Hooks
const { isAuthenticated, isLoading } = useConvexAuth()
const { signIn, signOut } = useAuthActions()
```

Server-side auth: use `getAuthUserId(ctx)` from `@convex-dev/auth/server` -- not `ctx.auth.getUserIdentity()`.

Auth config in `convex/auth.config.ts`:
```
providers: [{ domain: process.env.CONVEX_SITE_URL || VITE_CONVEX_SITE_URL || fallback, applicationID: "convex" }]
```

---

## Roles

Admin, Producao, Estoque, Vendas, Financeiro, Visualizador.

Bloqueio de conta: 3 falhas = 5min, 6 falhas = 30min, 9 falhas = 30 dias.

---

## Convex Schema (convex/schema.ts)

`schemaValidation: true` -- strict validation at runtime.

Tables: companies, userProfiles, auditLogs, suppliers, clients, insumos, insumoVariants, products, productPackagings, formulas, formulaIngredients, purchases, purchaseItems, purchaseHistories, purchaseReturns, contasPagar, stockMovements, inventarios, inventarioItems, productionOrders, productionItems, productionLogs, priceTables, priceTableItems, priceTableClients, priceHistories, orders, orderItems, orderStatusHistory, contasReceber.

Files in `convex/`: schema.ts, auth.ts, auth.config.ts, http.ts, users.ts, companies.ts, storage.ts, audit.ts, bootstrap.ts, seed.ts, clients.ts, suppliers.ts, insumos.ts, products.ts, formulas.ts, purchases.ts, stock.ts, contasPagar.ts, production.ts, pricetables.ts, orders.ts.

---

## Regras Criticas

- `useQuery` retorna `undefined` (loading) ou `null` (nao encontrado). SEMPRE tratar os dois.
- Toda mutation que modifica dados DEVE auditar via `auditLogs`.
- Autorizacao: derive user identity server-side. Never trust client-supplied userId.
- `process.env` nao existe no runtime Convex; use apenas em auth.config.ts (avaliado em build).
- `logoBase64` no campo `companies.logoBase64` (base64 data URI) -- usado direto no `<img src>` em App.tsx, nao via endpoint HTTP.
- `ctx.db.system.get("_storage", id)` para metadata de arquivos (nao `ctx.storage.getMetadata`).
- `@/` resolve para `src/` (configurado em vite.config.ts e tsconfig).

---

## UI Stack

- shadcn/ui style: `base-nova`, icons: lucide-react
- Tailwind CSS 3 com `cssVariables: true`, baseColor: neutral
- Theme via next-themes: `attribute: "class"`, `defaultTheme: "light"`, `enableSystem: false`
- Toasts: sonner (Toaster em main.tsx)
- Tabelas: @tanstack/react-table (componente data-table.tsx)
- Drag-and-drop: @dnd-kit
- Charts: recharts
- Forms: react-hook-form + @hookform/resolvers (zod)

---

## Variaveis de Ambiente (.env.local)

```
VITE_CONVEX_URL=https://steady-owl-944.convex.cloud
CONVEX_DEPLOYMENT=dev:steady-owl-944
VITE_CONVEX_SITE_URL=https://steady-owl-944.convex.site
```

---

## OpenCode Config (opencode.json)

Permissions: edit=ask, bash=ask. MCPs: context7, shadcn, convex, github.
