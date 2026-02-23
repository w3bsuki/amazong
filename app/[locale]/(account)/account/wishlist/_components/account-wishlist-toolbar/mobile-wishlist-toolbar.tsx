import {
  ChevronDown as IconChevronDown,
  Filter as IconFilter,
  Package as IconPackage,
  PackageX as IconPackageOff,
  Search as IconSearch,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type { StockFilter, WishlistCategory, WishlistToolbarLabels, WishlistUrlParams } from "./account-wishlist-toolbar.types"
import { StockFilterDropdownContent } from "./stock-filter-dropdown-content"
import { WishlistSearchClearButton } from "./wishlist-search-clear-button"

export function MobileWishlistToolbar({
  locale,
  labels,
  categories,
  totalItems,
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  isPending,
  applyUrl,
}: {
  locale: string
  labels: WishlistToolbarLabels
  categories: WishlistCategory[]
  totalItems: number
  query: string
  setQuery: (next: string) => void
  categoryFilter: string | null
  setCategoryFilter: (next: string | null) => void
  stockFilter: StockFilter
  setStockFilter: (next: StockFilter) => void
  isPending: boolean
  applyUrl: (next: WishlistUrlParams) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      {/* Search bar */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="pl-9 pr-9 h-10 rounded-full bg-surface-subtle border-border-subtle"
          aria-label={labels.search}
        />
        {query && (
          <WishlistSearchClearButton
            ariaLabel={locale === "bg" ? "Изчисти търсенето" : "Clear search"}
            onClick={() => {
              setQuery("")
              applyUrl({ q: null, category: categoryFilter, stock: stockFilter })
            }}
          />
        )}
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
        )}
      </div>

      {/* Category chips + Stock filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {/* All button */}
        <button
          type="button"
          onClick={() => {
            setCategoryFilter(null)
            applyUrl({ q: query, category: null, stock: stockFilter })
          }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
            !categoryFilter
              ? "bg-foreground text-background shadow-sm"
              : "bg-background border border-border-subtle text-foreground hover:bg-hover"
          )}
          aria-pressed={!categoryFilter}
        >
          {labels.all}
          <span
            className={cn(
              "text-xs tabular-nums",
              !categoryFilter ? "text-background/80" : "text-muted-foreground"
            )}
          >
            {totalItems}
          </span>
        </button>

        {/* Category chips */}
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              const newCat = categoryFilter === cat.slug ? null : cat.slug
              setCategoryFilter(newCat)
              applyUrl({ q: query, category: newCat, stock: stockFilter })
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
              categoryFilter === cat.slug
                ? "bg-foreground text-background shadow-sm"
                : "bg-background border border-border-subtle text-foreground hover:bg-hover"
            )}
            aria-pressed={categoryFilter === cat.slug}
          >
            {cat.name}
            <span
              className={cn(
                "text-xs tabular-nums",
                categoryFilter === cat.slug ? "text-background/80" : "text-muted-foreground"
              )}
            >
              {cat.count}
            </span>
          </button>
        ))}

        {/* Stock filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                stockFilter !== "all"
                  ? stockFilter === "in-stock"
                    ? "bg-success text-primary-foreground shadow-sm"
                    : "bg-warning text-foreground shadow-sm"
                  : "bg-background border border-border-subtle text-foreground hover:bg-hover"
              )}
              aria-label={labels.stock}
              aria-pressed={stockFilter !== "all"}
            >
              {stockFilter === "in-stock" ? (
                <IconPackage className="size-3.5" />
              ) : stockFilter === "out-of-stock" ? (
                <IconPackageOff className="size-3.5" />
              ) : (
                <IconFilter className="size-3.5" />
              )}
              {stockFilter === "all"
                ? labels.stock
                : stockFilter === "in-stock"
                  ? labels.inStock
                  : labels.outOfStock}
              <IconChevronDown className="size-3" />
            </button>
          </DropdownMenuTrigger>
          <StockFilterDropdownContent
            widthClassName="w-40"
            labels={labels}
            stockFilter={stockFilter}
            query={query}
            categoryFilter={categoryFilter}
            setStockFilter={setStockFilter}
            applyUrl={applyUrl}
          />
        </DropdownMenu>
      </div>
    </div>
  )
}
