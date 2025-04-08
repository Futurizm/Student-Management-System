"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, FileDown, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface StudentProfileProps {
  id: string
}

export function StudentProfile({ id }: StudentProfileProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Mock student data - in a real app, this would be fetched from an API
  const student = {
    id: id,
    name: "Olivia Johnson",
    email: "olivia.j@example.com",
    studentId: "S12345",
    course: "Computer Science",
    nationality: "United States",
    status: "Active",
    dateOfBirth: "1999-05-15",
    gender: "Female",
    address: "123 College Ave, Boston, MA 02115",
    phoneNumber: "+1 (555) 123-4567",
    emergencyContact: "Robert Johnson (Father): +1 (555) 987-6543",
    enrollmentDate: "2021-09-01",
    expectedGraduation: "2025-05-30",
    gpa: "3.8",
    imageUrl: "/placeholder.svg?height=128&width=128",
    notes:
      "Olivia is an exceptional student with a strong interest in artificial intelligence and machine learning. She has participated in several hackathons and research projects.",
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      setIsLoading(true)

      // Simulate deletion
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard/students")
      }, 1500)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={student.imageUrl} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">{student.studentId}</p>
                <div className="mt-2">
                  <Badge
                    variant={student.status === "Active" ? "default" : "secondary"}
                    className={
                      student.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Course:</span>
                  <span className="text-sm font-medium">{student.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">GPA:</span>
                  <span className="text-sm font-medium">{student.gpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Enrolled:</span>
                  <span className="text-sm font-medium">{student.enrollmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expected Graduation:</span>
                  <span className="text-sm font-medium">{student.expectedGraduation}</span>
                </div>
              </div>
              <div className="mt-4 flex w-full gap-2">
                <Link href={`/dashboard/students/${id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1 gap-2">
                  <FileDown className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="details">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>View and manage student information</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{student.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">{student.dateOfBirth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">{student.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Nationality</p>
                    <p className="text-sm text-muted-foreground">{student.nationality}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">{student.phoneNumber}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{student.address}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <p className="text-sm text-muted-foreground">{student.emergencyContact}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="academic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Course</p>
                    <p className="text-sm text-muted-foreground">{student.course}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Student ID</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Enrollment Date</p>
                    <p className="text-sm text-muted-foreground">{student.enrollmentDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Expected Graduation</p>
                    <p className="text-sm text-muted-foreground">{student.expectedGraduation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">GPA</p>
                    <p className="text-sm text-muted-foreground">{student.gpa}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">{student.status}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium">Courses Enrolled</h3>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Credits
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS101</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Introduction to Computer Science
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS201</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Data Structures</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A-</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS301</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Algorithms</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">B+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notes</h3>
                  <p className="text-sm text-muted-foreground">{student.notes}</p>
                </div>
              </TabsContent>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="gap-2">
                <Trash2 className="h-4 w-4" />
                {isLoading ? "Deleting..." : "Delete Student"}
              </Button>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

