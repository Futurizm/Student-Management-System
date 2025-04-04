import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, FileDown, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function TeacherDetailPage({ params }: { params: { id: string } }) {
  // Данные о преподавателе
  const teacher = {
    id: params.id,
    name: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    phone: "+7 (999) 123-45-67",
    department: "Информатика",
    position: "Профессор",
    status: "Active",
    dateOfBirth: "15.05.1975",
    address: "г. Москва, ул. Примерная, д. 123, кв. 45",
    education: "Московский государственный университет, факультет вычислительной математики и кибернетики, 1997 г.",
    experience: "Более 20 лет преподавательского опыта. Работал в ведущих университетах страны.",
    subjects: ["Математика", "Информатика", "Программирование", "Алгоритмы"],
    bio: "Профессор Иванов И.И. является признанным экспертом в области информационных технологий. Автор более 50 научных работ и 3 монографий. Активно участвует в международных конференциях и исследовательских проектах.",
    imageUrl: "/placeholder.svg?height=128&width=128",
  }

  // Группы преподавателя
  const groups = [
    {
      id: "G001",
      name: "AS-12",
      specialty: "Информатика",
      year: 1,
      students: 25,
    },
    {
      id: "G002",
      name: "BS-34",
      specialty: "Информатика",
      year: 2,
      students: 22,
    },
    {
      id: "G003",
      name: "CS-56",
      specialty: "Инженерия",
      year: 3,
      students: 18,
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к преподавателям
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={teacher.imageUrl} alt={teacher.name} />
                  <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{teacher.name}</h2>
                  <p className="text-muted-foreground">{teacher.position}</p>
                  <div className="mt-2">
                    <Badge
                      variant={teacher.status === "Active" ? "default" : "secondary"}
                      className={
                        teacher.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{teacher.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Отделение:</span>
                    <span className="text-sm font-medium">{teacher.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Предметы:</span>
                    <span className="text-sm font-medium">{teacher.subjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Группы:</span>
                    <span className="text-sm font-medium">{groups.length}</span>
                  </div>
                </div>
                <div className="mt-4 flex w-full gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Edit className="h-4 w-4" />
                    Редактировать
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <FileDown className="h-4 w-4" />
                    Экспорт
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <Tabs defaultValue="details">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Информация о преподавателе</CardTitle>
                  <TabsList>
                    <TabsTrigger value="details">Детали</TabsTrigger>
                    <TabsTrigger value="groups">Группы</TabsTrigger>
                    <TabsTrigger value="subjects">Предметы</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>Просмотр и управление информацией о преподавателе</CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">ФИО</p>
                      <p className="text-sm text-muted-foreground">{teacher.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Телефон</p>
                      <p className="text-sm text-muted-foreground">{teacher.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Дата рождения</p>
                      <p className="text-sm text-muted-foreground">{teacher.dateOfBirth}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Должность</p>
                      <p className="text-sm text-muted-foreground">{teacher.position}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Отделение</p>
                      <p className="text-sm text-muted-foreground">{teacher.department}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium">Адрес</p>
                      <p className="text-sm text-muted-foreground">{teacher.address}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium">Образование</p>
                      <p className="text-sm text-muted-foreground">{teacher.education}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium">Опыт работы</p>
                      <p className="text-sm text-muted-foreground">{teacher.experience}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium">Биография</p>
                      <p className="text-sm text-muted-foreground">{teacher.bio}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="groups" className="space-y-4">
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Группа
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Специальность
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Курс
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Студентов
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groups.map((group) => (
                          <tr key={group.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {group.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.specialty}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.students}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link href={`/dashboard/groups/${group.id}`}>
                                <Button variant="ghost" size="sm">
                                  Просмотр
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="subjects" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teacher.subjects.map((subject) => (
                        <Card key={subject}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                  <span className="text-blue-700 font-medium">{subject.charAt(0)}</span>
                                </div>
                                <div>
                                  <h3 className="font-medium">{subject}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {Math.floor(Math.random() * 5) + 1} групп
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Детали
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Удалить преподавателя
                </Button>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

