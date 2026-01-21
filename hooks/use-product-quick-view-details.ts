"use client"

import * as React from "react"

import type { QuickViewProduct } from "@/components/providers/drawer-context"

type QuickViewDetailsResponse = Partial<QuickViewProduct>

/**
 * When quick view opens from a product grid, we often only have "card" data.
 * This hook opportunistically fetches richer details for the open product and
 * merges them into the client-side quick view state (no URL change).
 */
export function useProductQuickViewDetails(open: boolean, product: QuickViewProduct | null) {
  const [resolvedProduct, setResolvedProduct] = React.useState<QuickViewProduct | null>(product)
  const [isLoading, setIsLoading] = React.useState(false)
  const fetchedKeyRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    setResolvedProduct(product)
    if (!open) {
      fetchedKeyRef.current = null
      setIsLoading(false)
    }
  }, [product, open])

  React.useEffect(() => {
    if (!open || !product) return

    const username = product.username
    const productSlug = product.slug ?? product.id
    if (!username || !productSlug) return

    const key = `${username}/${productSlug}`

    const needsFetch = !product.description || !product.images?.length
    if (!needsFetch) {
      fetchedKeyRef.current = key
      return
    }

    if (fetchedKeyRef.current === key) return
    fetchedKeyRef.current = key

    const controller = new AbortController()
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

        setResolvedProduct((prev) => (prev ? ({ ...prev, ...data } as QuickViewProduct) : prev))
      })
      .catch(() => {
        if (controller.signal.aborted) return
        // Allow retry next open.
        fetchedKeyRef.current = null
      })
      .finally(() => {
        if (controller.signal.aborted) return
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [open, product])

  return { product: resolvedProduct, isLoading }
}

