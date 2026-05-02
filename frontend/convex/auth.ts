import { Password } from "@convex-dev/auth/providers/Password"
import { convexAuth } from "@convex-dev/auth/server"

const passwordProvider = Password({
  validatePasswordRequirements(password) {
    if (!password || password.length < 6) {
      throw new Error("A senha deve ter no minimo 6 caracteres")
    }
  },
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [passwordProvider],
})
