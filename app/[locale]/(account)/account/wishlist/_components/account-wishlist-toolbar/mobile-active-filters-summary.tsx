import { X as IconX } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import type { StockFilter, WishlistCategory, WishlistToolbarLabels, WishlistUrlParams } from "./account-wishlist-toolbar.types"

export function MobileActiveFiltersSummary({
  locale,
  labels,
  selectedCategory,
  query,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  totalItems,
  filteredCount,
  clearAllFilters,
  applyUrl,
}: {
  locale: string
  labels: WishlistToolbarLabels
  selectedCategory: WishlistCategory | undefined
  query: string
  categoryFilter: string | null
  setCategoryFilter: (next: string | null) => void
  stockFilter: StockFilter
  setStockFilter: (next: StockFilter) => void
  totalItems: number
  filteredCount: number
  clearAllFilters: () => void
  applyUrl: (next: WishlistUrlParams) => void
}) {
  return (
    <div className="flex items-center gap-2 sm:hidden flex-wrap">
      <span className="text-xs text-muted-foreground">{labels.filter}:</span>
      {selectedCategory && (
        <Badge variant="secondary" className="gap-1 bg-selected text-primary">
          {selectedCategory.name}
          <button
            type="button"
            onClick={() => {
              setCategoryFilter(null)
              applyUrl({ q: query, category: null, stock: stockFilter })
            }}
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={locale === "bg" ? "Премахни филтъра за категория" : "Remove category filter"}
          >
            <IconX className="size-3" />
          </button>
        </Badge>
      )}
      {stockFilter !== "all" && (
        <Badge
          variant="secondary"
          className={cn(
            "gap-1",
            stockFilter === "in-stock"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {stockFilter === "in-stock" ? labels.inStock : labels.outOfStock}
          <button
            type="button"
            onClick={() => {
              setStockFilter("all")
              applyUrl({ q: query, category: categoryFilter, stock: "all" })
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={locale === "bg" ? "Премахни филтъра за наличност" : "Remove stock filter"}
          >
            <IconX className="size-3" />
          </button>
        </Badge>
      )}
      {/* Result count */}
      {filteredCount !== totalItems && (
        <span className="text-xs text-muted-foreground">
          {filteredCount} {locale === "bg" ? "от" : "of"} {totalItems}
        </span>
      )}
      <button
        type="button"
        onClick={clearAllFilters}
        className="text-xs text-muted-foreground hover:text-foreground ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        {labels.clearFilters}
      </button>
    </div>
  )
}
