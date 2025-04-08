"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Calendar, FileText, Mail, Pencil } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Group {
  id: number;
  name: string;
  specialty: string;
  startDate: string;
  endDate: string;
  description?: string;
  schedule?: any;
  teacher?: { id: number; firstName: string; lastName: string; middleName?: string; user: { email: string } };
  students: Student[];
  courseNumber: { id: number; name: string };
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  groupId?: number; // Добавляем groupId для проверки
}

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
}

interface CourseNumber {
  id: number;
  name: string;
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courseNumbers, setCourseNumbers] = useState<CourseNumber[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedGroup, setEditedGroup] = useState<Partial<Group>>({});

  useEffect(() => {
    fetchGroupData();
    fetchAllStudents();
    fetchTeachers();
    fetchCourseNumbers();
  }, [id]);

  const fetchGroupData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view group details");
      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to fetch group: ${response.statusText}`);
      const data: Group = await response.json();
      setGroup(data);
      setEditedGroup(data);
    } catch (err: any) {
      console.error("Error fetching group:", err);
      setError(err.message || "Failed to load group details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const data: Student[] = await response.json();
      setStudents(data);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.message);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch("http://localhost:5000/api/teachers", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data: Teacher[] = await response.json();
      setTeachers(data);
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      setError(err.message);
    }
  };

  const fetchCourseNumbers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch course numbers");
      const data: CourseNumber[] = await response.json();
      setCourseNumbers(data);
    } catch (err: any) {
      console.error("Error fetching course numbers:", err);
      setError(err.message);
    }
  };

  const addStudentToGroup = async () => {
    if (!selectedStudentId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch(`http://localhost:5000/api/groups/${id}/students`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: Number(selectedStudentId) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add student to group");
      }
      const updatedGroup = await response.json();
      setGroup(updatedGroup);
      setEditedGroup(updatedGroup);
      setSelectedStudentId("");
      setError(null); // Сбрасываем ошибку при успехе
    } catch (err: any) {
      console.error("Error adding student:", err);
      setError(err.message);
    }
  };

  const saveGroupChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editedGroup),
      });
      if (!response.ok) throw new Error("Failed to update group");
      const updatedGroup = await response.json();
      setGroup(updatedGroup);
      setEditMode(false);
    } catch (err: any) {
      console.error("Error updating group:", err);
      setError(err.message);
    }
  };

  if (loading) return <DashboardLayout><p>Loading group details...</p></DashboardLayout>;
  if (error && !group) return (
    <DashboardLayout>
      <p>{error || "Group not found"}</p>
      <Button onClick={fetchGroupData}>Retry</Button>
    </DashboardLayout>
  );

  const normalizedStudents = group!.students.map((student) => ({
    ...student,
    name: `${student.lastName} ${student.firstName}${student.middleName ? " " + student.middleName : ""}`,
  }));

  // Фильтруем студентов: доступны только те, у кого нет groupId
  const availableStudents = students.filter((student) => !student.groupId);

  const scheduleData = Array.isArray(group!.schedule)
    ? group!.schedule
    : group!.schedule && typeof group!.schedule === "object"
      ? Object.entries(group!.schedule).flatMap(([day, lessons]) =>
          Array.isArray(lessons) ? lessons.map((lesson) => ({ day, ...lesson })) : []
        )
      : ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"].flatMap((day, dayIndex) =>
          Array.from({ length: 3 }, (_, i) => ({
            day,
            time: `${8 + i * 2}:30 - ${10 + i * 2}:00`,
            subject: ["Математика", "Информатика", "Физика", "Английский язык", "История"][(dayIndex * 3 + i) % 5],
            teacher: ["Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Козлов К.К.", "Смирнов С.С."][(dayIndex + i) % 5],
            room: `${((dayIndex + i) % 3) + 1}${((dayIndex * 3 + i) % 9) + 1}${(dayIndex + i * 2) % 9 + 1}`,
          }))
        );

  const performanceData = ["Математика", "Информатика", "Физика", "Английский язык", "История"].map((subject) => ({
    subject,
    averageScore: (4 + Math.random()).toFixed(1),
    attendance: 80 + Math.floor(Math.random() * 15),
  }));

  const courseName = group!.courseNumber?.name || "N/A";
  const curatorName = group!.teacher
    ? `${group!.teacher.lastName} ${group!.teacher.firstName}${group!.teacher.middleName ? " " + group!.teacher.middleName : ""}`
    : "N/A";
  const curatorEmail = group!.teacher?.user.email || "N/A";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/groups"><ArrowLeft className="mr-2 h-4 w-4" />Назад к группам</Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Группа {group!.name}</h1>
            <p className="text-muted-foreground">{group!.specialty}, {courseName}</p>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" />Расписание</Button>
            <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" />Отчет</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2"><Mail className="h-4 w-4" />Связаться</Button>
            {editMode && <Button onClick={saveGroupChanges}>Сохранить</Button>}
            <Button variant="ghost" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Отмена" : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>} {/* Показываем ошибку добавления студента */}

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
                <CardDescription>Детальная информация о группе {group!.name}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Название группы</p>
                    {editMode ? (
                      <Input
                        value={editedGroup.name || ""}
                        onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{group!.name}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Специальность</p>
                    {editMode ? (
                      <Input
                        value={editedGroup.specialty || ""}
                        onChange={(e) => setEditedGroup({ ...editedGroup, specialty: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{group!.specialty}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Курс</p>
                    {editMode ? (
                      <Select
                        value={editedGroup.courseNumberId?.toString() || ""}
                        onValueChange={(value) => setEditedGroup({ ...editedGroup, courseNumberId: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите курс" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseNumbers.map((cn) => (
                            <SelectItem key={cn.id} value={cn.id.toString()}>
                              {cn.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">{courseName}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Количество студентов</p>
                    <p className="text-sm text-muted-foreground">{group!.students.length}</p>
                  </div>
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Куратор</p>
                    {editMode ? (
                      <Select
                        value={editedGroup.teacherId?.toString() || ""}
                        onValueChange={(value) => setEditedGroup({ ...editedGroup, teacherId: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите куратора" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                              {`${teacher.lastName} ${teacher.firstName}${teacher.middleName ? " " + teacher.middleName : ""}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">{curatorName}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email куратора</p>
                    <p className="text-sm text-muted-foreground">{curatorEmail}</p>
                  </div>
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Дата начала обучения</p>
                    {editMode ? (
                      <Input
                        type="date"
                        value={editedGroup.startDate?.split("T")[0] || ""}
                        onChange={(e) => setEditedGroup({ ...editedGroup, startDate: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{new Date(group!.startDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Дата окончания обучения</p>
                    {editMode ? (
                      <Input
                        type="date"
                        value={editedGroup.endDate?.split("T")[0] || ""}
                        onChange={(e) => setEditedGroup({ ...editedGroup, endDate: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{new Date(group!.endDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="space-y-1 md:col-span-2 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Описание</p>
                    {editMode ? (
                      <Input
                        value={editedGroup.description || ""}
                        onChange={(e) => setEditedGroup({ ...editedGroup, description: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{group!.description || "Нет описания"}</p>
                    )}
                  </div>
                  {editMode && <Pencil className="h-4 w-4 text-gray-500" />}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Студенты группы</CardTitle>
                  <CardDescription>Список студентов, обучающихся в группе {group!.name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Экспорт</Button>
                  <div className="flex items-center gap-2">
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Выберите студента" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {`${student.lastName} ${student.firstName}${student.middleName ? " " + student.middleName : ""}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addStudentToGroup}>Добавить</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Студент</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {normalizedStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg?height=40&width=40" alt={student.name} /><AvatarFallback>{student.name.charAt(0)}</AvatarFallback></Avatar>
                              <div className="ml-4"><div className="text-sm font-medium text-gray-900">{student.name}</div><div className="text-sm text-gray-500">ID: {student.id}</div></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">N/A</td>
                          <td className="px-6 py-4 whitespace-nowrap"><Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Link href={`/dashboard/students/${student.id}`}><Button variant="ghost" size="sm">Просмотр</Button></Link></td>
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
              <CardHeader><CardTitle>Расписание занятий</CardTitle><CardDescription>Расписание занятий группы {group!.name} на текущую неделю</CardDescription></CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">День</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Преподаватель</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Аудитория</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduleData.map((entry: any, index: number) => (
                        <tr key={index}>
                          {index % 3 === 0 && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={3}>{entry.day}</td>}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.teacher}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Успеваемость группы</CardTitle><CardDescription>Статистика успеваемости группы {group!.name} по предметам</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData.map((item) => (
                    <div key={item.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{item.subject}</h4>
                        <span className="text-sm font-medium text-blue-600">{item.averageScore}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.attendance}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Средний балл: {item.averageScore}</span>
                        <span>Посещаемость: {item.attendance}%</span>
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
  );
}