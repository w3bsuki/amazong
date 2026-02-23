export type WishlistCategory = {
  id: string
  name: string
  slug: string
  count: number
}

export type StockFilter = "all" | "in-stock" | "out-of-stock"

export type WishlistUrlParams = {
  q?: string | null
  category?: string | null
  stock?: StockFilter | null
}

export type WishlistToolbarLabels = {
  all: string
  allCategories: string
  search: string
  searchPlaceholder: string
  filter: string
  category: string
  stock: string
  inStock: string
  outOfStock: string
  items: string
  clearFilters: string
}
