"use client"

import { useEffect, useState } from "react"
import { Heart } from "@phosphor-icons/react"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useTranslations } from "next-intl"
import { WishlistDrawer } from "@/components/shared/wishlist/wishlist-drawer"
import { CountBadge } from "@/components/shared/count-badge"

export function MobileWishlistButton() {
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useWishlist()
  const tNav = useTranslations("Navigation")

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR placeholder - renders same visual appearance without disabled state
  // Button is non-functional until hydration completes, but looks ready
  if (!mounted) {
    return (
      <span
        role="button"
        className="flex items-center justify-center size-touch-xs p-0 rounded-md relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent cursor-pointer"
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart weight="regular" className="size-icon-xs text-header-text" />
        </span>
      </span>
    )
  }

  return (
    <WishlistDrawer>
      <button
        className="flex items-center justify-center size-touch-xs p-0 rounded-md relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart weight="regular" className="size-icon-xs text-header-text" />
          {totalItems > 0 && (
            <CountBadge
              count={totalItems}
              className="absolute -top-0.5 -right-0.5 bg-wishlist-active text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs shadow-sm"
              aria-hidden="true"
            />
          )}
        </span>
      </button>
    </WishlistDrawer>
  )
}
