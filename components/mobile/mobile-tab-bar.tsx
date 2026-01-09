"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Home, LayoutGrid, MessageCircle, User, PlusSquare } from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { useTranslations } from "next-intl"
import { MobileMenuSheet, type MobileMenuSheetHandle } from "@/components/mobile/mobile-menu-sheet"
import { useMessages } from "@/components/providers/message-context"
import type { CategoryTreeNode } from "@/lib/category-tree"

interface MobileTabBarProps {
  categories: CategoryTreeNode[]
}

export function MobileTabBar({ categories }: MobileTabBarProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const pathname = usePathname()
  const t = useTranslations("Navigation")
  const menuSheetRef = useRef<MobileMenuSheetHandle>(null)

  // Get unread message count from message context
  const { totalUnreadCount } = useMessages()
  const unreadCount = totalUnreadCount

  // Avoid SSR/hydration mismatches caused by client-only UI (drawers/portals).
  if (!mounted) return null

  // Hide tab bar on product pages - they have their own sticky buy box
  // Product pages use canonical format: /{locale}/{username}/{productSlug}
  // (with or without locale in usePathname(), depending on next-intl config)
  // Also hide on cart page - it has its own sticky checkout footer
  const rawSegments = pathname.split('/').filter(Boolean)
  const pathSegments = (() => {
    const segments = [...rawSegments]
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return segments
  })()
  const knownRoutes = ['categories', 'cart', 'checkout', 'account', 'chat', 'sell', 'help', 'auth', 'search', 'admin', 'dashboard', 'plans', 'wishlist', 'orders', 'settings', 'notifications']
  // /{username}/{slug-or-id} pattern: exactly 2 segments AND first segment is not a known route
  const firstSegment = pathSegments.at(0)
  const isProductPage = (pathSegments.length === 2 && !!firstSegment && !knownRoutes.includes(firstSegment))
  // Cart page has its own sticky footer
  const isCartPage = firstSegment === 'cart'

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  // Don't render on product pages - let the sticky buy box take over
  // Don't render on cart page - it has its own sticky checkout footer
  if (isProductPage || isCartPage) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 md:hidden pb-safe"
        role="navigation"
        aria-label="Mobile navigation"
        data-testid="mobile-tab-bar"
      >
        <div className="flex items-center justify-around h-14 px-1">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
              "touch-action-manipulation tap-transparent active:bg-gray-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              pathname === "/" ? "text-gray-900" : "text-gray-400"
            )}
            aria-label={t("home")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Home className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">{t("home")}</span>
          </Link>

          {/* Categories - Opens drawer sheet */}
          <button
            type="button"
            onClick={() => menuSheetRef.current?.open()}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
              "touch-action-manipulation tap-transparent active:bg-gray-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/categories") ? "text-gray-900" : "text-gray-400"
            )}
            aria-label={t("categories")}
            aria-haspopup="dialog"
          >
            <LayoutGrid className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">{t("categories")}</span>
          </button>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
              "touch-action-manipulation tap-transparent active:bg-gray-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/sell") ? "text-gray-900" : "text-gray-900"
            )}
            aria-label={t("sell")}
            aria-current={isActive("/sell") ? "page" : undefined}
          >
            <PlusSquare className="w-5.5 h-5.5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">{t("sell")}</span>
          </Link>

          {/* Chat */}
          <Link
            href="/chat"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
              "touch-action-manipulation tap-transparent active:bg-gray-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/chat") ? "text-gray-900" : "text-gray-400"
            )}
            aria-label={`${t("chat")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            aria-current={isActive("/chat") ? "page" : undefined}
          >
            <span className="relative">
              <MessageCircle className="w-5 h-5 stroke-[1.5]" />
              {unreadCount > 0 && (
                <CountBadge
                  count={unreadCount}
                  className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-2xs min-w-3.5 h-3.5 px-0.5"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="text-[10px] font-medium">{t("chat")}</span>
          </Link>

          {/* Account */}
          <Link
            href="/account"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
              "touch-action-manipulation tap-transparent active:bg-gray-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/account") ? "text-gray-900" : "text-gray-400"
            )}
            aria-label={t("account")}
            aria-current={isActive("/account") ? "page" : undefined}
          >
            <User className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">{t("account")}</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Sheet with category circles */}
      <MobileMenuSheet ref={menuSheetRef} categories={categories} />
    </>
  )
}
