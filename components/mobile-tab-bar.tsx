"use client"

import * as React from "react"
import { Home, ShoppingCart, User, Menu } from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

interface TabItem {
  id: string
  labelEn: string
  labelBg: string
  icon: React.ReactNode
  href?: string
  action?: "menu" | "search"
}

const tabs: TabItem[] = [
  {
    id: "home",
    labelEn: "Home",
    labelBg: "Начало",
    icon: <Home className="size-6" />,
    href: "/"
  },
  {
    id: "menu",
    labelEn: "Menu",
    labelBg: "Меню",
    icon: <Menu className="size-6" />,
    action: "menu"
  },
  {
    id: "cart",
    labelEn: "Cart",
    labelBg: "Кошница",
    icon: <ShoppingCart className="size-6" />,
    href: "/cart"
  },
  {
    id: "account",
    labelEn: "Account",
    labelBg: "Профил",
    icon: <User className="size-6" />,
    href: "/account"
  }
]

interface MobileTabBarProps {
  locale?: string
  onMenuClick?: () => void
  onSearchClick?: () => void
}

export function MobileTabBar({ 
  locale = "en", 
  onMenuClick,
  onSearchClick 
}: MobileTabBarProps) {
  const pathname = usePathname()
  const { items } = useCart()
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const isActive = (tab: TabItem) => {
    if (tab.href === "/") {
      return pathname === "/" || pathname === `/${locale}`
    }
    return tab.href && pathname.includes(tab.href)
  }

  const handleTabClick = (tab: TabItem) => {
    if (tab.action === "menu" && onMenuClick) {
      onMenuClick()
    } else if (tab.action === "search" && onSearchClick) {
      onSearchClick()
    }
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden pb-safe"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-[72px]">
        {tabs.map((tab) => {
          const active = isActive(tab)
          
          if (tab.action) {
            // Button for actions (menu, search)
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 min-h-14 min-w-14 h-full gap-1",
                  "touch-action-manipulation active:scale-95 transition-all",
                  active ? "text-brand-blue" : "text-muted-foreground"
                )}
                aria-label={locale === "bg" ? tab.labelBg : tab.labelEn}
              >
                {tab.icon}
                <span className="text-[11px] font-medium">
                  {locale === "bg" ? tab.labelBg : tab.labelEn}
                </span>
              </button>
            )
          }
          
          // Link for navigation
          return (
            <Link
              key={tab.id}
              href={tab.href || "/"}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-h-14 min-w-14 h-full gap-1 relative",
                "touch-action-manipulation active:scale-95 transition-all",
                active ? "text-brand-blue" : "text-muted-foreground"
              )}
              aria-label={locale === "bg" ? tab.labelBg : tab.labelEn}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                {tab.icon}
                {/* Cart badge */}
                {tab.id === "cart" && cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-2.5 bg-brand-deal text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium">
                {locale === "bg" ? tab.labelBg : tab.labelEn}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
