"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ViewStudentModal } from "./view-student-modal"
import { EditStudentModal } from "./edit-student-modal"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddStudentDialog } from "./add-student-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const data: Student[] = [
  {
    id: "STU001",
    name: "Иванов Иван",
    email: "ivanov@example.com",
    studentId: "S12345",
    course: "Информатика",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 123-4567",
    gender: "male",
  },
  {
    id: "STU002",
    name: "Петрова Мария",
    email: "petrova@example.com",
    studentId: "S12346",
    course: "Бизнес-администрирование",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 234-5678",
    gender: "female",
  },
  {
    id: "STU003",
    name: "Сидоров Алексей",
    email: "sidorov@example.com",
    studentId: "S12347",
    course: "Графический дизайн",
    nationality: "Беларусь",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 345-6789",
    gender: "male",
  },
  {
    id: "STU004",
    name: "Козлова Анна",
    email: "kozlova@example.com",
    studentId: "S12348",
    course: "Психология",
    nationality: "Казахстан",
    status: "Inactive",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 456-7890",
    gender: "female",
  },
  {
    id: "STU005",
    name: "Смирнов Дмитрий",
    email: "smirnov@example.com",
    studentId: "S12349",
    course: "Инженерия",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 567-8901",
    gender: "male",
  },
  {
    id: "STU006",
    name: "Кузнецов Сергей",
    email: "kuznetsov@example.com",
    studentId: "S12350",
    course: "Медицина",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 678-9012",
    gender: "male",
  },
  {
    id: "STU007",
    name: "Морозова Ольга",
    email: "morozova@example.com",
    studentId: "S12351",
    course: "Юриспруденция",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 789-0123",
    gender: "female",
  },
  {
    id: "STU008",
    name: "Васильев Игорь",
    email: "vasiliev@example.com",
    studentId: "S12352",
    course: "Информатика",
    nationality: "Украина",
    status: "Inactive",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 890-1234",
    gender: "male",
  },
  {
    id: "STU009",
    name: "Николаева Елена",
    email: "nikolaeva@example.com",
    studentId: "S12353",
    course: "Бизнес-администрирование",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 901-2345",
    gender: "female",
  },
  {
    id: "STU010",
    name: "Соколов Андрей",
    email: "sokolov@example.com",
    studentId: "S12354",
    course: "Инженерия",
    nationality: "Россия",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+7 (999) 012-3456",
    gender: "male",
  },
]

export type Student = {
  id: string
  name: string
  email: string
  studentId: string
  course: string
  nationality: string
  status: "Active" | "Inactive"
  imageUrl: string
  phoneNumber?: string
  gender?: string
}

interface StudentTableProps {
  filterStatus?: "Active" | "Inactive"
}

export function StudentTable({ filterStatus }: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState(data)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(filterStatus || "all")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Применяем фильтры при изменении
  useEffect(() => {
    let result = [...data]

    // Фильтр по статусу
    if (statusFilter !== "all") {
      result = result.filter((student) => student.status === statusFilter)
    }

    // Фильтр по направлению
    if (courseFilter !== "all") {
      result = result.filter((student) => student.course === courseFilter)
    }

    // Поиск по имени, email или ID
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(lowerQuery) ||
          student.email.toLowerCase().includes(lowerQuery) ||
          student.studentId.toLowerCase().includes(lowerQuery),
      )
    }

    setFilteredData(result)
  }, [statusFilter, courseFilter, searchQuery])

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setViewModalOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setEditModalOpen(true)
  }

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      // В реальном приложении здесь был бы API-запрос на удаление
      setFilteredData(filteredData.filter((student) => student.id !== selectedStudent.id))
      toast({
        title: "Студент удален",
        description: `Студент ${selectedStudent.name} был успешно удален`,
      })
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveStudent = (updatedStudent: Student) => {
    // В реальном приложении здесь был бы API-запрос на обновление
    setFilteredData(filteredData.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Имитация загрузки данных
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Данные обновлены",
        description: "Список студентов успешно обновлен",
      })
    }, 1000)
  }

  const handleExport = () => {
    toast({
      title: "Экспорт данных",
      description: "Данные успешно экспортированы в CSV",
    })
  }

  // Получаем уникальные направления для фильтра
  const uniqueCourses = Array.from(new Set(data.map((student) => student.course)))

  const columns: ColumnDef<Student>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Выбрать строку"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Имя",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-primary/10">
            <AvatarImage src={row.original.imageUrl} alt={row.original.name} />
            <AvatarFallback
              className={row.original.gender === "female" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"}
            >
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "studentId",
      header: "ID студента",
      cell: ({ row }) => <div className="font-mono text-sm">{row.original.studentId}</div>,
    },
    {
      accessorKey: "course",
      header: "Направление",
      cell: ({ row }) => <div className="max-w-[180px] truncate font-medium">{row.original.course}</div>,
    },
    {
      accessorKey: "nationality",
      header: "Гражданство",
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={status === "Active" ? "default" : "secondary"}
            className={
              status === "Active"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {status === "Active" ? "Активен" : "Неактивен"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TooltipProvider>
          <div className="flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleViewStudent(row.original)}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Просмотр</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Просмотр</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleEditStudent(row.original)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Редактировать</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Редактировать</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Действия</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleViewStudent(row.original)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Просмотр профиля
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditStudent(row.original)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDeleteStudent(row.original)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      ),
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Список студентов</CardTitle>
            <CardDescription>
              Всего студентов: {filteredData.length} из {data.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AddStudentDialog />
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 py-3 border-b bg-muted/30">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, email или ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="Active">Активные</SelectItem>
                    <SelectItem value="Inactive">Неактивные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="Направление" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все направления</SelectItem>
                    {uniqueCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-medium">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`${row.getIsSelected() ? "bg-blue-50" : ""} hover:bg-gray-50 transition-colors border-b`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {isRefreshing ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                        Загрузка данных...
                      </div>
                    ) : (
                      "Нет результатов"
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <div className="flex items-center gap-2">
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} из {table.getFilteredRowModel().rows.length} строк
                  выбрано
                </span>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  Удалить выбранные
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Строк на странице</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Предыдущая страница</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Следующая страница</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Модальное окно просмотра студента */}
      {selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false)
            setTimeout(() => setEditModalOpen(true), 100)
          }}
        />
      )}

      {/* Модальное окно редактирования студента */}
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveStudent}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Студент {selectedStudent?.name} будет удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

