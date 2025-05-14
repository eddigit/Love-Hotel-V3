import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyUserCredentials, getUserById } from "@/lib/user-service" // Added getUserById

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        // Use your existing user-service to verify credentials
        const user = await verifyUserCredentials(credentials.email, credentials.password)
        if (user) {
          // user object from verifyUserCredentials includes onboarding_completed
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            onboarding_completed: user.onboarding_completed, // Pass it through
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // Attach user id, role, avatar, and onboardingCompleted to session
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string
        session.user.onboardingCompleted = token.onboardingCompleted as boolean // Assign from token
      }
      return session
    },
    async jwt({ token, user, trigger, session: sessionFromUpdate }) { // Added trigger and sessionFromUpdate
      // user is only passed on initial sign in. It's the object from authorize.
      if (user) {
        token.sub = user.id // Ensure sub is set from user.id on initial login
        token.role = user.role
        token.avatar = user.avatar
        token.onboardingCompleted = user.onboarding_completed
      }

      // If session was updated (e.g., by calling useSession().update())
      // and we want to refresh data from the DB:
      if (trigger === "update" && token.sub) {
        const dbUser = await getUserById(token.sub as string)
        if (dbUser) {
          token.name = dbUser.name // Update name if it can change
          token.role = dbUser.role
          token.avatar = dbUser.avatar
          token.onboardingCompleted = dbUser.onboarding_completed
          // Update any other fields you want to refresh in the token
        }
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
