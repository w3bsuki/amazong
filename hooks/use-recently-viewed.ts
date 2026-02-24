"use client"

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
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function isNullableString(value: unknown): value is string | null | undefined {
  return typeof value === "string" || value === null || value === undefined
}

function isRecentlyViewedProduct(value: unknown): value is RecentlyViewedProduct {
  if (typeof value !== "object" || value === null) return false

  const product = value as Record<string, unknown>
  return (
    typeof product.id === "string" &&
    typeof product.title === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    (typeof product.image === "string" || product.image === null) &&
    typeof product.slug === "string" &&
    typeof product.viewedAt === "number" &&
    Number.isFinite(product.viewedAt) &&
    isNullableString(product.username) &&
    isNullableString(product.storeSlug)
  )
}

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
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // Ignore storage errors
            }
            setIsLoaded(true)
            return
          }

          const validProducts = parsed.filter(isRecentlyViewedProduct)
          if (validProducts.length !== parsed.length) {
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // Ignore storage errors
            }
          }

          // Filter out items older than 30 days
          const thirtyDaysAgo = Date.now() - THIRTY_DAYS_MS
          const filtered = validProducts
            .filter((product) => product.viewedAt > thirtyDaysAgo)
            .slice(0, MAX_ITEMS)
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
      } catch {
        // Ignore storage errors
      }
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
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Ignore storage errors
      }
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

