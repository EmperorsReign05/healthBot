import { DashboardView } from "@/components/dashboard/dashboard-view"

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-balance">Health Dashboard</h1>
        <p className="text-muted-foreground mt-2">Disease trends and surveillance analytics</p>
      </div>
      <DashboardView />
    </div>
  )
}
