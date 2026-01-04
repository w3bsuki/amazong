"use client"

import * as React from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn, safeAvatarSrc } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { buildHeroBadgeText } from "@/lib/product-card-hero-attributes"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, ShoppingCart, Plus, Star, SealCheck, Truck } from "@phosphor-icons/react"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const productCardVariants = cva(
  "tap-transparent group relative block h-full min-w-0 cursor-pointer overflow-hidden bg-transparent focus-within:ring-2 focus-within:ring-ring/40 lg:rounded-md lg:border lg:border-transparent lg:bg-card lg:transition-[border-color,box-shadow] lg:duration-100 lg:hover:border-border lg:hover:shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        featured: "lg:border-primary/30 lg:bg-primary/[0.02]",
      },
      state: {
        default: "",
        promoted: "lg:border-amber-500/40",
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
// TYPES - Essential props + B2B support
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
  sellerVerified?: boolean

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

  // Rating & social proof (Pro Commerce style)
  rating?: number
  reviews?: number
  soldCount?: number

  // Condition for C2C
  condition?: "new" | "like_new" | "used" | "refurbished" | string

  // B2B specific
  minOrderQuantity?: number
  bulkPricing?: { qty: number; price: number }[]
  businessVerified?: boolean
  samplesAvailable?: boolean

  // Legacy props (accepted but ignored for backwards compat)
  brand?: string
  tags?: string[]
  location?: string
  categorySlug?: string
  make?: string | null
  model?: string | null
  year?: string | number | null
  color?: string | null
  size?: string | null
  sellerRating?: number
  sellerTier?: "basic" | "premium" | "business"
  initialIsFollowingSeller?: boolean
  saleEndDate?: string | null
  showRating?: boolean
}

function getProductCardImageSrc(src: string): string {
  if (!src) return PLACEHOLDER_IMAGE_PATH
  const normalized = normalizeImageUrl(src)
  if (!normalized) return PLACEHOLDER_IMAGE_PATH
  return normalized === PLACEHOLDER_IMAGE_PATH ? PLACEHOLDER_IMAGE_PATH : normalized
}

/**
 * Format count with K suffix for thousands (1234 → "1.2K")
 */
