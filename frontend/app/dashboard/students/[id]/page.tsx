import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentProfile } from "@/components/student-profile"

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
        <StudentProfile id={params.id} />
      </div>
    </DashboardLayout>
  )
}

