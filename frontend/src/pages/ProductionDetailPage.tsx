import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, Factory, Clock, Play, CheckCircle2, Ban, Check, XIcon, Pencil } from "lucide-react"
import { toast } from "sonner"

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  "Planejada": { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock className="h-3 w-3" />, label: "Planejada" },
  "Em andamento": { bg: "bg-blue-100", text: "text-blue-700", icon: <Play className="h-3 w-3" />, label: "Em andamento" },
  "Concluida": { bg: "bg-emerald-100", text: "text-emerald-700", icon: <CheckCircle2 className="h-3 w-3" />, label: "Concluida" },
  "Cancelada": { bg: "bg-red-100", text: "text-red-700", icon: <Ban className="h-3 w-3" />, label: "Cancelada" },
}

export default function ProductionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const orderId = id as any

  const order = useQuery(api.production.get, { orderId })
  const items = useQuery(api.production.getItems, { orderId })
  const logs = useQuery(api.production.getLogs, { orderId })
  const products = useQuery(api.products.list, {})
  const insumosList = useQuery(api.insumos.list, {})

  const startExecution = useMutation(api.production.startExecution)
  const updateChecklist = useMutation(api.production.updateChecklist)
  const completeProduction = useMutation(api.production.completeProduction)
  const cancelOrder = useMutation(api.production.cancelOrder)
  const releaseQuarentena = useMutation(api.production.releaseQuarentena)
  const discardQuarentena = useMutation(api.production.discardQuarentena)
  const reprocessLot = useMutation(api.production.reprocessLot)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelMotivo, setCancelMotivo] = useState("")
  const [completeOpen, setCompleteOpen] = useState(false)
  const [completeForm, setCompleteForm] = useState({ quantidadeProduzida: 0, dataValidade: "", observacoes: "", cqAprovado: true })
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ title: string; description: string; onConfirm: () => void; destructive?: boolean; closeComplete?: boolean } | null>(null)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editQtd, setEditQtd] = useState(0)
  const [editJustificativa, setEditJustificativa] = useState("")
  const [discardOpen, setDiscardOpen] = useState<string | null>(null)
  const [discardMotivo, setDiscardMotivo] = useState("")

  const handleRelease = (logId: string) => { showConfirm("Liberar Lote", "Liberar este lote da quarentena? Ele ficara disponivel para venda.", async () => { setSaving(true); try { await releaseQuarentena({ logId: logId as any }); toast.success("Lote liberado!") } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }) }
  const handleDiscard = () => { if (!discardOpen || !discardMotivo) return; showConfirm("Descartar Lote", `Descartar permanentemente? Motivo: ${discardMotivo}`, async () => { setSaving(true); try { await discardQuarentena({ logId: discardOpen as any, motivo: discardMotivo }); toast.success("Lote descartado"); setDiscardOpen(null) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }, true) }
  const handleReprocess = (logId: string) => { showConfirm("Reprocessar Lote", "Criar uma nova Ordem de Producao para reprocessar este lote?", async () => { setSaving(true); try { const r = await reprocessLot({ logId: logId as any }); toast.success(`Nova OP criada: ${r.numero}`) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }) }

  const showConfirm = (title: string, description: string, onConfirm: () => void, destructive?: boolean, closeComplete?: boolean) => {
    setConfirmData({ title, description, onConfirm, destructive, closeComplete })
    setConfirmOpen(true)
  }

  if (order === undefined || items === undefined) return <div className="p-12 text-center text-sm text-muted-foreground">Carregando...</div>
  if (order === null) return <div className="p-12 text-center text-sm text-muted-foreground">Ordem nao encontrada.</div>

  const cfg = statusConfig[order.status] || statusConfig["Planejada"]
  const prod = products?.find((p: any) => p._id === order.productId)
  const podeIniciar = order.status === "Planejada"
  const podeConcluir = order.status === "Em andamento"
  const podeCancelar = order.status !== "Concluida" && order.status !== "Cancelada"

  const handleStart = () => {
    showConfirm("Iniciar Producao", `Deseja iniciar a producao da ordem ${order.numero}? O estoque das variantes permanecera reservado.`, async () => {
      setSaving(true)
      try { await startExecution({ orderId }); toast.success("Producao iniciada!") } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    })
  }

  const handleCompleteConfirm = () => {
    if (!completeForm.quantidadeProduzida) return
    setCompleteOpen(false)
    const msg = completeForm.cqAprovado ? `Confirmar producao de ${completeForm.quantidadeProduzida} unidades? O estoque de insumos sera baixado.` : `ATENCAO: CQ reprovado. O lote entrara em QUARENTENA. Confirmar mesmo assim?`
    showConfirm(completeForm.cqAprovado ? "Concluir Producao" : "Concluir com Quarentena", msg, async () => {
      setSaving(true)
      try {
        await completeProduction({ orderId, quantidadeProduzida: completeForm.quantidadeProduzida, dataValidade: completeForm.dataValidade, observacoes: completeForm.observacoes, cqAprovado: completeForm.cqAprovado })
        toast.success(completeForm.cqAprovado ? "Producao concluida!" : "Lote enviado para quarentena")
      } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    }, !completeForm.cqAprovado, true)
  }

  const handleCancelConfirm = () => {
    if (!cancelMotivo) return
    setCancelOpen(false)
    showConfirm("Cancelar Ordem", `Cancelar ${order.numero}? As reservas de estoque serao liberadas.`, async () => {
      setSaving(true)
      try { await cancelOrder({ orderId, motivo: cancelMotivo }); toast.success("Ordem cancelada") } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    }, true, true)
  }

  const toggleCheck = async (item: any) => {
    try { await updateChecklist({ itemId: item._id, checked: !item.checked }) } catch (e: any) { toast.error(e.message) }
  }

  const openEditQtd = (item: any) => {
    setEditItemId(item._id)
    setEditQtd(item.quantidadeReal || item.quantidadePrevista)
    setEditJustificativa(item.justificativa || "")
  }

  const saveQtd = async () => {
    if (!editItemId) return
    try {
      await updateChecklist({ itemId: editItemId as any, quantidadeReal: editQtd, justificativa: editJustificativa || undefined })
      toast.success("Quantidade atualizada!")
      setEditItemId(null)
    } catch (e: any) { toast.error(e.message) }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/producao")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2"><ArrowLeft className="h-4 w-4" /> Voltar para Producao</button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Factory className="h-6 w-6" /></div>
          <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Ordem de Producao</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">{order.numero}</h1></div>
        </div>
        <Badge className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase tracking-wider border-transparent gap-1`}>{cfg.icon}{cfg.label}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {podeIniciar && <Button onClick={handleStart} disabled={saving} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm"><Play className="h-4 w-4" /> Iniciar Producao</Button>}
        {podeConcluir && <Button onClick={() => { setCompleteForm({ quantidadeProduzida: order.quantidadePlanejada, dataValidade: "", observacoes: "", cqAprovado: true }); setCompleteOpen(true) }} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm bg-success hover:bg-success/90"><CheckCircle2 className="h-4 w-4" /> Concluir Producao</Button>}
        {podeCancelar && <Button onClick={() => setCancelOpen(true)} variant="ghost" className="rounded-xl h-10 gap-2 text-sm text-destructive hover:bg-destructive/10"><Ban className="h-4 w-4" /> Cancelar</Button>}
      </div>

      {/* Progresso */}
      {order.status === "Em andamento" && items && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-muted-foreground">Progresso do Checklist</span><span className="text-xs font-bold text-foreground">{items.filter((i: any) => i.checked).length}/{items.length}</span></div>
          <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-success rounded-full transition-all duration-300" style={{ width: `${items.length > 0 ? (items.filter((i: any) => i.checked).length / items.length) * 100 : 0}%` }} /></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dados da Ordem</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Produto</span><span className="text-foreground">{prod?.nome || "—"}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Qtd Planejada</span><span className="text-foreground font-bold">{order.quantidadePlanejada}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Produzido</span><span className="text-foreground">{order.quantidadeProduzida || "—"}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Responsavel</span><span className="text-foreground">{order.responsavelNome || "—"}</span></div>
            {order.rendimento != null && <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Rendimento</span><span className="text-foreground">{order.rendimento.toFixed(0)}%</span></div>}
            {order.custoTotal != null && <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Custo Total</span><span className="text-foreground">R$ {order.custoTotal.toFixed(2)}</span></div>}
            {order.custoUnitario != null && <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Custo Unitario</span><span className="text-foreground">R$ {order.custoUnitario.toFixed(2)}</span></div>}
            {order.lote && <div className="col-span-2"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Lote</span><span className="text-foreground font-mono font-bold">{order.lote}</span></div>}
          </div>
        </div>

        {logs && logs.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Lotes Gerados</p>
            <div className="divide-y divide-border">{logs.map((l: any) => (
              <div key={l._id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 text-sm">
                <span className="font-mono font-bold text-foreground">{l.lote}</span>
                <span className="text-muted-foreground">{l.quantidade} un</span>
                <Badge className={`text-[10px] ${l.status === "aprovado" ? "bg-success/15 text-success" : l.status === "quarentena" ? "bg-warning/15 text-warning" : l.status === "descartado" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>{l.status}</Badge>
              </div>
            ))}</div>

            {/* Quarentena actions */}
            {logs.some((l: any) => l.status === "quarentena") && (
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Acoes da Quarentena</p>
                {logs.filter((l: any) => l.status === "quarentena").map((l: any) => (
                  <div key={`q-${l._id}`} className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-warning/5 border border-warning/20">
                    <span className="text-sm font-bold text-warning">{l.lote}</span>
                    <span className="text-xs text-muted-foreground">{l.quantidade} un</span>
                    <div className="flex gap-1 ml-auto">
                      <Button size="sm" onClick={() => handleRelease(l._id)} className="rounded-lg h-8 text-xs bg-success hover:bg-success/90 gap-1"><Check className="h-3 w-3" /> Liberar</Button>
                      <Button size="sm" onClick={() => handleReprocess(l._id)} variant="outline" className="rounded-lg h-8 text-xs gap-1"><Clock className="h-3 w-3" /> Reprocessar</Button>
                      <Button size="sm" onClick={() => { setDiscardOpen(l._id); setDiscardMotivo("") }} variant="ghost" className="rounded-lg h-8 text-xs text-destructive hover:bg-destructive/10 gap-1"><Ban className="h-3 w-3" /> Descartar</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checklist de Ingredientes */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Checklist de Ingredientes</p>
        <div className="divide-y divide-border">
          {(items ?? []).map((item: any) => {
            const ins = insumosList?.find((i: any) => i._id === item.insumoId)
            const isChecked = item.checked
            const isExecuting = order.status === "Em andamento"
            return (
              <div key={item._id} className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${isChecked ? "opacity-50" : ""}`}>
                <button onClick={() => isExecuting ? toggleCheck(item) : null} className={`h-6 w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? "bg-success border-success" : "border-border"} ${!isExecuting ? "cursor-default" : "cursor-pointer"}`}>
                  {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
                <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{item.ordem}.</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground truncate">{ins?.nome || "—"}</p></div>
                {isExecuting && !isChecked ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-mono font-semibold ${item.quantidadeReal && item.quantidadeReal !== item.quantidadePrevista ? "text-warning" : "text-foreground"}`}>{item.quantidadeReal || item.quantidadePrevista} {ins?.unidadeUso || "un"}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); openEditQtd(item) }}><Pencil className="h-3 w-3" /></Button>
                    {item.quantidadeReal && item.quantidadeReal !== item.quantidadePrevista && <Badge className="bg-warning/15 text-warning text-[10px] shrink-0">Ajustado</Badge>}
                  </div>
                ) : (
                  <span className={`text-sm shrink-0 ${item.quantidadeReal && item.quantidadeReal !== item.quantidadePrevista ? "text-warning font-semibold" : "text-foreground"}`}>{item.quantidadeReal || item.quantidadePrevista} {ins?.unidadeUso || "un"} {item.quantidadeReal && item.quantidadeReal !== item.quantidadePrevista && <Badge className="bg-warning/15 text-warning text-[10px] ml-1">Ajustado</Badge>}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal Cancelar */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Cancelar Ordem</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Esta acao liberara as reservas de estoque.</DialogDescription></div>
          <div className="px-6 py-5 space-y-4"><Input className="h-10 rounded-xl" value={cancelMotivo} onChange={(e) => setCancelMotivo(e.target.value)} placeholder="Motivo do cancelamento" /></div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setCancelOpen(false)}>Voltar</Button><Button onClick={handleCancelConfirm} disabled={saving || !cancelMotivo} className="rounded-xl flex-1 h-11 bg-destructive hover:bg-destructive/90 text-white"><Ban className="h-4 w-4" /> Confirmar Cancelamento</Button></div>
        </DialogContent>
      </Dialog>

      {/* Modal Concluir */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Concluir Producao</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Informe a quantidade real produzida. O estoque sera atualizado automaticamente.</DialogDescription></div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantidade Produzida *</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={completeForm.quantidadeProduzida || ""} onChange={(e) => setCompleteForm({ ...completeForm, quantidadeProduzida: Number(e.target.value) || 0 })} /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Validade</Label><Input className="h-10 rounded-xl" type="date" value={completeForm.dataValidade} onChange={(e) => setCompleteForm({ ...completeForm, dataValidade: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacoes</Label><Input className="h-10 rounded-xl" value={completeForm.observacoes} onChange={(e) => setCompleteForm({ ...completeForm, observacoes: e.target.value })} /></div>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${completeForm.cqAprovado ? "bg-success border-success" : "border-border"}`} onClick={() => setCompleteForm({ ...completeForm, cqAprovado: !completeForm.cqAprovado })}>{completeForm.cqAprovado && <Check className="h-3 w-3 text-white" />}</div>
              <span className="text-sm text-foreground">Aprovado no Controle de Qualidade</span>
            </label>
            {!completeForm.cqAprovado && <p className="text-xs text-destructive">O lote sera enviado para quarentena.</p>}
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setCompleteOpen(false)}>Cancelar</Button><Button onClick={handleCompleteConfirm} disabled={saving || !completeForm.quantidadeProduzida} className="rounded-xl flex-1 h-11 shadow-primary-btn bg-success hover:bg-success/90 gap-2"><CheckCircle2 className="h-4 w-4" /> {saving ? "Concluindo..." : "Confirmar Conclusao"}</Button></div>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmacao (SystemDesign.md §5) */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className={`${confirmData?.destructive ? "bg-destructive" : "bg-primary"} px-6 pt-6 pb-4 relative`}>
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setConfirmOpen(false)}><XIcon className="h-4 w-4" /></DialogClose>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">{confirmData?.title || "Confirmar Acao"}</DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-1">{confirmData?.description || "Deseja prosseguir?"}</DialogDescription>
          </div>
          <div className="px-6 py-5"><p className="text-sm text-muted-foreground">{confirmData?.destructive ? "Esta acao nao pode ser desfeita." : "Confirme para prosseguir com a operacao."}</p></div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={() => { if (confirmData) { setConfirmOpen(false); if (confirmData.closeComplete) setCompleteOpen(false); confirmData.onConfirm() } }} disabled={saving} className={`rounded-xl flex-1 h-11 shadow-primary-btn gap-2 ${confirmData?.destructive ? "bg-destructive hover:bg-destructive/90" : ""}`}>{saving ? "Processando..." : "Confirmar"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Quantidade */}
      <Dialog open={!!editItemId} onOpenChange={(v) => { if (!v) setEditItemId(null) }}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setEditItemId(null)}><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Ajustar Quantidade</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Registre a quantidade real utilizada desta variante.</DialogDescription></div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantidade Real</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={editQtd || ""} onChange={(e) => setEditQtd(Number(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Justificativa {editQtd !== 0 && <span className="text-warning">(obrigatoria se diferente)</span>}</Label><Input className="h-10 rounded-xl" value={editJustificativa} onChange={(e) => setEditJustificativa(e.target.value)} placeholder="Ex: Perda por evaporacao" /></div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setEditItemId(null)}>Cancelar</Button><Button onClick={saveQtd} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Salvando..." : "Salvar"}</Button></div>
        </DialogContent>
      </Dialog>

      {/* Modal Descartar */}
      <Dialog open={!!discardOpen} onOpenChange={(v) => { if (!v) setDiscardOpen(null) }}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-destructive px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setDiscardOpen(null)}><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Descartar Lote</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Esta acao e permanente e registrara perda no estoque.</DialogDescription></div>
          <div className="px-6 py-5 space-y-4"><div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Motivo do Descarte *</Label><Input className="h-10 rounded-xl" value={discardMotivo} onChange={(e) => setDiscardMotivo(e.target.value)} placeholder="Ex: Contaminacao, fora da especificacao" /></div></div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setDiscardOpen(null)}>Cancelar</Button><Button onClick={handleDiscard} disabled={saving || !discardMotivo} className="rounded-xl flex-1 h-11 bg-destructive hover:bg-destructive/90 text-white"><Ban className="h-4 w-4" /> Confirmar Descarte</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
