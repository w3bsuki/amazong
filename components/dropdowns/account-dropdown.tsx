"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { User } from "@supabase/supabase-js"
import { Bell, ChevronDown as CaretDown, ChevronRight as CaretRight, MessageCircle as ChatCircle, Settings as Gear, Package, LogOut as SignOut, LoaderCircle as SpinnerGap, Store as Storefront, CircleUser as UserCircle } from "lucide-react";

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"
import { AccountDropdownMenu } from "@/components/shared/account-menu-items"
import { HeaderDropdown } from "@/components/shared/header-dropdown"
import { HeaderIconTrigger } from "@/components/shared/header-icon-trigger"

interface AccountDropdownProps {
  user: User | null
  variant?: "icon" | "full"
  className?: string
  /** Notification count to display as badge on avatar */
  notificationCount?: number
}

export function AccountDropdown({ user, variant = "icon", notificationCount = 0, className }: AccountDropdownProps) {
  const t = useTranslations("Header")
  const tAccount = useTranslations("Account")
  const tAccountDrawer = useTranslations("AccountDrawer")
  const tNotifications = useTranslations("NotificationsDropdown")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const notificationSuffix =
    notificationCount > 0
      ? ` (${notificationCount} ${tNotifications("title").toLowerCase()})`
      : ""

  // For non-authenticated users with icon variant, show a simple Sign In link
  if (!user && variant === "icon") {
    return (
      <Button
        asChild
        variant="header-ghost"
        className={cn("h-10 px-3 text-sm font-medium", className)}
      >
        <Link href="/auth/login">
          {t("signIn")}
        </Link>
      </Button>
    )
  }

  const displayName = user ? (user.user_metadata?.full_name || user.email?.split("@")[0] || "User") : t("signIn")
  const menuItems = user
    ? [
        {
          href: "/account/notifications",
          icon: Bell,
          label: tNotifications("title"),
          badgeCount: notificationCount,
        },
        {
          href: "/account/orders",
          icon: Package,
          label: tAccount("header.orders"),
        },
        {
          href: "/account/sales",
          icon: Storefront,
          label: tAccount("header.sales"),
        },
        {
          href: "/chat",
          icon: ChatCircle,
          label: t("messages"),
        },
        {
          href: "/account/settings",
          icon: Gear,
          label: tAccountDrawer("settings"),
        },
      ]
    : []

  const triggerContent = variant === "full" ? (
    <div
      className={cn(
        "h-11 px-3 text-sm font-semibold leading-none rounded-md text-header-text hover:bg-header-hover active:bg-header-active flex items-center cursor-pointer gap-1 tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        {/* Avatar with notification badge */}
        <div className="relative flex items-center justify-center text-header-text-muted">
          <UserCircle className="size-7" />
          {notificationCount > 0 && (
            <CountBadge
              count={notificationCount}
              className="absolute -top-0.5 -right-0.5 bg-notification text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex flex-col items-start leading-none gap-0.5">
          <span className="text-xs text-header-text-muted font-normal">
            {t("hello")}
          </span>
          <span className="text-sm font-bold truncate max-w-24 lg:max-w-36">
            {displayName}
          </span>
        </div>
      </div>
      {/* Dropdown arrow indicator */}
      <CaretDown className="size-3 text-header-text-muted ml-0.5" aria-hidden="true" />
    </div>
  ) : (
    <HeaderIconTrigger
      icon={<UserCircle />}
      badgeCount={notificationCount}
      bordered={false}
      className={className}
      badgeClassName="absolute -top-0.5 -right-0.5 bg-notification text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
    />
  )

  // For authenticated users OR full variant, show the dropdown
  return (
    <HeaderDropdown
      triggerHref={user ? "/account" : "/auth/login"}
      ariaLabel={`${t("hello")}, ${user?.email?.split("@")[0] || t("signIn")}. ${t("accountAndLists")}${notificationSuffix}`}
      trigger={triggerContent}
      widthClassName="w-56"
      align={variant === "full" ? "start" : "end"}
    >
        {!user ? (
          <div className="p-3">
            <Button asChild className="w-full bg-primary hover:bg-interactive-hover text-primary-foreground">
              <Link href="/auth/login">
                {t("signIn")}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t("newCustomer")} <Link href="/auth/sign-up" className="text-primary hover:underline focus-visible:outline-none focus-visible:underline">{t("startHere")}</Link>
            </p>
          </div>
        ) : (
          <>
            {/* User info */}
            <div className="px-3 py-2.5 border-b border-border bg-surface-subtle">
              <p className="text-sm font-medium text-foreground truncate">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>

            {/* Navigation links */}
            <AccountDropdownMenu items={menuItems} ariaLabel={t("accountAndLists")} />

            {/* Account link */}
            <div className="border-t border-border py-1">
              <Link href="/account" className={cn("flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent active:bg-active focus-visible:bg-accent focus-visible:outline-none motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none", "justify-between")}>
                <span>{tAccount("header.myAccount")}</span>
                <CaretRight size={14} className="text-muted-foreground" />
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-border p-2">
              <form action="/api/auth/sign-out" method="post" onSubmit={() => setIsSigningOut(true)}>
                <Button
                  type="submit"
                  variant="ghost"
                  disabled={isSigningOut}
                  className="w-full h-8 justify-start gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {isSigningOut ? (
                    <SpinnerGap size={16} className="animate-spin" />
                  ) : (
                    <SignOut size={16} />
                  )}
                  {t("signOut")}
                </Button>
              </form>
            </div>
          </>
        )}
    </HeaderDropdown>
  )
}
