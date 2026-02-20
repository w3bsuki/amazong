"use client"

import * as React from "react"

import type { QuickViewProduct } from "@/components/providers/drawer-context"

type QuickViewDetailsResponse = Partial<QuickViewProduct>

/**
 * When quick view opens from a product grid, we often only have "card" data.
 * This hook opportunistically fetches richer details for the open product and
 * merges them into the client-side quick view state (no URL change).
 *
 * ARCHITECTURE: Avoids useEffect anti-patterns by:
 * 1. Using useMemo for derived state (not useEffect to sync props)
 * 2. Single useEffect only for the async fetch (legitimate side effect)
 * 3. Tracking fetched data separately from the prop to avoid state sync issues
 */
export function useProductQuickViewDetails(open: boolean, product: QuickViewProduct | null) {
  // Store ONLY the fetched extra data, keyed by product ID
  // This avoids the "syncing state with props" anti-pattern
  const [fetchedData, setFetchedData] = React.useState<{
    productId: string
    data: Partial<QuickViewProduct>
  } | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Track what we've already fetched to avoid duplicate requests
  const fetchedKeyRef = React.useRef<string | null>(null)

  // Derive the final product by merging prop + fetched data
  // This is the React-recommended pattern: compute during render, not in useEffect
  const resolvedProduct = React.useMemo(() => {
    if (!open || !product) return null

    // Only merge if fetched data matches current product
    if (fetchedData && fetchedData.productId === product.id) {
      return { ...product, ...fetchedData.data } as QuickViewProduct
    }

    return product
  }, [open, product, fetchedData])

  // Single effect for the ONLY legitimate side effect: data fetching
  React.useEffect(() => {
    // Reset on close
    if (!open) {
      fetchedKeyRef.current = null
      setFetchedData(null)
      setIsLoading(false)
      return
    }

    if (!product) return

    const { username, slug, id, description, images } = product
    const productSlug = slug ?? id
    if (!username || !productSlug) return

    const key = `${username}/${productSlug}`

    // Skip if we already have full data in the prop
    const needsFetch = !description || !images?.length
    if (!needsFetch) {
      fetchedKeyRef.current = key
      return
    }

    // Skip if already fetched
    if (fetchedKeyRef.current === key) return
    fetchedKeyRef.current = key

    const controller = new AbortController()
    const fetchProductId = id // Capture for closure

    setIsLoading(true)

    fetch(
      `/api/products/quick-view?username=${encodeURIComponent(username)}&productSlug=${encodeURIComponent(productSlug)}`,
      { signal: controller.signal },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status))
        return (await res.json()) as QuickViewDetailsResponse
      })
      .then((data) => {
        if (controller.signal.aborted) return
        if (!data || typeof data !== "object") return

        // Store fetched data with its product ID for safe merging
        setFetchedData({ productId: fetchProductId, data })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        fetchedKeyRef.current = null // Allow retry
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [open, product])

  return { product: resolvedProduct, isLoading }
}
