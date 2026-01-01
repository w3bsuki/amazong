"use client"

import * as React from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/common/spinner"
import { ProductAttributeBadge } from "@/components/shared/product/product-attribute-badge"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, ShoppingCart, Plus, Truck, Star, CurrencyEur } from "@phosphor-icons/react"

// =============================================================================
// DESIGN SYSTEM COMPLIANCE (_MASTER.md)
// =============================================================================
// Typography: Price 18px (mobile) / 20px (desktop), Title 13px, Meta 11px
// Spacing: gap-1.5 (6px) grid, p-1.5 content
// Touch targets: 24px min, 28px wishlist, 32px quick-add
// Aspect ratio: 4:5 for grid cards (taller = more product visible)
// No hover scale, no shimmer, no gradients

// =============================================================================
// CVA VARIANTS - Clean, Flat, Professional (eBay aesthetic)
// =============================================================================

const productCardVariants = cva(
  "group relative block h-full min-w-0 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        featured: "",
      },
      state: {
        default: "",
        promoted: "",
        sale: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
)

// =============================================================================
// TYPES - Essential props only
// =============================================================================

interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null
  isOnSale?: boolean
  salePercent?: number

  // Product info - for smart badge
  categoryRootSlug?: string
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }>
  attributes?: Record<string, string>

  // Seller
  sellerId?: string | null
  sellerName?: string
  sellerAvatarUrl?: string | null

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null

  // Feature toggles
  showQuickAdd?: boolean
  showWishlist?: boolean
  showSeller?: boolean

  // Context
  index?: number
  currentUserId?: string | null
  inStock?: boolean
  className?: string
  
  // Legacy props (accepted but ignored for backwards compat)
  rating?: number
  reviews?: number
  condition?: string
  brand?: string
  tags?: string[]
  location?: string
  categorySlug?: string
  make?: string | null
  model?: string | null
  year?: string | number | null
  color?: string | null
  size?: string | null
  sellerVerified?: boolean
  sellerRating?: number
  sellerTier?: "basic" | "premium" | "business"
  initialIsFollowingSeller?: boolean
  saleEndDate?: string | null
  showRating?: boolean
}

function getProductCardImageSrc(src: string): string {
  if (!src) return PLACEHOLDER_IMAGE_PATH
  const isRemote = /^https?:\/\//i.test(src)
  const normalized = normalizeImageUrl(src)
  if (!normalized) return PLACEHOLDER_IMAGE_PATH
  if (normalized === PLACEHOLDER_IMAGE_PATH) return normalized
  if (process.env.NEXT_PUBLIC_E2E === "true" && isRemote) {
    return PLACEHOLDER_IMAGE_PATH
  }
  return normalized
}

// =============================================================================
// PRODUCT CARD COMPONENT - Clean, Minimal, Price-First
// =============================================================================

