"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Home, LayoutGrid, MessageCircle, User, PlusCircle } from "lucide-react"
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

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  // Don't render on product pages - let the sticky buy box take over
  if (isProductPage) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden pb-safe"
        role="navigation"
        aria-label="Mobile navigation"
        data-testid="mobile-tab-bar"
      >
        <div className="flex items-center justify-around h-12 px-1">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              pathname === "/" ? "text-cta-trust-blue" : "text-muted-foreground active:text-foreground"
            )}
            aria-label={t("home")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Home size={20} className={pathname === "/" ? "fill-current" : ""} />
            <span className="text-2xs font-medium leading-none">{t("home")}</span>
          </Link>

          {/* Categories - Opens drawer sheet */}
          <button
            type="button"
            onClick={() => menuSheetRef.current?.open()}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/categories") ? "text-cta-trust-blue" : "text-muted-foreground active:text-foreground"
            )}
            aria-label={t("categories")}
            aria-haspopup="dialog"
          >
            <LayoutGrid size={20} className={isActive("/categories") ? "fill-current" : ""} />
            <span className="text-2xs font-medium leading-none">{t("categories")}</span>
          </button>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/sell") ? "text-cta-trust-blue" : "text-muted-foreground active:text-foreground"
            )}
            aria-label={t("sell")}
            aria-current={isActive("/sell") ? "page" : undefined}
          >
            <PlusCircle size={20} className={isActive("/sell") ? "fill-current" : ""} />
            <span className="text-2xs font-medium leading-none">{t("sell")}</span>
          </Link>

          {/* Chat */}
          <Link
            href="/chat"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/chat") ? "text-cta-trust-blue" : "text-muted-foreground active:text-foreground"
            )}
            aria-label={`${t("chat")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            aria-current={isActive("/chat") ? "page" : undefined}
          >
            <span className="relative">
              <MessageCircle size={20} className={isActive("/chat") ? "fill-current" : ""} />
              {unreadCount > 0 && (
                <CountBadge
                  count={unreadCount}
                  className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-2xs min-w-3.5 h-3.5 px-0.5"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="text-2xs font-medium leading-none">{t("chat")}</span>
          </Link>

          {/* Account */}
          <Link
            href="/account"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              isActive("/account") ? "text-cta-trust-blue" : "text-muted-foreground active:text-foreground"
            )}
            aria-label={t("account")}
            aria-current={isActive("/account") ? "page" : undefined}
          >
            <User size={20} className={isActive("/account") ? "fill-current" : ""} />
            <span className="text-2xs font-medium leading-none">{t("account")}</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Sheet with category circles */}
      <MobileMenuSheet ref={menuSheetRef} categories={categories} />
    </>
  )
}
