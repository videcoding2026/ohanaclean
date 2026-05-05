import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { logMovement } from "./stock"

async function requireAuth(ctx: any) { const userId = await getAuthUserId(ctx); if (!userId) throw new Error("Not authenticated"); return userId }
async function requireRole(ctx: any, allowed: string[]) { const userId = await requireAuth(ctx); const profile = await ctx.db.query("userProfiles").withIndex("by_userId", (q: any) => q.eq("userId", userId)).first(); if (!profile || !allowed.includes(profile.role)) throw new Error("Acesso negado"); return { userId, profile } }

async function addHistory(ctx: any, orderId: any, statusAnterior: string, statusNovo: string, usuarioId: string, usuarioNome: string, observacao?: string, automatico?: boolean) {
  await ctx.db.insert("orderStatusHistory", { orderId, statusAnterior, statusNovo, data: Date.now(), usuarioId, usuarioNome, observacao, automatico: automatico || false })
}

async function generateNumero(ctx: any, tipo: "orcamento" | "pedido"): Promise<string> {
  const company = await ctx.db.query("companies").order("desc").first()
  const prefixo = tipo === "orcamento" ? (company?.prefixoOrcamento || "ORC") : (company?.prefixoPedido || "PED")
  const ano = new Date().getFullYear().toString().slice(-2)
  const docs = await ctx.db.query("orders").withIndex("by_numero", (q: any) => q.gte("numero", `${prefixo}-${ano}-`).lt("numero", `${prefixo}-${ano}-\uffff`)).order("desc").take(1)
  const ultimoNum = docs.length > 0 ? parseInt(docs[0].numero!.split("-")[2] || "0", 10) : 0
  return `${prefixo}-${ano}-${String(ultimoNum + 1).padStart(4, "0")}`
}

function createContasReceber(ctx: any, orderId: any, clientId: any, clienteNome: string, total: number, data: number, formaPagamento: string, condPagamento: string, statusInicial: string) {
  const parcela = condPagamento === "30/60d" ? 2 : condPagamento === "30/60/90d" ? 3 : 1
  const valorParcela = Math.round((total / parcela) * 100) / 100
  const now = new Date(data)
  const promises = []
  for (let i = 0; i < parcela; i++) {
    const vencimento = new Date(now); vencimento.setMonth(vencimento.getMonth() + i * (condPagamento === "30/60/90d" ? 1 : 1))
    promises.push(ctx.db.insert("contasReceber", { orderId, clientId, clienteNome, descricao: `Venda ${i + 1}/${parcela}`, valor: valorParcela, dataVencimento: vencimento.getTime(), dataPagamento: statusInicial === "Paga" ? data : undefined, formaPagamento, status: statusInicial, parcela: `${i + 1}/${parcela}`, createdAt: Date.now(), updatedAt: Date.now() }))
  }
  return Promise.all(promises)
}

export const list = query({ args: { status: v.optional(v.string()), tipo: v.optional(v.union(v.literal("orcamento"), v.literal("pedido"))) }, handler: async (ctx, args) => { await requireAuth(ctx); let q: any = ctx.db.query("orders"); if (args.status) q = q.withIndex("by_status", (qx: any) => qx.eq("status", args.status)); const r = await q.order("desc").take(200); return args.tipo ? r.filter((o: any) => o.tipo === args.tipo) : r } })
export const get = query({ args: { orderId: v.id("orders") }, handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.get(args.orderId) } })
export const getItems = query({ args: { orderId: v.id("orders") }, handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.query("orderItems").withIndex("by_orderId", (q: any) => q.eq("orderId", args.orderId)).order("asc").collect() } })
export const getHistory = query({ args: { orderId: v.id("orders") }, handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.query("orderStatusHistory").withIndex("by_orderId", (q: any) => q.eq("orderId", args.orderId)).order("desc").collect() } })
export const getContasReceber = query({ args: { orderId: v.id("orders") }, handler: async (ctx, args) => { await requireAuth(ctx); return await ctx.db.query("contasReceber").withIndex("by_orderId", (q: any) => q.eq("orderId", args.orderId)).order("asc").collect() } })

