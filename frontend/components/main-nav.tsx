"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { UserRole } from "@/lib/types"

interface MainNavProps {
  pathname: string
  userRole: UserRole
}

export function MainNav({ pathname, userRole }: MainNavProps) {
  // Маршруты для администратора
  const adminRoutes = [
    {
      href: "/dashboard/admin",
      label: "Обзор",
      active: pathname === "/dashboard/admin",
    },
    {
      href: "/dashboard/students",
      label: "Студенты",
      active: pathname.includes("/dashboard/students"),
    },
    {
      href: "/dashboard/teachers",
      label: "Преподаватели",
      active: pathname === "/dashboard/teachers",
    },
    {
      href: "/dashboard/reports",
      label: "Отчеты",
      active: pathname === "/dashboard/reports",
    },
  ]

  // Маршруты для преподавателя
  const teacherRoutes = [
    {
      href: "/dashboard/teacher",
      label: "Обзор",
      active: pathname === "/dashboard/teacher",
    },
    {
      href: "/dashboard/students",
      label: "Студенты",
      active: pathname.includes("/dashboard/students"),
    },
  ]

  // Маршруты для проверяющего
  const inspectorRoutes = [
    {
      href: "/dashboard/inspector",
      label: "Обзор",
      active: pathname === "/dashboard/inspector",
    },
    {
      href: "/dashboard/students",
      label: "Студенты",
      active: pathname.includes("/dashboard/students"),
    },
    {
      href: "/dashboard/groups",
      label: "Группы",
      active: pathname === "/dashboard/groups",
    },
    {
      href: "/dashboard/teachers",
      label: "Преподаватели",
      active: pathname === "/dashboard/teachers",
    },
  ]

  // Выбираем маршруты в зависимости от роли
  const routes = userRole === "ADMIN" ? adminRoutes : userRole === "TEACHER" ? teacherRoutes : inspectorRoutes

  return (
    <nav className="hidden md:flex items-center gap-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-blue-600",
            route.active ? "text-blue-700" : "text-gray-600",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

