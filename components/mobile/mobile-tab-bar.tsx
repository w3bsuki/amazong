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
  const activeTextClass = "text-foreground"
  const inactiveTextClass = "text-muted-foreground"
  const iconClass = (active: boolean) =>
    cn("transition-colors", active ? activeTextClass : inactiveTextClass)
  const isHomeActive = pathname === "/"
  const isCategoriesActive = isActive("/categories") || Boolean(categoryDrawer?.isOpen)
  const isSellActive = isActive("/sell")
  const isChatActive = isActive("/chat")
  const chatAriaLabel = unreadCount > 0 ? `${t("chat")} (${unreadCount})` : t("chat")

  const tabItemBase = cn(
    "flex min-h-(--control-default) w-full flex-col items-center justify-center gap-0.5 rounded-xl border border-transparent px-1.5 py-1",
    "tap-transparent transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
  )

  const tabItemClass = (active: boolean) =>
    cn(
      tabItemBase,
      active
        ? "bg-surface-subtle text-foreground"
        : "text-muted-foreground hover:bg-hover active:bg-active"
    )

  const tabLabelClass = (active: boolean) =>
    cn(
      "text-2xs font-medium leading-none tracking-tight",
      active ? activeTextClass : inactiveTextClass
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
        <div className="mx-auto max-w-screen-sm px-2">
          <div
            data-testid="mobile-tab-bar-dock"
            className="pointer-events-auto rounded-2xl border border-border-subtle bg-surface-elevated px-1 py-1 pb-safe-max-xs shadow-md"
          >
            <div className="grid grid-cols-5 items-end gap-0.5">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={tabItemClass(isHomeActive)}
            aria-label={t("home")}
            aria-current={isHomeActive ? "page" : undefined}
          >
            <House 
              size={20}
              weight={isHomeActive ? "fill" : "regular"}
              className={iconClass(isHomeActive)} 
            />
            <span className={cn(
              tabLabelClass(isHomeActive)
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
            className={tabItemClass(isCategoriesActive)}
            aria-label={t("categories")}
            aria-haspopup="dialog"
            aria-expanded={categoryDrawer?.isOpen}
          >
            <SquaresFour 
              size={20}
              weight={isCategoriesActive ? "fill" : "regular"}
              className={iconClass(isCategoriesActive)} 
            />
            <span className={cn(
              tabLabelClass(isCategoriesActive)
            )}>{t("categories")}</span>
          </button>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              tabItemBase,
              isSellActive
                ? "bg-surface-subtle text-foreground"
                : "text-muted-foreground hover:bg-hover active:bg-active"
            )}
            aria-label={t("sell")}
            aria-current={isSellActive ? "page" : undefined}
            data-testid="mobile-tab-sell"
          >
            <span
              className={cn(
                "inline-flex size-(--control-default) items-center justify-center rounded-full border transition-colors",
                isActive("/sell")
                  ? "border-foreground bg-foreground text-background"
                  : "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"
              )}
            >
              <Plus
                size={17}
                weight="bold"
                className={cn("transition-colors", isSellActive ? "text-background" : activeTextClass)}
              />
            </span>
          </Link>

          {/* Chat - Opens messages drawer */}
          <button
            type="button"
            onClick={openMessages}
            className={tabItemClass(isChatActive)}
            aria-label={chatAriaLabel}
            aria-haspopup="dialog"
          >
            <span className="relative">
              <ChatCircle 
                size={20}
                weight={isChatActive ? "fill" : "regular"}
                className={iconClass(isChatActive)} 
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
              tabLabelClass(isChatActive)
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
              className={iconClass(isProfileActive)}
            />
            <span
              className={cn(
                tabLabelClass(isProfileActive)
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
