import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SchedulePage() {
  // Дни недели
  const weekDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]

  // Временные слоты
  const timeSlots = [
    "8:30 - 10:00",
    "10:15 - 11:45",
    "12:00 - 13:30",
    "13:45 - 15:15",
    "15:30 - 17:00",
    "17:15 - 18:45",
  ]

  // Предметы
  const subjects = [
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
  ]

  // Преподаватели
  const teachers = ["Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Козлов К.К.", "Смирнов С.С."]

  // Аудитории
  const rooms = ["101", "102", "103", "201", "202", "203", "301", "302", "303"]

  // Генерация расписания
  const generateSchedule = () => {
    const schedule = []

    for (let dayIndex = 0; dayIndex < weekDays.length; dayIndex++) {
      const daySchedule = []

      // Генерируем от 3 до 5 пар в день
      const lessonsCount = Math.floor(Math.random() * 3) + 3

      // Выбираем случайные временные слоты
      const selectedTimeSlots = []
      while (selectedTimeSlots.length < lessonsCount) {
        const randomSlotIndex = Math.floor(Math.random() * timeSlots.length)
        if (!selectedTimeSlots.includes(randomSlotIndex)) {
          selectedTimeSlots.push(randomSlotIndex)
        }
      }

      // Сортируем временные слоты
      selectedTimeSlots.sort((a, b) => a - b)

      // Создаем пары для выбранных временных слотов
      for (const slotIndex of selectedTimeSlots) {
        const subjectIndex = Math.floor(Math.random() * subjects.length)
        const teacherIndex = Math.floor(Math.random() * teachers.length)
        const roomIndex = Math.floor(Math.random() * rooms.length)

        daySchedule.push({
          time: timeSlots[slotIndex],
          subject: subjects[subjectIndex],
          teacher: teachers[teacherIndex],
          room: rooms[roomIndex],
          type: Math.random() > 0.5 ? "Лекция" : "Практика",
        })
      }

      schedule.push({
        day: weekDays[dayIndex],
        lessons: daySchedule,
      })
    }

    return schedule
  }

  const schedule = generateSchedule()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Расписание</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Печать
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">11 - 17 марта 2024</div>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="ml-2 gap-2">
              <Calendar className="h-4 w-4" />
              Сегодня
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="group">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите группу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Моя группа</SelectItem>
                <SelectItem value="as-12">AS-12</SelectItem>
                <SelectItem value="bs-34">BS-34</SelectItem>
                <SelectItem value="cs-56">CS-56</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Фильтры
            </Button>
          </div>
        </div>

        <Tabs defaultValue="week" className="space-y-4">
          <TabsList>
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="day">День</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardContent className="p-0">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Тип
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedule.map((day, dayIndex) =>
                        day.lessons.map((lesson, lessonIndex) => (
                          <tr key={`${dayIndex}-${lessonIndex}`}>
                            {lessonIndex === 0 && (
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                rowSpan={day.lessons.length}
                              >
                                {day.day}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {lesson.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.teacher}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.room}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={
                                  lesson.type === "Лекция"
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                    : "bg-green-50 text-green-700 hover:bg-green-50"
                                }
                              >
                                {lesson.type}
                              </Badge>
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
          <TabsContent value="day" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Расписание на понедельник</CardTitle>
                <CardDescription>11 марта 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedule[0].lessons.map((lesson, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">{lesson.subject}</h3>
                              <p className="text-sm text-muted-foreground">{lesson.time}</p>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col items-end">
                            <Badge
                              variant="outline"
                              className={
                                lesson.type === "Лекция"
                                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                  : "bg-green-50 text-green-700 hover:bg-green-50"
                              }
                            >
                              {lesson.type}
                            </Badge>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {lesson.teacher} • Ауд. {lesson.room}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Календарь на март 2024</CardTitle>
                <CardDescription>Просмотр расписания на месяц</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                    <div key={day} className="py-2 text-sm font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-md border p-2 text-sm ${i + 1 === 11 ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <div className="font-medium">{i + 1}</div>
                      {i % 7 < 5 && (
                        <div className="mt-1 text-xs">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {Math.floor(Math.random() * 4) + 2} пары
                          </Badge>
                        </div>
                      )}
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

