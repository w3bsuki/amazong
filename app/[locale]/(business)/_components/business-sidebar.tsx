"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import { Box as IconBox, Store as IconBuildingStore, ChartColumn as IconChartBar, LayoutDashboard as IconDashboard, House as IconHome, Package as IconPackage, Receipt as IconReceipt, Settings as IconSettings, ShoppingCart as IconShoppingCart, Megaphone as IconSpeakerphone, Tag as IconTag, Users as IconUsers } from "lucide-react";


import { NavUser } from "../../_components/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/layout/sidebar/sidebar"
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

function NavItem({
  item,
  isActive
}: {
  item: { title: string; url: string; icon: React.ElementType; badge?: number }
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

  const isActive = (url: string) => {
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
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
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Main Sales Section */}
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {salesChannelNavWithBadges.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Products Section */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-medium text-muted-foreground">
            Products
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {productsNav.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Customers Section */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-medium text-muted-foreground">
            Customers
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {customersNav.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Marketing Section */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-medium text-muted-foreground">
            Marketing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {marketingNav.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics Section */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-medium text-muted-foreground">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {analyticsNav.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings - at bottom */}
        <SidebarGroup className="mt-auto py-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {settingsNav.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
