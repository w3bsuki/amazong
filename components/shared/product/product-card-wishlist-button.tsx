"use client"

import * as React from "react"
import { useWishlist } from "@/components/providers/wishlist-context"
import { Heart } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format count with K suffix for thousands (1234 → "1.2K")
 */
function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`
  }
  return count.toString()
}

// =============================================================================
// TYPES
// =============================================================================

export interface ProductCardWishlistButtonProps {
  id: string
  title: string
  price: number
  image: string
  favoritesCount?: number
  isOwnProduct?: boolean
  className?: string
}

// =============================================================================
// COMPONENT - Top-right wishlist button with count
// =============================================================================

/**
 * ProductCardWishlistButton - Clickable heart with favorites count
 * 
 * Positioned in top-right of product card image
 * Shows: ♥ 234 or just ♥ if no count
 */
export function ProductCardWishlistButton({
  id,
  title,
  price,
  image,
  favoritesCount,
  isOwnProduct = false,
  className,
}: ProductCardWishlistButtonProps) {
  const t = useTranslations("Product")
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isPending, setIsPending] = React.useState(false)

  const inWishlist = isInWishlist(id)
  const hasCount = favoritesCount != null && favoritesCount > 0

  const handleClick = React.useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending || isOwnProduct) return
    
    setIsPending(true)
    try {
      await toggleWishlist({ id, title, price, image })
    } finally {
      setIsPending(false)
    }
  }, [id, title, price, image, isPending, isOwnProduct, toggleWishlist])

  return (
    <button
      type="button"
      className={cn(
        "absolute right-1.5 top-1.5 z-10 inline-flex items-center gap-0.5 rounded-full h-touch-xs px-1.5 outline-none transition-all lg:gap-1 lg:h-touch-sm lg:px-2",
        "bg-background/90 backdrop-blur-sm shadow-sm",
        // Show/hide on hover for desktop when not in wishlist and no count
        !inWishlist && !hasCount && "lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-150",
        // Pending state
        isPending && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      disabled={isPending || isOwnProduct}
      aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
    >
      <Heart 
        className={cn(
          "shrink-0 transition-colors size-icon-xs",
          inWishlist ? "text-wishlist-active" : "text-muted-foreground"
        )}
        weight={inWishlist ? "fill" : "regular"}
      />
      {hasCount && (
        <span className={cn(
          "hidden text-2xs font-medium tabular-nums lg:inline",
          inWishlist ? "text-wishlist-active" : "text-muted-foreground"
        )}>
          {formatCount(favoritesCount)}
        </span>
      )}
    </button>
  )
}
