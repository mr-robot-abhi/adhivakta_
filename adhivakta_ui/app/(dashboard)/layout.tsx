"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { AppSidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { Scale } from "lucide-react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to landing page
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  // If still loading or not authenticated, show loading state
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Scale className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

