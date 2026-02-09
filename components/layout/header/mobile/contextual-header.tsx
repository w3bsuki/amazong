"use client"

import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { MagnifyingGlass, ArrowLeft } from "@phosphor-icons/react"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { buildSearchHref } from "@/components/shared/search/overlay/search-context"
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
  const pathname = usePathname()
  const pathCategorySlug = pathname.match(/\/categories\/([^/?#]+)/)?.[1] ?? null
  const effectiveCategorySlug = activeSlug ?? pathCategorySlug
  const searchHref = buildSearchHref({
    context: {
      categorySlug: effectiveCategorySlug,
      source: "contextual-header",
    },
  })

  return (
    <div className="bg-background pt-safe md:hidden">
      <div className="flex h-(--control-primary) items-center justify-between border-b border-border-subtle px-2.5">
        <div className="flex items-center">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="size-(--control-default) -ml-1 flex items-center justify-center rounded-full tap-transparent transition-colors active:bg-active"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" weight="bold" />
            </button>
          ) : (
            <Link
              href={backHref}
              className="size-(--control-default) -ml-1 flex items-center justify-center rounded-full tap-transparent transition-colors active:bg-active"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" weight="bold" />
            </Link>
          )}
          <h1 className="ml-1 max-w-48 truncate text-base font-semibold text-foreground">
            {title}
          </h1>
        </div>
        {!hideActions && (
          <div className="flex items-center gap-1">
            <Link
              href={searchHref}
              className="size-(--control-default) flex items-center justify-center rounded-full tap-transparent transition-colors active:bg-active"
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
        <div className="border-b border-border-subtle bg-background">
          <div className="overflow-x-auto px-inset py-1.5 no-scrollbar">
            <div className="flex items-start gap-1.5">
              {subcategories.map((cat) => {
                const isActive = !!activeSlug && cat.slug === activeSlug

                return (
                  <CategoryCircle
                    key={cat.id}
                    category={cat}
                    onClick={() => onSubcategoryClick?.(cat)}
                    active={isActive}
                    labelPlacement="below"
                    circleClassName="size-(--spacing-category-circle)"
                    fallbackIconSize={24}
                    fallbackIconWeight="bold"
                    variant="rail"
                    label={tCategories("shortName", {
                      slug: getCategorySlugKey(cat.slug),
                      name: getCategoryName(cat, locale),
                    })}
                    className="flex-none w-(--spacing-category-item-nav) tap-transparent"
                    labelClassName={cn(
                      "truncate",
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
