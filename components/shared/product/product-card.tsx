"use client"

import * as React from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/common/spinner"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, ShoppingCart, Plus, Star, Truck } from "@phosphor-icons/react"

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
// TYPES - Essential props with backwards compatibility
// =============================================================================

interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null
  /** @deprecated Use originalPrice */
  listPrice?: number | null
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null

  // Product info
  rating?: number
  reviews?: number
  condition?: string
  brand?: string
  tags?: string[]
  location?: string
  categorySlug?: string
  categoryRootSlug?: string
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }>
  attributes?: Record<string, string>
  make?: string | null
  model?: string | null
  year?: string | number | null
  color?: string | null
  size?: string | null

  // Seller
  sellerId?: string | null
  sellerName?: string
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerRating?: number
  sellerTier?: "basic" | "premium" | "business"
  initialIsFollowingSeller?: boolean

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null
  /** @deprecated Use username */
  storeSlug?: string | null

  // Feature toggles
  showQuickAdd?: boolean
  showWishlist?: boolean
  showRating?: boolean
  /** @deprecated No longer used */
  showPills?: boolean
  /** @deprecated No longer used */
  showMetaPills?: boolean
  /** @deprecated No longer used */
  showExtraPills?: boolean
  /** @deprecated No longer used */
  showSellerRow?: boolean
  /** @deprecated No longer used */
  cardStyle?: "default" | "marketplace"
  /** @deprecated Use state="promoted" */
  isBoosted?: boolean

  // Context
  index?: number
  currentUserId?: string | null
  inStock?: boolean
  className?: string
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

// Helper to get category label from path
function getCategoryLabel(
  path: ProductCardProps["categoryPath"],
  locale: string
): string | null {
  if (!path || path.length === 0) return null
  // Prefer L1 (second level) if available, otherwise L0
  const node = path.length > 1 ? path.at(1) : path.at(0)
  if (!node) return null
  const raw = locale === "bg" ? (node.nameBg || node.name) : node.name
  const clean = raw.replace(/^\s*\[HIDDEN\]\s*/i, "").trim()
  if (!clean) return null
  return clean.length > 16 ? `${clean.slice(0, 16)}…` : clean
}

// Helper to format sold count (e.g., 567 → "567", 2300 → "2.3K")
function formatSoldCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000
    return k >= 10 ? `${Math.round(k)}K` : `${k.toFixed(1)}K`
  }
  return n.toString()
}

// =============================================================================
// PRODUCT CARD COMPONENT - Clean, Professional, Dense
// =============================================================================

