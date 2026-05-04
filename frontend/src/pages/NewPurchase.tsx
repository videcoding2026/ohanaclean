import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, Factory, Store, Check, ShoppingCart, Clock, XIcon } from "lucide-react"
import { maskDecimal, maskMoney } from "@/lib/masks"
import { toast } from "sonner"

const emptyForm = () => ({
  fornecedorId: "",
  dataCompra: Date.now(),
  numeroNota: "",
  tipoPagamento: "",
  condPagamento: "",
  freteGratis: false,
  frete: 0,
  observacoes: "",
})

export default function NewPurchasePage() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<"direto" | "marketplace">("direto")
  const [form, setForm] = useState(emptyForm())
  const [items, setItems] = useState<any[]>([])
  const [ingForm, setIngForm] = useState({ insumoId: "", varianteId: "", quantidade: "", precoUnitario: "", unidade: "" })
  const [saving, setSaving] = useState(false)
  const [valOpen, setValOpen] = useState(false)
  const [valErrors, setValErrors] = useState<string[]>([])

  const suppliers = useQuery(api.suppliers.list, {})
  const insumosList = useQuery(api.insumos.list, {})
  const createPurchase = useMutation(api.purchases.create)
  const confirmOrder = useMutation(api.purchases.confirmOrder)

  const selectedInsumo = insumosList?.find((i: any) => i._id === ingForm.insumoId)
  const variants = useQuery(api.insumos.listVariants, ingForm.insumoId ? { insumoId: ingForm.insumoId as any } : "skip")

  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const subTotal = items.reduce((sum: number, i: any) => sum + (i.precoUnitario || 0) * (i.quantidade || 0), 0)
  const total = subTotal + (form.frete || 0)

  const addItem = () => {
    if (!ingForm.insumoId || !ingForm.quantidade || !ingForm.precoUnitario) return
    const ins = insumosList?.find((i: any) => i._id === ingForm.insumoId)
    const isMetric = ingForm.unidade !== "" && ingForm.unidade !== "un"
    const qtd = isMetric ? parseFloat(ingForm.quantidade.replace(",", ".")) || 0 : parseInt(ingForm.quantidade.replace(/\D/g, "") || "0", 10)
    const preco = parseFloat(ingForm.precoUnitario.replace(",", ".")) || 0
    if (qtd <= 0 || preco <= 0) return
    const unidade = ingForm.unidade || ins?.unidadeUso || ins?.unidadeCompra || "un"
    const vrt = ingForm.varianteId ? variants?.find((v: any) => v._id === ingForm.varianteId) : null
    setItems([...items, {
      key: Date.now(),
      insumoId: ingForm.insumoId, varianteId: ingForm.varianteId || null,
      quantidade: qtd, precoUnitario: preco, subtotal: qtd * preco,
      unidade, nome: ins?.nome || "", vrtNome: vrt?.nome || null,
    }])
    setIngForm({ insumoId: "", varianteId: "", quantidade: "", precoUnitario: "", unidade: "" })
  }

  const validate = () => {
    const errs: string[] = []
    if (items.length === 0) errs.push("Adicione pelo menos um item a compra")
    if (!form.fornecedorId) errs.push("Selecione um fornecedor")
    if (!form.tipoPagamento) errs.push("Selecione a forma de pagamento")
    setValErrors(errs)
    if (errs.length > 0) { setValOpen(true); return false }
    return true
  }

  const handleSaveDraft = async () => {
    if (items.length === 0) { setValErrors(["Adicione pelo menos um item"]); setValOpen(true); return }
    setSaving(true)
    try {
      const dataItems = items.map((i: any) => ({
        insumoId: i.insumoId as any, varianteId: i.varianteId ? i.varianteId as any : undefined,
        quantidade: i.quantidade, precoUnitario: i.precoUnitario, subtotal: i.subtotal,
        unidade: i.unidade || undefined,
      }))
      await createPurchase({
        ...form, tipo: tipo,
        fornecedorId: form.fornecedorId ? form.fornecedorId as any : undefined,
        items: dataItems,
        freteGratis: form.freteGratis,
      })
      toast.success("Rascunho salvo com sucesso!")
      navigate("/compras")
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar")
    } finally { setSaving(false) }
  }

  const handleSaveMarketplace = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const dataItems = items.map((i: any) => ({
        insumoId: i.insumoId as any, varianteId: i.varianteId ? i.varianteId as any : undefined,
        quantidade: i.quantidade, precoUnitario: i.precoUnitario, subtotal: i.subtotal,
        unidade: i.unidade || undefined,
      }))
      await createPurchase({
        ...form, tipo: "marketplace",
        fornecedorId: form.fornecedorId ? form.fornecedorId as any : undefined,
        items: dataItems,
        freteGratis: form.freteGratis,
      })
      toast.success("Compra registrada com sucesso!")
      navigate("/compras")
    } catch (e: any) {
      toast.error(e.message || "Erro ao registrar")
    } finally { setSaving(false) }
  }

  const handleConfirmOrder = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const dataItems = items.map((i: any) => ({
        insumoId: i.insumoId as any, varianteId: i.varianteId ? i.varianteId as any : undefined,
        quantidade: i.quantidade, precoUnitario: i.precoUnitario, subtotal: i.subtotal,
        unidade: i.unidade || undefined,
      }))
      const id = await createPurchase({
        ...form, tipo: "direto",
        fornecedorId: form.fornecedorId ? form.fornecedorId as any : undefined,
        items: dataItems,
        freteGratis: form.freteGratis,
      })
      await confirmOrder({ purchaseId: id as any })
      toast.success("Pedido confirmado com sucesso!")
      navigate("/compras")
    } catch (e: any) {
      toast.error(e.message || "Erro ao confirmar")
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/compras")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2">
        <ArrowLeft className="h-4 w-4" /> Voltar para Compras
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Suprimentos</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Nova Compra</h1>
        </div>
      </div>

      {/* Tipo Toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
        <button
          onClick={() => setTipo("direto")}
          className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${tipo === "direto" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
        >
          <Factory className="h-3.5 w-3.5" /> Fornecedor Direto
        </button>
        <button
          onClick={() => setTipo("marketplace")}
          className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${tipo === "marketplace" ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
        >
          <Store className="h-3.5 w-3.5" /> Marketplace
        </button>
      </div>

      {tipo === "marketplace" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Compra em Marketplace</p>
            <p className="text-xs text-blue-600 mt-0.5">A compra sera registrada diretamente como "Pedida" (pagamento ja realizado na plataforma).</p>
          </div>
        </div>
      )}

      {/* Dados da Compra */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dados da Compra</p>
        <div className={tipo === "marketplace" ? "opacity-60 pointer-events-none" : ""}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fornecedor *</Label>
              <Select value={form.fornecedorId} onValueChange={(v) => v !== null && setF("fornecedorId", v)}>
                <SelectTrigger className="h-10 rounded-xl w-full">
                  <span className={`flex-1 text-left truncate ${!form.fornecedorId ? "text-muted-foreground" : "text-foreground"}`}>
                    {form.fornecedorId ? (suppliers?.find((f: any) => f._id === form.fornecedorId)?.pjNomeFantasia || suppliers?.find((f: any) => f._id === form.fornecedorId)?.pfName) : "Selecionar fornecedor"}
                  </span>
                </SelectTrigger>
                <SelectContent className="min-w-[240px]">{(suppliers ?? []).map((f: any) => <SelectItem key={f._id} value={f._id}>{f.pjNomeFantasia || f.pfName || f.telefone}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Numero Nota / Pedido</Label>
              <Input className="h-10 rounded-xl" value={form.numeroNota} onChange={(e) => setF("numeroNota", e.target.value)} placeholder="Opcional" />
            </div>
          </div>
        </div>
      </div>

      {/* Itens */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Adicionar Item</p>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="space-y-1.5 flex-[2] min-w-[180px]">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Insumo</Label>
            <Select value={ingForm.insumoId} onValueChange={(v) => { if (v === null) return; const ins = insumosList?.find((i: any) => i._id === v); setIngForm({ ...ingForm, insumoId: v, varianteId: "", unidade: ins?.unidadeUso || ins?.unidadeCompra || "" }) }}>
              <SelectTrigger className="h-10 rounded-xl w-full">
                <span className={`flex-1 text-left truncate ${!ingForm.insumoId ? "text-muted-foreground" : "text-foreground"}`}>
                  {ingForm.insumoId ? (insumosList?.find((i: any) => i._id === ingForm.insumoId)?.nome || "Selecionar") : "Selecionar insumo"}
                </span>
              </SelectTrigger>
              <SelectContent className="min-w-[220px]">{(insumosList ?? []).map((i: any) => <SelectItem key={i._id} value={i._id}>{i.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {selectedInsumo?.temVariantes && (
            <div className="space-y-1.5 w-40">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Variante</Label>
              <Select value={ingForm.varianteId} onValueChange={(v) => v !== null && setIngForm({ ...ingForm, varianteId: v })}>
                <SelectTrigger className="h-10 rounded-xl w-full">
                  <span className={`flex-1 text-left truncate ${!ingForm.varianteId ? "text-muted-foreground" : "text-foreground"}`}>
                    {ingForm.varianteId ? (variants?.find((v: any) => v._id === ingForm.varianteId)?.nome || "Selecionar") : "Variante"}
                  </span>
                </SelectTrigger>
                <SelectContent>{(variants ?? []).map((v: any) => <SelectItem key={v._id} value={v._id}>{v.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5 w-28">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Qtd</Label>
            <Input className="h-10 rounded-xl font-mono text-right w-full" value={ingForm.quantidade} onChange={(e) => { const isMetric = ingForm.unidade !== "" && ingForm.unidade !== "un"; setIngForm({ ...ingForm, quantidade: isMetric ? maskDecimal(e.target.value, true) : e.target.value.replace(/\D/g, "") }) }} placeholder="0" onKeyDown={(e) => { if (e.key === "Enter") addItem() }} />
          </div>
          <div className="space-y-1.5 w-10">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Un</Label>
            <div className="h-10 flex items-center text-xs text-muted-foreground">{ingForm.unidade || "---"}</div>
          </div>
          <div className="space-y-1.5 w-32">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preco</Label>
            <Input className="h-10 rounded-xl font-mono text-right w-full" value={ingForm.precoUnitario} onChange={(e) => setIngForm({ ...ingForm, precoUnitario: maskMoney(e.target.value) })} placeholder="R$" onKeyDown={(e) => { if (e.key === "Enter") addItem() }} />
          </div>
          <div className="pb-1">
            <Button size="sm" className="rounded-xl shadow-primary-btn h-10 px-3 shrink-0" onClick={addItem}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Itens <span className="text-muted-foreground font-normal normal-case">({items.length})</span></p>
          {items.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">Nenhum item adicionado.</p> : (
            <div className="divide-y divide-border">
              {items.map((item: any, idx: number) => (
                <div key={item.key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground truncate">{item.nome}{item.vrtNome ? ` — ${item.vrtNome}` : ""}</p></div>
                  <span className="text-sm text-foreground shrink-0 w-20 text-right">{item.quantidade} {item.unidade}</span>
                  <span className="text-sm text-foreground shrink-0 w-24 text-right">R$ {item.precoUnitario.toFixed(2)}</span>
                  <span className="text-sm font-medium text-foreground shrink-0 w-24 text-right">R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive shrink-0" onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Financeiro */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Financeiro</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Forma Pagamento *</Label>
            <Select value={form.tipoPagamento} onValueChange={(v) => v !== null && setF("tipoPagamento", v)}>
              <SelectTrigger className="h-10 rounded-xl"><span className={`flex-1 text-left truncate ${!form.tipoPagamento ? "text-muted-foreground" : "text-foreground"}`}>{form.tipoPagamento || "Selecionar"}</span></SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
                <SelectItem value="Cartao">Cartao</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Condicao Pagamento</Label>
            <Select value={form.condPagamento} onValueChange={(v) => v !== null && setF("condPagamento", v)}>
              <SelectTrigger className="h-10 rounded-xl"><span className={`flex-1 text-left truncate ${!form.condPagamento ? "text-muted-foreground" : "text-foreground"}`}>{form.condPagamento || "Selecionar"}</span></SelectTrigger>
              <SelectContent>
                <SelectItem value="A vista">A vista</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="30/60d">30/60 dias</SelectItem>
                <SelectItem value="30/60/90d">30/60/90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${form.freteGratis ? "bg-success border-success" : "border-border"}`} onClick={() => setF("freteGratis", !form.freteGratis)}>
                {form.freteGratis && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm text-foreground">Frete gratis</span>
            </label>
            {!form.freteGratis && (
              <div className="w-40">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Valor Frete R$</Label>
                <Input className="h-10 rounded-xl font-mono" type="number" value={form.frete || ""} onChange={(e) => setF("frete", Number(e.target.value) || 0)} />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacoes</Label>
          <Input className="h-10 rounded-xl" value={form.observacoes} onChange={(e) => setF("observacoes", e.target.value)} placeholder="Opcional" />
        </div>
      </div>

      {/* Resumo */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Resumo da Compra</p>
        <div className="space-y-2">
          <div className="flex justify-between py-2"><span className="text-sm text-muted-foreground">Subtotal ({items.length} itens)</span><span className="text-sm font-semibold text-foreground">R$ {subTotal.toFixed(2)}</span></div>
          <div className="flex justify-between py-2 border-t border-border"><span className="text-sm text-muted-foreground">Frete</span><span className="text-sm font-semibold text-foreground">R$ {(form.frete || 0).toFixed(2)}</span></div>
          <div className="flex justify-between py-2 border-t border-border"><span className="text-sm font-bold text-foreground">Total</span><span className="text-sm font-bold text-foreground text-lg">R$ {total.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-10">
        <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => navigate("/compras")}>Cancelar</Button>
        {tipo === "direto" ? (
          <>
            <Button onClick={handleSaveDraft} disabled={saving} variant="outline" className="rounded-xl flex-1 h-11 gap-2">
              <Clock className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Rascunho"}
            </Button>
            <Button onClick={handleConfirmOrder} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn gap-2">
              <Check className="h-4 w-4" /> {saving ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </>
        ) : (
          <Button onClick={handleSaveMarketplace} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn gap-2">
            <Store className="h-4 w-4" /> {saving ? "Salvando..." : "Registrar Compra"}
          </Button>
        )}
      </div>

      <Dialog open={valOpen} onOpenChange={setValOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Atencao</DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-1">Verifique os dados antes de continuar.</DialogDescription>
          </div>
          <div className="px-6 py-5"><ul className="space-y-2">{valErrors.map((e) => (<li key={e} className="flex items-center gap-2.5 text-sm text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{e}</li>))}</ul></div>
          <div className="px-6 pb-5"><Button className="w-full rounded-xl h-11 shadow-primary-btn" onClick={() => setValOpen(false)}>Entendi</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
