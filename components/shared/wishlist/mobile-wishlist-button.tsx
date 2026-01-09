"use client"

import { useState, useEffect, useRef } from "react"
import { Heart } from "@phosphor-icons/react"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useTranslations } from "next-intl"
import { WishlistDrawer, type WishlistDrawerHandle } from "@/components/shared/wishlist/wishlist-drawer"
import { CountBadge } from "@/components/shared/count-badge"

export function MobileWishlistButton() {
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useWishlist()
  const tNav = useTranslations("Navigation")
  const drawerRef = useRef<WishlistDrawerHandle>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid Radix/React hydration mismatch warnings in dev by not SSR-rendering
  // the drawer (ids/aria-* can differ if wishlist state is client-initialized).
  if (!mounted) {
    return (
      <button
        type="button"
        className="flex items-center justify-center size-touch p-0 rounded-lg relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
        aria-label={tNav("wishlist")}
        disabled
        aria-disabled="true"
      >
        <span className="relative" aria-hidden="true">
          <Heart size={24} weight="regular" className="text-header-text" />
        </span>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => drawerRef.current?.open()}
        className="flex items-center justify-center size-touch p-0 rounded-lg relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart size={24} weight="regular" className="text-header-text" />
          {totalItems > 0 && (
            <CountBadge
              count={totalItems}
              className="absolute -top-1 -right-1 bg-destructive text-white ring-2 ring-header-bg h-4.5 min-w-4.5 px-1 text-2xs shadow-sm"
              aria-hidden="true"
            />
          )}
        </span>
      </button>
      <WishlistDrawer ref={drawerRef} />
    </>
  )
}
