import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Download } from "lucide-react"
import Link from "next/link"

export default function GroupsPage() {
  // Данные о группах
  const groups = [
    {
      id: "G001",
      name: "AS-12",
      specialty: "Информатика",
      year: 1,
      students: 25,
      curator: "Иванов И.И.",
    },
    {
      id: "G002",
      name: "BS-34",
      specialty: "Бизнес",
      year: 2,
      students: 22,
      curator: "Петров П.П.",
    },
    {
      id: "G003",
      name: "CS-56",
      specialty: "Инженерия",
      year: 3,
      students: 18,
      curator: "Сидоров С.С.",
    },
    {
      id: "G004",
      name: "DS-78",
      specialty: "Медицина",
      year: 4,
      students: 20,
      curator: "Козлов К.К.",
    },
    {
      id: "G005",
      name: "ES-90",
      specialty: "Юриспруденция",
      year: 2,
      students: 23,
      curator: "Смирнов С.С.",
    },
    {
      id: "G006",
      name: "FS-12",
      specialty: "Информатика",
      year: 1,
      students: 24,
      curator: "Николаев Н.Н.",
    },
    {
      id: "G007",
      name: "GS-34",
      specialty: "Бизнес",
      year: 3,
      students: 19,
      curator: "Александров А.А.",
    },
    {
      id: "G008",
      name: "HS-56",
      specialty: "Инженерия",
      year: 2,
      students: 21,
      curator: "Михайлов М.М.",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Группы</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="mr-2 h-4 w-4" />
            Создать группу
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input placeholder="Поиск групп..." className="max-w-sm" />
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Поиск
            </Button>
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
                <SelectItem value="law">Юриспруденция</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
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
                  {groups.map((group) => (
                    <tr key={group.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.students}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.curator}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/dashboard/groups/${group.id}`}>
                          <Button variant="ghost" size="sm">
                            Просмотр
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

