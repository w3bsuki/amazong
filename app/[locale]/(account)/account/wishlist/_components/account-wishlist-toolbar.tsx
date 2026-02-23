"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

import { DesktopResultCount } from "./account-wishlist-toolbar/desktop-result-count"
import { DesktopWishlistToolbar } from "./account-wishlist-toolbar/desktop-wishlist-toolbar"
import { MobileActiveFiltersSummary } from "./account-wishlist-toolbar/mobile-active-filters-summary"
import { MobileWishlistToolbar } from "./account-wishlist-toolbar/mobile-wishlist-toolbar"
import type {
  StockFilter,
  WishlistCategory,
  WishlistToolbarLabels,
  WishlistUrlParams,
} from "./account-wishlist-toolbar/account-wishlist-toolbar.types"

export type { WishlistCategory } from "./account-wishlist-toolbar/account-wishlist-toolbar.types"

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

  const localePrefix = `/${locale}`
  const basePathname = pathname.startsWith(localePrefix)
    ? pathname.slice(localePrefix.length) || "/"
    : pathname

  const [query, setQuery] = useState(initialSearchQuery)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(initialCategoryFilter)
  const [stockFilter, setStockFilter] = useState<StockFilter>(
    (initialStockFilter as StockFilter) || "all"
  )

  const didMount = useRef(false)

  const labels = useMemo(
    (): WishlistToolbarLabels => ({
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

  const buildUrl = (next: WishlistUrlParams) => {
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
    return qs ? `${basePathname}?${qs}` : basePathname
  }

  const applyUrl = (next: WishlistUrlParams) => {
    const url = buildUrl(next)
    startTransition(() => {
      router.replace(url, { scroll: false })
    })
  }

  const debouncedSearchStateRef = useRef({
    applyUrl,
    categoryFilter,
    stockFilter,
  })

  useEffect(() => {
    debouncedSearchStateRef.current = {
      applyUrl,
      categoryFilter,
      stockFilter,
    }
  }, [applyUrl, categoryFilter, stockFilter])

  // Debounced search
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const handle = window.setTimeout(() => {
      const state = debouncedSearchStateRef.current
      state.applyUrl({ q: query, category: state.categoryFilter, stock: state.stockFilter })
    }, 300)

    return () => window.clearTimeout(handle)
  }, [query])

  // Sync with URL params
  useEffect(() => {
    setCategoryFilter(initialCategoryFilter)
  }, [initialCategoryFilter])

  useEffect(() => {
    setStockFilter((initialStockFilter as StockFilter) || "all")
  }, [initialStockFilter])

  const hasActiveFilters = categoryFilter || stockFilter !== "all" || query.trim()
  const selectedCategory = categories.find((c) => c.slug === categoryFilter)

  const clearAllFilters = () => {
    setQuery("")
    setCategoryFilter(null)
    setStockFilter("all")
    applyUrl({ q: null, category: null, stock: null })
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <MobileWishlistToolbar
        locale={locale}
        labels={labels}
        categories={categories}
        totalItems={totalItems}
        query={query}
        setQuery={setQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        isPending={isPending}
        applyUrl={applyUrl}
      />

      <DesktopWishlistToolbar
        locale={locale}
        labels={labels}
        categories={categories}
        totalItems={totalItems}
        selectedCategory={selectedCategory}
        query={query}
        setQuery={setQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        isPending={isPending}
        hasActiveFilters={Boolean(hasActiveFilters)}
        clearAllFilters={clearAllFilters}
        applyUrl={applyUrl}
      />

      {hasActiveFilters && (
        <MobileActiveFiltersSummary
          locale={locale}
          labels={labels}
          selectedCategory={selectedCategory}
          query={query}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          totalItems={totalItems}
          filteredCount={filteredCount}
          clearAllFilters={clearAllFilters}
          applyUrl={applyUrl}
        />
      )}

      {hasActiveFilters && filteredCount !== totalItems && (
        <DesktopResultCount
          locale={locale}
          filteredCount={filteredCount}
          totalItems={totalItems}
          itemsLabel={labels.items}
        />
      )}
    </div>
  )
}
