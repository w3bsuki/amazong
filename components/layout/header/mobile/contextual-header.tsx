import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { ArrowLeft, Search as MagnifyingGlass } from "lucide-react";

import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
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
  titleClassName,
  activeSlug,
  backHref = "/categories",
  onBack,
  trailingActions,
  hideActions = false,
  expandTitle = false,
}: ContextualHeaderProps) {
  const tCommon = useTranslations("Common")
  const pathname = usePathname()
  const shouldRenderDefaultActions = !hideActions && !trailingActions

  const searchHref = shouldRenderDefaultActions
    ? buildSearchHref({
        context: {
          categorySlug: activeSlug ?? pathname.match(/\/categories\/([^/?#]+)/)?.[1] ?? null,
          source: "contextual-header",
        },
      })
    : null

  return (
    <div className="bg-background pt-safe md:hidden">
      <div className="flex h-(--control-primary) items-center justify-between border-b border-border-subtle px-2">
        <div className={cn("flex items-center", expandTitle && "flex-1 min-w-0")}>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex size-(--control-default) -ml-1 shrink-0 items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" />
            </button>
          ) : (
            <Link
              href={backHref}
              className="flex size-(--control-default) -ml-1 shrink-0 items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="size-6" />
            </Link>
          )}
          {expandTitle ? (
            <div className={cn("ml-1 flex-1 min-w-0", titleClassName)}>
              {title}
            </div>
          ) : (
            <h1
              className={cn(
                "ml-1 max-w-48 truncate text-sm font-semibold leading-tight text-foreground",
                titleClassName,
              )}
            >
              {title}
            </h1>
          )}
        </div>
        {!hideActions && (
          <div className="flex items-center gap-1">
            {trailingActions ? (
              trailingActions
            ) : (
              <>
                <Link
                  href={searchHref ?? "/search"}
                  className="flex size-(--control-default) items-center justify-center rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  aria-label={tCommon("search")}
                >
                  <MagnifyingGlass className="size-6" />
                </Link>
                <MobileWishlistButton />
                <MobileCartDropdown />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
