import { AddCaseForm } from "@/components/case/add-case-form"

export default function AddCasePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Add New Case</h1>
      </div>
      <AddCaseForm />
    </div>
  )
}

