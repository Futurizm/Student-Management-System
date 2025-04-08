import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentTable } from "@/components/student-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search, SlidersHorizontal } from "lucide-react"
import { AddStudentDialog } from "@/components/add-student-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Студенты</h1>
          <AddStudentDialog />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <TabsList className="h-10">
              <TabsTrigger value="all" className="px-4">
                Все студенты
              </TabsTrigger>
              <TabsTrigger value="active" className="px-4">
                Активные
              </TabsTrigger>
              <TabsTrigger value="inactive" className="px-4">
                Неактивные
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск студентов..." className="pl-8" />
              </div>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Экспорт
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <StudentTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <StudentTable filterStatus="Active" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <StudentTable filterStatus="Inactive" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

