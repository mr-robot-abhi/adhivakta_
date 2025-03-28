"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Session } from "next-auth"
import { signIn, signOut, useSession } from "next-auth/react"

interface AuthContextType {
  user: Session["user"] | null
  status: "loading" | "authenticated" | "unauthenticated"
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<Session["user"] | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser(session.user)
    } else {
      setUser(null)
    }
  }, [session])

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        return false
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        return false
      }

      // Auto login after registration
      return await login(userData.email, userData.password)
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

