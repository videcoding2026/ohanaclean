import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, Tag, Plus, Trash2, Percent, DollarSign, XIcon, ArrowRight, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function PriceTableDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id
  const tableId = isNew ? null : (id as any)

  const [tab, setTab] = useState(0)
  const [form, setForm] = useState({ nome: "", descricao: "", baseTableId: "", baseAdjustment: 0, validFrom: 0, validTo: 0, discountMax: 0, marginMin: 0, tipoCliente: "", status: "Ativa" as "Ativa" | "Inativa" })
  const [saving, setSaving] = useState(false)
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustForm, setAdjustForm] = useState({ tipo: "percentual" as "percentual" | "fixo", valor: 0, motivo: "" })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ title: string; desc: string; onConfirm: () => void; destructive?: boolean } | null>(null)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successData, setSuccessData] = useState({ title: "", description: "" })

  const table = useQuery(api.pricetables.get, tableId ? { tableId } : "skip")
  const items = useQuery(api.pricetables.getItems, tableId ? { tableId } : "skip")
  const clients = useQuery(api.pricetables.getClients, tableId ? { tableId } : "skip")
  const history = useQuery(api.pricetables.getHistory, tableId ? { tableId } : "skip")

  const allTables = useQuery(api.pricetables.list)
  const allClients = useQuery(api.clients.list, {})
  const products = useQuery(api.products.list, {})
  const packagingsLookup = useQuery(api.products.listPackagings, {})

  const createTable = useMutation(api.pricetables.create)
  const updateTable = useMutation(api.pricetables.update)
  const addItem = useMutation(api.pricetables.addItem)
  const removeItem = useMutation(api.pricetables.removeItem)
  const assignClient = useMutation(api.pricetables.assignClient)
  const removeClient = useMutation(api.pricetables.removeClient)
  const batchAdjust = useMutation(api.pricetables.batchAdjust)

  const [addProdOpen, setAddProdOpen] = useState(false)
  const [addProdForm, setAddProdForm] = useState({ productPackagingId: "", precoVenda: 0, margem: 0 })
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [addClientForm, setAddClientForm] = useState({ clientId: "" })

  useEffect(() => {
    if (table && !isNew) setForm({ nome: table.nome, descricao: table.descricao || "", baseTableId: "", baseAdjustment: 0, validFrom: table.validFrom || 0, validTo: table.validTo || 0, discountMax: table.discountMax || 0, marginMin: table.marginMin || 0, tipoCliente: table.tipoCliente || "", status: table.status })
  }, [table, isNew])

  const showConfirm = (title: string, desc: string, onConfirm: () => void, destructive?: boolean) => { setConfirmData({ title, desc, onConfirm, destructive }); setConfirmOpen(true) }

  const handleSave = () => {
    if (!form.nome) { toast.error("Nome e obrigatorio"); return }
    if (isNew) {
      showConfirm("Criar Tabela", `Criar a tabela "${form.nome}"?`, async () => {
        setSaving(true)
        try {
          await createTable({ nome: form.nome, descricao: form.descricao, baseTableId: form.baseTableId ? form.baseTableId as any : undefined, baseAdjustment: form.baseAdjustment || undefined, validFrom: form.validFrom || undefined, validTo: form.validTo || undefined, discountMax: form.discountMax || undefined, marginMin: form.marginMin || undefined, tipoCliente: form.tipoCliente || undefined })
          setSuccessData({ title: "Tabela Criada!", description: `Tabela "${form.nome}" criada com sucesso.` })
          setSuccessOpen(true)
        } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
      })
    } else {
      showConfirm("Salvar Alteracoes", `Atualizar a tabela "${form.nome}"?`, async () => {
        setSaving(true)
        try {
          await updateTable({ tableId: tableId as any, nome: form.nome, descricao: form.descricao, validFrom: form.validFrom || undefined, validTo: form.validTo || undefined, discountMax: form.discountMax || undefined, marginMin: form.marginMin || undefined, status: form.status })
          setSuccessData({ title: "Tabela Atualizada!", description: `Alteracoes salvas com sucesso.` })
          setSuccessOpen(true)
        } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
      })
    }
  }

  const handleAddProd = async () => {
    if (!addProdForm.productPackagingId || !addProdForm.precoVenda) return
    setSaving(true)
    try { await addItem({ tableId: tableId as any, productPackagingId: addProdForm.productPackagingId as any, precoVenda: addProdForm.precoVenda, margem: addProdForm.margem || undefined }); setAddProdOpen(false); setSuccessData({ title: "Produto Adicionado!", description: "Produto adicionado a tabela de precos." }); setSuccessOpen(true) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
  }
  const handleAddClient = async () => { if (!addClientForm.clientId) return; setSaving(true); try { await assignClient({ tableId: tableId as any, clientId: addClientForm.clientId as any }); setAddClientOpen(false); setSuccessData({ title: "Cliente Vinculado!", description: "Cliente vinculado a tabela com sucesso." }); setSuccessOpen(true) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }
  const handleRemoveProd = (itemId: string) => { showConfirm("Remover Produto", "Remover este produto da tabela de precos?", async () => { try { await removeItem({ itemId: itemId as any }); setSuccessData({ title: "Produto Removido", description: "Produto removido da tabela." }); setSuccessOpen(true) } catch (e: any) { toast.error(e.message) } }) }
  const handleRemoveClient = (linkId: string) => { showConfirm("Desvincular Cliente", "Desvincular este cliente da tabela?", async () => { try { await removeClient({ linkId: linkId as any }); setSuccessData({ title: "Cliente Desvinculado", description: "Cliente desvinculado da tabela." }); setSuccessOpen(true) } catch (e: any) { toast.error(e.message) } }) }
  const handleBatchAdjust = () => { if (!adjustForm.valor) return; setAdjustOpen(false); showConfirm("Reajustar Precos", `Aplicar ${adjustForm.tipo === "percentual" ? `${adjustForm.valor}%` : `R$ ${adjustForm.valor}`} em todos os precos da tabela?`, async () => { setSaving(true); try { await batchAdjust({ tableId: tableId as any, tipo: adjustForm.tipo, valor: adjustForm.valor, motivo: adjustForm.motivo || undefined }); setSuccessData({ title: "Reajuste Aplicado!", description: "Reajuste aplicado em todos os precos da tabela." }); setSuccessOpen(true) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }) }

  const setF = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const getPkgName = (id: string) => { const p = packagingsLookup?.find((x: any) => x._id === id); const prod = products?.find((p: any) => p._id === p?.productId); return `${prod?.nome || "?"} — ${p?.nome || "?"}` }

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => navigate("/precos")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2"><ArrowLeft className="h-4 w-4" /> Voltar para Tabelas</button>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Tag className="h-6 w-6" /></div>
          <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Tabela de Preco</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">{isNew ? "Nova Tabela" : table?.nome}</h1></div>
        </div>
        {!isNew && <Badge className={`text-[10px] font-bold uppercase tracking-wider border-transparent ${table?.status === "Ativa" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{table?.status}</Badge>}
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
        {["Dados", "Precos", "Clientes", "Historico"].map((l, i) => (
          <button key={l} onClick={() => setTab(i)} className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all ${tab === i ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{l}</button>
        ))}
      </div>

      {/* Tab 0: Dados */}
      <div className={tab === 0 ? "block" : "hidden"}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dados da Tabela</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome *</Label><Input className="h-10 rounded-xl" value={form.nome} onChange={(e) => setF("nome", e.target.value)} placeholder="Ex: Varejo Padrao" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo Cliente</Label><Select value={form.tipoCliente} onValueChange={(v) => v !== null && setF("tipoCliente", v)}><SelectTrigger className="h-10 rounded-xl"><span className={`flex-1 text-left truncate ${!form.tipoCliente ? "text-muted-foreground" : "text-foreground"}`}>{form.tipoCliente || "Geral"}</span></SelectTrigger><SelectContent><SelectItem value="">Geral</SelectItem><SelectItem value="Varejo">Varejo</SelectItem><SelectItem value="Atacado">Atacado</SelectItem><SelectItem value="Distribuidor">Distribuidor</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Desconto Max</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={form.discountMax || ""} onChange={(e) => setF("discountMax", Number(e.target.value))} placeholder="%" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Margem Min</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={form.marginMin || ""} onChange={(e) => setF("marginMin", Number(e.target.value))} placeholder="%" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vigencia Inicio</Label><Input className="h-10 rounded-xl" type="date" value={form.validFrom ? new Date(form.validFrom).toISOString().slice(0, 10) : ""} onChange={(e) => setF("validFrom", e.target.value ? new Date(e.target.value).getTime() : 0)} /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vigencia Fim</Label><Input className="h-10 rounded-xl" type="date" value={form.validTo ? new Date(form.validTo).toISOString().slice(0, 10) : ""} onChange={(e) => setF("validTo", e.target.value ? new Date(e.target.value).getTime() : 0)} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descricao</Label><Input className="h-10 rounded-xl" value={form.descricao} onChange={(e) => setF("descricao", e.target.value)} /></div>
          {isNew && (
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Basear em Tabela Existente</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tabela Base</Label><Select value={form.baseTableId} onValueChange={(v) => v !== null && setF("baseTableId", v)}><SelectTrigger className="h-10 rounded-xl"><span className="flex-1 text-left truncate text-muted-foreground">{form.baseTableId ? allTables?.find((t: any) => t._id === form.baseTableId)?.nome || "Selecionar" : "Nenhuma"}</span></SelectTrigger><SelectContent>{(allTables ?? []).map((t: any) => <SelectItem key={t._id} value={t._id}>{t.nome}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ajuste %</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={form.baseAdjustment || ""} onChange={(e) => setF("baseAdjustment", Number(e.target.value))} placeholder="Ex: -10 para 10% desconto" /></div>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4"><Button className="rounded-xl h-11 shadow-primary-btn flex-1" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : isNew ? "Criar Tabela" : "Salvar Alteracoes"}</Button></div>
        </div>
      </div>

      {/* Tab 1: Precos */}
      <div className={tab === 1 && !isNew ? "block" : "hidden"}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Precos por Produto <span className="text-muted-foreground font-normal normal-case">({items?.length || 0})</span></p>
            <div className="flex gap-2"><Button size="sm" onClick={() => setAdjustOpen(true)} variant="outline" className="rounded-xl h-9 gap-1 text-xs"><Percent className="h-3 w-3" /> Reajuste em Lote</Button><Button size="sm" onClick={() => { setAddProdForm({ productPackagingId: "", precoVenda: 0, margem: 0 }); setAddProdOpen(true) }} className="rounded-xl h-9 shadow-primary-btn gap-1 text-xs"><Plus className="h-3 w-3" /> Adicionar</Button></div>
          </div>
          {(items ?? []).length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">Nenhum produto cadastrado nesta tabela.</p> : (
            <Table><TableHeader className="bg-[#F0F2FF]"><TableRow><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Produto / Embalagem</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Preco Venda</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Margem %</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Custo Emb.</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold w-16" /></TableRow></TableHeader>
              <TableBody>{(items ?? []).map((i: any) => (
                <TableRow key={i._id}><TableCell className="text-sm">{getPkgName(i.productPackagingId)}</TableCell><TableCell className="text-sm font-semibold text-right">R$ {i.precoVenda.toFixed(2)}</TableCell><TableCell className="text-sm text-right">{i.margem || "—"}%</TableCell><TableCell className="text-sm text-right text-muted-foreground">R$ {(i.custoUnitario || 0).toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => handleRemoveProd(i._id)}><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>
              ))}</TableBody></Table>
          )}
        </div>
      </div>

      {/* Tab 2: Clientes */}
      <div className={tab === 2 && !isNew ? "block" : "hidden"}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center"><p className="text-[10px] font-black uppercase tracking-widest text-primary">Clientes Vinculados <span className="text-muted-foreground font-normal normal-case">({clients?.length || 0})</span></p><Button size="sm" onClick={() => { setAddClientForm({ clientId: "" }); setAddClientOpen(true) }} className="rounded-xl h-9 shadow-primary-btn gap-1 text-xs"><Plus className="h-3 w-3" /> Vincular</Button></div>
          {(clients ?? []).length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">Nenhum cliente vinculado.</p> : (
            <div className="divide-y divide-border">{(clients ?? []).map((c: any) => { const cl = allClients?.find((x: any) => x._id === c.clientId); return <div key={c._id} className="flex items-center gap-3 py-2"><span className="text-sm font-medium text-foreground flex-1">{cl?.pfName || cl?.pjNomeFantasia || cl?.pjRazaoSocial || cl?.telefone}</span><Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => handleRemoveClient(c._id)}><Trash2 className="h-3 w-3" /></Button></div> })}</div>
          )}
        </div>
      </div>

      {/* Tab 3: Historico */}
      <div className={tab === 3 && !isNew ? "block" : "hidden"}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Historico de Precos</p>
          {(history ?? []).length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma alteracao registrada.</p> : (
            <div className="divide-y divide-border">{(history ?? []).map((h: any) => (
              <div key={h._id} className="flex items-center gap-3 py-2 text-sm">
                <span className="text-xs text-muted-foreground shrink-0">{new Date(h._creationTime).toLocaleDateString("pt-BR")}</span>
                <span className="text-muted-foreground shrink-0 text-xs">{getPkgName(h.productPackagingId)}</span>
                <span className="font-mono shrink-0">R$ {h.precoAnterior?.toFixed(2)} <ArrowRight className="h-3 w-3 inline" /> R$ {h.precoNovo.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground truncate flex-1">{h.motivo || ""}</span>
                <span className="text-xs text-muted-foreground/50">{h.userName}</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addProdOpen} onOpenChange={setAddProdOpen}><DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
        <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Adicionar Produto</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Selecione a embalagem e o preco de venda.</DialogDescription></div>
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Embalagem *</Label><Select value={addProdForm.productPackagingId} onValueChange={(v) => v !== null && setAddProdForm({ ...addProdForm, productPackagingId: v })}><SelectTrigger className="h-10 rounded-xl"><span className="flex-1 text-left truncate text-muted-foreground">{addProdForm.productPackagingId ? getPkgName(addProdForm.productPackagingId) : "Selecionar embalagem"}</span></SelectTrigger><SelectContent className="max-h-60">{(packagingsLookup ?? []).map((p: any) => <SelectItem key={p._id} value={p._id}>{getPkgName(p._id)}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preco Venda R$ *</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={addProdForm.precoVenda || ""} onChange={(e) => setAddProdForm({ ...addProdForm, precoVenda: Number(e.target.value) || 0 })} /></div>
          <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Margem %</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={addProdForm.margem || ""} onChange={(e) => setAddProdForm({ ...addProdForm, margem: Number(e.target.value) || 0 })} /></div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setAddProdOpen(false)}>Cancelar</Button><Button onClick={handleAddProd} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">Adicionar</Button></div>
      </DialogContent></Dialog>

      {/* Add Client Dialog */}
      <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}><DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
        <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Vincular Cliente</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Selecione o cliente para esta tabela de precos.</DialogDescription></div>
        <div className="px-6 py-5"><Select value={addClientForm.clientId} onValueChange={(v) => v !== null && setAddClientForm({ clientId: v })}><SelectTrigger className="h-10 rounded-xl"><span className="flex-1 text-left truncate text-muted-foreground">{addClientForm.clientId ? allClients?.find((c: any) => c._id === addClientForm.clientId)?.pfName || allClients?.find((c: any) => c._id === addClientForm.clientId)?.pjNomeFantasia : "Selecionar cliente"}</span></SelectTrigger><SelectContent className="max-h-60">{(allClients ?? []).map((c: any) => <SelectItem key={c._id} value={c._id}>{c.pfName || c.pjNomeFantasia || c.pjRazaoSocial || c.telefone}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setAddClientOpen(false)}>Cancelar</Button><Button onClick={handleAddClient} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">Vincular</Button></div>
      </DialogContent></Dialog>

      {/* Batch Adjust Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}><DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
        <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Reajuste em Lote</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Aplique reajuste em todos os precos da tabela.</DialogDescription></div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2"><Button size="sm" variant={adjustForm.tipo === "percentual" ? "default" : "outline"} onClick={() => setAdjustForm({ ...adjustForm, tipo: "percentual" })} className={`rounded-xl text-xs ${adjustForm.tipo === "percentual" ? "shadow-primary-btn" : ""}`}><Percent className="h-3 w-3 mr-1" />Percentual</Button><Button size="sm" variant={adjustForm.tipo === "fixo" ? "default" : "outline"} onClick={() => setAdjustForm({ ...adjustForm, tipo: "fixo" })} className={`rounded-xl text-xs ${adjustForm.tipo === "fixo" ? "shadow-primary-btn" : ""}`}><DollarSign className="h-3 w-3 mr-1" />Valor Fixo</Button></div>
          <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{adjustForm.tipo === "percentual" ? "Percentual %" : "Valor R$"}</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={adjustForm.valor || ""} onChange={(e) => setAdjustForm({ ...adjustForm, valor: Number(e.target.value) || 0 })} placeholder={adjustForm.tipo === "percentual" ? "Ex: 5 para +5%" : "Ex: 2.50"} /></div>
          <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Motivo</Label><Input className="h-10 rounded-xl" value={adjustForm.motivo} onChange={(e) => setAdjustForm({ ...adjustForm, motivo: e.target.value })} placeholder="Ex: Reajuste trimestral" /></div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setAdjustOpen(false)}>Cancelar</Button><Button onClick={handleBatchAdjust} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Aplicando..." : "Aplicar Reajuste"}</Button></div>
      </DialogContent></Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}><DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
        <div className={`${confirmData?.destructive ? "bg-destructive" : "bg-primary"} px-6 pt-6 pb-4 relative`}><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setConfirmOpen(false)}><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">{confirmData?.title || "Confirmar"}</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">{confirmData?.desc || ""}</DialogDescription></div>
        <div className="px-6 py-5"><p className="text-sm text-muted-foreground">{confirmData?.destructive ? "Esta acao nao pode ser desfeita." : "Confirme para prosseguir."}</p></div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button><Button onClick={() => { if (confirmData) { setConfirmOpen(false); confirmData.onConfirm() } }} disabled={saving} className={`rounded-xl flex-1 h-11 shadow-primary-btn ${confirmData?.destructive ? "bg-destructive hover:bg-destructive/90" : ""}`}>{saving ? "Processando..." : "Confirmar"}</Button></div>
      </DialogContent></Dialog>

      {/* Success Modal (SystemDesign.md §5) */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-8 pb-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-pulse"><CheckCircle className="h-8 w-8 text-white" /></div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">{successData.title}</DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-1">{successData.description}</DialogDescription>
          </div>
          <div className="px-6 pb-6 pt-2">
            <Button className="w-full rounded-xl h-11 shadow-primary-btn" onClick={() => { setSuccessOpen(false); if (isNew && successData.title.includes("Criada")) navigate("/precos") }}>Entendi</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
