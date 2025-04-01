import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CaseList() {
  const cases = [
    {
      id: "CS-2023-1234",
      title: "Smith vs. Johnson",
      caseType: "Civil",
      courtType: "Supreme Court",
      status: "Active",
      nextHearing: "2023-06-15",
      petitioner: "John Smith",
      defendant: "Michael Johnson",
      assignedLawyer: "Sarah Davis",
      seniorCounsel: true,
      filingDate: "2023-01-10"
    },
    {
      id: "CS-2023-1235",
      title: "Doe vs. State",
      caseType: "Criminal",
      courtType: "High Court",
      status: "Closed",
      nextHearing: null,
      petitioner: "Jane Doe",
      defendant: "State of California",
      assignedLawyer: "Michael Chen",
      seniorCounsel: false,
      filingDate: "2022-11-15",
      closingDate: "2023-03-20"
    },
    {
      id: "CS-2023-1236",
      title: "ABC Corp vs. XYZ Ltd",
      caseType: "Commercial",
      courtType: "Commercial Court",
      status: "Active",
      nextHearing: "2023-06-20",
      petitioner: "ABC Corporation",
      defendant: "XYZ Limited",
      assignedLawyer: "Robert Williams",
      seniorCounsel: true,
      filingDate: "2023-02-05"
    },
    {
      id: "CS-2023-1237",
      title: "Williams Family Trust",
      caseType: "Family",
      courtType: "Family Court",
      status: "Active",
      nextHearing: "2023-06-22",
      petitioner: "Williams Family",
      defendant: "James Williams",
      assignedLawyer: "Sarah Davis",
      seniorCounsel: false,
      filingDate: "2023-01-30"
    },
    {
      id: "CS-2023-1238",
      title: "Johnson vs. City Council",
      caseType: "Administrative",
      courtType: "Administrative Court",
      status: "Closed",
      nextHearing: null,
      petitioner: "Robert Johnson",
      defendant: "City Council",
      assignedLawyer: "Michael Chen",
      seniorCounsel: false,
      filingDate: "2022-10-15",
      closingDate: "2023-03-10"
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Petitioner/Plaintiff</TableHead>
              <TableHead>Defendant</TableHead>
              <TableHead>Case Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Hearing</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.id}</TableCell>
                <TableCell>
                  <Link href={`/cases/${caseItem.id}`} className="hover:underline">
                    {caseItem.title}
                  </Link>
                </TableCell>
                <TableCell>{caseItem.courtType}</TableCell>
                <TableCell>{caseItem.petitioner}</TableCell>
                <TableCell>{caseItem.defendant}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {caseItem.caseType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      caseItem.status === "Active" 
                        ? "default" 
                        : caseItem.status === "Closed" 
                          ? "destructive" 
                          : "outline"
                    }
                  >
                    {caseItem.status}
                    {caseItem.status === "Active" && caseItem.seniorCounsel && (
                      <span className="ml-1">⭐</span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  {caseItem.nextHearing ? (
                    <div className="flex flex-col">
                      <span>{new Date(caseItem.nextHearing).toLocaleDateString()}</span>
                      <span className="text-xs text-muted-foreground">
                        {caseItem.assignedLawyer}
                      </span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/cases/${caseItem.id}`}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View case</span>
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Add document</DropdownMenuItem>
                        <DropdownMenuItem>Schedule hearing</DropdownMenuItem>
                        {caseItem.status === "Active" && (
                          <DropdownMenuItem className="text-destructive">Close case</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}