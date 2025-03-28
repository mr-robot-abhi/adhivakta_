import { Card, CardContent } from "@/components/ui/card"
import { FileText, MessageSquare, Calendar, Gavel, Clock, CheckCircle } from "lucide-react"

interface CaseTimelineProps {
  caseId: string
}

export function CaseTimeline({ caseId }: CaseTimelineProps) {
  // This would normally be fetched from an API
  const events = [
    {
      id: 1,
      type: "filing",
      icon: FileText,
      title: "Case Filed",
      description: "Initial complaint filed with the court",
      date: "2023-01-10T10:30:00",
    },
    {
      id: 2,
      type: "document",
      icon: FileText,
      title: "Document Filed",
      description: "Answer to complaint filed by defendant",
      date: "2023-01-20T14:15:00",
    },
    {
      id: 3,
      type: "hearing",
      icon: Gavel,
      title: "Initial Hearing",
      description: "Initial hearing before Judge Thompson",
      date: "2023-02-15T09:00:00",
    },
    {
      id: 4,
      type: "document",
      icon: FileText,
      title: "Document Filed",
      description: "Motion to dismiss filed by defendant",
      date: "2023-02-25T11:45:00",
    },
    {
      id: 5,
      type: "comment",
      icon: MessageSquare,
      title: "Case Note Added",
      description: "Conference call with client to discuss strategy",
      date: "2023-03-05T13:30:00",
    },
    {
      id: 6,
      type: "deadline",
      icon: Clock,
      title: "Deadline",
      description: "Response to motion to dismiss due",
      date: "2023-03-15T23:59:59",
    },
    {
      id: 7,
      type: "document",
      icon: FileText,
      title: "Document Filed",
      description: "Response to motion to dismiss filed",
      date: "2023-03-14T16:20:00",
    },
    {
      id: 8,
      type: "hearing",
      icon: Gavel,
      title: "Motion Hearing",
      description: "Hearing on motion to dismiss",
      date: "2023-04-10T10:00:00",
    },
    {
      id: 9,
      type: "ruling",
      icon: CheckCircle,
      title: "Court Ruling",
      description: "Motion to dismiss denied",
      date: "2023-04-20T15:45:00",
    },
    {
      id: 10,
      type: "scheduled",
      icon: Calendar,
      title: "Hearing Scheduled",
      description: "Trial date set",
      date: "2023-06-15T09:00:00",
    },
  ]

  const getIconColor = (type: string) => {
    switch (type) {
      case "filing":
      case "document":
        return "text-blue-500 bg-blue-100"
      case "hearing":
      case "ruling":
        return "text-green-500 bg-green-100"
      case "comment":
        return "text-purple-500 bg-purple-100"
      case "deadline":
      case "scheduled":
        return "text-orange-500 bg-orange-100"
      default:
        return "text-gray-500 bg-gray-100"
    }
  }

  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getIconColor(event.type)}`}
              >
                <event.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

