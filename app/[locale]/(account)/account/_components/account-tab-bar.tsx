"use client"

import { useState, type ComponentType } from "react"
import { 
  IconUser, 
  IconPackage, 
  IconBuildingStore, 
  IconCrown, 
  IconDots,
  IconLock,
  IconMapPin,
  IconCreditCard,
  IconReceipt,
  IconBell,
  IconHeart,
  IconChartLine,
  IconMessage,
} from "@/lib/icons/tabler"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type AccountNavItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string; stroke?: string | number }>
  exact?: boolean
}

export function AccountTabBar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations("Account")

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path
    return pathname === path || pathname.startsWith(path + '/')
  }

  const tabs: AccountNavItem[] = [
    {
      label: t("tabBar.account"),
      href: "/account",
      icon: IconUser,
      exact: true,
    },
    {
      label: t("header.orders"),
      href: "/account/orders",
      icon: IconPackage,
    },
    {
      label: t("header.selling"),
      href: "/account/selling",
      icon: IconBuildingStore,
    },
    {
      label: t("header.plans"),
      href: "/account/plans",
      icon: IconCrown,
    },
  ]

  const moreLinks: AccountNavItem[] = [
    {
      label: t("header.profile"),
      href: "/account/profile",
      icon: IconUser,
    },
    {
      label: t("header.security"),
      href: "/account/security",
      icon: IconLock,
    },
    {
      label: t("header.addresses"),
      href: "/account/addresses",
      icon: IconMapPin,
    },
    {
      label: t("header.payments"),
      href: "/account/payments",
      icon: IconCreditCard,
    },
    {
      label: t("header.billing"),
      href: "/account/billing",
      icon: IconReceipt,
    },
    {
      label: t("header.notifications"),
      href: "/account/notifications",
      icon: IconBell,
    },
    {
      label: t("header.wishlist"),
      href: "/account/wishlist",
      icon: IconHeart,
    },
    {
      label: t("header.following"),
      href: "/account/following",
      icon: IconBuildingStore,
    },
    {
      label: t("header.sales"),
      href: "/account/sales",
      icon: IconChartLine,
    },
    {
      label: t("header.messages"),
      href: "/chat",
      icon: IconMessage,
    },
    {
      label: t("header.backToStore"),
      href: "/",
      icon: IconBuildingStore,
      exact: true,
    },
  ]

  const isMoreActive = moreLinks.some((item) => isActive(item.href, item.exact))

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border-subtle lg:hidden pb-safe"
        role="navigation"
        aria-label={t("tabBarAriaLabel")}
      >
        <div className="flex items-center justify-around h-14 px-1">
          {tabs.map((tab) => {
            const active = isActive(tab.href, tab.exact)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full min-w-11 min-h-11 gap-0.5 transition-colors",
                  "touch-manipulation tap-transparent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
                  active ? "text-primary" : "text-muted-foreground",
                )}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
              >
                <tab.icon 
                  className="size-5"
                  stroke={active ? 2 : 1.5}
                />
                <span className={cn(
                  "text-2xs leading-tight",
                  active ? "font-semibold" : "font-medium"
                )}>
                  {tab.label}
                </span>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full min-w-11 min-h-11 gap-0.5 transition-colors",
              "touch-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
              isMoreActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-label={t("tabBar.moreOptionsAriaLabel")}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
          >
            <IconDots className="size-5" stroke={isMoreActive ? 2 : 1.5} />
            <span className={cn("text-2xs leading-tight", isMoreActive ? "font-semibold" : "font-medium")}>
              {t("tabBar.more")}
            </span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="max-h-dialog overflow-hidden p-0">
          <SheetHeader className="border-b border-border-subtle">
            <SheetTitle>{t("tabBar.moreTitle")}</SheetTitle>
            <SheetDescription>
              {t("tabBar.moreDescription")}
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2 p-4 pb-safe overflow-y-auto">
            {moreLinks.map((item) => {
              const active = isActive(item.href, item.exact)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 min-h-11 text-sm font-medium transition-colors",
                    active
                      ? "border-selected-border bg-selected text-primary"
                      : "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="size-4 shrink-0" stroke={active ? 2 : 1.75} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
