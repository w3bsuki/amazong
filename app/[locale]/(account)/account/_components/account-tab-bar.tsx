"use client"

import { useState } from "react"
import { Bell as IconBell, Store as IconBuildingStore, ChartLine as IconChartLine, CreditCard as IconCreditCard, Crown as IconCrown, Ellipsis as IconDots, Heart as IconHeart, Lock as IconLock, MapPin as IconMapPin, MessageCircle as IconMessage, Package as IconPackage, Receipt as IconReceipt, Settings as IconSettings, User as IconUser, type LucideIcon } from "lucide-react";

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import { DrawerBody } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"

type AccountNavItem = {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export function AccountTabBar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("Account")
  const tCommon = useTranslations("Common")

  const localePrefix = `/${locale}`
  const basePathname = pathname.startsWith(localePrefix)
    ? (pathname.slice(localePrefix.length) || "/")
    : pathname

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return basePathname === path
    return basePathname === path || basePathname.startsWith(path + '/')
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
      label: t("settings.title"),
      href: "/account/settings",
      icon: IconSettings,
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
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-background pb-safe md:hidden rounded-t-2xl shadow-nav overflow-hidden"
        role="navigation"
        aria-label={t("tabBarAriaLabel")}
      >
        <div className="flex h-(--spacing-bottom-nav) items-center justify-around px-inset">
          {tabs.map((tab) => {
            const active = isActive(tab.href, tab.exact)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className={cn(
                  "flex h-full min-h-(--control-default) min-w-(--control-default) flex-1 flex-col items-center justify-center gap-1 transition-colors",
                  "touch-manipulation tap-transparent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 rounded-full",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground/80",
                )}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
              >
                <tab.icon 
                  className="size-6"
                  stroke={active ? "2" : "1.5"}
                />
                <span className={cn(
                  "text-xs leading-none tracking-wide transition-all",
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
              "flex h-full min-h-(--control-default) min-w-(--control-default) flex-1 flex-col items-center justify-center gap-1 transition-colors",
              "touch-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 rounded-full",
              isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground/80",
            )}
            aria-label={t("tabBar.moreOptionsAriaLabel")}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
          >
            <IconDots className="size-6" stroke={isMoreActive ? "2" : "1.5"} />
            <span className={cn("text-xs leading-none tracking-wide transition-all", isMoreActive ? "font-semibold" : "font-medium")}>
              {t("tabBar.more")}
            </span>
          </button>
        </div>
      </nav>

      <DrawerShell
        open={moreOpen}
        onOpenChange={setMoreOpen}
        title={t("tabBar.moreTitle")}
        closeLabel={tCommon("close")}
        contentAriaLabel={t("tabBar.moreTitle")}
        description={t("tabBar.moreDescription")}
        descriptionClassName="max-w-sm"
        contentClassName="max-h-dialog md:hidden"
        headerClassName="border-border-subtle px-inset pt-4 pb-3"
        titleClassName="text-base font-semibold tracking-tight"
      >
        <DrawerBody className="px-inset py-3 pb-safe">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {moreLinks.map((item) => {
              const active = isActive(item.href, item.exact)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex min-h-(--control-default) items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-selected-border bg-selected text-primary"
                      : "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="size-4 shrink-0" stroke={active ? "2" : "1.75"} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </DrawerBody>
      </DrawerShell>
    </>
  )
}
