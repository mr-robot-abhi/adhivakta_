import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"

export function UpcomingHearings() {
  const hearings = [
    {
      id: "H-2023-1234",
      caseId: "CS-2023-1234",
      caseTitle: "Smith vs. Johnson",
      court: "Supreme Court",
      date: "2023-06-15",
      time: "10:00 AM",
    },
    {
      id: "H-2023-1235",
      caseId: "CS-2023-1235",
      caseTitle: "Doe vs. State",
      court: "High Court",
      date: "2023-06-18",
      time: "11:30 AM",
    },
    {
      id: "H-2023-1236",
      caseId: "CS-2023-1236",
      caseTitle: "ABC Corp vs. XYZ Ltd",
      court: "Commercial Court",
      date: "2023-06-20",
      time: "02:00 PM",
    },
    {
      id: "H-2023-1237",
      caseId: "CS-2023-1237",
      caseTitle: "Estate of Williams",
      court: "Probate Court",
      date: "2023-06-22",
      time: "09:30 AM",
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Hearings</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/calendar">
            View calendar
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hearings.map((hearing) => (
            <div key={hearing.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Link href={`/cases/${hearing.caseId}`} className="font-medium hover:underline">
                  {hearing.caseTitle}
                </Link>
                <div className="text-sm text-muted-foreground">{hearing.court}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(hearing.date).toLocaleDateString()} at {hearing.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

