"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, Save, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Student } from "./student-table"
import { HOST_NO_API } from "@/lib/constants"

// Тип для данных групп с бэкенда
type Group = {
  id: number;
  name: string;
  specialty: string;
  startDate: string;
  endDate: string;
  description?: string;
  schedule?: string;
  teacherId?: number;
  courseNumberId: number;
};

// Схема валидации
const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  email: z.string().optional(),
  iin: z.string().optional(),
  birthDate: z.date().optional(),
  gender: z.string().optional(),
  citizenship: z.string().optional(),
  groupId: z.string().optional(),
  direction: z.string().optional(),
  adress: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
})

interface EditStudentModalProps {
  student: Student
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function EditStudentModal({ student, isOpen, onClose, onSave }: EditStudentModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(student?.profilePicture || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(33)
  const [groups, setGroups] = useState<Group[]>([]) // Состояние для групп
  const [isLoadingGroups, setIsLoadingGroups] = useState(false) // Состояние загрузки групп

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      middleName: student?.middleName || "",
      email: student?.email || "",
      iin: String(student?.iin) || "",
      birthDate: student?.birthDate ? new Date(student.birthDate) : undefined,
      gender: student?.gender,
      citizenship: student?.citizenship || "",
      direction: student?.direction || "",
      adress: student?.adress || "",
      phoneNumber: student?.phoneNumber || "",
      emergencyContact: student?.emergencyContact || "",
      notes: student?.notes || "",
      status: student?.status || "",
      groupId: student?.group?.id ? String(student.group.id) : undefined, // Используем student.group.id
    },
  })

  // Функция для получения групп с бэкенда
  const fetchGroups = async () => {
    setIsLoadingGroups(true)
    try {
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Ошибка при загрузке групп")
      const data: Group[] = await response.json()
      setGroups(data)
      console.log(groups)
    } catch (error) {
      console.error("Ошибка при получении групп:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список групп",
        variant: "destructive",
      })
    } finally {
      setIsLoadingGroups(false)
    }
  }

  // Загружаем группы при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchGroups()
    }
  }, [isOpen])

  // Сброс формы при изменении student
  useEffect(() => {
    form.reset({
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      middleName: student?.middleName || "",
      email: student?.email || "",
      iin: String(student?.iin) || "",
      birthDate: student?.birthDate ? new Date(student.birthDate) : undefined,
      gender: student?.gender || "male",
      citizenship: student?.citizenship || "Россия",
      direction: student?.direction || "",
      adress: student?.adress || "г. Москва, ул. Примерная, д. 123, кв. 45",
      phoneNumber: student?.phoneNumber || "+7 (999) 123-4567",
      emergencyContact: student?.emergencyContact || "",
      notes: student?.notes || "",
      status: student?.status || "ACTIVE",
      groupId: student?.group?.id ? String(student.group.id) : undefined, // Используем student.group.id
    })

  }, [student, form])

  const handleTabChange = (value: string) => {
    if (value === "personal") setProgress(33)
    if (value === "education") setProgress(66)
    if (value === "additional") setProgress(100)

    if (value === "education" && activeTab === "personal") {
      form.trigger([
        "firstName",
        "lastName",
        "email",
        "iin",
        "birthDate",
        "gender",
        "citizenship",
        "phoneNumber",
        "adress",
      ]).then((isValid) => {
        if (isValid) setActiveTab(value)
      })
      return
    }

    if (value === "additional" && activeTab === "education") {
      form.trigger(["direction", "groupId"]).then((isValid) => {
        if (isValid) setActiveTab(value)
      })
      return
    }

    setActiveTab(value)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const updatedStudent = {
      ...student,
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      email: values.email,
      iin: values.iin,
      birthDate: values.birthDate ? values.birthDate.toISOString() : student.birthDate,
      gender: values.gender,
      citizenship: values.citizenship,
      direction: values.direction,
      groupId: values.groupId ? Number(values.groupId) : null,
      adress: values.adress,
      phoneNumber: values.phoneNumber,
      emergencyContact: values.emergencyContact,
      notes: values.notes,
      status: values.status,
      profilePicture: photoPreview || student?.profilePicture,
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedStudent),
      })

      if (!response.ok) {
        throw new Error("Ошибка при обновлении студента")
      }

      const data = await response.json()
      console.log("Успешно обновлено:", data)

      setIsSubmitting(false)
      onSave(updatedStudent)
      toast({
        title: "Студент успешно обновлен",
        description: "Информация о студенте сохранена в системе",
      })
      onClose()
    } catch (error) {
      setIsSubmitting(false)
      console.error("Ошибка:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить студента. Попробуйте снова.",
        variant: "destructive",
      })
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Редактирование студента</DialogTitle>
          <DialogDescription>Измените информацию о студенте {student.firstName}</DialogDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Прогресс заполнения</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="personal">Личные данные</TabsTrigger>
                  <TabsTrigger value="education">Образование</TabsTrigger>
                  <TabsTrigger value="additional">Дополнительно</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 mt-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white p-1">
                          {photoPreview ? (
                            <img
                              src={`${HOST_NO_API}/${student.profilePicture}` || photoPreview}
                              alt={student.firstName.charAt(0)}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <User className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="photo-upload"
                            className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                            Загрузить фото
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoChange}
                            />
                          </label>
                          {photoPreview && (
                            <Button type="button" variant="outline" size="sm" onClick={() => setPhotoPreview(null)}>
                              Удалить
                            </Button>
                          )}
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="iin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ИИН студента</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789012" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Статус</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Активен</SelectItem>
                                <SelectItem value="INACTIVE">Неактивен</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                              <Input placeholder="Иванов" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Отчество</FormLabel>
                            <FormControl>
                              <Input placeholder="Иванович" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Дата рождения</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value ? field.value.toISOString().split("T")[0] : ""}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                              max={new Date().toISOString().split("T")[0]}
                              min="1900-01-01"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пол</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите пол" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Мужской</SelectItem>
                              <SelectItem value="female">Женский</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="ivan.ivanov@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон</FormLabel>
                          <FormControl>
                            <Input placeholder="+7 (999) 123-45-67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="citizenship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Гражданство</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите гражданство" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Россия">Россия</SelectItem>
                              <SelectItem value="Беларусь">Беларусь</SelectItem>
                              <SelectItem value="Казахстан">Казахстан</SelectItem>
                              <SelectItem value="Украина">Украина</SelectItem>
                              <SelectItem value="Другое">Другое</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Адрес</FormLabel>
                          <FormControl>
                            <Input placeholder="г. Москва, ул. Примерная, д. 123, кв. 45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="education" className="space-y-6 mt-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="direction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Направление обучения</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите направление" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Информатика">Информатика</SelectItem>
                              <SelectItem value="Менеджмент">Менеджмент</SelectItem>
                              <SelectItem value="Электрики">Электрики</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-6 mt-0">
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-base font-medium">Контактная информация для экстренных случаев</h3>
                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Контакт для экстренной связи</FormLabel>
                          <FormControl>
                            <Input placeholder="Иванов Иван Иванович (отец), +7 (999) 987-65-43" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дополнительные заметки</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Любая дополнительная информация о студенте"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-between w-full">
            {activeTab === "personal" ? (
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  if (activeTab === "education") setActiveTab("personal")
                  if (activeTab === "additional") setActiveTab("education")
                }}
              >
                Назад
              </Button>
            )}

            {activeTab === "additional" ? (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить изменения
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (activeTab === "personal") {
                    form
                      .trigger([
                        "firstName",
                        "lastName",
                        "email",
                        "iin",
                        "birthDate",
                        "gender",
                        "citizenship",
                        "phoneNumber",
                        "adress",
                      ])
                      .then((isValid) => {
                        if (isValid) setActiveTab("education")
                      })
                  }
                  if (activeTab === "education") {
                    form.trigger(["direction", "groupId"]).then((isValid) => {
                      if (isValid) setActiveTab("additional")
                    })
                  }
                }}
              >
                Далее
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}