export const create = mutation({
  args: {
    tipo: v.union(v.literal("orcamento"), v.literal("pedido")),
    clientId: v.id("clients"), data: v.number(),
    items: v.array(v.object({ productId: v.id("products"), productPackagingId: v.optional(v.id("productPackagings")), nome: v.optional(v.string()), quantidade: v.number(), precoUnitario: v.number(), subtotal: v.number(), custoUnitario: v.optional(v.number()), margem: v.optional(v.number()) })),
    descontoGeral: v.optional(v.number()), descontoPercentual: v.optional(v.number()),
    frete: v.optional(v.number()), freteGratis: v.optional(v.boolean()),
    condPagamento: v.optional(v.string()), formaPagamento: v.optional(v.string()),
    modalidadeEntrega: v.optional(v.union(v.literal("retirada"), v.literal("entrega"))),
    dataPrevistaEntrega: v.optional(v.number()), enderecoEntrega: v.optional(v.string()),
    observacoes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Vendas"])
    const { items, ...data } = args
    const subtotal = items.reduce((s: number, i: any) => s + i.subtotal, 0)
    const descPct = (args.descontoPercentual || 0) / 100
    const descontoG = args.descontoGeral || 0
    const descValor = Math.max(descontoG, subtotal * descPct)
    const total = subtotal - descValor + (args.freteGratis ? 0 : (args.frete || 0))

    const numero = await generateNumero(ctx, args.tipo)
    const orderId = await ctx.db.insert("orders", { ...data, numero, subtotal, descontoGeral: descValor, total, data: args.data, status: "Confirmado", vendedorId: userId, vendedorNome: profile.fullName, createdAt: Date.now(), updatedAt: Date.now() } as any)

    for (const item of items) {
      await ctx.db.insert("orderItems", { ...item, orderId, createdAt: Date.now(), updatedAt: Date.now() } as any)
      if (args.tipo === "pedido" && item.productPackagingId) {
        const pkg = await ctx.db.get(item.productPackagingId)
        if (pkg && (pkg.quantidade || 0) >= item.quantidade) {
          const anterior = pkg.quantidade || 0
          await ctx.db.patch(item.productPackagingId, { quantidade: anterior - item.quantidade, updatedAt: Date.now() } as any)
          await logMovement(ctx, { itemType: "produto", productId: item.productId, productPackagingId: item.productPackagingId, tipo: "saida", quantidade: item.quantidade, saldoAnterior: anterior, saldoAtual: anterior - item.quantidade, origem: "venda", referenciaId: orderId, userId, observacao: `Pedido ${numero}` })
        }
      }
    }

    const client = await ctx.db.get(args.clientId)
    const clienteNome = client?.pfName || client?.pjNomeFantasia || client?.pjRazaoSocial || ""
    const ehAVista = args.formaPagamento === "PIX" || args.formaPagamento === "Dinheiro" || args.formaPagamento === "Cartao Debito"
    if (args.tipo === "pedido") await createContasReceber(ctx, orderId, args.clientId, clienteNome, total, args.data, args.formaPagamento || "", args.condPagamento || "", ehAVista ? "Paga" : "Aberta")

    await addHistory(ctx, orderId, "", "Confirmado", userId, profile.fullName, args.tipo === "orcamento" ? "Orcamento criado" : "Pedido criado", false)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Vendas", action: "CRIAR", entity: args.tipo === "orcamento" ? "Orcamento" : "Pedido", entityId: orderId, description: `${numero} criado` })
    return { orderId, numero, total }
  },
})

export const updateStatus = mutation({
  args: { orderId: v.id("orders"), status: v.union(v.literal("Em separacao"), v.literal("Aguardando retirada"), v.literal("Saiu para entrega"), v.literal("Concluido")), observacao: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Vendas", "Estoque"])
    const order = await ctx.db.get(args.orderId)
    if (!order) throw new Error("Pedido nao encontrado")
    const statusAnterior = order.status
    await ctx.db.patch(args.orderId, { status: args.status, updatedAt: Date.now() })
    await addHistory(ctx, args.orderId, statusAnterior, args.status, userId, profile.fullName, args.observacao, false)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Vendas", action: "EDITAR", entity: "Pedido", entityId: args.orderId, description: `Status: ${statusAnterior} → ${args.status}` })
  },
})

