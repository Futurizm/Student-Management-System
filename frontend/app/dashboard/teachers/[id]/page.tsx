"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, FileDown, Mail, Phone, Save, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать не менее 2 символов" }),
  middleName: z.string().optional(),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  phone: z.string().min(5, { message: "Номер телефона должен содержать не менее 5 символов" }),
  dateOfBirth: z.string().nonempty({ message: "Дата рождения обязательна" }),
  department: z.string({ required_error: "Выберите отделение" }),
  position: z.string({ required_error: "Выберите должность" }),
  subjects: z.array(z.string()).min(1, { message: "Выберите хотя бы один предмет" }),
  education: z.string().min(5, { message: "Информация об образовании должна содержать не менее 5 символов" }),
  experience: z.string().min(5, { message: "Информация об опыте работы должна содержать не менее 5 символов" }),
  address: z.string().min(5, { message: "Адрес должен содержать не менее 5 символов" }),
  bio: z.string().optional(),
});

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      dateOfBirth: new Date().toISOString().split("T")[0],
      department: "",
      position: "",
      subjects: [],
      education: "",
      experience: "",
      address: "",
      bio: "",
    },
  });

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in");
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      const data = await response.json();
      console.log("Fetched teacher data:", data);
      setTeacher(data);
      setGroups(data.groups || []);

      const dateOfBirth = data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      form.reset({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        middleName: data.middleName || "",
        email: data.user?.email || data.email || "", // Проверяем оба варианта
        phone: data.phone || "",
        dateOfBirth,
        department: data.department || "",
        position: data.position || "",
        subjects: data.subjects || [],
        education: data.education || "",
        experience: data.experience || "",
        address: data.address || "",
        bio: data.bio || "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить преподавателя?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in");
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete teacher");
      router.push("/dashboard/teachers");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in");
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName,
          email: values.email,
          phone: values.phone,
          dateOfBirth: new Date(values.dateOfBirth).toISOString(),
          department: values.department,
          position: values.position,
          subjects: values.subjects,
          education: values.education,
          experience: values.experience,
          address: values.address,
          bio: values.bio,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update teacher: ${errorText}`);
      }
      const updatedData = await response.json();
      setTeacher(updatedData);
      setIsEditing(false);
      toast({
        title: "Преподаватель обновлен",
        description: "Данные успешно сохранены",
      });
    } catch (err: any) {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <DashboardLayout><p>Loading teacher details...</p></DashboardLayout>;
  if (error || !teacher) return <DashboardLayout><p>{error || "Teacher not found"}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к преподавателям
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={teacher.imageUrl || "/placeholder.svg?height=128&width=128"} alt={teacher.firstName} />
                  <AvatarFallback>{teacher.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{`${teacher.lastName} ${teacher.firstName} ${teacher.middleName || ""}`}</h2>
                  <p className="text-muted-foreground">{teacher.position}</p>
                  <div className="mt-2">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{teacher.user?.email || teacher.email || "Не указан"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{teacher.phone || "Не указан"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Отделение:</span>
                    <span className="text-sm font-medium">{teacher.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Предметы:</span>
                    <span className="text-sm font-medium">{teacher.subjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Группы:</span>
                    <span className="text-sm font-medium">{groups.length}</span>
                  </div>
                </div>
                <div className="mt-4 flex w-full gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsEditing(true)}>
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

          <Card className="md:col-span-2">
            <Tabs defaultValue="details">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Информация о преподавателе</CardTitle>
                  <TabsList>
                    <TabsTrigger value="details">Детали</TabsTrigger>
                    <TabsTrigger value="groups">Группы</TabsTrigger>
                    <TabsTrigger value="subjects">Предметы</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>Просмотр и управление информацией о преподавателе</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                      <TabsContent value="details" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Фамилия</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  <Input {...field} />
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
                                  <Input {...field} />
                                </FormControl>
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
                                  <Input {...field} />
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
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Дата рождения</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Должность</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Адрес</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="education"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Образование</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Опыт работы</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Биография</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="subjects"
                            render={() => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Предметы</FormLabel>
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
                        <div className="flex gap-2">
                          <Button type="submit" className="gap-2">
                            <Save className="h-4 w-4" />
                            Сохранить
                          </Button>
                          <Button variant="outline" className="gap-2" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                            Отмена
                          </Button>
                        </div>
                      </TabsContent>
                    </form>
                  </Form>
                ) : (
                  <>
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">ФИО</p>
                          <p className="text-sm text-muted-foreground">{`${teacher.lastName} ${teacher.firstName} ${teacher.middleName || ""}`}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{teacher.user?.email || teacher.email || "Не указан"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Телефон</p>
                          <p className="text-sm text-muted-foreground">{teacher.phone || "Не указан"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Дата рождения</p>
                          <p className="text-sm text-muted-foreground">
                            {teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString() : "Не указана"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Должность</p>
                          <p className="text-sm text-muted-foreground">{teacher.position}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Отделение</p>
                          <p className="text-sm text-muted-foreground">{teacher.department}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm font-medium">Адрес</p>
                          <p className="text-sm text-muted-foreground">{teacher.address}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm font-medium">Образование</p>
                          <p className="text-sm text-muted-foreground">{teacher.education}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm font-medium">Опыт работы</p>
                          <p className="text-sm text-muted-foreground">{teacher.experience}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm font-medium">Биография</p>
                          <p className="text-sm text-muted-foreground">{teacher.bio || "Нет данных"}</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="groups" className="space-y-4">
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Группа</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Специальность</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {groups.map((group) => (
                              <tr key={group.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.specialty}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Link href={`/dashboard/groups/${group.id}`}>
                                    <Button variant="ghost" size="sm">Просмотр</Button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    <TabsContent value="subjects" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teacher.subjects.map((subject: string) => (
                          <Card key={subject}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                    <span className="text-blue-700 font-medium">{subject.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{subject}</h3>
                                    <p className="text-sm text-muted-foreground">{groups.length} групп</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">Детали</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </>
                )}
              </CardContent>
              {!isEditing && (
                <CardFooter className="flex justify-between">
                  <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Удалить преподавателя
                  </Button>
                </CardFooter>
              )}
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}