import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Box, Factory, Settings, LogOut, ShieldCheck, Sun, Moon, Palette, Truck, Package, ShoppingCart } from 'lucide-react';
import { useConvexAuth } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import LoginPage from './pages/Login';
import ForgotPasswordPage from './pages/ForgotPassword';
import AccountBlockedPage from './pages/AccountBlocked';
import CompanySettingsPage from './pages/CompanySettings';
import UsersPage from './pages/Users';
import SetupAdminPage from './pages/SetupAdmin';
import SystemDesignPage from './pages/SystemDesign';
import SuppliersPage from './pages/Suppliers';
import ClientsPage from './pages/Clients';
import InsumosPage from './pages/Insumos';
import ProductsPage from './pages/Products';
import FormulasPage from './pages/FormulasPage';
import PurchasesPage from './pages/PurchasesPage';
import NewPurchasePage from './pages/NewPurchase';
import PurchaseDetailPage from './pages/PurchaseDetail';
import ReceivePurchasePage from './pages/ReceivePurchase';
import ReturnPurchasePage from './pages/ReturnPurchase';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-primary-btn animate-pulse">
            <span className="text-white font-bold text-xs">OC</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function FirstBootCheck({ children }: { children: React.ReactNode }) {
  const getMe = useQuery(api.users.getMe);
  const isEmpty = useQuery(api.users.isEmpty);
  const ensureProfile = useMutation(api.users.ensureMyProfile);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (getMe === null && isEmpty !== undefined && !isEmpty && !creating) {
      setCreating(true);
      ensureProfile({}).catch(() => {}).finally(() => setCreating(false));
    }
  }, [getMe, isEmpty, ensureProfile, creating]);

  if (getMe === undefined || isEmpty === undefined || creating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-primary-btn animate-pulse">
            <span className="text-white font-bold text-xs">OC</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Configurando acesso...</p>
        </div>
      </div>
    );
  }

  if (getMe === null && isEmpty) {
    return <SetupAdminPage />;
  }

  return <>{children}</>;
}

