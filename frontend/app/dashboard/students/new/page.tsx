import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentForm } from "@/components/student-form"

export default function NewStudentPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Добавить нового студента</h1>
        <p className="text-muted-foreground">Заполните форму ниже, чтобы добавить нового студента в систему.</p>
        <StudentForm />
      </div>
    </DashboardLayout>
  )
}

