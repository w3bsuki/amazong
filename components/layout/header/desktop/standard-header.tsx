"use client"

import {
  AccountDropdown,
  MessagesDropdown,
  NotificationsDropdown,
  WishlistDropdown,
} from "@/components/dropdowns"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { DesktopSearch } from "@/components/desktop/desktop-search"
import { Button } from "@/components/ui/button"
import { Camera } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { BaseHeaderProps } from "../types"

/**
 * Desktop Standard Header
 * 
 * Standard desktop header with:
 * - Logo + Account dropdown on left
 * - Search bar in center
 * - Action buttons (wishlist, messages, notifications, create listing, cart) on right
 * 
 * Used for: All standard pages on desktop (homepage, categories, search, etc.)
 */
export function DesktopStandardHeader({
  user,
  locale,
}: BaseHeaderProps) {
  const t = useTranslations("Navigation")

  return (
    <div className="hidden md:block bg-header-bg text-header-text">
      <div className="container h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Account */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-header-text">treido.</span>
          </Link>
          <div className="hidden lg:block">
            <AccountDropdown user={user} variant="full" />
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl">
          <DesktopSearch />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5">
          {user ? (
            <>
              <WishlistDropdown />
              <MessagesDropdown user={user} />
              <NotificationsDropdown user={user} />
              <Link href="/sell" aria-label={t("createListing")}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover"
                >
                  <Camera weight="regular" />
                </Button>
              </Link>
              <div className="hidden md:block lg:hidden">
                <AccountDropdown user={user} />
              </div>
              <CartDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-header-text hover:bg-header-hover px-3 py-2 rounded-md transition-colors"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-sm font-medium bg-cta-secondary text-cta-secondary-text hover:bg-cta-secondary-hover px-4 py-2 rounded-md transition-colors"
              >
                {t("register")}
              </Link>
              <Link href="/sell" aria-label={t("createListing")}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover"
                >
                  <Camera weight="regular" />
                </Button>
              </Link>
              <CartDropdown />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
