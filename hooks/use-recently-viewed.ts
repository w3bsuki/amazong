import { useState, useEffect, useCallback } from "react"
import { safeJsonParse } from "@/lib/safe-json"

export interface RecentlyViewedProduct {
  id: string
  title: string
  price: number
  image: string | null
  slug: string
  /** Seller username for SEO-friendly URLs */
  username?: string | null
  /** @deprecated Use 'username' instead */
  storeSlug?: string | null
  viewedAt: number
}

const STORAGE_KEY = "recentlyViewedProducts"
const MAX_ITEMS = 10

export function useRecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = safeJsonParse<unknown>(saved)
          if (!Array.isArray(parsed)) {
            localStorage.removeItem(STORAGE_KEY)
            setIsLoaded(true)
            return
          }
          // Filter out items older than 30 days
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
          const filtered = (parsed as RecentlyViewedProduct[]).filter((p) => p.viewedAt > thirtyDaysAgo)
          setProducts(filtered)
        }
      } catch {
        // Ignore storage errors
      }
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage when products change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
  }, [products, isLoaded])

  const addProduct = useCallback(
    (product: Omit<RecentlyViewedProduct, "viewedAt">) => {
      setProducts((prev) => {
        // Remove if already exists
        const filtered = prev.filter((p) => p.id !== product.id)
        // Add to front with current timestamp
        return [
          { ...product, viewedAt: Date.now() },
          ...filtered,
        ].slice(0, MAX_ITEMS)
      })
    },
    []
  )

  const clearProducts = useCallback(() => {
    setProducts([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    products,
    addProduct,
    clearProducts,
    removeProduct,
    isLoaded,
  }
}

