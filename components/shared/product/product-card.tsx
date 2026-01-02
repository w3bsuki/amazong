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
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { buildHeroBadgeText } from "@/lib/product-card-hero-attributes"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, ShoppingCart, Plus, Star, SealCheck, Truck } from "@phosphor-icons/react"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const productCardVariants = cva(
  "tap-transparent group relative block h-full min-w-0 cursor-pointer overflow-hidden bg-transparent focus-within:ring-2 focus-within:ring-ring/40 lg:rounded-md lg:border lg:border-transparent lg:bg-card lg:hover:border-border/60 lg:hover:shadow-sm",
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

  // Rating & reviews (now displayed in Pro Commerce style)
  rating?: number
  reviews?: number

  // Condition for C2C
  condition?: string

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
  sellerVerified?: boolean
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
  condition,
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

  // Condition badge helper
  const conditionLabel = React.useMemo(() => {
    if (!condition) return null
    const c = condition.toLowerCase()
    if (c === "new" || c === "novo" || c === "ново") return locale === "bg" ? "Ново" : "New"
    if (c === "like_new" || c === "like new" || c === "като ново") return locale === "bg" ? "Като ново" : "Like New"
    if (c === "used" || c === "употребявано") return locale === "bg" ? "Употр." : "Used"
    if (c === "refurbished" || c === "рефърбиш") return locale === "bg" ? "Рефърб." : "Refurb"
    return condition.slice(0, 8)
  }, [condition, locale])

  // Price formatting
  const priceFormatter = React.useMemo(() => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }, [locale])

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

  // Rating display helper
  const hasRating = typeof rating === "number" && rating > 0
  const reviewCount = reviews ?? 0

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

      {/* Image */}
      <div className="relative overflow-hidden rounded-md bg-muted lg:rounded-none">
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

        {/* Top-left badges stack: Discount, Condition */}
        <div className="absolute left-0 top-1.5 z-10 flex flex-col gap-1">
          {hasDiscount && discountPercent >= 5 && (
            <span className="rounded-r-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              -{discountPercent}%
            </span>
          )}
          {conditionLabel && (
            <span className="rounded-r-sm bg-foreground/80 px-1.5 py-0.5 text-[10px] font-medium text-background">
              {conditionLabel}
            </span>
          )}
        </div>

        {/* Wishlist button - top right */}
        {showWishlist && (
          <button
            type="button"
            className={cn(
              "absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-full transition-colors duration-100",
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-black/30 text-white backdrop-blur-sm active:bg-red-500",
              isWishlistPending && "opacity-50 pointer-events-none"
            )}
            onClick={handleWishlist}
            disabled={isWishlistPending}
            aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
          >
            <Heart size={14} weight={inWishlist ? "fill" : "bold"} />
          </button>
        )}

        {/* Smart attribute badge - bottom of image */}
        {smartBadge && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4">
            <span className="text-[11px] font-medium text-white drop-shadow-sm">
              {smartBadge}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-[2] px-0.5 pt-1.5 pb-1 lg:p-1.5">
        {/* Price row */}
        <div className="flex flex-wrap items-baseline gap-x-1">
          <span className={cn(
            "text-base font-bold leading-none",
            hasDiscount ? "text-red-600" : "text-foreground"
          )}>
            {priceFormatter.format(price)}
          </span>
          {hasDiscount && originalPrice && (
            <span className="text-[10px] text-muted-foreground line-through">
              {priceFormatter.format(originalPrice)}
            </span>
          )}
          {freeShipping && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
              <Truck size={10} weight="bold" />
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-0.5 line-clamp-2 text-[13px] leading-tight text-foreground/90">
          {title}
        </h3>

        {/* Rating row (if available) */}
        {hasRating && (
          <div className="mt-1 flex items-center gap-0.5">
            <Star size={10} weight="fill" className="text-amber-400" />
            <span className="text-[10px] text-muted-foreground">
              {rating.toFixed(1)}
              {reviewCount > 0 && <span className="ml-0.5">({reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})</span>}
            </span>
          </div>
        )}

        {/* Seller row + Quick-add */}
        <div className="mt-1 flex items-center justify-between gap-1">
          {displaySellerName ? (
            <div className="flex min-w-0 items-center gap-1">
              <Avatar className="size-4 shrink-0">
                <AvatarImage src={sellerAvatarUrl || undefined} />
                <AvatarFallback className="text-[6px] bg-muted">
                  {displaySellerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-[10px] text-muted-foreground">
                {displaySellerName}
              </span>
              {sellerVerified && (
                <SealCheck size={10} weight="fill" className="shrink-0 text-blue-500" />
              )}
            </div>
          ) : (
            <div />
          )}

          {showQuickAdd && (
            <button
              type="button"
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-100",
                inCart
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground active:bg-blue-600 active:text-white"
              )}
              onClick={handleAddToCart}
              disabled={isOwnProduct || !inStock}
              aria-label={inCart ? "In cart" : "Add to cart"}
            >
              {inCart ? (
                <ShoppingCart size={12} weight="fill" />
              ) : (
                <Plus size={12} weight="bold" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT GRID
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  /** Grid density: compact (Temu), default (eBay), comfortable (Airbnb) */
  density?: "compact" | "default" | "comfortable"
  className?: string
}

/**
 * ProductGrid - Responsive CSS Grid
 * Mobile: 2 cols, gap-1 (4px), px-1 (4px)
 * Tablet: 3 cols, gap-1 (4px)
 * Desktop: 4-5 cols, gap-1.5 (6px)
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
        "grid gap-1 px-1 lg:gap-1.5 lg:px-2",
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
// SKELETON
// =============================================================================

interface ProductCardSkeletonProps {
  className?: string
}

function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("h-full", className)}>
      {/* Image */}
      <div className="overflow-hidden rounded-md bg-muted lg:rounded-none">
        <AspectRatio ratio={4 / 5}>
          <Skeleton className="h-full w-full rounded-none" />
        </AspectRatio>
      </div>
      {/* Content */}
      <div className="px-0.5 pt-1.5 pb-1 lg:p-1.5">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="mt-0.5 h-3.5 w-full" />
        <Skeleton className="mt-0.5 h-3.5 w-2/3" />
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-2.5 w-12" />
          </div>
          <Skeleton className="size-6 rounded" />
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
