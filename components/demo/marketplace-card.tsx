"use client"

import Image from "next/image"
import Link from "next/link"
import { WishlistButton } from "@/components/common/wishlist/wishlist-button"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  MapPin,
  Clock,
  Sparkle,
  Lightning,
} from "@phosphor-icons/react"

// =============================================================================
// MARKETPLACE CARD - eBay/Vinted Hybrid
// =============================================================================
// Design principles:
// 1. NO BORDERS ON IMAGE - let product breathe
// 2. NO SHADOWS - flat like eBay (respects --shadow-product: none)
// 3. Price FIRST and BOLD
// 4. Compact seller line with verification
// 5. Location + time for marketplace trust
// 6. 3:4 aspect ratio for more product visibility
// 7. Minimal chrome, maximum product
// =============================================================================

export interface MarketplaceCardProps {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null

  // Product info
  brand?: string
  condition?: string

  // Seller
  sellerName?: string
  sellerVerified?: boolean
  sellerRating?: number

  // Location & Time (marketplace trust signals)
  location?: string
  timeAgo?: string

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null

  // States
  isPromoted?: boolean
  inStock?: boolean

  // Feature toggles
  showSeller?: boolean
  showQuickAdd?: boolean

  // Context
  index?: number
  currentUserId?: string | null
  sellerId?: string | null
}

export function MarketplaceCard({
  id,
  title,
  price,
  image,
  originalPrice,
  brand,
  condition,
  sellerName,
  sellerVerified = false,
  sellerRating,
  location,
  timeAgo,
  freeShipping = false,
  slug,
  username,
  isPromoted = false,
  inStock = true,
  showSeller = true,
  showQuickAdd = true,
  index = 0,
  currentUserId,
  sellerId,
}: MarketplaceCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations("Product")
  const tCart = useTranslations("Cart")
  const locale = useLocale()

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // URLs
  const productUrl = username && slug ? `/${username}/${slug}` : `/product/${slug || id}`

  // Loading strategy
  const loadingStrategy = getImageLoadingStrategy(index, 4)

  // Check if own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Price formatting - clean, no decimals for whole numbers
  const formatPrice = (p: number) => {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: p % 1 === 0 ? 0 : 2,
    }).format(p)
    return formatted
  }

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOwnProduct) {
      toast.error(locale === "bg" ? "Не можете да купите собствен продукт" : "Cannot buy your own product")
      return
    }
    if (!inStock) {
      toast.error(t("outOfStock"))
      return
    }

    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
      slug: slug || undefined,
      username: username || undefined,
    })
    toast.success(tCart("itemAdded"))
  }

  return (
    <Link 
      href={productUrl} 
      className="group block relative"
    >
      {/* IMAGE - Full bleed, no border, 3:4 ratio */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          placeholder="blur"
          blurDataURL={productBlurDataURL()}
          loading={loadingStrategy.loading}
          priority={loadingStrategy.priority}
        />

        {/* Promoted badge - subtle, top-left */}
        {isPromoted && (
          <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-sm bg-primary/90 text-primary-foreground px-1.5 py-0.5 text-[10px] font-semibold">
            <Sparkle size={10} weight="fill" />
            {locale === "bg" ? "Промо" : "Promoted"}
          </span>
        )}

        {/* Wishlist - visible on hover (desktop) or always (mobile) */}
        <div
          className="absolute top-2 right-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        >
          <WishlistButton 
            product={{ id, title, price, image }} 
            className="size-8 rounded-full bg-background/80 backdrop-blur-sm border-0 hover:bg-background"
          />
        </div>

        {/* Quick Add - desktop hover only */}
        {showQuickAdd && (
          <div
            className="absolute inset-x-2 bottom-2 z-10 hidden md:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <button
              onClick={handleAddToCart}
              disabled={isOwnProduct || !inStock}
              className={cn(
                "w-full h-9 rounded-md text-xs font-semibold transition-colors",
                "bg-foreground/95 text-background hover:bg-foreground",
                "flex items-center justify-center gap-1.5 backdrop-blur-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ShoppingCart size={14} weight="bold" />
              {!inStock 
                ? (locale === "bg" ? "Изчерпано" : "Sold") 
                : (locale === "bg" ? "Добави" : "Add to cart")}
            </button>
          </div>
        )}
      </div>

      {/* CONTENT - Minimal padding, tight spacing */}
      <div className="pt-2.5 space-y-1">
        {/* PRICE ROW - Always first, always prominent */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={cn(
            "text-base font-bold tracking-tight",
            hasDiscount ? "text-destructive" : "text-foreground"
          )}>
            {formatPrice(price)}
          </span>
          {hasDiscount && originalPrice && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-xs font-semibold text-destructive">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* TITLE - 2 lines max */}
        <h3 className="text-sm text-foreground leading-snug line-clamp-2">
          {title}
        </h3>

        {/* META LINE - Brand/Condition (optional) */}
        {(brand || condition) && (
          <p className="text-xs text-muted-foreground">
            {[brand, condition].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* FREE SHIPPING - Important trust signal */}
        {freeShipping && (
          <p className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <Lightning size={12} weight="fill" />
            {locale === "bg" ? "Безплатна доставка" : "Free shipping"}
          </p>
        )}

        {/* SELLER LINE - Compact trust row */}
        {showSeller && sellerName && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 min-w-0">
              <span className="truncate max-w-[90px]">{sellerName}</span>
              {sellerVerified && (
                <ShieldCheck size={12} weight="fill" className="text-primary shrink-0" />
              )}
            </span>
            {sellerRating && sellerRating > 0 && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-0.5 shrink-0">
                  <Star size={10} weight="fill" className="text-amber-500" />
                  {sellerRating.toFixed(1)}
                </span>
              </>
            )}
          </div>
        )}

        {/* LOCATION + TIME - C2C trust signals */}
        {(location || timeAgo) && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80">
            {location && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate max-w-[70px]">{location}</span>
              </span>
            )}
            {timeAgo && (
              <span className="inline-flex items-center gap-0.5">
                <Clock size={10} className="shrink-0" />
                {timeAgo}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

// =============================================================================
// SKELETON - Same layout, loading state
// =============================================================================

export function MarketplaceCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-md bg-muted" />
      <div className="pt-2.5 space-y-2">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    </div>
  )
}