const roleLabels: Record<string, string> = {
  Admin: "Administrador",
  Producao: "Producao",
  Estoque: "Estoque",
  Vendas: "Vendas",
  Financeiro: "Financeiro",
  Visualizador: "Visualizador",
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuthActions();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => { setMounted(true) }, []);

  const company = useQuery(api.companies.get);
  const myProfile = useQuery(api.users.getMe);
  const logoUrl = company?.logoBase64 ?? null;
  const isAdmin = myProfile?.role === "Admin";
  const displayName = myProfile?.fullName ?? "Usuario";
  const displayRole = roleLabels[myProfile?.role as keyof typeof roleLabels] ?? "";
  const initials = displayName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => {
    signOut();
  };

  const isActive = (path: string) => location.pathname === path || (path === "/" && location.pathname === "/");

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 sm:flex">
        <div className="flex items-center gap-2 px-2 mb-8">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-primary-btn">
              <span className="text-white font-bold text-xs">OC</span>
            </div>
          )}
          <span className="text-lg font-bold tracking-tight text-foreground">{company && typeof company === 'object' ? (company.pjNomeFantasia ?? "Ohana Clean") : "Ohana Clean"}</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-primary text-white shadow-primary-btn"
                : "text-slate-500 hover:bg-accent hover:text-primary"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="pt-4 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3">Gestao</p>
          </div>

          {isAdmin && (
            <Link
              to="/usuarios"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive("/usuarios")
                  ? "bg-primary text-white shadow-primary-btn"
                  : "text-slate-500 hover:bg-accent hover:text-primary"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Usuarios
            </Link>
          )}

          {(isAdmin || myProfile?.role === "Estoque") && (
            <Link
              to="/fornecedores"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive("/fornecedores")
                  ? "bg-primary text-white shadow-primary-btn"
                  : "text-slate-500 hover:bg-accent hover:text-primary"
              }`}
            >
              <Truck className="h-4 w-4" />
              Fornecedores
            </Link>
          )}

          <Link
            to="/clientes"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/clientes")
                ? "bg-primary text-white shadow-primary-btn"
                : "text-slate-500 hover:bg-accent hover:text-primary"
            }`}
          >
            <Users className="h-4 w-4" />
            Clientes
          </Link>
          <Link
            to="/insumos"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/insumos")
                ? "bg-primary text-white shadow-primary-btn"
                : "text-slate-500 hover:bg-accent hover:text-primary"
            }`}
          >
            <Box className="h-4 w-4" />
            Insumos
          </Link>
          <Link
            to="/produtos"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/produtos")
                ? "bg-primary text-white shadow-primary-btn"
                : "text-slate-500 hover:bg-accent hover:text-primary"
            }`}
          >
            <Package className="h-4 w-4" />
            Produtos
          </Link>
          <Link
            to="/formulas"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/formulas")
                ? "bg-primary text-white shadow-primary-btn"
                : "text-slate-500 hover:bg-accent hover:text-primary"
            }`}
          >
            <Factory className="h-4 w-4" />
            Formulas
          </Link>
          <Link
            to="/compras"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/compras")
                ? "bg-primary text-white shadow-primary-btn"
                : "text-slate-500 hover:bg-accent hover:text-primary"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Compras
          </Link>
          {isAdmin && (
            <Link
              to="/design-system"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive("/design-system")
                  ? "bg-primary text-white shadow-primary-btn"
                  : "text-slate-500 hover:bg-accent hover:text-primary"
              }`}
            >
              <Palette className="h-4 w-4" />
              Design System
            </Link>
          )}
        </nav>

        <div className="mt-auto space-y-1">
          {isAdmin && (
            <Link
              to="/settings"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive("/settings")
                  ? "bg-primary text-white shadow-primary-btn"
                  : "text-slate-500 hover:bg-accent hover:text-primary"
              }`}
            >
              <Settings className="h-4 w-4" />
              Configuracoes
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-6 sticky top-0 z-10">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            {isActive("/") && "Dashboard"}
            {isActive("/usuarios") && "Gestao de Usuarios"}
            {isActive("/fornecedores") && "Fornecedores"}
            {isActive("/clientes") && "Gestao de Clientes"}
            {isActive("/insumos") && "Controle de Insumos"}
            {isActive("/produtos") && "Produtos"}
            {isActive("/formulas") && "Formulas de Producao"}
            {isActive("/compras") && !location.pathname.includes("/compras/") && "Compras de Insumos"}
            {location.pathname === "/compras/nova" && "Nova Compra"}
            {location.pathname.startsWith("/compras/") && location.pathname.endsWith("/receber") && "Recebimento"}
            {location.pathname.startsWith("/compras/") && location.pathname.endsWith("/devolver") && "Devolucao"}
            {location.pathname.match(/^\/compras\/[^/]+$/) && "Detalhes da Compra"}
            {isActive("/design-system") && "Design System"}
            {isActive("/settings") && "Configuracoes"}
          </h1>
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-accent transition-all"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-foreground leading-none">{displayName}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{displayRole}</span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
              {initials}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto bg-muted/30">
          {children}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="grid gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Indicadores Gerais</h2>
        <span className="text-xs text-slate-400 font-medium">Atualizado em tempo real</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Box className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">+12%</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-500">Total de Insumos</h3>
          <p className="mt-1 text-3xl font-bold text-foreground">124</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Factory className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Ativo</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-500">Formulas Ativas</h3>
          <p className="mt-1 text-3xl font-bold text-foreground">45</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Meta 80%</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-500">Producao do Mes</h3>
          <p className="mt-1 text-3xl font-bold text-foreground">1.2k <span className="text-sm font-medium text-slate-400">L</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border h-64 flex items-center justify-center text-slate-300 italic">
          Grafico de Producao (Em breve)
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border h-64 flex items-center justify-center text-slate-300 italic">
          Atividades Recentes (Em breve)
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/account-blocked" element={<AccountBlockedPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <FirstBootCheck>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/usuarios" element={<UsersPage />} />
                  <Route path="/fornecedores" element={<SuppliersPage />} />
                  <Route path="/clientes" element={<ClientsPage />} />
                  <Route path="/insumos" element={<InsumosPage />} />
                  <Route path="/produtos" element={<ProductsPage />} />
                  <Route path="/formulas" element={<FormulasPage />} />
                  <Route path="/compras" element={<PurchasesPage />} />
                  <Route path="/compras/nova" element={<NewPurchasePage />} />
                  <Route path="/compras/:id" element={<PurchaseDetailPage />} />
                  <Route path="/compras/:id/receber" element={<ReceivePurchasePage />} />
                  <Route path="/compras/:id/devolver" element={<ReturnPurchasePage />} />
                  <Route path="/settings" element={<CompanySettingsPage />} />
                  <Route path="/design-system" element={<SystemDesignPage />} />
                  <Route path="*" element={<div className="text-slate-400 text-sm italic p-12 text-center bg-card rounded-2xl border border-dashed border-border">Modulo em desenvolvimento...</div>} />
                </Routes>
              </AppLayout>
            </FirstBootCheck>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
