import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Pencil, Users, XIcon } from "lucide-react"
import { maskPhone, maskCep, maskDocument, strip } from "@/lib/masks"

const statusBadge = (s: string) => {
  const m: Record<string, string> = { "Ativo": "bg-success/15 text-success", "Inativo": "bg-muted text-muted-foreground", "Bloqueado": "bg-destructive/15 text-destructive" }
  return <Badge className={`${m[s] || "bg-muted"} text-[10px] font-bold uppercase tracking-wider border-transparent`}>{s}</Badge>
}

const emptyForm = () => ({
  personType: "PJ",
  pfName: "", pfCpf: "", pfBirthDate: "",
  pjRazaoSocial: "", pjNomeFantasia: "", pjCnpj: "", pjInscricaoEstadual: "", pjInscricaoMunicipal: "",
  clientType: "", segmento: "", origem: "",
  cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
  telefone: "", whatsapp: "", email: "", melhorHorario: "",
  descontoFixo: 0, limiteCredito: 0, condPagamento: "", formaPagamento: "", fretePadrao: "",
  observacoes: "", tags: "",
  status: "Ativo", motivoBloqueio: "",
})

const clientTypeOpts = ["Consumidor Final", "Revendedor", "Atacado", "Distribuidor"]
const segmentoOpts = ["Mercado / Mercearia", "Loja de Produtos de Limpeza", "Salao de Beleza", "Restaurante / Lanchonete", "Condominio / Sindico", "Escola / Creche", "Clinica / Consultorio", "Pousada / Hotel", "Outro"]
const origemOpts = ["Indicacao", "Redes Sociais", "WhatsApp", "Amostra recebida", "Outro"]
const statusOpts = ["Ativo", "Inativo", "Bloqueado"]

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const clients = useQuery(api.clients.list, { status: filterStatus || undefined })
  const create = useMutation(api.clients.create)
  const update = useMutation(api.clients.update)

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [tabIdx, setTabIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const [valOpen, setValOpen] = useState(false)
  const [valErrors, setValErrors] = useState<string[]>([])

  const filtered = (clients ?? []).filter((s: any) => {
    const t = search.toLowerCase()
    const n = (s.pjNomeFantasia || s.pfName || "").toLowerCase()
    const d = (s.pjCnpj || s.pfCpf || "").toLowerCase()
    return !t || n.includes(t) || d.includes(t)
  })

  const openCreate = () => { setForm(emptyForm()); setEditId(null); setTabIdx(0); setOpen(true) }
  const openEdit = (s: any) => {
    const f = emptyForm() as any
    for (const k of Object.keys(f)) if (s[k] !== undefined && s[k] !== null) f[k] = s[k]
    setForm(f); setEditId(s._id); setTabIdx(0); setOpen(true)
  }
  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    const missing: string[] = []
    if (!form.telefone) missing.push("Telefone")
    if (form.personType === "PJ" && !form.pjCnpj) missing.push("CNPJ")
    if (form.personType === "PF" && !form.pfName) missing.push("Nome Completo")
    if (missing.length > 0) { setValErrors(missing); setValOpen(true); return }
    setSaving(true)
    try {
      const data: Record<string, unknown> = {}
      for (const k of Object.keys(emptyForm())) {
        let v = (form as any)[k]
        if (k === "telefone" || k === "whatsapp" || k === "cep" || k === "pfCpf" || k === "pjCnpj") v = strip(v)
        data[k] = (typeof v === "number" && v === 0) || v === "" ? undefined : v
      }
      if (editId) await update({ clientId: editId as any, ...data } as any)
      else await create(data as any)
      setOpen(false)
    } catch (e: any) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Cadastros</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes</h1>
        </div>
        <Button onClick={openCreate} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Novo Cliente</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, CPF ou CNPJ..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v || "")}>
            <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos</SelectItem>{statusOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Cliente</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Tipo</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Classificacao</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Contato</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s: any) => (
                <TableRow key={s._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => openEdit(s)}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Users className="h-4 w-4" /></div>
                      <div><p className="text-sm font-semibold text-foreground leading-none mb-0.5">{s.pjNomeFantasia || s.pfName || "—"}</p><p className="text-[11px] text-muted-foreground">{s.pjCnpj || s.pfCpf || "—"}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm"><Badge className="bg-secondary/10 text-secondary text-[10px]">{s.personType}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.clientType || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.telefone}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent" onClick={(e) => { e.stopPropagation(); openEdit(s) }}><Pencil className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={valOpen} onOpenChange={setValOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Campos Obrigatorios</DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-1">Preencha todos os campos antes de salvar.</DialogDescription>
          </div>
          <div className="px-6 py-5">
            <ul className="space-y-2">
              {valErrors.map((e) => (
                <li key={e} className="flex items-center gap-2.5 text-sm text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{e}</li>
              ))}
            </ul>
          </div>
          <div className="px-6 pb-5"><Button className="w-full rounded-xl h-11 shadow-primary-btn" onClick={() => setValOpen(false)}>Entendi</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">{editId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">Preencha os dados do cliente. Abas completas conforme cadastro.</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex gap-2 px-6 py-3 border-b border-border bg-muted/20">
            {["Dados Gerais", "Contatos", "Comerciais", "Observacoes"].map((l, i) => (
              <button key={l} onClick={() => setTabIdx(i)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${tabIdx === i ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{l}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {tabIdx === 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo de Pessoa</Label>
                    <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                      <button onClick={() => setF("personType", "PJ")} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${form.personType === "PJ" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground"}`}>Pessoa Juridica</button>
                      <button onClick={() => setF("personType", "PF")} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${form.personType === "PF" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground"}`}>Pessoa Fisica</button>
                    </div>
                  </div>
                </div>

                {form.personType === "PF" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Completo</Label><Input className="h-10 rounded-xl" value={form.pfName} onChange={(e) => setF("pfName", e.target.value)} placeholder="Nome do cliente" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CPF</Label><Input className="h-10 rounded-xl" value={form.pfCpf} onChange={(e) => setF("pfCpf", maskDocument(e.target.value, "PF"))} placeholder="000.000.000-00" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data de Nascimento</Label><Input className="h-10 rounded-xl" value={form.pfBirthDate} onChange={(e) => setF("pfBirthDate", e.target.value)} placeholder="DD/MM/AAAA" /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Razao Social</Label><Input className="h-10 rounded-xl" value={form.pjRazaoSocial} onChange={(e) => setF("pjRazaoSocial", e.target.value)} placeholder="Razao social" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Fantasia</Label><Input className="h-10 rounded-xl" value={form.pjNomeFantasia} onChange={(e) => setF("pjNomeFantasia", e.target.value)} placeholder="Nome comercial" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CNPJ</Label><Input className="h-10 rounded-xl" value={form.pjCnpj} onChange={(e) => setF("pjCnpj", maskDocument(e.target.value, "PJ"))} placeholder="00.000.000/0000-00" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inscricao Estadual</Label><Input className="h-10 rounded-xl" value={form.pjInscricaoEstadual} onChange={(e) => setF("pjInscricaoEstadual", e.target.value)} placeholder="Opcional" /></div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Classificacao</p>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo de Cliente</Label>
                      <Select value={form.clientType} onValueChange={(v) => setF("clientType", v)}>
                        <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent className="min-w-[180px]">{clientTypeOpts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Segmento</Label>
                      <Select value={form.segmento} onValueChange={(v) => setF("segmento", v)}>
                        <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent className="min-w-[180px]">{segmentoOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Origem</Label>
                      <Select value={form.origem} onValueChange={(v) => setF("origem", v)}>
                        <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent className="min-w-[180px]">{origemOpts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Status</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Situacao</Label>
                      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                        {statusOpts.map(s => (
                          <button key={s} onClick={() => setF("status", s)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${form.status === s ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tags</Label>
                      <Input className="h-10 rounded-xl" value={form.tags} onChange={(e) => setF("tags", e.target.value)} placeholder="#VIP #Potencial" />
                    </div>
                  </div>
                  {form.status === "Bloqueado" && (
                    <div className="space-y-1.5 mt-3"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Motivo do Bloqueio</Label><Input className="h-10 rounded-xl" value={form.motivoBloqueio} onChange={(e) => setF("motivoBloqueio", e.target.value)} /></div>
                  )}
                </div>
              </>
            )}

            {tabIdx === 1 && (
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Endereco</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CEP</Label><Input className="h-10 rounded-xl" value={form.cep} onChange={(e) => setF("cep", maskCep(e.target.value))} placeholder="00000-000" /></div>
                    <div className="col-span-2 space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Logradouro</Label><Input className="h-10 rounded-xl" value={form.logradouro} onChange={(e) => setF("logradouro", e.target.value)} placeholder="Rua, Avenida..." /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Numero</Label><Input className="h-10 rounded-xl" value={form.numero} onChange={(e) => setF("numero", e.target.value)} placeholder="123" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Complemento</Label><Input className="h-10 rounded-xl" value={form.complemento} onChange={(e) => setF("complemento", e.target.value)} placeholder="Apto, Bloco..." /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bairro</Label><Input className="h-10 rounded-xl" value={form.bairro} onChange={(e) => setF("bairro", e.target.value)} placeholder="Bairro" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cidade</Label><Input className="h-10 rounded-xl" value={form.cidade} onChange={(e) => setF("cidade", e.target.value)} placeholder="Cidade" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estado (UF)</Label><Input className="h-10 rounded-xl" value={form.estado} onChange={(e) => setF("estado", e.target.value)} placeholder="SP" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Referencia / Ponto</Label><Input className="h-10 rounded-xl" value={form.complemento} onChange={(e) => setF("complemento", e.target.value)} placeholder="Ponto de referencia" /></div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Contato</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefone <span className="text-primary">*</span></Label><Input className="h-10 rounded-xl" value={form.telefone} onChange={(e) => setF("telefone", maskPhone(e.target.value))} placeholder="(00) 0000-0000" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">WhatsApp</Label><Input className="h-10 rounded-xl" value={form.whatsapp} onChange={(e) => setF("whatsapp", maskPhone(e.target.value))} placeholder="(00) 00000-0000" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">E-mail</Label><Input className="h-10 rounded-xl" value={form.email} onChange={(e) => setF("email", e.target.value)} placeholder="email@exemplo.com" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Melhor Horario Contato</Label>
                      <Select value={form.melhorHorario} onValueChange={(v) => setF("melhorHorario", v)}>
                        <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar horario" /></SelectTrigger>
                        <SelectContent className="min-w-[200px]"><SelectItem value="Manha">Manha (08h-12h)</SelectItem><SelectItem value="Tarde">Tarde (12h-18h)</SelectItem><SelectItem value="Noite">Noite (18h-22h)</SelectItem><SelectItem value="Indiferente">Indiferente</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabIdx === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Condicao de Pagamento</Label>
                  <Select value={form.condPagamento} onValueChange={(v) => setF("condPagamento", v)}>
                    <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent className="min-w-[200px]"><SelectItem value="A vista">A vista</SelectItem><SelectItem value="30d">30 dias</SelectItem><SelectItem value="30/60d">30/60 dias</SelectItem><SelectItem value="Personalizado">Personalizado</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Forma de Pagamento</Label>
                  <Select value={form.formaPagamento} onValueChange={(v) => setF("formaPagamento", v)}>
                    <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent className="min-w-[200px]"><SelectItem value="PIX">PIX</SelectItem><SelectItem value="Dinheiro">Dinheiro</SelectItem><SelectItem value="Boleto">Boleto</SelectItem><SelectItem value="Cartao">Cartao</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Desconto Fixo (%)</Label><Input className="h-10 rounded-xl" type="number" value={form.descontoFixo || ""} onChange={(e) => setF("descontoFixo", Number(e.target.value) || 0)} /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Limite de Credito (R$)</Label><Input className="h-10 rounded-xl" type="number" value={form.limiteCredito || ""} onChange={(e) => setF("limiteCredito", Number(e.target.value) || 0)} /></div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Frete Padrao</Label>
                  <Select value={form.fretePadrao} onValueChange={(v) => setF("fretePadrao", v)}>
                    <SelectTrigger className="h-10 rounded-xl w-full"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent className="min-w-[200px]"><SelectItem value="A combinar">A combinar</SelectItem><SelectItem value="Gratis">Gratis</SelectItem><SelectItem value="Por conta do cliente">Por conta do cliente</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {tabIdx === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacoes Gerais</Label>
                  <textarea className="w-full min-h-[120px] rounded-xl border border-border bg-card p-4 text-sm placeholder:text-muted-foreground resize-y focus-visible:ring-2 focus-visible:ring-ring outline-none" value={form.observacoes} onChange={(e) => setF("observacoes", e.target.value)} placeholder="Observacoes sobre o cliente..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tags</Label>
                  <Input className="h-10 rounded-xl" value={form.tags} onChange={(e) => setF("tags", e.target.value)} placeholder="#VIP #Potencial #Fidelizado" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">
              {saving ? "Salvando..." : editId ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
