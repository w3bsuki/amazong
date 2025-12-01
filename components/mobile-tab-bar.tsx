"use client"

import { House, ShoppingCart, User, List } from "@phosphor-icons/react"
import { Link, usePathname } from "@/i18n/routing"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface TabItem {
  id: "home" | "menu" | "cart" | "account"
  icon: React.ReactNode
  href?: string
  action?: "menu"
}

const tabs: TabItem[] = [
  {
    id: "home",
    icon: <House size={24} weight="regular" />,
    href: "/"
  },
  {
    id: "menu",
    icon: <List size={24} weight="regular" />,
    action: "menu"
  },
  {
    id: "cart",
    icon: <ShoppingCart size={24} weight="regular" />,
    href: "/cart"
  },
  {
    id: "account",
    icon: <User size={24} weight="regular" />,
    href: "/account"
  }
]

interface MobileTabBarProps {
  onMenuClick?: () => void
}

export function MobileTabBar({ onMenuClick }: MobileTabBarProps) {
  const pathname = usePathname()
  const { items } = useCart()
  const t = useTranslations("Navigation")
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const isActive = (tab: TabItem) => {
    if (tab.href === "/") {
      return pathname === "/"
    }
    return tab.href && pathname.includes(tab.href)
  }

  // Get label from translations
  const getLabel = (id: TabItem["id"]) => {
    const labels: Record<TabItem["id"], string> = {
      home: t("home"),
      menu: t("menu"),
      cart: t("cart"),
      account: t("account"),
    }
    return labels[id]
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden pb-safe"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const active = isActive(tab)
          const label = getLabel(tab.id)
          
          if (tab.action === "menu") {
            return (
              <button
                key={tab.id}
                onClick={onMenuClick}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 min-h-[44px] gap-0.5",
                  "touch-action-manipulation tap-transparent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                aria-label={label}
              >
                {tab.icon}
                <span className="text-[10px] font-normal">{label}</span>
              </button>
            )
          }
          
          return (
            <Link
              key={tab.id}
              href={tab.href || "/"}
              prefetch={tab.id === "home" || tab.id === "cart"}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-h-[44px] gap-0.5 relative",
                "touch-action-manipulation tap-transparent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                active ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                {tab.icon}
                {tab.id === "cart" && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-badge-deal text-white text-[10px] font-medium rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-normal">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
