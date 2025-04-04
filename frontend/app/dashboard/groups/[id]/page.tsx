import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Calendar, FileText, Mail } from "lucide-react"
import Link from "next/link"

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  // Данные о группе
  const group = {
    id: params.id,
    name: "AS-12",
    specialty: "Информатика",
    year: 1,
    students: 25,
    curator: "Иванов Иван Иванович",
    curatorEmail: "ivanov@example.com",
    startDate: "01.09.2023",
    endDate: "30.06.2027",
    department: "Факультет информационных технологий",
    description:
      "Группа студентов первого курса специальности Информатика. Обучение проходит по программе бакалавриата.",
  }

  // Данные о студентах группы
  const students = Array.from({ length: 10 }, (_, i) => ({
    id: `S${i + 1}`,
    name: `Студент ${i + 1}`,
    email: `student${i + 1}@example.com`,
    status: i % 5 === 0 ? "Inactive" : "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  }))

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/groups">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к группам
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Группа {group.name}</h1>
            <p className="text-muted-foreground">
              {group.specialty}, {group.year} курс
            </p>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Расписание
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Отчет
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Mail className="h-4 w-4" />
              Связаться
            </Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="students">Студенты</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="performance">Успеваемость</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>Детальная информация о группе {group.name}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Название группы</p>
                  <p className="text-sm text-muted-foreground">{group.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Специальность</p>
                  <p className="text-sm text-muted-foreground">{group.specialty}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Курс</p>
                  <p className="text-sm text-muted-foreground">{group.year}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Количество студентов</p>
                  <p className="text-sm text-muted-foreground">{group.students}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Куратор</p>
                  <p className="text-sm text-muted-foreground">{group.curator}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email куратора</p>
                  <p className="text-sm text-muted-foreground">{group.curatorEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Дата начала обучения</p>
                  <p className="text-sm text-muted-foreground">{group.startDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Дата окончания обучения</p>
                  <p className="text-sm text-muted-foreground">{group.endDate}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium">Факультет</p>
                  <p className="text-sm text-muted-foreground">{group.department}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium">Описание</p>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Студенты группы</CardTitle>
                  <CardDescription>Список студентов, обучающихся в группе {group.name}</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Студент
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.imageUrl} alt={student.name} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">ID: {student.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link href={`/dashboard/students/${student.id}`}>
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Расписание занятий</CardTitle>
                <CardDescription>Расписание занятий группы {group.name} на текущую неделю</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          День
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Время
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Предмет
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Преподаватель
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Аудитория
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"].map((day, dayIndex) =>
                        Array.from({ length: 3 }, (_, i) => (
                          <tr key={`${day}-${i}`}>
                            {i === 0 && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={3}>
                                {day}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {`${8 + i * 2}:30 - ${10 + i * 2}:00`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {
                                [
                                  "Математика",
                                  "Информатика",
                                  "Физика",
                                  "Английский язык",
                                  "История",
                                  "Программирование",
                                  "Базы данных",
                                  "Сети",
                                  "Алгоритмы",
                                  "Веб-разработка",
                                  "Операционные системы",
                                  "Компьютерная графика",
                                  "Искусственный интеллект",
                                  "Машинное обучение",
                                  "Защита информации",
                                ][(dayIndex * 3 + i) % 15]
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {
                                ["Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Козлов К.К.", "Смирнов С.С."][
                                  (dayIndex + i) % 5
                                ]
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {`${((dayIndex + i) % 3) + 1}${((dayIndex * 3 + i) % 9) + 1}${((dayIndex + i * 2) % 9) + 1}`}
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Успеваемость группы</CardTitle>
                <CardDescription>Статистика успеваемости группы {group.name} по предметам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Математика", "Информатика", "Физика", "Английский язык", "История"].map((subject, i) => (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{subject}</h4>
                        <span className="text-sm font-medium text-blue-600">{(4 + Math.random()).toFixed(1)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${70 + Math.floor(Math.random() * 20)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Средний балл: {(4 + Math.random()).toFixed(1)}</span>
                        <span>Посещаемость: {80 + Math.floor(Math.random() * 15)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

