import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Search, ArrowDown, ArrowUp, AlertTriangle, PackageCheck, Equal, Pencil, History, XIcon, BoxesIcon, ClipboardList, MoveRight, ArrowRightLeft } from "lucide-react"
import { toast } from "sonner"

function StockBadge({ abaixoMin, acimaMax }: { abaixoMin: boolean; acimaMax: boolean }) {
  if (abaixoMin) return <Badge className="bg-destructive/15 text-destructive text-[10px] font-bold uppercase tracking-wider border-transparent gap-1"><ArrowDown className="h-3 w-3" /> Baixo</Badge>
  if (acimaMax) return <Badge className="bg-warning/15 text-warning text-[10px] font-bold uppercase tracking-wider border-transparent gap-1"><ArrowUp className="h-3 w-3" /> Alto</Badge>
  return <Badge className="bg-success/15 text-success text-[10px] font-bold uppercase tracking-wider border-transparent gap-1"><Equal className="h-3 w-3" /> OK</Badge>
}

export default function StockPage() {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState("")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailType, setDetailType] = useState<"insumo" | "produto">("insumo")
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustForm, setAdjustForm] = useState({ itemType: "insumo" as "insumo" | "produto", varianteId: "", productPackagingId: "", novaQuantidade: 0, observacao: "" })
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferForm, setTransferForm] = useState({ itemType: "insumo" as "insumo" | "produto", varianteId: "", productPackagingId: "", quantidade: 0, localDestino: "", observacao: "" })
  const [saving, setSaving] = useState(false)
  const [invScope, setInvScope] = useState<"completo" | "insumos" | "produtos">("completo")
  const [invStartOpen, setInvStartOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ title: string; description: string; onConfirm: () => void; destructive?: boolean } | null>(null)

  const showConfirm = (title: string, description: string, onConfirm: () => void, destructive?: boolean) => {
    setConfirmData({ title, description, onConfirm, destructive })
    setConfirmOpen(true)
  }
  const [activeInventarioId, setActiveInventarioId] = useState<string | null>(null)

  const stock = useQuery(api.stock.list)
  const history = useQuery(api.stock.getHistory, detailId ? { [detailType === "insumo" ? "varianteId" : "productPackagingId"]: detailId as any } as any : "skip")
  const adjust = useMutation(api.stock.adjust)
  const transfer = useMutation(api.stock.transfer)
  const startInventory = useMutation(api.stock.startInventory)
  const inventarios = useQuery(api.stock.getInventarios)
  const invItems = useQuery(api.stock.getInventarioItems, activeInventarioId ? { inventarioId: activeInventarioId as any } : "skip")
  const updateContagem = useMutation(api.stock.updateContagem)
  const approveInventory = useMutation(api.stock.approveInventory)

  const insumos = stock?.insumos ?? []
  const produtos = stock?.produtos ?? []
  const allMovements = history ?? []

  const filterFn = (s: any) => {
    const t = search.toLowerCase()
    return !t || s.nome.toLowerCase().includes(t) || s.insumoNome.toLowerCase().includes(t)
  }
  const filteredInsumos = insumos.filter(filterFn)
  const filteredProdutos = produtos.filter(filterFn)

  const countBad = (arr: any[]) => arr.filter((s) => s.estoqueMinimo > 0 && s.quantidade <= s.estoqueMinimo).length
  const countOk = (arr: any[]) => arr.filter((s) => { const m = s.estoqueMinimo || 0; const x = s.estoqueMaximo || 0; return s.quantidade >= m && (x === 0 || s.quantidade < x) }).length
  const valorTotal = (arr: any[]) => arr.reduce((s: number, i) => s + (i.quantidade || 0) * (i.precoMedio || 0), 0)

  const selectedItem = detailType === "insumo" ? insumos.find((s: any) => s._id === detailId) : produtos.find((s: any) => s._id === detailId)
  const inv = inventarios?.find((i: any) => i._id === activeInventarioId)

  const handleAdjust = async () => {
    if (!adjustForm.novaQuantidade) return
    setAdjustOpen(false)
    showConfirm("Confirmar Ajuste", `Deseja alterar a quantidade em estoque para ${adjustForm.novaQuantidade} unidades?`, async () => {
      setSaving(true)
      try {
        await adjust({ ...adjustForm as any, varianteId: adjustForm.varianteId ? adjustForm.varianteId as any : undefined, productPackagingId: adjustForm.productPackagingId ? adjustForm.productPackagingId as any : undefined })
        toast.success("Estoque ajustado!")
      } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    })
  }
  const handleTransfer = async () => {
    if (!transferForm.quantidade || !transferForm.localDestino) return
    setTransferOpen(false)
    showConfirm("Confirmar Transferencia", `Deseja transferir ${transferForm.quantidade} unidades para "${transferForm.localDestino}"?`, async () => {
      setSaving(true)
      try {
        await transfer({ ...transferForm as any, varianteId: transferForm.varianteId ? transferForm.varianteId as any : undefined, productPackagingId: transferForm.productPackagingId ? transferForm.productPackagingId as any : undefined })
        toast.success("Transferencia registrada!")
      } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    })
  }
  const handleStartInventory = async () => {
    setInvStartOpen(false)
    showConfirm("Iniciar Inventario", `Deseja iniciar um inventario ${invScope === "completo" ? "completo" : invScope === "insumos" ? "de insumos" : "de produtos"}? As movimentacoes normais continuarao registradas.`, async () => {
      setSaving(true)
      try {
        const id = await startInventory({ escopo: invScope })
        setActiveInventarioId(id as any)
        toast.success("Inventario iniciado!")
      } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    })
  }
  const handleApprove = () => {
    if (!activeInventarioId) return
    showConfirm("Aprovar Inventario", "Ao aprovar, todos os ajustes com diferenca serao aplicados automaticamente ao estoque. Deseja continuar?", async () => {
      setSaving(true)
      try {
        await approveInventory({ inventarioId: activeInventarioId as any })
        toast.success("Inventario aprovado e ajustes aplicados!")
        setActiveInventarioId(null)
      } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
    }, true)
  }

  const openAdjust = (type: "insumo" | "produto", id: string, qtd: number) => {
    setAdjustForm({ itemType: type, varianteId: type === "insumo" ? id : "", productPackagingId: type === "produto" ? id : "", novaQuantidade: qtd, observacao: "" })
    setAdjustOpen(true)
  }
  const openTransfer = (type: "insumo" | "produto", id: string) => {
    setTransferForm({ itemType: type, varianteId: type === "insumo" ? id : "", productPackagingId: type === "produto" ? id : "", quantidade: 0, localDestino: "", observacao: "" })
    setTransferOpen(true)
  }

  const currentArr = tab === 0 ? filteredInsumos : tab === 1 ? filteredProdutos : []

  const renderTable = (items: any[], type: "insumo" | "produto") => (
    <Table>
      <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
        <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
          {type === "insumo" ? (
            <>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Insumo / Variante</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Categ</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Saldo</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">PMP</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Vlr Total</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Min/Max</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Local</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Validade</TableHead>
            </>
          ) : (
            <>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Produto / Embalagem</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold w-24">SKU</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Saldo</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Preco Sug.</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Margem</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold text-right">Min/Max</TableHead>
              <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Local</TableHead>
            </>
          )}
          <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold">Status</TableHead>
          <TableHead className="text-[#3B4280] dark:text-foreground text-xs uppercase tracking-wider font-bold w-24">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((s: any) => {
          const abaixoMin = s.estoqueMinimo > 0 && s.quantidade <= s.estoqueMinimo
          const acimaMax = s.estoqueMaximo > 0 && s.quantidade >= s.estoqueMaximo
          return (
            <TableRow key={s._id} className="group/row even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border cursor-pointer hover:bg-accent/30" onClick={() => { setDetailId(s._id); setDetailType(type) }}>
              <TableCell className="py-3">
                <div className="flex items-center gap-2.5">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${abaixoMin ? "bg-destructive/10 text-destructive" : acimaMax ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                    {abaixoMin ? <AlertTriangle className="h-4 w-4" /> : acimaMax ? <ArrowUp className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
                  </div>
                  <div><p className="text-sm font-semibold text-foreground leading-none mb-0.5">{s.nome}</p><p className="text-[10px] text-muted-foreground">{s.insumoNome}</p></div>
                </div>
              </TableCell>
              {type === "insumo" ? (
                <>
                  <TableCell className="text-xs text-muted-foreground">{s.categoria}</TableCell>
                  <TableCell className="text-xs font-semibold text-right font-mono"><span className={abaixoMin ? "text-destructive" : acimaMax ? "text-warning" : "text-foreground"}>{s.quantidade} {s.unidadeMedida}</span></TableCell>
                  <TableCell className="text-xs text-right">R$ {s.precoMedio.toFixed(2)}</TableCell>
                  <TableCell className="text-xs font-semibold text-right">R$ {(s.quantidade * s.precoMedio).toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right">{s.estoqueMinimo || "—"} / {s.estoqueMaximo || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.localizacao || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.dataValidade ? new Date(s.dataValidade).toLocaleDateString("pt-BR") : "—"}</TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-xs text-muted-foreground font-mono">{s.sku || "—"}</TableCell>
                  <TableCell className="text-xs font-semibold text-right font-mono"><span className={abaixoMin ? "text-destructive" : acimaMax ? "text-warning" : "text-foreground"}>{s.quantidade} {s.unidadeMedida}</span></TableCell>
                  <TableCell className="text-xs text-right">R$ {s.precoSugerido?.toFixed(2) || "—"}</TableCell>
                  <TableCell className="text-xs text-right">{s.margem > 0 ? `${s.margem}%` : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right">{s.estoqueMinimo || "—"} / {s.estoqueMaximo || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.localizacao || "—"}</TableCell>
                </>
              )}
              <TableCell><StockBadge abaixoMin={abaixoMin} acimaMax={acimaMax} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => { setDetailId(s._id); setDetailType(type) }}><History className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => openAdjust(type, s._id, s.quantidade)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => openTransfer(type, s._id)}><ArrowRightLeft className="h-3.5 w-3.5" /></Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Estoque</h2><h1 className="text-2xl font-bold tracking-tight text-foreground">Controle de Estoque</h1></div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit flex-wrap">
        {[
          ["01 - Insumos", <BoxesIcon key="1" className="h-3.5 w-3.5" />],
          ["02 - Produtos", <PackageCheck key="2" className="h-3.5 w-3.5" />],
          ["03 - Movimentacoes", <ArrowRightLeft key="3" className="h-3.5 w-3.5" />],
          ["04 - Inventario", <ClipboardList key="4" className="h-3.5 w-3.5" />],
        ].map(([label, icon], i) => (
          <button key={i} onClick={() => setTab(i)} className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${tab === i ? "bg-primary text-white shadow-primary-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{icon}{label}</button>
        ))}
      </div>

      {tab <= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total de Itens</p><p className="mt-1 text-2xl font-bold text-foreground">{currentArr.length}</p></div>
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Abaixo do Minimo</p><p className="mt-1 text-2xl font-bold text-destructive">{countBad(currentArr)}</p></div>
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dentro da Faixa</p><p className="mt-1 text-2xl font-bold text-success">{countOk(currentArr)}</p></div>
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Total Estoque</p><p className="mt-1 text-2xl font-bold text-foreground">R$ {valorTotal(currentArr).toFixed(2)}</p></div>
        </div>
      )}

      {/* Tab 0-1: Position tables */}
      {tab <= 1 && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder={`Buscar ${tab === 0 ? "insumos" : "produtos"}...`} className="pl-10 h-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
          {currentArr.length === 0 ? (
            <div className="p-16 text-center space-y-3"><BoxesIcon className="h-12 w-12 text-muted-foreground/30 mx-auto" /><p className="text-sm text-muted-foreground">Nenhum item em estoque.</p></div>
          ) : renderTable(currentArr, tab === 0 ? "insumo" : "produto")}
        </div>
      )}

      {/* Tab 2: Movimentações */}
      {tab === 2 && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 flex gap-3 flex-wrap">
            <Input placeholder="Buscar movimentacoes..." className="h-10 rounded-xl max-w-sm" />
            <Button className="rounded-xl h-10 shadow-primary-btn gap-2" onClick={() => openAdjust("insumo", "", 0)}><Pencil className="h-4 w-4" /> Ajuste Manual</Button>
            <Button variant="outline" className="rounded-xl h-10 gap-2" onClick={() => openTransfer("insumo", "")}><ArrowRightLeft className="h-4 w-4" /> Transferencia</Button>
          </div>
          {allMovements.length === 0 ? (
            <div className="p-16 text-center space-y-3"><History className="h-12 w-12 text-muted-foreground/30 mx-auto" /><p className="text-sm text-muted-foreground">Nenhuma movimentacao registrada.</p></div>
          ) : (
            <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
              {allMovements.map((m: any) => (
                <div key={m._id} className="flex items-center gap-3 py-3 px-4 hover:bg-accent/20 text-sm">
                  {m.tipo === "entrada" ? <Badge className="bg-success/15 text-success text-[10px] font-bold border-transparent gap-1 shrink-0"><ArrowDown className="h-3 w-3" /> Entrada</Badge>
                    : m.tipo === "saida" ? <Badge className="bg-destructive/15 text-destructive text-[10px] font-bold border-transparent gap-1 shrink-0"><ArrowUp className="h-3 w-3" /> Saida</Badge>
                      : m.tipo === "transferencia" ? <Badge className="bg-primary/10 text-primary text-[10px] font-bold border-transparent gap-1 shrink-0"><ArrowRightLeft className="h-3 w-3" /> Transf</Badge>
                        : <Badge className="bg-muted text-muted-foreground text-[10px] font-bold border-transparent gap-1 shrink-0"><Equal className="h-3 w-3" /> Ajuste</Badge>}
                  <span className="text-muted-foreground text-xs shrink-0 w-16">{m.itemType === "produto" ? "Produto" : "Insumo"}</span>
                  <span className="font-mono font-semibold shrink-0 w-16 text-right">{m.quantidade}</span>
                  <span className="text-muted-foreground text-xs shrink-0">{m.saldoAnterior} → {m.saldoAtual}</span>
                  {m.localOrigem && m.localDestino ? <span className="text-muted-foreground text-xs shrink-0 flex items-center gap-1">{m.localOrigem} <MoveRight className="h-3 w-3" /> {m.localDestino}</span> : null}
                  <span className="text-muted-foreground text-xs truncate flex-1">{m.observacao || m.origem || ""}</span>
                  <span className="text-muted-foreground/50 text-xs shrink-0">{new Date(m._creationTime).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Inventario */}
      {tab === 3 && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap items-center">
            <Button className="rounded-xl h-10 shadow-primary-btn gap-2" onClick={() => setInvStartOpen(true)}><ClipboardList className="h-4 w-4" /> Iniciar Inventario</Button>
          </div>

          {activeInventarioId && invItems ? (
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between flex-wrap gap-3">
                <div><p className="text-sm font-semibold text-foreground">Inventario {inv?.status === "aprovado" ? "Aprovado" : "Em andamento"}</p><p className="text-xs text-muted-foreground">{new Date(inv?.dataInicio || 0).toLocaleDateString("pt-BR")} — {inv?.itensContados}/{inv?.totalItens} contados, {inv?.diferencias} diferenças</p></div>
                {inv?.status !== "aprovado" && <Button className="rounded-xl h-10 shadow-primary-btn" onClick={handleApprove} disabled={saving}>Aprovar e Aplicar Ajustes</Button>}
              </div>
              <Table>
                <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
                  <TableRow><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Item</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Sistema</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Fisico</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Diferenca</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Status</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {invItems.map((item: any) => {
                    const diff = item.diferenca
                    return (
                      <TableRow key={item._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF]">
                        <TableCell className="text-sm font-medium text-foreground">{item.nome} <span className="text-xs text-muted-foreground">({item.itemType})</span></TableCell>
                        <TableCell className="text-xs text-right font-mono">{item.saldoSistema} {item.unidade}</TableCell>
                        <TableCell className="text-xs text-right">
                          {inv?.status === "aprovado" || item.status === "conferido" || item.status === "ajustado" ? (
                            <span className={`font-mono font-semibold ${diff && diff !== 0 ? "text-destructive" : "text-foreground"}`}>{item.quantidadeFisica} {item.unidade}</span>
                          ) : (
                            <Input className="h-8 rounded-lg w-24 text-right font-mono text-xs" type="number" defaultValue={item.saldoSistema} onBlur={(e) => { const v = Number(e.target.value); if (!isNaN(v) && v !== item.quantidadeFisica) updateContagem({ itemId: item._id, quantidadeFisica: v }) }} />
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-right font-mono font-semibold">
                          {diff !== undefined && diff !== null ? <span className={diff === 0 ? "text-success" : diff > 0 ? "text-destructive" : "text-destructive"}>{diff > 0 ? "+" : ""}{diff} {item.unidade}</span> : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>{item.status === "ajustado" ? <Badge className="bg-success/15 text-success text-[10px]">Ajustado</Badge> : item.status === "conferido" ? <Badge className="bg-primary/10 text-primary text-[10px]">Conferido</Badge> : <Badge className="bg-muted text-muted-foreground text-[10px]">Pendente</Badge>}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30"><p className="text-[10px] font-black uppercase tracking-widest text-primary">Historico de Inventarios</p></div>
              {(inventarios ?? []).length === 0 ? (
                <div className="p-16 text-center space-y-3"><ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto" /><p className="text-sm text-muted-foreground">Nenhum inventario realizado.</p></div>
              ) : (
                <Table>
                  <TableHeader className="bg-[#F0F2FF]"><TableRow><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Data</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Escopo</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Itens</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold text-right">Diferencias</TableHead><TableHead className="text-[#3B4280] text-xs uppercase font-bold">Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {inventarios!.map((inv: any) => (
                      <TableRow key={inv._id} className="cursor-pointer hover:bg-accent/30" onClick={() => setActiveInventarioId(inv._id)}>
                        <TableCell className="text-sm">{new Date(inv.dataInicio).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-xs">{inv.escopo === "completo" ? "Completo" : inv.escopo === "insumos" ? "Insumos" : "Produtos"}</TableCell>
                        <TableCell className="text-xs text-right">{inv.itensContados}/{inv.totalItens}</TableCell>
                        <TableCell className="text-xs text-right font-semibold">{inv.diferencias || 0}</TableCell>
                        <TableCell><Badge className={inv.status === "aprovado" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}>{inv.status === "aprovado" ? "Aprovado" : "Em andamento"}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detailId} onOpenChange={(v) => { if (!v) setDetailId(null) }}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] flex flex-col rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setDetailId(null)}><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">{selectedItem?.nome}</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">{selectedItem?.insumoNome} — Saldo: {selectedItem?.quantidade} {selectedItem?.unidadeMedida}</DialogDescription></DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {selectedItem && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Categoria</span><span className="text-foreground">{selectedItem.categoria}</span></div>
                <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Saldo Atual</span><span className="text-foreground font-bold">{selectedItem.quantidade} {selectedItem.unidadeMedida}</span></div>
                <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Min / Max</span><span className="text-foreground">{selectedItem.estoqueMinimo || "—"} / {selectedItem.estoqueMaximo || "—"}</span></div>
                <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">PMP</span><span className="text-foreground">R$ {selectedItem.precoMedio.toFixed(2)}</span></div>
                <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Valor Total</span><span className="text-foreground font-bold">R$ {(selectedItem.quantidade * selectedItem.precoMedio).toFixed(2)}</span></div>
                <div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Localizacao</span><span className="text-foreground">{selectedItem.localizacao || "—"}</span></div>
              </div>
            )}
            <div className="pt-3 border-t border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Movimentacoes</p>
              {!allMovements || allMovements.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma movimentacao.</p> : (
                <div className="divide-y divide-border">{allMovements.map((h: any) => (
                  <div key={h._id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 text-sm">
                    {h.tipo === "entrada" ? <Badge className="bg-success/15 text-success text-[10px] font-bold border-transparent gap-1 shrink-0"><ArrowDown className="h-3 w-3" /> Entrada</Badge>
                      : h.tipo === "saida" ? <Badge className="bg-destructive/15 text-destructive text-[10px] font-bold border-transparent gap-1 shrink-0"><ArrowUp className="h-3 w-3" /> Saida</Badge>
                        : h.tipo === "transferencia" ? <Badge className="bg-primary/10 text-primary text-[10px] font-bold border-transparent gap-1 shrink-0"><ArrowRightLeft className="h-3 w-3" /> Transf</Badge>
                          : <Badge className="bg-muted text-muted-foreground text-[10px] font-bold border-transparent gap-1 shrink-0">Ajuste</Badge>}
                    <span className="font-mono shrink-0">{h.quantidade}</span>
                    <span className="text-muted-foreground text-xs shrink-0">{h.saldoAnterior} → {h.saldoAtual}</span>
                    <span className="text-muted-foreground text-xs truncate flex-1">{h.observacao || h.origem}</span>
                    <span className="text-xs text-muted-foreground/50 shrink-0">{new Date(h._creationTime).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                ))}</div>
              )}
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => { const t = detailType; const id = selectedItem?._id || ""; const q = selectedItem?.quantidade || 0; setDetailId(null); openAdjust(t, id, q) }}><Pencil className="h-4 w-4" /> Ajustar</Button>
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => { const t = detailType; const id = selectedItem?._id || ""; setDetailId(null); openTransfer(t, id) }}><ArrowRightLeft className="h-4 w-4" /> Transferir</Button>
            <Button className="rounded-xl flex-1 h-11 shadow-primary-btn" onClick={() => setDetailId(null)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ajuste Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">Ajustar Estoque</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Defina a nova quantidade em estoque.</DialogDescription></DialogHeader></div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nova Quantidade *</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={adjustForm.novaQuantidade || ""} onChange={(e) => setAdjustForm({ ...adjustForm, novaQuantidade: Number(e.target.value) || 0 })} /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacao</Label><Input className="h-10 rounded-xl" value={adjustForm.observacao} onChange={(e) => setAdjustForm({ ...adjustForm, observacao: e.target.value })} placeholder="Ex: Inventario semanal" /></div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setAdjustOpen(false)}>Cancelar</Button><Button onClick={handleAdjust} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Ajustando..." : "Confirmar Ajuste"}</Button></div>
        </DialogContent>
      </Dialog>

      {/* Transferencia Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">Transferir Estoque</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Movimente itens entre locais de armazenagem.</DialogDescription></DialogHeader></div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantidade *</Label><Input className="h-10 rounded-xl font-mono text-right" type="number" value={transferForm.quantidade || ""} onChange={(e) => setTransferForm({ ...transferForm, quantidade: Number(e.target.value) || 0 })} /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destino *</Label><Input className="h-10 rounded-xl" value={transferForm.localDestino} onChange={(e) => setTransferForm({ ...transferForm, localDestino: e.target.value })} placeholder="Ex: Armazem B - Rua 3" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observacao</Label><Input className="h-10 rounded-xl" value={transferForm.observacao} onChange={(e) => setTransferForm({ ...transferForm, observacao: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setTransferOpen(false)}>Cancelar</Button><Button onClick={handleTransfer} disabled={saving || !transferForm.quantidade || !transferForm.localDestino} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Transferindo..." : "Confirmar Transferencia"}</Button></div>
        </DialogContent>
      </Dialog>

      {/* Iniciar Inventario Dialog */}
      <Dialog open={invStartOpen} onOpenChange={setInvStartOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className="bg-primary px-6 pt-6 pb-4 relative"><DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"><XIcon className="h-4 w-4" /></DialogClose><DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">Iniciar Inventario</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">Selecione o escopo da contagem.</DialogDescription></DialogHeader></div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex gap-2 flex-col">
              {[
                ["completo", "Completo (insumos + produtos)"],
                ["insumos", "Somente Insumos"],
                ["produtos", "Somente Produtos"],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setInvScope(value as any)} className={`text-sm text-left px-4 py-3 rounded-xl border transition-all ${invScope === value ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>{label}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20"><Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setInvStartOpen(false)}>Cancelar</Button><Button onClick={handleStartInventory} disabled={saving} className="rounded-xl flex-1 h-11 shadow-primary-btn">{saving ? "Iniciando..." : "Iniciar Contagem"}</Button></div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmacao (SystemDesign.md §5) */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden" showCloseButton={false}>
          <div className={`${confirmData?.destructive ? "bg-destructive" : "bg-primary"} px-6 pt-6 pb-4 relative`}>
            <DialogClose className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30" onClick={() => setConfirmOpen(false)}><XIcon className="h-4 w-4" /></DialogClose>
            <DialogHeader className="p-0"><DialogTitle className="text-xl font-bold tracking-tight text-white">{confirmData?.title || "Confirmar Acao"}</DialogTitle><DialogDescription className="text-sm text-white/70 mt-1">{confirmData?.description || "Tem certeza que deseja prosseguir?"}</DialogDescription></DialogHeader>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">{confirmData?.destructive ? "Esta acao nao pode ser desfeita." : "Confirme para prosseguir com a operacao."}</p>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <Button variant="outline" className="rounded-xl flex-1 h-11" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={() => { if (confirmData) { setConfirmOpen(false); confirmData.onConfirm() } }} disabled={saving} className={`rounded-xl flex-1 h-11 shadow-primary-btn gap-2 ${confirmData?.destructive ? "bg-destructive hover:bg-destructive/90" : ""}`}>{saving ? "Processando..." : "Confirmar"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
