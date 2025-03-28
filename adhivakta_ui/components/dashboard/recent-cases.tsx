import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function RecentCases() {
  const cases = [
    {
      id: "CS-2023-1234",
      title: "Smith vs. Johnson",
      court: "Supreme Court",
      status: "Active",
      nextHearing: "2023-06-15",
    },
    {
      id: "CS-2023-1235",
      title: "Doe vs. State",
      court: "High Court",
      status: "Pending",
      nextHearing: "2023-06-18",
    },
    {
      id: "CS-2023-1236",
      title: "ABC Corp vs. XYZ Ltd",
      court: "Commercial Court",
      status: "Active",
      nextHearing: "2023-06-20",
    },
    {
      id: "CS-2023-1237",
      title: "Estate of Williams",
      court: "Probate Court",
      status: "Pending",
      nextHearing: "2023-06-22",
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Recent Cases</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cases">
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <Link href={`/cases/${caseItem.id}`} className="font-medium hover:underline">
                  {caseItem.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{caseItem.id}</span>
                  <span>•</span>
                  <span>{caseItem.court}</span>
                </div>
              </div>
              <Badge variant={caseItem.status === "Active" ? "default" : "secondary"}>{caseItem.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

