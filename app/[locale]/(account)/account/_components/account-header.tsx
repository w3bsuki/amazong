"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { DashboardHeaderShell } from "@/components/shared/dashboard-header-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const PATH_TO_KEY: Record<string, string> = {
  "/account": "header.myAccount",
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

const TOP_LEVEL_BACK_TARGETS = [
  "/account/orders",
  "/account/wishlist",
  "/account/following",
  "/account/profile",
  "/account/settings",
  "/account/security",
  "/account/addresses",
  "/account/notifications",
  "/account/payments",
  "/account/billing",
  "/account/selling",
  "/account/sales",
  "/account/plans",
] as const

function getBackHref(basePathname: string): string {
  if (basePathname === "/account") return "/"

  for (const topLevel of TOP_LEVEL_BACK_TARGETS) {
    if (basePathname === topLevel) return "/account"
    if (basePathname.startsWith(topLevel + "/")) return topLevel
  }

  return "/account"
}

export function AccountHeader() {
  const t = useTranslations("Account")
  const tCommon = useTranslations("Common")
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

  const backHref = getBackHref(basePathname)
  const pageTitle = getPageTitle()

  return (
    <>
      {/* Mobile contextual header */}
      <div className="bg-background pt-safe md:hidden">
        <div className="flex h-(--control-primary) items-center border-b border-border-subtle px-2">
          <Link
            href={backHref}
            className="flex size-(--control-default) -ml-1 items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label={tCommon("back")}
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </Link>
          <div className="ml-1 max-w-48 truncate text-sm font-semibold leading-tight text-foreground">
            {pageTitle}
          </div>
        </div>
      </div>

      {/* Desktop dashboard header */}
      <div className="hidden md:block">
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
      </div>
    </>
  )
}
