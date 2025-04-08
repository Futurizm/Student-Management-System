"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  UserPlus,
  Settings,
  X,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  FileSpreadsheet,
  School,
  ClipboardList,
  CheckSquare,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InspectorForm } from "./inspector-form"; // Форма создания пользователя с ролью INSPECTOR

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userRole: "ADMIN" | "TEACHER" | "INSPECTOR" | null;
}

export function Sidebar({ open, setOpen, userRole = "ADMIN" }: SidebarProps) {
  const pathname = usePathname();
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);

  // Маршруты для администратора
  interface Route {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
    isDialogTrigger?: boolean;
  }

  const adminRoutes: Route[] = [
    {
      label: "Панель управления",
      icon: Home,
      href: "/dashboard/admin",
    },
    {
      label: "Студенты",
      icon: GraduationCap,
      href: "/dashboard/students",
    },
    {
      label: "Группы",
      icon: Users,
      href: "/dashboard/groups",
    },
    {
      label: "Преподаватели",
      icon: BookOpen,
      href: "/dashboard/teachers",
    },
    {
      label: "Отчеты",
      icon: FileSpreadsheet,
      href: "/dashboard/reports",
    },
    {
      label: "Настройки",
      icon: Settings,
      href: "/dashboard/settings",
    },
    // Вкладка для создания инспектора (пользователя с ролью INSPECTOR)
    ...(userRole === "ADMIN"
      ? [
          {
            label: "Добавить инспектора",
            icon: CheckSquare,
            href: "#",
            isDialogTrigger: true,
          },
        ]
      : []),
  ];

  // Маршруты для преподавателя
  const teacherRoutes = [
    {
      label: "Панель управления",
      icon: Home,
      href: "/dashboard/teacher",
    },
    {
      label: "Мои студенты",
      icon: GraduationCap,
      href: "/dashboard/students",
    },
    {
      label: "Добавить студента",
      icon: UserPlus,
      href: "/dashboard/students/new",
    },
    {
      label: "Отчеты",
      icon: FileSpreadsheet,
      href: "/dashboard/reports",
    },
  ];

  // Маршруты для проверяющего
  const inspectorRoutes = [
    {
      label: "Панель управления",
      icon: Home,
      href: "/dashboard/inspector",
    },
    {
      label: "Студенты",
      icon: GraduationCap,
      href: "/dashboard/students",
    },
    {
      label: "Группы",
      icon: Users,
      href: "/dashboard/groups",
    },
    {
      label: "Преподаватели",
      icon: BookOpen,
      href: "/dashboard/teachers",
    },
    {
      label: "Отчеты",
      icon: ClipboardList,
      href: "/dashboard/reports",
    },
  ];

  // Выбираем маршруты в зависимости от роли
  const routes = userRole === "ADMIN" ? adminRoutes : userRole === "TEACHER" ? teacherRoutes : inspectorRoutes;

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

<aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
          <img src="/kit-icon.svg" alt="kit_logo" className="h-8 w-8" /> 
          <span className="text-lg font-bold text-blue-700">EduManage Pro</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setOpen(!open)}>
            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {routes.map((route) =>
              route.isDialogTrigger ? (
                <Dialog
                  key={route.label}
                  open={isInspectorModalOpen}
                  onOpenChange={setIsInspectorModalOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full text-left",
                        pathname === route.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      )}
                      onClick={() => setIsInspectorModalOpen(true)}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать инспектора</DialogTitle>
                      <DialogDescription>
                        Создайте нового пользователя с ролью "Проверяющий".
                      </DialogDescription>
                    </DialogHeader>
                    <InspectorForm onClose={() => setIsInspectorModalOpen(false)} />
                  </DialogContent>
                </Dialog>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === route.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-md bg-blue-50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200">
              <span className="text-sm font-medium text-blue-700">
                {userRole === "ADMIN" ? "А" : userRole === "TEACHER" ? "П" : "И"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">
                {userRole === "ADMIN" ? "Администратор" : userRole === "TEACHER" ? "Преподаватель" : "Проверяющий"}
              </p>
              <p className="text-xs text-gray-500">Роль в системе</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}