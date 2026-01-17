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

  // SSR placeholder - renders same visual appearance without disabled state
  // Button is non-functional until hydration completes, but looks ready
  if (!mounted) {
    return (
      <span
        role="button"
        className="flex items-center justify-center size-9 p-0 rounded-md relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent cursor-pointer"
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart size={22} weight="regular" className="text-header-text" />
        </span>
      </span>
    )
  }

  return (
    <>
      <button
        onClick={() => drawerRef.current?.open()}
        className="flex items-center justify-center size-9 p-0 rounded-md relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart size={22} weight="regular" className="text-header-text" />
          {totalItems > 0 && (
            <CountBadge
              count={totalItems}
              className="absolute -top-0.5 -right-0.5 bg-destructive text-white ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs shadow-sm"
              aria-hidden="true"
            />
          )}
        </span>
      </button>
      <WishlistDrawer ref={drawerRef} />
    </>
  )
}
