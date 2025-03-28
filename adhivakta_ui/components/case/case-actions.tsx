import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Edit, MoreHorizontal, Printer, Share } from "lucide-react"

interface CaseActionsProps {
  caseId: string
}

export function CaseActions({ caseId }: CaseActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button variant="outline" size="sm">
        <Calendar className="mr-2 h-4 w-4" />
        Schedule
      </Button>
      <Button variant="outline" size="sm">
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Archive Case</DropdownMenuItem>
          <DropdownMenuItem>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem>Duplicate Case</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

