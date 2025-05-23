import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

// Determine the base URL based on environment
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL_INTERNAL || "http://localhost:3000"

// Check if running in v0.dev environment
const isV0 = process.env.VERCEL_URL?.includes("lite.vusercontent.net")

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const users = await sql`
            SELECT id, name, email, password, role, email_verified, onboarding_completed
            FROM users
            WHERE email = ${credentials.email}
          `

          if (users.length === 0) {
            return null
          }

          const user = users[0]
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "user",
            email_verified: user.email_verified,
            onboardingCompleted: user.onboarding_completed,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Add allowDangerousEmailAccountLinking for Google accounts with same email
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.email_verified = user.email_verified
        token.onboardingCompleted = user.onboardingCompleted
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.email_verified = token.email_verified as boolean
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUsers = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `

          if (existingUsers.length === 0) {
            // Create new user for Google sign-in
            const userId = crypto.randomUUID()
            await sql`
              INSERT INTO users (id, name, email, email_verified, provider, created_at, updated_at)
              VALUES (${userId}, ${user.name}, ${user.email}, true, 'google', NOW(), NOW())
            `
            user.id = userId
          } else {
            user.id = existingUsers[0].id
          }
        } catch (error) {
          console.error("Google sign-in error:", error)
          return false
        }
      }
      return true
    },
    // Add redirect callback to handle URLs properly
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allow callbacks to same domain
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  session: {
    strategy: "jwt",
  },
  // Add secret from environment variable
  secret: process.env.NEXTAUTH_SECRET,
  // Simplified debug mode for v0.dev environment
  debug: isV0 || process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
