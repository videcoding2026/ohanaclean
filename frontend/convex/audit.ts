import { query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!profile || profile.role !== "Admin") {
      throw new Error("Apenas Admin pode acessar logs")
    }
    return await ctx.db.query("auditLogs").order("desc").take(100)
  },
})
