"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, FileDown, Mail, Phone } from "lucide-react"

interface ViewTeacherModalProps {
  teacher: any
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function ViewTeacherModal({ teacher, isOpen, onClose, onEdit }: ViewTeacherModalProps) {
  if (!teacher) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Профиль преподавателя</DialogTitle>
          <DialogDescription>Просмотр информации о преподавателе {teacher.name}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-auto">
          <div className="p-6 space-y-6">
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
                      <p className="text-muted-foreground">{teacher.role}</p>
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
                        <span className="text-sm">{teacher.phone || "+7 (999) 123-4567"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Отделение:</span>
                        <span className="text-sm font-medium">{teacher.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Должность:</span>
                        <span className="text-sm font-medium">{teacher.role}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex w-full gap-2">
                      <Button variant="outline" className="flex-1 gap-2" onClick={onEdit}>
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

              <div className="md:col-span-2">
                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger value="details">Детали</TabsTrigger>
                    <TabsTrigger value="subjects">Предметы</TabsTrigger>
                    <TabsTrigger value="groups">Группы</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Полное имя</p>
                        <p className="text-sm text-muted-foreground">{teacher.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Телефон</p>
                        <p className="text-sm text-muted-foreground">{teacher.phone || "+7 (999) 123-4567"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Отделение</p>
                        <p className="text-sm text-muted-foreground">{teacher.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Должность</p>
                        <p className="text-sm text-muted-foreground">{teacher.role}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Статус</p>
                        <p className="text-sm text-muted-foreground">{teacher.status}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium">Адрес</p>
                        <p className="text-sm text-muted-foreground">г. Москва, ул. Примерная, д. 123, кв. 45</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium">Образование</p>
                        <p className="text-sm text-muted-foreground">
                          Московский государственный университет, факультет вычислительной математики и кибернетики,
                          1997 г.
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium">Опыт работы</p>
                        <p className="text-sm text-muted-foreground">
                          Более 20 лет преподавательского опыта. Работал в ведущих университетах страны.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="subjects" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Математика", "Информатика", "Программирование", "Алгоритмы"].map((subject) => (
                        <Card key={subject}>
                          <CardContent className="p-4">
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="groups" className="space-y-4 mt-4">
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
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AS-12</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Информатика</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BS-34</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Информатика</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS-56</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Инженерия</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

