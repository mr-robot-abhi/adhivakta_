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
      court: "Supreme Court",
      status: "Active",
      nextHearing: "2023-06-15",
      client: "John Smith",
    },
    {
      id: "CS-2023-1235",
      title: "Doe vs. State",
      court: "High Court",
      status: "Pending",
      nextHearing: "2023-06-18",
      client: "Jane Doe",
    },
    {
      id: "CS-2023-1236",
      title: "ABC Corp vs. XYZ Ltd",
      court: "Commercial Court",
      status: "Active",
      nextHearing: "2023-06-20",
      client: "ABC Corporation",
    },
    {
      id: "CS-2023-1237",
      title: "Estate of Williams",
      court: "Probate Court",
      status: "Pending",
      nextHearing: "2023-06-22",
      client: "Williams Family",
    },
    {
      id: "CS-2023-1238",
      title: "Johnson vs. City Council",
      court: "Administrative Court",
      status: "Closed",
      nextHearing: null,
      client: "Robert Johnson",
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
              <TableHead>Client</TableHead>
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
                <TableCell>{caseItem.court}</TableCell>
                <TableCell>{caseItem.client}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      caseItem.status === "Active" ? "default" : caseItem.status === "Pending" ? "secondary" : "outline"
                    }
                  >
                    {caseItem.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : "N/A"}
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

