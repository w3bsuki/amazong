"use client"

import { ShoppingCart } from "lucide-react"

import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { CountBadge } from "@/components/shared/count-badge"
import { useCart } from "@/components/providers/cart-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { IconButton } from "@/components/ui/icon-button"

const CART_BADGE_MAX = Number.MAX_SAFE_INTEGER

export function MobileCartDropdown() {
  const router = useRouter()
  const { totalItems, isReady } = useCart()
  const { openDrawer, enabledDrawers } = useDrawer()
  const tNav = useTranslations("Navigation")
  const displayItems = isReady ? totalItems : 0
  const cartAriaLabel = displayItems > 0 ? `${tNav("cart")} (${displayItems})` : tNav("cart")

  return (
    <IconButton
      type="button"
      variant="ghost"
      size="icon-default"
      className="group relative rounded-full p-0 text-header-text touch-manipulation tap-transparent"
      aria-label={cartAriaLabel}
      aria-haspopup={enabledDrawers.cart ? "dialog" : undefined}
      onClick={() => {
        if (enabledDrawers.cart) {
          openDrawer("cart")
          return
        }
        router.push("/cart")
      }}
    >
      <span className="relative flex items-center justify-center" aria-hidden="true">
        <ShoppingCart className="size-6 text-header-text" />
        {displayItems > 0 && (
          <CountBadge
            count={displayItems}
            max={CART_BADGE_MAX}
            className="absolute -top-2 -right-2.5 bg-cart-badge text-primary-foreground ring-2 ring-header-bg"
            aria-hidden="true"
          />
        )}
      </span>
    </IconButton>
  )
}
