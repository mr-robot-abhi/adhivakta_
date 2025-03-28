import { AddClientForm } from "@/components/clients/add-client-form"

export default function AddClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Add New Client</h1>
      </div>
      <AddClientForm />
    </div>
  )
}

