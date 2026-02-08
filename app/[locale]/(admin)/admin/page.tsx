import { ChartAreaInteractive } from "@/components/shared/charts/chart-area-interactive"
import { AdminStatsCards } from "../_components/admin-stats-cards"
import { AdminRecentActivity } from "../_components/admin-recent-activity"
import { getAdminStats } from "@/lib/auth/admin"
import { connection } from "next/server"

export default async function AdminPage() {
  // Mark route as dynamic - admin routes need auth
  await connection()
  
  // Fetch real admin stats (uses service role to bypass RLS)
  const stats = await getAdminStats()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
      <AdminStatsCards totals={stats.totals} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <AdminRecentActivity 
        users={stats.recent.users}
        products={stats.recent.products}
        orders={stats.recent.orders}
      />
    </div>
  )
}
