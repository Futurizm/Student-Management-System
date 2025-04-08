"use client";

import { useState, useEffect } from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Pencil, Router, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ViewTeacherModal } from "./view-teacher-modal";
import { EditTeacherModal } from "./edit-teacher-modal";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "Inactive" | "On Leave";
  imageUrl?: string;
};

interface TeacherTableProps {
  filterStatus?: "Active" | "Inactive" | "On Leave";
}

export function TeacherTable({ filterStatus }: TeacherTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filteredData, setFilteredData] = useState<Teacher[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTeachers();
  }, [filterStatus]);

  const fetchTeachers = async () => {
    try {
      console.log("Fetching teachers...");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Токен авторизации отсутствует. Пожалуйста, войдите в систему.");
      }
      console.log("Token found:", token);

      const response = await fetch("http://localhost:5000/api/teachers", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при загрузке преподавателей: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      const mappedData = data.map((teacher: any) => ({
        id: teacher.id.toString(),
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName,
        name: `${teacher.lastName} ${teacher.firstName} ${teacher.middleName || ""}`.trim(),
        email: teacher.user.email,
        department: teacher.department,
        role: teacher.position,
        status: "Active" as const, // Пока статично
        imageUrl: teacher.imageUrl || "/placeholder.svg?height=40&width=40",
      }));
      console.log("Mapped data:", mappedData);

      const filtered = filterStatus ? mappedData.filter((teacher) => teacher.status === filterStatus) : mappedData;
      setFilteredData(filtered);
    } catch (err: any) {
      console.error("Error in fetchTeachers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Loading set to false");
    }
  };

  const handleViewTeacher = (teacher: Teacher) => {
   router.push(`/dashboard/teachers/${teacher.id}`);
  };


  const handleDeleteTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTeacher = async () => {
    if (selectedTeacher) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in");
        const response = await fetch(`http://localhost:5000/api/teachers/${selectedTeacher.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete teacher");
        setFilteredData(filteredData.filter((teacher) => teacher.id !== selectedTeacher.id));
        toast({
          title: "Преподаватель удален",
          description: `Преподаватель ${selectedTeacher.name} был успешно удален`,
        });
      } catch (err: any) {
        toast({
          title: "Ошибка",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleSaveTeacher = async (updatedTeacher: Teacher) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in");
      const response = await fetch(`http://localhost:5000/api/teachers/${updatedTeacher.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: updatedTeacher.firstName,
          lastName: updatedTeacher.lastName,
          middleName: updatedTeacher.middleName,
          email: updatedTeacher.email,
          department: updatedTeacher.department,
          position: updatedTeacher.role,
        }),
      });
      if (!response.ok) throw new Error("Failed to update teacher");
      const updatedData = await response.json();
      setFilteredData(
        filteredData.map((teacher) =>
          teacher.id === updatedTeacher.id
            ? {
                ...teacher,
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                middleName: updatedData.middleName,
                name: `${updatedData.lastName} ${updatedData.firstName} ${updatedData.middleName || ""}`.trim(),
                email: updatedData.user.email,
                department: updatedData.department,
                role: updatedData.position,
              }
            : teacher
        )
      );
      toast({
        title: "Преподаватель обновлен",
        description: `Данные преподавателя ${updatedTeacher.name} успешно обновлены`,
      });
    } catch (err: any) {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    }
  };

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
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
        const status = row.original.status;
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
        );
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
  ];

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
  });

  if (loading) {
    console.log("Rendering loading state");
    return <p>Загрузка преподавателей...</p>;
  }
  if (error) {
    console.log("Rendering error state:", error);
    return <p>{error}</p>;
  }

  console.log("Rendering table with data:", filteredData);
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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

      {selectedTeacher && (
        <ViewTeacherModal
          teacher={selectedTeacher}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            setTimeout(() => setEditModalOpen(true), 100);
          }}
        />
      )}

      {selectedTeacher && (
        <EditTeacherModal
          teacher={selectedTeacher}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveTeacher}
        />
      )}

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
  );
}