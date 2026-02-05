"use client"

import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { MagnifyingGlass, ArrowLeft } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
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
  activeSlug,
  backHref = "/categories",
  onBack,
  subcategories = [],
  onSubcategoryClick,
  locale,
  hideActions = false,
}: ContextualHeaderProps) {
  const tCommon = useTranslations("Common")
  const tCategories = useTranslations("Categories")

  return (
    <div className="md:hidden bg-background pt-safe">
      <div className="flex items-center justify-between px-3 h-12 border-b border-border">
        <div className="flex items-center">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="size-11 flex items-center justify-center rounded-full -ml-1 tap-transparent active:bg-active transition-colors"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" weight="bold" />
            </button>
          ) : (
            <Link
              href={backHref}
              className="size-11 flex items-center justify-center rounded-full -ml-1 tap-transparent active:bg-active transition-colors"
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
              className="size-11 flex items-center justify-center rounded-full tap-transparent active:bg-active transition-colors"
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
        <div className="bg-background border-b border-border">
          <div className="px-inset py-1.5 overflow-x-auto no-scrollbar">
            <div className="flex items-start gap-1">
              {subcategories.map((cat) => {
                const isActive = !!activeSlug && cat.slug === activeSlug

                return (
                  <CategoryCircle
                    key={cat.id}
                    category={cat}
                    onClick={() => onSubcategoryClick?.(cat)}
                    active={isActive}
                    labelPlacement="inside"
                    circleClassName="size-(--spacing-category-circle)"
                    fallbackIconSize={24}
                    fallbackIconWeight="duotone"
                    variant="colorful"
                    label={tCategories("shortName", {
                      slug: getCategorySlugKey(cat.slug),
                      name: getCategoryName(cat, locale),
                    })}
                    className="flex-none w-(--spacing-category-item-lg) tap-transparent"
                    insideLabelClassName={cn(
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
