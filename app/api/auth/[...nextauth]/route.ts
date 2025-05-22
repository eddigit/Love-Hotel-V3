import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { verifyUserCredentials, getUserById, getOrCreateOAuthUser, getUserByEmail } from "@/lib/user-service" // Added getUserById and getUserByEmail

// Ensure NEXTAUTH_URL is properly set
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
  console.warn("Warning: NEXTAUTH_URL is not set. This may cause authentication issues in production.")
}

// Ensure NEXTAUTH_SECRET is properly set
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("Warning: NEXTAUTH_SECRET is not set. This is required for secure authentication.")
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET must be set in production environment")
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development", // Enable debug mode in development
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          // Use your existing user-service to verify credentials
          const user = await verifyUserCredentials(credentials.email, credentials.password)
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role,
              onboarding_completed: user.onboarding_completed,
            }
          }
          return null
        } catch (error) {
          console.error("Error in authorize function:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Pour les logins OAuth (Google, Facebook)
        if (account?.provider && account.provider !== "credentials") {
          // Crée l'utilisateur et le profil s'ils n'existent pas
          await getOrCreateOAuthUser({
            email: user.email!,
            name: user.name ?? undefined,
            avatar: user.image ?? undefined,
          })
        }
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, token }) {
      // Attach user id, role, avatar, and onboardingCompleted to session
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
    },
    async jwt({ token, user, account, profile, trigger, session: sessionFromUpdate }) {
      try {
        // Toujours récupérer l'utilisateur depuis la base par email pour obtenir le vrai UUID
        if (user?.email) {
          const dbUser = await getUserByEmail(user.email)
          if (dbUser) {
            token.sub = dbUser.id // Toujours le vrai UUID
            token.role = dbUser.role
            token.avatar = dbUser.avatar
            token.onboardingCompleted = dbUser.onboarding_completed
          }
        }
        // If session was updated
        if (trigger === "update" && token.sub) {
          const dbUser = await getUserById(token.sub as string)
          if (dbUser) {
            token.name = dbUser.name
            token.role = dbUser.role
            token.avatar = dbUser.avatar
            token.onboardingCompleted = dbUser.onboarding_completed
          }
        }
        return token
      } catch (error) {
        console.error("Error in jwt callback:", error)
        return token
      }
    },
  },
  // Add better error handling and logging
  logger: {
    error(code, metadata) {
      console.error(`[Auth] Error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`[Auth] Warning: ${code}`)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Auth] Debug: ${code}`, metadata)
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
