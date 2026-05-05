import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Tag } from "lucide-react"

export default function PriceTablePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const tables = useQuery(api.pricetables.list)
  const filtered = (tables ?? []).filter((t: any) => !search || t.nome.toLowerCase().includes(search.toLowerCase()) || t.codigo?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Precificacao</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">Tabelas de Preco</h1></div>
        <Button onClick={() => navigate("/precos/nova")} className="rounded-xl shadow-primary-btn gap-2"><Plus className="h-4 w-4" /> Nova Tabela</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar tabela..." className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
        {filtered.length === 0 ? (
          <div className="p-16 text-center"><Tag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">Nenhuma tabela de preco.</p></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Codigo</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Nome</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Tipo Cliente</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Vigencia</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Base</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t: any) => (
                <TableRow key={t._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => navigate(`/precos/${t._id}`)}>
                  <TableCell className="py-3"><div className="flex items-center gap-2.5"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Tag className="h-4 w-4" /></div><p className="text-sm font-semibold text-foreground">{t.codigo}</p></div></TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{t.nome}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.tipoCliente || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.validFrom ? new Date(t.validFrom).toLocaleDateString("pt-BR") : "—"} {t.validTo ? `→ ${new Date(t.validTo).toLocaleDateString("pt-BR")}` : ""}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.baseTableId ? "Sim" : "Nao"}</TableCell>
                  <TableCell><Badge className={`text-[10px] font-bold uppercase tracking-wider border-transparent ${t.status === "Ativa" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{t.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
