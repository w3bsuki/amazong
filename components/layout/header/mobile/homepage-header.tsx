"use client"

import { SidebarMenu } from "@/components/layout/sidebar/sidebar-menu"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { HomepageHeaderProps } from "../types"

/**
 * Mobile Homepage Header (2026 Clean Pattern)
 * 
 * Minimal, content-focused header with:
 * - Hamburger + Logo + Inline search + Cart/Wishlist
 * 
 * Category navigation is rendered as calm chips below the header (see MobileHome).
 * 
 * Used for: Homepage (mobile only)
 */
export function MobileHomepageHeader({
  user,
  categories = [],
  userStats,
  onSearchOpen,
}: HomepageHeaderProps) {
  const tNav = useTranslations("Navigation")
  const searchPlaceholder = tNav("searchPlaceholderShort")

  return (
    <div className="md:hidden bg-background border-b border-border pt-safe">
      <div className="h-(--header-h-mobile) px-inset-md flex items-center">
        <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
        <Link href="/" className="shrink-0">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
        <button
          type="button"
          onClick={onSearchOpen}
            className={cn(
              "flex-1 min-w-0 flex items-center gap-2 h-(--spacing-touch) ml-2 px-2.5 rounded-full",
              "bg-surface-subtle border border-border-subtle",
              "text-muted-foreground text-sm text-left",
              "active:bg-active transition-colors"
            )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal text-sm">{searchPlaceholder}</span>
        </button>
        <div className="flex items-center shrink-0 -space-x-2">
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>
    </div>
  )
}
