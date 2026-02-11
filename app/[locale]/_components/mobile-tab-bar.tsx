"use client"

import { type ReactNode, useEffect, useState } from "react"
import { House, SquaresFour, ChatCircleDots, UserCircle, Plus } from "@phosphor-icons/react"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MobileBottomNavCoreAction,
  MobileBottomNavDock,
  MobileBottomNavItem,
  MobileBottomNavList,
  MobileBottomNavRoot,
} from "@/components/ui/mobile-bottom-nav"
import { useTranslations } from "next-intl"
import { useMessages } from "@/components/providers/message-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav"
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { createClient } from "@/lib/supabase/client"
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

type ProfileIdentity = {
  displayName: string
  avatarUrl: string | null
}

const profileIdentityCache = new Map<string, ProfileIdentity>()

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

function getFallbackProfileAvatar(user: {
  user_metadata?: Record<string, unknown>
} | null): string | null {
  if (!user) return null

  const metadata = user.user_metadata ?? {}
  return (
    getStringValue(metadata.avatar_url) ??
    getStringValue(metadata.avatarUrl) ??
    getStringValue(metadata.picture) ??
    getStringValue(metadata.image)
  )
}

function getTabIconWeight(isActive: boolean): "fill" | "regular" {
  return isActive ? "fill" : "regular"
}

function getTabIconButtonClass(active: boolean, highlighted = false): string {
  return cn(
    "inline-flex size-(--control-compact) items-center justify-center rounded-full ring-1 ring-transparent",
    "motion-safe:transition-[background-color,color,ring-color,transform] motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
    "group-active:scale-[0.97]",
    active
      ? "bg-hover text-nav-active ring-border-subtle"
      : cn(
          "text-nav-inactive group-hover:bg-hover group-hover:text-nav-active group-active:bg-active",
          highlighted ? "text-nav-active ring-border-subtle" : ""
        )
  )
}

function getProfileAvatarClass(isActive: boolean): string {
  return cn("size-7", isActive ? "ring-1 ring-primary" : "ring-1 ring-border-subtle")
}

