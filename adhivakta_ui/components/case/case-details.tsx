import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CaseDetailsProps {
  caseId: string
}

export function CaseDetails({ caseId }: CaseDetailsProps) {
  // This would normally be fetched from an API
  const caseData = {
    id: caseId,
    title: "Smith vs. Johnson",
    court: "Supreme Court",
    status: "Active",
    nextHearing: "2023-06-15",
    filingDate: "2023-01-10",
    description:
      "This case involves a dispute over property boundaries between neighboring landowners. The plaintiff alleges that the defendant has encroached on their land by building a fence that extends beyond the property line.",
    client: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    opposingParty: {
      name: "Robert Johnson",
      lawyer: "Jane Williams",
    },
    assignedLawyers: [
      {
        name: "Sarah Davis",
        role: "Lead Counsel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Michael Chen",
        role: "Associate",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium">Case Information</h3>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Case Number</p>
                  <p className="text-sm font-medium">{caseData.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="text-sm font-medium">{caseData.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Court</p>
                  <p className="text-sm font-medium">{caseData.court}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={caseData.status === "Active" ? "default" : "secondary"}>{caseData.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Filing Date</p>
                  <p className="text-sm font-medium">{new Date(caseData.filingDate).toLocaleDateString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Next Hearing</p>
                  <p className="text-sm font-medium">{new Date(caseData.nextHearing).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Parties</h3>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="text-sm font-medium">{caseData.client.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Client Email</p>
                  <p className="text-sm font-medium">{caseData.client.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Client Phone</p>
                  <p className="text-sm font-medium">{caseData.client.phone}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Opposing Party</p>
                  <p className="text-sm font-medium">{caseData.opposingParty.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Opposing Counsel</p>
                  <p className="text-sm font-medium">{caseData.opposingParty.lawyer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Case Description</h3>
            <p className="mt-2 text-sm text-muted-foreground">{caseData.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Assigned Lawyers</h3>
            <div className="mt-4 space-y-4">
              {caseData.assignedLawyers.map((lawyer) => (
                <div key={lawyer.name} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                    <AvatarFallback>
                      {lawyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{lawyer.name}</p>
                    <p className="text-xs text-muted-foreground">{lawyer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

