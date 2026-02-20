import { SidebarMenu } from "@/components/layout/sidebar/sidebar-menu"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { Search as MagnifyingGlass } from "lucide-react";

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
      <div className="flex h-(--control-primary) items-center gap-0.5 px-0">
        <SidebarMenu user={user} {...(userStats && { userStats })} triggerClassName="-mr-2" />
        <Link href="/" className="shrink-0 rounded-sm tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
          <span className="text-xl font-extrabold tracking-tight text-foreground">treido<span className="text-primary">.</span></span>
        </Link>
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "group ml-2 flex min-h-(--control-default) min-w-0 flex-1 items-center",
            "tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <span
            className={cn(
              "flex h-(--control-compact) w-full items-center gap-1.5 rounded-full px-3",
              "bg-surface-subtle border border-border-subtle text-left text-muted-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none",
              "group-hover:bg-hover group-hover:border-border group-active:bg-active"
            )}
          >
            <MagnifyingGlass size={16} className="shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-xs font-medium text-muted-foreground">{searchPlaceholder}</span>
          </span>
        </button>
        <div className="flex shrink-0 items-center -space-x-2">
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>
    </div>
  )
}
