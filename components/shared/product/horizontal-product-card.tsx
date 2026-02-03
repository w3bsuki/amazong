"use client"

import * as React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Truck,
  Heart,
  Star,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import type { UIProduct } from "@/lib/data/products"
import { isBoostActiveNow } from "@/lib/boost/boost-status"

// =============================================================================
// TYPES
// =============================================================================

export interface HorizontalProductStripCardProps {
  product: UIProduct
  /** Disable quick view drawer (use direct link navigation) */
  disableQuickView?: boolean
}

// =============================================================================
// Horizontal Product Card - Clean mobile-first design (Vinted/Depop style)
// Used by: PromotedListingsStrip, OffersForYou, and similar components
// =============================================================================

export function HorizontalProductCard({ 
  product, 
  disableQuickView = false 
}: HorizontalProductStripCardProps) {
  const tProduct = useTranslations("Product")
  const { openProductQuickView, enabledDrawers, isDrawerSystemEnabled } = useDrawer()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isWishlistPending, setIsWishlistPending] = React.useState(false)
  
  const listPrice = product.listPrice
  const hasDiscount = typeof listPrice === "number" && listPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((listPrice - product.price) / listPrice) * 100)
    : 0
  const isBoostedActive = product.isBoosted
    ? product.boostExpiresAt
      ? isBoostActiveNow({ is_boosted: true, boost_expires_at: product.boostExpiresAt })
      : true
    : false
  const href = product.storeSlug && product.slug
    ? `/${product.storeSlug}/${product.slug}`
    : `/product/${product.id}`

  // Check if quick view drawer should be used
  const shouldUseQuickView = !disableQuickView && 
    isDrawerSystemEnabled && 
    enabledDrawers.productQuickView

  const inWishlist = isInWishlist(product.id)

  // Handle card click for quick view
  const handleCardClick = React.useCallback((e: React.MouseEvent) => {
    if (!shouldUseQuickView) return
    
    // Allow expected link behaviors (new tab, copy link, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    
    e.preventDefault()
    
    const quickViewData: QuickViewProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      ...(product.image && product.image !== "/placeholder.svg"
        ? { images: [product.image] }
        : {}),
      ...(product.listPrice != null ? { originalPrice: product.listPrice } : {}),
      ...(product.categoryPath ? { categoryPath: product.categoryPath } : {}),
      ...(product.condition != null ? { condition: product.condition } : {}),
      ...(product.location != null ? { location: product.location } : {}),
      ...(product.freeShipping !== undefined ? { freeShipping: product.freeShipping } : {}),
      ...(product.rating !== undefined ? { rating: product.rating } : {}),
      ...(product.reviews !== undefined ? { reviews: product.reviews } : {}),
      ...(product.slug != null ? { slug: product.slug } : {}),
      ...(product.storeSlug != null ? { username: product.storeSlug } : {}),
      ...(product.sellerId != null ? { sellerId: product.sellerId } : {}),
      ...(product.sellerName != null ? { sellerName: product.sellerName } : {}),
      ...(product.sellerAvatarUrl != null ? { sellerAvatarUrl: product.sellerAvatarUrl } : {}),
      ...(product.sellerVerified !== undefined ? { sellerVerified: product.sellerVerified } : {}),
    }
    
    openProductQuickView(quickViewData)
  }, [shouldUseQuickView, product, openProductQuickView])

  const handleWishlist = React.useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlistPending) return

    setIsWishlistPending(true)
    try {
      await toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    } finally {
      setIsWishlistPending(false)
    }
  }, [isWishlistPending, product, toggleWishlist])

  return (
    <Link
      href={href}
      onClick={handleCardClick}
      className="shrink-0 w-40 active:opacity-80 transition-opacity"
    >
      {/* Product Image */}
      <div className="relative aspect-square rounded-(--radius-card) overflow-hidden bg-muted mb-2">
        {/* AD badge - top left for boosted listings */}
        {isBoostedActive && (
          <Badge
            variant="promoted"
            className="absolute top-1.5 left-1.5 z-10"
          >
            <span>{tProduct("adBadge")}</span>
          </Badge>
        )}
        {/* Discount badge - below AD badge or at top if not boosted */}
        {hasDiscount && (
          <Badge
            variant="deal"
            className={cn(
              "absolute left-1.5 z-10 text-2xs font-bold",
              isBoostedActive ? "top-8" : "top-1.5"
            )}
          >
            -{discountPercent}%
          </Badge>
        )}
        
        {/* Free shipping badge - bottom left */}
        {product.freeShipping && (
          <Badge
            variant="shipping"
            className="absolute bottom-1.5 left-1.5 z-10 gap-0.5 text-2xs font-semibold"
          >
            <Truck size={10} weight="fill" />
            <span>{tProduct("freeDeliveryShort")}</span>
          </Badge>
        )}
        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute top-1.5 right-1.5 z-10 size-touch-xs bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors",
            inWishlist && "text-wishlist-active"
          )}
          aria-label={inWishlist ? tProduct("removeFromWishlist") : tProduct("addToWishlist")}
          aria-pressed={inWishlist}
          disabled={isWishlistPending}
        >
          <Heart className={cn("size-icon-xs", inWishlist ? "fill-current" : "text-foreground")} />
        </button>
        
        {/* Product Image */}
        {product.image && product.image !== "/placeholder.svg" ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={36} className="text-muted-foreground/15" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-0.5">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "text-sm font-bold",
              hasDiscount ? "text-price-sale" : "text-foreground"
            )}
          >
            €{product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-2xs text-muted-foreground line-through">
              €{listPrice.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-xs text-foreground line-clamp-2 leading-snug">
          {product.title}
        </p>
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={11} weight="fill" className="text-rating" />
            <span className="text-2xs text-muted-foreground">
              {product.rating.toFixed(1)}{" "}
              <span>({product.reviews?.toLocaleString()})</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
