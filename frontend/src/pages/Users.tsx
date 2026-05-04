import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Shield, Eye, EyeOff, Clock, Pencil, ChevronDown, ChevronUp, Info } from "lucide-react";

interface UserProfile {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: "Admin" | "Producao" | "Estoque" | "Vendas" | "Financeiro" | "Visualizador";
  status: "Ativo" | "Inativo";
  position?: string;
  sessionTimeoutMinutes?: number;
  twoFactorEnabled?: boolean;
  createdAt: number;
}

const roleConfig = {
  Admin: { label: "Administrador", color: "bg-primary/10 text-primary border-primary/20", session: "4h", maskedValues: false as const },
  Producao: { label: "Producao", color: "bg-secondary/10 text-secondary border-secondary/20", session: "8h", maskedValues: true as const },
  Estoque: { label: "Estoque", color: "bg-success/10 text-success border-success/20", session: "8h", maskedValues: true as const },
  Vendas: { label: "Vendas", color: "bg-warning/10 text-warning border-warning/20", session: "6h", maskedValues: true as const },
  Financeiro: { label: "Financeiro", color: "bg-destructive/10 text-destructive border-destructive/20", session: "4h", maskedValues: true as const },
  Visualizador: { label: "Visualizador", color: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20", session: "4h", maskedValues: false as const },
};

const permissionMatrix: Record<string, Record<string, string>> = {
  "Config. Empresa": { Admin: "total", Producao: "nenhum", Estoque: "nenhum", Vendas: "nenhum", Financeiro: "nenhum", Visualizador: "nenhum" },
  "Usuarios": { Admin: "total", Producao: "nenhum", Estoque: "nenhum", Vendas: "nenhum", Financeiro: "nenhum", Visualizador: "nenhum" },
  "Formulas": { Admin: "total", Producao: "leitura", Estoque: "nenhum", Vendas: "nenhum", Financeiro: "nenhum", Visualizador: "leitura" },
  "Insumos": { Admin: "total", Producao: "leitura", Estoque: "total", Vendas: "nenhum", Financeiro: "nenhum", Visualizador: "leitura" },
  "Producao": { Admin: "total", Producao: "total", Estoque: "leitura", Vendas: "nenhum", Financeiro: "nenhum", Visualizador: "leitura" },
  "Estoque": { Admin: "total", Producao: "leitura", Estoque: "total", Vendas: "leitura", Financeiro: "nenhum", Visualizador: "leitura" },
  "Clientes": { Admin: "total", Producao: "nenhum", Estoque: "nenhum", Vendas: "total", Financeiro: "leitura", Visualizador: "leitura" },
  "Pedidos": { Admin: "total", Producao: "nenhum", Estoque: "nenhum", Vendas: "total", Financeiro: "leitura", Visualizador: "leitura" },
  "Financeiro": { Admin: "total", Producao: "nenhum", Estoque: "nenhum", Vendas: "nenhum", Financeiro: "total", Visualizador: "leitura" },
  "Relatorios": { Admin: "total", Producao: "leitura", Estoque: "leitura", Vendas: "leitura", Financeiro: "total", Visualizador: "leitura" },
  "Dashboard": { Admin: "total", Producao: "leitura", Estoque: "leitura", Vendas: "leitura", Financeiro: "leitura", Visualizador: "leitura" },
};

function getPermissionBadge(value: string) {
  if (value === "total") return <Badge className="bg-success/15 text-success text-[9px] rounded-md px-1.5">Total</Badge>;
  if (value === "leitura") return <Badge className="bg-primary/10 text-primary text-[9px] rounded-md px-1.5">Leitura</Badge>;
  return <Badge className="bg-muted text-muted-foreground text-[9px] rounded-md px-1.5">Nenhum</Badge>;
}

export default function UsersPage() {
  const usersQuery = useQuery(api.users.list);
  const myProfile = useQuery(api.users.getMe);
  const updateProfile = useMutation(api.users.updateProfile);
  const isAdmin = myProfile?.role === "Admin";
  const users: UserProfile[] = (usersQuery ?? []).map((u: any) => ({
    _id: u._id,
    fullName: u.fullName,
    email: u.email ?? undefined,
    phone: u.phone ?? undefined,
    role: u.role,
    status: u.status,
    position: u.position,
    sessionTimeoutMinutes: u.sessionTimeoutMinutes,
    twoFactorEnabled: u.twoFactorEnabled,
    createdAt: u.createdAt,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditDialog = (user: UserProfile) => {
    setEditingUser({ ...user })
    setEditOpen(true)
  }

  const handleEditSave = async () => {
    if (!editingUser) return
    setEditLoading(true)
    try {
      await updateProfile({
        profileId: editingUser._id as any,
        fullName: editingUser.fullName,
        role: editingUser.role,
        position: editingUser.position,
        phone: editingUser.phone as any,
        status: editingUser.status,
      })
      setEditOpen(false)
      setEditingUser(null)
    } catch (err: any) {
      alert("Erro ao salvar: " + (err?.message ?? ""))
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Usuarios</h2>
          <p className="text-muted-foreground text-sm">Gerencie o acesso e as permissoes da sua equipe</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-muted/20 border border-border px-3 py-2 text-xs text-muted-foreground">
          {isAdmin ? (
            <>
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>Novos usuarios se cadastram via pagina de <strong className="text-foreground">Login</strong>. Depois, clique em um usuario abaixo para editar permissoes.</span>
            </>
          ) : (
            <>
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span>Voce nao tem permissao para gerenciar usuarios. Apenas <strong className="text-foreground">Administradores</strong> podem ver e editar esta lista.</span>
            </>
          )}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-[32px] border-none shadow-modal p-0 overflow-hidden">
          <div className="bg-primary px-6 pt-6 pb-4">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">Editar Usuario</DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">Altere os dados e permissoes do usuario.</DialogDescription>
            </DialogHeader>
          </div>
          {editingUser && (
            <div className="grid gap-4 px-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Completo</Label>
                <Input
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefone</Label>
                <Input
                  value={editingUser.phone ?? ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cargo</Label>
                <Input
                  value={editingUser.position ?? ""}
                  onChange={(e) => setEditingUser({ ...editingUser, position: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Perfil de Acesso</Label>
                <Select value={editingUser.role} onValueChange={(v) => v && setEditingUser({ ...editingUser, role: v as any })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-lg">
                    {Object.keys(roleConfig).map((r) => <SelectItem key={r} value={r}>{roleConfig[r as keyof typeof roleConfig].label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</Label>
                <Select value={editingUser.status} onValueChange={(v) => v && setEditingUser({ ...editingUser, status: v as any })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-lg">
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="px-6 py-4 border-t border-border">
            <Button onClick={handleEditSave} disabled={editLoading} className="w-full rounded-xl bg-primary text-white font-bold shadow-primary-btn h-11">
              {editLoading ? "Salvando..." : "Salvar Alteracoes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              className="pl-10 h-10 rounded-xl bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Nenhum usuario encontrado.</div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Usuario</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Perfil</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Valores</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Sessao</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Status</TableHead>
                <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12 w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const config = roleConfig[user.role];
                return (
                  <TableRow key={user._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border group cursor-pointer hover:bg-accent/30 transition-colors">
                    <TableCell className="py-4" onClick={() => openEditDialog(user)}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold ${config.color}`}>
                          {user.fullName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm leading-none mb-1">{user.fullName}</span>
                          <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => openEditDialog(user)}>
                      <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => openEditDialog(user)}>
                      {config.maskedValues ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> Camuflado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-success">
                          <Eye className="h-3 w-3" /> Visivel
                        </span>
                      )}
                    </TableCell>
                    <TableCell onClick={() => openEditDialog(user)}>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {config.session}
                      </span>
                    </TableCell>
                    <TableCell onClick={() => openEditDialog(user)}>
                      <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none ${
                        user.status === "Ativo" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                      }`}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent" onClick={() => openEditDialog(user)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="rounded-2xl border border-border shadow-card overflow-hidden">
        <button
          onClick={() => setShowMatrix(!showMatrix)}
          className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Matriz de Permissoes (RBAC)</span>
          </div>
          {showMatrix ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showMatrix && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-xs font-bold uppercase tracking-wider bg-muted/30 sticky left-0 min-w-[140px]">Modulo</TableHead>
                  {Object.keys(roleConfig).map((role) => (
                    <TableHead key={role} className="text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap">
                      {roleConfig[role as keyof typeof roleConfig].label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(permissionMatrix).map(([module, roles]) => (
                  <TableRow key={module} className="border-b border-border even:bg-muted/10">
                    <TableCell className="text-xs font-semibold text-foreground sticky left-0 bg-inherit min-w-[140px]">{module}</TableCell>
                    {Object.entries(roles).map(([role, access]) => (
                      <TableCell key={role} className="text-center">{getPermissionBadge(access)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
