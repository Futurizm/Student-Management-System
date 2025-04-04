"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, FileDown, Mail, Phone } from "lucide-react"

interface ViewStudentModalProps {
  student: any
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function ViewStudentModal({ student, isOpen, onClose, onEdit }: ViewStudentModalProps) {
  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Профиль студента</DialogTitle>
          <DialogDescription>Просмотр информации о студенте {student.name}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-auto">
          <div className="p-6 space-y-6">
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
                          {student.status === "Active" ? "Активен" : "Неактивен"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{student.phoneNumber || "+7 (999) 123-4567"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Направление:</span>
                        <span className="text-sm font-medium">{student.course}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Гражданство:</span>
                        <span className="text-sm font-medium">{student.nationality}</span>
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
                    <TabsTrigger value="academic">Академические</TabsTrigger>
                    <TabsTrigger value="notes">Заметки</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Полное имя</p>
                        <p className="text-sm text-muted-foreground">{student.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Дата рождения</p>
                        <p className="text-sm text-muted-foreground">15.05.2000</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Пол</p>
                        <p className="text-sm text-muted-foreground">
                          {student.gender === "male" ? "Мужской" : "Женский"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Гражданство</p>
                        <p className="text-sm text-muted-foreground">{student.nationality}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Телефон</p>
                        <p className="text-sm text-muted-foreground">{student.phoneNumber || "+7 (999) 123-4567"}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium">Адрес</p>
                        <p className="text-sm text-muted-foreground">г. Москва, ул. Примерная, д. 123, кв. 45</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium">Экстренный контакт</p>
                        <p className="text-sm text-muted-foreground">Иванов Иван Иванович (отец): +7 (999) 987-6543</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="academic" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Направление</p>
                        <p className="text-sm text-muted-foreground">{student.course}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">ID студента</p>
                        <p className="text-sm text-muted-foreground">{student.studentId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Дата зачисления</p>
                        <p className="text-sm text-muted-foreground">01.09.2021</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Ожидаемое окончание</p>
                        <p className="text-sm text-muted-foreground">30.06.2025</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Средний балл</p>
                        <p className="text-sm text-muted-foreground">4.5</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Статус</p>
                        <p className="text-sm text-muted-foreground">{student.status}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="mb-2 text-sm font-medium">Текущие курсы</h3>
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Код курса
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Название курса
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Кредиты
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Оценка
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS101</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Введение в информатику
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS201</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Структуры данных</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A-</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS301</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Алгоритмы</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">B+</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Заметки</h3>
                      <p className="text-sm text-muted-foreground">
                        {student.notes ||
                          "Студент проявляет большой интерес к искусственному интеллекту и машинному обучению. Участвовал в нескольких хакатонах и исследовательских проектах."}
                      </p>
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

