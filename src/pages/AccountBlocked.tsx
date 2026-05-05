import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccountBlockedPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-destructive/5 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md shadow-modal border-none z-10 bg-card/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Conta Bloqueada
          </CardTitle>
          <CardDescription className="text-slate-500">
            Sua conta foi temporariamente bloqueada por excesso de tentativas de acesso.
            Aguarde o tempo de bloqueio ou entre em contato com o administrador do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
            <p className="text-sm text-slate-600 font-medium">
              O que voce pode fazer:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">1.</span>
                Aguardar o tempo de bloqueio expirar
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">2.</span>
                Usar a opcao de recuperacao por email
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">3.</span>
                Solicitar desbloqueio ao administrador
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link to="/forgot-password" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl h-11 w-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-primary-btn transition-all hover:bg-primary/90">
            Recuperar por Email
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="h-3 w-3" />
            Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
