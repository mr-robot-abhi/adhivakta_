import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, FileText, Users } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Active Cases",
      value: "24",
      icon: Briefcase,
      change: "+2 this month",
      changeType: "positive" as const,
    },
    {
      title: "Pending Hearings",
      value: "12",
      icon: Clock,
      change: "3 this week",
      changeType: "neutral" as const,
    },
    {
      title: "Documents",
      value: "156",
      icon: FileText,
      change: "+14 this month",
      changeType: "positive" as const,
    },
    {
      title: "Clients",
      value: "38",
      icon: Users,
      change: "+5 this month",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-500"
                  : stat.changeType === "negative"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            >
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

