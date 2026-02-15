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
  /** L2 categories to display as compact chips */
  categories: CategoryTreeNode[]
  /** Currently active L2 slug (for highlight) */
  activeSlug: string | null
  /** L1 subcategory label for the eyebrow */
  subcategoryLabel: string
  /** Handler for selecting an L2 category */
  onSelect: (slug: string | null) => void
  /** Link to full category browse page */
  viewAllHref: string
}

// =============================================================================
// Styles
// =============================================================================

const CHIP_BASE =
  "flex shrink-0 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const CHIP_ACTIVE = "bg-foreground text-background"
const CHIP_INACTIVE = "bg-surface-subtle text-foreground hover:bg-hover active:bg-active"

const ICON_CIRCLE_BASE =
  "flex size-8 items-center justify-center rounded-full transition-colors duration-fast ease-smooth"
const ICON_CIRCLE_ACTIVE = "bg-background/15"
const ICON_CIRCLE_INACTIVE = "bg-background"

const VIEW_ALL_CLASS =
  "inline-flex shrink-0 min-h-(--control-compact) items-center gap-1 rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

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
    <section data-testid="home-v4-l2-banner" className="px-3 pt-2">
      <div className="rounded-xl border border-border-subtle bg-surface-subtle px-2 py-2">
        {/* Eyebrow */}
        <div className="mb-1.5 flex items-center justify-between px-1">
          <p className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
            {subcategoryLabel}
          </p>
          <Link href={viewAllHref} className={VIEW_ALL_CLASS}>
            <span>{tV4("actions.view")}</span>
            <CaretRight size={12} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        {/* Scrollable L2 chips */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex w-max items-end gap-1.5 pb-0.5">
            {categories.map((category) => {
              const active = activeSlug === category.slug
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(active ? null : category.slug)}
                  className={cn(CHIP_BASE, active ? CHIP_ACTIVE : CHIP_INACTIVE)}
                >
                  <span
                    className={cn(
                      ICON_CIRCLE_BASE,
                      active ? ICON_CIRCLE_ACTIVE : ICON_CIRCLE_INACTIVE
                    )}
                    aria-hidden="true"
                  >
                    {getCategoryIcon(category.slug, {
                      size: 16,
                      weight: active ? "fill" : "regular",
                      className: "shrink-0",
                    })}
                  </span>
                  <span className="max-w-14 truncate text-2xs font-medium leading-tight">
                    {getLabel(category)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
