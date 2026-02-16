"use client"

import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { MagnifyingGlass, ArrowLeft } from "@/lib/icons/phosphor"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { buildSearchHref } from "@/components/shared/search/overlay/search-context"
import type { ContextualHeaderProps } from "../types"

/**
 * Mobile Contextual Header
 * 
 * Category browsing header with:
 * - Back button + Category title + Search/Cart actions.
 * 
 * Category scope pills are rendered by route content below the header.
 * 
 * Used for: Category browsing (mobile only)
 */
export function MobileContextualHeader({
  title,
  activeSlug,
  backHref = "/categories",
  onBack,
  hideActions = false,
}: ContextualHeaderProps) {
  const tCommon = useTranslations("Common")
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
              className="flex size-(--control-default) -ml-1 items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" weight="bold" />
            </button>
          ) : (
            <Link
              href={backHref}
              className="flex size-(--control-default) -ml-1 items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
              className="flex size-(--control-default) items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label={tCommon("search")}
            >
              <MagnifyingGlass className="size-6" weight="regular" />
            </Link>
            <MobileWishlistButton />
            <MobileCartDropdown />
          </div>
        )}
      </div>
    </div>
  )
}
