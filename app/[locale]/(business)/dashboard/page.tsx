import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive"
import { BusinessStatsCards } from "../_components/business-stats-cards"
import { BusinessRecentActivity } from "../_components/business-recent-activity"
import { BusinessQuickActions } from "../_components/business-quick-actions"
import { BusinessTaskCards } from "../_components/business-task-cards"
import { BusinessSetupGuide } from "../_components/business-setup-guide"
import { BusinessLiveActivity } from "../_components/business-live-activity"
import { BusinessActivityFeed } from "../_components/business-activity-feed"
import { BusinessPerformanceScore } from "../_components/business-performance-score"
import { 
  requireDashboardAccess, 
  getBusinessDashboardStats, 
  getPendingTasksCount, 
  getSetupProgress,
  calculatePerformanceScoreServer,
  transformToActivityItemsServer,
} from "@/lib/auth/business"

export default async function BusinessDashboardPage() {
  // Get the authenticated business seller with subscription check
  // This will redirect to /dashboard/upgrade if they don't have a paid subscription
  const businessSeller = await requireDashboardAccess()
  
  // Fetch business-specific stats
  const stats = await getBusinessDashboardStats(businessSeller.id)
  
  // Get pending tasks count for task cards
  const tasks = await getPendingTasksCount(businessSeller.id)
  
  // Get setup progress for onboarding guide
  const setupProgress = await getSetupProgress(businessSeller.id)
  
  // Check if store needs setup (show guide only for incomplete stores)
  const isNewStore = !setupProgress.hasProducts || !setupProgress.hasDescription

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Setup Guide for New Sellers - Shopify Style */}
      {isNewStore && (
        <BusinessSetupGuide
          storeName={businessSeller.store_name}
          hasProducts={setupProgress.hasProducts}
          hasDescription={setupProgress.hasDescription}
          hasPaymentSetup={setupProgress.hasPaymentSetup}
          hasShippingSetup={setupProgress.hasShippingSetup}
          hasLogo={setupProgress.hasLogo}
        />
      )}
      
      {/* Quick Actions - Shopify Style */}
      <BusinessQuickActions />
      
      {/* Compact Activity & Task Badges Row */}
      {(stats.liveActivity?.currentVisitors > 0 || stats.liveActivity?.cartAdds > 0 || tasks.unfulfilled > 0 || tasks.lowStock > 0 || tasks.pendingReviews > 0) && (
        <div className="flex items-center gap-3 px-4 lg:px-6 flex-wrap">
          <BusinessLiveActivity
            currentVisitors={stats.liveActivity?.currentVisitors || 0}
            cartAdds={stats.liveActivity?.cartAdds || 0}
          />
          <BusinessTaskCards tasks={tasks} />
        </div>
      )}
      
      {/* Stats Cards */}
      <BusinessStatsCards totals={stats.totals} />
      
      {/* Revenue Chart */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      
      {/* Performance Score & Activity Feed - Two Column Layout */}
      <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
        {/* Performance Score */}
        <BusinessPerformanceScore 
          {...calculatePerformanceScoreServer(stats.totals)}
        />
        
        {/* Activity Feed */}
        <BusinessActivityFeed 
          activities={transformToActivityItemsServer(
            stats.recent.orders,
            stats.recent.products
          )}
        />
      </div>
      
      {/* Legacy Recent Activity - Can be removed if not needed */}
      <BusinessRecentActivity 
        products={stats.recent.products}
        orders={stats.recent.orders}
      />
    </div>
  )
}
