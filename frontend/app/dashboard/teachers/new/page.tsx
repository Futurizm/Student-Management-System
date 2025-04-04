import { DashboardLayout } from "@/components/dashboard-layout"
import { TeacherForm } from "@/components/teacher-form"

export default function NewTeacherPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Добавить преподавателя</h1>
        <p className="text-muted-foreground">Заполните форму ниже, чтобы добавить нового преподавателя в систему.</p>
        <TeacherForm />
      </div>
    </DashboardLayout>
  )
}

