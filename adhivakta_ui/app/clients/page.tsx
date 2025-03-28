import { ClientList } from "@/components/clients/client-list"
import { ClientFilters } from "@/components/clients/client-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserPlus } from "lucide-react"

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
      <ClientFilters />
      <ClientList />
    </div>
  )
}

