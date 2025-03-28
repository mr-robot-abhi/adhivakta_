import { CaseList } from "@/components/case/case-list"
import { CaseFilters } from "@/components/case/case-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cases</h1>
        <Button asChild>
          <Link href="/cases/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Case
          </Link>
        </Button>
      </div>
      <CaseFilters />
      <CaseList />
    </div>
  )
}

