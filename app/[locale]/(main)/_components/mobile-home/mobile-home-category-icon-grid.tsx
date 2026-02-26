"use client"

import { LayoutGrid } from "lucide-react"

import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "../category/category-icons"

interface MobileHomeCategoryIconGridProps {
  seeAllLabel: string
  categories: CategoryTreeNode[]
  getCategoryLabel: (category: CategoryTreeNode) => string
  maxItems?: number
  onSelectCategory?: ((slug: string | null) => void) | undefined
  className?: string
  testId?: string
}

export function MobileHomeCategoryIconGrid({
  seeAllLabel,
  categories,
  getCategoryLabel,
  maxItems = 5,
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
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max min-w-full items-center gap-2 pr-4">
          {onSelectCategory ? (
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              aria-label={seeAllLabel}
              className="group flex shrink-0 rounded-full tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <span className="inline-flex size-(--size-category-tile) items-center justify-center rounded-full ring-1 ring-border-subtle bg-surface-subtle text-foreground transition-colors group-hover:bg-accent group-active:bg-accent">
                <LayoutGrid size={20} aria-hidden="true" />
              </span>
            </button>
          ) : (
            <Link
              href="/categories"
              aria-label={seeAllLabel}
              className="group flex shrink-0 rounded-full tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <span className="inline-flex size-(--size-category-tile) items-center justify-center rounded-full ring-1 ring-border-subtle bg-surface-subtle text-foreground transition-colors group-hover:bg-accent group-active:bg-accent">
                <LayoutGrid size={20} aria-hidden="true" />
              </span>
            </Link>
          )}

          {items.map((category) => {
            const label = getCategoryLabel(category)
            const content = (
              <span className="inline-flex size-(--size-category-tile) items-center justify-center rounded-full ring-1 ring-border-subtle bg-surface-subtle text-foreground transition-colors group-hover:bg-accent group-active:bg-accent">
                {getCategoryIcon(category.slug, { size: 20 })}
              </span>
            )

            if (onSelectCategory) {
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category.slug)}
                  aria-label={label}
                  className="group flex shrink-0 rounded-full tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
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
                className="group flex shrink-0 rounded-full tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
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
