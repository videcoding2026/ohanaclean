"use node"

import { action } from "./_generated/server"
import { v } from "convex/values"
import { Scrypt } from "lucia"

export const initAdminAction = action({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.string(),
  },
  handler: async (ctx, args) => {
    const hash = await new Scrypt().hash(args.password)
    await ctx.runMutation("users:initAdminMutation" as any, {
      email: args.email,
      passwordHash: hash,
      fullName: args.fullName,
    })
    return { success: true, email: args.email }
  },
})
