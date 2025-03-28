import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Upload, UserPlus } from "lucide-react"
import Link from "next/link"

export function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: "document",
      icon: Upload,
      title: "Document Uploaded",
      description: "John Doe uploaded 'Motion to Dismiss' to Smith vs. Johnson",
      time: "2 hours ago",
      caseId: "CS-2023-1234",
    },
    {
      id: 2,
      type: "comment",
      icon: MessageSquare,
      title: "New Comment",
      description: "Jane Smith commented on Doe vs. State",
      time: "4 hours ago",
      caseId: "CS-2023-1235",
    },
    {
      id: 3,
      type: "client",
      icon: UserPlus,
      title: "New Client",
      description: "ABC Corporation was added as a new client",
      time: "Yesterday",
      caseId: null,
    },
    {
      id: 4,
      type: "document",
      icon: FileText,
      title: "Document Updated",
      description: "Sarah Johnson updated 'Settlement Agreement' in Estate of Williams",
      time: "Yesterday",
      caseId: "CS-2023-1237",
    },
  ]

  const getIconColor = (type: string) => {
    switch (type) {
      case "document":
        return "text-blue-500 bg-blue-100"
      case "comment":
        return "text-green-500 bg-green-100"
      case "client":
        return "text-purple-500 bg-purple-100"
      default:
        return "text-gray-500 bg-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getIconColor(activity.type)}`}
              >
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.caseId ? (
                    <>
                      <span>{activity.description.split(activity.caseId)[0]}</span>
                      <Link href={`/cases/${activity.caseId}`} className="font-medium hover:underline">
                        {activity.caseId}
                      </Link>
                      <span>{activity.description.split(activity.caseId)[1]}</span>
                    </>
                  ) : (
                    activity.description
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

