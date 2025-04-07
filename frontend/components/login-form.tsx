"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockIcon, MailIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { HOST } from "@/lib/constants"

// Предопределенные учетные записи
const USERS = {
  "admin@example.com": { password: "admin123", role: "admin" },
  "teacher@example.com": { password: "teacher123", role: "teacher" },
  "inspector@example.com": { password: "inspector123", role: "inspector" },
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Проверка учетных данных
    try {
      const response = await fetch(`${HOST}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response) {
        throw new Error(data.message || "Ошибка входа")
      }

      localStorage.setItem("token", data.token)

      const tokenPayload = JSON.parse(atob(data.token.split(".")[1]))
      const userRole = tokenPayload.role as keyof typeof routes

      localStorage.setItem("userRole", userRole)
      localStorage.setItem("userEmail", email)

      const routes = {
        ADMIN: "/dashboard/admin",
        TEACHER: "/dashboard/teacher",
        INSPECTOR: "/dashboard/inspector",
      }

      router.push(routes[userRole])

      toast({
        title: "Вход выполнен успешно",
        description: `Добро пожаловать, ${userRole.toLowerCase()}!`,
      })

    } catch (error: unknown) {
      setError("Неверный email или пароль")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Вход в систему</CardTitle>
        <CardDescription>Введите свои учетные данные для доступа</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 pt-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Тестовые аккаунты: admin@example.com, teacher@example.com, inspector@example.com
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Забыли пароль?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="password"
                type="password"
                className="pl-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Пароли: admin123, teacher123, inspector123 соответственно
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

