import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, ShoppingCart, FileText, CheckCircle, XIcon, DollarSign } from "lucide-react"
import { toast } from "sonner"

export default function NewOrderPage() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<"orcamento" | "pedido">("pedido")
  const [form, setForm] = useState({ clientId: "", descontoPercentual: 0, frete: 0, freteGratis: true, condPagamento: "A vista", formaPagamento: "PIX", modalidadeEntrega: "retirada" as "retirada" | "entrega", dataPrevistaEntrega: 0, enderecoEntrega: "", observacoes: "" })
  const [items, setItems] = useState<any[]>([])
  const [ingForm, setIngForm] = useState({ productPackagingId: "", quantidade: 1 })
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ title: string; desc: string; onConfirm: () => void; destructive?: boolean } | null>(null)

  const clients = useQuery(api.clients.list, {})
  const products = useQuery(api.products.list, {})
  const packagingsLookup = useQuery(api.products.listPackagings, {})
  const clientTable = useQuery(api.orders.getClientTableForOrder, form.clientId ? { clientId: form.clientId as any } : "skip")
  const createOrder = useMutation(api.orders.create)

  const setF = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const selectedClient = clients?.find((c: any) => c._id === form.clientId)
  const selectedPkg = packagingsLookup?.find((p: any) => p._id === ingForm.productPackagingId)

  const precoItem = clientTable ? (clientTable.items?.find((i: any) => i.productPackagingId === ingForm.productPackagingId)?.precoVenda || 0) : (selectedPkg?.precoVenda || selectedPkg?.precoSugerido || 0)
  const subtotalItems = items.reduce((s: number, i: any) => s + i.subtotal, 0)
  const descValor = subtotalItems * (form.descontoPercentual / 100)
  const total = subtotalItems - descValor + (form.freteGratis ? 0 : form.frete)

  const addItem = () => {
    if (!ingForm.productPackagingId || !ingForm.quantidade || precoItem <= 0) return
    const exists = items.find((i: any) => i.productPackagingId === ingForm.productPackagingId)
    if (exists) { toast.error("Produto ja adicionado"); return }
    const prod = products?.find((p: any) => p._id === selectedPkg?.productId)
    const custo = selectedPkg?.custoEmbalagem || 0
    const margem = precoItem > 0 ? ((precoItem - custo) / precoItem * 100).toFixed(0) : "0"
    setItems([...items, { key: Date.now(), productId: selectedPkg?.productId, productPackagingId: ingForm.productPackagingId, nome: `${prod?.nome} — ${selectedPkg?.nome}`, quantidade: ingForm.quantidade, precoUnitario: precoItem, subtotal: precoItem * ingForm.quantidade, custoUnitario: custo, margem: Number(margem) }])
    setIngForm({ productPackagingId: "", quantidade: 1 })
  }

  const showConfirm = (title: string, desc: string, onConfirm: () => void, destructive?: boolean) => { setConfirmData({ title, desc, onConfirm, destructive }); setConfirmOpen(true) }

  const handleSave = () => {
    if (!form.clientId || items.length === 0) { toast.error("Selecione cliente e adicione itens"); return }
    const label = tipo === "orcamento" ? "Orcamento" : "Pedido"
    showConfirm(`Criar ${label}`, `Criar ${label.toLowerCase()} para ${selectedClient?.pfName || selectedClient?.pjNomeFantasia} no valor de R$ ${total.toFixed(2)}?`, async () => {
      setSaving(true)
      try {
        const result = await createOrder({
          tipo, clientId: form.clientId as any, data: Date.now(),
          items: items.map((i: any) => ({ productId: i.productId as any, productPackagingId: i.productPackagingId as any, nome: i.nome, quantidade: i.quantidade, precoUnitario: i.precoUnitario, subtotal: i.subtotal, custoUnitario: i.custoUnitario, margem: i.margem })),
          descontoPercentual: form.descontoPercentual || undefined, frete: form.frete || undefined, freteGratis: form.freteGratis,
          condPagamento: form.condPagamento, formaPagamento: form.formaPagamento,
          modalidadeEntrega: form.modalidadeEntrega, dataPrevistaEntrega: form.dataPrevistaEntrega || undefined,
          enderecoEntrega: form.enderecoEntrega || undefined, observacoes: form.observacoes,
        })
        toast.success(`${label} ${result.numero} criado!`)
        navigate(`/pedidos/${result.orderId}`)
      } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    })
  }

  const getPkgName = (id: string) => { const p = packagingsLookup?.find((x: any) => x._id === id); const prod = products?.find((pp: any) => pp._id === p?.productId); return `${prod?.nome || "?"} — ${p?.nome || "?"}` }

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => navigate("/pedidos")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2"><ArrowLeft className="h-4 w-4" /> Voltar para Vendas</button>
      <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Vendas</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">{tipo === "orcamento" ? "Novo Orcamento" : "Novo Pedido"}</h1></div>

      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
        <button onClick={() => setTipo("pedido")} className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${tipo === "pedido" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground"}`}><ShoppingCart className="h-3.5 w-3.5" /> Pedido</button>
        <button onClick={() => setTipo("orcamento")} className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${tipo === "orcamento" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground"}`}><FileText className="h-3.5 w-3.5" /> Orcamento</button>
      </div>
      {tipo === "orcamento" && <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4 text-sm text-secondary"><FileText className="h-4 w-4 inline mr-1" />Orcamento nao reserva estoque. Converta para pedido quando o cliente aprovar.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Cliente</p>
            <Select value={form.clientId} onValueChange={(v) => v !== null && setF("clientId", v)}><SelectTrigger className="h-10 rounded-xl"><span className={`flex-1 text-left truncate ${!form.clientId ? "text-muted-foreground" : "text-foreground"}`}>{form.clientId ? selectedClient?.pfName || selectedClient?.pjNomeFantasia : "Selecionar cliente"}</span></SelectTrigger><SelectContent className="max-h-60">{(clients ?? []).map((c: any) => <SelectItem key={c._id} value={c._id}>{c.pfName || c.pjNomeFantasia || c.pjRazaoSocial || c.telefone}</SelectItem>)}</SelectContent></Select>
            {clientTable && <Badge className="bg-primary/10 text-primary text-[10px]">Tabela: {clientTable.table.nome}</Badge>}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Adicionar Produto</p>
            <div className="flex gap-2 items-end">
              <div className="space-y-1.5 flex-1"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produto / Embalagem</Label><Select value={ingForm.productPackagingId} onValueChange={(v) => v !== null && setIngForm({ ...ingForm, productPackagingId: v })}><SelectTrigger className="h-10 rounded-xl"><span className="flex-1 text-left truncate text-muted-foreground">{ingForm.productPackagingId ? getPkgName(ingForm.productPackagingId) : "Selecionar"}</span></SelectTrigger><SelectContent className="max-h-60">{(packagingsLookup ?? []).map((p: any) => <SelectItem key={p._id} value={p._id}>{getPkgName(p._id)}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5 w-24"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Qtd</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={ingForm.quantidade || ""} onChange={(e) => setIngForm({ ...ingForm, quantidade: Number(e.target.value) || 0 })} /></div>
              <div className="pb-0.5"><Button size="sm" className="rounded-xl shadow-primary-btn h-10 px-3" onClick={addItem}><Plus className="h-4 w-4" /></Button></div>
            </div>
            {selectedPkg && <div className="text-xs text-muted-foreground flex justify-between"><span>Estoque: {selectedPkg.quantidade || 0} {selectedPkg.unidadeVolume || "un"}</span><span>Preco: R$ {precoItem.toFixed(2)}</span></div>}
            {items.length > 0 && <div className="divide-y divide-border pt-2">{items.map((item: any, idx: number) => (<div key={item.key} className="flex items-center gap-2 py-2 text-sm"><span className="text-xs text-muted-foreground w-5">{idx + 1}.</span><span className="flex-1 truncate">{item.nome}</span><span className="shrink-0 font-mono">{item.quantidade}x R$ {item.precoUnitario.toFixed(2)}</span><span className="shrink-0 font-semibold">R$ {item.subtotal.toFixed(2)}</span><Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}><Trash2 className="h-3 w-3" /></Button></div>))}</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Totais</p>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {subtotalItems.toFixed(2)}</span></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Desconto %</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={form.descontoPercentual || ""} onChange={(e) => setF("descontoPercentual", Number(e.target.value))} /></div>
            {form.descontoPercentual > 0 && <div className="flex justify-between text-sm"><span>(-) Desconto</span><span className="text-destructive">-R$ {descValor.toFixed(2)}</span></div>}
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Frete</Label><div className="flex gap-2 items-center"><label className="flex items-center gap-1 text-xs cursor-pointer"><div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${form.freteGratis ? "bg-success border-success" : "border-border"}`} onClick={() => setF("freteGratis", !form.freteGratis)}>{form.freteGratis && <CheckCircle className="h-2.5 w-2.5 text-white" />}</div>Gratis</label>{!form.freteGratis && <Input className="h-9 rounded-xl font-mono text-right w-28" type="number" value={form.frete || ""} onChange={(e) => setF("frete", Number(e.target.value))} />}</div></div>
            <div className="flex justify-between pt-2 border-t text-lg font-bold"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Condicoes</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Forma Pagamento</Label><Select value={form.formaPagamento} onValueChange={(v) => v !== null && setF("formaPagamento", v)}><SelectTrigger className="h-10 rounded-xl"><span className="flex-1 text-left truncate">{form.formaPagamento}</span></SelectTrigger><SelectContent><SelectItem value="PIX">PIX</SelectItem><SelectItem value="Dinheiro">Dinheiro</SelectItem><SelectItem value="Cartao Debito">Cartao Debito</SelectItem><SelectItem value="Cartao">Cartao</SelectItem><SelectItem value="Boleto">Boleto</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Condicao</Label><Select value={form.condPagamento} onValueChange={(v) => v !== null && setF("condPagamento", v)}><SelectTrigger className="h-10 rounded-xl"><span className="flex-1 text-left truncate">{form.condPagamento}</span></SelectTrigger><SelectContent><SelectItem value="A vista">A vista</SelectItem><SelectItem value="30d">30 dias</SelectItem><SelectItem value="30/60d">30/60 dias</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Entrega</Label><div className="flex gap-2"><Button size="sm" type="button" variant={form.modalidadeEntrega === "retirada" ? "default" : "outline"} onClick={() => setF("modalidadeEntrega", "retirada")} className="rounded-xl text-xs">Retirada</Button><Button size="sm" type="button" variant={form.modalidadeEntrega === "entrega" ? "default" : "outline"} onClick={() => setF("modalidadeEntrega", "entrega")} className="rounded-xl text-xs">Entrega</Button></div></div>
          </div>

          <Button onClick={handleSave} disabled={saving || !form.clientId || items.length === 0} className="rounded-xl h-11 shadow-primary-btn w-full gap-2"><DollarSign className="h-4 w-4" /> {saving ? "Salvando..." : tipo === "orcamento" ? "Criar Orcamento" : "Criar Pedido"}</Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}><DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
        <div className={`${confirmData?.destructive ? "bg-destructive" : "bg-primary"} px-6 pt-6 pb-4 relative`}><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setConfirmOpen(false)}><XIcon className="h-4 w-4" /></DialogClose><DialogTitle className="text-xl font-bold tracking-tight text-white">{confirmData?.title}</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">{confirmData?.desc}</DialogDescription></div>
        <div className="px-6 py-5"><p className="text-sm text-muted-foreground">{confirmData?.destructive ? "Esta acao nao pode ser desfeita." : "Confirme para prosseguir."}</p></div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button><Button onClick={() => { if (confirmData) { setConfirmOpen(false); confirmData.onConfirm() } }} disabled={saving} className={`rounded-xl flex-1 h-11 shadow-primary-btn ${confirmData?.destructive ? "bg-destructive hover:bg-destructive/90" : ""}`}>{saving ? "Processando..." : "Confirmar"}</Button></div>
      </DialogContent></Dialog>
    </div>
  )
}
