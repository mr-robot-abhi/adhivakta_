"use client"

import { cn } from "@/lib/utils"
import { Briefcase, Calendar, FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/context/auth-context"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cases",
    href: "/cases",
    icon: Briefcase,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleLogout = async () => {
    // Close the dialog
    setLogoutDialogOpen(false)

    // Logout and redirect to landing page
    await logout()
  }

  // Don't render sidebar on auth pages or landing page
  if (pathname?.startsWith("/auth") || pathname === "/") {
    return null
  }

  return (
    <>
      <div className="hidden md:flex flex-col w-64 border-r bg-muted/40 p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Logo />
        </div>

        <nav className="space-y-1 flex-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.title}
              </Link>
            )
          })}
        </nav>

        <div className="border-t pt-4 mt-4">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 mt-1"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

