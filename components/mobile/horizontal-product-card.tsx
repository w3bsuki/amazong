"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  Sparkle as SparkleIcon,
  Package,
  Truck,
  Heart,
  Star,
} from "@phosphor-icons/react"
import type { UIProduct } from "@/lib/data/products"

// =============================================================================
// TYPES
// =============================================================================

export interface HorizontalProductStripCardProps {
  product: UIProduct
}

// =============================================================================
// Horizontal Product Card - Shared card for mobile horizontal scroll strips
// Used by: PromotedListingsStrip, OffersForYou, and similar components
// =============================================================================

export function HorizontalProductCard({ product }: HorizontalProductStripCardProps) {
  const hasDiscount = product.listPrice && product.listPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.listPrice! - product.price) / product.listPrice!) * 100)
    : 0
  const href = product.storeSlug && product.slug
    ? `/${product.storeSlug}/${product.slug}`
    : `/product/${product.id}`

  return (
    <Link
      href={href}
      className="shrink-0 w-40 active:opacity-80 transition-opacity"
    >
      {/* Product Image */}
      <div className="relative aspect-square rounded-(--radius-card) overflow-hidden bg-muted mb-2">
        {/* AD badge - top left for boosted listings */}
        {product.isBoosted && (
          <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-fire text-primary-foreground text-2xs font-bold rounded flex items-center gap-0.5">
            <SparkleIcon size={10} weight="fill" />
            <span>AD</span>
          </div>
        )}
        {/* Discount badge - below AD badge or at top if not boosted */}
        {hasDiscount && (
          <div className={cn(
            "absolute left-1.5 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded",
            product.isBoosted ? "top-8" : "top-1.5"
          )}>
            -{discountPercent}%
          </div>
        )}
        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-1.5 right-1.5 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={16} className="text-foreground" />
        </button>
        {/* Free shipping badge - bottom left */}
        {product.freeShipping && (
          <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-shipping-free text-primary-foreground text-2xs font-medium rounded flex items-center gap-0.5">
            <Truck size={10} weight="fill" />
            <span>Free</span>
          </div>
        )}
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
              €{product.listPrice!.toFixed(2)}
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
              <span className="opacity-60">({product.reviews?.toLocaleString()})</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
