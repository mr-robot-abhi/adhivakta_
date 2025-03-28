"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export function AddCaseForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [filingDate, setFilingDate] = useState<Date | undefined>(new Date())
  const [hearingDate, setHearingDate] = useState<Date | undefined>()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Case added successfully",
        description: "The case has been added to your case list.",
      })
      router.push("/cases")
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Case</CardTitle>
        <CardDescription>Enter the case details to add it to your case management system.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case-title">Case Title</Label>
            <Input id="case-title" placeholder="e.g., Smith vs. Johnson" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="case-number">Case Number</Label>
              <Input id="case-number" placeholder="e.g., CS-2023-1234" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="court">Court</Label>
              <Select>
                <SelectTrigger id="court">
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supreme">Supreme Court</SelectItem>
                  <SelectItem value="high">High Court</SelectItem>
                  <SelectItem value="district">District Court</SelectItem>
                  <SelectItem value="commercial">Commercial Court</SelectItem>
                  <SelectItem value="family">Family Court</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filing-date">Filing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {filingDate ? format(filingDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={filingDate} onSelect={setFilingDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="active">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-smith">John Smith</SelectItem>
                <SelectItem value="jane-doe">Jane Doe</SelectItem>
                <SelectItem value="abc-corp">ABC Corporation</SelectItem>
                <SelectItem value="williams-family">Williams Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opposing-party">Opposing Party</Label>
              <Input id="opposing-party" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opposing-counsel">Opposing Counsel</Label>
              <Input id="opposing-counsel" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-hearing">Next Hearing Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {hearingDate ? format(hearingDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={hearingDate} onSelect={setHearingDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Case Description</Label>
            <Textarea id="description" rows={4} placeholder="Provide a brief description of the case..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned-lawyers">Assigned Lawyers</Label>
            <Select>
              <SelectTrigger id="assigned-lawyers">
                <SelectValue placeholder="Select primary lawyer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah-davis">Sarah Davis</SelectItem>
                <SelectItem value="michael-chen">Michael Chen</SelectItem>
                <SelectItem value="robert-williams">Robert Williams</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Case...
              </>
            ) : (
              "Add Case"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