function ProductCard({
  id,
  title,
  price,
  image,
  originalPrice,
  isOnSale,
  salePercent,
  categoryPath,
  categoryRootSlug,
  attributes,
  sellerId,
  sellerName,
  sellerAvatarUrl,
  freeShipping = false,
  slug,
  username,
  variant = "default",
  state,
  showQuickAdd = true,
  showWishlist = true,
  showSeller = true,
  index = 0,
  currentUserId,
  inStock = true,
  className,
  ref,
  rating,
  reviews,
}: ProductCardProps & { ref?: React.Ref<HTMLDivElement> }) {
    const router = useRouter()
    const { addToCart, items: cartItems } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const t = useTranslations("Product")
    const tCart = useTranslations("Cart")
    const locale = useLocale()

    const [isWishlistPending, setIsWishlistPending] = React.useState(false)

    // Derived values
    const hasDiscount = originalPrice && originalPrice > price
    const discountPercent = hasDiscount
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : (salePercent ?? 0)

    // Resolve state
    const resolvedState = state ?? (isOnSale || hasDiscount ? "sale" : "default")

    // URLs
    const productUrl = username ? `/${username}/${slug || id}` : "#"
    // Seller display name (prefer sellerName, fallback to username)
    const displaySellerName = showSeller ? (sellerName || username || null) : null

    const inWishlist = isInWishlist(id)
    const inCart = React.useMemo(() => cartItems.some((item) => item.id === id), [cartItems, id])

    const handleOpenProduct = React.useCallback(() => {
      router.push(productUrl)
    }, [router, productUrl])

    // Loading strategy
    const loadingStrategy = getImageLoadingStrategy(index, 4)
    const imageSrc = React.useMemo(() => getProductCardImageSrc(image), [image])

    // Check if own product
    const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

    // Price formatting
    const formatPriceParts = (p: number) => {
      const formatter = new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      return formatter.formatToParts(p)
    }

    const PriceDisplay = ({ price, className }: { price: number, className?: string }) => {
      const parts = formatPriceParts(price)
      const currency = parts.find(p => p.type === "currency")?.value
      const value = parts.filter(p => p.type !== "currency").map(p => p.value).join("")
      const isEuro = currency === "€" || currency === "EUR"
      
      return (
        <span className={cn("flex items-center", className)}>
          {currency && (
            <span className="mr-0.5 flex items-center text-muted-foreground">
              {isEuro ? (
                <CurrencyEur size="0.85em" weight="bold" />
              ) : (
                <span className="text-[0.85em] font-bold">{currency}</span>
              )}
            </span>
          )}
          <span>{value}</span>
        </span>
      )
    }

    // Handlers
    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isOwnProduct) {
        toast.error(t("cannotBuyOwnProduct"))
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
        ...(slug ? { slug } : {}),
        ...(username ? { username } : {}),
      })
      toast.success(tCart("itemAdded"))
    }

    const handleWishlist = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isWishlistPending) return
      setIsWishlistPending(true)
      try {
        await toggleWishlist({ id, title, price, image })
      } finally {
        setIsWishlistPending(false)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(productCardVariants({ variant, state: resolvedState }), className)}
        onClick={handleOpenProduct}
      >
        {/* Full-card link for accessibility */}
        <Link
          href={productUrl}
          className="absolute inset-0 z-1"
          aria-label={t("openProduct", { title })}
        >
          <span className="sr-only">{title}</span>
        </Link>

        {/* IMAGE SECTION - 4:5 aspect ratio per _MASTER.md */}
        <div className="relative overflow-hidden rounded bg-muted">
          <AspectRatio ratio={4 / 5}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={productBlurDataURL()}
              loading={loadingStrategy.loading}
              priority={loadingStrategy.priority}
            />
          </AspectRatio>

          {/* Discount badge - 11px font-semibold per _MASTER.md */}
          {hasDiscount && discountPercent >= 5 && (
            <span className="absolute left-1.5 top-1.5 z-10 rounded bg-destructive px-2 py-0.5 text-tiny font-semibold text-destructive-foreground">
              -{discountPercent}%
            </span>
          )}

          {/* Wishlist - Top Right */}
          {showWishlist && (
            <button
              type="button"
              className="absolute right-1.5 top-1.5 z-10 flex h-8 w-8 items-center justify-center"
              onClick={handleWishlist}
              aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background/90 shadow-sm backdrop-blur-sm transition-transform active:scale-95",
                  inWishlist && "bg-cta-trust-blue/10 border-cta-trust-blue/20"
                )}
              >
                {isWishlistPending ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Heart
                    size={16}
                    weight={inWishlist ? "fill" : "regular"}
                    className={inWishlist ? "text-cta-trust-blue" : "text-muted-foreground"}
                  />
                )}
              </span>
            </button>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="relative z-10 flex flex-col gap-1 p-1.5">
          {/* Category/attribute badge - TOP position */}
          <ProductAttributeBadge
            categoryRootSlug={categoryRootSlug}
            attributes={attributes}
            categoryPath={categoryPath}
            locale={locale}
          />

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
            {title}
          </h3>

          {/* Rating (if available) */}
          {!!(rating || reviews) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="flex items-center text-warning">
                <Star weight="fill" size={12} />
                <span className="ml-0.5 font-medium text-foreground">{rating?.toFixed(1) || "4.5"}</span>
              </div>
              <span>({reviews || 0})</span>
            </div>
          )}

          <div className="mt-1 flex items-end justify-between gap-1">
            <div className="flex flex-col gap-0.5">
              {/* Price - Prominent */}
              <div className="flex items-center gap-1">
                <PriceDisplay 
                  price={price} 
                  className={cn(
                    "text-base font-bold leading-none",
                    hasDiscount ? "text-price-sale" : "text-foreground"
                  )} 
                />
                {hasDiscount && originalPrice && (
                  <span className="text-xs text-muted-foreground line-through opacity-70">
                    <PriceDisplay price={originalPrice} className="text-[10px]" />
                  </span>
                )}
              </div>

              {/* Seller - Subtle */}
              {displaySellerName && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Avatar className="h-3.5 w-3.5 border border-border/50">
                    <AvatarImage src={sellerAvatarUrl || undefined} alt={displaySellerName} />
                    <AvatarFallback className="text-[6px] font-medium">
                      {displaySellerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs max-w-[100px]">
                    {displaySellerName}
                  </span>
                </div>
              )}

              {/* Free shipping */}
              {freeShipping && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-success">
                  <Truck size={10} weight="bold" />
                  <span>{t("freeShipping")}</span>
                </div>
              )}
            </div>

            {/* Quick Add Button - Bottom Right */}
            {showQuickAdd && (
              <button
                type="button"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all active:scale-95",
                  inCart 
                    ? "border-cta-trust-blue bg-cta-trust-blue text-cta-trust-blue-text shadow-sm" 
                    : "border-border bg-background hover:bg-muted text-foreground hover:border-foreground/20"
                )}
                onClick={handleAddToCart}
                disabled={isOwnProduct || !inStock}
                aria-label={inCart ? t("inCart") : t("addToCart")}
              >
                {inCart ? (
                  <ShoppingCart size={18} weight="fill" />
                ) : (
                  <ShoppingCart size={18} weight="bold" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    )
}

