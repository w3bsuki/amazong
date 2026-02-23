import {
  Check as IconCheck,
  ChevronDown as IconChevronDown,
  Filter as IconFilter,
  Package as IconPackage,
  PackageX as IconPackageOff,
  Search as IconSearch,
  X as IconX,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { StockFilter, WishlistCategory, WishlistToolbarLabels, WishlistUrlParams } from "./account-wishlist-toolbar.types"
import { StockFilterDropdownContent } from "./stock-filter-dropdown-content"
import { WishlistSearchClearButton } from "./wishlist-search-clear-button"

export function DesktopWishlistToolbar({
  locale,
  labels,
  categories,
  totalItems,
  selectedCategory,
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  isPending,
  hasActiveFilters,
  clearAllFilters,
  applyUrl,
}: {
  locale: string
  labels: WishlistToolbarLabels
  categories: WishlistCategory[]
  totalItems: number
  selectedCategory: WishlistCategory | undefined
  query: string
  setQuery: (next: string) => void
  categoryFilter: string | null
  setCategoryFilter: (next: string | null) => void
  stockFilter: StockFilter
  setStockFilter: (next: StockFilter) => void
  isPending: boolean
  hasActiveFilters: boolean
  clearAllFilters: () => void
  applyUrl: (next: WishlistUrlParams) => void
}) {
  return (
    <div className="hidden sm:flex items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="pl-9 pr-9"
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
        {isPending && !query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
        )}
      </div>

      {/* Category dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            {selectedCategory ? (
              <>
                {selectedCategory.name}
                <Badge variant="secondary" className="ml-1">
                  {selectedCategory.count}
                </Badge>
              </>
            ) : (
              labels.allCategories
            )}
            <IconChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => {
              setCategoryFilter(null)
              applyUrl({ q: query, category: null, stock: stockFilter })
            }}
          >
            <span className="flex-1">{labels.allCategories}</span>
            <span className="text-muted-foreground text-xs tabular-nums">{totalItems}</span>
            {!categoryFilter && <IconCheck className="size-4 ml-2 text-primary" />}
          </DropdownMenuItem>
          {categories.length > 0 && <DropdownMenuSeparator />}
          {categories.map((cat) => (
            <DropdownMenuItem
              key={cat.slug}
              onClick={() => {
                setCategoryFilter(cat.slug)
                applyUrl({ q: query, category: cat.slug, stock: stockFilter })
              }}
            >
              <span className="flex-1">{cat.name}</span>
              <span className="text-muted-foreground text-xs tabular-nums">{cat.count}</span>
              {categoryFilter === cat.slug && <IconCheck className="size-4 ml-2 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Stock filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={stockFilter !== "all" ? "default" : "outline"}
            className={cn(
              "gap-2",
              stockFilter === "in-stock" && "bg-success hover:bg-success/90",
              stockFilter === "out-of-stock" && "bg-warning hover:bg-warning/90"
            )}
          >
            {stockFilter === "in-stock" ? (
              <IconPackage className="size-4" />
            ) : stockFilter === "out-of-stock" ? (
              <IconPackageOff className="size-4" />
            ) : (
              <IconFilter className="size-4" />
            )}
            {stockFilter === "all"
              ? labels.stock
              : stockFilter === "in-stock"
                ? labels.inStock
                : labels.outOfStock}
            <IconChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <StockFilterDropdownContent
          widthClassName="w-44"
          labels={labels}
          stockFilter={stockFilter}
          query={query}
          categoryFilter={categoryFilter}
          setStockFilter={setStockFilter}
          applyUrl={applyUrl}
        />
      </DropdownMenu>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <IconX className="size-4 mr-1" />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  )
}
