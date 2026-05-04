import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, ShoppingCart, Store, Factory, Truck, PackageCheck, Clock, AlertTriangle, Ban, Undo2, DollarSign, MapPin, Check, XIcon, History } from "lucide-react"
import { toast } from "sonner"

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  "Rascunho": { bg: "bg-gray-100", text: "text-gray-600", icon: <Clock className="h-3 w-3" />, label: "Rascunho" },
  "Pedida": { bg: "bg-yellow-100", text: "text-yellow-700", icon: <ShoppingCart className="h-3 w-3" />, label: "Pedida" },
  "Aguardando Pagamento": { bg: "bg-orange-100", text: "text-orange-700", icon: <Clock className="h-3 w-3" />, label: "Aguardando Pagamento" },
  "Em transito": { bg: "bg-blue-100", text: "text-blue-700", icon: <Truck className="h-3 w-3" />, label: "Em transito" },
  "Recebida": { bg: "bg-emerald-100", text: "text-emerald-700", icon: <PackageCheck className="h-3 w-3" />, label: "Recebida" },
  "Recebida parcialmente": { bg: "bg-amber-100", text: "text-amber-700", icon: <AlertTriangle className="h-3 w-3" />, label: "Recebida Parcial" },
  "Cancelada": { bg: "bg-red-100", text: "text-red-700", icon: <Ban className="h-3 w-3" />, label: "Cancelada" },
  "Devolvida": { bg: "bg-rose-100", text: "text-rose-700", icon: <Undo2 className="h-3 w-3" />, label: "Devolvida" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig["Rascunho"]
  return <Badge className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase tracking-wider border-transparent gap-1`}>{cfg.icon}{cfg.label}</Badge>
}

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const purchaseId = id as any

  const purchase = useQuery(api.purchases.get, { purchaseId })
  const items = useQuery(api.purchases.listItems, { purchaseId })
  const history = useQuery(api.purchases.getHistory, { purchaseId })
  const returns = useQuery(api.purchases.getReturns, { purchaseId })
  const contas = useQuery(api.purchases.getContasByPurchase, { purchaseId })
  const suppliers = useQuery(api.suppliers.list, {})
  const insumosList = useQuery(api.insumos.list, {})

  const confirmPayment = useMutation(api.purchases.confirmPayment)
  const setTracking = useMutation(api.purchases.setTracking)
  const cancelPurchase = useMutation(api.purchases.cancelPurchase)

  const [payOpen, setPayOpen] = useState(false)
  const [trackOpen, setTrackOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [payData, setPayData] = useState({ dataPagamento: Date.now(), observacao: "" })
  const [trackCode, setTrackCode] = useState("")
  const [cancelMotivo, setCancelMotivo] = useState("")
  const [saving, setSaving] = useState(false)

  if (purchase === undefined || items === undefined) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Carregando...</div>
  }
  if (purchase === null) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Compra nao encontrada.</div>
  }

  const fornecedor = suppliers?.find((f: any) => f._id === purchase.fornecedorId)
  const recebidoCount = items?.filter((i: any) => i.statusRecebimento === "recebido").length || 0
  const totalItems = items?.length || 0
  const status = purchase.status

  const handleConfirmPayment = async () => {
    setSaving(true)
    try {
      await confirmPayment({ purchaseId, dataPagamento: payData.dataPagamento, observacao: payData.observacao })
      toast.success("Pagamento confirmado!")
      setPayOpen(false)
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleSetTracking = async () => {
    setSaving(true)
    try {
      await setTracking({ purchaseId, codigoRastreio: trackCode })
      toast.success("Rastreio registrado!")
      setTrackOpen(false)
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleCancel = async () => {
    if (!cancelMotivo) return
    setSaving(true)
    try {
      await cancelPurchase({ purchaseId, motivo: cancelMotivo })
      toast.success("Compra cancelada!")
      setCancelOpen(false)
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const canEdit = status === "Rascunho"
  const canConfirmOrder = status === "Rascunho"
  const canPay = status === "Pedida" || status === "Aguardando Pagamento"
  const canTrack = status === "Pedida" || status === "Aguardando Pagamento" || status === "Em transito"
  const canReceive = status === "Em transito" || status === "Recebida parcialmente"
  const canCancel = status !== "Recebida" && status !== "Recebida parcialmente" && status !== "Devolvida" && status !== "Cancelada"
  const canReturn = status === "Recebida" || status === "Recebida parcialmente"

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/compras")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2">
        <ArrowLeft className="h-4 w-4" /> Voltar para Compras
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Compra</h2>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{purchase.numero || "Rascunho"}</h1>
            {purchase.numeroNota && <p className="text-sm text-muted-foreground">NF: {purchase.numeroNota}</p>}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Actions by status */}
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Button onClick={() => navigate(`/compras/nova?edit=${purchase._id}`)} variant="outline" className="rounded-xl h-10 gap-2 text-sm">
            <Clock className="h-4 w-4" /> Editar Rascunho
          </Button>
        )}
        {canConfirmOrder && (
          <Button onClick={() => navigate(`/compras/nova?confirm=${purchase._id}`)} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm">
            <Check className="h-4 w-4" /> Confirmar Pedido
          </Button>
        )}
        {canPay && (
          <Button onClick={() => setPayOpen(true)} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm">
            <DollarSign className="h-4 w-4" /> Confirmar Pagamento
          </Button>
        )}
        {canTrack && (
          <Button onClick={() => setTrackOpen(true)} variant="outline" className="rounded-xl h-10 gap-2 text-sm">
            <MapPin className="h-4 w-4" /> {purchase.codigoRastreio ? "Editar Rastreio" : "Informar Rastreio"}
          </Button>
        )}
        {canReceive && (
          <Button onClick={() => navigate(`/compras/${purchase._id}/receber`)} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm bg-success hover:bg-success/90">
            <PackageCheck className="h-4 w-4" /> Receber {status === "Recebida parcialmente" ? "Pendentes" : "Compra"}
          </Button>
        )}
        {canReturn && (
          <Button onClick={() => navigate(`/compras/${purchase._id}/devolver`)} variant="outline" className="rounded-xl h-10 gap-2 text-sm text-destructive hover:bg-destructive/10">
            <Undo2 className="h-4 w-4" /> Devolver Itens
          </Button>
        )}
        {canCancel && (
          <Button onClick={() => setCancelOpen(true)} variant="ghost" className="rounded-xl h-10 gap-2 text-sm text-destructive hover:bg-destructive/10">
            <Ban className="h-4 w-4" /> Cancelar Compra
          </Button>
        )}
      </div>

      {/* Grid de info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dados da Compra</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Tipo</span>
              <span className="text-foreground font-medium flex items-center gap-1 mt-0.5">
                {purchase.tipo === "marketplace" ? <><Store className="h-3.5 w-3.5" /> Marketplace</> : purchase.tipo === "direto" ? <><Factory className="h-3.5 w-3.5" /> Direto</> : "—"}
              </span>
            </div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Data</span>
              <span className="text-foreground mt-0.5 block">{new Date(purchase.dataCompra).toLocaleDateString("pt-BR")}</span>
            </div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Fornecedor</span>
              <span className="text-foreground font-medium mt-0.5 block">{fornecedor?.pjNomeFantasia || fornecedor?.pfName || "—"}</span>
            </div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Nota / Pedido</span>
              <span className="text-foreground mt-0.5 block">{purchase.numeroNota || "—"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Financeiro</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Forma Pagamento</span>
              <span className="text-foreground mt-0.5 block">{purchase.tipoPagamento || "—"}</span>
            </div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Condicao</span>
              <span className="text-foreground mt-0.5 block">{purchase.condPagamento || "—"}</span>
            </div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Frete</span>
              <span className="text-foreground font-medium mt-0.5 block">R$ {(purchase.frete || 0).toFixed(2)} {purchase.freteGratis ? "(Gratis)" : ""}</span>
            </div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total</span>
              <span className="text-foreground font-bold text-lg mt-0.5 block">R$ {(purchase.total || 0).toFixed(2)}</span>
            </div>
            {purchase.dataPagamento && (
              <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Data Pagamento</span>
                <span className="text-foreground mt-0.5 block">{new Date(purchase.dataPagamento).toLocaleDateString("pt-BR")}</span>
              </div>
            )}
            {purchase.dataRecebimento && (
              <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Data Recebimento</span>
                <span className="text-foreground mt-0.5 block">{new Date(purchase.dataRecebimento).toLocaleDateString("pt-BR")}</span>
              </div>
            )}
            {purchase.codigoRastreio && (
              <div className="col-span-2"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Rastreio</span>
                <span className="text-foreground font-mono mt-0.5 block">{purchase.codigoRastreio}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Itens da Compra</p>
          {totalItems > 0 && <span className="text-xs text-muted-foreground">{recebidoCount}/{totalItems} recebidos</span>}
        </div>
        <div className="divide-y divide-border">
          {(items ?? []).map((item: any, idx: number) => {
            const ins = insumosList?.find((x: any) => x._id === item.insumoId)
            return (
              <div key={item._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{ins?.nome || "Insumo"}{item.varianteId ? " — variante" : ""}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Pedido: {item.quantidade} {item.unidade || "un"}{" "}
                    {item.quantidadeRecebida !== undefined && item.quantidadeRecebida > 0 && <span className="text-success">| Recebido: {item.quantidadeRecebida} {item.unidade || "un"}</span>}
                  </p>
                </div>
                <span className="text-sm text-foreground shrink-0 w-24 text-right">R$ {item.precoUnitario?.toFixed(2)}/un</span>
                <span className="text-sm font-medium text-foreground shrink-0 w-24 text-right">R$ {item.subtotal?.toFixed(2)}</span>
                <div className="w-24 flex justify-end">
                  {item.statusRecebimento === "recebido" && <StatusBadge status="Recebida" />}
                  {item.statusRecebimento === "devolvido" && <StatusBadge status="Devolvida" />}
                  {item.statusRecebimento === "pendente" && <span className="text-[10px] text-muted-foreground">Pendente</span>}
                  {!item.statusRecebimento && <span className="text-[10px] text-muted-foreground">—</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contas a Pagar */}
      {contas && contas.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Contas a Pagar</p>
          <div className="divide-y divide-border">
            {contas.map((c: any) => (
              <div key={c._id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 text-sm">
                <span className="text-foreground flex-1">{c.descricao} {c.parcela && `(${c.parcela})`}</span>
                <span className="text-muted-foreground">{new Date(c.dataVencimento).toLocaleDateString("pt-BR")}</span>
                <span className="font-semibold text-foreground">R$ {c.valor.toFixed(2)}</span>
                <Badge className={`text-[10px] font-bold uppercase tracking-wider border-transparent ${c.status === "Paga" ? "bg-emerald-100 text-emerald-700" : c.status === "Cancelada" ? "bg-red-100 text-red-700" : "bg-warning/15 text-warning"}`}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Historico de Status</p>
        </div>
        {!history || history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhum historico registrado.</p>
        ) : (
          <div className="space-y-0 relative pl-6 border-l-2 border-muted">
            {history.map((h: any, idx: number) => (
              <div key={h._id} className={`relative pb-4 ${idx === history.length - 1 ? "" : ""}`}>
                <div className={`absolute -left-[25px] top-1 h-3 w-3 rounded-full border-2 ${idx === 0 ? "bg-primary border-primary" : "bg-white border-primary"}`} />
                <p className="text-sm font-semibold text-foreground">
                  {h.statusAnterior ? `${h.statusAnterior} → ` : ""}{h.statusNovo}
                  {h.automatico && <span className="text-[10px] text-muted-foreground ml-1">(automatico)</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(h.data).toLocaleDateString("pt-BR")} {new Date(h.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} — {h.usuarioNome}
                </p>
                {h.observacao && <p className="text-xs text-muted-foreground/70 mt-0.5 italic">{h.observacao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Devolucoes */}
      {returns && returns.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Devolucoes Registradas</p>
          <div className="divide-y divide-border">
            {returns.map((d: any) => (
              <div key={d._id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 text-sm">
                <span className="text-foreground flex-1">{d.varianteNome || "Item"} — Qtd: {d.quantidade}</span>
                <Badge className="bg-muted text-muted-foreground text-[10px]">{d.motivo}</Badge>
                <Badge className="bg-primary/10 text-primary text-[10px]">{d.resolucao}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Confirmar Pagamento */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-[440px] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">Confirmar Pagamento</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Confirme o pagamento da compra {purchase.numero || "em rascunho"}</DialogDescription></DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Fornecedor</span><span className="text-foreground font-medium">{fornecedor?.pjNomeFantasia || fornecedor?.pfName || "—"}</span></div>
              <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Valor Total</span><span className="text-foreground font-bold">R$ {(purchase.total || 0).toFixed(2)}</span></div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data do Pagamento *</Label>
              <Input className="h-10 rounded-xl" type="date" value={new Date(payData.dataPagamento).toISOString().slice(0, 10)} onChange={(e) => setPayData({ ...payData, dataPagamento: new Date(e.target.value).getTime() })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacao (opcional)</Label>
              <Textarea className="rounded-xl text-sm" value={payData.observacao} onChange={(e) => setPayData({ ...payData, observacao: e.target.value })} placeholder="Ex: Pago via app do banco" rows={2} />
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setPayOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirmPayment} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn gap-2"><DollarSign className="h-4 w-4" /> {saving ? "Confirmando..." : "Confirmar Pagamento"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Rastreio */}
      <Dialog open={trackOpen} onOpenChange={setTrackOpen}>
        <DialogContent className="sm:max-w-[400px] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">Codigo de Rastreio</DialogTitle></DialogHeader>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Codigo</Label>
              <Input className="h-10 rounded-xl" value={trackCode} onChange={(e) => setTrackCode(e.target.value)} placeholder="BR1234567890" />
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setTrackOpen(false)}>Cancelar</Button>
            <Button onClick={handleSetTracking} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Salvando..." : "Salvar"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Cancelar */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-[440px] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">Cancelar Compra</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Esta acao nao pode ser desfeita.</DialogDescription></DialogHeader>
          </div>
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-foreground">Voce esta cancelando a compra <strong>{purchase.numero || "em rascunho"}</strong>.</p>
            {status !== "Rascunho" && <p className="text-sm text-warning">Contas a pagar vinculadas serao estornadas automaticamente.</p>}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Motivo do Cancelamento *</Label>
              <Textarea className="rounded-xl text-sm" value={cancelMotivo} onChange={(e) => setCancelMotivo(e.target.value)} placeholder="Informe o motivo..." rows={3} />
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setCancelOpen(false)}>Voltar</Button>
            <Button onClick={handleCancel} disabled={saving || !cancelMotivo} className="rounded-xl flex-1 h-11 bg-destructive hover:bg-destructive/90 text-white gap-2"><Ban className="h-4 w-4" /> {saving ? "Cancelando..." : "Confirmar Cancelamento"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
