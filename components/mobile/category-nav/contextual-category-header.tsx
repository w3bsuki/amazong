"use client"

import { Link } from "@/i18n/routing"
import { ArrowLeft, MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// Reuse existing header components - NO custom icons
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"

// =============================================================================
// CONTEXTUAL CATEGORY HEADER
//
// Compact header for category browsing (Vinted-style):
// - Back arrow + category title
// - Reuses existing MobileCartDropdown, MobileWishlistButton
// - Matches main header styling (bg-header-bg, text-header-text)
// - ~40px height (h-10)
// =============================================================================

interface ContextualCategoryHeaderProps {
  /** Category display name (localized) */
  title: string
  /** Where back arrow navigates (parent category or /categories) */
  backHref: string
  /** Current locale for i18n */
  locale: string
  /** Show search button (default: true) */
  showSearch?: boolean
  /** Additional CSS classes */
  className?: string
}

export function ContextualCategoryHeader({
  title,
  backHref,
  locale,
  showSearch = true,
  className,
}: ContextualCategoryHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "bg-background/95 backdrop-blur-md text-foreground border-b border-border/60 supports-[backdrop-filter]:bg-background/80", // Treido: Flat, blur only
        className
      )}
      data-contextual-header
    >
      <div className="flex items-center h-10 px-(--page-inset) gap-0">
        {/* Back button */}
        <Link
          href={backHref}
          className="flex items-center justify-center h-touch w-touch rounded-full hover:bg-header-hover active:bg-header-active touch-action-manipulation tap-transparent"
          aria-label={locale === "bg" ? "Назад" : "Back"}
        >
          <ArrowLeft size={20} weight="bold" />
        </Link>

        {/* Category title */}
        <h1 className="flex-1 text-base font-semibold tracking-tight truncate -ml-1">
          {title}
        </h1>

        {/* Actions */}
        <div className="flex items-center">
          {showSearch && (
            <Link
              href="/search"
              className="flex items-center justify-center size-10 rounded-md hover:bg-header-hover active:bg-header-active touch-action-manipulation tap-transparent"
              aria-label={locale === "bg" ? "Търсене" : "Search"}
            >
              <MagnifyingGlass size={22} weight="regular" />
            </Link>
          )}
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>
    </header>
  )
}

export type { ContextualCategoryHeaderProps }