function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// =============================================================================
// PRODUCT CARD COMPONENT - Pro Commerce: Temu Density + eBay Trust + Shein Polish
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
  sellerVerified,
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
  soldCount,
  condition,
  // B2B props
  minOrderQuantity,
  businessVerified,
  samplesAvailable,
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

  // Smart badge text (category-aware attributes)
  const smartBadge = React.useMemo(() => {
    return buildHeroBadgeText(categoryRootSlug, attributes, categoryPath, locale)
  }, [categoryRootSlug, attributes, categoryPath, locale])

  // Condition badge helper (C2C feature)
  const conditionLabel = React.useMemo(() => {
    if (!condition) return null
    const c = condition.toLowerCase()
    if (c === "new" || c === "novo" || c === "ново") return locale === "bg" ? "Ново" : "New"
    if (c === "like_new" || c === "like new" || c === "като ново") return locale === "bg" ? "Като ново" : "Like New"
    if (c === "used" || c === "употребявано") return locale === "bg" ? "Употр." : "Used"
    if (c === "refurbished" || c === "рефърбиш") return locale === "bg" ? "Рефърб." : "Refurb"
    return condition.slice(0, 8)
  }, [condition, locale])

  // Price formatting (memoized for performance)
  const formattedPrice = React.useMemo(() => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }, [price, locale])

  const formattedOriginalPrice = React.useMemo(() => {
    if (!originalPrice) return null
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(originalPrice)
  }, [originalPrice, locale])

  // Handlers (stable callbacks for performance)
  const handleAddToCart = React.useCallback((e: React.MouseEvent) => {
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
  }, [id, title, price, image, slug, username, isOwnProduct, inStock, addToCart, t, tCart])

  const handleWishlist = React.useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlistPending) return
    setIsWishlistPending(true)
    try {
      await toggleWishlist({ id, title, price, image })
    } finally {
      setIsWishlistPending(false)
    }
  }, [id, title, price, image, isWishlistPending, toggleWishlist])

  // Rating & social proof
  const hasRating = typeof rating === "number" && rating > 0
  const reviewCount = reviews ?? 0
  const hasSoldCount = typeof soldCount === "number" && soldCount > 0

  return (
    <div
      ref={ref}
      className={cn(productCardVariants({ variant, state: resolvedState }), className)}
      onClick={handleOpenProduct}
    >
      {/* Full-card link for accessibility */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-[1]"
        aria-label={t("openProduct", { title })}
      >
        <span className="sr-only">{title}</span>
      </Link>

      {/* Image Container - 4:5 aspect ratio for optimal mobile display */}
      <div className={cn(
        "relative overflow-hidden rounded-md bg-muted lg:rounded-none",
        !inStock && "after:absolute after:inset-0 after:bg-background/60"
      )}>
        <AspectRatio ratio={4 / 5}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={cn("object-cover", !inStock && "grayscale")}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL={productBlurDataURL()}
            loading={loadingStrategy.loading}
            priority={loadingStrategy.priority}
          />
        </AspectRatio>

        {/* Out of Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="rounded-sm bg-foreground/80 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-background">
              {t("outOfStock")}
            </span>
          </div>
        )}

        {/* Condition Badge - Top Left (C2C feature) */}
        {conditionLabel && inStock && (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-sm bg-foreground/90 px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wider text-background">
            {conditionLabel}
          </span>
        )}

        {/* Wishlist button - Top Right (WCAG 2.2 AA: min 24px, using 28px) */}
        {showWishlist && (
          <button
            type="button"
            className={cn(
              "absolute right-1.5 top-1.5 z-10 flex min-h-touch-sm min-w-touch-sm size-7 items-center justify-center rounded-full outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-ring",
              !inWishlist && "lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:transition-opacity lg:duration-100",
              inWishlist
                ? "bg-product-wishlist-active text-white"
                : "bg-overlay-dark text-white backdrop-blur-sm hover:bg-foreground/50 active:bg-product-wishlist",
              isWishlistPending && "pointer-events-none opacity-50"
            )}
            onClick={handleWishlist}
            disabled={isWishlistPending}
            aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
          >
            <Heart size={14} weight={inWishlist ? "fill" : "bold"} />
          </button>
        )}

        {/* Discount Badge - Bottom Right with gradient (only show if >= 5%) */}
        {hasDiscount && discountPercent >= 5 && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-overlay-dark" />
            <span className="absolute bottom-1.5 right-1.5 z-10 text-2xs font-bold text-white drop-shadow-sm">
              -{discountPercent}%
            </span>
          </>
        )}

        {/* Smart attribute badge - bottom left over gradient */}
        {smartBadge && !hasDiscount && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-overlay-dark px-1.5 py-1">
            <span className="text-xs font-medium text-white drop-shadow-sm">
              {smartBadge}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative z-[2] px-1 pb-1.5 pt-1.5 lg:p-2">
        {/* HERO: Price Row - Maximum prominence */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {/* Current Price - HERO element */}
          <span
            className={cn(
              "text-price font-bold leading-tight tracking-tight lg:text-lg",
              hasDiscount ? "text-price-sale" : "text-price-regular"
            )}
          >
            {formattedPrice}
          </span>

          {/* Original Price (crossed out) */}
          {hasDiscount && formattedOriginalPrice && (
            <span className="text-xs text-price-original line-through">
              {formattedOriginalPrice}
            </span>
          )}

          {/* Free Shipping Badge */}
          {freeShipping && (
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-shipping-free/10 px-1 py-px text-2xs font-medium text-shipping-free">
              <Truck size={10} weight="bold" />
              <span className="hidden xs:inline">Free</span>
            </span>
          )}
        </div>

        {/* Title - 2 lines max, professional typography */}
        <h3 className="mt-0.5 line-clamp-2 text-body leading-snug text-foreground/90">
          {title}
        </h3>

        {/* Social Proof Row: Rating + Sold Count */}
        {(hasRating || hasSoldCount) && (
          <div className="mt-0.5 flex items-center gap-1 text-2xs text-muted-foreground">
            {hasRating && (
              <>
                <Star size={10} weight="fill" className="text-rating" />
                <span className="font-medium text-foreground/80">
                  {rating.toFixed(1)}
                </span>
                {reviewCount > 0 && <span>({formatCount(reviewCount)})</span>}
              </>
            )}

            {hasRating && hasSoldCount && (
              <span className="text-border">·</span>
            )}

            {hasSoldCount && (
              <span>{formatCount(soldCount)} sold</span>
            )}
          </div>
        )}

        {/* B2B Badges (if applicable) */}
        {(minOrderQuantity && minOrderQuantity > 1) || businessVerified || samplesAvailable ? (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {minOrderQuantity && minOrderQuantity > 1 && (
              <span className="rounded-sm bg-info/10 px-1 py-px text-2xs font-medium text-info">
                MOQ:{minOrderQuantity}
              </span>
            )}
            {samplesAvailable && (
              <span className="rounded-sm bg-warning/10 px-1 py-px text-2xs font-medium text-warning">
                Samples
              </span>
            )}
            {businessVerified && (
              <span className="rounded-sm bg-success/10 px-1 py-px text-2xs font-medium text-success">
                Verified
              </span>
            )}
          </div>
        ) : null}

        {/* Seller Row + Quick-Add */}
        <div className="mt-1 flex items-center justify-between gap-1">
          {/* Seller Info */}
          {displaySellerName ? (
            <div className="flex min-w-0 items-center gap-1">
              <Avatar className="size-5 shrink-0 ring-1 ring-border/50">
                <AvatarImage src={safeAvatarSrc(sellerAvatarUrl)} />
                <AvatarFallback className="bg-muted text-2xs font-medium">
                  {displaySellerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-2xs text-muted-foreground">
                {displaySellerName}
              </span>
              {sellerVerified && (
                <SealCheck size={10} weight="fill" className="shrink-0 text-verified" />
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Quick-Add Button - 28px (size-7), WCAG 2.2 AA compliant */}
          {showQuickAdd && (
            <button
              type="button"
              className={cn(
                "flex min-h-touch-sm min-w-touch-sm size-7 shrink-0 items-center justify-center rounded outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-ring",
                inCart
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary active:text-primary-foreground",
                (!inStock || isOwnProduct) && "cursor-not-allowed opacity-40"
              )}
              onClick={handleAddToCart}
              disabled={isOwnProduct || !inStock}
              aria-label={inCart ? "In cart" : "Add to cart"}
            >
              {inCart ? (
                <ShoppingCart size={14} weight="fill" />
              ) : (
                <Plus size={14} weight="bold" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT GRID - Responsive CSS Grid with density options
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  /** Grid density: compact (Temu), default (eBay), comfortable (Airbnb) */
  density?: "compact" | "default" | "comfortable"
  className?: string
}

/**
 * ProductGrid - Responsive CSS Grid
 * Mobile: 2 cols, gap-1.5 (6px), px-1 (4px)
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
        "grid gap-1.5 px-(--page-inset) sm:gap-2 sm:px-(--page-inset-md) lg:gap-3 lg:px-(--page-inset-lg)",
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
// SKELETON - Matches new Pro design structure
// =============================================================================

interface ProductCardSkeletonProps {
  className?: string
}

function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("h-full", className)}>
      {/* Image - 4:5 aspect ratio */}
      <div className="overflow-hidden rounded-md bg-muted lg:rounded-none">
        <AspectRatio ratio={4 / 5}>
          <Skeleton className="h-full w-full rounded-none" />
        </AspectRatio>
      </div>
      {/* Content */}
      <div className="px-1 pb-1.5 pt-1.5 lg:p-2">
        {/* Price row */}
        <div className="flex items-baseline gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        {/* Title (2 lines) */}
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="mt-0.5 h-4 w-2/3" />
        {/* Rating row */}
        <div className="mt-1 flex items-center gap-1">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        {/* Seller + Quick-add */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-2.5 w-14" />
          </div>
          <Skeleton className="size-7 rounded" />
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
