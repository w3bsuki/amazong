"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { House, SquaresFour, ChatCircle, UserCircle, Plus } from "@phosphor-icons/react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { useLocale, useTranslations } from "next-intl"
import { MobileMenuSheet, type MobileMenuSheetHandle } from "@/components/mobile/mobile-menu-sheet"
import { useMessages } from "@/components/providers/message-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { useCurrentUsername } from "@/hooks/use-current-username"
import type { CategoryTreeNode } from "@/lib/category-tree"

interface MobileTabBarProps {
  categories: CategoryTreeNode[]
}

export function MobileTabBar({ categories }: MobileTabBarProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("Navigation")
  const menuSheetRef = useRef<MobileMenuSheetHandle>(null)

  // Get unread message count from message context
  const { totalUnreadCount } = useMessages()
  const unreadCount = totalUnreadCount

  // Get drawer actions for chat button
  const { openMessages } = useDrawer()

  // Get current user's username for profile navigation
  const { username: currentUsername } = useCurrentUsername()
  
  // Profile destination:
  // - authenticated: navigate to own public profile
  // - guest: force a hard navigation to auth (workaround: SPA nav can render a 404 in dev/prod for this transition)
  const guestProfileHref = `/${locale}/auth/login?next=${encodeURIComponent("/account")}`
  const profileHref = currentUsername ? `/${currentUsername}` : null

  // Avoid SSR/hydration mismatches caused by client-only UI (drawers/portals).
  if (!mounted) return null

  // Hide tab bar on product pages - they have their own sticky buy box
  // Product pages use canonical format: /{locale}/{username}/{productSlug}
  // (with or without locale in usePathname(), depending on next-intl config)
  // Also hide on cart page - it has its own sticky checkout footer
  // Also hide on assistant page - it has its own chat input
  const rawSegments = pathname.split('/').filter(Boolean)
  const pathSegments = (() => {
    const segments = [...rawSegments]
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return segments
  })()
  const knownRoutes = ['categories', 'cart', 'checkout', 'account', 'chat', 'sell', 'help', 'auth', 'search', 'admin', 'dashboard', 'plans', 'wishlist', 'orders', 'settings', 'notifications', 'assistant']
  // /{username}/{slug-or-id} pattern: exactly 2 segments AND first segment is not a known route
  const firstSegment = pathSegments.at(0)
  const isProductPage = (pathSegments.length === 2 && !!firstSegment && !knownRoutes.includes(firstSegment))
  // Cart page has its own sticky footer
  const isCartPage = firstSegment === 'cart'
  // Assistant page has its own chat input
  const isAssistantPage = firstSegment === 'assistant'

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  // Don't render on product pages - let the sticky buy box take over
  // Don't render on cart page - it has its own sticky checkout footer
  // Don't render on assistant page - it has its own chat input
  if (isProductPage || isCartPage || isAssistantPage) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface-elevated border-t border-border pb-safe md:hidden"
        role="navigation"
        aria-label={t("mobileNavigation")}
        data-testid="mobile-tab-bar"
      >
        {/* Treido: 48px height, 5-column grid */}
        <div className="grid grid-cols-5 h-touch-lg items-center">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-full h-full",
              "tap-transparent hover:bg-hover active:bg-active transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
            )}
            aria-label={t("home")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <House 
              size={24}
              weight={pathname === "/" ? "fill" : "regular"}
              className={cn(
                "transition-colors",
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              )} 
            />
            <span className={cn(
              "text-2xs font-medium leading-none tracking-tight",
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            )}>{t("home")}</span>
          </Link>

          {/* Categories - Opens drawer sheet */}
          <button
            type="button"
            onClick={() => menuSheetRef.current?.open()}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-full h-full",
              "tap-transparent hover:bg-hover active:bg-active transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
            )}
            aria-label={t("categories")}
            aria-haspopup="dialog"
          >
            <SquaresFour 
              size={24}
              weight={isActive("/categories") ? "fill" : "regular"}
              className={cn(
                "transition-colors",
                isActive("/categories") ? "text-foreground" : "text-muted-foreground"
              )} 
            />
            <span className={cn(
              "text-2xs font-medium leading-none tracking-tight",
              isActive("/categories") ? "text-foreground" : "text-muted-foreground"
            )}>{t("categories")}</span>
          </button>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-full h-full",
              "tap-transparent hover:bg-hover active:bg-active transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
            )}
            aria-label={t("sell")}
            aria-current={isActive("/sell") ? "page" : undefined}
          >
            <Plus
              size={24}
              weight={isActive("/sell") ? "fill" : "regular"}
              className={cn(
                "transition-colors",
                isActive("/sell") ? "text-foreground" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-2xs font-medium leading-none tracking-tight",
                isActive("/sell") ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("sell")}
            </span>
          </Link>

          {/* Chat - Opens messages drawer */}
          <button
            type="button"
            onClick={openMessages}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-full h-full",
              "tap-transparent hover:bg-hover active:bg-active transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
            )}
            aria-label={`${t("chat")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
            aria-haspopup="dialog"
          >
            <span className="relative">
              <ChatCircle 
                size={24}
                weight={isActive("/chat") ? "fill" : "regular"}
                className={cn(
                  "transition-colors",
                  isActive("/chat") ? "text-foreground" : "text-muted-foreground"
                )} 
              />
              {unreadCount > 0 && (
                <CountBadge
                  count={unreadCount}
                  className="absolute -top-1 -right-2 bg-notification text-primary-foreground text-2xs min-w-3.5 h-3.5 px-0.5"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className={cn(
              "text-2xs font-medium leading-none tracking-tight",
              isActive("/chat") ? "text-foreground" : "text-muted-foreground"
            )}>{t("chat")}</span>
          </button>

          {/* Profile - Own profile page or auth fallback */}
          {profileHref ? (
            <Link
              href={profileHref}
              prefetch={true}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full",
                "tap-transparent hover:bg-hover active:bg-active transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              )}
              aria-label={t("profile")}
              aria-current={pathname.includes(`/${currentUsername}`) ? "page" : undefined}
              data-testid="mobile-tab-profile"
            >
              <UserCircle
                size={24}
                weight={pathname.includes(`/${currentUsername}`) ? "fill" : "regular"}
                className={cn(
                  "transition-colors",
                  pathname.includes(`/${currentUsername}`) ? "text-foreground" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-2xs font-medium leading-none tracking-tight",
                  pathname.includes(`/${currentUsername}`) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {t("profile")}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.location.assign(guestProfileHref)
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full",
                "tap-transparent hover:bg-hover active:bg-active transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
              )}
              aria-label={t("profile")}
              data-testid="mobile-tab-profile"
            >
              <UserCircle
                size={24}
                weight="regular"
                className="transition-colors text-muted-foreground"
              />
              <span className="text-2xs font-medium leading-none tracking-tight text-muted-foreground">
                {t("profile")}
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Sheet with category circles */}
      <MobileMenuSheet ref={menuSheetRef} categories={categories} />
    </>
  )
}
