import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export function ClientList() {
  const clients = [
    {
      id: "CL-2023-001",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      type: "Individual",
      activeCases: 2,
      joinedAt: "2023-01-05T10:30:00",
    },
    {
      id: "CL-2023-002",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 234-5678",
      type: "Individual",
      activeCases: 1,
      joinedAt: "2023-01-10T14:15:00",
    },
    {
      id: "CL-2023-003",
      name: "ABC Corporation",
      email: "legal@abccorp.com",
      phone: "+1 (555) 345-6789",
      type: "Corporate",
      activeCases: 1,
      joinedAt: "2023-02-15T09:45:00",
    },
    {
      id: "CL-2023-004",
      name: "Williams Family",
      email: "williams.estate@example.com",
      phone: "+1 (555) 456-7890",
      type: "Family",
      activeCases: 1,
      joinedAt: "2023-03-01T11:20:00",
    },
    {
      id: "CL-2023-005",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 567-8901",
      type: "Individual",
      activeCases: 1,
      joinedAt: "2023-03-10T13:10:00",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Active Cases</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={client.name} />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.type}</TableCell>
                <TableCell>{client.activeCases}</TableCell>
                <TableCell>{new Date(client.joinedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/clients/${client.id}`}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View client</span>
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Add case</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
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

