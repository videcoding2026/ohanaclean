import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, PackageCheck, Check } from "lucide-react"
import { toast } from "sonner"

export default function ReceivePurchasePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const purchaseId = id as any

  const purchase = useQuery(api.purchases.get, { purchaseId })
  const items = useQuery(api.purchases.listItems, { purchaseId })
  const insumosList = useQuery(api.insumos.list, {})
  const receiveMutation = useMutation(api.purchases.receiveItems)

  const [receiving, setReceiving] = useState<Record<string, number>>({})
  const [dataRecebimento, setDataRecebimento] = useState(Date.now())
  const [observacao, setObservacao] = useState("")
  const [saving, setSaving] = useState(false)

  if (purchase === undefined || items === undefined) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Carregando...</div>
  }
  if (purchase === null) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Compra nao encontrada.</div>
  }

  const pendingItems = (items ?? []).filter((i: any) => i.statusRecebimento !== "recebido" && i.statusRecebimento !== "devolvido")

  const preencherTudo = () => {
    const r: Record<string, number> = {}
    for (const item of pendingItems) {
      const jaRecebido = item.quantidadeRecebida || 0
      const falta = item.quantidade - jaRecebido
      if (falta > 0) r[item._id] = falta
    }
    setReceiving(r)
  }

  const handleQtdChange = (itemId: string, val: string) => {
    const n = parseInt(val.replace(/\D/g, "") || "0", 10)
    const item = pendingItems.find((i: any) => i._id === itemId)
    if (!item) return
    const jaRecebido = item.quantidadeRecebida || 0
    const max = item.quantidade - jaRecebido
    setReceiving({ ...receiving, [itemId]: Math.min(n, max) })
  }

  const handleSubmit = async () => {
    const payload = Object.entries(receiving)
      .filter(([_, qtd]) => qtd > 0)
      .map(([itemId, qtd]) => ({ itemId: itemId as any, quantidadeRecebida: qtd }))

    if (payload.length === 0) { toast.error("Informe a quantidade recebida para pelo menos um item"); return }
    setSaving(true)
    try {
      await receiveMutation({ purchaseId, dataRecebimento, observacao, items: payload })
      toast.success("Recebimento registrado!")
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
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Recebimento</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{purchase.numero || "Compra"}</h1>
        </div>
        <Button onClick={preencherTudo} variant="outline" className="rounded-xl h-10 gap-2 text-sm">
          <Check className="h-4 w-4" /> Preencher Tudo Conforme
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data do Recebimento</Label>
            <Input className="h-10 rounded-xl" type="date" value={new Date(dataRecebimento).toISOString().slice(0, 10)} onChange={(e) => setDataRecebimento(new Date(e.target.value).getTime())} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacao (opcional)</Label>
            <Textarea className="rounded-xl text-sm" value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Observacoes..." rows={2} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Itens a Receber ({pendingItems.length})</p>

        {pendingItems.length === 0 ? (
          <div className="text-center py-8">
            <PackageCheck className="h-12 w-12 text-success/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Todos os itens ja foram recebidos!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pendingItems.map((item: any) => {
              const ins = insumosList?.find((x: any) => x._id === item.insumoId)
              const jaRecebido = item.quantidadeRecebida || 0
              const falta = item.quantidade - jaRecebido
              const qtdRecebendo = receiving[item._id] || 0

              return (
                <div key={item._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{ins?.nome || "Insumo"}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Pedido: <span className="font-medium">{item.quantidade} {item.unidade || "un"}</span>
                      {jaRecebido > 0 && <span className="text-success ml-2">Ja recebido: {jaRecebido} {item.unidade || "un"}</span>}
                      <span className="text-foreground ml-2">Falta: <strong>{falta} {item.unidade || "un"}</strong></span>
                    </p>
                  </div>
                  <div className="w-28 shrink-0">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Qtd Recebida</Label>
                    <Input
                      className="h-10 rounded-xl font-mono text-right"
                      value={qtdRecebendo || ""}
                      onChange={(e) => handleQtdChange(item._id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <span className="w-10 text-xs text-muted-foreground">{item.unidade || "un"}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => navigate(`/compras/${purchase._id}`)}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={saving || pendingItems.length === 0} className="rounded-xl flex-1 h-11 shadow-primary-btn bg-success hover:bg-success/90 gap-2">
          <PackageCheck className="h-4 w-4" /> {saving ? "Salvando..." : "Confirmar Recebimento"}
        </Button>
      </div>
    </div>
  )
}
