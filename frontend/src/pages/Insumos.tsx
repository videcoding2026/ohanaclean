import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Pencil, Beaker, XIcon, Trash2 } from "lucide-react"

const catOpts = ["Base quimica", "Tensoativo", "Corante", "Perfume / Fragrancia", "Conservante", "Solvente", "Espessante", "Embalagem", "Rotulo", "Outros"]
const unidOpts = ["kg", "g", "L", "ml", "un"]
const statusOpts = ["Ativo", "Inativo"]

const statusBadge = (s: string) => {
  const m: Record<string, string> = { "Ativo": "bg-success/15 text-success", "Inativo": "bg-muted text-muted-foreground", "Ativa": "bg-success/15 text-success", "Inativa": "bg-muted text-muted-foreground" }
  return <Badge className={`${m[s] || "bg-muted"} text-[10px] font-bold uppercase tracking-wider border-transparent`}>{s}</Badge>
}

const emptyForm = () => ({
  nome: "", nomeTecnico: "", descricao: "", categoria: "", unidadeCompra: "", unidadeUso: "",
  densidade: 0, temValidade: false, dataValidade: "",
  temVariantes: false,
  insumoSubstitutoId: "", proporcaoSubstituicao: 0, observacaoSubstituicao: "",
  status: "Ativo" as const,
})

const emptyVariant = () => ({
  nome: "", descricao: "", temValidade: false, dataValidade: "", unidadeMedida: "",
  estoqueMinimo: 0, estoqueMaximo: 0, localizacao: "", fornecedorPreferencialId: "", status: "Ativa" as const,
})

