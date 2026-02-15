"use client"

import { useEffect, useState } from "react"
import { Heart } from "@/lib/icons/phosphor"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useTranslations } from "next-intl"
import { CountBadge } from "@/components/shared/count-badge"
import { useDrawer } from "@/components/providers/drawer-context"

export function MobileWishlistButton() {
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useWishlist()
  const { openWishlist, enabledDrawers } = useDrawer()
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
        className="relative flex size-touch-md cursor-pointer items-center justify-center rounded-md p-0 tap-transparent transition-colors hover:bg-header-hover active:bg-header-active touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart weight="regular" className="size-icon-header text-header-text" />
        </span>
      </span>
    )
  }

  return (
    <button
      className="relative flex size-touch-md appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 tap-transparent transition-colors hover:bg-header-hover active:bg-header-active touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      aria-label={tNav("wishlist")}
      aria-haspopup={enabledDrawers.wishlist ? "dialog" : undefined}
      onClick={() => {
        if (enabledDrawers.wishlist) openWishlist()
      }}
    >
      <span className="relative" aria-hidden="true">
        <Heart weight="regular" className="size-icon-header text-header-text" />
        {totalItems > 0 && (
          <CountBadge
            count={totalItems}
            className="absolute -top-1 -right-1 h-4 min-w-4 bg-wishlist-active px-1 text-2xs leading-none text-primary-foreground ring-1 ring-header-bg"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  )
}
