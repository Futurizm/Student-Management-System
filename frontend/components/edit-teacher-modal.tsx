"use client"

import type React from "react"
import { useState } from "react"
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
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Loader2, Upload, Save, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  lastName: z.string().min(2, {
    message: "Фамилия должна содержать не менее 2 символов",
  }),
  middleName: z.string().optional(),
  email: z.string().email({
    message: "Введите корректный email адрес",
  }),
  phone: z.string().min(5, {
    message: "Номер телефона должен содержать не менее 5 символов",
  }),
  dateOfBirth: z.date({
    required_error: "Дата рождения обязательна",
  }),
  department: z.string({
    required_error: "Выберите отделение",
  }),
  position: z.string({
    required_error: "Выберите должность",
  }),
  subjects: z.array(z.string()).min(1, {
    message: "Выберите хотя бы один предмет",
  }),
  education: z.string().min(5, {
    message: "Информация об образовании должна содержать не менее 5 символов",
  }),
  experience: z.string().min(5, {
    message: "Информация об опыте работы должна содержать не менее 5 символов",
  }),
  address: z.string().min(5, {
    message: "Адрес должен содержать не менее 5 символов",
  }),
  bio: z.string().optional(),
  status: z.string(),
})

interface EditTeacherModalProps {
  teacher: any
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function EditTeacherModal({ teacher, isOpen, onClose, onSave }: EditTeacherModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(teacher?.imageUrl || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(33)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: teacher?.name?.split(' ')[1] || "",
      lastName: teacher?.name?.split(' ')[0] || "",
      middleName: "",
      email: teacher?.email || "",
      phone: teacher?.phone || "+7 (999) 123-4567",
      dateOfBirth: new Date("1975-01-01"),
      department: teacher?.department || "",
      position: teacher?.role || "",
      subjects: ["Математика", "Информатика"],
      education: "Московский государственный университет, факультет вычислительной математики и кибернетики, 1997 г.",
      experience: "Более 20 лет преподавательского опыта. Работал в ведущих университетах страны.",
      address: "г. Москва, ул. Примерная, д. 123, кв. 45",
      bio: "Профессор является признанным экспертом в области информационных технологий. Автор более 50 научных работ и 3 монографий.",
      status: teacher?.status || "Active",
    },
  })

  const handleTabChange = (value: string) => {
    if (value === "personal") setProgress(33)
    if (value === "professional") setProgress(66)
    if (value === "additional") setProgress(100)
    
    if (value === "professional" && activeTab === "personal") {
      const personalFields = ["firstName", "lastName", "email", "phone", "dateOfBirth", "address"]
      const isValid = personalFields.every(field => {
        const fieldState = form.getFieldState(field as any)
        return !fieldState.invalid
      })
      
      if (!isValid) {
        form.trigger(["firstName", "lastName", "email", "phone", "dateOfBirth", "address"])
        return
      }
    }
    
    if (value === "additional" && activeTab === "professional") {
      const professionalFields = ["department", "position", "subjects", "education", "experience"]
      const isValid = professionalFields.every(field => {
        const fieldState = form.getFieldState(field as any)
        return !fieldState.invalid
      })
      
      if (!isValid) {
        form.trigger(["department", "position", "subjects", "education", "experience"])
        return
      }
    }
    
    setActiveTab(value)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const fullName = `${values.lastName} ${values.firstName}`

    const updatedTeacher = {
      ...teacher,
      name: fullName,
      email: values.email,
      phone: values.phone,
      department: values.department,
      role: values.position,
      status: values.status,
      imageUrl: photoPreview || teacher?.imageUrl,
    }

    setTimeout(() => {
      setIsSubmitting(false)
      onSave(updatedTeacher)
      toast({
        title: "Преподаватель успешно обновлен",
        description: "Информация о преподавателе сохранена в системе",
      })
      onClose()
    }, 1000)
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

  if (!teacher) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Редактирование преподавателя</DialogTitle>
          <DialogDescription>
            Измените информацию о преподавателе {teacher.name}
          </DialogDescription>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Прогресс заполнения</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="personal">
                    Личные данные
                  </TabsTrigger>
                  <TabsTrigger value="professional">
                    Профессиональные
                  </TabsTrigger>
                  <TabsTrigger value="additional">
                    Дополнительно
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-6 mt-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white p-1">
                          {photoPreview ? (
                            <img
                              src={photoPreview || "/placeholder.svg"}
                              alt="Предпросмотр фото преподавателя"
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
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Статус</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Активен</SelectItem>
                                <SelectItem value="Inactive">Неактивен</SelectItem>
                                <SelectItem value="On Leave">В отпуске</SelectItem>
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
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Дата рождения</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd MMMM yyyy", { locale: ru })
                                  ) : (
                                    <span>Выберите дату</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1940-01-01")}
                                initialFocus
                                locale={ru}
                              />
                            </PopoverContent>
                          </Popover>
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
                      name="phone"
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
                      name="address"
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

                <TabsContent value="professional" className="space-y-6 mt-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Должность</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите должность" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Профессор">Профессор</SelectItem>
                              <SelectItem value="Доцент">Доцент</SelectItem>
                              <SelectItem value="Старший преподаватель">Старший преподаватель</SelectItem>
                              <SelectItem value="Преподаватель">Преподаватель</SelectItem>
                              <SelectItem value="Ассистент">Ассистент</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Отделение</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите отделение" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Информатика">Информатика</SelectItem>
                              <SelectItem value="Бизнес">Бизнес</SelectItem>
                              <SelectItem value="Инженерия">Инженерия</SelectItem>
                              <SelectItem value="Медицина">Медицина</SelectItem>
                              <SelectItem value="Юриспруденция">Юриспруденция</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Предметы</FormLabel>
                    <FormField
                      control={form.control}
                      name="subjects"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
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
                            ].map((subject) => (
                              <FormField
                                key={subject}
                                control={form.control}
                                name="subjects"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={subject} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(subject)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, subject])
                                              : field.onChange(field.value?.filter((value) => value !== subject))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{subject}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Образование</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Информация об образовании преподавателя"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Опыт работы</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Информация об опыте работы преподавателя"
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
                
                <TabsContent value="additional" className="space-y-6 mt-0">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Биография</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Дополнительная информация о преподавателе"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  if (activeTab === "professional") setActiveTab("personal")
                  if (activeTab === "additional") setActiveTab("professional")
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
                    form.trigger(["firstName", "lastName", "email", "phone", "dateOfBirth", "address"]).then(isValid => {
                      if (isValid) setActiveTab("professional");
                    });
                  }
                  if (activeTab === "professional") {
                    form.trigger(["department", "position", "subjects", "education", "experience"]).then(isValid => {
                      if (isValid) setActiveTab("additional");
                    });
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

