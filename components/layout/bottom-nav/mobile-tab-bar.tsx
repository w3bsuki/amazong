"use client"

import { type ReactNode, useEffect, useState } from "react"
import { House, LayoutGrid, MessageCircle, Plus } from "lucide-react"

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  MobileBottomNavCoreAction,
  MobileBottomNavDock,
  MobileBottomNavIndicator,
  MobileBottomNavItem,
  MobileBottomNavLabel,
  MobileBottomNavList,
  MobileBottomNavRoot,
} from "@/components/mobile/chrome/mobile-bottom-nav"
import { useTranslations } from "next-intl"
import { useMessages } from "@/components/providers/message-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav/category-drawer-context"
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { useNotificationCount } from "@/hooks/use-notification-count"
import {
  getMobileTabBarRouteState,
  isMobileTabPathActive,
} from "@/lib/navigation/mobile-tab-bar"

type TabKind = "link" | "button"
type TabEmphasis = "default" | "core"

interface MobileTabItem {
  key: "home" | "categories" | "sell" | "chat" | "profile"
  kind: TabKind
  emphasis: TabEmphasis
  href?: string | undefined
  onClick?: (() => void) | undefined
  active: boolean
  label: string
  icon: ReactNode
  testId?: string | undefined
  ariaCurrent?: "page" | undefined
  ariaHasPopup?: "dialog" | undefined
  ariaExpanded?: boolean | undefined
}

