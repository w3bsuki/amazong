"use client"

import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AccountHeader() {
  const locale = useLocale()
  const pathname = usePathname()
  
  // Get current page title based on pathname
  const getPageTitle = () => {
    const path = pathname.replace(`/${locale}`, "")
    
    const titles: Record<string, { en: string; bg: string }> = {
      '/account': { en: 'Account Overview', bg: 'Преглед на акаунта' },
      '/account/orders': { en: 'Orders', bg: 'Поръчки' },
      '/account/wishlist': { en: 'Wishlist', bg: 'Любими' },
      '/account/security': { en: 'Security', bg: 'Сигурност' },
      '/account/addresses': { en: 'Addresses', bg: 'Адреси' },
      '/account/payments': { en: 'Payments', bg: 'Плащания' },
      '/account/selling': { en: 'Selling', bg: 'Продавам' },
      '/account/sales': { en: 'Sales', bg: 'Продажби' },
      '/account/plans': { en: 'Plans', bg: 'Планове' },
    }
    
    // Prefer exact match first (e.g. "/account/orders" should not match "/account")
    const exact = titles[path]
    if (exact) return locale === "bg" ? exact.bg : exact.en

    // Then fall back to the longest matching prefix
    const keysBySpecificity = Object.keys(titles).sort((a, b) => b.length - a.length)
    for (const key of keysBySpecificity) {
      if (path.startsWith(key + "/")) {
        const value = titles[key]
        return locale === "bg" ? value.bg : value.en
      }
    }
    
    return locale === 'bg' ? 'Моят акаунт' : 'My Account'
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
            <a href={`/${locale}`} className="dark:text-foreground">
              {locale === 'bg' ? 'Към магазина' : 'Back to Store'}
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
