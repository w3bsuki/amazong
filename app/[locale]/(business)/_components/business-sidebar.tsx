"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import { Box as IconBox, Store as IconBuildingStore, ChartColumn as IconChartBar, LayoutDashboard as IconDashboard, House as IconHome, Package as IconPackage, Receipt as IconReceipt, Settings as IconSettings, ShoppingCart as IconShoppingCart, Megaphone as IconSpeakerphone, Tag as IconTag, Users as IconUsers } from "lucide-react";


import { NavUser } from "../../_components/nav/nav-user"
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/layout/sidebar/sidebar"
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BUSINESS_NAV, type BusinessRoute } from "../dashboard/_lib/routes"

const NAV_ICONS: Record<BusinessRoute, React.ElementType> = {
  "/dashboard": IconDashboard,
  "/dashboard/orders": IconShoppingCart,
  "/dashboard/products": IconBox,
  "/dashboard/inventory": IconPackage,
  "/dashboard/customers": IconUsers,
  "/dashboard/discounts": IconTag,
  "/dashboard/marketing": IconSpeakerphone,
  "/dashboard/analytics": IconChartBar,
  "/dashboard/accounting": IconReceipt,
  "/dashboard/settings": IconSettings,
}

const withIcons = (items: { title: string; url: BusinessRoute }[]) =>
  items.map((item) => ({
    ...item,
    icon: NAV_ICONS[item.url],
  }))

// Shopify-style nav structure with grouped sections
const salesChannelNav = withIcons(BUSINESS_NAV.salesChannel).map((item) => ({
  ...item,
  ...(item.url === "/dashboard/orders" ? { badge: 0 } : {}),
}))

const productsNav = withIcons(BUSINESS_NAV.products)
const customersNav = withIcons(BUSINESS_NAV.customers)
const marketingNav = withIcons(BUSINESS_NAV.marketing)
const analyticsNav = withIcons(BUSINESS_NAV.analytics)
const settingsNav = withIcons(BUSINESS_NAV.settings)

interface BusinessSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
  storeName?: string
  pendingOrdersCount?: number
  subscriptionTier?: string
  subscriptionName?: string
  hasDashboardAccess?: boolean
}

type SidebarNavItem = {
  title: string
  url: BusinessRoute
  icon: React.ElementType
  badge?: number
}

function NavItem({
  item,
  isActive
}: {
  item: SidebarNavItem
  isActive: boolean
}) {
  const Icon = item.icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "h-8 px-2 text-sm font-normal transition-colors",
          isActive && "bg-accent font-medium"
        )}
      >
        <Link href={item.url}>
          <Icon className="size-4" />
          <span className="flex-1">{item.title}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 px-1.5 text-2xs font-semibold bg-primary text-primary-foreground"
            >
              {item.badge > 99 ? '99+' : item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function NavGroup({
  label,
  items,
  isActive,
  className,
  children,
}: {
  label?: string
  items: SidebarNavItem[]
  isActive: (url: BusinessRoute) => boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <SidebarGroup className={cn("py-2", className)}>
      {label ? (
        <SidebarGroupLabel className="h-7 px-2 text-xs font-medium text-muted-foreground">
          {label}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => (
            <NavItem key={item.url} item={item} isActive={isActive(item.url)} />
          ))}
          {children}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// Subscription tier badge colors
const tierColors: Record<string, string> = {
  professional: 'bg-info text-info-foreground',
  enterprise: 'bg-warning text-warning-foreground',
  free: 'bg-muted text-muted-foreground',
}

const tierLabels: Record<string, string> = {
  professional: 'Pro',
  enterprise: 'Enterprise',
  free: 'Free',
}

export function BusinessSidebar({
  user,
  storeName,
  pendingOrdersCount = 0,
  subscriptionTier = 'free',
  hasDashboardAccess = false,
  ...props
}: BusinessSidebarProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const normalizedPath = pathname || "/dashboard"

  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, normalizedPath, setOpenMobile])

  const isActive = (url: BusinessRoute) => {
    if (url === '/dashboard') {
      return normalizedPath === '/dashboard' || normalizedPath === ''
    }
    return normalizedPath.startsWith(url)
  }

  // Update orders badge with pending count
  const salesChannelNavWithBadges = salesChannelNav.map((item) => ({
    ...item,
    ...(item.title === "Orders" && pendingOrdersCount > 0
      ? { badge: pendingOrdersCount }
      : {}),
  }))

  // Get tier display info
  const tierColor = tierColors[subscriptionTier] || tierColors.free
  const tierLabel = tierLabels[subscriptionTier] || 'Free'

  return (
    <DashboardSidebar
      {...props}
      header={
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 px-2"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBuildingStore className="size-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold truncate">
                    {storeName || 'My Store'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={cn(
                        "h-4 px-1.5 text-2xs font-semibold border-0",
                        tierColor
                      )}
                    >
                      {tierLabel}
                    </Badge>
                    {!hasDashboardAccess && (
                      <Link
                        href="/dashboard/upgrade"
                        className="text-2xs text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Upgrade
                      </Link>
                    )}
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      }
      contentClassName="gap-0"
      footer={<NavUser user={user} />}
    >
        {/* Main Sales Section */}
        <NavGroup items={salesChannelNavWithBadges} isActive={isActive} />

        {/* Products Section */}
        <NavGroup label="Products" items={productsNav} isActive={isActive} />

        {/* Customers Section */}
        <NavGroup label="Customers" items={customersNav} isActive={isActive} />

        {/* Marketing Section */}
        <NavGroup label="Marketing" items={marketingNav} isActive={isActive} />

        {/* Analytics Section */}
        <NavGroup label="Analytics" items={analyticsNav} isActive={isActive} />

        {/* Settings - at bottom */}
        <NavGroup className="mt-auto" items={settingsNav} isActive={isActive}>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-8 px-2 text-sm font-normal text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <IconHome className="size-4" />
                <span>Back to Store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </NavGroup>
    </DashboardSidebar>
  )
}
