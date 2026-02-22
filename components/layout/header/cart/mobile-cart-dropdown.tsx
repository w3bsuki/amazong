import { ShoppingCart } from "lucide-react"

import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { CountBadge } from "@/components/shared/count-badge"
import { useCart } from "@/components/providers/cart-context"
import { useDrawer } from "@/components/providers/drawer-context"

const CART_BADGE_MAX = Number.MAX_SAFE_INTEGER

export function MobileCartDropdown() {
  const router = useRouter()
  const { totalItems, isReady } = useCart()
  const { openDrawer, enabledDrawers } = useDrawer()
  const tNav = useTranslations("Navigation")
  const displayItems = isReady ? totalItems : 0
  const cartAriaLabel = displayItems > 0 ? `${tNav("cart")} (${displayItems})` : tNav("cart")

  return (
    <button
      type="button"
      className="group relative flex size-(--control-default) appearance-none items-center justify-center rounded-full p-0 text-header-text touch-manipulation tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
      <span
        className="relative flex size-(--control-compact) items-center justify-center rounded-full bg-surface-subtle motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none group-hover:bg-hover group-active:bg-active"
        aria-hidden="true"
      >
        <ShoppingCart className="size-icon-sm text-header-text" />
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