// =============================================================================
// PRODUCT GRID - Dense Marketplace Style (_MASTER.md compliant)
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  /** Grid density: compact (Temu), default (eBay), comfortable (Airbnb) */
  density?: "compact" | "default" | "comfortable"
  className?: string
}

/**
 * ProductGrid - Responsive CSS Grid
 * Mobile: 2 cols, gap-1.5 (6px), px-2 (8px)
 * Tablet: 3 cols, gap-2 (8px)
 * Desktop: 4-5 cols, gap-3 (12px)
 */
function ProductGrid({ children, density = "default", className }: ProductGridProps) {
  const densityClasses = {
    compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    comfortable: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div
      className={cn(
        "grid gap-1.5 px-2 sm:gap-2 sm:px-3 lg:gap-3 lg:px-4",
        densityClasses[density],
        className
      )}
    >
      {children}
    </div>
  )
}

ProductGrid.displayName = "ProductGrid"

// =============================================================================
// SKELETON - Clean, no shimmer per _MASTER.md
// =============================================================================

interface ProductCardSkeletonProps {
  className?: string
}

function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("h-full overflow-hidden", className)}>
      {/* Image skeleton - 4:5 aspect */}
      <div className="rounded bg-muted">
        <AspectRatio ratio={4 / 5}>
          <Skeleton className="h-full w-full rounded-none" />
        </AspectRatio>
      </div>
      {/* Content skeleton */}
      <div className="flex flex-1 flex-col gap-1.5 px-2 py-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        <div className="flex-1" />
        
        <div className="mt-1 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

ProductCardSkeleton.displayName = "ProductCardSkeleton"

// =============================================================================
// SKELETON GRID
// =============================================================================

interface ProductCardSkeletonGridProps {
  count?: number
  density?: "compact" | "default" | "comfortable"
  className?: string
}

function ProductCardSkeletonGrid({
  count = 8,
  density = "default",
  className,
}: ProductCardSkeletonGridProps) {
  return (
    <ProductGrid density={density} className={className ?? ""}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </ProductGrid>
  )
}

ProductCardSkeletonGrid.displayName = "ProductCardSkeletonGrid"

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ProductCard,
  ProductGrid,
  ProductCardSkeleton,
  ProductCardSkeletonGrid,
  productCardVariants,
  type ProductCardProps,
  type ProductGridProps,
  type ProductCardSkeletonProps,
  type ProductCardSkeletonGridProps,
}
