"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/layout/sidebar/sidebar"

const PATH_TO_KEY: Record<string, string> = {
  '/account': 'overview',
  '/account/orders': 'orders',
  '/account/wishlist': 'wishlist',
  '/account/security': 'security',
  '/account/addresses': 'addresses',
  '/account/notifications': 'notifications',
  '/account/payments': 'payments',
  '/account/selling': 'selling',
  '/account/sales': 'sales',
  '/account/plans': 'plans',
}

export function AccountHeader() {
  const t = useTranslations("Account.header")
  const pathname = usePathname()

  // Get current page title based on pathname
  const getPageTitle = () => {
    // Strip locale prefix (e.g., /en/account -> /account)
    const path = pathname.replace(/^\/[a-z]{2}/, "")

    // Prefer exact match first
    const exactKey = PATH_TO_KEY[path]
    if (exactKey) return t(exactKey)

    // Fall back to longest matching prefix
    const keysBySpecificity = Object.keys(PATH_TO_KEY).sort((a, b) => b.length - a.length)
    for (const routePath of keysBySpecificity) {
      if (path.startsWith(routePath + "/")) {
        const key = PATH_TO_KEY[routePath]
        if (key) return t(key)
      }
    }

    return t('myAccount')
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="text-sm font-medium text-foreground">{getPageTitle()}</div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link href="/" className="dark:text-foreground">
              {t('backToStore')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
