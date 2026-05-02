import { mutation, query, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!profile) return null
    const user = await ctx.db.get(userId)
    return {
      ...profile,
      email: user?.email,
      userId,
    }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    const currentProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!currentProfile || currentProfile.role !== "Admin") {
      throw new Error("Apenas Admin pode listar usuarios")
    }
    const profiles = await ctx.db.query("userProfiles").collect()
    const users = await Promise.all(
      profiles.map(async (p) => {
        const user = await ctx.db.get(p.userId)
        return { ...p, email: user?.email }
      })
    )
    return users
  },
})

export const createProfile = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("Admin"),
      v.literal("Producao"),
      v.literal("Estoque"),
      v.literal("Vendas"),
      v.literal("Financeiro"),
      v.literal("Visualizador")
    ),
    position: v.optional(v.string()),
    admissionDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    const adminProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!adminProfile || adminProfile.role !== "Admin") {
      throw new Error("Apenas Admin pode criar usuarios")
    }
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()
    if (existing) throw new Error("Usuario ja possui perfil")
    await ctx.db.insert("userProfiles", {
      ...args,
      status: "Ativo",
      sessionTimeoutMinutes: 240,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
      createdAt: Date.now(),
    })
    // Audit log
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "Usuarios",
      action: "CRIAR",
      entity: "Usuario",
      entityId: args.userId,
      description: `Usuario ${args.fullName} criado`,
    })
  },
})

export const updateProfile = mutation({
  args: {
    profileId: v.id("userProfiles"),
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("Admin"),
        v.literal("Producao"),
        v.literal("Estoque"),
        v.literal("Vendas"),
        v.literal("Financeiro"),
        v.literal("Visualizador")
      )
    ),
    position: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Ativo"), v.literal("Inativo"))),
    twoFactorEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    const adminProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!adminProfile || adminProfile.role !== "Admin") {
      throw new Error("Apenas Admin pode editar usuarios")
    }
    const { profileId, ...updates } = args
    await ctx.db.patch(profileId, updates)
    await ctx.db.insert("auditLogs", {
      userId,
      timestamp: Date.now(),
      module: "Usuarios",
      action: "EDITAR",
      entity: "Usuario",
      entityId: profileId,
      description: "Perfil de usuario atualizado",
    })
  },
})

export const checkBlocked = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!profile) return null
    if (profile.blockedUntil && profile.blockedUntil > Date.now()) {
      return { blocked: true, blockedUntil: profile.blockedUntil }
    }
    return { blocked: false, blockedUntil: null }
  },
})

export const recordFailedLogin = mutation({
  args: { targetEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.targetEmail))
      .first()
    if (!user) return
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first()
    if (!profile) return

    const attempts = (profile.failedLoginAttempts ?? 0) + 1
    const updates: any = { failedLoginAttempts: attempts }

    if (attempts >= 9) {
      updates.blockedUntil = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 dias
    } else if (attempts >= 6) {
      updates.blockedUntil = Date.now() + 30 * 60 * 1000 // 30 min
    } else if (attempts >= 3) {
      updates.blockedUntil = Date.now() + 5 * 60 * 1000 // 5 min
    }

    await ctx.db.patch(profile._id, updates)
  },
})

export const resetLoginAttempts = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!profile) return
    await ctx.db.patch(profile._id, {
      failedLoginAttempts: 0,
      blockedUntil: undefined,
    })
  },
})

export const initAdminMutation = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first()
    if (existing) throw new Error("Email ja cadastrado")

    const existingAdmin = await ctx.db
      .query("userProfiles")
      .withIndex("by_role", (q) => q.eq("role", "Admin"))
      .first()
    if (existingAdmin) throw new Error("Admin ja existe no sistema")

    const userId = await ctx.db.insert("users", {
      email: args.email,
    })

    await ctx.db.insert("authAccounts", {
      userId,
      provider: "password",
      providerAccountId: args.email,
      secret: args.passwordHash,
    })

    await ctx.db.insert("userProfiles", {
      userId,
      fullName: args.fullName,
      role: "Admin",
      status: "Ativo",
      sessionTimeoutMinutes: 240,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
      createdAt: Date.now(),
    })

    return { success: true, userId }
  },
})

export const createFirstProfile = mutation({
  args: {
    fullName: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const allProfiles = await ctx.db.query("userProfiles").collect()
    if (allProfiles.length > 0) throw new Error("Sistema ja possui usuarios")

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (existing) throw new Error("Voce ja possui um perfil")

    await ctx.db.insert("userProfiles", {
      userId,
      fullName: args.fullName,
      phone: args.phone,
      role: "Admin",
      position: "Administrador",
      status: "Ativo",
      sessionTimeoutMinutes: 240,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
      createdAt: Date.now(),
    })

    return { success: true }
  },
})

export const isEmpty = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("userProfiles").collect()
    return profiles.length === 0
  },
})
