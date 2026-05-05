import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error("Not authenticated")
  return userId
}

async function requireRole(ctx: any, allowed: string[]) {
  const userId = await requireAuth(ctx)
  const profile = await ctx.db.query("userProfiles").withIndex("by_userId", (q: any) => q.eq("userId", userId)).first()
  if (!profile || !allowed.includes(profile.role)) throw new Error("Acesso negado")
  return { userId, profile }
}

export const list = query({
  args: {
    status: v.optional(v.string()),
    purchaseId: v.optional(v.id("purchases")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    if (args.purchaseId) {
      return await ctx.db.query("contasPagar").withIndex("by_purchaseId", (q: any) => q.eq("purchaseId", args.purchaseId)).order("asc").take(100)
    }
    if (args.status) {
      return await ctx.db.query("contasPagar").withIndex("by_status", (q: any) => q.eq("status", args.status)).order("desc").take(200)
    }
    return await ctx.db.query("contasPagar").order("desc").take(200)
  },
})

export const get = query({
  args: { contaId: v.id("contasPagar") },
  handler: async (ctx, args) => {
    await requireAuth(ctx)
    return await ctx.db.get(args.contaId)
  },
})

export const registerPayment = mutation({
  args: {
    contaId: v.id("contasPagar"),
    dataPagamento: v.number(),
    comprovanteStorageId: v.optional(v.id("_storage")),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Financeiro"])
    const conta = await ctx.db.get(args.contaId)
    if (!conta) throw new Error("Conta nao encontrada")
    if (conta.status === "Paga" || conta.status === "Cancelada") throw new Error("Conta ja esta paga ou cancelada")

    await ctx.db.patch(args.contaId, {
      status: "Paga",
      dataPagamento: args.dataPagamento,
      comprovanteStorageId: args.comprovanteStorageId,
      observacao: args.observacao,
      updatedAt: Date.now(),
    })

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Financeiro", action: "EDITAR",
      entity: "ContaPagar", entityId: args.contaId,
      description: `Pagamento registrado - R$ ${conta.valor.toFixed(2)}`,
    })
  },
})

export const cancel = mutation({
  args: {
    contaId: v.id("contasPagar"),
    motivo: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireRole(ctx, ["Admin", "Financeiro"])
    const conta = await ctx.db.get(args.contaId)
    if (!conta) throw new Error("Conta nao encontrada")

    await ctx.db.patch(args.contaId, {
      status: "Cancelada",
      observacao: `${args.motivo}`,
      updatedAt: Date.now(),
    })

    await ctx.db.insert("auditLogs", {
      userId, timestamp: Date.now(), module: "Financeiro", action: "EDITAR",
      entity: "ContaPagar", entityId: args.contaId,
      description: `Conta cancelada: ${args.motivo}`,
    })
  },
})