function ProductCard({
  id,
  title,
  price,
  image,
  originalPrice,
  listPrice, // deprecated
  isOnSale,
  salePercent,
  rating = 0,
  reviews = 0,
  categoryPath,
  sellerId,
  sellerName,
  sellerAvatarUrl,
  location,
  freeShipping = false,
  slug,
  username,
  storeSlug, // deprecated
  variant = "default",
  state,
  isBoosted, // deprecated
  showQuickAdd = true,
  showWishlist = true,
  showRating = true,
  index = 0,
  currentUserId,
  inStock = true,
  className,
  ref,
}: ProductCardProps & { ref?: React.Ref<HTMLDivElement> }) {
    const router = useRouter()
    const { addToCart, items: cartItems } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const t = useTranslations("Product")
    const tCart = useTranslations("Cart")
    const locale = useLocale()

    const [isWishlistPending, setIsWishlistPending] = React.useState(false)

    // Resolve deprecated props
    const resolvedOriginalPrice = originalPrice ?? listPrice ?? null
    const resolvedUsername = username ?? storeSlug ?? null

    // Derived values
    const hasDiscount = resolvedOriginalPrice && resolvedOriginalPrice > price
    const discountPercent = hasDiscount
      ? Math.round(((resolvedOriginalPrice - price) / resolvedOriginalPrice) * 100)
      : (salePercent ?? 0)

    // Resolve state (handle deprecated isBoosted)
    const resolvedState = state ?? (isBoosted ? "promoted" : (isOnSale || hasDiscount ? "sale" : "default"))

    // URLs
    const productUrl = resolvedUsername ? `/${resolvedUsername}/${slug || id}` : "#"
    const categoryLabel = React.useMemo(() => getCategoryLabel(categoryPath, locale), [categoryPath, locale])

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
    const formatPrice = (p: number) =>
      new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(p)

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
        ...(resolvedUsername ? { username: resolvedUsername } : {}),
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
          className="absolute inset-0 z-[1]"
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

          {/* Action buttons - bottom row */}
          {(showWishlist || showQuickAdd) && (
            <div className="absolute inset-x-1.5 bottom-1.5 z-10 flex items-end justify-between">
              {/* Wishlist - 28px visual, 32px hit area */}
              {showWishlist ? (
                <button
                  type="button"
                  className="relative z-10 flex h-8 w-8 items-center justify-center"
                  onClick={handleWishlist}
                  aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background/90",
                      inWishlist && "bg-cta-trust-blue/10"
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
              ) : (
                <span />
              )}

              {/* Quick add - 32px */}
              {showQuickAdd && (
                <button
                  type="button"
                  className="relative z-10 flex h-8 w-8 items-center justify-center"
                  onClick={handleAddToCart}
                  disabled={isOwnProduct || !inStock}
                  aria-label={inCart ? t("inCart") : t("addToCart")}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/90",
                      inCart && "border-0 bg-cta-trust-blue text-cta-trust-blue-text"
                    )}
                  >
                    {inCart ? (
                      <ShoppingCart size={14} weight="fill" />
                    ) : (
                      <Plus size={16} weight="bold" />
                    )}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* CONTENT SECTION - Dense spacing per _MASTER.md */}
        <div className="relative z-10 flex flex-col gap-0.5 px-0.5 py-1.5">
          {/* Category badge - text-tiny (11px) font-semibold per _MASTER.md */}
          {categoryLabel && (
            <Badge
              variant="secondary"
              className="h-5 w-fit max-w-full truncate px-2 py-0.5 text-tiny font-semibold"
            >
              {categoryLabel}
            </Badge>
          )}

          {/* Title - 13px mobile / text-sm (14px) desktop per _MASTER.md */}
          {/* Mobile: single line truncate | Desktop: up to 2 lines */}
          <h3 className="truncate text-sm font-normal leading-snug text-foreground md:line-clamp-2 md:whitespace-normal md:text-sm">
            {title}
          </h3>

          {/* Price - text-lg (18px) / text-xl (20px) desktop - LARGEST ELEMENT */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span
              className={cn(
                "text-lg font-bold leading-none tracking-tight md:text-xl",
                hasDiscount ? "text-price-sale" : "text-foreground"
              )}
            >
              {formatPrice(price)}
            </span>
            {hasDiscount && resolvedOriginalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(resolvedOriginalPrice)}
              </span>
            )}
          </div>

          {/* Rating + Sold count - text-tiny (11px) per _MASTER.md */}
          {(showRating && (rating > 0 || reviews > 0)) && (
            <div className="flex items-center gap-1">
              {rating > 0 && (
                <>
                  <Star size={12} weight="fill" className="text-rating" />
                  <span className="text-tiny font-medium text-foreground">
                    {rating.toFixed(1)}
                  </span>
                </>
              )}
              {reviews > 0 && (
                <span className="text-tiny text-muted-foreground">
                  {rating > 0 && "· "}{formatSoldCount(reviews)} sold
                </span>
              )}
            </div>
          )}

          {/* Free shipping + location - text-2xs (10px) per _MASTER.md */}
          {(freeShipping || location) && (
            <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
              {freeShipping && (
                <span className="inline-flex items-center gap-0.5 font-medium text-success">
                  <Truck size={10} weight="bold" />
                  {t("freeShipping")}
                </span>
              )}
              {freeShipping && location && <span>·</span>}
              {location && <span className="truncate">{location}</span>}
            </div>
          )}
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
      <div className="flex flex-col gap-1.5 px-0.5 py-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-3 w-24" />
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
