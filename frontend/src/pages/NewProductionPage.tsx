import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ArrowLeft, Factory, PackageCheck } from "lucide-react"
import { toast } from "sonner"

export default function NewProductionPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ productId: "", formulaId: "", quantidadePlanejada: 0, dataPrevista: Date.now() + 7 * 86400000, observacoes: "" })
  const [saving, setSaving] = useState(false)

  const products = useQuery(api.products.list, {})
  const formulas = useQuery(api.formulas.list, {})
  const createOrder = useMutation(api.production.create)

  const selectedFormulas = (formulas ?? []).filter((f: any) => f.productId === form.productId)
  useEffect(() => { if (form.productId) setForm(f => ({ ...f, formulaId: "" })) }, [form.productId])

  const selectedFormula = formulas?.find((f: any) => f._id === form.formulaId)

  const handleCreate = async () => {
    if (!form.productId || !form.formulaId || !form.quantidadePlanejada) {
      toast.error("Preencha todos os campos obrigatorios")
      return
    }
    setSaving(true)
    try {
      const result = await createOrder({
        productId: form.productId as any,
        formulaId: form.formulaId as any,
        quantidadePlanejada: form.quantidadePlanejada,
        dataPrevista: form.dataPrevista,
        observacoes: form.observacoes,
      })
      if (!result.podeProduzir) {
        toast.warning("Estoque insuficiente para algumas variantes. A OP foi criada como Planejada - Pendente.")
      } else {
        toast.success(`Ordem ${result.numero} criada com sucesso!`)
      }
      navigate("/producao")
    } catch (e: any) { toast.error(e.message || "Erro ao criar ordem") } finally { setSaving(false) }
  }

  const prod = products?.find((p: any) => p._id === form.productId)

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate("/producao")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-2"><ArrowLeft className="h-4 w-4" /> Voltar para Producao</button>
      <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Producao</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">Nova Ordem de Producao</h1></div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dados da Ordem</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produto *</Label>
            <Select value={form.productId} onValueChange={(v) => v !== null && setForm({ ...form, productId: v })}>
              <SelectTrigger className="h-10 rounded-xl"><span className={`flex-1 text-left truncate ${!form.productId ? "text-muted-foreground" : "text-foreground"}`}>{prod?.nome || "Selecionar produto"}</span></SelectTrigger>
              <SelectContent>{(products ?? []).map((p: any) => <SelectItem key={p._id} value={p._id}>{p.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Formula *</Label>
            <Select value={form.formulaId} onValueChange={(v) => v !== null && setForm({ ...form, formulaId: v })} disabled={!form.productId}>
              <SelectTrigger className="h-10 rounded-xl"><span className={`flex-1 text-left truncate ${!form.formulaId ? "text-muted-foreground" : "text-foreground"}`}>{selectedFormula?.nome || "Selecionar formula"}</span></SelectTrigger>
              <SelectContent>{(selectedFormulas ?? []).map((f: any) => <SelectItem key={f._id} value={f._id}>{f.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantidade * ({selectedFormula?.unidade || "L"})</Label>
            <Input className="h-10 rounded-xl font-mono text-right" type="number" value={form.quantidadePlanejada || ""} onChange={(e) => setForm({ ...form, quantidadePlanejada: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Prevista</Label>
            <Input className="h-10 rounded-xl" type="date" value={new Date(form.dataPrevista).toISOString().slice(0, 10)} onChange={(e) => setForm({ ...form, dataPrevista: new Date(e.target.value).getTime() })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacoes</Label>
          <Input className="h-10 rounded-xl" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Opcional" />
        </div>
      </div>

      {selectedFormula && form.quantidadePlanejada > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Verificacao de Estoque</p>
          <p className="text-xs text-muted-foreground">A verificacao completa do estoque por variante sera feita ao criar a ordem. Itens com estoque insuficiente serao destacados.</p>
          <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground text-center">
            <PackageCheck className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            Clique em "Criar Ordem" para verificar o estoque automaticamente.
          </div>
        </div>
      )}

      <div className="flex gap-3 pb-10">
        <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => navigate("/producao")}>Cancelar</Button>
        <Button onClick={handleCreate} disabled={saving || !form.productId || !form.formulaId || !form.quantidadePlanejada} className="rounded-xl flex-1 h-11 shadow-primary-btn gap-2"><Factory className="h-4 w-4" /> {saving ? "Criando..." : "Criar Ordem de Producao"}</Button>
      </div>
    </div>
  )
}
