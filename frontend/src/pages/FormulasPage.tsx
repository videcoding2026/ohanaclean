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
import { Search, Plus, Pencil, Trash2, FlaskConical, XIcon } from "lucide-react"
import { maskTime, maskDecimal, parseDecimal } from "@/lib/masks"

const statusOpts = ["Ativa", "Em teste", "Inativa"]
const statusBadge = (s: string) => {
  const m: Record<string, string> = { "Ativa": "bg-success/15 text-success", "Em teste": "bg-warning/15 text-warning", "Inativa": "bg-muted text-muted-foreground" }
  return <Badge className={`${m[s] || "bg-muted"} text-[10px] font-bold uppercase tracking-wider border-transparent`}>{s}</Badge>
}
const unidOpts = ["L", "ml", "kg", "g", "un"]

const emptyForm = () => ({
  nome: "", productId: "", descricao: "", rendimento: 0, unidade: "", tempoEstimado: "", temCQ: false, status: "Ativa" as const,
})

const emptyIngredient = () => ({
  insumoId: "", varianteId: "", quantidade: "", unidade: "", ordem: 0,
  temperatura: "", tempoMistura: "", observacao: "",
})

export default function FormulasPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const formulas = useQuery(api.formulas.list, { status: filterStatus || undefined })
  const create = useMutation(api.formulas.create)
  const update = useMutation(api.formulas.update)
  const remove = useMutation(api.formulas.remove)
  const addIngredient = useMutation(api.formulas.addIngredient)
  const removeIngredient = useMutation(api.formulas.removeIngredient)
  const insumosList = useQuery(api.insumos.list, {})
  const productsList = useQuery(api.products.list, {})

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const ingredientsQuery = useQuery(api.formulas.listIngredients, editId ? { formulaId: editId as any } : "skip")
  const [form, setForm] = useState(emptyForm())
  const [tabIdx, setTabIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const [valOpen, setValOpen] = useState(false)
  const [valErrors, setValErrors] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMsg, setConfirmMsg] = useState("")
  const [ingForm, setIngForm] = useState(emptyIngredient())
  const [localIngredients, setLocalIngredients] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0 }, [tabIdx])

  const selectedProduct = productsList?.find((p: any) => p._id === form.productId)
  const selectedInsumo = insumosList?.find((i: any) => i._id === ingForm.insumoId)
  const variants = useQuery(api.insumos.listVariants, ingForm.insumoId ? { insumoId: ingForm.insumoId as any } : "skip")

  const filtered = (formulas ?? []).filter((s: any) => {
    const t = search.toLowerCase(); const n = s.nome?.toLowerCase() ?? ""
    return !t || n.includes(t)
  })

  const openCreate = () => { setForm(emptyForm()); setEditId(null); setLocalIngredients([]); setTabIdx(0); setOpen(true) }
  const openEdit = async (s: any) => {
    const f = emptyForm() as any
    for (const k of Object.keys(f)) if (s[k] !== undefined && s[k] !== null) f[k] = s[k]
    if (s.productId) f.productId = s.productId
    setForm(f); setEditId(s._id); setTabIdx(0); setOpen(true)
  }
  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    const missing: string[] = []
    if (!form.nome) missing.push("Nome da formula")
    if (!form.productId) missing.push("Produto vinculado")
    if (missing.length > 0) { setValErrors(missing); setValOpen(true); return }
    setSaving(true)
    try {
      const data: any = {}
      for (const k of Object.keys(emptyForm())) { const v = (form as any)[k]; data[k] = (typeof v === "number" && v === 0) || v === "" ? undefined : v }
      data.productId = data.productId || undefined
      let newId = editId
      if (editId) { await update({ formulaId: editId as any, ...data }) } else { newId = await create(data) }
      if (!editId && localIngredients.length > 0) {
        for (let i = 0; i < localIngredients.length; i++) {
          const ing = localIngredients[i]
          await addIngredient({
            formulaId: newId as any, ordem: i + 1, quantidade: Number(ing.quantidade),
            insumoId: ing.insumoId as any, varianteId: ing.varianteId ? ing.varianteId as any : undefined,
            unidade: ing.unidade || undefined,
          })
        }
      }
      setOpen(false)
    } catch (e: any) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleAddIng = async () => {
    if (!ingForm.insumoId || !ingForm.quantidade) return
    const ins = insumosList?.find((i: any) => i._id === ingForm.insumoId)
    const unidade = ingForm.unidade || ins?.unidadeUso || ins?.unidadeCompra || "un"
    const isMetric = unidade !== "un"
    const qtd = parseDecimal(ingForm.quantidade, isMetric)
    if (qtd <= 0) return
    const ing = { ...ingForm, quantidade: qtd, unidade }
    if (editId) {
      const ordem = (ingredientsQuery?.length ?? 0) + (localIngredients.length > 0 ? localIngredients.length : 0) + 1
      try { await addIngredient({
        formulaId: editId as any, ordem, quantidade: Number(ing.quantidade),
        insumoId: ing.insumoId as any, varianteId: ing.varianteId ? ing.varianteId as any : undefined,
        unidade: ing.unidade || undefined,
      })} catch (e: any) { console.error(e) }
    } else {
      setLocalIngredients([...localIngredients, { ...ing, _localId: Date.now(), ordem: localIngredients.length + 1 }])
    }
    setIngForm(emptyIngredient())
  }

  const handleConfirm = () => { if (confirmAction) confirmAction(); setConfirmOpen(false) }

  const tabs = ["Dados Gerais", "Composicao", "Custos", "Qualidade", "Historico"]
  const disabledTabs = [false, false, true, true, true]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Producao</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">Formulas</h1></div>
        <Button onClick={openCreate} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Nova Formula</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nome..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v || "")}>
            <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos</SelectItem>{statusOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? <div className="p-12 text-center text-sm text-muted-foreground">Nenhuma formula encontrada.</div>
        : <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Formula</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Produto</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{filtered.map((s: any) => {
              const prod = productsList?.find((p: any) => p._id === s.productId)
              return (
                <TableRow key={s._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => openEdit(s)}>
                  <TableCell className="py-3"><div className="flex items-center gap-2.5"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><FlaskConical className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-foreground leading-none mb-0.5">{s.nome}</p></div></div></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{prod?.nome || "—"}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell><div className="flex gap-1" onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => { setConfirmMsg(`Remover "${s.nome}"?`); setConfirmAction(() => async () => { try { await remove({ formulaId: s._id }) } catch {} }); setConfirmOpen(true) }}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell>
                </TableRow>
              )
            })}</TableBody>
          </Table>}
      </div>

      <Dialog open={valOpen} onOpenChange={setValOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Campos Obrigatorios</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Preencha todos os campos antes de salvar.</DialogDescription></div>
          <div className="px-6 py-5"><ul className="space-y-2">{valErrors.map((e) => (<li key={e} className="flex items-center gap-2.5 text-sm text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{e}</li>))}</ul></div>
          <div className="px-6 pb-5"><Button className="w-full rounded-xl h-11 shadow-primary-btn" onClick={() => setValOpen(false)}>Entendi</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Confirmar</DialogTitle></div>
          <div className="px-6 py-5"><p className="text-sm text-foreground">{confirmMsg}</p></div>
          <div className="flex gap-3 px-6 pb-5"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button><Button className="rounded-xl flex-1 h-11 bg-destructive text-destructive-foreground" onClick={handleConfirm}>Remover</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0"><DialogTitle className="text-2xl font-bold tracking-tight text-white">{editId ? "Editar Formula" : "Nova Formula"}</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Abas 03-05 serao implementadas em fases futuras.</DialogDescription></DialogHeader>
          </div>

          <div className="flex gap-2 px-6 py-3 border-b border-border bg-muted/20">
            {tabs.map((l, i) => (
              <button key={l} onClick={() => !disabledTabs[i] && setTabIdx(i)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${disabledTabs[i] ? "text-muted-foreground/30 cursor-not-allowed" : tabIdx === i ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{l}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5" ref={scrollRef}>
            <div className={tabIdx === 0 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Identificacao</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome da Formula</Label><Input className="h-10 rounded-xl" value={form.nome} onChange={(e) => setF("nome", e.target.value)} placeholder="Ex: Detergente Lavanda 500ml" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produto Vinculado</Label>
                      <Select value={form.productId} onValueChange={(v) => v !== null && setF("productId", v)}>
                        <SelectTrigger className="h-10 rounded-xl w-full">
                          <span className={`flex-1 text-left truncate ${!form.productId ? "text-muted-foreground" : "text-foreground"}`}>
                            {selectedProduct?.nome || "Selecionar produto"}
                          </span>
                        </SelectTrigger>
                        <SelectContent className="min-w-[260px]">
                          {(productsList ?? []).map((p: any) => <SelectItem key={p._id} value={p._id}>{p.nome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descricao / Observacoes</Label><Input className="h-10 rounded-xl" value={form.descricao} onChange={(e) => setF("descricao", e.target.value)} placeholder="Descricao da formula" /></div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Parametros</p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rendimento Base</Label><Input className="h-10 rounded-xl text-center" type="number" value={form.rendimento || ""} onChange={(e) => setF("rendimento", Number(e.target.value) || 0)} placeholder="100" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unidade</Label><Select value={form.unidade} onValueChange={(v) => v !== null && setF("unidade", v)}><SelectTrigger className="h-10 rounded-xl w-full"><span className="flex-1 text-center">{form.unidade || "---"}</span></SelectTrigger><SelectContent>{unidOpts.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tempo Estimado</Label><Input className="h-10 rounded-xl text-center" value={form.tempoEstimado} onChange={(e) => setF("tempoEstimado", maskTime(e.target.value))} placeholder="Ex: 2:30 H" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Controle de Qualidade</Label>
                    <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                      <button onClick={() => setF("temCQ", true)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${form.temCQ ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Sim</button>
                      <button onClick={() => setF("temCQ", false)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${!form.temCQ ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Nao</button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Status</p>
                  <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                    {statusOpts.map(s => (<button key={s} onClick={() => setF("status", s)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${form.status === s ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>{s}</button>))}
                  </div>
                </div>
              </div>
            </div>

            <div className={tabIdx === 1 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Adicionar Ingrediente</p>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Insumo</Label>
                      <Select value={ingForm.insumoId} onValueChange={(v) => {
                        if (v === null) return
                        const ins = insumosList?.find((i: any) => i._id === v)
                        setIngForm({ ...ingForm, insumoId: v, varianteId: "", unidade: ins?.unidadeUso || ins?.unidadeCompra || "" })
                      }}>
                        <SelectTrigger className="h-10 rounded-xl w-full">
                          <span className={`flex-1 text-left truncate ${!ingForm.insumoId ? "text-muted-foreground" : "text-foreground"}`}>
                            {ingForm.insumoId ? (insumosList?.find((i: any) => i._id === ingForm.insumoId)?.nome || "Selecionar") : "Selecionar insumo"}
                          </span>
                        </SelectTrigger>
                        <SelectContent className="min-w-[220px]">{(insumosList ?? []).map((i: any) => <SelectItem key={i._id} value={i._id}>{i.nome}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    {selectedInsumo?.temVariantes && (
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Variante</Label>
                        <Select value={ingForm.varianteId} onValueChange={(v) => v !== null && setIngForm({ ...ingForm, varianteId: v })}>
                          <SelectTrigger className="h-10 rounded-xl w-full">
                            <span className={`flex-1 text-left truncate ${!ingForm.varianteId ? "text-muted-foreground" : "text-foreground"}`}>
                              {ingForm.varianteId ? (variants?.find((v: any) => v._id === ingForm.varianteId)?.nome || "Selecionar") : "Selecionar variante"}
                            </span>
                          </SelectTrigger>
                          <SelectContent>{(variants ?? []).map((v: any) => <SelectItem key={v._id} value={v._id}>{v.nome}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-1.5" style={{ width: selectedInsumo?.temVariantes ? "180px" : "240px" }}>
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantidade</Label>
                      <div className="flex gap-2">
                        <Input className="h-10 rounded-xl flex-1 font-mono text-right" value={ingForm.quantidade} onChange={(e) => {
                          const isMetric = ingForm.unidade !== "" && ingForm.unidade !== "un"
                          setIngForm({ ...ingForm, quantidade: maskDecimal(e.target.value, isMetric) })
                        }} onKeyDown={(e) => { if (e.key === "Enter") handleAddIng() }} placeholder={ingForm.unidade !== "" && ingForm.unidade !== "un" ? "0,000" : "0"} />
                        <span className="h-10 flex items-center text-sm text-muted-foreground font-medium shrink-0 w-8">{ingForm.unidade || "---"}</span>
                        <Button size="sm" className="rounded-xl shadow-primary-btn h-10 px-3 shrink-0" onClick={handleAddIng}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Ingredientes da Formula
                    <span className="text-muted-foreground font-normal normal-case ml-1">({editId ? (ingredientsQuery?.length ?? 0) : localIngredients.length} itens)</span>
                  </p>
                  {(() => {
                    const items = editId ? (ingredientsQuery ?? []) : localIngredients
                    if (items.length === 0) return <p className="text-sm text-muted-foreground py-4 text-center">Nenhum ingrediente adicionado.</p>
                    const totalQtd = items.reduce((sum: number, x: any) => sum + (x.quantidade || 0), 0) || 1
                    return (
                      <div className="divide-y divide-border">
                        {items.map((ing: any, idx: number) => {
                          const ins = insumosList?.find((i: any) => i._id === ing.insumoId)
                          const vrt = ing.varianteId ? variants?.find((v: any) => v._id === ing.varianteId) : null
                          const pct = ((ing.quantidade || 0) / totalQtd * 100).toFixed(1)
                          return (
                            <div key={ing._id || ing._localId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                              <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{ins?.nome || "—"}{vrt ? ` — ${vrt.nome}` : ""}</p>
                              </div>
                              <span className="text-sm font-medium text-foreground shrink-0 w-20 text-right">{ing.quantidade} {ing.unidade || ins?.unidadeUso || ""}</span>
                              <span className="text-xs text-muted-foreground shrink-0 w-12 text-right">{pct}%</span>
                              <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">R$ —</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive shrink-0"
                                onClick={() => {
                                  if (editId && ing._id) {
                                    setConfirmMsg("Remover este ingrediente?"); setConfirmAction(() => async () => { try { await removeIngredient({ ingredientId: ing._id }) } catch {} }); setConfirmOpen(true)
                                  } else {
                                    setLocalIngredients(localIngredients.filter((x: any) => x._localId !== ing._localId))
                                  }
                                }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            <div className={tabIdx >= 2 ? "block" : "hidden"}>
              <div className="py-16 text-center text-sm text-muted-foreground">{tabIdx === 2 ? "Custos" : tabIdx === 3 ? "Controle de Qualidade" : "Historico de Versoes"} — Em breve</div>
            </div>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Salvando..." : editId ? "Salvar" : "Cadastrar"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
