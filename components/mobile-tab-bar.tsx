"use client"

import { House, ShoppingCart, User, List } from "@phosphor-icons/react"
import { Link, usePathname } from "@/i18n/routing"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

interface TabItem {
  id: string
  labelEn: string
  labelBg: string
  icon: React.ReactNode
  href?: string
  action?: "menu"
}

const tabs: TabItem[] = [
  {
    id: "home",
    labelEn: "Home",
    labelBg: "Начало",
    icon: <House size={24} weight="regular" />,
    href: "/"
  },
  {
    id: "menu",
    labelEn: "Menu",
    labelBg: "Меню",
    icon: <List size={24} weight="regular" />,
    action: "menu"
  },
  {
    id: "cart",
    labelEn: "Cart",
    labelBg: "Кошница",
    icon: <ShoppingCart size={24} weight="regular" />,
    href: "/cart"
  },
  {
    id: "account",
    labelEn: "Account",
    labelBg: "Профил",
    icon: <User size={24} weight="regular" />,
    href: "/account"
  }
]

interface MobileTabBarProps {
  locale?: string
  onMenuClick?: () => void
}

export function MobileTabBar({ locale = "en", onMenuClick }: MobileTabBarProps) {
  const pathname = usePathname()
  const { items } = useCart()
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const isActive = (tab: TabItem) => {
    if (tab.href === "/") {
      return pathname === "/" || pathname === `/${locale}`
    }
    return tab.href && pathname.includes(tab.href)
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden pb-safe"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = isActive(tab)
          
          if (tab.action === "menu") {
            return (
              <button
                key={tab.id}
                onClick={onMenuClick}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-0.5",
                  "touch-action-manipulation tap-transparent",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.icon}
                <span className="text-[10px] font-normal">
                  {locale === "bg" ? tab.labelBg : tab.labelEn}
                </span>
              </button>
            )
          }
          
          return (
            <Link
              key={tab.id}
              href={tab.href || "/"}
              prefetch={tab.id === "home" || tab.id === "cart"}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative",
                "touch-action-manipulation tap-transparent",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className="relative">
                {tab.icon}
                {tab.id === "cart" && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-badge-deal text-white text-[10px] font-medium rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-normal">
                {locale === "bg" ? tab.labelBg : tab.labelEn}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
