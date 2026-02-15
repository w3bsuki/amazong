"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Compass, House, ChatCircleDots, UserCircle, Plus } from "@/lib/icons/phosphor"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MobileBottomNavActiveIndicator,
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

function getTabIconWeight(isActive: boolean): "bold" | "regular" {
  return isActive ? "bold" : "regular"
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
    "size-(--size-icon-header) motion-safe:transition-all motion-safe:duration-fast"

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
    setProfileIdentity({
      displayName: fallbackDisplayName,
      avatarUrl: null,
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
          avatarUrl: getStringValue(data?.avatar_url),
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
        <>
          <House weight={getTabIconWeight(isHomeActive)} className={iconClass} />
          <MobileBottomNavActiveIndicator state={isHomeActive ? "active" : "inactive"} />
        </>
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
        <>
          <Compass weight={getTabIconWeight(isCategoriesActive)} className={iconClass} />
          <MobileBottomNavActiveIndicator state={isCategoriesActive ? "active" : "inactive"} />
        </>
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
        >
          <Plus weight="bold" className="size-(--size-icon-header)" />
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
        <>
          <span className="relative">
            <ChatCircleDots weight={getTabIconWeight(isChatActive)} className={iconClass} />
            {unreadCount > 0 && (
              <CountBadge
                count={unreadCount}
                className="absolute -top-1.5 -right-2.5 h-4 min-w-4 bg-notification px-0.5 text-2xs text-primary-foreground ring-2 ring-surface-glass"
                aria-hidden="true"
              />
            )}
          </span>
          <MobileBottomNavActiveIndicator state={isChatActive ? "active" : "inactive"} />
        </>
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
        <>
          {isAuthenticated && resolvedProfileAvatar ? (
            <UserAvatar
              name={resolvedProfileName}
              avatarUrl={resolvedProfileAvatar}
              size="sm"
              className={cn(
                "size-7 rounded-full ring-2 motion-safe:transition-all motion-safe:duration-fast",
                isProfileActive ? "ring-primary" : "ring-transparent"
              )}
              fallbackClassName="bg-muted text-2xs font-semibold text-muted-foreground"
            />
          ) : (
            <Avatar
              className={cn(
                "size-7 ring-2 motion-safe:transition-all motion-safe:duration-fast",
                isProfileActive ? "ring-primary" : "ring-transparent"
              )}
            >
              <AvatarFallback className="bg-muted text-muted-foreground">
                <UserCircle
                  weight={getTabIconWeight(isProfileActive)}
                  className="size-5"
                />
              </AvatarFallback>
            </Avatar>
          )}
          <MobileBottomNavActiveIndicator state={isProfileActive ? "active" : "inactive"} />
        </>
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
                    <Link href={tab.href} prefetch={true}>
                      {tab.icon}
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
                    {tab.icon}
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
