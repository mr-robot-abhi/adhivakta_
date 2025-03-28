import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "New document uploaded",
      description: "John Doe uploaded a new document to Case #123",
      time: "2 hours ago",
      type: "document",
      read: false,
    },
    {
      id: 2,
      title: "Upcoming hearing",
      description: "Reminder: Smith vs. Johnson hearing tomorrow at 10:00 AM",
      time: "5 hours ago",
      type: "hearing",
      read: false,
    },
    {
      id: 3,
      title: "New comment",
      description: "Sarah Davis commented on Doe vs. State case",
      time: "Yesterday",
      type: "comment",
      read: true,
    },
    {
      id: 4,
      title: "Case status updated",
      description: "ABC Corp vs. XYZ Ltd case status changed to 'Active'",
      time: "2 days ago",
      type: "case",
      read: true,
    },
    {
      id: 5,
      title: "New client added",
      description: "Williams Family was added as a new client",
      time: "3 days ago",
      type: "client",
      read: true,
    },
    {
      id: 6,
      title: "Document updated",
      description: "Motion to Dismiss was updated in Smith vs. Johnson case",
      time: "4 days ago",
      type: "document",
      read: true,
    },
    {
      id: 7,
      title: "Deadline approaching",
      description: "Filing deadline for Doe vs. State case is in 3 days",
      time: "5 days ago",
      type: "deadline",
      read: true,
    },
  ]

  const unreadNotifications = notifications.filter((n) => !n.read)
  const documentNotifications = notifications.filter((n) => n.type === "document")
  const caseNotifications = notifications.filter(
    (n) => n.type === "case" || n.type === "hearing" || n.type === "deadline",
  )
  const otherNotifications = notifications.filter((n) => n.type === "comment" || n.type === "client")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="all">
            All
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {notifications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {unreadNotifications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View all your recent notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Link href={`/notifications/${notification.id}`} key={notification.id}>
                    <div
                      className={`flex items-start p-4 rounded-lg border ${notification.read ? "" : "bg-muted"} hover:bg-accent transition-colors`}
                    >
                      <div className="flex-1">
                        <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary"></span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>View your unread notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <Link href={`/notifications/${notification.id}`} key={notification.id}>
                      <div className="flex items-start p-4 rounded-lg border bg-muted hover:bg-accent transition-colors">
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {notification.title}
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary"></span>
                          </h3>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No unread notifications</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Notifications</CardTitle>
              <CardDescription>Notifications related to documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentNotifications.length > 0 ? (
                  documentNotifications.map((notification) => (
                    <Link href={`/notifications/${notification.id}`} key={notification.id}>
                      <div
                        className={`flex items-start p-  key={notification.id}>
                      <div className={\`flex items-start p-4 rounded-lg border ${notification.read ? "" : "bg-muted"} hover:bg-accent transition-colors`}
                      >
                        <div className="flex-1">
                          <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary"></span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No document notifications</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Notifications</CardTitle>
              <CardDescription>Notifications related to cases and hearings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseNotifications.length > 0 ? (
                  caseNotifications.map((notification) => (
                    <Link href={`/notifications/${notification.id}`} key={notification.id}>
                      <div
                        className={`flex items-start p-4 rounded-lg border ${notification.read ? "" : "bg-muted"} hover:bg-accent transition-colors`}
                      >
                        <div className="flex-1">
                          <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary"></span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No case notifications</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

