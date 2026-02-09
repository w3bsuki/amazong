"use client"

import { useEffect, useRef } from "react"

interface ViewTrackerProps {
  productId: string
}

/**
 * ViewTracker - Client component that increments product view count on mount.
 * Uses a ref to ensure only one request per mount (React strict mode safe).
 */
export function ViewTracker({ productId }: ViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Prevent double tracking in React Strict Mode
    if (tracked.current) return
    tracked.current = true

    // Fire and forget - don't block or show errors to user
    fetch(`/api/products/${productId}/view`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // Silently fail - view tracking is non-critical
    })
  }, [productId])

  // Render nothing - this is a side-effect only component
  return null
}
