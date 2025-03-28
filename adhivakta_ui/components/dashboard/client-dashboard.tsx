"use client"

import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ClientDashboard() {
  const { user } = useAuth()

  // Sample client data
  const clientCases = [
    {
      id: "CS-2023-1234",
      title: "Smith vs. Johnson",
      court: "Supreme Court",
      status: "Active",
      nextHearing: "2023-06-15",
      lawyer: "Sarah Davis",
    },
    {
      id: "CS-2023-1235",
      title: "Smith vs. State",
      court: "High Court",
      status: "Pending",
      nextHearing: "2023-06-18",
      lawyer: "Michael Chen",
    },
  ]

  const clientDocuments = [
    {
      id: "DOC-2023-001",
      name: "Complaint",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "Sarah Davis",
      uploadedAt: "2023-01-10T10:30:00",
    },
    {
      id: "DOC-2023-002",
      name: "Answer to Complaint",
      type: "PDF",
      size: "0.8 MB",
      uploadedBy: "Michael Chen",
      uploadedAt: "2023-01-20T14:15:00",
    },
    {
      id: "DOC-2023-003",
      name: "Motion to Dismiss",
      type: "PDF",
      size: "1.5 MB",
      uploadedBy: "Sarah Davis",
      uploadedAt: "2023-02-05T09:45:00",
    },
  ]

  const upcomingHearings = [
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
      caseTitle: "Smith vs. State",
      court: "High Court",
      date: "2023-06-18",
      time: "11:30 AM",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "Client"}</p>
      </div>

      {/* Welcome Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-background">
            <Image src="/images/justice-scales-closeup.png" alt="Justice Scales" fill className="object-cover" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl font-bold">Your Legal Journey</h2>
            <p className="text-muted-foreground max-w-md">
              Track your cases, access documents, and communicate with your legal team all in one place.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Button asChild size="sm">
                <Link href="/cases">View My Cases</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/documents">My Documents</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/messages">Contact Lawyer</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">My Cases</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientCases.map((caseItem) => (
              <div key={caseItem.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Link href={`/cases/${caseItem.id}`} className="font-medium hover:underline">
                    {caseItem.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{caseItem.id}</span>
                    <span>•</span>
                    <span>{caseItem.court}</span>
                    <span>•</span>
                    <span>Lawyer: {caseItem.lawyer}</span>
                  </div>
                </div>
                <Badge variant={caseItem.status === "Active" ? "default" : "secondary"}>{caseItem.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Hearings */}
        <Card>
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
              {upcomingHearings.map((hearing) => (
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

        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Recent Documents</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientDocuments.map((doc) => (
                <div key={doc.id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                      {doc.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle>Messages from Your Legal Team</CardTitle>
          <CardDescription>Recent communications from your lawyers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Case Update: Smith vs. Johnson</p>
                <p className="text-sm text-muted-foreground">
                  We've received the response from the opposing counsel and are preparing our reply. I'll schedule a
                  call to discuss our strategy.
                </p>
                <p className="text-xs text-muted-foreground">From: Sarah Davis • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Document Request: Smith vs. State</p>
                <p className="text-sm text-muted-foreground">
                  Could you please upload the additional documents we discussed during our last meeting? They're needed
                  for the upcoming hearing.
                </p>
                <p className="text-xs text-muted-foreground">From: Michael Chen • 3 days ago</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/messages">View All Messages</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

