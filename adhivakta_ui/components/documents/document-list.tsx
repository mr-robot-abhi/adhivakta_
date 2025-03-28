import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Eye, FileText, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export function DocumentList() {
  const documents = [
    {
      id: "DOC-2023-001",
      name: "Complaint - Smith vs. Johnson",
      type: "PDF",
      size: "1.2 MB",
      caseId: "CS-2023-1234",
      caseTitle: "Smith vs. Johnson",
      uploadedBy: "Sarah Davis",
      uploadedAt: "2023-01-10T10:30:00",
    },
    {
      id: "DOC-2023-002",
      name: "Answer to Complaint - Smith vs. Johnson",
      type: "PDF",
      size: "0.8 MB",
      caseId: "CS-2023-1234",
      caseTitle: "Smith vs. Johnson",
      uploadedBy: "Michael Chen",
      uploadedAt: "2023-01-20T14:15:00",
    },
    {
      id: "DOC-2023-003",
      name: "Motion to Dismiss - Doe vs. State",
      type: "PDF",
      size: "1.5 MB",
      caseId: "CS-2023-1235",
      caseTitle: "Doe vs. State",
      uploadedBy: "Sarah Davis",
      uploadedAt: "2023-02-05T09:45:00",
    },
    {
      id: "DOC-2023-004",
      name: "Exhibit A - Property Survey - Smith vs. Johnson",
      type: "PDF",
      size: "3.2 MB",
      caseId: "CS-2023-1234",
      caseTitle: "Smith vs. Johnson",
      uploadedBy: "Michael Chen",
      uploadedAt: "2023-02-10T11:20:00",
    },
    {
      id: "DOC-2023-005",
      name: "Deposition Transcript - John Smith",
      type: "DOCX",
      size: "0.5 MB",
      caseId: "CS-2023-1234",
      caseTitle: "Smith vs. Johnson",
      uploadedBy: "Sarah Davis",
      uploadedAt: "2023-03-15T13:10:00",
    },
    {
      id: "DOC-2023-006",
      name: "Settlement Agreement - ABC Corp vs. XYZ Ltd",
      type: "PDF",
      size: "2.1 MB",
      caseId: "CS-2023-1236",
      caseTitle: "ABC Corp vs. XYZ Ltd",
      uploadedBy: "Michael Chen",
      uploadedAt: "2023-03-20T15:30:00",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/cases/${doc.caseId}`} className="hover:underline">
                    {doc.caseTitle}
                  </Link>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.uploadedBy}</TableCell>
                <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View document</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download document</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Replace</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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

