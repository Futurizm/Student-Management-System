import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentStudents() {
  const students = [
    {
      id: "STU001",
      name: "Olivia Johnson",
      email: "olivia.j@example.com",
      course: "Computer Science",
      imageUrl: "/placeholder.svg?height=40&width=40",
      updatedAt: "2 hours ago",
    },
    {
      id: "STU002",
      name: "Ethan Williams",
      email: "ethan.w@example.com",
      course: "Business Administration",
      imageUrl: "/placeholder.svg?height=40&width=40",
      updatedAt: "3 hours ago",
    },
    {
      id: "STU003",
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      course: "Graphic Design",
      imageUrl: "/placeholder.svg?height=40&width=40",
      updatedAt: "5 hours ago",
    },
    {
      id: "STU004",
      name: "Noah Thompson",
      email: "noah.t@example.com",
      course: "Psychology",
      imageUrl: "/placeholder.svg?height=40&width=40",
      updatedAt: "1 day ago",
    },
    {
      id: "STU005",
      name: "Emma Davis",
      email: "emma.d@example.com",
      course: "Engineering",
      imageUrl: "/placeholder.svg?height=40&width=40",
      updatedAt: "1 day ago",
    },
  ]

  return (
    <div className="space-y-8">
      {students.map((student) => (
        <div key={student.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={student.imageUrl} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{student.name}</p>
            <p className="text-sm text-muted-foreground">{student.course}</p>
          </div>
          <div className="ml-auto font-medium text-xs text-muted-foreground">{student.updatedAt}</div>
        </div>
      ))}
    </div>
  )
}

