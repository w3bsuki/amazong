"use client"

import { 
  IconUser, 
  IconPackage, 
  IconBuildingStore, 
  IconCrown, 
  IconHome,
} from "@tabler/icons-react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"

export function AccountTabBar() {
  const pathname = usePathname()
  const locale = useLocale()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path
    return pathname === path || pathname.startsWith(path + '/')
  }

  const tabs = [
    {
      label: locale === 'bg' ? 'Акаунт' : 'Account',
      href: "/account" as const,
      icon: IconUser,
      exact: true,
    },
    {
      label: locale === 'bg' ? 'Поръчки' : 'Orders',
      href: "/account/orders" as const,
      icon: IconPackage,
    },
    {
      label: locale === 'bg' ? 'Продавам' : 'Selling',
      href: "/account/selling" as const,
      icon: IconBuildingStore,
    },
    {
      label: locale === 'bg' ? 'Планове' : 'Plans',
      href: "/account/plans" as const,
      icon: IconCrown,
    },
    {
      label: locale === 'bg' ? 'Магазин' : 'Store',
      href: "/" as const,
      icon: IconHome,
    },
  ]

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border lg:hidden pb-safe"
      role="navigation"
      aria-label="Account navigation"
    >
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map((tab) => {
          const active = isActive(tab.href, tab.exact)
          const isStore = tab.href === "/"
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              prefetch={true}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-w-11 min-h-11 gap-0.5 transition-colors",
                "touch-action-manipulation tap-transparent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
                active && !isStore 
                  ? "text-brand" 
                  : "text-muted-foreground",
              )}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              <tab.icon 
                className="size-5"
                stroke={active && !isStore ? 2 : 1.5}
              />
              <span className={cn(
                "text-2xs leading-tight",
                active && !isStore ? "font-semibold" : "font-medium"
              )}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
