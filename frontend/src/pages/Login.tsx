import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", {
        email,
        password,
        flow,
      });
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("Invalid credentials") || msg.includes("InvalidAccountId") || msg.includes("InvalidSecret")) {
        setError("Email ou senha incorretos.");
      } else if (msg.includes("Account exists") || msg.includes("account already exists")) {
        setError("Este email ja possui cadastro. Faca login.");
      } else if (msg.includes("Too many requests") || msg.includes("TooManyFailedAttempts")) {
        setError("Muitas tentativas. Aguarde alguns minutos.");
      } else if (msg.includes("A senha deve ter")) {
        setError(msg);
      } else {
        setError("Erro ao autenticar. Verifique seus dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md shadow-modal border-none z-10 bg-card/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-primary-btn">
              <span className="text-white text-xl font-bold">OC</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            {flow === "signIn" ? "Bem-vindo de volta" : "Criar Conta"}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {flow === "signIn"
              ? "Entre com suas credenciais para acessar o sistema"
              : "Preencha os dados para criar seu acesso"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 h-11 rounded-xl bg-background/50 border-border focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Senha {flow === "signUp" && <span className="text-slate-400 font-normal normal-case">(min. 6 caracteres)</span>}
                </Label>
                {flow === "signIn" && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 rounded-xl bg-background/50 border-border focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-lg p-3 font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-primary-btn transition-all"
            >
              {loading ? "Carregando..." : flow === "signIn" ? "Acessar Sistema" : "Criar Conta"}
            </Button>
          </form>
        </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-xs text-slate-400 hover:text-primary font-medium transition-colors"
            >
              {showCredentials ? "Ocultar" : "Mostrar"} credenciais de teste
            </button>
            {showCredentials && (
              <div className="text-xs text-slate-500 bg-muted/50 rounded-xl p-3 space-y-1 w-full">
                <p className="font-bold text-primary">Conta Admin (pronta para uso):</p>
                <p>Email: <button type="button" className="text-primary font-mono hover:underline" onClick={() => { setEmail("admin@ohanaclean.com"); setPassword("admin123"); }}>admin@ohanaclean.com / admin123</button></p>
              </div>
            )}
            <button
            type="button"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError("");
            }}
            className="text-xs text-primary hover:underline font-medium"
          >
            {flow === "signIn" ? "Nao tem conta? Criar uma" : "Ja tem conta? Entrar"}
          </button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-slate-400 font-medium">
                Ohana Clean v1.0
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
