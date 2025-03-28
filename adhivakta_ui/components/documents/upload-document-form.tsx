"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Upload, FileText, X, HardDriveIcon as GoogleDrive, File } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export function UploadDocumentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [driveLink, setDriveLink] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleDriveLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriveLink(e.target.value)
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (selectedFile) {
      simulateUpload()
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Document uploaded successfully",
        description: "The document has been added to your document library.",
      })
      router.push("/documents")
    }, 4500)
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <File className="h-8 w-8 text-red-500" />
      case "doc":
      case "docx":
        return <File className="h-8 w-8 text-blue-500" />
      case "xls":
      case "xlsx":
        return <File className="h-8 w-8 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="h-8 w-8 text-purple-500" />
      default:
        return <FileText className="h-8 w-8 text-primary" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>Upload a document to your case management system.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input id="document-name" placeholder="e.g., Motion to Dismiss" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pleading">Pleading</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="exhibit">Exhibit</SelectItem>
                  <SelectItem value="correspondence">Correspondence</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="case">Related Case</Label>
              <Select>
                <SelectTrigger id="case">
                  <SelectValue placeholder="Select case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs-2023-1234">Smith vs. Johnson</SelectItem>
                  <SelectItem value="cs-2023-1235">Doe vs. State</SelectItem>
                  <SelectItem value="cs-2023-1236">ABC Corp vs. XYZ Ltd</SelectItem>
                  <SelectItem value="none">No Related Case</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} placeholder="Brief description of the document..." />
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="drive">Google Drive</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors ${
                    selectedFile
                      ? "border-primary/50 bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {!selectedFile ? (
                    <>
                      <div className="relative h-24 w-24 mb-4">
                        <Image
                          src="/images/legal-workspace.png"
                          alt="Upload document"
                          fill
                          className="object-cover rounded-md opacity-70"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">Supports PDF, DOCX, XLSX, JPG, PNG (max 10MB)</p>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center justify-between w-full mb-4">
                        <div className="flex items-center">
                          {getFileIcon(selectedFile.name.split(".").pop() || "")}
                          <div className="ml-3">
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={clearSelectedFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="drive" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drive-link">Google Drive Link</Label>
                <div className="space-y-4">
                  <Input
                    id="drive-link"
                    placeholder="https://drive.google.com/file/d/..."
                    value={driveLink}
                    onChange={handleDriveLinkChange}
                  />
                  <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                    <div className="text-center">
                      <GoogleDrive className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Paste a Google Drive sharing link above</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Make sure the file is accessible to anyone with the link
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.open("https://drive.google.com", "_blank")}
                      >
                        Open Google Drive
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="e.g., important, confidential (comma separated)" />
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
                Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