function getStringValue(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function getFallbackProfileName(user: {
  email?: string | null
  user_metadata?: Record<string, unknown>
} | null): string {
  if (!user) return "User"

  const metadata = user.user_metadata ?? {}
  const fullName = getStringValue(metadata.full_name)
  if (fullName) return fullName

  const name = getStringValue(metadata.name)
  if (name) return name

  const email = getStringValue(user.email)
  if (email) {
    const [emailPrefix] = email.split("@")
    const prefix = getStringValue(emailPrefix)
    if (prefix) return prefix
  }

  return "User"
}

function getAvatarUrlFromAuthUser(user: { user_metadata?: Record<string, unknown> } | null): string | null {
  const metadata = user?.user_metadata ?? {}
  return (
    getStringValue(metadata.avatar_url) ??
    getStringValue(metadata.picture) ??
    getStringValue(metadata.avatar) ??
    getStringValue(metadata.avatarUrl)
  )
}

export function MobileTabBar() {
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

  // Notification badge for profile tab (orders, sales, ratings — not messages)
  const authUser = auth?.user ?? null
  const notificationCount = useNotificationCount(authUser)

  // Get drawer actions for chat/account/auth buttons
  const { openDrawer, activeDrawer } = useDrawer()

  const routeState = getMobileTabBarRouteState(pathname)

  const iconClass = "size-(--size-icon-tab-bar)"

  const isHomeActive = isMobileTabPathActive(routeState.normalizedPathname, "/")
  const isCategoriesActive =
    isMobileTabPathActive(routeState.normalizedPathname, "/categories") ||
    Boolean(categoryDrawer?.isOpen)
  const isSellActive = isMobileTabPathActive(routeState.normalizedPathname, "/sell")
  const isChatActive =
    isMobileTabPathActive(routeState.normalizedPathname, "/chat") ||
    activeDrawer === "messages"
  const chatAriaLabel = unreadCount > 0 ? `${t("chat")} (${unreadCount})` : t("chat")
  const isCategoryDrawerEnabled = Boolean(categoryDrawer)
  const categoryTriggerA11yProps = isCategoryDrawerEnabled
    ? { "aria-haspopup": "dialog" as const, "aria-expanded": categoryDrawer?.isOpen }
    : {}
  const isProfileActive =
    activeDrawer === "account" ||
    activeDrawer === "auth" ||
    isMobileTabPathActive(routeState.normalizedPathname, "/account")

  const isAuthenticated = Boolean(auth?.isAuthenticated)

  const resolvedProfileName = isAuthenticated ? getFallbackProfileName(authUser) : "User"
  const resolvedProfileAvatar = isAuthenticated ? getAvatarUrlFromAuthUser(authUser) : null
  const profileAvatarValue = isAuthenticated
    ? (resolvedProfileAvatar ?? `boring-avatar:marble:2:${authUser?.id ?? resolvedProfileName}`)
    : "boring-avatar:marble:1:guest"

  // Avoid SSR/hydration mismatches caused by client-only UI (drawers/portals).
  if (!mounted) return null

  // Notifications for profile tab (excludes messages — those are on chat tab)
  const profileBadgeCount = isAuthenticated ? notificationCount : 0

  const tabs: MobileTabItem[] = [
    {
      key: "home",
      kind: "link",
      emphasis: "default",
      href: "/",
      active: isHomeActive,
      label: t("home"),
      ariaCurrent: isHomeActive ? "page" : undefined,
      icon: (
        <House
          aria-hidden="true"
          className={iconClass}
          fill={isHomeActive ? "currentColor" : "none"}
          strokeWidth={isHomeActive ? 0 : 1.5}
        />
      ),
    },
    {
      key: "categories",
      kind: "button",
      emphasis: "default",
      active: isCategoriesActive,
      label: t("categories"),
      onClick: () => {
        if (categoryDrawer) {
          categoryDrawer.openRoot()
          return
        }
        router.push("/categories")
      },
      ...(categoryTriggerA11yProps["aria-haspopup"]
        ? {
          ariaHasPopup: categoryTriggerA11yProps["aria-haspopup"],
          ariaExpanded: categoryTriggerA11yProps["aria-expanded"],
        }
        : {}),
      icon: (
        <LayoutGrid
          aria-hidden="true"
          className={iconClass}
          fill={isCategoriesActive ? "currentColor" : "none"}
          strokeWidth={isCategoriesActive ? 0 : 1.5}
        />
      ),
    },
    {
      key: "sell",
      kind: "link",
      emphasis: "core",
      href: "/sell",
      active: isSellActive,
      label: t("sell"),
      testId: "mobile-tab-sell",
      ariaCurrent: isSellActive ? "page" : undefined,
      icon: (
        <MobileBottomNavCoreAction data-testid="mobile-tab-sell-core">
          <Plus strokeWidth={2.5} className="size-(--size-icon)" />
        </MobileBottomNavCoreAction>
      ),
    },
    {
      key: "chat",
      kind: "button",
      emphasis: "default",
      active: isChatActive,
      label: chatAriaLabel,
      testId: "mobile-tab-chat",
      onClick: () => openDrawer("messages"),
      ariaHasPopup: "dialog",
      ariaExpanded: activeDrawer === "messages",
      icon: (
        <span className="relative">
          <MessageCircle
            aria-hidden="true"
            className={iconClass}
            fill={isChatActive ? "currentColor" : "none"}
            strokeWidth={isChatActive ? 0 : 1.5}
          />
          {unreadCount > 0 && (
            <CountBadge
              count={unreadCount}
              className="absolute -top-1.5 -right-2.5 h-4 min-w-4 bg-notification px-0.5 text-2xs text-primary-foreground ring-2 ring-background"
              aria-hidden="true"
            />
          )}
        </span>
      ),
    },
    {
      key: "profile",
      kind: "button",
      emphasis: "default",
      active: isProfileActive,
      label: t("profile"),
      testId: "mobile-tab-profile",
      onClick: () => {
        if (isAuthenticated) {
          openDrawer("account")
          return
        }
        openDrawer("auth", { mode: "login", entrypoint: "profile_tab" })
      },
      ariaHasPopup: "dialog",
      ariaExpanded: activeDrawer === "account" || activeDrawer === "auth",
      icon: (
        <span className="relative">
          <UserAvatar
            name={resolvedProfileName}
            avatarUrl={profileAvatarValue}
            size="sm"
            className={cn(
              "size-7 rounded-full transition-all",
              "ring-2 ring-offset-2 ring-offset-background",
              isProfileActive ? "ring-primary" : "ring-transparent"
            )}
            fallbackClassName="bg-muted text-2xs font-semibold text-muted-foreground"
          />
          {profileBadgeCount > 0 && (
            <CountBadge
              count={profileBadgeCount}
              className="absolute -top-1 -right-1.5 h-4 min-w-4 bg-notification text-primary-foreground ring-2 ring-background px-0.5 text-2xs"
              aria-hidden="true"
            />
          )}
        </span>
      ),
    },
  ]

  // Don't render on product pages - let the sticky buy box take over
  // Don't render on cart page - it has its own sticky checkout footer
  // Don't render on assistant page - it has its own chat input
  if (routeState.shouldHideTabBar) return null

  return (
    <MobileBottomNavRoot
      role="navigation"
      aria-label={t("mobileNavigation")}
      data-testid="mobile-tab-bar"
    >
      <MobileBottomNavDock data-testid="mobile-tab-bar-dock">
        <MobileBottomNavList>
          {tabs.map((tab) => {
            const state = tab.active ? "active" : "inactive"
            const showLabel = tab.key !== "sell"

            return (
              <li key={tab.key} className="h-full">
                {tab.kind === "link" && tab.href ? (
                  <MobileBottomNavItem
                    asChild
                    state={state}
                    emphasis={tab.emphasis}
                    className="h-full"
                    aria-label={tab.label}
                    aria-current={tab.ariaCurrent}
                    data-testid={tab.testId}
                  >
                    <Link href={tab.href} prefetch={false}>
                      {tab.emphasis !== "core" && <MobileBottomNavIndicator />}
                      <span className="relative z-10">{tab.icon}</span>
                      {showLabel && (
                        <MobileBottomNavLabel state={state}>
                          {tab.label}
                        </MobileBottomNavLabel>
                      )}
                    </Link>
                  </MobileBottomNavItem>
                ) : (
                  <MobileBottomNavItem
                    type="button"
                    state={state}
                    emphasis={tab.emphasis}
                    className="h-full"
                    onClick={tab.onClick}
                    aria-label={tab.label}
                    aria-haspopup={tab.ariaHasPopup}
                    aria-expanded={tab.ariaExpanded}
                    data-testid={tab.testId}
                  >
                    {tab.emphasis !== "core" && <MobileBottomNavIndicator />}
                    <span className="relative z-10">{tab.icon}</span>
                    {showLabel && (
                      <MobileBottomNavLabel state={state}>
                        {tab.label}
                      </MobileBottomNavLabel>
                    )}
                  </MobileBottomNavItem>
                )}
              </li>
            )
          })}
        </MobileBottomNavList>
      </MobileBottomNavDock>
    </MobileBottomNavRoot>
  )
}
