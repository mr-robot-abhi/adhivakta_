import { UploadDocumentForm } from "@/components/documents/upload-document-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UploadDocumentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Upload Document</h1>
      </div>

      <UploadDocumentForm />
    </div>
  )
}

