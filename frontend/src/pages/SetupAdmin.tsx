import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, User, Phone } from "lucide-react"

export default function SetupAdminPage() {
  const createFirstProfile = useMutation(api.users.createFirstProfile)
  const isEmpty = useQuery(api.users.isEmpty)
  const getMe = useQuery(api.users.getMe)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isEmpty === undefined || getMe === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-primary-btn animate-pulse">
            <span className="text-white font-bold text-xs">OC</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">Verificando sistema...</p>
        </div>
      </div>
    )
  }

  if (getMe !== null) return null
  if (!isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-modal border-none bg-card/80 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-destructive">Acesso Restrito</CardTitle>
            <CardDescription>
              O sistema ja esta configurado. Solicite ao administrador que libere seu acesso.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await createFirstProfile({
        fullName,
        phone: phone || undefined,
      })
    } catch (err: any) {
      setError(err?.message ?? "Erro ao criar perfil")
    } finally {
      setLoading(false)
    }
  }

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
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Configuracao Inicial
          </CardTitle>
          <CardDescription className="text-slate-500">
            Primeiro acesso detectado. Crie sua conta de administrador para liberar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 h-11 rounded-xl bg-background/50 border-border focus:ring-primary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  minLength={3}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Telefone (opcional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="pl-10 h-11 rounded-xl bg-background/50 border-border focus:ring-primary"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              {loading ? "Configurando..." : "Criar Conta Administrador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
