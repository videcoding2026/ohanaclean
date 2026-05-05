import { useState, useRef } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Phone, Globe, Hash, Upload, Trophy, Plus, FileText, Settings2, Bell, FileDown, BarChart3 } from "lucide-react"

const sections = [
  { id: "dados", icon: Building2, label: "Dados da Empresa" },
  { id: "documentos", icon: FileText, label: "Documentos" },
  { id: "parametros", icon: Settings2, label: "Parametros" },
  { id: "alertas", icon: Bell, label: "Alertas" },
  { id: "importacao", icon: FileDown, label: "Importacao" },
  { id: "score", icon: BarChart3, label: "Score de Clientes" },
]

export default function CompanySettingsPage() {
  const [activeSection, setActiveSection] = useState("dados")
  const [loading, setLoading] = useState(false)
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [logoBase64, setLogoBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const company = useQuery(api.companies.get)
  const saveCompany = useMutation(api.companies.save)
  const saveLogo = useMutation(api.companies.saveLogo)

  const existingLogo = company?.logoBase64 ?? null

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("Arquivo muito grande. Maximo 2MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string
      setLogoSrc(b64)
      setLogoBase64(b64)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveLogo = async () => {
    if (!logoBase64) return
    setLoading(true)
    try {
      await saveLogo({ logoBase64 })
      setLogoBase64(null)
      setLogoSrc(null)
    } catch (err: any) {
      alert("Erro ao salvar logo: " + (err?.message ?? "tente novamente"))
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDados = async () => {
    setLoading(true)
    try {
      const form = document.getElementById("dados-form") as HTMLFormElement | null
      if (!form) return
      const fd = new FormData(form)
      await saveCompany({
        type: (fd.get("type") as "PF" | "PJ") || "PJ",
        pjRazaoSocial: (fd.get("pjRazaoSocial") as string) || undefined,
        pjNomeFantasia: (fd.get("pjNomeFantasia") as string) || undefined,
        pjCnpj: (fd.get("pjCnpj") as string) || undefined,
        pjInscricaoEstadual: (fd.get("pjInscricaoEstadual") as string) || undefined,
        telefone: (fd.get("telefone") as string) || "",
        email: (fd.get("email") as string) || "",
        whatsapp: (fd.get("whatsapp") as string) || undefined,
        site: (fd.get("site") as string) || undefined,
        facebook: (fd.get("facebook") as string) || undefined,
        instagram: (fd.get("instagram") as string) || undefined,
        logradouro: (fd.get("logradouro") as string) || undefined,
        numero: (fd.get("numero") as string) || undefined,
        cep: (fd.get("cep") as string) || undefined,
        bairro: (fd.get("bairro") as string) || undefined,
        cidade: (fd.get("cidade") as string) || undefined,
        estado: (fd.get("estado") as string) || undefined,
        complemento: (fd.get("complemento") as string) || undefined,
        pais: (fd.get("pais") as string) || undefined,
      })
    } catch (err: any) {
      alert("Erro ao salvar: " + (err?.message ?? ""))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 600)
  }

  return (
    <div className="flex gap-8 -mt-3">
      <nav className="hidden lg:flex flex-col w-52 shrink-0 space-y-1 fixed top-[5rem] left-[17.5rem] bottom-6 overflow-y-auto pb-6 pr-2" style={{ scrollbarWidth: "thin" }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-3">Configuracoes</p>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(s.id)
              document.getElementById(`cfg-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all ${
              activeSection === s.id
                ? "bg-primary text-white shadow-primary-btn"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <s.icon className="h-4 w-4 shrink-0" />
            {s.label}
          </button>
        ))}
        <div className="pt-4">
          <Button onClick={handleSave} disabled={loading} className="w-full rounded-xl shadow-primary-btn h-11 text-sm">
            {loading ? "Salvando..." : "Salvar Tudo"}
          </Button>
        </div>
      </nav>

      <div className="flex-1 min-w-0 space-y-16 pb-32 lg:ml-60">
        <header className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary">Configuracoes</h2>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Empresa</h1>
          <p className="text-sm text-muted-foreground max-w-lg">Dados cadastrais, documentos, parametros e preferencias do sistema.</p>
        </header>

        <section id="cfg-dados" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Dados da Empresa</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Informacoes cadastrais, endereco e identidade visual que aparecem em documentos oficiais.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-card p-6 space-y-6">
              <form id="dados-form" onSubmit={(e) => { e.preventDefault(); handleSaveDados(); }}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Dados Cadastrais</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Razao Social</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input name="pjRazaoSocial" placeholder="Ohana Clean Industria e Comercio LTDA" className="pl-10 h-11 rounded-xl" defaultValue={company?.pjRazaoSocial ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CNPJ</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input name="pjCnpj" placeholder="00.000.000/0000-00" className="pl-10 h-11 rounded-xl" defaultValue={company?.pjCnpj ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome Fantasia</Label>
                    <Input name="pjNomeFantasia" placeholder="Nome comercial" className="h-11 rounded-xl" defaultValue={company?.pjNomeFantasia ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inscricao Estadual</Label>
                    <Input name="pjInscricaoEstadual" placeholder="IE" className="h-11 rounded-xl" defaultValue={company?.pjInscricaoEstadual ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail</Label>
                    <Input name="email" placeholder="contato@ohanaclean.com.br" className="h-11 rounded-xl" defaultValue={company?.email ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input name="telefone" placeholder="(00) 0000-0000" className="pl-10 h-11 rounded-xl" defaultValue={company?.telefone ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp</Label>
                    <Input name="whatsapp" placeholder="(00) 00000-0000" className="h-11 rounded-xl" defaultValue={company?.whatsapp ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input name="site" placeholder="www.seusite.com.br" className="pl-10 h-11 rounded-xl" defaultValue={company?.site ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Facebook</Label>
                    <Input name="facebook" placeholder="URL da pagina" className="h-11 rounded-xl" defaultValue={company?.facebook ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instagram</Label>
                    <Input name="instagram" placeholder="@ do perfil" className="h-11 rounded-xl" defaultValue={company?.instagram ?? ""} />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Endereco</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logradouro</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input name="logradouro" placeholder="Rua, Avenida, etc" className="pl-10 h-11 rounded-xl" defaultValue={company?.logradouro ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Numero</Label>
                    <Input name="numero" placeholder="123" className="h-11 rounded-xl" defaultValue={company?.numero ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CEP</Label>
                    <Input name="cep" placeholder="00000-000" className="h-11 rounded-xl" defaultValue={company?.cep ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bairro</Label>
                    <Input name="bairro" placeholder="Bairro" className="h-11 rounded-xl" defaultValue={company?.bairro ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cidade / UF</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input name="cidade" placeholder="Cidade" className="col-span-2 h-11 rounded-xl" defaultValue={company?.cidade ?? ""} />
                      <Input name="estado" placeholder="SP" className="h-11 rounded-xl text-center" defaultValue={company?.estado ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Complemento</Label>
                    <Input name="complemento" placeholder="Complemento" className="h-11 rounded-xl" defaultValue={company?.complemento ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pais</Label>
                    <Input name="pais" placeholder="Brasil" className="h-11 rounded-xl" defaultValue={company?.pais ?? ""} />
                  </div>
                </div>
              </div>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-card p-6 flex flex-col items-center gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary self-start">Logo</p>
              <div
                className="w-full border-2 border-dashed border-border rounded-2xl p-8 bg-muted/30 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer"
                onClick={handleLogoClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLogoClick() }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                {logoSrc ? (
                  <img src={logoSrc} alt="Logo preview" className="h-20 w-20 rounded-2xl object-contain border border-border" />
                ) : existingLogo ? (
                  <img src={existingLogo} alt="Logo" className="h-20 w-20 rounded-2xl object-contain border border-border" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-primary-btn">
                    <span className="text-white text-3xl font-bold">OC</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs font-semibold text-primary mb-0.5">
                    {logoSrc ? "Clique para trocar" : "Alterar Logotipo"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">PNG ou JPG — ate 2MB</p>
                </div>
              </div>
              <Button onClick={logoBase64 ? handleSaveLogo : handleSaveDados} disabled={loading} className="w-full rounded-xl shadow-primary-btn h-11 mt-auto">
                {loading ? "Salvando..." : logoBase64 ? "Salvar Logo" : "Salvar Dados"}
              </Button>
            </div>
          </div>
        </section>

        <section id="cfg-documentos" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Documentos</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Numeracao de pedidos, vendas, OP e formatos de cabecalho/rodape para PDFs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Numeracao de Documentos</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Pedidos", "PED-26-0001"],
                  ["Vendas", "VEN-26-0001"],
                  ["Producao", "OPD-26-0001"],
                  ["Compras", "CMP-26-0001"],
                  ["Recibo", "REC-26-0001"],
                  ["Orcamento", "ORC-26-0001"],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</Label>
                    <Input className="h-11 rounded-xl font-mono text-xs" defaultValue={value} />
                  </div>
                ))}
              </div>
              <Badge className="bg-muted text-muted-foreground text-[10px]">Numeracao reinicia por ano | Cancelado nao reutiliza</Badge>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Cabecalho e Rodape de PDFs</p>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modelo de Cabecalho</Label>
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">[Logo] + [Nome] + [CPF/CNPJ]</p>
                  <p className="font-mono text-xs text-muted-foreground">[Endereco] + [Telefone] + [Email]</p>
                  <p className="font-mono text-xs text-muted-foreground">[Facebook] [Instagram] [Site]</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Texto de Rodape</Label>
                <Input placeholder="Documento gerado pelo sistema Ohana Clean..." className="h-11 rounded-xl" />
              </div>
              <Button onClick={handleSave} disabled={loading} className="rounded-xl shadow-primary-btn h-11">
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </section>

        <section id="cfg-parametros" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Settings2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Parametros</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Regras de estoque, vendas e preferencias financeiras que afetam o fluxo do sistema.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Estoque</p>
                <Badge className="bg-primary/10 text-primary border-transparent text-[10px] font-bold">ESTOQUE</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metodo de Custo</Label>
                <Input className="h-11 rounded-xl" defaultValue="Preco Medio Ponderado (PMP)" disabled />
              </div>
              <div className="space-y-3 text-sm">
                <Label className="flex items-center gap-2.5 text-foreground cursor-pointer">
                  <input type="checkbox" className="rounded accent-primary h-4 w-4" />
                  Permitir estoque negativo — insumos
                </Label>
                <Label className="flex items-center gap-2.5 text-foreground cursor-pointer">
                  <input type="checkbox" className="rounded accent-primary h-4 w-4" />
                  Permitir estoque negativo — produto final
                </Label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Vendas</p>
                <Badge className="bg-success/10 text-success border-transparent text-[10px] font-bold">VENDAS</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <Label className="flex items-center gap-2.5 text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-primary h-4 w-4" />
                  Permitir venda sem estoque
                </Label>
                <Label className="flex items-center gap-2.5 text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-primary h-4 w-4" />
                  Notificar producao ao vender sem estoque
                </Label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Financeiro</p>
                <Badge className="bg-warning/10 text-warning border-transparent text-[10px] font-bold">FINANCEIRO</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Moeda</Label>
                <Input className="h-11 rounded-xl" defaultValue="R$ (Real Brasileiro)" disabled />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Decimais — Valores</Label>
                  <Input className="h-11 rounded-xl text-center" type="number" defaultValue="2" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Decimais — Qtd</Label>
                  <Input className="h-11 rounded-xl text-center" type="number" defaultValue="3" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end lg:hidden">
            <Button onClick={handleSave} disabled={loading} className="rounded-xl shadow-primary-btn h-11">
              {loading ? "Salvando..." : "Salvar Parametros"}
            </Button>
          </div>
        </section>

        <section id="cfg-alertas" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Alertas</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Configure notificacoes automaticas sobre estoque, vencimentos, contas e producao.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-3">
            {[
              { title: "Estoque Baixo", desc: "Insumo ou produto abaixo do estoque minimo configurado", color: "var(--destructive)" },
              { title: "Vencimento de Produtos", desc: "Alertas em 60, 30, 15 e 7 dias antes do vencimento", color: "var(--warning)" },
              { title: "Contas a Receber Vencidas", desc: "Parcelas de clientes com data de pagamento ultrapassada", color: "var(--destructive)" },
              { title: "Contas a Pagar Vencendo", desc: "Notificar com 3 dias de antecedencia do vencimento", color: "var(--warning)" },
              { title: "Producao Planejada", desc: "Ordens de producao agendadas para o dia atual", color: "var(--primary)" },
            ].map((alert) => (
              <div key={alert.title} className="flex items-center justify-between rounded-xl bg-muted/20 border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: `hsl(${alert.color})` }} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-muted-foreground/20 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section id="cfg-importacao" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <FileDown className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Importacao de Dados</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Importe dados em lote a partir de planilhas Excel ou arquivos CSV.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {["Clientes", "Produtos", "Insumos", "Fornecedores"].map((type) => (
                <div key={type} className="rounded-2xl border-2 border-dashed border-border p-5 text-center hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                  <Upload className="h-8 w-8 text-muted-foreground mb-3 mx-auto group-hover:text-primary transition-colors" />
                  <p className="text-sm font-semibold text-foreground">{type}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">.xlsx / .csv</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-muted/20 border border-border p-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileDown className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Fluxo:</span> Baixar modelo → Preencher dados → Upload do arquivo → Validacao → Confirmar
              </div>
            </div>
          </div>
        </section>

        <section id="cfg-score" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Score de Clientes</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Criterios de pontuacao com pesos que devem somar 100% e niveis de fidelidade com beneficios.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-warning" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Criterios de Pontuacao</p>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">A soma dos pesos deve totalizar 100%.</p>
              {[
                { name: "Volume de Compras", weight: 40, varName: "--primary" },
                { name: "Frequencia de Compra", weight: 35, varName: "--secondary" },
                { name: "Pontualidade de Pagamento", weight: 25, varName: "--success" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl bg-muted/20 border border-border p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: `hsl(var(${item.varName}))` }} />
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Input className="w-16 h-9 rounded-lg text-center text-xs" type="number" defaultValue={item.weight} />
                    <span className="text-xs text-muted-foreground font-medium">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-warning" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Niveis de Fidelidade</p>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">Faixas de pontuacao com beneficios atrelados ao nivel do cliente.</p>
              {[
                { name: "Ouro", range: "80 — 100 pts", varName: "--warning", benefit: "Desconto extra de 10% em pedidos" },
                { name: "Prata", range: "50 — 79 pts", varName: "--muted-foreground", benefit: "Condicao especial de pagamento" },
                { name: "Bronze", range: "0 — 49 pts", varName: "--muted-foreground", benefit: "Sem beneficio adicional" },
              ].map((level) => (
                <div key={level.name} className="flex items-center gap-3 rounded-xl bg-muted/20 border border-border p-3">
                  <Trophy className="h-5 w-5 shrink-0" style={{ color: `hsl(var(${level.varName}))` }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{level.name}</span>
                      <Badge className="text-[9px] bg-muted text-muted-foreground border-transparent">{level.range}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{level.benefit}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full rounded-xl text-xs text-muted-foreground hover:text-foreground">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Adicionar nivel de fidelidade
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
