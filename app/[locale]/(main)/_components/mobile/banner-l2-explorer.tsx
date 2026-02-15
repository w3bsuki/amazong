"use client"

import { useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { CaretRight } from "@/lib/icons/phosphor"

import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/components/shared/category/category-icons"

// =============================================================================
// Types
// =============================================================================

interface BannerL2ExplorerProps {
  /** L2 categories to display as compact pills */
  categories: CategoryTreeNode[]
  /** Currently active L2 slug (for highlight) */
  activeSlug: string | null
  /** L1 subcategory label for inline context */
  subcategoryLabel: string
  /** Handler for selecting an L2 category */
  onSelect: (slug: string | null) => void
  /** Link to full category browse page */
  viewAllHref: string
}

// =============================================================================
// Styles — compact outlined pills (visually subordinate to the L1 secondary rail)
// =============================================================================

const L2_PILL_BASE =
  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border min-h-(--control-compact) px-2.5 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const L2_PILL_ACTIVE =
  "border-foreground bg-foreground text-background font-semibold"
const L2_PILL_INACTIVE =
  "border-border bg-background text-foreground font-medium hover:bg-hover active:bg-active"

const VIEW_ALL_CLASS =
  "inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap min-h-(--control-compact) px-1.5 text-xs font-semibold text-muted-foreground tap-transparent transition-colors duration-fast ease-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

// =============================================================================
// Component
// =============================================================================

export function BannerL2Explorer({
  categories,
  activeSlug,
  subcategoryLabel,
  onSelect,
  viewAllHref,
}: BannerL2ExplorerProps) {
  const locale = useLocale()
  const tV4 = useTranslations("Home.mobile.v4")

  const getLabel = useCallback(
    (category: CategoryTreeNode) => getCategoryName(category, locale),
    [locale]
  )

  if (categories.length === 0) return null

  return (
    <section data-testid="home-v4-l2-banner" className="px-3 pt-1.5">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex w-max items-center gap-1.5 pb-0.5">
          {/* Inline context label */}
          <span className="shrink-0 pr-0.5 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
            {subcategoryLabel}
          </span>

          {/* L2 category pills with inline icons */}
          {categories.map((category) => {
            const active = activeSlug === category.slug
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(active ? null : category.slug)}
                className={cn(L2_PILL_BASE, active ? L2_PILL_ACTIVE : L2_PILL_INACTIVE)}
              >
                <span className="shrink-0" aria-hidden="true">
                  {getCategoryIcon(category.slug, {
                    size: 14,
                    weight: active ? "fill" : "regular",
                  })}
                </span>
                <span>{getLabel(category)}</span>
              </button>
            )
          })}

          {/* View all link */}
          <Link href={viewAllHref} className={VIEW_ALL_CLASS}>
            <span>{tV4("actions.view")}</span>
            <CaretRight size={12} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