export default function InsumosPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const insumos = useQuery(api.insumos.list, { status: filterStatus || undefined })
  const create = useMutation(api.insumos.create)
  const update = useMutation(api.insumos.update)
  const createVariant = useMutation(api.insumos.createVariant)
  const updateVariant = useMutation(api.insumos.updateVariant)
  const removeVariant = useMutation(api.insumos.removeVariant)
  const removeInsumo = useMutation(api.insumos.remove)

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const variantsQuery = useQuery(api.insumos.listVariants, editId ? { insumoId: editId as any } : "skip")

  const [form, setForm] = useState(emptyForm())
  const [tabIdx, setTabIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const [valOpen, setValOpen] = useState(false)
  const [valErrors, setValErrors] = useState<string[]>([])

  const [varDialog, setVarDialog] = useState(false)
  const [varEditId, setVarEditId] = useState<string | null>(null)
  const [varForm, setVarForm] = useState(emptyVariant())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMsg, setConfirmMsg] = useState("")
  const [varValOpen, setVarValOpen] = useState(false)
  const [varValMsg, setVarValMsg] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0 }, [tabIdx])

  const filtered = (insumos ?? []).filter((s: any) => {
    const t = search.toLowerCase(); const n = s.nome?.toLowerCase() ?? ""
    return !t || n.includes(t)
  })

  const openCreate = () => { setForm(emptyForm()); setEditId(null); setTabIdx(0); setOpen(true) }
  const openEdit = (s: any) => {
    const f = emptyForm() as any
    for (const k of Object.keys(f)) if (s[k] !== undefined && s[k] !== null) f[k] = s[k]
    if (s.insumoSubstitutoId) f.insumoSubstitutoId = s.insumoSubstitutoId
    setForm(f); setEditId(s._id); setTabIdx(0); setOpen(true)
  }
  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    const missing: string[] = []
    if (!form.nome) missing.push("Nome do insumo")
    if (!form.categoria) missing.push("Categoria")
    if (!form.unidadeCompra) missing.push("Unidade de compra")
    if (!form.unidadeUso) missing.push("Unidade de uso")
    if (missing.length > 0) { setValErrors(missing); setValOpen(true); return }
    setSaving(true)
    try {
      const data: any = {}
      for (const k of Object.keys(emptyForm())) {
        const v = (form as any)[k]
        data[k] = (typeof v === "number" && v === 0) || v === "" ? undefined : v
      }
      data.insumoSubstitutoId = data.insumoSubstitutoId || undefined
      if (editId) await update({ insumoId: editId as any, ...data })
      else await create(data)
      setOpen(false)
    } catch (e: any) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleConfirm = () => { if (confirmAction) confirmAction(); setConfirmOpen(false) }

  const tabs = ["Dados Gerais", "Variantes", "Estoque", "Custos", "Ficha Tecnica", "Historico"]
  const disabledTabs = [false, !editId || !form.temVariantes, true, true, true, true]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Cadastros</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Insumos</h1>
        </div>
        <Button onClick={openCreate} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Novo Insumo</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v || "")}>
            <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos</SelectItem>{statusOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Nenhum insumo encontrado.</div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Insumo</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Categoria</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Unid.</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Variantes</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s: any) => (
                <TableRow key={s._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => openEdit(s)}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Beaker className="h-4 w-4" /></div>
                      <div><p className="text-sm font-semibold text-foreground leading-none mb-0.5">{s.nome}</p><p className="text-[11px] text-muted-foreground">{s.nomeTecnico || "—"}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.categoria}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.unidadeCompra}</TableCell>
                  <TableCell>{s.temVariantes ? <Badge className="bg-primary/10 text-primary text-[10px]">Com variantes</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50"
                        onClick={() => {
                          setConfirmMsg(`Remover o insumo "${s.nome}"?`)
                          setConfirmAction(() => async () => { try { await removeInsumo({ insumoId: s._id }) } catch {} })
                          setConfirmOpen(true)
                        }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
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
          <div className="px-6 py-5"><ul className="space-y-2">{valErrors.map((e) => (<li key={e} className="flex items-center gap-2.5 text-sm text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{e}</li>))}</ul></div>
          <div className="px-6 pb-5"><Button className="w-full rounded-xl h-11 shadow-primary-btn" onClick={() => setValOpen(false)}>Entendi</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={varValOpen} onOpenChange={setVarValOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Atencao</DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-1">Verifique os dados antes de salvar.</DialogDescription>
          </div>
          <div className="px-6 py-5"><p className="text-sm text-foreground">{varValMsg}</p></div>
          <div className="px-6 pb-5"><Button className="w-full rounded-xl h-11 shadow-primary-btn" onClick={() => setVarValOpen(false)}>Entendi</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Confirmar</DialogTitle>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-foreground">{confirmMsg}</p>
          </div>
          <div className="flex gap-3 px-6 pb-5">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl flex-1 h-11 bg-destructive text-destructive-foreground" onClick={handleConfirm}>Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={varDialog} onOpenChange={setVarDialog}>
        <DialogContent className="sm:max-w-[480px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0">
              <DialogTitle className="text-xl font-bold tracking-tight text-white">{varEditId ? "Editar Variante" : "Nova Variante"}</DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">Preencha os dados da variante.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome da Variante</Label><Input className="h-10 rounded-xl" value={varForm.nome} onChange={(e) => setVarForm({ ...varForm, nome: e.target.value })} placeholder="Ex: Floral, 500ml, Azul..." /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descricao</Label><Input className="h-10 rounded-xl" value={varForm.descricao} onChange={(e) => setVarForm({ ...varForm, descricao: e.target.value })} placeholder="Descricao (opcional)" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unidade de Medida</Label>
                <Select value={varForm.unidadeMedida} onValueChange={(v) => v && setVarForm({ ...varForm, unidadeMedida: v })}>
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>{unidOpts.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tem Validade?</Label>
                <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                  <button onClick={() => setVarForm({ ...varForm, temValidade: true })} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${varForm.temValidade ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Sim</button>
                  <button onClick={() => setVarForm({ ...varForm, temValidade: false })} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${!varForm.temValidade ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Nao</button>
                </div>
              </div>
            </div>
            {varForm.temValidade && (
              <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data de Validade</Label><Input className="h-10 rounded-xl" type="date" value={varForm.dataValidade} onChange={(e) => setVarForm({ ...varForm, dataValidade: e.target.value })} /></div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estoque Minimo</Label><Input className="h-10 rounded-xl" type="number" value={varForm.estoqueMinimo || ""} onChange={(e) => setVarForm({ ...varForm, estoqueMinimo: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estoque Maximo</Label><Input className="h-10 rounded-xl" type="number" value={varForm.estoqueMaximo || ""} onChange={(e) => setVarForm({ ...varForm, estoqueMaximo: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Localizacao</Label><Input className="h-10 rounded-xl" value={varForm.localizacao} onChange={(e) => setVarForm({ ...varForm, localizacao: e.target.value })} placeholder="Prateleira, gaveta..." /></div>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setVarDialog(false)}>Cancelar</Button>
            <Button className="rounded-xl flex-1 h-11 shadow-primary-btn" onClick={async () => {
              if (!varForm.nome) { setVarValMsg("O campo Nome da Variante e obrigatorio."); setVarValOpen(true); return }
              if (!editId) return
              try {
                if (varEditId) {
                  await updateVariant({ variantId: varEditId as any, ...varForm })
                } else {
                  await createVariant({ ...varForm, insumoId: editId as any })
                }
                setVarForm(emptyVariant()); setVarEditId(null); setVarDialog(false)
              } catch (e: any) { console.error(e) }
            }}>{varEditId ? "Salvar" : "Adicionar"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">{editId ? "Editar Insumo" : "Novo Insumo"}</DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">Abas 03-06 serao implementadas em fases futuras.</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex gap-2 px-6 py-3 border-b border-border bg-muted/20">
            {tabs.map((l, i) => {
              const disabled = disabledTabs[i]
              return (
                <button key={l} onClick={() => !disabled && setTabIdx(i)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${disabled ? "text-muted-foreground/40 cursor-not-allowed" : tabIdx === i ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{l}</button>
              )
            })}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5" ref={scrollRef}>
            <div className={tabIdx === 0 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Identificacao</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome do Insumo</Label><Input className="h-10 rounded-xl" value={form.nome} onChange={(e) => setF("nome", e.target.value)} placeholder="Ex: Essencia, Embalagem..." /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Tecnico</Label><Input className="h-10 rounded-xl" value={form.nomeTecnico} onChange={(e) => setF("nomeTecnico", e.target.value)} placeholder="Opcional" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descricao</Label><Input className="h-10 rounded-xl" value={form.descricao} onChange={(e) => setF("descricao", e.target.value)} placeholder="Descricao do insumo" /></div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Classificacao e Unidades</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria</Label>
                      <Select value={form.categoria} onValueChange={(v) => setF("categoria", v)}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="---" /></SelectTrigger>
                        <SelectContent className="min-w-[200px]">{catOpts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unid. Compra</Label>
                      <Select value={form.unidadeCompra} onValueChange={(v) => setF("unidadeCompra", v)}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="---" /></SelectTrigger>
                        <SelectContent>{unidOpts.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unid. Uso</Label>
                      <Select value={form.unidadeUso} onValueChange={(v) => setF("unidadeUso", v)}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="---" /></SelectTrigger>
                        <SelectContent>{unidOpts.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Densidade</Label><Input className="h-10 rounded-xl" type="number" value={form.densidade || ""} onChange={(e) => setF("densidade", Number(e.target.value) || 0)} /></div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Validade</Label>
                      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                        <button onClick={() => setF("temValidade", true)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${form.temValidade ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Sim</button>
                        <button onClick={() => setF("temValidade", false)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${!form.temValidade ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Nao</button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Variantes</Label>
                      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                        <button onClick={() => setF("temVariantes", true)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${form.temVariantes ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Sim</button>
                        <button onClick={() => setF("temVariantes", false)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${!form.temVariantes ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Nao</button>
                      </div>
                    </div>
                  </div>
                  {form.temValidade && <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Validade</Label><Input className="h-10 rounded-xl" type="date" value={form.dataValidade} onChange={(e) => setF("dataValidade", e.target.value)} /></div>}
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Insumo Substituto</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Substituto</Label><Input className="h-10 rounded-xl" value={form.insumoSubstitutoId} onChange={(e) => setF("insumoSubstitutoId", e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proporcao (%)</Label><Input className="h-10 rounded-xl" type="number" value={form.proporcaoSubstituicao || ""} onChange={(e) => setF("proporcaoSubstituicao", Number(e.target.value) || 0)} /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Obs.</Label><Input className="h-10 rounded-xl" value={form.observacaoSubstituicao} onChange={(e) => setF("observacaoSubstituicao", e.target.value)} /></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Status</p>
                  <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                    {statusOpts.map(s => (
                      <button key={s} onClick={() => setF("status", s)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${form.status === s ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={tabIdx === 1 ? "block" : "hidden"}>
              <div className="space-y-4">
                {!editId ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Salve o insumo primeiro para gerenciar variantes.</div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Variantes</p>
                      <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs"
                        onClick={() => { setVarForm(emptyVariant()); setVarDialog(true) }}>
                        <Plus className="h-3 w-3" /> Nova Variante
                      </Button>
                    </div>
                    {!variantsQuery || variantsQuery.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma variante cadastrada.</p>
                    ) : (
                      <div className="space-y-2">
                        {variantsQuery.map((v: any) => (
                          <div key={v._id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10 cursor-pointer hover:bg-accent/30 transition-colors"
                            onClick={() => {
                              setVarForm({
                                nome: v.nome || "", descricao: v.descricao || "", temValidade: v.temValidade || false,
                                dataValidade: v.dataValidade || "", unidadeMedida: v.unidadeMedida || "",
                                estoqueMinimo: v.estoqueMinimo || 0, estoqueMaximo: v.estoqueMaximo || 0,
                                localizacao: v.localizacao || "", fornecedorPreferencialId: v.fornecedorPreferencialId || "",
                                status: v.status || "Ativa",
                              })
                              setVarEditId(v._id); setVarDialog(true)
                            }}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{v.nome}</span>
                                {statusBadge(v.status)}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{v.descricao || "—"} {v.unidadeMedida ? `| ${v.unidadeMedida}` : ""}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive shrink-0"
                              onClick={(e) => { e.stopPropagation();
                                setConfirmMsg("Remover esta variante?")
                                setConfirmAction(() => async () => {
                                  try { await removeVariant({ variantId: v._id }) } catch {}
                                })
                                setConfirmOpen(true)
                              }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className={tabIdx >= 2 ? "block" : "hidden"}>
              <div className="py-16 text-center text-sm text-muted-foreground">
                {tabIdx === 2 ? "Estoque e Localizacao" : tabIdx === 3 ? "Custos e Fornecedores" : tabIdx === 4 ? "Ficha Tecnica e Seguranca" : "Historico e Movimentacoes"} — Fase 3
              </div>
            </div>
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
