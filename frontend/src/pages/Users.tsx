import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Search, Shield, Eye, EyeOff, Clock } from "lucide-react";

interface UserProfile {
  _id: string;
  fullName: string;
  email?: string;
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
  const users: UserProfile[] = (usersQuery ?? []).map((u: any) => ({
    _id: u._id,
    fullName: u.fullName,
    email: u.email ?? undefined,
    role: u.role,
    status: u.status,
    position: u.position,
    sessionTimeoutMinutes: u.sessionTimeoutMinutes,
    twoFactorEnabled: u.twoFactorEnabled,
    createdAt: u.createdAt,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Admin");

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Usuarios</h2>
          <p className="text-muted-foreground text-sm">Gerencie o acesso e as permissoes da sua equipe</p>
        </div>

        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-4 py-2 text-sm font-bold text-white bg-primary shadow-primary-btn transition-all hover:bg-primary/90">
            <UserPlus className="h-4 w-4" />
            Novo Usuario
          </DialogTrigger>
          <DialogContent className="sm:max-w-[460px] rounded-[32px] border-none shadow-modal bg-card/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">Convidar Usuario</DialogTitle>
              <DialogDescription>
                Adicione um novo membro a equipe e defina seu nivel de acesso.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Completo</Label>
                <Input id="name" placeholder="Ex: Maria Pereira" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">E-mail</Label>
                <Input id="email" type="email" placeholder="maria@email.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefone / WhatsApp</Label>
                <Input id="phone" placeholder="(00) 00000-0000" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cargo / Funcao</Label>
                <Input id="position" placeholder="Ex: Operador de Producao" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Perfil de Acesso</Label>
                <Select value={selectedRole} onValueChange={(v) => v && setSelectedRole(v)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-lg">
                    <SelectItem value="Admin">Administrador</SelectItem>
                    <SelectItem value="Producao">Producao</SelectItem>
                    <SelectItem value="Estoque">Estoque</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Visualizador">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-primary-btn h-11 transition-all">
                Enviar Convite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="w-full justify-start rounded-xl bg-card border border-border p-1">
          <TabsTrigger value="usuarios" className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">Usuarios</TabsTrigger>
          <TabsTrigger value="permissoes" className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">Matriz de Permissoes</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-6">
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

            <Table>
              <TableHeader className="bg-[#F0F2FF] dark:bg-muted/50">
                <TableRow className="hover:bg-transparent border-b border-[#EEF1FF] dark:border-border">
                  <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Usuario</TableHead>
                  <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Perfil</TableHead>
                  <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Valores</TableHead>
                  <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Sessao</TableHead>
                  <TableHead className="text-[#3B4280] dark:text-foreground font-bold text-xs uppercase tracking-wider h-12">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const config = roleConfig[user.role];
                  return (
                    <TableRow key={user._id} className="even:bg-[#FAFBFF] odd:bg-white dark:even:bg-muted/10 dark:odd:bg-card border-b border-[#EEF1FF] dark:border-border group hover:bg-accent/30 transition-colors">
                      <TableCell className="py-4">
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
                      <TableCell>
                        <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {config.maskedValues ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <EyeOff className="h-3 w-3" />
                            Camuflado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-success">
                            <Eye className="h-3 w-3" />
                            Visivel
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {config.session}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none ${
                          user.status === "Ativo"
                            ? "bg-success/15 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permissoes" className="mt-6">
          <Card className="shadow-card border-border overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Matriz de Permissoes (RBAC)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
