import { CaseDetails } from "@/components/case/case-details"
import { CaseDocuments } from "@/components/case/case-documents"
import { CaseTimeline } from "@/components/case/case-timeline"
import { CaseActions } from "@/components/case/case-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Case #{params.id}</h1>
        <CaseActions caseId={params.id} />
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <CaseDetails caseId={params.id} />
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <CaseDocuments caseId={params.id} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <CaseTimeline caseId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

