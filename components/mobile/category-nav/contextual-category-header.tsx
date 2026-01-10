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
  /** Optional back handler for instant (non-navigation) flows */
  onBack?: () => void
  /** Current locale for i18n */
  locale: string
  /** Show search button (default: true) */
  showSearch?: boolean
  /** Whether the header is sticky (default: true). */
  sticky?: boolean
  /** Additional CSS classes */
  className?: string
}

export function ContextualCategoryHeader({
  title,
  backHref,
  onBack,
  locale,
  showSearch = true,
  sticky = true,
  className,
}: ContextualCategoryHeaderProps) {
  return (
    <header
      className={cn(
        sticky && "sticky top-0 z-50",
        "bg-background", // Treido: No border, blends with circles below
        className
      )}
      data-contextual-header
    >
      {/* Treido: 48px height standard */}
      <div className="pt-safe-top">
        <div className="flex items-center justify-between px-3 h-12 border-b border-border/40">
          <div className="flex items-center">
            {/* Back button - 36px touch area */}
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 tap-highlight-transparent active:bg-muted transition-colors"
                aria-label={locale === "bg" ? "Назад" : "Back"}
              >
                <ArrowLeft className="size-6" weight="bold" />
              </button>
            ) : (
              <Link
                href={backHref}
                className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 tap-highlight-transparent active:bg-muted transition-colors"
                aria-label={locale === "bg" ? "Назад" : "Back"}
              >
                <ArrowLeft className="size-6" weight="bold" />
              </Link>
            )}

            {/* Category title - truncated, max-width */}
            <h1 className="text-base font-bold text-foreground ml-1 truncate max-w-48">
              {title}
            </h1>
          </div>

          {/* Actions - right aligned */}
          <div className="flex items-center gap-1">
            {showSearch && (
              <Link
                href="/search"
                className="w-9 h-9 flex items-center justify-center rounded-full tap-highlight-transparent active:bg-muted transition-colors"
                aria-label={locale === "bg" ? "Търсене" : "Search"}
              >
                <MagnifyingGlass className="size-6" weight="regular" />
              </Link>
            )}
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}

export type { ContextualCategoryHeaderProps }
