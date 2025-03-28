"use client"

import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebar } from "./sidebar"
import { Logo } from "./logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const isAuthPage = pathname?.startsWith("/auth")
  const isLandingPage = pathname === "/"

  const handleLogout = async () => {
    // Close the dialog
    setLogoutDialogOpen(false)

    // Logout and redirect to landing page
    await logout()
  }

  // Don't show header on landing page
  if (isLandingPage) {
    return null
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {!isAuthPage && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      )}

      {isAuthPage ? (
        <div className="flex items-center gap-2">
          <Logo />
        </div>
      ) : (
        <div className="relative flex-1 md:grow-0 md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases, documents, clients..."
              className="w-full pl-10 pr-4 py-2 h-10"
            />
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {isAuthPage ? (
          <Link href="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground notification-badge">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {[
                    {
                      id: 1,
                      title: "New document uploaded",
                      description: "John Doe uploaded a new document to Case #123",
                      time: "2 hours ago",
                    },
                    {
                      id: 2,
                      title: "Upcoming hearing",
                      description: "Reminder: Smith vs. Johnson hearing tomorrow at 10:00 AM",
                      time: "5 hours ago",
                    },
                    {
                      id: 3,
                      title: "New comment",
                      description: "Sarah Davis commented on Doe vs. State case",
                      time: "Yesterday",
                    },
                  ].map((notification) => (
                    <Link href={`/notifications/${notification.id}`} key={notification.id}>
                      <DropdownMenuItem className="cursor-pointer py-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <Link href="/notifications">
                  <DropdownMenuItem className="cursor-pointer text-center">View all notifications</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                    <AvatarFallback>
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
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
    </header>
  )
}

