"use client"

import {
  AccountDropdown,
  MessagesDropdown,
  WishlistDropdown,
} from "@/components/dropdowns"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { DesktopSearch } from "./desktop-search"
import { Button } from "@/components/ui/button"
import { Camera } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useNotificationCount } from "@/hooks/use-notification-count"
import type { BaseHeaderProps } from "../types"

/**
 * Desktop Standard Header
 * 
 * Production-ready desktop header with:
 * - Logo + Account (with notification badge + arrow) on left
 * - Search bar in center (dominant element)
 * - Messages, Wishlist, Cart, Sell CTA on right
 * 
 * Design: Subtle background tint + bottom border for visual containment
 * Pattern: Notification badge merged into Account avatar (saves icon slot)
 */
export function DesktopStandardHeader({
  user,
  locale,
}: BaseHeaderProps) {
  const t = useTranslations("Navigation")
  const notificationCount = useNotificationCount(user)

  return (
    <header className="hidden md:block bg-header-bg text-header-text border-b border-header-border">
      <div className="container h-16 flex items-center justify-between gap-6">
        {/* Left: Logo + Account (with notification badge) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-header-text">treido.</span>
          </Link>
          <div className="hidden lg:block">
            <AccountDropdown user={user} variant="full" notificationCount={notificationCount} />
          </div>
        </div>

        {/* Center: Search (dominant element) */}
        <div className="flex-1 max-w-2xl">
          <DesktopSearch />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              {/* Messages */}
              <MessagesDropdown user={user} />
              
              {/* Commerce: Wishlist + Cart */}
              <WishlistDropdown />
              <CartDropdown />
              
              {/* Primary CTA: Create Listing */}
              <Button variant="secondary" size="sm" className="ml-2" asChild>
                <Link href="/sell">
                  <Camera weight="regular" className="size-4" />
                  <span className="hidden xl:inline">{t("createListing")}</span>
                </Link>
              </Button>
              
              {/* Account on medium screens (when full variant is hidden) */}
              <div className="hidden md:block lg:hidden ml-1">
                <AccountDropdown user={user} notificationCount={notificationCount} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="header-ghost" size="sm" asChild>
                <Link href="/auth/login">{t("signIn")}</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/auth/sign-up">{t("register")}</Link>
              </Button>
              <CartDropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
