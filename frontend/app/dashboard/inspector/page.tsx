import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { GraduationCap, BookOpen, Search, ClipboardList, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InspectorDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Панель проверяющего</h1>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="groups">Группы</TabsTrigger>
            <TabsTrigger value="search">Поиск</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего студентов</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">В 32 группах</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Преподаватели</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">64</div>
                  <p className="text-xs text-muted-foreground">Активных преподавателей</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Группы</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">Активных групп</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Отчеты</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">Доступных отчетов</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Статистика посещаемости</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Последние проверки</CardTitle>
                  <CardDescription>Недавно проверенные группы и студенты</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Группа {String.fromCharCode(64 + i)}S-{Math.floor(Math.random() * 100)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Детали
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="groups" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Группы студентов</CardTitle>
                <CardDescription>Просмотр и управление группами студентов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <Input placeholder="Поиск групп..." className="max-w-sm" />
                    <Button variant="outline">Поиск</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Фильтр по курсу" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все курсы</SelectItem>
                        <SelectItem value="1">1 курс</SelectItem>
                        <SelectItem value="2">2 курс</SelectItem>
                        <SelectItem value="3">3 курс</SelectItem>
                        <SelectItem value="4">4 курс</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Фильтр по специальности" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все специальности</SelectItem>
                        <SelectItem value="cs">Информатика</SelectItem>
                        <SelectItem value="business">Бизнес</SelectItem>
                        <SelectItem value="engineering">Инженерия</SelectItem>
                        <SelectItem value="medicine">Медицина</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6 rounded-md border">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Куратор
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {String.fromCharCode(64 + i)}S-{Math.floor(Math.random() * 100)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {["Информатика", "Бизнес", "Инженерия", "Медицина", "Юриспруденция"][i - 1]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.floor(Math.random() * 4) + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.floor(Math.random() * 15) + 15}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {["Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Козлов К.К.", "Смирнов С.С."][i - 1]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button variant="ghost" size="sm">
                              Просмотр
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Поиск студентов</CardTitle>
                <CardDescription>Расширенный поиск по базе данных студентов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                      <Input placeholder="ФИО, ID студента или группа..." className="w-full" />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="mr-2 h-4 w-4" />
                      Найти
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите группу" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все группы</SelectItem>
                          <SelectItem value="as-12">AS-12</SelectItem>
                          <SelectItem value="bs-34">BS-34</SelectItem>
                          <SelectItem value="cs-56">CS-56</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите курс" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все курсы</SelectItem>
                          <SelectItem value="1">1 курс</SelectItem>
                          <SelectItem value="2">2 курс</SelectItem>
                          <SelectItem value="3">3 курс</SelectItem>
                          <SelectItem value="4">4 курс</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите специальность" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все специальности</SelectItem>
                          <SelectItem value="cs">Информатика</SelectItem>
                          <SelectItem value="business">Бизнес</SelectItem>
                          <SelectItem value="engineering">Инженерия</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Введите параметры поиска</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Используйте поисковую строку или фильтры для поиска студентов
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

