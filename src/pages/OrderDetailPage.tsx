import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, ShoppingCart, FileText, Clock, CheckCircle2, Ban, Truck, PackageCheck, Play, XIcon } from "lucide-react"
import { toast } from "sonner"

const sc: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Orcamento": { bg: "bg-secondary/10", text: "text-secondary", icon: <FileText className="h-3 w-3" /> },
  "Confirmado": { bg: "bg-primary/10", text: "text-primary", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Em separacao": { bg: "bg-warning/10", text: "text-warning", icon: <Clock className="h-3 w-3" /> },
  "Aguardando retirada": { bg: "bg-blue-100", text: "text-blue-700", icon: <PackageCheck className="h-3 w-3" /> },
  "Saiu para entrega": { bg: "bg-blue-100", text: "text-blue-700", icon: <Truck className="h-3 w-3" /> },
  "Concluido": { bg: "bg-success/10", text: "text-success", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Cancelado": { bg: "bg-destructive/10", text: "text-destructive", icon: <Ban className="h-3 w-3" /> },
}

const nextStatus: Record<string, string[]> = {
  "Confirmado": ["Em separacao"],
  "Em separacao": ["Aguardando retirada", "Saiu para entrega"],
  "Aguardando retirada": ["Concluido"],
  "Saiu para entrega": ["Concluido"],
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const orderId = id as any

  const order = useQuery(api.orders.get, { orderId })
  const items = useQuery(api.orders.getItems, { orderId })
  const history = useQuery(api.orders.getHistory, { orderId })
  const contas = useQuery(api.orders.getContasReceber, { orderId })
  const clients = useQuery(api.clients.list, {})
  const updateStatus = useMutation(api.orders.updateStatus)
  const convertToPedido = useMutation(api.orders.convertToPedido)
  const cancelOrder = useMutation(api.orders.cancelOrder)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelMotivo, setCancelMotivo] = useState("")
  const [saving, setSaving] = useState(false)

  if (order === undefined) return <div className="p-12 text-center text-sm text-muted-foreground">Carregando...</div>
  if (order === null) return <div className="p-12 text-center text-sm text-muted-foreground">Pedido nao encontrado.</div>

  const cfg = sc[order.status] || sc["Confirmado"]
  const cl = clients?.find((c: any) => c._id === order.clientId)
  const isOrcamento = order.tipo === "orcamento"
  const canConvert = isOrcamento && order.status === "Confirmado"
  const canCancel = order.status !== "Concluido" && order.status !== "Cancelado"
  const statusOptions = nextStatus[order.status] || []

  const handleAdvance = async (newStatus: string) => {
    setSaving(true)
    try { await updateStatus({ orderId, status: newStatus as any }); toast.success("Status atualizado!") } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
  }
  const handleConvert = async () => { setSaving(true); try { const r = await convertToPedido({ orderId }); toast.success(`Convertido para pedido ${r.numero}`) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }
  const handleCancel = async () => { if (!cancelMotivo) return; setSaving(true); try { await cancelOrder({ orderId, motivo: cancelMotivo }); toast.success("Cancelado"); setCancelOpen(false) } catch (e: any) { toast.error(e.message) } finally { setSaving(false) } }

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/pedidos")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2"><ArrowLeft className="h-4 w-4" /> Voltar para Vendas</button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4"><div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><ShoppingCart className="h-6 w-6" /></div><div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{isOrcamento ? "Orcamento" : "Pedido"}</h2><h1 className="text-2xl font-bold tracking-tight">{order.numero}</h1></div></div>
        <Badge className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase border-transparent gap-1`}>{cfg.icon}{order.status}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {canConvert && <Button onClick={handleConvert} disabled={saving} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm"><Play className="h-4 w-4" /> Converter para Pedido</Button>}
        {statusOptions.map((s: string) => (
          <Button key={s} onClick={() => handleAdvance(s)} disabled={saving} className="rounded-xl h-10 shadow-primary-btn gap-2 text-sm">{s === "Concluido" ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}{s}</Button>
        ))}
        {canCancel && <Button onClick={() => setCancelOpen(true)} variant="ghost" className="rounded-xl h-10 gap-2 text-sm text-destructive hover:bg-destructive/10"><Ban className="h-4 w-4" /> Cancelar</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dados do {isOrcamento ? "Orcamento" : "Pedido"}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Cliente</span><span className="text-foreground">{cl?.pfName || cl?.pjNomeFantasia || "—"}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Vendedor</span><span className="text-foreground">{order.vendedorNome || "—"}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Data</span><span className="text-foreground">{new Date(order.data).toLocaleDateString("pt-BR")}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Entrega</span><span className="text-foreground">{order.modalidadeEntrega === "retirada" ? "Retirada" : "Entrega"}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Pagamento</span><span className="text-foreground">{order.formaPagamento}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Condicao</span><span className="text-foreground">{order.condPagamento || "—"}</span></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Financeiro</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Subtotal</span><span className="text-foreground">R$ {(order.subtotal || 0).toFixed(2)}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Desconto</span><span className="text-destructive">-R$ {(order.descontoGeral || 0).toFixed(2)}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Frete</span><span className="text-foreground">{order.freteGratis ? "Gratis" : `R$ ${(order.frete || 0).toFixed(2)}`}</span></div>
            <div><span className="text-[10px] font-bold text-muted-foreground uppercase block text-lg">Total</span><span className="text-foreground font-bold text-lg">R$ {(order.total || 0).toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Itens</p>
        {(items ?? []).map((i: any) => (<div key={i._id} className="flex items-center gap-3 py-2 text-sm border-b last:border-0"><span className="flex-1">{i.nome}</span><span className="font-mono shrink-0">{i.quantidade}x R$ {i.precoUnitario.toFixed(2)}</span><span className="font-semibold shrink-0">R$ {(i.precoUnitario * i.quantidade).toFixed(2)}</span></div>))}
      </div>

      {contas && contas.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Contas a Receber</p>
          {contas.map((c: any) => (<div key={c._id} className="flex items-center gap-3 text-sm"><span className="flex-1">{c.descricao} {c.parcela}</span><span className="text-muted-foreground">{new Date(c.dataVencimento).toLocaleDateString("pt-BR")}</span><span className="font-semibold">R$ {c.valor.toFixed(2)}</span><Badge className={`text-[10px] ${c.status === "Paga" ? "bg-success/15 text-success" : c.status === "Cancelada" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"}`}>{c.status}</Badge></div>))}
        </div>
      )}

      {history && history.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Historico</p>
          <div className="space-y-0 pl-6 border-l-2 border-muted">
            {history.map((h: any) => (<div key={h._id} className="relative pb-3"><div className="absolute -left-[25px] top-1 h-3 w-3 rounded-full border-2 bg-white border-primary" /><p className="text-sm font-semibold">{h.statusAnterior ? `${h.statusAnterior} → ` : ""}{h.statusNovo}</p><p className="text-xs text-muted-foreground">{new Date(h.data).toLocaleString("pt-BR")} — {h.usuarioNome}</p>{h.observacao && <p className="text-xs text-muted-foreground/70 italic">{h.observacao}</p>}</div>))}
          </div>
        </div>
      )}

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}><DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
        <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">Cancelar</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">O estoque sera devolvido e as contas canceladas.</DialogDescription></div>
        <div className="px-6 py-5"><Input className="h-10 rounded-xl" value={cancelMotivo} onChange={(e) => setCancelMotivo(e.target.value)} placeholder="Motivo do cancelamento" /></div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setCancelOpen(false)}>Voltar</Button><Button onClick={handleCancel} disabled={saving || !cancelMotivo} className="rounded-xl flex-1 h-11 bg-destructive text-white"><Ban className="h-4 w-4" /> Confirmar Cancelamento</Button></div>
      </DialogContent></Dialog>
    </div>
  )
}
