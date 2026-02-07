"use client"

import { useEffect, useState } from "react"
import { House, SquaresFour, ChatCircle, UserCircle, Plus } from "@phosphor-icons/react"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { useTranslations } from "next-intl"
import { useMessages } from "@/components/providers/message-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav"
import { useAuthOptional } from "@/components/providers/auth-state-manager"

interface MobileTabBarProps {}

export function MobileTabBar(_: MobileTabBarProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("Navigation")
  const categoryDrawer = useCategoryDrawerOptional()
  const auth = useAuthOptional()

  // Get unread message count from message context
  const { totalUnreadCount } = useMessages()
  const unreadCount = totalUnreadCount

  // Get drawer actions for chat/account/auth buttons
  const { openMessages, openAccount, openAuth, state: drawerState } = useDrawer()

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

  const tabItemBase = cn(
    "flex min-h-(--spacing-touch-md) w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1",
    "tap-transparent transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
  )

  const tabItemClass = (active: boolean) =>
    cn(
      tabItemBase,
      active
        ? "text-foreground"
        : "text-muted-foreground hover:bg-surface-subtle active:bg-hover"
    )

  const isAuthenticated = Boolean(auth?.user)
  const isProfileActive = drawerState.account.open || drawerState.auth.open || isActive("/account")

  // Don't render on product pages - let the sticky buy box take over
  // Don't render on cart page - it has its own sticky checkout footer
  // Don't render on assistant page - it has its own chat input
  if (isProductPage || isCartPage || isAssistantPage) return null

  return (
    <>
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
        role="navigation"
        aria-label={t("mobileNavigation")}
        data-testid="mobile-tab-bar"
      >
        <div className="mx-auto max-w-screen-sm px-2 pb-safe-max-xs">
          <div className="pointer-events-auto mb-1 rounded-2xl border border-border-subtle bg-surface-elevated p-0.5 shadow-2xs">
            <div className="grid grid-cols-5 items-end gap-0.5">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={tabItemClass(pathname === "/")}
            aria-label={t("home")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <House 
              size={20}
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
            onClick={() => {
              if (categoryDrawer) {
                categoryDrawer.openRoot()
                return
              }
              router.push("/categories")
            }}
            className={tabItemClass(isActive("/categories") || Boolean(categoryDrawer?.isOpen))}
            aria-label={t("categories")}
            aria-haspopup="dialog"
            aria-expanded={categoryDrawer?.isOpen}
          >
            <SquaresFour 
              size={20}
              weight={isActive("/categories") || categoryDrawer?.isOpen ? "fill" : "regular"}
              className={cn(
                "transition-colors",
                isActive("/categories") || categoryDrawer?.isOpen ? "text-foreground" : "text-muted-foreground"
              )} 
            />
            <span className={cn(
              "text-2xs font-medium leading-none tracking-tight",
              isActive("/categories") || categoryDrawer?.isOpen ? "text-foreground" : "text-muted-foreground"
            )}>{t("categories")}</span>
          </button>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              tabItemBase,
              "text-foreground hover:bg-surface-subtle active:bg-hover"
            )}
            aria-label={t("sell")}
            aria-current={isActive("/sell") ? "page" : undefined}
          >
            <span className="inline-flex size-(--control-compact) items-center justify-center rounded-xl bg-foreground text-background transition-colors hover:bg-foreground active:opacity-90">
              <Plus
                size={16}
                weight="bold"
                className="transition-colors text-background"
              />
            </span>
          </Link>

          {/* Chat - Opens messages drawer */}
          <button
            type="button"
            onClick={openMessages}
            className={tabItemClass(isActive("/chat"))}
            aria-label={`${t("chat")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
            aria-haspopup="dialog"
          >
            <span className="relative">
              <ChatCircle 
                size={20}
                weight={isActive("/chat") ? "fill" : "regular"}
                className={cn(
                  "transition-colors",
                  isActive("/chat") ? "text-foreground" : "text-muted-foreground"
                )} 
              />
              {unreadCount > 0 && (
                <CountBadge
                  count={unreadCount}
                  className="absolute -top-1 -right-1.5 h-3.5 min-w-3.5 bg-notification px-0.5 text-2xs text-primary-foreground"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className={cn(
              "text-2xs font-medium leading-none tracking-tight",
              isActive("/chat") ? "text-foreground" : "text-muted-foreground"
            )}>{t("chat")}</span>
          </button>

          {/* Profile - Authenticated opens account drawer; guest opens auth drawer */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                openAccount()
                return
              }
              openAuth({ mode: "login", entrypoint: "profile_tab" })
            }}
            className={tabItemClass(isProfileActive)}
            aria-label={t("profile")}
            aria-haspopup="dialog"
            aria-expanded={drawerState.account.open || drawerState.auth.open}
            data-testid="mobile-tab-profile"
          >
            <UserCircle
              size={20}
              weight={isProfileActive ? "fill" : "regular"}
              className={cn(
                "transition-colors",
                isProfileActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-2xs font-medium leading-none tracking-tight",
                isProfileActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("profile")}
            </span>
          </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
