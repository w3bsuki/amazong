"use client"

import { useMemo, useState } from "react"
import { AccountWishlistStats } from "@/components/account-wishlist-stats"
import { AccountWishlistGrid, type WishlistItem } from "@/components/account-wishlist-grid"
import { AccountWishlistToolbar, type WishlistCategory } from "@/components/account-wishlist-toolbar"

interface WishlistContentProps {
  initialItems: WishlistItem[]
  stats: {
    total: number
    inStock: number
    outOfStock: number
    totalValue: number
  }
  locale: string
  categories: WishlistCategory[]
  initialCategoryFilter: string | null
  initialSearchQuery: string
  initialStockFilter: string
}

export function WishlistContent({ 
  initialItems, 
  locale, 
  categories,
  initialCategoryFilter,
  initialSearchQuery,
  initialStockFilter,
}: WishlistContentProps) {
  const [items, setItems] = useState(initialItems)
  
  // Recalculate stats when items change (based on ALL items, not filtered)
  const stats = useMemo(() => ({
    total: items.length,
    inStock: items.filter(i => i.stock > 0).length,
    outOfStock: items.filter(i => i.stock <= 0).length,
    totalValue: items.reduce((sum, i) => sum + i.price, 0),
  }), [items])

  // Update categories when items change
  const updatedCategories = useMemo(() => {
    const categoriesMap = new Map<string, WishlistCategory>()
    items.forEach((item) => {
      if (item.category_slug && item.category_name) {
        const existing = categoriesMap.get(item.category_slug)
        if (existing) {
          existing.count++
        } else {
          categoriesMap.set(item.category_slug, {
            id: item.category_id || '',
            name: item.category_name,
            slug: item.category_slug,
            count: 1,
          })
        }
      }
    })
    return Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count)
  }, [items])

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    let result = items

    // Filter by category
    if (initialCategoryFilter) {
      result = result.filter(item => item.category_slug === initialCategoryFilter)
    }

    // Filter by stock
    if (initialStockFilter === "in-stock") {
      result = result.filter(item => item.stock > 0)
    } else if (initialStockFilter === "out-of-stock") {
      result = result.filter(item => item.stock <= 0)
    }

    // Filter by search query
    if (initialSearchQuery.trim()) {
      const query = initialSearchQuery.toLowerCase().trim()
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.category_name?.toLowerCase().includes(query)
      )
    }

    return result
  }, [items, initialCategoryFilter, initialStockFilter, initialSearchQuery])

  const handleRemove = (productId: string) => {
    setItems(prev => prev.filter(item => item.product_id !== productId))
  }

  // Show "no results" state if filters return empty but we have items
  const hasFilters = initialCategoryFilter || initialStockFilter !== "all" || initialSearchQuery.trim()
  const noResultsFromFilter = hasFilters && filteredItems.length === 0 && items.length > 0

  const labels = {
    noResults: locale === "bg" ? "Няма намерени резултати" : "No results found",
    noResultsDesc: locale === "bg" 
      ? "Опитайте да промените филтрите или търсенето" 
      : "Try adjusting your filters or search",
    clearFilters: locale === "bg" ? "Изчистете филтрите" : "Clear filters",
  }

  return (
    <>
      <AccountWishlistStats stats={stats} locale={locale} />
      
      {/* Toolbar with filters - only show if we have items */}
      {items.length > 0 && (
        <AccountWishlistToolbar
          locale={locale}
          categories={updatedCategories.length > 0 ? updatedCategories : categories}
          initialCategoryFilter={initialCategoryFilter}
          initialSearchQuery={initialSearchQuery}
          initialStockFilter={initialStockFilter}
          totalItems={items.length}
          filteredCount={filteredItems.length}
        />
      )}

      {/* No results state */}
      {noResultsFromFilter ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-account-stat-bg border border-account-stat-border">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-foreground">{labels.noResults}</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {labels.noResultsDesc}
          </p>
        </div>
      ) : (
        <AccountWishlistGrid items={filteredItems} locale={locale} onRemove={handleRemove} />
      )}
    </>
  )
}
