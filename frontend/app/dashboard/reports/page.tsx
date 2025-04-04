import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportGenerator } from "@/components/report-generator"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and download reports based on student data.</p>
        <ReportGenerator />
      </div>
    </DashboardLayout>
  )
}

