"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Loader2, Upload, CheckCircle, Save, ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать не менее 2 символов" }),
  middleName: z.string().optional(),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  phone: z.string().min(5, { message: "Номер телефона должен содержать не менее 5 символов" }),
  dateOfBirth: z.date({ required_error: "Дата рождения обязательна" }),
  department: z.string({ required_error: "Выберите отделение" }),
  position: z.string({ required_error: "Выберите должность" }),
  subjects: z.array(z.string()).min(1, { message: "Выберите хотя бы один предмет" }),
  education: z.string().min(5, { message: "Информация об образовании должна содержать не менее 5 символов" }),
  experience: z.string().min(5, { message: "Информация об опыте работы должна содержать не менее 5 символов" }),
  address: z.string().min(5, { message: "Адрес должен содержать не менее 5 символов" }),
  bio: z.string().optional(),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов" }), // Добавлено
  agreeToTerms: z.boolean().refine((val) => val === true, { message: "Необходимо согласиться с условиями" }),
});

export function TeacherForm() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [progress, setProgress] = useState(33);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      education: "",
      experience: "",
      address: "",
      bio: "",
      subjects: [],
      password: "", // Добавлено
      agreeToTerms: false,
    },
  });

  const handleTabChange = (value: string) => {
    if (value === "personal") setProgress(33);
    if (value === "professional") setProgress(66);
    if (value === "additional") setProgress(100);

    if (value === "professional" && activeTab === "personal") {
      const personalFields = ["firstName", "lastName", "email", "phone", "dateOfBirth", "address"];
      const isValid = personalFields.every((field) => !form.getFieldState(field as any).invalid);
      if (!isValid) {
        form.trigger(personalFields as any);
        return;
      }
    }

    if (value === "additional" && activeTab === "professional") {
      const professionalFields = ["department", "position", "subjects", "education", "experience"];
      const isValid = professionalFields.every((field) => !form.getFieldState(field as any).invalid);
      if (!isValid) {
        form.trigger(professionalFields as any);
        return;
      }
    }

    setActiveTab(value);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values); // Логируем успешную отправку
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in");
  
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create teacher: ${errorText}`);
      }
  
      setIsSuccess(true);
      toast({
        title: "Преподаватель успешно добавлен",
        description: "Информация о преподавателе сохранена в системе",
      });
  
      setTimeout(() => {
        router.push("/dashboard/teachers");
      }, 2000);
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // В CardFooter, кнопка "Сохранить":
  {activeTab === "additional" ? (
    <Button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700"
      disabled={isSubmitting}
      onClick={() => {
        console.log("Submit button clicked"); // Логируем клик
        form.trigger().then((isValid) => {
          console.log("Form is valid:", isValid); // Логируем результат валидации
          if (!isValid) {
            console.log("Form errors:", form.formState.errors); // Логируем ошибки
          }
        });
      }}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Сохранение...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Сохранить преподавателя
        </>
      )}
    </Button>
  ) : (
    <Button
      type="button"
      className="bg-blue-600 hover:bg-blue-700"
      onClick={() => {
        if (activeTab === "personal") {
          form.trigger(["firstName", "lastName", "email", "phone", "dateOfBirth", "address"]).then((isValid) => {
            if (isValid) handleTabChange("professional");
          });
        }
        if (activeTab === "professional") {
          form.trigger(["department", "position", "subjects", "education", "experience"]).then((isValid) => {
            if (isValid) handleTabChange("additional");
          });
        }
      }}
    >
      Далее
    </Button>
  )}

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Преподаватель успешно добавлен!</h2>
            <p className="text-muted-foreground">Информация о преподавателе была успешно сохранена в системе</p>
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                  setPhotoPreview(null);
                  setActiveTab("personal");
                  setProgress(33);
                }}
              >
                Добавить еще одного преподавателя
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/dashboard/teachers")}>
                Перейти к списку преподавателей
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку преподавателей
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-700 bg-blue-50">
            Новый преподаватель
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle>Добавление нового преподавателя</CardTitle>
          <CardDescription>Заполните информацию о преподавателе для добавления в систему</CardDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Прогресс заполнения</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Личные данные</TabsTrigger>
                  <TabsTrigger value="professional">Профессиональные</TabsTrigger>
                  <TabsTrigger value="additional">Дополнительно</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="personal" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                      <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white p-1">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
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
                  </div>
                  <div className="space-y-4">
                  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Пароль</FormLabel>
        <FormControl>
          <Input type="password" placeholder="Введите пароль" {...field} />
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
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "dd MMMM yyyy", { locale: ru }) : <span>Выберите дату</span>}
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

              <TabsContent value="professional" className="space-y-6 p-6">
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
                            <SelectItem value="professor">Профессор</SelectItem>
                            <SelectItem value="associate-professor">Доцент</SelectItem>
                            <SelectItem value="assistant-professor">Старший преподаватель</SelectItem>
                            <SelectItem value="lecturer">Преподаватель</SelectItem>
                            <SelectItem value="assistant">Ассистент</SelectItem>
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
                            <SelectItem value="computer-science">Информатика</SelectItem>
                            <SelectItem value="business">Бизнес</SelectItem>
                            <SelectItem value="engineering">Инженерия</SelectItem>
                            <SelectItem value="medicine">Медицина</SelectItem>
                            <SelectItem value="law">Юриспруденция</SelectItem>
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
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(subject)}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([...field.value, subject])
                                          : field.onChange(field.value?.filter((value) => value !== subject))
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{subject}</FormLabel>
                                </FormItem>
                              )}
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
                          <Textarea placeholder="Информация об образовании преподавателя" className="min-h-[100px]" {...field} />
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
                          <Textarea placeholder="Информация об опыте работы преподавателя" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 p-6">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Биография</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Дополнительная информация о преподавателе" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности и обработкой персональных данных
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-between border-t p-6">
  <div className="flex justify-between w-full">
    {activeTab === "personal" ? (
      <Button variant="outline" onClick={() => router.push("/dashboard/teachers")}>
        Отмена
      </Button>
    ) : (
      <Button
        variant="outline"
        onClick={() => {
          if (activeTab === "professional") handleTabChange("personal");
          if (activeTab === "additional") handleTabChange("professional");
        }}
      >
        Назад
      </Button>
    )}

    {activeTab === "additional" ? (
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Сохранить преподавателя
          </>
        )}
      </Button>
    ) : (
      <Button
        type="button"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => {
          if (activeTab === "personal") {
            form.trigger(["firstName", "lastName", "email", "phone", "dateOfBirth", "address", "password"]).then((isValid) => {
              if (isValid) handleTabChange("professional");
            });
          }
          if (activeTab === "professional") {
            form.trigger(["department", "position", "subjects", "education", "experience"]).then((isValid) => {
              if (isValid) handleTabChange("additional");
            });
          }
        }}
      >
        Далее
      </Button>
    )}
  </div>
</CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}