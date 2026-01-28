"use client"

import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { getCategoryIcon } from "@/lib/category-icons"
import { getCategoryShortName } from "@/lib/category-display"
import { MagnifyingGlass, ArrowLeft } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { ContextualHeaderProps } from "../types"

/**
 * Mobile Contextual Header
 * 
 * Category browsing header with:
 * - Back button + Category title + Search/Cart actions
 * - Subcategory circles row for drilling down
 * 
 * Used for: Category browsing (mobile only)
 */
export function MobileContextualHeader({
  title,
  backHref = "/categories",
  onBack,
  subcategories = [],
  onSubcategoryClick,
  locale,
  hideActions = false,
}: ContextualHeaderProps) {
  const tCommon = useTranslations("Common")

  return (
    <div className="md:hidden bg-background pt-safe">
      <div className="flex items-center justify-between px-3 h-12 border-b border-border/50">
        <div className="flex items-center">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 tap-highlight-transparent active:bg-muted transition-colors"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" weight="bold" />
            </button>
          ) : (
            <Link
              href={backHref}
              className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 tap-highlight-transparent active:bg-muted transition-colors"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" weight="bold" />
            </Link>
          )}
          <h1 className="text-base font-bold text-foreground ml-1 truncate max-w-48">
            {title}
          </h1>
        </div>
        {!hideActions && (
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="w-9 h-9 flex items-center justify-center rounded-full tap-highlight-transparent active:bg-muted transition-colors"
              aria-label={tCommon("search")}
            >
              <MagnifyingGlass className="size-6" weight="regular" />
            </Link>
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        )}
      </div>
      {/* Subcategory circles */}
      {subcategories.length > 0 && (
        <div className="bg-background border-b border-border/50">
          <div className="px-4 py-3">
            <div className="flex items-start gap-3 overflow-x-auto no-scrollbar">
              {subcategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSubcategoryClick?.(cat)}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-category-item-mobile active:opacity-80 transition-opacity"
                >
                  <div className="size-14 rounded-full bg-surface-subtle border border-border/30 overflow-hidden flex items-center justify-center">
                    {getCategoryIcon(cat.slug, { size: 24, className: "text-muted-foreground" })}
                  </div>
                  <span className="text-2xs text-center text-muted-foreground font-medium leading-tight line-clamp-2">
                    {getCategoryShortName(cat, locale)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
