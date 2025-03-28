"use client"

import { useAuth } from "@/lib/context/auth-context"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentCases } from "@/components/dashboard/recent-cases"
import { UpcomingHearings } from "@/components/dashboard/upcoming-hearings"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()
  const userRole = user?.role || "lawyer" // Default to lawyer if role not available

  // Render different dashboard based on user role
  if (userRole === "client") {
    return <ClientDashboard />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentCases />
        <UpcomingHearings />
      </div>

      <ActivityTimeline />
    </div>
  )
}

