"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { House, SquaresFour, ChatCircle, User, PlusCircle } from "@phosphor-icons/react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { MobileMenuSheet, type MobileMenuSheetHandle } from "@/components/mobile/mobile-menu-sheet"
import { useMessages } from "@/components/providers/message-context"

export function MobileTabBar() {
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
  // Product pages use: /product/[id] OR /{username}/{productSlug} (SEO format)
  const pathSegments = pathname.split('/').filter(Boolean)
  const knownRoutes = ['categories', 'cart', 'checkout', 'account', 'chat', 'sell', 'help', 'auth', 'search', 'admin', 'dashboard', 'plans', 'wishlist', 'orders', 'settings', 'notifications']
  const isProductPage = pathname.startsWith("/product/") || 
    // /{username}/{slug} pattern: exactly 2 segments AND first segment is not a known route
    (pathSegments.length === 2 && !knownRoutes.includes(pathSegments[0]))
  
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  // Don't render on product pages - let the sticky buy box take over
  if (isProductPage) return null

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border md:hidden pb-safe"
        role="navigation"
        aria-label="Mobile navigation"
        data-testid="mobile-tab-bar"
      >
        <div className="flex items-center justify-around h-[52px] px-1.5 relative">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center min-h-[40px] min-w-[40px] gap-0",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              isActive("/") && pathname === "/" ? "text-cta-trust-blue" : "text-muted-foreground"
            )}
            aria-label={t("home")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <House size={20} weight={pathname === "/" ? "fill" : "regular"} />
            <span className="text-2xs font-semibold tracking-tight">{t("home")}</span>
          </Link>

          {/* Categories - Opens drawer with category circles */}
          <button
            onClick={() => menuSheetRef.current?.open()}
            className={cn(
              "flex flex-col items-center justify-center min-h-[40px] min-w-[40px] gap-0",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              isActive("/categories") ? "text-cta-trust-blue" : "text-muted-foreground"
            )}
            aria-label={t("categories")}
          >
            <SquaresFour size={20} weight={isActive("/categories") ? "fill" : "regular"} />
            <span className="text-2xs font-semibold tracking-tight">{t("categories")}</span>
          </button>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center min-h-[40px] min-w-[40px] gap-0",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              isActive("/sell") ? "text-cta-trust-blue" : "text-muted-foreground"
            )}
            aria-label={t("sell")}
            aria-current={isActive("/sell") ? "page" : undefined}
          >
            <PlusCircle size={20} weight={isActive("/sell") ? "fill" : "regular"} />
            <span className="text-2xs font-semibold tracking-tight">{t("sell")}</span>
          </Link>

        {/* Chat */}
        <Link
          href="/chat"
          prefetch={true}
          className={cn(
            "flex flex-col items-center justify-center min-h-[40px] min-w-[40px] gap-0 relative",
            "touch-action-manipulation tap-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
            isActive("/chat") ? "text-cta-trust-blue" : "text-muted-foreground"
          )}
          aria-label={`${t("chat")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          aria-current={isActive("/chat") ? "page" : undefined}
        >
          <div className="relative">
            <ChatCircle size={20} weight={isActive("/chat") ? "fill" : "regular"} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <span className="text-2xs font-semibold tracking-tight">{t("chat")}</span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          prefetch={true}
          className={cn(
            "flex flex-col items-center justify-center min-h-[40px] min-w-[40px] gap-0",
            "touch-action-manipulation tap-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
            isActive("/account") ? "text-cta-trust-blue" : "text-muted-foreground"
          )}
          aria-label={t("account")}
          aria-current={isActive("/account") ? "page" : undefined}
        >
          <User size={20} weight={isActive("/account") ? "fill" : "regular"} />
          <span className="text-2xs font-semibold tracking-tight">{t("account")}</span>
        </Link>
      </div>
    </nav>
    
    {/* Mobile Menu Sheet with category circles */}
    <MobileMenuSheet ref={menuSheetRef} />
  </>
  )
}
