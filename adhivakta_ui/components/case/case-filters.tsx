import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function CaseFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search cases..." className="w-full pl-8" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Court" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courts</SelectItem>
            <SelectItem value="supreme">Supreme Court</SelectItem>
            <SelectItem value="high">High Court</SelectItem>
            <SelectItem value="commercial">Commercial Court</SelectItem>
            <SelectItem value="probate">Probate Court</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary">Filter</Button>
      </div>
    </div>
  )
}

