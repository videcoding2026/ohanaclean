import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ShoppingCart, Store, Factory, Truck, PackageCheck, Clock, AlertTriangle, Ban, Undo2, ExternalLink, Pencil, Trash2 } from "lucide-react"

const allStatus = ["Rascunho", "Pedida", "Aguardando Pagamento", "Em transito", "Recebida", "Recebida parcialmente", "Cancelada", "Devolvida"]

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  "Rascunho": { bg: "bg-gray-100", text: "text-gray-600", icon: <Clock className="h-3 w-3" />, label: "Rascunho" },
  "Pedida": { bg: "bg-yellow-100", text: "text-yellow-700", icon: <ShoppingCart className="h-3 w-3" />, label: "Pedida" },
  "Aguardando Pagamento": { bg: "bg-orange-100", text: "text-orange-700", icon: <Clock className="h-3 w-3" />, label: "Aguard. Pagamento" },
  "Em transito": { bg: "bg-blue-100", text: "text-blue-700", icon: <Truck className="h-3 w-3" />, label: "Em transito" },
  "Recebida": { bg: "bg-emerald-100", text: "text-emerald-700", icon: <PackageCheck className="h-3 w-3" />, label: "Recebida" },
  "Recebida parcialmente": { bg: "bg-amber-100", text: "text-amber-700", icon: <AlertTriangle className="h-3 w-3" />, label: "Recebida Parcial" },
  "Cancelada": { bg: "bg-red-100", text: "text-red-700", icon: <Ban className="h-3 w-3" />, label: "Cancelada" },
  "Devolvida": { bg: "bg-rose-100", text: "text-rose-700", icon: <Undo2 className="h-3 w-3" />, label: "Devolvida" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig["Rascunho"]
  return (
    <Badge className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase tracking-wider border-transparent gap-1`}>
      {cfg.icon}{cfg.label}
    </Badge>
  )
}

export default function PurchasesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterTipo, setFilterTipo] = useState("")

  const purchases = useQuery(api.purchases.list, {
    status: filterStatus || undefined,
    tipo: filterTipo || undefined,
    search: search || undefined,
  })
  const suppliers = useQuery(api.suppliers.list, {})

  const filtered = purchases ?? []

  const totalPeriod = filtered.reduce((sum: number, p: any) => sum + (p.total || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Suprimentos</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Compras de Insumos</h1>
        </div>
        <Button onClick={() => navigate("/compras/nova")} className="rounded-xl shadow-primary-btn gap-2">
          <Plus className="h-4 w-4" /> Nova Compra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total no Periodo</p>
          <p className="mt-1 text-2xl font-bold text-foreground">R$ {totalPeriod.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compras Listadas</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{filtered.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pendentes de Receber</p>
          <p className="mt-1 text-2xl font-bold text-warning">{filtered.filter((p: any) => p.status === "Pedida" || p.status === "Aguardando Pagamento" || p.status === "Em transito").length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recebidas</p>
          <p className="mt-1 text-2xl font-bold text-success">{filtered.filter((p: any) => p.status === "Recebida").length}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por numero ou nota..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterTipo || "all"} onValueChange={(v) => setFilterTipo(v === "all" ? "" : v || "")}>
            <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="direto"><Factory className="h-3 w-3 inline mr-1" /> Direto</SelectItem>
              <SelectItem value="marketplace"><Store className="h-3 w-3 inline mr-1" /> Marketplace</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v || "")}>
            <SelectTrigger className="w-44 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {allStatus.map((s) => <SelectItem key={s} value={s}>{statusConfig[s]?.label || s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">Nenhuma compra encontrada.</p>
            <p className="text-xs text-muted-foreground/50">Clique em "Nova Compra" para comecar.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Numero</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Data</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Fornecedor</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Tipo</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Total</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold w-24">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: any) => {
                const forn = suppliers?.find((f: any) => f._id === p.fornecedorId)
                return (
                  <TableRow
                    key={p._id}
                    className="group/row even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30"
                    onClick={() => navigate(`/compras/${p._id}`)}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <ShoppingCart className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-none mb-0.5">
                            {p.numero || "Rascunho"}
                          </p>
                          {p.numeroNota && (
                            <p className="text-[10px] text-muted-foreground">NF: {p.numeroNota}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(p.dataCompra).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {forn?.pjNomeFantasia || forn?.pfName || "—"}
                    </TableCell>
                    <TableCell>
                      {p.tipo === "marketplace" ? (
                        <Badge className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider border-transparent gap-1">
                          <Store className="h-3 w-3" /> Marketplace
                        </Badge>
                      ) : p.tipo === "direto" ? (
                        <Badge className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border-transparent gap-1">
                          <Factory className="h-3 w-3" /> Direto
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      R$ {(p.total || 0).toFixed(2)}
                    </TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => navigate(`/compras/${p._id}`)}><ExternalLink className="h-3.5 w-3.5" /></Button>
                        {(p.status === "Rascunho") && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => navigate(`/compras/nova?edit=${p._id}`)}><Pencil className="h-3.5 w-3.5" /></Button>
                        )}
                        {(p.status !== "Recebida" && p.status !== "Recebida parcialmente" && p.status !== "Devolvida" && p.status !== "Cancelada") && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => navigate(`/compras/${p._id}`)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        )}
                      </div>
                    </TableCell>
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
