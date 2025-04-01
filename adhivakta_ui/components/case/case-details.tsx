import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star, Phone, Mail } from "lucide-react"

interface CaseDetailsProps {
  caseId: string
}

export function CaseDetails({ caseId }: CaseDetailsProps) {
  // This would normally be fetched from an API
  const caseData = {
    id: caseId,
    title: "Smith vs. Johnson",
    caseType: "Civil",
    courtType: "Supreme Court",
    courtHall: "Courtroom 3",
    judge: "Hon. Justice Williams",
    status: "Active",
    nextHearing: "2023-06-15",
    filingDate: "2023-01-10",
    description:
      "This case involves a dispute over property boundaries between neighboring landowners. The plaintiff alleges that the defendant has encroached on their land by building a fence that extends beyond the property line.",
    petitioner: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    defendant: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 987-6543",
    },
    assignedLawyers: [
      {
        name: "Sarah Davis",
        role: "Lead Counsel",
        avatar: "/placeholder.svg?height=40&width=40",
        seniorCounsel: true,
        email: "sarah.davis@lawfirm.com",
        phone: "+1 (555) 234-5678"
      },
      {
        name: "Michael Chen",
        role: "Associate",
        avatar: "/placeholder.svg?height=40&width=40",
        seniorCounsel: false,
        email: "michael.chen@lawfirm.com",
        phone: "+1 (555) 345-6789"
      },
    ],
    counselForRespondent: [
      {
        name: "Jane Williams",
        firm: "Williams & Partners",
        email: "jane.williams@lawfirm.com",
        phone: "+1 (555) 456-7890"
      }
    ],
    stakeholders: [
      {
        name: "Emily Parker",
        relation: "Witness",
        email: "emily.parker@example.com",
        phone: "+1 (555) 567-8901"
      }
    ]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Case Information Column */}
            <div className="space-y-6">
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
                    <p className="text-sm text-muted-foreground">Case Type</p>
                    <Badge variant="secondary" className="capitalize">
                      {caseData.caseType}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={caseData.status === "Active" ? "default" : "destructive"}>
                      {caseData.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Filing Date</p>
                    <p className="text-sm font-medium">{new Date(caseData.filingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Court Details</h3>
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Court Type</p>
                    <p className="text-sm font-medium">{caseData.courtType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Court Hall</p>
                    <p className="text-sm font-medium">{caseData.courtHall}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Presiding Judge</p>
                    <p className="text-sm font-medium">{caseData.judge}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Next Hearing</p>
                    <p className="text-sm font-medium">
                      {caseData.nextHearing ? new Date(caseData.nextHearing).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parties Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Petitioner/Plaintiff</h3>
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{caseData.petitioner.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${caseData.petitioner.email}`} className="text-sm font-medium hover:underline">
                        {caseData.petitioner.email}
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${caseData.petitioner.phone}`} className="text-sm font-medium hover:underline">
                        {caseData.petitioner.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Defendant</h3>
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{caseData.defendant.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${caseData.defendant.email}`} className="text-sm font-medium hover:underline">
                        {caseData.defendant.email}
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${caseData.defendant.phone}`} className="text-sm font-medium hover:underline">
                        {caseData.defendant.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Counsel for Respondent</h3>
                <div className="mt-4 space-y-3">
                  {caseData.counselForRespondent.map((counsel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-sm font-medium">{counsel.name}</p>
                      </div>
                      {counsel.firm && (
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-sm text-muted-foreground">Firm</p>
                          <p className="text-sm font-medium">{counsel.firm}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${counsel.email}`} className="text-sm font-medium hover:underline">
                            {counsel.email}
                          </a>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${counsel.phone}`} className="text-sm font-medium hover:underline">
                            {counsel.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Case Description */}
          <div className="mt-6">
            <h3 className="text-lg font-medium">Case Description</h3>
            <p className="mt-2 text-sm text-muted-foreground">{caseData.description}</p>
          </div>

          {/* Assigned Lawyers */}
          <div className="mt-6">
            <h3 className="text-lg font-medium">Assigned Lawyers</h3>
            <div className="mt-4 space-y-4">
              {caseData.assignedLawyers.map((lawyer) => (
                <div key={lawyer.name} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                    <AvatarFallback>
                      {lawyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{lawyer.name}</p>
                      {lawyer.seniorCounsel && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{lawyer.role}</p>
                    <div className="flex gap-4 mt-1">
                      <a href={`mailto:${lawyer.email}`} className="text-xs flex items-center gap-1 hover:underline">
                        <Mail className="h-3 w-3" /> {lawyer.email}
                      </a>
                      <a href={`tel:${lawyer.phone}`} className="text-xs flex items-center gap-1 hover:underline">
                        <Phone className="h-3 w-3" /> {lawyer.phone}
                      </a>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          {caseData.stakeholders && caseData.stakeholders.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium">Stakeholders</h3>
              <div className="mt-4 space-y-4">
                {caseData.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {stakeholder.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{stakeholder.name}</p>
                      {stakeholder.relation && (
                        <p className="text-sm text-muted-foreground">{stakeholder.relation}</p>
                      )}
                      <div className="flex gap-4 mt-1">
                        <a href={`mailto:${stakeholder.email}`} className="text-xs flex items-center gap-1 hover:underline">
                          <Mail className="h-3 w-3" /> {stakeholder.email}
                        </a>
                        <a href={`tel:${stakeholder.phone}`} className="text-xs flex items-center gap-1 hover:underline">
                          <Phone className="h-3 w-3" /> {stakeholder.phone}
                        </a>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}