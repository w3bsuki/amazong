import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { AdminStatsCards } from "@/components/admin-stats-cards"
import { AdminRecentActivity } from "@/components/admin-recent-activity"
import { getAdminStats } from "@/lib/auth/admin"

export default async function DashboardPage() {
  // Fetch real admin stats (uses service role to bypass RLS)
  const stats = await getAdminStats()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
