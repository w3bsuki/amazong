"use client"

import { ChevronRight, LayoutGrid } from "lucide-react"

import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/components/shared/category-icons"

interface MobileHomeCategoryIconGridProps {
  title: string
  seeAllLabel: string
  categories: CategoryTreeNode[]
  getCategoryLabel: (category: CategoryTreeNode) => string
  maxItems?: number
  onSelectCategory?: ((slug: string) => void) | undefined
  className?: string
  testId?: string
}

export function MobileHomeCategoryIconGrid({
  title,
  seeAllLabel,
  categories,
  getCategoryLabel,
  maxItems = 8,
  onSelectCategory,
  className,
  testId,
}: MobileHomeCategoryIconGridProps) {
  const items = categories.slice(0, Math.max(0, maxItems))

  if (items.length === 0) return null

  return (
    <section
      className={cn("w-full px-4 pt-2", className)}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="flex items-center justify-between gap-3 hidden">
        <h2 className="text-reading font-semibold text-foreground">{title}</h2>
        <Link
          href="/categories"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground tap-transparent transition-colors hover:text-foreground active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        >
          {seeAllLabel}
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max min-w-full items-start gap-2 pr-4">
          {items.map((category) => {
            const label = getCategoryLabel(category)
            const content = (
              <>
                <span className="inline-flex size-(--size-category-tile) items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground group-active:text-foreground">
                  {getCategoryIcon(category.slug, { size: 24 })}
                </span>
              </>
            )

            if (onSelectCategory) {
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category.slug)}
                  aria-label={label}
                  className="group flex shrink-0 flex-col items-center gap-1 rounded-full tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                >
                  {content}
                </button>
              )
            }

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                aria-label={label}
                className="group flex shrink-0 flex-col items-center gap-1 rounded-full tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
