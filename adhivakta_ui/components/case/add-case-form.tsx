"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Calendar, Plus, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Stakeholder = {
  id: string
  name: string
  email: string
  phone: string
}

type Counsel = {
  id: string
  name: string
  email: string
  phone: string
}

export function AddCaseForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [filingDate, setFilingDate] = useState<Date | undefined>(new Date())
  const [hearingDate, setHearingDate] = useState<Date | undefined>()
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [counselForRespondent, setCounselForRespondent] = useState<Counsel[]>([])
  const [isSeniorCounsel, setIsSeniorCounsel] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { id: Date.now().toString(), name: "", email: "", phone: "" }])
  }

  const removeStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(sh => sh.id !== id))
  }

  const addCounselForRespondent = () => {
    setCounselForRespondent([...counselForRespondent, { id: Date.now().toString(), name: "", email: "", phone: "" }])
  }

  const removeCounselForRespondent = (id: string) => {
    setCounselForRespondent(counselForRespondent.filter(c => c.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate closed cases can't have future dates
    const form = e.target as HTMLFormElement
    const status = (form.elements.namedItem("status") as HTMLSelectElement)?.value
    const closingDate = (form.elements.namedItem("closing-date") as HTMLInputElement)?.value
    
    if (status === "closed" && new Date(closingDate) > new Date("2025-03-29")) {
      toast({
        title: "Validation Error",
        description: "Closed cases must have a closing date before March 29, 2025",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

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
        <CardContent className="space-y-6">
          <Accordion type="multiple" defaultValue={["case-details", "parties", "court-details"]}>
            {/* Case Details Section */}
            <AccordionItem value="case-details">
              <AccordionTrigger className="text-lg font-medium">Case Details</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
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
                    <Label htmlFor="case-type">Case Type</Label>
                    <Select>
                      <SelectTrigger id="case-type">
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="criminal">Criminal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="writs">Writs</SelectItem>
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
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {filingDate && (
                  <div className="space-y-2">
                    <Label htmlFor="description">Case Description</Label>
                    <Textarea id="description" rows={4} placeholder="Provide a brief description of the case..." required />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Parties Section */}
            <AccordionItem value="parties">
              <AccordionTrigger className="text-lg font-medium">Parties Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="petitioner-plaintiff">Petitioner/Plaintiff</Label>
                  <Select>
                    <SelectTrigger id="petitioner-plaintiff">
                      <SelectValue placeholder="Select petitioner/plaintiff" />
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
                    <Label htmlFor="petitioner-email">Petitioner Email</Label>
                    <Input id="petitioner-email" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="petitioner-phone">Petitioner Phone</Label>
                    <Input id="petitioner-phone" type="tel" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defendant">Defendant</Label>
                  <Input id="defendant" placeholder="Name of defendant" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defendant-email">Defendant Email</Label>
                    <Input id="defendant-email" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defendant-phone">Defendant Phone</Label>
                    <Input id="defendant-phone" type="tel" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Stakeholders</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addStakeholder}>
                      <Plus className="h-4 w-4 mr-2" /> Add Stakeholder
                    </Button>
                  </div>
                  
                  {stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={stakeholder.name}
                          onChange={(e) => {
                            const updated = stakeholders.map(sh => 
                              sh.id === stakeholder.id ? {...sh, name: e.target.value} : sh
                            )
                            setStakeholders(updated)
                          }}
                          placeholder="Stakeholder name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={stakeholder.email}
                          onChange={(e) => {
                            const updated = stakeholders.map(sh => 
                              sh.id === stakeholder.id ? {...sh, email: e.target.value} : sh
                            )
                            setStakeholders(updated)
                          }}
                          type="email"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2 flex items-end gap-2">
                        <div className="flex-1">
                          <Label>Phone</Label>
                          <Input
                            value={stakeholder.phone}
                            onChange={(e) => {
                              const updated = stakeholders.map(sh => 
                                sh.id === stakeholder.id ? {...sh, phone: e.target.value} : sh
                              )
                              setStakeholders(updated)
                            }}
                            type="tel"
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStakeholder(stakeholder.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Court Details Section */}
            <AccordionItem value="court-details">
              <AccordionTrigger className="text-lg font-medium">Court Details</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="court-type">Court Type</Label>
                    <Select>
                      <SelectTrigger id="court-type">
                        <SelectValue placeholder="Select court type" />
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
                  <div className="space-y-2">
                    <Label htmlFor="court-hall">Court Hall</Label>
                    <Input id="court-hall" placeholder="e.g., Hall No. 5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="judge-name">Judge Name</Label>
                    <Input id="judge-name" placeholder="Honorable Judge Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bench">Bench</Label>
                    <Input id="bench" placeholder="e.g., Division Bench" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Legal Representation Section */}
            <AccordionItem value="legal-representation">
              <AccordionTrigger className="text-lg font-medium">Legal Representation</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
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

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="senior-counsel" 
                    checked={isSeniorCounsel}
                    onCheckedChange={(checked) => setIsSeniorCounsel(checked as boolean)}
                  />
                  <Label htmlFor="senior-counsel">Designated Senior Counsel</Label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Counsel for Respondent</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addCounselForRespondent}>
                      <Plus className="h-4 w-4 mr-2" /> Add Counsel
                    </Button>
                  </div>
                  
                  {counselForRespondent.map((counsel) => (
                    <div key={counsel.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={counsel.name}
                          onChange={(e) => {
                            const updated = counselForRespondent.map(c => 
                              c.id === counsel.id ? {...c, name: e.target.value} : c
                            )
                            setCounselForRespondent(updated)
                          }}
                          placeholder="Counsel name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={counsel.email}
                          onChange={(e) => {
                            const updated = counselForRespondent.map(c => 
                              c.id === counsel.id ? {...c, email: e.target.value} : c
                            )
                            setCounselForRespondent(updated)
                          }}
                          type="email"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2 flex items-end gap-2">
                        <div className="flex-1">
                          <Label>Phone</Label>
                          <Input
                            value={counsel.phone}
                            onChange={(e) => {
                              const updated = counselForRespondent.map(c => 
                                c.id === counsel.id ? {...c, phone: e.target.value} : c
                              )
                              setCounselForRespondent(updated)
                            }}
                            type="tel"
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCounselForRespondent(counsel.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Hearing Information */}
            <AccordionItem value="hearing-info">
              <AccordionTrigger className="text-lg font-medium">Hearing Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
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
                  <Label htmlFor="hearing-notes">Hearing Notes</Label>
                  <Textarea id="hearing-notes" rows={3} placeholder="Any notes about the upcoming hearing..." />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Documents Section */}
            <AccordionItem value="documents">
              <AccordionTrigger className="text-lg font-medium">Documents</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Upload Documents</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">PDF, DOCX, JPG, PNG (MAX. 10MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" multiple />
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <div className="p-6 flex justify-between border-t">
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
        </div>
      </form>
    </Card>
  )
}