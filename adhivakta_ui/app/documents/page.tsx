import { DocumentList } from "@/components/documents/document-list"
import { DocumentFilters } from "@/components/documents/document-filters"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      <DocumentFilters />
      <DocumentList />
    </div>
  )
}

