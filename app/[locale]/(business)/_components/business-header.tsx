"use client"

import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/layout/sidebar/sidebar"
import { Badge } from "@/components/ui/badge"
import { BusinessCommandPalette } from "./business-command-palette"
import { BusinessNotifications } from "./business-notifications"
import { BUSINESS_PAGE_TITLES, type BusinessRoute } from "../dashboard/_lib/routes"
import {
  IconPlus,
  IconExternalLink,
} from "@/lib/icons/tabler"

interface BusinessHeaderProps {
  storeName?: string
  isVerified?: boolean
  subscriptionTier?: string
  hasDashboardAccess?: boolean
}

export function BusinessHeader({
  storeName,
  isVerified,
  hasDashboardAccess = false
}: BusinessHeaderProps) {
  const pathname = usePathname()

  const normalizedPath = pathname || "/dashboard"

  // Get page title based on current route
  const getPageTitle = () => {
    // Check for exact match first
    if (normalizedPath in BUSINESS_PAGE_TITLES) {
      return BUSINESS_PAGE_TITLES[normalizedPath as BusinessRoute]
    }
    // Check for partial match (e.g., /dashboard/orders/123)
    for (const [route, title] of Object.entries(BUSINESS_PAGE_TITLES)) {
      if (normalizedPath.startsWith(route) && route !== "/dashboard") {
        return title
      }
    }
    return BUSINESS_PAGE_TITLES["/dashboard"]
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        />

        {/* Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold">{getPageTitle()}</h1>
          {isVerified && normalizedPath === '/dashboard' && (
            <Badge variant="outline" className="text-2xs h-5 bg-success/10 text-success border-success/30">
              Verified
            </Badge>
          )}
          {!hasDashboardAccess && (
            <Link href="/dashboard/upgrade">
              <Badge
                variant="outline"
                className="text-2xs h-5 bg-warning/10 text-warning border-warning/30 hover:bg-warning/20 cursor-pointer"
              >
                Upgrade to unlock
              </Badge>
            </Link>
          )}
        </div>

        {/* Command Palette Search - Shopify Style */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto justify-center">
          <BusinessCommandPalette {...(storeName ? { storeName } : {})} />
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-1">
          <div className="md:hidden">
            <BusinessCommandPalette compact enableKeyboardShortcut={false} {...(storeName ? { storeName } : {})} />
          </div>

          {/* Add Product - Primary Action */}
          <Button
            variant="default"
            size="sm"
            asChild
            className="hidden sm:flex h-8 px-3"
          >
            <Link href="/dashboard/products?add=true">
              <IconPlus className="size-4 mr-1" />
              Add product
            </Link>
          </Button>

          {/* View Store */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex h-8 text-muted-foreground hover:text-foreground"
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <IconExternalLink className="size-4 mr-1" />
              View store
            </a>
          </Button>

          {/* Notifications */}
          <BusinessNotifications />
        </div>
      </div>
    </header>
  )
}
