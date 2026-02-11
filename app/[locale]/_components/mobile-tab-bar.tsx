"use client"

import { useEffect, useState } from "react"
import { House, SquaresFour, ChatCircle, UserCircle, Plus } from "@phosphor-icons/react"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { useMessages } from "@/components/providers/message-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav"
import { useAuthOptional } from "@/components/providers/auth-state-manager"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  const rawSegments = pathname.split("/").filter(Boolean)
  const pathSegments = (() => {
    const segments = [...rawSegments]
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return segments
  })()
  const knownRoutes = ["categories", "cart", "checkout", "account", "chat", "sell", "help", "auth", "search", "admin", "dashboard", "plans", "wishlist", "orders", "settings", "notifications", "assistant"]
  // /{username}/{slug-or-id} pattern: exactly 2 segments AND first segment is not a known route
  const firstSegment = pathSegments.at(0)
  const isProductPage = (pathSegments.length === 2 && !!firstSegment && !knownRoutes.includes(firstSegment))
  // Cart page has its own sticky footer
  const isCartPage = firstSegment === "cart"
  // Assistant page has its own chat input
  const isAssistantPage = firstSegment === "assistant"

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const iconClass = (active: boolean) =>
    cn("transition-colors", active ? "text-nav-active" : "text-nav-inactive")

  const isHomeActive = pathname === "/"
  const isCategoriesActive = isActive("/categories") || Boolean(categoryDrawer?.isOpen)
  const isSellActive = isActive("/sell")
  const isChatActive = isActive("/chat") || drawerState.messages.open
  const chatAriaLabel = unreadCount > 0 ? `${t("chat")} (${unreadCount})` : t("chat")
  const isCategoryDrawerEnabled = Boolean(categoryDrawer)
  const categoryTriggerA11yProps = isCategoryDrawerEnabled
    ? { "aria-haspopup": "dialog" as const, "aria-expanded": categoryDrawer?.isOpen }
    : {}

  const tabItemOuterBase = cn(
    "flex h-full min-h-(--control-default) w-full items-center justify-center rounded-lg px-1",
    "tap-transparent transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
  )

  const tabItemOuterClass = (active: boolean) =>
    cn(
      tabItemOuterBase,
      active ? "text-nav-active" : "text-nav-inactive hover:bg-hover active:bg-active"
    )

  const tabItemInnerBase = "flex w-full flex-col items-center justify-center gap-0.5"

  const tabLabelClass = (active: boolean) =>
    cn(
      "text-xs leading-tight tracking-normal",
      active ? "font-semibold text-nav-active" : "font-medium text-nav-inactive"
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
        <Card
          data-testid="mobile-tab-bar-dock"
          className="pointer-events-auto w-full rounded-none border-x-0 border-b-0 border-t border-border-subtle bg-surface-elevated shadow-none"
        >
          <CardContent className="px-1 pt-0 pb-safe">
            <div className="grid h-(--spacing-bottom-nav) grid-cols-5 items-stretch gap-0.5">
              {/* Home */}
              <Link
                href="/"
                prefetch={true}
                className={tabItemOuterClass(isHomeActive)}
                aria-label={t("home")}
                aria-current={isHomeActive ? "page" : undefined}
              >
                <span className={tabItemInnerBase}>
                  <House
                    size={21}
                    weight={isHomeActive ? "fill" : "regular"}
                    className={iconClass(isHomeActive)}
                  />
                  <span className={tabLabelClass(isHomeActive)}>{t("home")}</span>
                </span>
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
                className={tabItemOuterClass(isCategoriesActive)}
                aria-label={t("categories")}
                {...categoryTriggerA11yProps}
              >
                <span className={tabItemInnerBase}>
                  <SquaresFour
                    size={21}
                    weight={isCategoriesActive ? "fill" : "regular"}
                    className={iconClass(isCategoriesActive)}
                  />
                  <span className={tabLabelClass(isCategoriesActive)}>{t("categories")}</span>
                </span>
              </button>

              {/* Sell */}
              <Link
                href="/sell"
                prefetch={true}
                className={tabItemOuterClass(isSellActive)}
                aria-label={t("sell")}
                aria-current={isSellActive ? "page" : undefined}
                data-testid="mobile-tab-sell"
              >
                <span className={tabItemInnerBase}>
                  <span
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-full border transition-colors",
                      isSellActive
                        ? "border-nav-active bg-nav-active text-background"
                        : "border-border-subtle bg-background text-nav-inactive"
                    )}
                  >
                    <Plus
                      size={18}
                      weight="bold"
                      className={cn(
                        "transition-colors",
                        isSellActive ? "text-background" : "text-nav-inactive"
                      )}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none block h-4 select-none"
                  />
                </span>
              </Link>

              {/* Chat - Opens messages drawer */}
              <button
                type="button"
                onClick={openMessages}
                className={tabItemOuterClass(isChatActive)}
                aria-label={chatAriaLabel}
                aria-haspopup="dialog"
                aria-expanded={drawerState.messages.open}
                data-testid="mobile-tab-chat"
              >
                <span className={tabItemInnerBase}>
                  <span className="relative">
                    <ChatCircle
                      size={21}
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
                  <span className={tabLabelClass(isChatActive)}>{t("chat")}</span>
                </span>
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
                className={tabItemOuterClass(isProfileActive)}
                aria-label={t("profile")}
                aria-haspopup="dialog"
                aria-expanded={drawerState.account.open || drawerState.auth.open}
                data-testid="mobile-tab-profile"
              >
                <span className={tabItemInnerBase}>
                  <UserCircle
                    size={21}
                    weight={isProfileActive ? "fill" : "regular"}
                    className={iconClass(isProfileActive)}
                  />
                  <span className={tabLabelClass(isProfileActive)}>{t("profile")}</span>
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </nav>
    </>
  )
}
