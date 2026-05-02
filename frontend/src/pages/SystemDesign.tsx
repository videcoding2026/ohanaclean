import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Palette, Type, Layers, MousePointerClick, FormInput, Table2, BadgeIcon, Layout } from "lucide-react"

const sections = [
  { id: "colors", icon: Palette, label: "Paleta de Cores" },
  { id: "typography", icon: Type, label: "Tipografia" },
  { id: "shadows", icon: Layers, label: "Sombras & Bordas" },
  { id: "buttons", icon: MousePointerClick, label: "Botoes" },
  { id: "inputs", icon: FormInput, label: "Formularios" },
  { id: "badges", icon: BadgeIcon, label: "Badges" },
  { id: "table", icon: Table2, label: "Tabela" },
  { id: "cards", icon: Layout, label: "Cards" },
]

const colorsPalette = [
  { id: "bg", name: "Background", hsl: "231 100% 98%", hex: "#F8F9FF" },
  { id: "fg", name: "Foreground", hsl: "222 47% 11%", hex: "#1E293B" },
  { id: "card", name: "Card", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { id: "primary", name: "Primary", hsl: "227 64% 48%", hex: "#2D4FCC" },
  { id: "secondary", name: "Secondary", hsl: "264 69% 50%", hex: "#6D28D9" },
  { id: "muted", name: "Muted", hsl: "229 100% 96%", hex: "#EEF1FF" },
  { id: "muted-fg", name: "Muted FG", hsl: "215 16% 47%", hex: "#6B7794" },
  { id: "accent", name: "Accent", hsl: "236 100% 98%", hex: "#F5F6FF" },
]

const statusColors = [
  { name: "Success", hsl: "160 84% 39%", hex: "#10B981" },
  { name: "Warning", hsl: "38 92% 50%", hex: "#F59E0B" },
  { name: "Destructive", hsl: "0 84% 60%", hex: "#EF4444" },
  { name: "Border", hsl: "214 32% 91%", hex: "#CBD5E1" },
]

export default function SystemDesignPage() {
  const [activeSection, setActiveSection] = useState("colors")

  return (
    <div className="flex gap-8 -mt-3">
      <nav className="hidden lg:flex flex-col w-52 shrink-0 space-y-1 fixed top-[5rem] left-[17.5rem] bottom-6 overflow-y-auto pb-6 pr-2" style={{ scrollbarWidth: "thin" }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-primary px-3 mb-3">Design System</p>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(s.id)
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
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
      </nav>

      <div className="flex-1 min-w-0 space-y-16 pb-32 lg:ml-60">
        <header className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary">Ohana Clean</h2>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Design System</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Biblioteca visual completa do produto — cores, tipografia, sombras, botoes, formularios, tabelas e cards.
          </p>
        </header>

        <section id="colors" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Paleta de Cores</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Cores semanticas do sistema com valores HSL para Tailwind. Cada cor adapta-se ao tema claro/escuro via CSS variables.</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Cores de Interface</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorsPalette.map((c) => (
                  <div key={c.id} className="rounded-2xl overflow-hidden border border-border shadow-card">
                    <div className="h-20" style={{ backgroundColor: c.hex }} />
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-semibold text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{c.hex}</p>
                      <p className="text-[10px] text-muted-foreground/70 font-mono">{c.hsl}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Cores de Status</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statusColors.map((c) => (
                  <div key={c.name} className="rounded-2xl overflow-hidden border border-border shadow-card">
                    <div className="h-20" style={{ backgroundColor: c.hex }} />
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-semibold text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{c.hex}</p>
                      <p className="text-[10px] text-muted-foreground/70 font-mono">{c.hsl}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="typography" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Type className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Tipografia</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Hierarquia textual com fonte Geist — tamanhos, pesos e tracking definidos no SystemDesign.md.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Titulo Pagina (h1)</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">Titulo Principal da Pagina</p>
              <code className="text-[10px] text-muted-foreground font-mono">text-2xl font-bold tracking-tight</code>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtitulo (h3)</p>
              <p className="text-sm font-semibold text-foreground">Subtitulo de Secao do Conteudo</p>
              <code className="text-[10px] text-muted-foreground font-mono">text-sm font-semibold</code>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corpo de Texto (p)</p>
              <p className="text-sm text-slate-600">Paragrafo com informacao descritiva. Usado em cards, modais, e qualquer fluxo de leitura continuada.</p>
              <code className="text-[10px] text-muted-foreground font-mono">text-sm text-slate-600</code>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Label de Formulario</p>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">NOME DO CAMPO</Label>
              <code className="text-[10px] text-muted-foreground font-mono">text-[10px] font-bold uppercase tracking-wider</code>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overline / Micro-label</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">SECAO DESTACADA</p>
              <code className="text-[10px] text-muted-foreground font-mono">text-[10px] font-black uppercase tracking-widest text-primary</code>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valores KPI / Numeros</p>
              <p className="text-3xl font-bold text-foreground">
                1.284 <span className="text-sm font-medium text-muted-foreground">L</span>
              </p>
              <code className="text-[10px] text-muted-foreground font-mono">font-bold (com font-numeric, cor #1A2060)</code>
            </div>
          </div>
        </section>

        <section id="shadows" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Sombras & Bordas</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Sistema de elevacao com glassmorphism em tons de azul. Tres niveis de profundidade definidos no tailwind.config.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center space-y-3">
              <p className="text-xs font-semibold text-foreground">shadow-card</p>
              <div className="h-16 rounded-2xl bg-card border border-border shadow-card flex items-center justify-center">
                <p className="text-[10px] text-muted-foreground">Painel / Card</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">0 2px 12px rgba(45,79,204,0.06)</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
              <p className="text-xs font-semibold text-foreground">shadow-primary-btn</p>
              <div className="h-16 rounded-2xl bg-primary shadow-primary-btn flex items-center justify-center">
                <p className="text-[10px] text-primary-foreground font-medium">Botao</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">0 4px 14px rgba(45,79,204,0.3)</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
              <p className="text-xs font-semibold text-foreground">shadow-modal</p>
              <div className="h-16 rounded-2xl bg-card border-0 shadow-modal flex items-center justify-center">
                <p className="text-[10px] text-muted-foreground">Modal</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">0 32px 80px -16px rgba(11,16,55,0.35)</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Border Radius</p>
            <div className="grid grid-cols-4 gap-4">
              {[
                { size: "lg", name: "Badges", dim: "0.75rem" },
                { size: "xl", name: "Inputs/Botoes", dim: "0.75rem" },
                { size: "2xl", name: "Cards", dim: "16px" },
                { size: "[32px]", name: "Modais", dim: "32px" },
              ].map((r) => (
                <div key={r.size} className="text-center space-y-2">
                  <div className={`rounded-${r.size} h-14 bg-primary/10 border-2 border-primary/20 flex items-center justify-center`}>
                    <code className="text-[10px] font-mono text-primary font-bold">{r.dim}</code>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="buttons" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <MousePointerClick className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Botoes</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Componente Button do Shadcn com 7 variantes e sombras customizadas Ohana Clean.</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary</p>
                <Button className="rounded-xl shadow-primary-btn">Default</Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secondary</p>
                <Button variant="secondary" className="rounded-xl">Secondary</Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outline</p>
                <Button variant="outline" className="rounded-xl">Outline</Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ghost</p>
                <Button variant="ghost" className="rounded-xl">Ghost</Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destructive</p>
                <Button variant="destructive" className="rounded-xl">Destructive</Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Link</p>
                <Button variant="link" className="h-auto p-0">Link</Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disabled</p>
                <Button disabled className="rounded-xl">Disabled</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Icon Botoes (Acoes em Tabela)</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-destructive hover:bg-red-50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="inputs" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <FormInput className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Formularios</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Inputs com labels uppercase, bordas arredondadas, icones laterais e feedback visual de validacao.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Input com Label</p>
              <div className="space-y-2">
                <Label htmlFor="demo-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Nome <span className="text-primary">*</span>
                </Label>
                <Input id="demo-name" placeholder="Digite seu nome" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input id="demo-email" type="email" placeholder="email@exemplo.com" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Input com Icone + Select + Erro</p>
              <div className="relative">
                <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <Input className="pl-10 h-11 rounded-xl" placeholder="Senha com 6+ caracteres" type="password" />
              </div>

              <Select>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Selecione uma opcao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Opcao Alpha</SelectItem>
                  <SelectItem value="2">Opcao Beta</SelectItem>
                  <SelectItem value="3">Opcao Gamma</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-1.5">
                <Input className="h-11 rounded-xl border-destructive" placeholder="Campo invalido" defaultValue="dado errado" />
                <p className="text-xs text-destructive font-medium">Campo obrigatorio nao preenchido corretamente.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="badges" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <BadgeIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Badges</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Tags e indicadores de status com 4 variantes Shadcn + 3 estilos customizados Ohana Clean.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Default</p>
                <Badge>Ativo</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secondary</p>
                <Badge variant="secondary">Arquivado</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outline</p>
                <Badge variant="outline">Pendente</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destructive</p>
                <Badge variant="destructive">Critico</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Informativo</p>
                <Badge className="bg-[#EEF1FF] text-[#2D4FCC] border-transparent">Info</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destaque</p>
                <Badge className="bg-[#F3EEFF] text-[#6D28D9] border-transparent">Destaque</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Success</p>
                <Badge className="bg-success/10 text-success border-transparent">Sucesso</Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Warning</p>
                <Badge className="bg-warning/10 text-warning border-transparent">Atencao</Badge>
              </div>
            </div>

            <div className="mt-6 flex gap-2 flex-wrap">
              <Badge className="bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider border-transparent">+12%</Badge>
              <Badge className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border-transparent">Ativo</Badge>
              <Badge className="bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider border-transparent">Meta 80%</Badge>
              <Badge className="bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider border-transparent">Erro</Badge>
            </div>
          </div>
        </section>

        <section id="table" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Table2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Tabela</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Cabecalho azul (#F0F2FF), linhas zebra alternadas e acoes com backdrop-blur em hover.</p>
          </div>

          <div className="rounded-2xl border border-border shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10 hover:bg-primary/10 border-b border-border">
                  <TableHead className="text-primary text-xs tracking-wider uppercase font-bold">Produto</TableHead>
                  <TableHead className="text-primary text-xs tracking-wider uppercase font-bold">Categoria</TableHead>
                  <TableHead className="text-primary text-xs tracking-wider uppercase font-bold">Estoque</TableHead>
                  <TableHead className="text-primary text-xs tracking-wider uppercase font-bold">Status</TableHead>
                  <TableHead className="text-primary text-xs tracking-wider uppercase font-bold text-right w-20">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Sabao Liquido Lavanda", cat: "Limpeza Geral", stock: "124 L", status: "Ativo", cls: "bg-success/10 text-success" },
                  { name: "Desinfetante Citrico", cat: "Desinfeccao", stock: "48 L", status: "Baixo", cls: "bg-warning/10 text-warning" },
                  { name: "Amaciante Concentrado", cat: "Textil", stock: "0 L", status: "Esgotado", cls: "bg-destructive/10 text-destructive" },
                ].map((row, i) => (
                    <TableRow key={i} className="even:bg-muted/30 odd:bg-card border-b border-border group/row relative">
                      <TableCell className="text-sm font-medium text-foreground">{row.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.cat}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.stock}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-bold uppercase tracking-wider border-transparent ${row.cls}`}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-all duration-200 bg-card/95 backdrop-blur-sm px-1 py-0.5 rounded-lg">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-accent">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-destructive hover:bg-red-50">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="cards" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Layout className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Cards</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">Cards KPI, formulario, destaque com gradiente — glassmorphism com sombras caracteristicas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:shadow-modal transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-foreground">Producao Mensal</h3>
              <p className="mt-1 text-3xl font-bold text-foreground">1.284<span className="text-sm font-medium text-muted-foreground ml-1">L</span></p>
              <Badge className="mt-2 text-[10px] font-bold bg-success/10 text-success border-transparent">+12%</Badge>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:shadow-modal transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-foreground">Formulas Ativas</h3>
              <p className="mt-1 text-3xl font-bold text-foreground">47</p>
              <Badge className="mt-2 text-[10px] font-bold bg-primary/10 text-primary border-transparent">Ativo</Badge>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:shadow-modal transition-all duration-300">
              <h3 className="text-sm font-semibold text-foreground">Performance</h3>
              <p className="mt-1 text-3xl font-bold text-foreground">86<span className="text-sm font-medium text-muted-foreground ml-1">%</span></p>
              <Badge className="mt-2 text-[10px] font-bold bg-primary/10 text-primary border-transparent">Premium</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Formulario em Card</p>
                <Badge variant="outline" className="text-[10px]">Dados Gerais</Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-field" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome Completo</Label>
                <Input id="card-field" placeholder="Seu nome" className="h-11 rounded-xl" />
              </div>
              <Button className="w-full rounded-xl shadow-primary-btn">Salvar Registro</Button>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              <p className="text-sm italic">Grafico / Widget (em breve)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
