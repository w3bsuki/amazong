import { SidebarMenu } from "@/components/layout/sidebar/sidebar-menu"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { Search as MagnifyingGlass } from "lucide-react"

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
    <div className="z-40 border-b border-border bg-card md:hidden pt-safe">
      <div className="flex h-(--control-primary) items-center gap-2 px-2">
        {/* Left: hamburger + logo */}
        <SidebarMenu user={user} {...(userStats && { userStats })} />
        <Link
          href="/"
          className="shrink-0 rounded-sm tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <span className="text-lg font-extrabold tracking-tight text-foreground font-display">
            treido<span className="text-foreground">.</span>
          </span>
        </Link>

        {/* Center: inline search trigger (grows to fill) */}
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-left tap-transparent transition-colors duration-fast ease-smooth hover:bg-accent active:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
          data-testid="mobile-home-header-search-trigger"
        >
          <MagnifyingGlass size={14} className="shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
          <span className="truncate text-compact font-normal text-muted-foreground">{searchPlaceholder}</span>
        </button>

        {/* Right: wishlist + cart */}
        <div className="flex shrink-0 items-center gap-0.5">
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>
    </div>
  )
}
