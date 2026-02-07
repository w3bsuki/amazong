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
 * - Hamburger + Logo + Inline search + Cart
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
    <div className="bg-background pt-safe md:hidden">
      <div className="flex h-(--control-primary) items-center px-2">
        <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
        <Link href="/" className="shrink-0 -ml-1">
          <span className="text-xl font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "ml-2 flex h-9 min-w-0 flex-1 items-center gap-1.5 rounded-full px-3",
            "bg-surface-subtle",
            "text-muted-foreground text-left",
            "transition-colors hover:bg-hover active:bg-active"
          )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <MagnifyingGlass size={16} weight="regular" className="shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate font-medium text-xs text-muted-foreground">{searchPlaceholder}</span>
        </button>
        <div className="flex shrink-0 items-center -space-x-1">
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>
    </div>
  )
}
