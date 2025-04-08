"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { UserRole } from "@/lib/types"


interface AuthContextType {
  userRole: UserRole
  userEmail: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  userEmail: null,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const role = localStorage.getItem("userRole") as UserRole;
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserEmail(email);
    setIsLoading(false);
  
    // Функция для проверки допустимости маршрута
    const isRouteAllowed = (pathname: string, role: UserRole): boolean => {
      const adminRoutes = [
        "/dashboard/admin",
        "/dashboard/students",
        "/dashboard/students/new",
        "/dashboard/groups", // Base route
        "/dashboard/teachers",
        "/dashboard/reports",
        "/dashboard/settings",
      ];
      const teacherRoutes = [
        "/dashboard/teacher",
        "/dashboard/students",
        "/dashboard/students/new",
        "/dashboard/reports",
      ];
      const inspectorRoutes = [
        "/dashboard/inspector",
        "/dashboard/students",
        "/dashboard/groups", // Base route
        "/dashboard/teachers",
        "/dashboard/reports",
      ];
    
      if (role === "ADMIN") {
        return adminRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
      }
      if (role === "TEACHER") {
        return teacherRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
      }
      if (role === "INSPECTOR") {
        return inspectorRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
      }
      return false;
    };
  
    // Редирект на логин, если пользователь не авторизован и пытается зайти на защищенные страницы
    if (!role && pathname !== "/" && !pathname.includes("/_next")) {
      router.push("/"); 
    }
  
    // Проверка прав доступа к текущему маршруту
    if (role && !isRouteAllowed(pathname, role)) {
      // Перенаправляем пользователя на его домашнюю страницу в зависимости от роли
      if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "TEACHER") router.push("/dashboard/teacher");
      else if (role === "INSPECTOR") router.push("/dashboard/inspector");
    }
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("token")
    setUserRole(null)
    setUserEmail(null)
    router.push("/")
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Загрузка...</div>
  }

  return <AuthContext.Provider value={{ userRole, userEmail, logout }}>{children}</AuthContext.Provider>
}

