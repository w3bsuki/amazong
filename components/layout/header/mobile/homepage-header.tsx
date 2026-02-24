"use client"

import { SidebarMenu } from "@/components/layout/sidebar/sidebar-menu"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { Search as MagnifyingGlass } from "lucide-react"

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
  userStats,
  onSearchOpen,
}: HomepageHeaderProps) {
  const tNav = useTranslations("Navigation")
  const searchPlaceholder = tNav("searchPlaceholderShort")

  return (
    <div className="bg-background pt-safe md:hidden">
      <div className="flex h-(--control-primary) items-center gap-2 border-b border-border-subtle px-2">
        <SidebarMenu
          user={user}
          {...(userStats && { userStats })}
        />
        <Link href="/" className="shrink-0 rounded-sm tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido<span className="text-primary">.</span></span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center">
          <div
            className={cn(
              "flex h-(--control-compact) w-full min-w-0 items-center gap-2 rounded-full bg-surface-subtle px-3",
              "text-left text-muted-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none",
              "hover:bg-hover",
            )}
          >
            <MagnifyingGlass size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />

            <button
              type="button"
              onClick={onSearchOpen}
              className="flex h-(--control-compact) min-w-0 flex-1 items-center text-left tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:text-foreground active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label={searchPlaceholder}
              aria-haspopup="dialog"
              data-testid="mobile-home-header-search-trigger"
            >
              <span className="truncate text-compact font-normal text-muted-foreground">
                {searchPlaceholder}
              </span>
            </button>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>
    </div>
  )
}
