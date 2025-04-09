"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, CheckCircle, Save, X, User, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { HOST } from "@/lib/constants"

// Схема валидации
const formSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать не менее 2 символов" }),
  middleName: z.string().optional(),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  iin: z.string().min(11, { message: "ИИН студента должен содержать не менее 11 символов" }),
  birthDate: z.date({ required_error: "Дата рождения обязательна" }),
  gender: z.string({ required_error: "Выберите пол" }),
  citizenship: z.string({ required_error: "Выберите гражданство" }).optional(),
  nationality: z.string().min(2, { message: "Национальность должна содержать не менее 2 символов" }),
  direction: z.string({ required_error: "Выберите специальность" }),
  groupId: z.string().optional(),
  adress: z.string().min(5, { message: "Адрес должен содержать не менее 5 символов" }),
  phoneNumber: z.string().min(5, { message: "Номер телефона должен содержать не менее 5 символов" }),
  emergencyContact: z.string().min(5, { message: "Контакт для экстренной связи должен содержать не менее 5 символов" }),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, { message: "Необходимо согласиться с условиями" }),
  file: z.any().optional(),
})

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

// Добавляем тип пропсов
interface AddStudentDialogProps {
  onStudentAdded?: () => void; // Callback для обновления списка
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const router = useRouter()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(33)
  const [groups, setGroups] = useState<Group[]>([]) // Состояние для групп
  const [isLoadingGroups, setIsLoadingGroups] = useState(false) // Состояние загрузки групп

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      iin: "",
      birthDate: undefined,
      gender: "",
      citizenship: "",
      nationality: "",
      direction: "",
      groupId: undefined,
      adress: "",
      phoneNumber: "",
      emergencyContact: "",
      notes: "",
      agreeToTerms: false,
      file: null,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Добавляем токен, если требуется
        },
      })
      if (!response.ok) throw new Error("Ошибка при загрузке групп")
      const data: Group[] = await response.json()
      setGroups(data)
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

  // Загружаем группы при открытии диалога
  useEffect(() => {
    if (open) {
      fetchGroups()
    }
  }, [open])

  useEffect(() => {
    if (activeTab === "personal") setProgress(33)
    if (activeTab === "education") setProgress(66)
    if (activeTab === "additional") setProgress(100)
  }, [activeTab])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit вызван с данными:", values)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("iin", values.iin)
    formData.append("lastName", values.lastName)
    formData.append("firstName", values.firstName)
    if (values.middleName) formData.append("middleName", values.middleName)
    formData.append("birthDate", values.birthDate.toISOString())
    formData.append("gender", values.gender)
    if (values.citizenship) formData.append("citizenship", values.citizenship)
    formData.append("nationality", values.nationality)
    formData.append("direction", values.direction)
    formData.append("groupId", values.groupId || "") // Пустая строка, если undefined
    formData.append("phoneNumber", values.phoneNumber)
    formData.append("emergencyContact", values.emergencyContact)
    formData.append("email", values.email)  
    formData.append("notes", values.notes || "")
    if (photoFile) formData.append("file", photoFile)

    try {
      const token = localStorage.getItem("token")
      console.log("Токен:", token)
      console.log("Отправка на:", `${HOST}/students`)

      const response = await fetch(`${HOST}/students`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      console.log("Ответ сервера:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Ошибка сервера:", errorData)
        throw new Error(errorData.message || "Ошибка при создании студента")
      }

      const student = await response.json()
      console.log("Student created:", student)

      setIsSubmitting(false)
      setIsSuccess(true)
      toast({
        title: "Студент успешно добавлен",
        description: "Информация о студенте сохранена в системе",
        variant: "success",
      })

      if (onStudentAdded) {
        onStudentAdded()
      }

      setTimeout(() => {
        setOpen(false)
        setIsSuccess(false)
        form.reset()
        setPhotoPreview(null)
        setPhotoFile(null)
        setActiveTab("personal")
      }, 2000)
    } catch (error) {
      console.error("Ошибка в onSubmit:", error)
      setIsSubmitting(false)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать студента",
        variant: "destructive",
      })
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTabChange = (value: string) => {
    if (value === "education" && activeTab === "personal") {
      const personalFields = [
        "firstName",
        "lastName",
        "email",
        "iin",
        "birthDate",
        "gender",
        "nationality",
        "phoneNumber",
        "adress",
      ]
      form.trigger(personalFields as any).then((isValid) => {
        if (isValid) setActiveTab(value)
      })
      return
    }
    if (value === "additional" && activeTab === "education") {
      const educationFields = ["direction"]
      form.trigger(educationFields as any).then((isValid) => {
        if (isValid) setActiveTab(value)
      })
      return
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
                Информация о студенте была успешно сохранена в системе.
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
                      {/* Личные данные остаются без изменений */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white p-1">
                              {photoPreview ? (
                                <motion.img
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  src={photoPreview}
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
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setPhotoPreview(null)
                                    setPhotoFile(null)
                                  }}
                                >
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите пол" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Мужской">Мужской</SelectItem>
                                  <SelectItem value="Женский">Женский</SelectItem>
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
                              <FormLabel>Национальность</FormLabel>
                              <FormControl>
                                <Input placeholder="Русский" {...field} />
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите специальность" />
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
                        <FormField
                          control={form.control}
                          name="groupId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Группа</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger disabled={isLoadingGroups}>
                                    <SelectValue placeholder={isLoadingGroups ? "Загрузка групп..." : "Выберите группу"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {isLoadingGroups ? (
                                    <SelectItem value="loading" disabled>
                                      Загрузка...
                                    </SelectItem>
                                  ) : groups.length > 0 ? (
                                    groups.map((group) => (
                                      <SelectItem key={group.id} value={String(group.id)}>
                                        {group.name} ({group.specialty})
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-groups" disabled>
                                      Группы не найдены
                                    </SelectItem>
                                  )}
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
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={form.handleSubmit(onSubmit)}
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
                                  "iin",
                                  "birthDate",
                                  "gender",
                                  "nationality",
                                  "phoneNumber",
                                  "adress",
                                ])
                                .then((isValid) => {
                                  if (isValid) setActiveTab("education")
                                })
                            }
                            if (activeTab === "education") {
                              form.trigger(["direction"]).then((isValid) => {
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
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}