"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { IconSearch, IconX, IconFilter, IconCheck, IconPackage, IconPackageOff, IconChevronDown } from "@tabler/icons-react"
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

export type WishlistCategory = {
  id: string
  name: string
  slug: string
  count: number
}

type StockFilter = "all" | "in-stock" | "out-of-stock"

interface AccountWishlistToolbarProps {
  locale: string
  categories: WishlistCategory[]
  initialCategoryFilter: string | null
  initialSearchQuery: string
  initialStockFilter: string
  totalItems: number
  filteredCount: number
  className?: string
}

export function AccountWishlistToolbar({
  locale,
  categories,
  initialCategoryFilter,
  initialSearchQuery,
  initialStockFilter,
  totalItems,
  filteredCount,
  className,
}: AccountWishlistToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(initialSearchQuery)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(initialCategoryFilter)
  const [stockFilter, setStockFilter] = useState<StockFilter>(
    (initialStockFilter as StockFilter) || "all"
  )

  const didMount = useRef(false)

  const labels = useMemo(
    () => ({
      all: locale === "bg" ? "Всички" : "All",
      allCategories: locale === "bg" ? "Всички категории" : "All Categories",
      search: locale === "bg" ? "Търсене" : "Search",
      searchPlaceholder: locale === "bg" ? "Търси в любими..." : "Search wishlist...",
      filter: locale === "bg" ? "Филтър" : "Filter",
      category: locale === "bg" ? "Категория" : "Category",
      stock: locale === "bg" ? "Наличност" : "Stock",
      inStock: locale === "bg" ? "Налични" : "In Stock",
      outOfStock: locale === "bg" ? "Изчерпани" : "Out of Stock",
      items: locale === "bg" ? "артикула" : "items",
      clearFilters: locale === "bg" ? "Изчисти" : "Clear",
    }),
    [locale]
  )

  const buildUrl = (next: { q?: string | null; category?: string | null; stock?: StockFilter | null }) => {
    const params = new URLSearchParams(searchParams?.toString() || "")

    // Handle search query
    if (next.q === null) params.delete("q")
    else if (typeof next.q === "string") {
      const trimmed = next.q.trim()
      if (!trimmed) params.delete("q")
      else params.set("q", trimmed)
    }

    // Handle category filter
    if (next.category === null) params.delete("category")
    else if (next.category) params.set("category", next.category)

    // Handle stock filter
    if (next.stock === null || next.stock === "all") params.delete("stock")
    else if (next.stock) params.set("stock", next.stock)

    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  const applyUrl = (next: { q?: string | null; category?: string | null; stock?: StockFilter | null }) => {
    const url = buildUrl(next)
    startTransition(() => {
      router.replace(url, { scroll: false })
    })
  }

  // Debounced search
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const handle = window.setTimeout(() => {
      applyUrl({ q: query, category: categoryFilter, stock: stockFilter })
    }, 300)

    return () => window.clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Sync with URL params
  useEffect(() => {
    setCategoryFilter(initialCategoryFilter)
  }, [initialCategoryFilter])

  useEffect(() => {
    setStockFilter((initialStockFilter as StockFilter) || "all")
  }, [initialStockFilter])

  const hasActiveFilters = categoryFilter || stockFilter !== "all" || query.trim()
  const selectedCategory = categories.find(c => c.slug === categoryFilter)

  const clearAllFilters = () => {
    setQuery("")
    setCategoryFilter(null)
    setStockFilter("all")
    applyUrl({ q: null, category: null, stock: null })
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Mobile: Compact horizontal scrollable category chips + filter dropdown */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Search bar */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="pl-9 pr-9 h-10 rounded-full bg-surface-subtle border-border/40"
            aria-label={labels.search}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("")
                applyUrl({ q: null, category: categoryFilter, stock: stockFilter })
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <IconX className="size-4" />
            </button>
          )}
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
          )}
        </div>

        {/* Category chips + Stock filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {/* All button */}
          <button
            onClick={() => {
              setCategoryFilter(null)
              applyUrl({ q: query, category: null, stock: stockFilter })
            }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                !categoryFilter
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-background border border-border/60 text-foreground hover:bg-hover"
              )}
            >
              {labels.all}
              <span className={cn(
                "text-xs tabular-nums",
                !categoryFilter ? "text-background/80" : "text-muted-foreground"
              )}>
                {totalItems}
              </span>
            </button>

          {/* Category chips */}
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                const newCat = categoryFilter === cat.slug ? null : cat.slug
                setCategoryFilter(newCat)
                applyUrl({ q: query, category: newCat, stock: stockFilter })
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                categoryFilter === cat.slug
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-background border border-border/60 text-foreground hover:bg-hover"
              )}
            >
              {cat.name}
              <span className={cn(
                "text-xs tabular-nums",
                categoryFilter === cat.slug ? "text-background/80" : "text-muted-foreground"
              )}>
                {cat.count}
              </span>
            </button>
          ))}

          {/* Stock filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                  stockFilter !== "all"
                    ? stockFilter === "in-stock"
                      ? "bg-success text-primary-foreground shadow-sm"
                      : "bg-warning text-foreground shadow-sm"
                    : "bg-background border border-border/60 text-foreground hover:bg-hover"
                )}
              >
                {stockFilter === "in-stock" ? (
                  <IconPackage className="size-3.5" />
                ) : stockFilter === "out-of-stock" ? (
                  <IconPackageOff className="size-3.5" />
                ) : (
                  <IconFilter className="size-3.5" />
                )}
                {stockFilter === "all" ? labels.stock : stockFilter === "in-stock" ? labels.inStock : labels.outOfStock}
                <IconChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  setStockFilter("all")
                  applyUrl({ q: query, category: categoryFilter, stock: "all" })
                }}
              >
                <span className="flex-1">{labels.all}</span>
                {stockFilter === "all" && <IconCheck className="size-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setStockFilter("in-stock")
                  applyUrl({ q: query, category: categoryFilter, stock: "in-stock" })
                }}
              >
                <IconPackage className="size-4 mr-2 text-success" />
                <span className="flex-1">{labels.inStock}</span>
                {stockFilter === "in-stock" && <IconCheck className="size-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStockFilter("out-of-stock")
                  applyUrl({ q: query, category: categoryFilter, stock: "out-of-stock" })
                }}
              >
                <IconPackageOff className="size-4 mr-2 text-warning" />
                <span className="flex-1">{labels.outOfStock}</span>
                {stockFilter === "out-of-stock" && <IconCheck className="size-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop: Full toolbar with search, category dropdown, and stock filter */}
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
            <button
              onClick={() => {
                setQuery("")
                applyUrl({ q: null, category: categoryFilter, stock: stockFilter })
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <IconX className="size-4" />
            </button>
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
              {stockFilter === "all" ? labels.stock : stockFilter === "in-stock" ? labels.inStock : labels.outOfStock}
              <IconChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => {
                setStockFilter("all")
                applyUrl({ q: query, category: categoryFilter, stock: "all" })
              }}
            >
              <span className="flex-1">{labels.all}</span>
              {stockFilter === "all" && <IconCheck className="size-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setStockFilter("in-stock")
                applyUrl({ q: query, category: categoryFilter, stock: "in-stock" })
              }}
            >
              <IconPackage className="size-4 mr-2 text-success" />
              <span className="flex-1">{labels.inStock}</span>
              {stockFilter === "in-stock" && <IconCheck className="size-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setStockFilter("out-of-stock")
                applyUrl({ q: query, category: categoryFilter, stock: "out-of-stock" })
              }}
            >
              <IconPackageOff className="size-4 mr-2 text-warning" />
              <span className="flex-1">{labels.outOfStock}</span>
              {stockFilter === "out-of-stock" && <IconCheck className="size-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
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

      {/* Active filters summary (mobile) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 sm:hidden flex-wrap">
          <span className="text-xs text-muted-foreground">{labels.filter}:</span>
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="gap-1 bg-selected text-primary"
              >
                {selectedCategory.name}
                <button
                  onClick={() => {
                    setCategoryFilter(null)
                  applyUrl({ q: query, category: null, stock: stockFilter })
                }}
                className="hover:text-foreground"
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
                onClick={() => {
                  setStockFilter("all")
                  applyUrl({ q: query, category: categoryFilter, stock: "all" })
                }}
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
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            {labels.clearFilters}
          </button>
        </div>
      )}

      {/* Desktop: Result count when filtering */}
      {hasActiveFilters && filteredCount !== totalItems && (
        <div className="hidden sm:flex items-center text-sm text-muted-foreground">
          {locale === "bg" 
            ? `Показани ${filteredCount} от ${totalItems} артикула`
            : `Showing ${filteredCount} of ${totalItems} items`
          }
        </div>
      )}
    </div>
  )
}
