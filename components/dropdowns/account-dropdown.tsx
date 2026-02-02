"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { SpinnerGap, UserCircle, Package, Storefront, ChatCircle, Gear, SignOut, CaretRight, CaretDown, Bell } from "@phosphor-icons/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"

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

  // For non-authenticated users with icon variant, show a simple Sign In link
  if (!user && variant === "icon") {
    return (
      <Link href="/auth/login">
        <Button
          variant="header-ghost"
          className={cn("h-10 px-3 text-sm font-medium", className)}
        >
          {t("signIn")}
        </Button>
      </Link>
    )
  }

  const displayName = user ? (user.user_metadata?.full_name || user.email?.split("@")[0] || "User") : t("signIn")

  const triggerContent = variant === "full" ? (
    <div
      className={cn(
        "h-11 px-3 text-sm font-semibold leading-none rounded-md text-header-text hover:bg-header-hover transition-all flex items-center cursor-pointer gap-1",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        {/* Avatar with notification badge */}
        <div className="relative flex items-center justify-center text-header-text-muted">
          <UserCircle weight="fill" className="size-7" />
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
      <CaretDown weight="bold" className="size-3 text-header-text-muted ml-0.5" />
    </div>
  ) : (
    <div
      className={cn("inline-flex items-center justify-center rounded-md text-header-text hover:bg-header-hover relative size-11 [&_svg]:size-6 cursor-pointer transition-colors", className)}
    >
      <UserCircle weight="fill" />
      {notificationCount > 0 && (
        <CountBadge
          count={notificationCount}
          className="absolute -top-0.5 -right-0.5 bg-notification text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
          aria-hidden="true"
        />
      )}
    </div>
  )

  // For authenticated users OR full variant, show the dropdown
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={user ? "/account" : "/auth/login"}
          className="block rounded-md outline-none focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`${t("hello")}, ${user?.email?.split("@")[0] || t("signIn")}. ${t("accountAndLists")}${notificationCount > 0 ? ` (${notificationCount} ${tNotifications("title").toLowerCase()})` : ""}`}
        >
          {triggerContent}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-56 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-dropdown"
        align={variant === "full" ? "start" : "end"}
        sideOffset={8}
        collisionPadding={10}
      >
        {!user ? (
          <div className="p-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-interactive-hover text-primary-foreground">
                {t("signIn")}
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t("newCustomer")} <Link href="/auth/sign-up" className="text-primary hover:underline">{t("startHere")}</Link>
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
            <nav className="py-1">
              {/* Notifications link with badge */}
              <Link href="/account/notifications" className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent">
                <span className="flex items-center gap-2.5">
                  <Bell size={16} weight="regular" className="text-muted-foreground" />
                  {tNotifications("title")}
                </span>
                {notificationCount > 0 && (
                  <span className="text-2xs bg-notification text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link href="/account/orders" className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Package size={16} weight="regular" className="text-muted-foreground" />
                {tAccount("header.orders")}
              </Link>
              <Link href="/account/sales" className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Storefront size={16} weight="regular" className="text-muted-foreground" />
                {tAccount("header.sales")}
              </Link>
              <Link href="/chat" className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <ChatCircle size={16} weight="regular" className="text-muted-foreground" />
                {t("messages")}
              </Link>
              <Link href="/account/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Gear size={16} weight="regular" className="text-muted-foreground" />
                {tAccountDrawer("settings")}
              </Link>
            </nav>

            {/* Account link */}
            <div className="border-t border-border py-1">
              <Link href="/account" className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent">
                <span>{tAccount("header.myAccount")}</span>
                <CaretRight size={14} weight="regular" className="text-muted-foreground" />
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
                    <SignOut size={16} weight="regular" />
                  )}
                  {t("signOut")}
                </Button>
              </form>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
