import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Undo2 } from "lucide-react"
import { toast } from "sonner"

const motivos = [
  "Produto com defeito",
  "Produto errado",
  "Avaria no transporte",
  "Fora do prazo",
  "Arrependimento",
  "Outro",
]

export default function ReturnPurchasePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const purchaseId = id as any

  const purchase = useQuery(api.purchases.get, { purchaseId })
  const items = useQuery(api.purchases.listItems, { purchaseId })
  const insumosList = useQuery(api.insumos.list, {})
  const returnMutation = useMutation(api.purchases.returnItems)

  const [returnItems, setReturnItems] = useState<Record<string, { qtd: number; motivo: string; resolucao: string; obs: string }>>({})
  const [saving, setSaving] = useState(false)

  if (purchase === undefined || items === undefined) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Carregando...</div>
  }
  if (purchase === null) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Compra nao encontrada.</div>
  }

  const receivedItems = (items ?? []).filter((i: any) => (i.quantidadeRecebida || 0) > 0 && i.statusRecebimento !== "devolvido")

  const toggleItem = (itemId: string) => {
    const current = returnItems[itemId]
    if (current) {
      const next = { ...returnItems }
      delete next[itemId]
      setReturnItems(next)
    } else {
      setReturnItems({ ...returnItems, [itemId]: { qtd: 0, motivo: "Produto com defeito", resolucao: "Reenvio", obs: "" } })
    }
  }

  const setReturnProp = (itemId: string, prop: string, val: string) => {
    setReturnItems({ ...returnItems, [itemId]: { ...returnItems[itemId], [prop]: val } })
  }

  const handleSubmit = async () => {
    const payload = Object.entries(returnItems)
      .filter(([_, r]) => r.qtd > 0)
      .map(([itemId, r]) => ({ itemId: itemId as any, quantidade: r.qtd, motivo: r.motivo, resolucao: r.resolucao as "Reenvio" | "Credito" | "Estorno", observacao: r.obs || undefined }))

    if (payload.length === 0) { toast.error("Selecione pelo menos um item e informe a quantidade"); return }
    setSaving(true)
    try {
      await returnMutation({ purchaseId, items: payload })
      toast.success("Devolucao registrada!")
      navigate(`/compras/${purchase._id}`)
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate(`/compras/${purchase._id}`)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2">
        <ArrowLeft className="h-4 w-4" /> Voltar para Compra
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Devolucao</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{purchase?.numero || "Compra"}</h1>
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
        <Undo2 className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-rose-800">Atencao</p>
          <p className="text-xs text-rose-600 mt-0.5">A devolucao realizara a baixa no estoque e ajuste no PMP das variantes. Contas a pagar vinculadas precisam ser ajustadas manualmente no modulo financeiro.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Itens Disponiveis para Devolucao ({receivedItems.length})</p>

        {receivedItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Nenhum item recebido disponivel para devolucao.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedItems.map((item: any) => {
              const ins = insumosList?.find((x: any) => x._id === item.insumoId)
              const selected = !!returnItems[item._id]
              const ret = returnItems[item._id]
              const maxQtd = item.quantidadeRecebida || 0

              return (
                <div key={item._id} className={`rounded-2xl border p-4 space-y-3 transition-all ${selected ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => toggleItem(item._id)}>
                      <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "bg-primary border-primary" : "border-border"}`}>
                        {selected && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{ins?.nome || "Insumo"}</p>
                        <p className="text-[10px] text-muted-foreground">Recebido: {maxQtd} {item.unidade || "un"} | Preco: R$ {item.precoUnitario?.toFixed(2)}</p>
                      </div>
                    </label>
                  </div>

                  {selected && (
                    <div className="pl-8 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Qtd a Devolver * (max {maxQtd})</Label>
                          <Input className="h-10 rounded-xl font-mono text-right" type="number" value={ret.qtd || ""} onChange={(e) => { const n = Math.min(parseInt(e.target.value || "0", 10), maxQtd); setReturnProp(item._id, "qtd", String(n)) }} placeholder="0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolucao</Label>
                          <Select value={ret.resolucao} onValueChange={(v) => v && setReturnProp(item._id, "resolucao", v)}>
                            <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reenvio">Reenvio</SelectItem>
                              <SelectItem value="Credito">Credito</SelectItem>
                              <SelectItem value="Estorno">Estorno</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Motivo</Label>
                        <Select value={ret.motivo} onValueChange={(v) => v && setReturnProp(item._id, "motivo", v)}>
                          <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>{motivos.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacao (opcional)</Label>
                        <Textarea className="rounded-xl text-sm" value={ret.obs} onChange={(e) => setReturnProp(item._id, "obs", e.target.value)} rows={2} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 pb-10">
        <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => navigate(`/compras/${purchase._id}`)}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={saving || Object.keys(returnItems).length === 0} className="rounded-xl flex-1 h-11 bg-destructive hover:bg-destructive/90 text-white gap-2">
          <Undo2 className="h-4 w-4" /> {saving ? "Salvando..." : "Confirmar Devolucao"}
        </Button>
      </div>
    </div>
  )
}
