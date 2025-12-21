"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Heart,
  ShoppingCart, 
  Plus,
  Star, 
  Sparkle,
  Truck
} from "@phosphor-icons/react"

// =============================================================================
// CVA VARIANTS - Target style with semantic states
// =============================================================================

const cardVariants = cva(
  "group cursor-pointer",
  {
    variants: {
      state: {
        default: "",
        promoted: "",
        sale: "",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

export interface ProductCardProps extends VariantProps<typeof cardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null
  /** @deprecated Use originalPrice */
  listPrice?: number | null

  // Product info
  rating?: number
  reviews?: number
  condition?: string
  brand?: string
  categorySlug?: string
  tags?: string[]
  isPrime?: boolean
  make?: string | null
  model?: string | null
  year?: string | number | null
  color?: string | null
  size?: string | null

  // Seller
  sellerName?: string
  sellerVerified?: boolean
  sellerRating?: number
  location?: string
  sellerId?: string | null

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null
  /** @deprecated Use username */
  storeSlug?: string | null

  // Feature toggles
  showQuickAdd?: boolean
  showRating?: boolean
  /** @deprecated Use state="promoted" */
  isBoosted?: boolean
  
  // Backward compat (all ignored)
  showPills?: boolean
  showSeller?: boolean
  showWishlist?: boolean
  density?: string
  variant?: string
  showCategory?: boolean
  showSellerRow?: boolean
  showMetaLine?: boolean
  showTagChips?: boolean
  showHoverActions?: boolean
  showAddToCart?: boolean
  showRatingSeller?: boolean
  showCondition?: boolean
  showBidInfo?: boolean
  showFreeShipping?: boolean
  showDiscount?: boolean
  showBadge?: boolean
  showAttributePills?: boolean
  attributes?: Record<string, string>
  sellerTier?: string
  sellerAvatarUrl?: string | null

  // Context
  index?: number
  currentUserId?: string | null
  inStock?: boolean
}



// =============================================================================
// MAIN COMPONENT - TARGET STYLE
// =============================================================================

export function ProductCard({
  // Required
  id,
  title,
  price,
  image,

  // Pricing
  originalPrice,
  listPrice,

  // Product info
  rating = 0,
  reviews = 0,
  brand,
  sellerId,

  // Shipping
  freeShipping = false,

  // URLs
  slug,
  username,
  storeSlug,

  // CVA
  state,
  isBoosted,

  // Feature toggles
  showQuickAdd = true,
  showRating = true,

  // Context
  index = 0,
  currentUserId,
  inStock = true,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations("Product")
  const tCart = useTranslations("Cart")
  const locale = useLocale()
  
  // Local state for interactive elements
  const [wishlisted, setWishlisted] = useState(false)
  const [inCart, setInCart] = useState(false)

  // Resolve deprecated fallbacks
  const resolvedOriginalPrice = originalPrice ?? listPrice ?? null
  const resolvedUsername = username ?? storeSlug ?? null

  // Derived values
  const hasDiscount = resolvedOriginalPrice && resolvedOriginalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((resolvedOriginalPrice - price) / resolvedOriginalPrice) * 100)
    : 0

  // Auto-detect state based on props
  const resolvedState = state || (isBoosted ? "promoted" : hasDiscount && discountPercent >= 10 ? "sale" : "default")

  // URLs
  const productUrl = resolvedUsername && slug ? `/${resolvedUsername}/${slug}` : `/product/${slug || id}`

  // Loading strategy
  const loadingStrategy = getImageLoadingStrategy(index, 4)

  // Check if own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Price formatting
  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p)

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
    setInCart(true)
    toast.success(tCart("itemAdded"))
  }

  // Wishlist handler
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(!wishlisted)
    toast.success(wishlisted 
      ? (locale === "bg" ? "Премахнато от любими" : "Removed from favorites")
      : (locale === "bg" ? "Добавено в любими" : "Added to favorites")
    )
  }

  return (
    <Link href={productUrl} className={cn(cardVariants({ state: resolvedState }))}>
      {/* IMAGE SECTION - Target style: rounded-lg, bg-muted, hover zoom */}
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <AspectRatio ratio={1}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover size-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            placeholder="blur"
            blurDataURL={productBlurDataURL()}
            loading={loadingStrategy.loading}
            priority={loadingStrategy.priority}
          />
        </AspectRatio>

        {/* Wishlist Button - Top Right (always visible) */}
        <button 
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 z-10 size-8 rounded-full flex items-center justify-center transition-all",
            "bg-background/90 shadow-sm hover:shadow-md hover:bg-background",
            wishlisted && "bg-primary/10"
          )}
        >
          <Heart 
            size={16} 
            weight={wishlisted ? "fill" : "regular"} 
            className={wishlisted ? "text-primary" : "text-muted-foreground"} 
          />
        </button>

        {/* Add to Cart Circle - Bottom Right (Target signature) */}
        {showQuickAdd && (
          <button 
            onClick={handleAddToCart}
            disabled={isOwnProduct || !inStock}
            className={cn(
              "absolute bottom-2 right-2 z-10 size-9 rounded-full flex items-center justify-center transition-all shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              inCart 
                ? "bg-primary text-primary-foreground" 
                : "bg-background text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {inCart ? (
              <ShoppingCart size={18} weight="fill" />
            ) : (
              <Plus size={18} weight="bold" />
            )}
          </button>
        )}

        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {/* Promoted badge */}
          {resolvedState === "promoted" && (
            <span className="inline-flex items-center gap-1 rounded bg-primary text-primary-foreground px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              <Sparkle size={10} weight="fill" />
              {locale === "bg" ? "Промо" : "Ad"}
            </span>
          )}
          {/* Sale badge */}
          {hasDiscount && discountPercent >= 5 && (
            <span className="rounded bg-destructive text-destructive-foreground px-2 py-0.5 text-xs font-bold shadow-sm">
              {locale === "bg" ? "Намаление" : "Sale"}
            </span>
          )}
        </div>
      </div>

      {/* CONTENT SECTION - Target style: outside image, clean spacing */}
      <div className="pt-2.5 space-y-0.5">
        {/* Brand - Small muted text */}
        {brand && (
          <p className="text-xs text-muted-foreground truncate">{brand}</p>
        )}

        {/* Title - Medium weight, 2 lines max */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className={cn(
            "text-base font-bold",
            hasDiscount ? "text-primary" : "text-foreground"
          )}>
            {formatPrice(price)}
          </span>
          {hasDiscount && resolvedOriginalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(resolvedOriginalPrice)}
            </span>
          )}
        </div>

        {/* Rating Row - Target style stars */}
        {showRating && rating > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i} 
                  size={10} 
                  weight="fill" 
                  className={i <= Math.floor(rating) ? "text-primary" : "text-muted-foreground/30"} 
                />
              ))}
            </div>
            {reviews > 0 && (
              <span className="text-xs text-muted-foreground">
                {reviews.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Free Shipping Badge */}
        {freeShipping && (
          <p className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
            <Truck size={12} weight="bold" />
            {locale === "bg" ? "Безплатна доставка" : "Free shipping"}
          </p>
        )}
      </div>
    </Link>
  )
}
