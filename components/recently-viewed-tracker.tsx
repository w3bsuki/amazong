"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

interface RecentlyViewedTrackerProps {
  product: {
    id: string
    title: string
    price: number
    image: string | null
    slug: string
    storeSlug?: string | null
  }
}

export function RecentlyViewedTracker({ product }: RecentlyViewedTrackerProps) {
  const { addProduct } = useRecentlyViewed()

  useEffect(() => {
    // Add product to recently viewed after a short delay
    // This ensures the page has fully loaded
    const timer = setTimeout(() => {
      addProduct(product)
    }, 1000)

    return () => clearTimeout(timer)
  }, [product, addProduct])

  // This component renders nothing
  return null
}
