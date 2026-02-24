"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

import { useWishlist } from "@/components/providers/wishlist-context"
import { useTranslations } from "next-intl"
import { CountBadge } from "@/components/shared/count-badge"
import { useDrawer } from "@/components/providers/drawer-context"
import { IconButton } from "@/components/ui/icon-button"

export function MobileWishlistButton() {
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useWishlist()
  const { openDrawer, enabledDrawers } = useDrawer()
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
        className="group relative flex size-(--control-default) cursor-pointer items-center justify-center rounded-full p-0 text-header-text touch-manipulation tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={tNav("wishlist")}
      >
        <span
          className="relative flex size-(--control-compact) items-center justify-center rounded-full bg-surface-subtle motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none group-hover:bg-hover group-active:bg-active"
          aria-hidden="true"
        >
          <Heart className="size-icon-sm text-header-text" />
        </span>
      </span>
    )
  }

  return (
    <IconButton
      type="button"
      variant="ghost"
      size="icon-default"
      className="group relative rounded-full p-0 text-header-text touch-manipulation tap-transparent"
      aria-label={tNav("wishlist")}
      aria-haspopup={enabledDrawers.wishlist ? "dialog" : undefined}
      onClick={() => {
        if (enabledDrawers.wishlist) openDrawer("wishlist")
      }}
    >
      <span
        className="relative flex size-(--control-compact) items-center justify-center rounded-full bg-surface-subtle motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none group-hover:bg-hover group-active:bg-active"
        aria-hidden="true"
      >
        <Heart className="size-icon-sm text-header-text" />
        {totalItems > 0 && (
          <CountBadge
            count={totalItems}
            className="absolute -top-1 -right-1 h-4 min-w-4 bg-wishlist-active px-1 text-2xs leading-none text-primary-foreground ring-1 ring-header-bg"
            aria-hidden="true"
          />
        )}
      </span>
    </IconButton>
  )
}

