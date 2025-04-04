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
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ViewTeacherModal } from "./view-teacher-modal"
import { EditTeacherModal } from "./edit-teacher-modal"
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

// Sample data
const data: Teacher[] = [
  {
    id: "T001",
    name: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    department: "Информатика",
    role: "Профессор",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T002",
    name: "Петрова Мария Сергеевна",
    email: "petrova@example.com",
    department: "Бизнес",
    role: "Доцент",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T003",
    name: "Сидоров Алексей Петрович",
    email: "sidorov@example.com",
    department: "Инженерия",
    role: "Профессор",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T004",
    name: "Козлова Елена Дмитриевна",
    email: "kozlova@example.com",
    department: "Психология",
    role: "Старший преподаватель",
    status: "On Leave",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T005",
    name: "Смирнов Дмитрий Александрович",
    email: "smirnov@example.com",
    department: "Дизайн",
    role: "Профессор",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T006",
    name: "Николаева Анна Владимировна",
    email: "nikolaeva@example.com",
    department: "Медицина",
    role: "Доцент",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T007",
    name: "Кузнецов Сергей Игоревич",
    email: "kuznetsov@example.com",
    department: "Юриспруденция",
    role: "Профессор",
    status: "Inactive",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "T008",
    name: "Морозова Ольга Андреевна",
    email: "morozova@example.com",
    department: "Информатика",
    role: "Старший преподаватель",
    status: "Active",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
]

export type Teacher = {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: "Active" | "Inactive" | "On Leave"
  imageUrl: string
}

interface TeacherTableProps {
  filterStatus?: "Active" | "Inactive" | "On Leave"
}

export function TeacherTable({ filterStatus }: TeacherTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState(data)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    if (filterStatus) {
      setFilteredData(data.filter((teacher) => teacher.status === filterStatus))
    } else {
      setFilteredData(data)
    }
  }, [filterStatus])

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setViewModalOpen(true)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setEditModalOpen(true)
  }

  const handleDeleteTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTeacher = () => {
    if (selectedTeacher) {
      // В реальном приложении здесь был бы API-запрос на удаление
      setFilteredData(filteredData.filter((teacher) => teacher.id !== selectedTeacher.id))
      toast({
        title: "Преподаватель удален",
        description: `Преподаватель ${selectedTeacher.name} был успешно удален`,
      })
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveTeacher = (updatedTeacher: Teacher) => {
    // В реальном приложении здесь был бы API-запрос на обновление
    setFilteredData(filteredData.map((teacher) => (teacher.id === updatedTeacher.id ? updatedTeacher : teacher)))
  }

  const columns: ColumnDef<Teacher>[] = [
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
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.imageUrl} alt={row.original.name} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "department",
      header: "Отделение",
    },
    {
      accessorKey: "role",
      header: "Должность",
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
                : status === "On Leave"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {status}
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
                <Button variant="ghost" size="icon" onClick={() => handleViewTeacher(row.original)}>
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
                <Button variant="ghost" size="icon" onClick={() => handleEditTeacher(row.original)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Редактировать</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Редактировать</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTeacher(row.original)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Удалить</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Удалить</p>
              </TooltipContent>
            </Tooltip>
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
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  className={`${row.getIsSelected() ? "bg-blue-50" : ""} hover:bg-gray-50 transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Нет результатов
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} из {table.getFilteredRowModel().rows.length} строк выбрано
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="gap-1"
          >
            Вперед
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Модальное окно просмотра преподавателя */}
      {selectedTeacher && (
        <ViewTeacherModal
          teacher={selectedTeacher}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false)
            setTimeout(() => setEditModalOpen(true), 100)
          }}
        />
      )}

      {/* Модальное окно редактирования преподавателя */}
      {selectedTeacher && (
        <EditTeacherModal
          teacher={selectedTeacher}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveTeacher}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Преподаватель {selectedTeacher?.name} будет удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTeacher} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

