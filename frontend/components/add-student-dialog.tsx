"use client"

import type React from "react"

import { useEffect } from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Loader2, Upload, CheckCircle, Save, X, User, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

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
  studentId: z.string().min(5, {
    message: "ID студента должен содержать не менее 5 символов",
  }),
  dateOfBirth: z.date({
    required_error: "Дата рождения обязательна",
  }),
  gender: z.string({
    required_error: "Выберите пол",
  }),
  nationality: z.string({
    required_error: "Выберите гражданство",
  }),
  course: z.string({
    required_error: "Выберите направление обучения",
  }),
  group: z.string({
    required_error: "Выберите группу",
  }),
  address: z.string().min(5, {
    message: "Адрес должен содержать не менее 5 символов",
  }),
  phoneNumber: z.string().min(5, {
    message: "Номер телефона должен содержать не менее 5 символов",
  }),
  emergencyContact: z.string().min(5, {
    message: "Контакт для экстренной связи должен содержать не менее 5 символов",
  }),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласиться с условиями",
  }),
})

export function AddStudentDialog() {
  const router = useRouter()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(33)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      studentId: "",
      address: "",
      phoneNumber: "",
      emergencyContact: "",
      notes: "",
      agreeToTerms: false,
    },
  })

  useEffect(() => {
    // Обновляем прогресс в зависимости от активной вкладки
    if (activeTab === "personal") setProgress(33)
    if (activeTab === "education") setProgress(66)
    if (activeTab === "additional") setProgress(100)
  }, [activeTab])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Симуляция отправки формы
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      setIsSuccess(true)
      toast({
        title: "Студент успешно добавлен",
        description: "Информация о студенте сохранена в системе",
        variant: "success",
      })

      // Закрываем диалог через 2 секунды
      setTimeout(() => {
        setOpen(false)
        setIsSuccess(false)
        form.reset()
        setPhotoPreview(null)
        setActiveTab("personal")
      }, 2000)
    }, 2000)
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

  const handleTabChange = (value: string) => {
    // Проверяем валидность текущей вкладки перед переключением
    if (value === "education" && activeTab === "personal") {
      const personalFields = [
        "firstName",
        "lastName",
        "email",
        "studentId",
        "dateOfBirth",
        "gender",
        "nationality",
        "phoneNumber",
        "address",
      ]
      const isValid = personalFields.every((field) => {
        const fieldState = form.getFieldState(field as any)
        return !fieldState.invalid
      })

      if (!isValid) {
        form.trigger([
          "firstName",
          "lastName",
          "email",
          "studentId",
          "dateOfBirth",
          "gender",
          "nationality",
          "phoneNumber",
          "address",
        ])
        return
      }
    }

    if (value === "additional" && activeTab === "education") {
      const educationFields = ["course", "group"]
      const isValid = educationFields.every((field) => {
        const fieldState = form.getFieldState(field as any)
        return !fieldState.invalid
      })

      if (!isValid) {
        form.trigger(["course", "group"])
        return
      }
    }

    setActiveTab(value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Добавить студента
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Студент успешно добавлен!</h2>
              <p className="text-muted-foreground max-w-md">
                Информация о студенте была успешно сохранена в системе. Вы можете просмотреть данные студента в списке
                студентов.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[80vh] overflow-auto"
            >
              <DialogHeader className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                    </div>
                    <DialogTitle>Добавление нового студента</DialogTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription className="mt-1.5">
                  Заполните информацию о студенте для добавления в систему
                </DialogDescription>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>Прогресс заполнения</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </DialogHeader>

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
                                <motion.img
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  src={photoPreview || "/placeholder.svg"}
                                  alt="Предпросмотр фото студента"
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
                            name="studentId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ID студента</FormLabel>
                                <FormControl>
                                  <Input placeholder="S12345" {...field} />
                                </FormControl>
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
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Пол</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Гражданство</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите гражданство" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ru">Россия</SelectItem>
                                  <SelectItem value="by">Беларусь</SelectItem>
                                  <SelectItem value="kz">Казахстан</SelectItem>
                                  <SelectItem value="ua">Украина</SelectItem>
                                  <SelectItem value="other">Другое</SelectItem>
                                </SelectContent>
                              </Select>
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

                    <TabsContent value="education" className="space-y-6 mt-0">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="course"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Направление обучения</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите направление" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="computer-science">Информатика</SelectItem>
                                  <SelectItem value="business">Бизнес-администрирование</SelectItem>
                                  <SelectItem value="graphic-design">Графический дизайн</SelectItem>
                                  <SelectItem value="psychology">Психология</SelectItem>
                                  <SelectItem value="engineering">Инженерия</SelectItem>
                                  <SelectItem value="medicine">Медицина</SelectItem>
                                  <SelectItem value="law">Юриспруденция</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="group"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Группа</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите группу" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="group-a">Группа A-101</SelectItem>
                                  <SelectItem value="group-b">Группа Б-202</SelectItem>
                                  <SelectItem value="group-c">Группа В-303</SelectItem>
                                  <SelectItem value="group-d">Группа Г-404</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2">
                          <FormLabel>Год поступления</FormLabel>
                          <Select defaultValue="2023">
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите год" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2023">2023</SelectItem>
                              <SelectItem value="2022">2022</SelectItem>
                              <SelectItem value="2021">2021</SelectItem>
                              <SelectItem value="2020">2020</SelectItem>
                              <SelectItem value="2019">2019</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Форма обучения</FormLabel>
                          <Select defaultValue="full-time">
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите форму обучения" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Очная</SelectItem>
                              <SelectItem value="part-time">Заочная</SelectItem>
                              <SelectItem value="distance">Дистанционная</SelectItem>
                              <SelectItem value="evening">Вечерняя</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-base font-medium">Предыдущее образование</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <FormLabel>Учебное заведение</FormLabel>
                            <Input placeholder="Школа №1234" />
                          </div>
                          <div className="space-y-2">
                            <FormLabel>Год окончания</FormLabel>
                            <Select defaultValue="2023">
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите год" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                                <SelectItem value="2020">2020</SelectItem>
                                <SelectItem value="2019">2019</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <FormLabel>Тип документа об образовании</FormLabel>
                            <Select defaultValue="certificate">
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="certificate">Аттестат о среднем образовании</SelectItem>
                                <SelectItem value="diploma">Диплом о среднем профессиональном образовании</SelectItem>
                                <SelectItem value="bachelor">Диплом бакалавра</SelectItem>
                                <SelectItem value="master">Диплом магистра</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <FormLabel>Номер документа</FormLabel>
                            <Input placeholder="123456789" />
                          </div>
                        </div>
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

                      <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <FormField
                          control={form.control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Я согласен с условиями обработки персональных данных</FormLabel>
                                <FormDescription>
                                  Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности и обработкой
                                  персональных данных
                                </FormDescription>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>

              <DialogFooter className="px-6 py-4 border-t">
                <div className="flex justify-between w-full">
                  {activeTab === "personal" ? (
                    <Button variant="outline" onClick={() => setOpen(false)}>
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
                          Сохранить студента
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
                              "studentId",
                              "dateOfBirth",
                              "gender",
                              "nationality",
                              "phoneNumber",
                              "address",
                            ])
                            .then((isValid) => {
                              if (isValid) setActiveTab("education")
                            })
                        }
                        if (activeTab === "education") {
                          form.trigger(["course", "group"]).then((isValid) => {
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
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

