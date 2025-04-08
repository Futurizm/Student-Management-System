"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function DashboardRedirect() {
  const router = useRouter()
  const { userRole } = useAuth()

  useEffect(() => {
    if (userRole === "ADMIN") {
      router.push("/dashboard/admin")
    } else if (userRole === "TEACHER") {
      router.push("/dashboard/teacher")
    } else if (userRole === "INSPECTOR") {
      router.push("/dashboard/inspector")
    } else {
      router.push("/")
    }
  }, [userRole, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Перенаправление...</p>
    </div>
  )
}

