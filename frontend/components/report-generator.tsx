"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDown, FileSpreadsheet, FileIcon as FilePdf, Loader2 } from "lucide-react"

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState("students")
  const [fileFormat, setFileFormat] = useState("excel")

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      // In a real app, this would trigger a download
      alert(`Report generated in ${fileFormat} format!`)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>Create custom reports based on student data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="standard" className="space-y-4">
            <div className="grid gap-4 py-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select defaultValue={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">All Students</SelectItem>
                    <SelectItem value="courses">Students by Course</SelectItem>
                    <SelectItem value="nationality">Students by Nationality</SelectItem>
                    <SelectItem value="status">Students by Status</SelectItem>
                    <SelectItem value="performance">Academic Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-format">File Format</Label>
                <Select defaultValue={fileFormat} onValueChange={setFileFormat}>
                  <SelectTrigger id="file-format">
                    <SelectValue placeholder="Select file format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Filters</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="course-filter">Course</Label>
                  <Select>
                    <SelectTrigger id="course-filter">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                      <SelectItem value="design">Graphic Design</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality-filter">Nationality</Label>
                  <Select>
                    <SelectTrigger id="nationality-filter">
                      <SelectValue placeholder="All Nationalities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Nationalities</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Fields to Include</Label>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-name" defaultChecked />
                  <label
                    htmlFor="field-name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-id" defaultChecked />
                  <label
                    htmlFor="field-id"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Student ID
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-email" defaultChecked />
                  <label
                    htmlFor="field-email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-course" defaultChecked />
                  <label
                    htmlFor="field-course"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Course
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-nationality" defaultChecked />
                  <label
                    htmlFor="field-nationality"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Nationality
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-dob" />
                  <label
                    htmlFor="field-dob"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Date of Birth
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-address" />
                  <label
                    htmlFor="field-address"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Address
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-phone" />
                  <label
                    htmlFor="field-phone"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Phone Number
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="field-status" defaultChecked />
                  <label
                    htmlFor="field-status"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Status
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-title">Report Title</Label>
              <Input id="custom-title" placeholder="Enter a title for your report" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="custom-file-format">File Format</Label>
                <Select defaultValue="excel">
                  <SelectTrigger id="custom-file-format">
                    <SelectValue placeholder="Select file format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="current">Current Semester</SelectItem>
                    <SelectItem value="previous">Previous Semester</SelectItem>
                    <SelectItem value="year">Current Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {fileFormat === "excel" ? (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              ) : fileFormat === "pdf" ? (
                <FilePdf className="mr-2 h-4 w-4" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Generate Report
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

