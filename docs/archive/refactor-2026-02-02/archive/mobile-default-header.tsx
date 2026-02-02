"use client"

import {
  NotificationsDropdown,
} from "@/components/dropdowns"
import { SidebarMenuV2 as SidebarMenu } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import type { DefaultHeaderProps } from "../types"

/**
 * Mobile Default Header
 * 
 * Standard mobile header with:
 * - Hamburger menu + Logo + Actions in top row
 * - Optional search button bar in second row
 * 
 * Used for: Search results, product pages (fallback), misc pages
 */
export function MobileDefaultHeader({
  user,
  categories = [],
  userStats,
  onSearchOpen,
  searchPlaceholder,
}: DefaultHeaderProps) {
  return (
    <div className="md:hidden bg-background backdrop-blur-md border-b border-border text-foreground pt-safe">
      <div className="h-12 px-1 flex items-center">
        <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
        <Link href="/" className="flex items-center shrink-0 -ml-1">
          <span className="text-lg font-extrabold tracking-tighter leading-none text-foreground">treido.</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center shrink-0 -mr-1">
          {user && <NotificationsDropdown user={user} />}
          <div className="-mr-1"><MobileWishlistButton /></div>
          <div className="-ml-1"><MobileCartDropdown /></div>
        </div>
      </div>
      <div className="px-1 pb-1.5">
        <button
          onClick={onSearchOpen}
          className={cn(
            "w-full flex items-center gap-2 h-10 px-3 rounded-md",
            "bg-surface-subtle border border-border",
            "text-muted-foreground text-sm text-left",
            "active:bg-active touch-action-manipulation tap-transparent"
          )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal">{searchPlaceholder}</span>
        </button>
      </div>
    </div>
  )
}
