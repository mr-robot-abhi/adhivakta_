import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function DocumentFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search documents..." className="w-full pl-8" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">DOCX</SelectItem>
            <SelectItem value="xlsx">XLSX</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Case" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cases</SelectItem>
            <SelectItem value="cs-2023-1234">Smith vs. Johnson</SelectItem>
            <SelectItem value="cs-2023-1235">Doe vs. State</SelectItem>
            <SelectItem value="cs-2023-1236">ABC Corp vs. XYZ Ltd</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary">Filter</Button>
      </div>
    </div>
  )
}

