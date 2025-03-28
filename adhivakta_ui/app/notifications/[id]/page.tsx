import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, FileText, MessageSquare, User } from "lucide-react"
import Link from "next/link"

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  // This would normally be fetched from an API
  const notification = {
    id: Number.parseInt(params.id),
    title: "New document uploaded",
    description: "John Doe uploaded a new document to Case #123",
    time: "2 hours ago",
    type: "document",
    read: false,
    details: {
      user: "John Doe",
      case: "Smith vs. Johnson",
      caseId: "CS-2023-1234",
      document: "Motion to Dismiss",
      documentId: "DOC-2023-003",
      timestamp: "2023-06-10T14:30:00Z",
    },
  }

  const getIcon = () => {
    switch (notification.type) {
      case "document":
        return <FileText className="h-8 w-8 text-primary" />
      case "hearing":
      case "deadline":
        return <Calendar className="h-8 w-8 text-primary" />
      case "comment":
        return <MessageSquare className="h-8 w-8 text-primary" />
      case "client":
        return <User className="h-8 w-8 text-primary" />
      default:
        return <FileText className="h-8 w-8 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notifications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notifications
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">{getIcon()}</div>
            <div>
              <CardTitle className="text-xl">{notification.title}</CardTitle>
              <CardDescription>{notification.time}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{notification.description}</p>

          <div className="border rounded-lg p-4 space-y-3 mt-4">
            <h3 className="font-medium">Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-muted-foreground">User</p>
              <p className="text-sm">{notification.details.user}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-muted-foreground">Case</p>
              <p className="text-sm">
                <Link href={`/cases/${notification.details.caseId}`} className="hover:underline text-primary">
                  {notification.details.case}
                </Link>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-muted-foreground">Document</p>
              <p className="text-sm">
                <Link href={`/documents/${notification.details.documentId}`} className="hover:underline text-primary">
                  {notification.details.document}
                </Link>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p className="text-sm">{new Date(notification.details.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Mark as Unread</Button>
          <Button>View Document</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

