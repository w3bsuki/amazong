"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "@phosphor-icons/react"

import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { CountBadge } from "@/components/shared/count-badge"
import { useCart } from "@/components/providers/cart-context"
import { useDrawer } from "@/components/providers/drawer-context"

const CART_BADGE_MAX = Number.MAX_SAFE_INTEGER

export function MobileCartDropdown() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { totalItems } = useCart()
  const { openCart, enabledDrawers } = useDrawer()
  const tNav = useTranslations("Navigation")
  const displayItems = totalItems

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatches by rendering a static fallback until client mount.
  if (!mounted) {
    return (
      <Link
        href="/cart"
        className="relative flex size-touch-md items-center justify-center rounded-md tap-transparent hover:bg-header-hover active:bg-header-active touch-manipulation"
        aria-label={tNav("cart")}
      >
        <span className="relative" aria-hidden="true">
          <ShoppingCart className="size-icon-header text-header-text" weight="regular" />
        </span>
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="relative flex size-touch-md appearance-none items-center justify-center rounded-md border-0 bg-transparent tap-transparent hover:bg-header-hover active:bg-header-active touch-manipulation"
      aria-label={tNav("cart")}
      aria-haspopup={enabledDrawers.cart ? "dialog" : undefined}
      onClick={() => {
        if (enabledDrawers.cart) {
          openCart()
          return
        }
        router.push("/cart")
      }}
    >
      <span className="relative" aria-hidden="true">
        <ShoppingCart className="size-icon-header text-header-text" weight="regular" />
        {displayItems > 0 && (
          <CountBadge
            count={displayItems}
            max={CART_BADGE_MAX}
            className="absolute -top-1 -right-1 h-4 min-w-4 bg-cart-badge px-1 text-2xs leading-none text-primary-foreground ring-1 ring-header-bg"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  )
}
