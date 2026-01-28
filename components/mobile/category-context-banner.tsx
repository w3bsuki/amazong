"use client"

import { Link } from "@/i18n/routing"
import { ArrowRight } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryContextBannerProps {
  /** Category display name (localized) */
  categoryName: string | null
  /** Number of products in this category */
  productCount: number
  /** Category slug for the "Explore" link */
  categorySlug: string
  /** Locale for i18n */
  locale?: string
}

// =============================================================================
// CATEGORY CONTEXT BANNER
//
// A minimal banner shown when user selects an L0 category on the landing page.
// Provides context (name + count) and a link to the full category page.
//
// Design philosophy: Keep landing page clean (discovery mode).
// Users who want full filtering can tap "Explore" to go to category page.
// =============================================================================

export function CategoryContextBanner({
  categoryName,
  productCount,
  categorySlug,
}: CategoryContextBannerProps) {
  const t = useTranslations("Categories")

  if (!categoryName || !categorySlug) return null

  const exploreLabel = t("explore")
  const itemsLabel = t("itemsCount", { count: productCount })

  return (
    <div className="mx-inset my-2 p-3 rounded-lg bg-surface-subtle border border-border/30">
      <div className="flex items-center justify-between gap-3">
        {/* Category info */}
        <div className="min-w-0">
          <span className="text-sm font-semibold text-foreground">
            {categoryName}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">
            {itemsLabel}
          </span>
        </div>

        {/* Explore link */}
        <Link
          href={`/categories/${categorySlug}`}
          className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 active:text-primary/70 transition-colors"
        >
          <span>{exploreLabel}</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>
    </div>
  )
}
