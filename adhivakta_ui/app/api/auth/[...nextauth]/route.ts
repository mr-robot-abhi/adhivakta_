import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/db/mongodb"
import User from "@/lib/models/user"
import bcrypt from "bcryptjs"

// Define providers array
const providers = []

// Add Google provider if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

// Add Apple provider if credentials exist
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
  )
}

// Always add Credentials provider as fallback
providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      try {
        // Connect to MongoDB
        await clientPromise

        // Find user by email
        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          return null
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        // Return user without password
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      } catch (error) {
        console.error("Auth error:", error)
        return null
      }
    },
  }),
)

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  secret: process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

