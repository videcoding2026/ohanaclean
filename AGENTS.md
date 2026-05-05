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

Stack: React 19, Vite 8, Convex (backend), Tailwind CSS, shadcn/ui, React Router, Zod

Status: Desenvolvimento

Repo: https://github.com/videcoding2026/ohanaclean

---

## Convex

- Deployment dev: steady-owl-944 (equipe: vide-coding, projeto: ohanacleandb)
- Auth: Password provider (RESET DE SENHA NAO IMPLEMENTADO - em desenvolvimento)
- Schema: companies, userProfiles, auditLogs + authTables
- Storage: configurado para upload de logo
- HTTP endpoints: /logo (serve imagem da empresa)
- Polyfills configurados em src/polyfills.ts (process.env)

---

## Provider Hierarchy (main.tsx)

```
ConvexProvider
  ConvexAuthProvider
    ThemeProvider (next-themes, attribute: class, defaultTheme: light)
      BrowserRouter
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
| /settings | CompanySettingsPage | Admin |
| /design-system | SystemDesignPage | Admin |

Protecao: ProtectedRoute (redireciona para /login se nao autenticado)
Redirect: FirstBootCheck (redireciona para SetupAdminPage se sistema vazio)

---

## Fluxo de Autenticacao

### Login
```typescript
signIn("password", { email, password, flow: "signIn" })
```

### Logout
```typescript
signOut()
```

### Hooks
```typescript
const { isAuthenticated, isLoading } = useConvexAuth()    // estado auth
const { signIn, signOut } = useAuthActions()               // acoes auth
```

### Password Reset (NAO IMPLEMENTADO)
```typescript
signIn("password", { email, flow: "reset" })          // enviar codigo
signIn("password", { email, code, password, flow: "reset" }) // redefinir
```
⚠ Reset requer configuracao adicional no provider Password

---

## Roles e Permissoes

| Role | Label | Acesso |
|------|-------|--------|
| Admin | Administrador | Tudo |
| Producao | Producao | Modulos producao |
| Estoque | Estoque | Insumos, fornecedores |
| Vendas | Vendas | Clientes, vendas |
| Financeiro | Financeiro | Financeiro |
| Visualizador | Visualizador | Visualizacao apenas |

---

## Seguranca (Bloqueio de Conta)

Apos falhas de login consecutivas:
- 3 falhas: bloqueio de 5 minutos
- 6 falhas: bloqueio de 30 minutos
- 9 falhas: bloqueio de 30 dias

Funcoes:
- recordFailedLogin (internalMutation) - incrementa contador e bloqueia
- resetLoginAttempts (mutation) - usuario logado reseta suas tentativas
- checkBlocked (query) - verifica se usuario esta bloqueado

---

## Convex API - Queries e Mutations

### companies.ts
| Funcao | Tipo | Descricao |
|--------|------|-----------|
| get | query | Retorna dados da empresa (auth required) |
| getInternal | internalQuery | Retorna empresa sem auth (usado no http.ts) |
| save | mutation | Salva/cria dados da empresa |
| saveParams | mutation | Salva parametros (metodo custo, estoque, etc) |
| saveDocuments | mutation | Salva documentos (prefixos, templates) |
| saveAlerts | mutation | Salva configs de alertas |
| saveScore | mutation | Salva configs de score de clientes |
| saveLogo | mutation | Salva logoStorageId |

### users.ts
| Funcao | Tipo | Descricao |
|--------|------|-----------|
| getMe | query | Retorna perfil do usuario logado |
| list | query | Lista todos usuarios (Admin) |
| isEmpty | query | Verifica se existe algum perfil |
| createProfile | mutation | Cria perfil de usuario (Admin) |
| updateProfile | mutation | Atualiza perfil (Admin) |
| createFirstProfile | mutation | Cria primeiro perfil (setup) |
| ensureMyProfile | mutation | Cria perfil automaticamente se nao existir |
| checkBlocked | query | Verifica se conta esta bloqueada |
| recordFailedLogin | internalMutation | Registra tentativa falha e bloqueia |
| resetLoginAttempts | mutation | Reseta contagem de falhas |
| initAdminMutation | internalMutation | Cria admin inicial no bootstrap |

### storage.ts
| Funcao | Tipo | Descricao |
|--------|------|-----------|
| generateUploadUrl | mutation | Gera URL de upload (Admin) |
| getLogoUrl | query | Retorna URL publica do logo |

### audit.ts
| Funcao | Tipo | Descricao |
|--------|------|-----------|
| list | query | Lista logs de auditoria |
| listByUser | query | Logs por usuario |
| listByModule | query | Logs por modulo |

---

## Estrutura de Diretorios

```
frontend/
├── convex/
│   ├── schema.ts          # Schema do banco
│   ├── auth.ts            # Autenticacao (Password provider)
│   ├── auth.config.ts     # Config dominio auth
│   ├── http.ts            # Endpoints HTTP (/logo)
│   ├── users.ts           # Queries/mutations usuarios
│   ├── companies.ts       # CRUD empresa + logo
│   ├── storage.ts         # Upload de arquivos
│   ├── bootstrap.ts       # Inicializacao admin
│   └── audit.ts           # Auditoria
├── src/
│   ├── pages/             # Login, CompanySettings, Users, etc
│   ├── components/        # Sidebar, nav, login-form, etc
│   ├── components/ui/     # Shadcn components
│   ├── lib/               # Utilitarios
│   └── hooks/             # Custom hooks
└── opencode.json          # Config MCPs e permissoes (edit:ask)
```

---

## Comandos Essenciais

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Iniciar Vite (frontend) |
| `npx convex dev` | Iniciar backend Convex |
| `npx convex deploy` | Deploy para producao |
| `npx convex dashboard` | Abrir dashboard no navegador |
| `npx convex logout` | Logout da conta Convex |
| `npx convex login` | Login na conta Convex |

---

## MCPs (OpenCode)

| MCP | Uso |
|-----|-----|
| convex | Queries/mutations no banco, schema, logs |
| github | PRs, issues, branches, commits |
| shadcn | Instalar componentes UI |
| context7 | Documentacao de bibliotecas |

---

## Regras de Implementacao

- Toda mutation que modifica dados DEVE usar `requireAdmin(ctx)` (se aplicavel)
- Toda operacao critica DEVE gerar registro em `auditLogs`
- Companies: type, telefone e email sao campos OBRIGATORIOS no schema
- Logo requer empresa existente (upsertCompany cria com defaults)
- useQuery retorna undefined (loading) ou null (nao encontrado) - SEMPRE tratar
- Nao usar `process.env` em codigo Convex (nao esta disponivel)
- useMutation com catch para evitar uncaught promise rejections

---

## Dicas de Desenvolvimento

1. Rodar `npx convex dev` + `npm run dev` em terminais SEPARADOS
2. Depois de alterar schema, o convex dev atualiza automaticamente
3. Usar `npx convex dashboard` para visualizar dados no navegador
4. Para testar auth, criar usuario via pagina de SetupAdmin
5. `logoBase64` usado no App.tsx para exibir logo (nao `/logo` HTTP)
6. Arquivos `.mak` na raiz sao modulos de documentacao (nao codigo)

---

## Estado Atual do Desenvolvimento

- [OK] Login com email/senha
- [OK] Cadastro de empresa (dados, docs, parametros, score)
- [OK] Gestao de usuarios (CRUD, permissoes, bloqueio)
- [OK] Upload de logo via Convex storage + upsertCompany
- [OK] Auditoria de operacoes
- [OK] Fornecedores, Clientes, Insumos, Produtos, Formulas (paginas criadas)
- [FALTA] Password reset (desabilitado ate configurar servico de email)
- [FALTA] Logo no sidebar (testar com empresa existente)

---

## Variaveis de Ambiente

```
VITE_CONVEX_URL=http://localhost:5173/api/convex
CONVEX_DEPLOYMENT=dev:steady-owl-944
VITE_CONVEX_SITE_URL=http://localhost:5173/api/convex-site
GITHUB_TOKEN=(setado localmente via env var para MCP)
```
