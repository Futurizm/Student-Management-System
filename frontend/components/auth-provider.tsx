"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserRole = "admin" | "teacher" | "inspector" | null

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
    const role = localStorage.getItem("userRole") as UserRole
    const email = localStorage.getItem("userEmail")

    setUserRole(role)
    setUserEmail(email)
    setIsLoading(false)

    // Редирект на логин, если пользователь не авторизован и пытается зайти на защищенные страницы
    if (!role && pathname !== "/" && !pathname.includes("/_next")) {
      router.push("/")
    }

    // Редирект на соответствующую страницу, если пользователь авторизован, но на неправильной странице
    if (role && pathname === "/") {
      if (role === "admin") router.push("/dashboard/admin")
      else if (role === "teacher") router.push("/dashboard/teacher")
      else if (role === "inspector") router.push("/dashboard/inspector")
    }
  }, [pathname, router])

  const logout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    setUserRole(null)
    setUserEmail(null)
    router.push("/")
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Загрузка...</div>
  }

  return <AuthContext.Provider value={{ userRole, userEmail, logout }}>{children}</AuthContext.Provider>
}

