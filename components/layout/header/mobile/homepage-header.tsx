"use client"

import { SidebarMenuV2 as SidebarMenu } from "@/components/layout/sidebar/sidebar-menu-v2"
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
 * Category navigation moved to CategoryCirclesSimple below header,
 * following the Instagram Stories pattern for familiar mobile UX.
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
    <div className="md:hidden bg-background/95 backdrop-blur-md pt-safe">
      <div className="h-12 px-1 flex items-center">
        <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
        <Link href="/" className="shrink-0 -ml-1">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "flex-1 min-w-0 flex items-center gap-1.5 h-9 ml-2 px-3 rounded-full",
            "bg-surface-subtle border border-border/30",
            "text-muted-foreground text-sm text-left",
            "active:bg-active transition-colors"
          )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <MagnifyingGlass size={16} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal text-xs">{searchPlaceholder}</span>
        </button>
        <div className="flex items-center shrink-0 -mr-1">
          <div className="-mr-1"><MobileWishlistButton /></div>
          <div className="-ml-1"><MobileCartDropdown /></div>
        </div>
      </div>
    </div>
  )
}
