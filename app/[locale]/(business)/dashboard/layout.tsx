import { BusinessSidebar } from "../_components/business-sidebar"
import { BusinessHeader } from "../_components/business-header"
import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { 
  requireBusinessSeller, 
  getPendingTasksCount, 
  getActiveSubscription,
  hasDashboardAccess,
} from "@/lib/auth/business"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/layout/sidebar/sidebar"
import { connection } from "next/server"
import { FullRouteIntlProvider } from "../../_providers/route-intl-provider"

export default async function BusinessDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <FullRouteIntlProvider locale={locale}>
      <Suspense fallback={null}>
        <BusinessDashboardLayoutInner>{children}</BusinessDashboardLayoutInner>
      </Suspense>
    </FullRouteIntlProvider>
  )
}

async function BusinessDashboardLayoutInner({ children }: { children: React.ReactNode }) {
  // Mark route as dynamic without using route segment config (incompatible with cacheComponents).
  await connection()

  // This will redirect non-business sellers to account page
  const businessSeller = await requireBusinessSeller("/account")
  
  // Check subscription status for dashboard access
  const subscription = await getActiveSubscription(businessSeller.id)
  const hasAccess = hasDashboardAccess(businessSeller.tier, subscription)
  
  // Note: Individual pages that require subscription access should use
  // requireDashboardAccess() instead. The upgrade page is allowed for all
  // business users so they can see pricing and upgrade.
  
  // Get pending orders count for sidebar badge
  const tasks = await getPendingTasksCount(businessSeller.id)
  
  // Determine subscription tier for display
  const subscriptionTier = subscription?.plan_tier || businessSeller.tier || 'free'
  const subscriptionName = subscription?.plan_name || 'Business Free'

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Suspense fallback={null}>
        <BusinessSidebar 
          variant="inset" 
          storeName={businessSeller.store_name}
          pendingOrdersCount={tasks.unfulfilled}
          subscriptionTier={subscriptionTier}
          subscriptionName={subscriptionName}
          hasDashboardAccess={hasAccess}
          user={{
            name: businessSeller.business_name || businessSeller.store_name,
            email: businessSeller.email,
            avatar: businessSeller.avatar_url || "/avatars/business.jpg",
          }}
        />
      </Suspense>
      <SidebarInset>
        <Suspense fallback={null}>
          <BusinessHeader 
            storeName={businessSeller.store_name}
            isVerified={businessSeller.is_verified_business}
            subscriptionTier={subscriptionTier}
            hasDashboardAccess={hasAccess}
          />
        </Suspense>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
