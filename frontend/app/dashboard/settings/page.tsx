import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, Database, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">Управление настройками системы и учетной записи</p>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Общие</TabsTrigger>
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            <TabsTrigger value="security">Безопасность</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>Настройте основные параметры системы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institution-name">Название учебного заведения</Label>
                  <Input id="institution-name" defaultValue="Университет информационных технологий" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution-address">Адрес</Label>
                  <Input id="institution-address" defaultValue="г. Москва, ул. Примерная, д. 123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution-phone">Телефон</Label>
                  <Input id="institution-phone" defaultValue="+7 (999) 123-45-67" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution-email">Email</Label>
                  <Input id="institution-email" defaultValue="info@example.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution-website">Веб-сайт</Label>
                  <Input id="institution-website" defaultValue="https://example.edu" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Текущий учебный год</Label>
                  <Select defaultValue="2023-2024">
                    <SelectTrigger id="academic-year">
                      <SelectValue placeholder="Выберите учебный год" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Текущий семестр</Label>
                  <Select defaultValue="spring">
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Выберите семестр" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Осенний</SelectItem>
                      <SelectItem value="spring">Весенний</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Темная тема</Label>
                    <p className="text-sm text-muted-foreground">Включить темную тему для всех пользователей</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Профиль администратора</CardTitle>
                <CardDescription>Управление вашим профилем и личной информацией</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="admin-first-name">Имя</Label>
                    <Input id="admin-first-name" defaultValue="Иван" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-last-name">Фамилия</Label>
                    <Input id="admin-last-name" defaultValue="Иванов" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" defaultValue="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Телефон</Label>
                  <Input id="admin-phone" defaultValue="+7 (999) 123-45-67" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-position">Должность</Label>
                  <Input id="admin-position" defaultValue="Главный администратор" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-bio">О себе</Label>
                  <Textarea
                    id="admin-bio"
                    defaultValue="Опытный администратор с более чем 10-летним стажем работы в образовательных учреждениях."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-public-profile">Публичный профиль</Label>
                    <p className="text-sm text-muted-foreground">
                      Сделать ваш профиль видимым для других пользователей
                    </p>
                  </div>
                  <Switch id="admin-public-profile" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить профиль
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>Настройте способы получения уведомлений</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Уведомления о новых студентах</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления при добавлении новых студентов</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="new-students-email" defaultChecked />
                      <Label htmlFor="new-students-email" className="text-sm">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="new-students-system" defaultChecked />
                      <Label htmlFor="new-students-system" className="text-sm">
                        Система
                      </Label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Уведомления о новых преподавателях</Label>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления при добавлении новых преподавателей
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="new-teachers-email" defaultChecked />
                      <Label htmlFor="new-teachers-email" className="text-sm">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="new-teachers-system" defaultChecked />
                      <Label htmlFor="new-teachers-system" className="text-sm">
                        Система
                      </Label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Уведомления о системных событиях</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления о важных системных событиях</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="system-events-email" defaultChecked />
                      <Label htmlFor="system-events-email" className="text-sm">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="system-events-system" defaultChecked />
                      <Label htmlFor="system-events-system" className="text-sm">
                        Система
                      </Label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Уведомления о новых отчетах</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления при создании новых отчетов</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="new-reports-email" />
                      <Label htmlFor="new-reports-email" className="text-sm">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="new-reports-system" defaultChecked />
                      <Label htmlFor="new-reports-system" className="text-sm">
                        Система
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить настройки
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>Управление настройками безопасности и доступа</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                    <p className="text-sm text-muted-foreground">
                      Повысьте безопасность вашего аккаунта с помощью двухфакторной аутентификации
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout">Тайм-аут сессии</Label>
                    <p className="text-sm text-muted-foreground">
                      Автоматически выходить из системы после периода неактивности
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger id="session-timeout" className="w-[180px]">
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 минут</SelectItem>
                      <SelectItem value="30">30 минут</SelectItem>
                      <SelectItem value="60">1 час</SelectItem>
                      <SelectItem value="120">2 часа</SelectItem>
                      <SelectItem value="never">Никогда</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Shield className="h-4 w-4" />
                  Обновить настройки безопасности
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Системные настройки</CardTitle>
                <CardDescription>Управление системными настройками и базой данных</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label>Статус системы</Label>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активна</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Текущий статус системы и доступность сервисов</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Обновить
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Резервное копирование</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Последнее резервное копирование: 10.03.2024 03:15</p>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Database className="h-3 w-3" />
                      Создать резервную копию
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Настройки базы данных</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="db-host">Хост</Label>
                      <Input id="db-host" defaultValue="localhost" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-port">Порт</Label>
                      <Input id="db-port" defaultValue="3306" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-name">Имя базы данных</Label>
                      <Input id="db-name" defaultValue="edumanage_db" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-user">Пользователь</Label>
                      <Input id="db-user" defaultValue="edumanage_user" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Режим обслуживания</Label>
                    <p className="text-sm text-muted-foreground">
                      Включить режим обслуживания (система будет недоступна для пользователей)
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Перезагрузить систему
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить настройки
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

