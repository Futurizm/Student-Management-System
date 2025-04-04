import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { RecentStudents } from "@/components/recent-students"
import { GraduationCap, BookOpen, Calendar, Clock } from "lucide-react"

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Панель преподавателя</h1>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="students">Студенты</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Мои студенты</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128</div>
                  <p className="text-xs text-muted-foreground">В 5 группах</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Курсы</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Активных курса</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Сегодня занятий</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Следующее через 2 часа</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Часы</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">Часов в неделю</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Успеваемость студентов</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Мои студенты</CardTitle>
                  <CardDescription>Студенты в ваших группах</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentStudents />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Расписание занятий</CardTitle>
                <CardDescription>Ваше расписание на текущую неделю</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Расписание будет отображаться здесь</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Список студентов</CardTitle>
                <CardDescription>Студенты в ваших группах</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Список студентов будет отображаться здесь</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

