import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Factory, Clock, Play, CheckCircle2, Ban, AlertTriangle } from "lucide-react"

const statusList = ["Planejada", "Em andamento", "Concluida", "Cancelada", "Quarentena"]
const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  "Planejada": { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock className="h-3 w-3" />, label: "Planejada" },
  "Em andamento": { bg: "bg-blue-100", text: "text-blue-700", icon: <Play className="h-3 w-3" />, label: "Em andamento" },
  "Concluida": { bg: "bg-emerald-100", text: "text-emerald-700", icon: <CheckCircle2 className="h-3 w-3" />, label: "Concluida" },
  "Cancelada": { bg: "bg-red-100", text: "text-red-700", icon: <Ban className="h-3 w-3" />, label: "Cancelada" },
  "Quarentena": { bg: "bg-orange-100", text: "text-orange-700", icon: <AlertTriangle className="h-3 w-3" />, label: "Quarentena" },
}

export default function ProductionPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const orders = useQuery(api.production.list, { status: filterStatus || undefined })
  const products = useQuery(api.products.list, {})

  const filtered = (orders ?? []).filter((o: any) => {
    const t = search.toLowerCase()
    return !t || (o.numero?.toLowerCase().includes(t)) || (o.observacoes?.toLowerCase().includes(t))
  })

  const concluidas = filtered.filter((o: any) => o.status === "Concluida")
  const emAndamento = filtered.filter((o: any) => o.status === "Em andamento")
  const planejadas = filtered.filter((o: any) => o.status === "Planejada")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Producao</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">Gestao de Producao</h1></div>
        <Button onClick={() => navigate("/producao/nova")} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Nova Ordem</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total OPs</p><p className="mt-1 text-2xl font-bold text-foreground">{filtered.length}</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Planejadas</p><p className="mt-1 text-2xl font-bold text-warning">{planejadas.length}</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Em Andamento</p><p className="mt-1 text-2xl font-bold text-primary">{emAndamento.length}</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Concluidas</p><p className="mt-1 text-2xl font-bold text-success">{concluidas.length}</p></div>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por numero..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v || "")}><SelectTrigger className="w-44 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        </div>
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3"><Factory className="h-12 w-12 text-muted-foreground/30 mx-auto" /><p className="text-sm text-muted-foreground">Nenhuma ordem de producao.</p></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Numero</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Produto</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Qtd Planejada</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Produzido</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Rend.</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o: any) => {
                const cfg = statusConfig[o.status] || statusConfig["Planejada"]
                const prod = products?.find((p: any) => p._id === o.productId)
                return (
                  <TableRow key={o._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => navigate(`/producao/${o._id}`)}>
                    <TableCell className="py-3"><div className="flex items-center gap-2.5"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Factory className="h-4 w-4" /></div><p className="text-sm font-semibold text-foreground">{o.numero || "—"}</p></div></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{prod?.nome || "—"}</TableCell>
                    <TableCell className="text-xs text-right font-mono">{o.quantidadePlanejada}</TableCell>
                    <TableCell className="text-xs text-right font-mono">{o.quantidadeProduzida || "—"}</TableCell>
                    <TableCell className="text-xs text-right">{o.rendimento != null ? `${o.rendimento.toFixed(0)}%` : "—"}</TableCell>
                    <TableCell><Badge className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase tracking-wider border-transparent gap-1`}>{cfg.icon}{cfg.label}</Badge></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
