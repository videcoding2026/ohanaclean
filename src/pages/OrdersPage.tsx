import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ShoppingCart, FileText, Clock, CheckCircle2, Ban, Truck, PackageCheck } from "lucide-react"

const statusList = ["Orcamento", "Confirmado", "Em separacao", "Aguardando retirada", "Saiu para entrega", "Concluido", "Cancelado"]
const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Orcamento": { bg: "bg-secondary/10", text: "text-secondary", icon: <FileText className="h-3 w-3" /> },
  "Confirmado": { bg: "bg-primary/10", text: "text-primary", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Em separacao": { bg: "bg-warning/10", text: "text-warning", icon: <Clock className="h-3 w-3" /> },
  "Aguardando retirada": { bg: "bg-blue-100", text: "text-blue-700", icon: <PackageCheck className="h-3 w-3" /> },
  "Saiu para entrega": { bg: "bg-blue-100", text: "text-blue-700", icon: <Truck className="h-3 w-3" /> },
  "Concluido": { bg: "bg-success/10", text: "text-success", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Cancelado": { bg: "bg-destructive/10", text: "text-destructive", icon: <Ban className="h-3 w-3" /> },
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterTipo, setFilterTipo] = useState("")

  const orders = useQuery(api.orders.list, { status: filterStatus || undefined, tipo: filterTipo ? filterTipo as any : undefined })
  const clients = useQuery(api.clients.list, {})

  const filtered = (orders ?? []).filter((o: any) => !search || o.numero?.toLowerCase().includes(search.toLowerCase()) || clients?.find((c: any) => c._id === o.clientId)?.pfName?.toLowerCase().includes(search.toLowerCase()))
  const total = filtered.reduce((s: number, o: any) => s + (o.total || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Vendas</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">Pedidos e Orcamentos</h1></div>
        <Button onClick={() => navigate("/pedidos/nova")} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Novo Pedido</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total no Periodo</p><p className="mt-1 text-2xl font-bold text-foreground">R$ {total.toFixed(2)}</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pedidos Listados</p><p className="mt-1 text-2xl font-bold text-foreground">{filtered.length}</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Em Aberto</p><p className="mt-1 text-2xl font-bold text-warning">{filtered.filter((o: any) => o.status !== "Concluido" && o.status !== "Cancelado").length}</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Concluidos</p><p className="mt-1 text-2xl font-bold text-success">{filtered.filter((o: any) => o.status === "Concluido").length}</p></div>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por numero ou cliente..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={filterTipo || "all"} onValueChange={(v) => setFilterTipo(v === "all" ? "" : v ?? "")}><SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Tipo" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="pedido">Pedido</SelectItem><SelectItem value="orcamento">Orcamento</SelectItem></SelectContent></Select>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v ?? "")}><SelectTrigger className="w-44 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        </div>
        {filtered.length === 0 ? <div className="p-16 text-center"><ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p></div> : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50"><TableRow><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Numero</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Cliente</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Tipo</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Total</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Status</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((o: any) => { const cfg = statusConfig[o.status]; const cl = clients?.find((c: any) => c._id === o.clientId); return (
              <TableRow key={o._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card cursor-pointer hover:bg-accent/30" onClick={() => navigate(`/pedidos/${o._id}`)}>
                <TableCell className="py-3"><div className="flex items-center gap-2.5"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><ShoppingCart className="h-4 w-4" /></div><p className="text-sm font-semibold">{o.numero}</p></div></TableCell>
                <TableCell className="text-xs text-muted-foreground">{cl?.pfName || cl?.pjNomeFantasia || "—"}</TableCell>
                <TableCell>{o.tipo === "orcamento" ? <Badge className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase border-transparent gap-1"><FileText className="h-3 w-3" />Orcamento</Badge> : <Badge className="bg-primary/10 text-primary text-[10px] font-bold uppercase border-transparent gap-1"><ShoppingCart className="h-3 w-3" />Pedido</Badge>}</TableCell>
                <TableCell className="text-xs font-semibold text-right">R$ {(o.total || 0).toFixed(2)}</TableCell>
                <TableCell><Badge className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase border-transparent gap-1`}>{cfg.icon}{o.status}</Badge></TableCell>
              </TableRow>
            )})}</TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
