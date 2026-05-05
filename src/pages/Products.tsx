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
import { Search, Plus, Pencil, Trash2, Package, XIcon } from "lucide-react"

const catOpts = ["Lava Roupas", "Amaciante", "Detergente", "Desinfetante", "Limpa Aluminio Pasta", "Limpa Aluminio Liquido", "Outros"]
const statusOpts = ["Ativo", "Em desenvolvimento", "Inativo"]

const statusBadge = (s: string) => {
  const m: Record<string, string> = { "Ativo": "bg-success/15 text-success", "Em desenvolvimento": "bg-warning/15 text-warning", "Inativo": "bg-muted text-muted-foreground", "Ativa": "bg-success/15 text-success", "Inativa": "bg-muted text-muted-foreground" }
  return <Badge className={`${m[s] || "bg-muted"} text-[10px] font-bold uppercase tracking-wider border-transparent`}>{s}</Badge>
}

const emptyForm = () => ({
  nome: "", descricao: "", categoria: "", status: "Ativo" as const,
  modoUso: "", precaucoes: "", composicao: "", ph: "", corAspecto: "", fragrancia: "", temperaturaIdeal: "", localArmazenagem: "", validadeMedia: "",
})

const emptyPackaging = () => ({
  nome: "", volume: 0, unidadeVolume: "", tipo: "", codigoBarras: "", custoEmbalagem: 0, margem: 45, precoSugerido: 0, precoVenda: 0, status: "Ativa" as "Ativa" | "Inativa",
})

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const products = useQuery(api.products.list, { status: filterStatus || undefined })
  const create = useMutation(api.products.create)
  const update = useMutation(api.products.update)
  const remove = useMutation(api.products.remove)
  const createPackaging = useMutation(api.products.createPackaging)
  const updatePackaging = useMutation(api.products.updatePackaging)
  const removePackaging = useMutation(api.products.removePackaging)

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const packsQuery = useQuery(api.products.listPackagings, editId ? { productId: editId as any } : "skip")
  const [form, setForm] = useState(emptyForm())
  const [tabIdx, setTabIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const [valOpen, setValOpen] = useState(false)
  const [valErrors, setValErrors] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMsg, setConfirmMsg] = useState("")
  const [packOpen, setPackOpen] = useState(false)
  const [packEditId, setPackEditId] = useState<string | null>(null)
  const [packForm, setPackForm] = useState(emptyPackaging())
  const [packSaving, setPackSaving] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0 }, [tabIdx])

  const filtered = (products ?? []).filter((s: any) => {
    const t = search.toLowerCase(); const n = s.nome?.toLowerCase() ?? ""
    return !t || n.includes(t)
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
    if (!form.nome) missing.push("Nome do produto")
    if (!form.categoria) missing.push("Categoria")
    if (missing.length > 0) { setValErrors(missing); setValOpen(true); return }
    setSaving(true)
    try {
      const data: any = {}
      for (const k of Object.keys(emptyForm())) { const v = (form as any)[k]; data[k] = (typeof v === "number" && v === 0) || v === "" ? undefined : v }
      if (editId) await update({ productId: editId as any, ...data })
      else await create(data)
      setOpen(false)
    } catch (e: any) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleConfirm = () => { if (confirmAction) confirmAction(); setConfirmOpen(false) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Cadastros</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Produtos</h1>
        </div>
        <Button onClick={openCreate} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Novo Produto</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v || "")}>
            <SelectTrigger className="w-44 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos</SelectItem>{statusOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? <div className="p-12 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</div>
        : <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Produto</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Categoria</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s: any) => (
                <TableRow key={s._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => openEdit(s)}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Package className="h-4 w-4" /></div>
                      <div><p className="text-sm font-semibold text-foreground leading-none mb-0.5">{s.nome}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.categoria}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                        onClick={() => { setConfirmMsg(`Remover "${s.nome}"?`); setConfirmAction(() => async () => { try { await remove({ productId: s._id }) } catch {} }); setConfirmOpen(true) }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>}
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

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Confirmar</DialogTitle>
          </div>
          <div className="px-6 py-5"><p className="text-sm text-foreground">{confirmMsg}</p></div>
          <div className="flex gap-3 px-6 pb-5">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl flex-1 h-11 bg-destructive text-destructive-foreground" onClick={handleConfirm}>Remover</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={packOpen} onOpenChange={setPackOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0">
              <DialogTitle className="text-xl font-bold tracking-tight text-white">{packEditId ? "Editar Embalagem" : "Nova Embalagem"}</DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">Defina as propriedades da embalagem e precificacao.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome da Embalagem</Label><Input className="h-10 rounded-xl" value={packForm.nome} onChange={(e) => setPackForm({ ...packForm, nome: e.target.value })} placeholder="Ex: Frasco 500ml, Galao 2L..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Volume</Label>
                <div className="flex gap-2">
                  <Input className="h-10 rounded-xl w-20" type="number" value={packForm.volume || ""} onChange={(e) => setPackForm({ ...packForm, volume: Number(e.target.value) || 0 })} />
                  <Select value={packForm.unidadeVolume} onValueChange={(v) => v !== null && setPackForm({ ...packForm, unidadeVolume: v })}>
                    <SelectTrigger className="h-10 rounded-xl w-24"><SelectValue placeholder="Unid." /></SelectTrigger>
                    <SelectContent><SelectItem value="ml">ml</SelectItem><SelectItem value="L">L</SelectItem><SelectItem value="g">g</SelectItem><SelectItem value="kg">kg</SelectItem><SelectItem value="un">un</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo</Label>
                <Select value={packForm.tipo} onValueChange={(v) => v !== null && setPackForm({ ...packForm, tipo: v })}>
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent><SelectItem value="Frasco">Frasco</SelectItem><SelectItem value="Galao">Galao</SelectItem><SelectItem value="Balde">Balde</SelectItem><SelectItem value="Sache">Sache</SelectItem><SelectItem value="Bisnaga">Bisnaga</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Codigo de Barras / EAN</Label><Input className="h-10 rounded-xl" value={packForm.codigoBarras} onChange={(e) => setPackForm({ ...packForm, codigoBarras: e.target.value })} placeholder="Opcional" /></div>
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Precificacao</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Custo Embalagem (R$)</Label><Input className="h-10 rounded-xl" type="number" step="0.01" value={packForm.custoEmbalagem || ""} onChange={(e) => setPackForm({ ...packForm, custoEmbalagem: Number(e.target.value) || 0 })} /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Margem (%)</Label><Input className="h-10 rounded-xl" type="number" value={packForm.margem || ""} onChange={(e) => setPackForm({ ...packForm, margem: Number(e.target.value) || 0 })} placeholder="45" /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preco Sugerido (R$)</Label><Input className="h-10 rounded-xl" type="number" step="0.01" value={packForm.precoSugerido || ""} onChange={(e) => setPackForm({ ...packForm, precoSugerido: Number(e.target.value) || 0 })} /></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preco de Venda (R$)</Label><Input className="h-10 rounded-xl" type="number" step="0.01" value={packForm.precoVenda || ""} onChange={(e) => setPackForm({ ...packForm, precoVenda: Number(e.target.value) || 0 })} /></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</Label>
              <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
                <button onClick={() => setPackForm({ ...packForm, status: "Ativa" as const })} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${packForm.status === "Ativa" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Ativa</button>
                <button onClick={() => setPackForm({ ...packForm, status: "Inativa" as const })} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${packForm.status === "Inativa" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground"}`}>Inativa</button>
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setPackOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl flex-1 h-11 shadow-primary-btn" disabled={packSaving} onClick={async () => {
              if (!packForm.nome) return
              setPackSaving(true)
              try {
                if (packEditId) await updatePackaging({ packagingId: packEditId as any, ...packForm })
                else await createPackaging({ productId: editId as any, ...packForm })
                setPackOpen(false)
              } catch (e: any) { console.error(e) }
              finally { setPackSaving(false) }
            }}>{packSaving ? "Salvando..." : packEditId ? "Salvar" : "Adicionar"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">{editId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">Abas 02-04 serao detalhadas conforme avancamos.</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex gap-2 px-6 py-3 border-b border-border bg-muted/20">
            {["1. Dados Gerais", "2. Embalagens", "3. Ficha Tecnica", "4. Historico"].map((l, i) => (
              <button key={l} onClick={() => setTabIdx(i)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${i === 3 ? "text-muted-foreground/40 cursor-not-allowed" : tabIdx === i ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{l}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5" ref={scrollRef}>
            <div className={tabIdx === 0 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Identificacao</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome do Produto</Label><Input className="h-10 rounded-xl" value={form.nome} onChange={(e) => setF("nome", e.target.value)} placeholder="Ex: Sabao Liquido Lavanda" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria</Label>
                      <Select value={form.categoria} onValueChange={(v) => setF("categoria", v)}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent className="min-w-[220px]">{catOpts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descricao</Label><Input className="h-10 rounded-xl" value={form.descricao} onChange={(e) => setF("descricao", e.target.value)} placeholder="Descricao do produto" /></div>
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
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Embalagens e Precos</p>
                    <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs"
                      onClick={() => { if (!editId) return; setPackForm(emptyPackaging()); setPackEditId(null); setPackOpen(true) }}>
                      <Plus className="h-3 w-3" /> Nova Embalagem
                    </Button>
                  </div>
                  {!packsQuery || packsQuery.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma embalagem cadastrada.</p>
                  ) : (
                    <div className="space-y-2">
                      {packsQuery.map((v: any) => (
                        <div key={v._id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10 cursor-pointer hover:bg-accent/30 transition-colors"
                          onClick={() => {
                            setPackForm({
                              nome: v.nome || "", volume: v.volume || 0, unidadeVolume: v.unidadeVolume || "", tipo: v.tipo || "",
                              codigoBarras: v.codigoBarras || "", custoEmbalagem: v.custoEmbalagem || 0,
                              margem: v.margem || 45, precoSugerido: v.precoSugerido || 0, precoVenda: v.precoVenda || 0, status: v.status || "Ativa",
                            })
                            setPackEditId(v._id); setPackOpen(true)
                          }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{v.nome}</span>
                              {statusBadge(v.status)}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{v.volume ? `${v.volume} ${v.unidadeVolume || ""}` : ""} {v.tipo ? `| ${v.tipo}` : ""} {v.precoVenda ? `| R$ ${v.precoVenda.toFixed(2)}` : ""}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                            onClick={() => { setConfirmMsg("Remover esta embalagem?"); setConfirmAction(() => async () => { try { await removePackaging({ packagingId: v._id }) } catch {} }); setConfirmOpen(true) }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            <div className={tabIdx === 2 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Aplicacao</p>
                  <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Modo de Uso / Aplicacao</Label><textarea className="w-full min-h-[80px] rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.modoUso} onChange={(e) => setF("modoUso", e.target.value)} placeholder="Como usar o produto" /></div>
                  <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Precaucoes de Uso</Label><textarea className="w-full min-h-[80px] rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.precaucoes} onChange={(e) => setF("precaucoes", e.target.value)} placeholder="Cuidados e alertas" /></div>
                  <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Composicao Resumida</Label><textarea className="w-full min-h-[80px] rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.composicao} onChange={(e) => setF("composicao", e.target.value)} placeholder="Principais componentes" /></div>
                </div>
                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Especificacoes</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">pH</Label><Input className="h-10 rounded-xl" value={form.ph} onChange={(e) => setF("ph", e.target.value)} placeholder="Ex: 7.0" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cor / Aspecto</Label><Input className="h-10 rounded-xl" value={form.corAspecto} onChange={(e) => setF("corAspecto", e.target.value)} placeholder="Ex: Liquido verde" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fragrancia / Aroma</Label><Input className="h-10 rounded-xl" value={form.fragrancia} onChange={(e) => setF("fragrancia", e.target.value)} placeholder="Ex: Lavanda" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Temperatura Ideal</Label><Input className="h-10 rounded-xl" value={form.temperaturaIdeal} onChange={(e) => setF("temperaturaIdeal", e.target.value)} placeholder="Ex: Ambiente" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Local Armazenagem</Label><Input className="h-10 rounded-xl" value={form.localArmazenagem} onChange={(e) => setF("localArmazenagem", e.target.value)} placeholder="Ex: Local seco e arejado" /></div>
                    <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Validade Media</Label><Input className="h-10 rounded-xl" value={form.validadeMedia} onChange={(e) => setF("validadeMedia", e.target.value)} placeholder="Ex: 24 meses" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={tabIdx === 3 ? "block" : "hidden"}>
              <div className="py-16 text-center text-sm text-muted-foreground">Historico e Vinculos — Fase 3</div>
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
