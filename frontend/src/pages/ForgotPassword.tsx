import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setStep("code");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao enviar codigo de recuperacao.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", {
        email,
        code,
        password: newPassword,
        flow: "reset",
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? "Codigo invalido ou expirado.");
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
            {success ? "Senha alterada!" : "Recuperar Senha"}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {success
              ? "Sua senha foi redefinida com sucesso."
              : step === "email"
                ? "Digite seu e-mail para receber o codigo de recuperacao"
                : "Digite o codigo enviado e sua nova senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl h-11 w-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-primary-btn transition-all hover:bg-primary/90">
                Voltar para o Login
              </Link>
            </div>
          ) : step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  E-mail cadastrado
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 h-11 rounded-xl bg-background/50 border-border focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                {loading ? "Enviando..." : "Enviar Codigo"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Codigo de verificacao
                </Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="123456"
                  className="h-11 rounded-xl bg-background/50 border-border focus:ring-primary text-center text-lg tracking-[0.5em]"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="reset-password"
                    type="password"
                    placeholder="Minimo 8 caracteres"
                    className="pl-10 h-11 rounded-xl bg-background/50 border-border focus:ring-primary"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
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
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  handleSendCode({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="w-full text-xs text-primary hover:underline font-medium text-center block mt-2"
              >
                Reenviar codigo
              </button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="h-3 w-3" />
            Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
