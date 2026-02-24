import { ChevronRight as CaretRight } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { getCategoryName } from "@/lib/data/categories/display"

import { ACTION_CHIP, SUBCATEGORY_ROW, SUBCATEGORY_ROW_DEFAULT } from "./category-browse-drawer.styles"
import { CategoryGridCell } from "./category-grid-cell"

export function CategoryBrowseDrawerListingsTab({
  locale,
  isAtRoot,
  normalizedQuery,
  isLoading,
  filteredListItems,
  categoryCounts,
  rootCategory,
  seeAllCategoryLabel,
  onNavigateToSearch,
  onNavigateToCategories,
  onNavigateToRootCategory,
  onNavigateToLeafCategory,
  onOpenScopedCategory,
  allListingsLabel,
  categoriesLabel,
  noMatchesLabel,
  noSubcategoriesLabel,
  noCategoriesLabel,
}: {
  locale: string
  isAtRoot: boolean
  normalizedQuery: string
  isLoading: boolean
  filteredListItems: CategoryTreeNode[]
  categoryCounts: Record<string, number>
  rootCategory: CategoryTreeNode | null
  seeAllCategoryLabel: string
  onNavigateToSearch: () => void
  onNavigateToCategories: () => void
  onNavigateToRootCategory: (rootSlug: string) => void
  onNavigateToLeafCategory: (rootSlug: string, leafSlug: string) => void
  onOpenScopedCategory: (category: CategoryTreeNode) => void
  allListingsLabel: string
  categoriesLabel: string
  noMatchesLabel: string
  noSubcategoriesLabel: string
  noCategoriesLabel: string
}) {
  return (
    <>
      {/* Quick action chips — root view only, no active search */}
      {isAtRoot && !normalizedQuery && (
        <div className="mb-3 flex items-center gap-2">
          <button type="button" onClick={onNavigateToSearch} className={ACTION_CHIP}>
            {allListingsLabel}
          </button>
          <button type="button" onClick={onNavigateToCategories} className={ACTION_CHIP}>
            {categoriesLabel}
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5"
            >
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-10" />
              </div>
            </div>
          ))}
        </div>
      ) : isAtRoot ? (
        /* Root view — 2-column category grid */
        <div className="grid grid-cols-2 gap-2">
          {filteredListItems.map((cat) => (
            <CategoryGridCell
              key={cat.id}
              category={cat}
              locale={locale}
              count={categoryCounts[cat.slug]}
              onClick={() => onOpenScopedCategory(cat)}
            />
          ))}
        </div>
      ) : (
        /* Drilled view — subcategory list */
        <div className="space-y-1.5">
          {/* "See all in X" primary CTA */}
          {rootCategory && (
            <button
              type="button"
              onClick={() => onNavigateToRootCategory(rootCategory.slug)}
              className={`${SUBCATEGORY_ROW} border-foreground bg-foreground text-background`}
            >
              <span className="min-w-0 flex-1 truncate">{seeAllCategoryLabel}</span>
            </button>
          )}

          {filteredListItems.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (!rootCategory) return
                onNavigateToLeafCategory(rootCategory.slug, cat.slug)
              }}
              className={`${SUBCATEGORY_ROW} ${SUBCATEGORY_ROW_DEFAULT}`}
            >
              <span className="min-w-0 flex-1 truncate">{getCategoryName(cat, locale)}</span>
              <CaretRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredListItems.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            {normalizedQuery
              ? noMatchesLabel
              : rootCategory
                ? noSubcategoriesLabel
                : noCategoriesLabel}
          </p>
        </div>
      )}

      {/* Footer quick nav — drilled view only */}
      {!isAtRoot && (
        <div className="mt-3 border-t border-border-subtle pt-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onNavigateToCategories} className={ACTION_CHIP}>
              <span className="truncate">{categoriesLabel}</span>
              <CaretRight size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
