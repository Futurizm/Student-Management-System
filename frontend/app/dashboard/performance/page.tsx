import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileDown, Calendar, Filter } from "lucide-react"

export default function PerformancePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Успеваемость</h1>
        <p className="text-muted-foreground">Просмотр успеваемости ваших детей по предметам</p>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Select defaultValue="alexey">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Выберите ребенка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alexey">Алексей Иванов</SelectItem>
                <SelectItem value="maria">Мария Иванова</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="current">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Текущий семестр</SelectItem>
                <SelectItem value="previous">Предыдущий семестр</SelectItem>
                <SelectItem value="year">Учебный год</SelectItem>
                <SelectItem value="all">Все время</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Фильтры
            </Button>
            <Button variant="outline" className="gap-1">
              <Calendar className="h-4 w-4" />
              Календарь
            </Button>
            <Button variant="outline" className="gap-1">
              <FileDown className="h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grades">Оценки</TabsTrigger>
            <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
          </TabsList>
          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Оценки по предметам</CardTitle>
                <CardDescription>Успеваемость Алексея Иванова за текущий семестр</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Предмет
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Преподаватель
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Оценки
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Средний балл
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Математика</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Петров А.И.</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex gap-1">
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">4.6</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Физика</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Сидорова Е.П.</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex gap-1">
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">4.25</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Информатика</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Кузнецов Д.А.</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex gap-1">
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">5.0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Русский язык</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Иванова М.С.</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex gap-1">
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">3</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">3.75</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Английский язык
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Смирнова О.В.</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex gap-1">
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800">5</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">4</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">4.33</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Посещаемость</CardTitle>
                <CardDescription>Посещаемость Алексея Иванова за текущий семестр</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Предмет
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Всего занятий
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Посещено
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Пропущено
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Процент
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Математика</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">96%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Физика</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">89%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Информатика</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">100%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Русский язык</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">86%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Английский язык
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">90%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Прогресс обучения</CardTitle>
                <CardDescription>Прогресс Алексея Иванова по учебной программе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Математика</h4>
                      <span className="text-sm font-medium text-green-600">85%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Физика</h4>
                      <span className="text-sm font-medium text-blue-600">72%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Информатика</h4>
                      <span className="text-sm font-medium text-green-600">95%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Русский язык</h4>
                      <span className="text-sm font-medium text-blue-600">68%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Английский язык</h4>
                      <span className="text-sm font-medium text-blue-600">78%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "78%" }}></div>
                    </div>
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