export function MobileTabBar() {
  const [mounted, setMounted] = useState(false)
  const [profileIdentity, setProfileIdentity] = useState<ProfileIdentity | null>(null)
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

  const routeState = getMobileTabBarRouteState(pathname)

  const iconClass =
    "size-(--size-icon) transition-colors motion-safe:duration-fast"

  const isHomeActive = isMobileTabPathActive(routeState.normalizedPathname, "/")
  const isCategoriesActive =
    isMobileTabPathActive(routeState.normalizedPathname, "/categories") ||
    Boolean(categoryDrawer?.isOpen)
  const isSellActive = isMobileTabPathActive(routeState.normalizedPathname, "/sell")
  const isChatActive =
    isMobileTabPathActive(routeState.normalizedPathname, "/chat") ||
    drawerState.messages.open
  const chatAriaLabel = unreadCount > 0 ? `${t("chat")} (${unreadCount})` : t("chat")
  const isCategoryDrawerEnabled = Boolean(categoryDrawer)
  const categoryTriggerA11yProps = isCategoryDrawerEnabled
    ? { "aria-haspopup": "dialog" as const, "aria-expanded": categoryDrawer?.isOpen }
    : {}
  const isProfileActive =
    drawerState.account.open ||
    drawerState.auth.open ||
    isMobileTabPathActive(routeState.normalizedPathname, "/account")

  const tabItemOuterBase = cn(
    "group flex h-full min-h-(--control-default) w-full items-center justify-center rounded-xl px-1",
    "tap-transparent transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
  )

  const tabItemOuterClass = (active: boolean) =>
    cn(tabItemOuterBase, active ? "text-nav-active" : "text-nav-inactive")

  const sellButtonClass = (active: boolean) =>
    cn(
      "ring-primary ring-offset-2 ring-offset-surface-elevated",
      active ? "ring-2" : "ring-1"
    )

  const authUser = auth?.user ?? null
  const isAuthenticated = Boolean(authUser)

  useEffect(() => {
    let cancelled = false

    if (!authUser?.id) {
      setProfileIdentity(null)
      return () => {
        cancelled = true
      }
    }

    const fallbackDisplayName = getFallbackProfileName(authUser)
    const fallbackAvatar = getFallbackProfileAvatar(authUser)
    setProfileIdentity({
      displayName: fallbackDisplayName,
      avatarUrl: fallbackAvatar,
    })

    const cachedIdentity = profileIdentityCache.get(authUser.id)
    if (cachedIdentity) {
      setProfileIdentity(cachedIdentity)
      return () => {
        cancelled = true
      }
    }

    const loadProfileIdentity = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name, full_name, avatar_url")
          .eq("id", authUser.id)
          .maybeSingle()

        if (cancelled || error) return

        const resolvedIdentity: ProfileIdentity = {
          displayName:
            getStringValue(data?.display_name) ??
            getStringValue(data?.full_name) ??
            fallbackDisplayName,
          avatarUrl: getStringValue(data?.avatar_url) ?? fallbackAvatar,
        }

        profileIdentityCache.set(authUser.id, resolvedIdentity)
        setProfileIdentity(resolvedIdentity)
      } catch {
        // Keep fallback avatar data when profile lookup fails.
      }
    }

    void loadProfileIdentity()

    return () => {
      cancelled = true
    }
  }, [authUser])

  const resolvedProfileName = profileIdentity?.displayName ?? "User"
  const resolvedProfileAvatar = profileIdentity?.avatarUrl ?? null

  // Avoid SSR/hydration mismatches caused by client-only UI (drawers/portals).
  if (!mounted) return null

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
          weight={getTabIconWeight(isHomeActive)}
          className={iconClass}
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
        <SquaresFour
          weight={getTabIconWeight(isCategoriesActive)}
          className={iconClass}
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
        <MobileBottomNavCoreAction
          state={isSellActive ? "active" : "inactive"}
          data-testid="mobile-tab-sell-core"
          className={sellButtonClass(isSellActive)}
        >
          <Plus
            weight="bold"
            className="size-(--size-icon) text-current transition-colors motion-safe:duration-fast"
          />
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
      onClick: openMessages,
      ariaHasPopup: "dialog",
      ariaExpanded: drawerState.messages.open,
      icon: (
        <span className="relative">
          <ChatCircleDots
            weight={getTabIconWeight(isChatActive)}
            className={iconClass}
          />
          {unreadCount > 0 && (
            <CountBadge
              count={unreadCount}
              className="absolute -top-1.5 -right-1.5 h-4 min-w-4 bg-notification px-0.5 text-2xs text-primary-foreground ring-2 ring-surface-elevated"
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
          openAccount()
          return
        }
        openAuth({ mode: "login", entrypoint: "profile_tab" })
      },
      ariaHasPopup: "dialog",
      ariaExpanded: drawerState.account.open || drawerState.auth.open,
      icon: (
        <span className="inline-flex size-(--control-compact) items-center justify-center rounded-full motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-(--ease-smooth) group-active:scale-[0.97]">
          {isAuthenticated ? (
            <UserAvatar
              name={resolvedProfileName}
              avatarUrl={resolvedProfileAvatar}
              size="sm"
              className={getProfileAvatarClass(isProfileActive)}
              fallbackClassName="bg-muted text-2xs font-semibold"
            />
          ) : (
            <Avatar className={cn("bg-muted", getProfileAvatarClass(isProfileActive))}>
              <AvatarFallback className="bg-muted text-muted-foreground">
                <UserCircle
                  weight="regular"
                  className="size-(--size-icon-sm)"
                />
              </AvatarFallback>
            </Avatar>
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
            const iconContent =
              tab.emphasis === "core" ? (
                tab.icon
              ) : (
                <span
                  className={getTabIconButtonClass(
                    tab.active,
                    tab.key === "chat" && unreadCount > 0
                  )}
                >
                  {tab.icon}
                </span>
              )

            return (
              <li key={tab.key} className="h-full">
                {tab.kind === "link" && tab.href ? (
                  <MobileBottomNavItem
                    asChild
                    state={state}
                    emphasis={tab.emphasis}
                    className={
                      tab.emphasis === "core"
                        ? tabItemOuterBase
                        : tabItemOuterClass(tab.active)
                    }
                    aria-label={tab.label}
                    aria-current={tab.ariaCurrent}
                    data-testid={tab.testId}
                  >
                    <Link href={tab.href} prefetch={true}>
                      {iconContent}
                    </Link>
                  </MobileBottomNavItem>
                ) : (
                  <MobileBottomNavItem
                    type="button"
                    state={state}
                    emphasis={tab.emphasis}
                    className={tabItemOuterClass(tab.active)}
                    onClick={tab.onClick}
                    aria-label={tab.label}
                    aria-haspopup={tab.ariaHasPopup}
                    aria-expanded={tab.ariaExpanded}
                    data-testid={tab.testId}
                  >
                    {iconContent}
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
