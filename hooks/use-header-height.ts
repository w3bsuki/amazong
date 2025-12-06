"use client"

import { useState, useEffect } from "react"

const DEFAULT_HEADER_HEIGHT = 64

/**
 * Hook to measure and track header element height
 * Useful for positioning fixed/absolute elements below the header
 */
export function useHeaderHeight(): number {
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT)

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header")
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    }

    // Initial measurement
    updateHeaderHeight()

    // Update on resize
    window.addEventListener("resize", updateHeaderHeight)

    // Also observe DOM changes in case header content changes
    const observer = new ResizeObserver(updateHeaderHeight)
    const header = document.querySelector("header")
    if (header) {
      observer.observe(header)
    }

    return () => {
      window.removeEventListener("resize", updateHeaderHeight)
      observer.disconnect()
    }
  }, [])

  return headerHeight
}
