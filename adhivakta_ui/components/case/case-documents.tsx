import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Eye, MoreHorizontal, Upload } from "lucide-react"

interface CaseDocumentsProps {
  caseId: string
}

export function CaseDocuments({ caseId }: CaseDocumentsProps) {
  // This would normally be fetched from an API
  const documents = [
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
    {
      id: "DOC-2023-004",
      name: "Exhibit A - Property Survey",
      type: "PDF",
      size: "3.2 MB",
      uploadedBy: "Michael Chen",
      uploadedAt: "2023-02-10T11:20:00",
    },
    {
      id: "DOC-2023-005",
      name: "Deposition Transcript - John Smith",
      type: "DOCX",
      size: "0.5 MB",
      uploadedBy: "Sarah Davis",
      uploadedAt: "2023-03-15T13:10:00",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
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
                  <TableCell className="font-medium">{doc.name}</TableCell>
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
    </div>
  )
}

