import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileText, Calendar } from "lucide-react"

export default function ChildrenPage() {
  // Данные о детях
  const children = [
    {
      id: "C001",
      name: "Алексей Иванов",
      grade: "10A",
      age: 16,
      school: "Школа №1234",
      subjects: ["Математика", "Физика", "Информатика", "Русский язык", "Английский язык"],
      averageGrade: 4.7,
      attendance: "95%",
      imageUrl: "/placeholder.svg?height=128&width=128",
    },
    {
      id: "C002",
      name: "Мария Иванова",
      grade: "7Б",
      age: 13,
      school: "Школа №1234",
      subjects: ["Математика", "Биология", "История", "Русский язык", "Английский язык"],
      averageGrade: 4.5,
      attendance: "98%",
      imageUrl: "/placeholder.svg?height=128&width=128",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Мои дети</h1>
        <p className="text-muted-foreground">Информация о ваших детях, их успеваемости и расписании</p>

        <div className="grid gap-6 md:grid-cols-2">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={child.imageUrl} alt={child.name} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription>
                      Класс: {child.grade} | Возраст: {child.age} лет
                    </CardDescription>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{child.school}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="info">
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="info" className="flex-1">
                      Информация
                    </TabsTrigger>
                    <TabsTrigger value="grades" className="flex-1">
                      Оценки
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1">
                      Расписание
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-4">
                    <TabsContent value="info" className="m-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Предметы</h3>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {child.subjects.map((subject) => (
                              <Badge key={subject} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium">Средний балл</h3>
                            <p className="mt-1 text-2xl font-bold text-blue-600">{child.averageGrade}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Посещаемость</h3>
                            <p className="mt-1 text-2xl font-bold text-green-600">{child.attendance}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1 gap-2">
                            <Eye className="h-4 w-4" />
                            Подробнее
                          </Button>
                          <Button variant="outline" className="flex-1 gap-2">
                            <FileText className="h-4 w-4" />
                            Отчет
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="grades" className="m-0">
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Предмет
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Оценки
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Средний балл
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {child.subjects.slice(0, 3).map((subject) => (
                                <tr key={subject}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {subject}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <span key={i} className="inline-block mx-1 px-2 py-1 rounded-full bg-gray-100">
                                        {Math.floor(Math.random() * 2) + 4}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {(Math.random() * (5 - 4) + 4).toFixed(1)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button variant="outline" className="w-full gap-2">
                          <FileText className="h-4 w-4" />
                          Показать все предметы
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="schedule" className="m-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Расписание на неделю</h3>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Календарь
                          </Button>
                        </div>
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  День
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Предметы
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {["Понедельник", "Вторник", "Среда"].map((day) => (
                                <tr key={day}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {day}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {child.subjects.slice(0, 3 + Math.floor(Math.random() * 2)).map((subject, idx) => (
                                      <span key={idx} className="block">
                                        {idx + 1}. {subject}
                                      </span>
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button variant="outline" className="w-full gap-2">
                          <Calendar className="h-4 w-4" />
                          Полное расписание
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

