"use client"

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
import type { UIProduct } from "@/lib/data/products"

// =============================================================================
// TYPES
// =============================================================================

export interface HorizontalProductStripCardProps {
  product: UIProduct
}

// =============================================================================
// Horizontal Product Card - Clean mobile-first design (Vinted/Depop style)
// Used by: PromotedListingsStrip, OffersForYou, and similar components
// =============================================================================

export function HorizontalProductCard({ product }: HorizontalProductStripCardProps) {
  const tProduct = useTranslations("Product")
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
      className="shrink-0 w-36 active:opacity-80 transition-opacity snap-start"
    >
      {/* Product Image */}
      <div className="relative aspect-square rounded-(--radius-card) overflow-hidden bg-muted mb-1.5">
        {/* Badge stack - top left, compact */}
        <div className="absolute top-1 left-1 z-10 flex flex-col gap-0.5">
          {/* AD badge for boosted */}
          {product.isBoosted && (
            <Badge variant="promoted" className="text-[10px]">
              {tProduct("adBadge")}
            </Badge>
          )}
          {/* Discount badge */}
          {hasDiscount && discountPercent >= 5 && (
            <Badge variant="sale" className="text-[10px]">
              -{discountPercent}%
            </Badge>
          )}
          {/* Free shipping - icon only on mobile */}
          {product.freeShipping && (
            <Badge variant="shipping" className="text-[10px]">
              <Truck size={10} weight="fill" />
            </Badge>
          )}
        </div>
        
        {/* Wishlist button - top right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-1 right-1 z-10 size-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
          aria-label={tProduct("addToWishlist")}
        >
          <Heart size={14} className="text-foreground" />
        </button>
        
        {/* Product Image */}
        {product.image && product.image !== "/placeholder.svg" ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="144px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={32} className="text-muted-foreground/15" />
          </div>
        )}
      </div>

      {/* Content - clean hierarchy */}
      <div className="space-y-0.5">
        {/* Price row */}
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              hasDiscount ? "text-price-sale" : "text-foreground"
            )}
          >
            €{product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-2xs text-muted-foreground line-through tabular-nums">
              €{product.listPrice!.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Title */}
        <p className="text-xs text-foreground line-clamp-2 leading-tight">
          {product.title}
        </p>
        
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-0.5">
            <Star size={10} weight="fill" className="text-rating" />
            <span className="text-2xs text-muted-foreground tabular-nums">
              {product.rating.toFixed(1)}
              {product.reviews && product.reviews > 0 && (
                <span> ({product.reviews.toLocaleString()})</span>
              )}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
