"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { DashboardHeaderShell } from "@/components/shared/dashboard-header-shell"
import { Button } from "@/components/ui/button"

const PATH_TO_KEY: Record<string, string> = {
  "/account": "header.overview",
  "/account/orders": "header.orders",
  "/account/wishlist": "header.wishlist",
  "/account/following": "header.following",
  "/account/profile": "header.profile",
  "/account/settings": "settings.title",
  "/account/security": "header.security",
  "/account/addresses": "header.addresses",
  "/account/notifications": "header.notifications",
  "/account/payments": "header.payments",
  "/account/billing": "header.billing",
  "/account/selling": "header.selling",
  "/account/sales": "header.sales",
  "/account/plans": "header.plans",
}

export function AccountHeader() {
  const t = useTranslations("Account")
  const locale = useLocale()
  const pathname = usePathname()

  const localePrefix = `/${locale}`
  const basePathname = pathname.startsWith(localePrefix)
    ? (pathname.slice(localePrefix.length) || "/")
    : pathname

  // Get current page title based on pathname
  const getPageTitle = () => {
    const path = basePathname

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

    return t("header.myAccount")
  }

  const pageTitle = getPageTitle()

  return (
    <DashboardHeaderShell triggerClassName="-ml-1 size-(--control-default) md:size-7">
      <div className="text-sm font-semibold leading-tight text-foreground">{pageTitle}</div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
          <Link href="/" className="dark:text-foreground">
            {t("header.backToStore")}
          </Link>
        </Button>
      </div>
    </DashboardHeaderShell>
  )
}