export const convertToPedido = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Vendas"])
    const order = await ctx.db.get(args.orderId)
    if (!order || order.tipo !== "orcamento" || order.status !== "Confirmado") throw new Error("Orcamento invalido para conversao")
    const numero = await generateNumero(ctx, "pedido")
    const items = await ctx.db.query("orderItems").withIndex("by_orderId", (q: any) => q.eq("orderId", args.orderId)).collect()
    for (const item of items) {
      if (item.productPackagingId) {
        const pkg = await ctx.db.get(item.productPackagingId)
        if (pkg && (pkg.quantidade || 0) >= item.quantidade) {
          const ant = pkg.quantidade || 0
          await ctx.db.patch(item.productPackagingId, { quantidade: ant - item.quantidade, updatedAt: Date.now() } as any)
          await logMovement(ctx, { itemType: "produto", productId: item.productId, productPackagingId: item.productPackagingId, tipo: "saida", quantidade: item.quantidade, saldoAnterior: ant, saldoAtual: ant - item.quantidade, origem: "venda", referenciaId: args.orderId, userId, observacao: `Convertido em pedido ${numero}` })
        }
      }
    }
    const client = await ctx.db.get(order.clientId)
    const clienteNome = client?.pfName || client?.pjNomeFantasia || client?.pjRazaoSocial || ""
    const ehAVista = order.formaPagamento === "PIX" || order.formaPagamento === "Dinheiro"
    await createContasReceber(ctx, args.orderId, order.clientId, clienteNome, order.total || 0, order.data, order.formaPagamento || "", order.condPagamento || "", ehAVista ? "Paga" : "Aberta")
    await ctx.db.patch(args.orderId, { tipo: "pedido", numero, updatedAt: Date.now() })
    await addHistory(ctx, args.orderId, "Confirmado", "Confirmado", userId, profile.fullName, `Convertido para pedido ${numero}`, false)
    return { numero }
  },
})

export const cancelOrder = mutation({
  args: { orderId: v.id("orders"), motivo: v.string() },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireRole(ctx, ["Admin", "Vendas"])
    const order = await ctx.db.get(args.orderId)
    if (!order || order.status === "Cancelado" || order.status === "Concluido") throw new Error("Status invalido")
    const items = await ctx.db.query("orderItems").withIndex("by_orderId", (q: any) => q.eq("orderId", args.orderId)).collect()
    for (const item of items) {
      if (item.productPackagingId && order.tipo === "pedido") {
        const pkg = await ctx.db.get(item.productPackagingId)
        if (pkg) {
          const ant = pkg.quantidade || 0
          await ctx.db.patch(item.productPackagingId, { quantidade: ant + item.quantidade, updatedAt: Date.now() } as any)
          await logMovement(ctx, { itemType: "produto", productId: item.productId, productPackagingId: item.productPackagingId, tipo: "entrada", quantidade: item.quantidade, saldoAnterior: ant, saldoAtual: ant + item.quantidade, origem: "venda", referenciaId: args.orderId, userId, observacao: `Cancelamento: ${args.motivo}` })
        }
      }
    }
    const contas = await ctx.db.query("contasReceber").withIndex("by_orderId", (q: any) => q.eq("orderId", args.orderId)).collect()
    for (const c of contas) { if (c.status !== "Cancelada") await ctx.db.patch(c._id, { status: "Cancelada", updatedAt: Date.now() }) }
    await ctx.db.patch(args.orderId, { status: "Cancelado", motivoCancelamento: args.motivo, updatedAt: Date.now() })
    await addHistory(ctx, args.orderId, order.status, "Cancelado", userId, profile.fullName, args.motivo, false)
    await ctx.db.insert("auditLogs", { userId, timestamp: Date.now(), module: "Vendas", action: "EDITAR", entity: "Pedido", entityId: args.orderId, description: `Cancelado: ${args.motivo}` })
  },
})

export const getClientTableForOrder = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    const link = await ctx.db.query("priceTableClients").withIndex("by_clientId", (q: any) => q.eq("clientId", args.clientId)).first()
    if (!link) return null
    const table = await ctx.db.get(link.tableId)
    if (!table || table.status !== "Ativa") return null
    const items = await ctx.db.query("priceTableItems").withIndex("by_tableId", (q: any) => q.eq("tableId", table._id)).collect()
    return { table, items }
  },
})
