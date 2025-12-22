"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BoringAvatar from "boring-avatars"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Heart,
  ShoppingCart,
  Plus,
  ShieldCheck,
  Star,
  Sparkle,
  Truck,
  DotsThree,
} from "@phosphor-icons/react"

// =============================================================================
// CONSTANTS
// =============================================================================

const AVATAR_COLORS = ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]

// =============================================================================
// CVA VARIANTS - Modern Minimal (Swiss Design Principles)
// =============================================================================

/**
 * ProductCard Variants
 * ---------------------
 * Modern Minimal aesthetic - flat surfaces, subtle borders, no gradients.
 * Uses Tailwind v4 semantic tokens (bg-card, text-foreground, etc.)
 */
const productCardVariants = cva(
  // Base: cursor, block, relative, full height, overflow hidden for clean edges
  // Removed all transitions for "super fast" UI
  "group relative block h-full min-w-0 cursor-pointer overflow-hidden",
  {
    variants: {
      /**
       * Visual variant:
       * - default: Clean flat card with subtle border, no background
       * - featured: Card surface with seller header (promoted/business)
       */
      variant: {
        default: "rounded-lg",
        featured: "rounded-xl border border-border/60 bg-card",
      },
      /**
       * State modifiers:
       * - default: Standard appearance
       * - promoted: Primary accent (Ad/Promoted)
       * - sale: Sale highlight
       */
      state: {
        default: "",
        promoted: "",
        sale: "",
      },
    },
    compoundVariants: [
      // Default variant states - flat, NO SHADOW on hover as requested
      {
        variant: "default",
        state: "default",
        className: "",
      },
      {
        variant: "default",
        state: "promoted",
        className: "ring-1 ring-primary/10",
      },
      {
        variant: "default",
        state: "sale",
        className: "",
      },
      // Featured variant states - card surface, NO SHADOW on hover as requested
      {
        variant: "featured",
        state: "default",
        className: "",
      },
      {
        variant: "featured",
        state: "promoted",
        className: "border-primary/20 ring-1 ring-primary/10",
      },
      {
        variant: "featured",
        state: "sale",
        className: "border-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
)

// =============================================================================
// TYPES
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
  sellerId?: string | null
  sellerName?: string
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerRating?: number
  sellerTier?: "basic" | "premium" | "business"
  location?: string

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
  showPills?: boolean
  /** @deprecated Use state="promoted" */
  isBoosted?: boolean

  // Smart pills data
  attributes?: Record<string, string>

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

  // In Playwright E2E runs we avoid remote network requests entirely.
  if (process.env.NEXT_PUBLIC_E2E === "true" && isRemote) {
    return PLACEHOLDER_IMAGE_PATH
  }

  return normalized
}

// =============================================================================
// SMART PILLS HELPERS
// =============================================================================

const CATEGORY_PILL_PRIORITY: Record<string, string[]> = {
  cars: ["year", "mileage_km", "fuel_type"],
  motorcycles: ["year", "mileage_km", "engine_cc"],
  electronics: ["brand", "storage", "condition"],
  phones: ["brand", "storage", "condition"],
  fashion: ["size", "brand", "condition"],
  default: ["condition", "brand"],
}

function formatPillValue(key: string, value: string): string {
  if (!value) return ""
  switch (key) {
    case "mileage_km":
      return `${parseInt(value).toLocaleString()} km`
    case "area_sqm":
      return `${value} m²`
    default:
      return value.length > 14 ? `${value.slice(0, 14)}…` : value
  }
}

function getSmartPills(
  categorySlug: string | undefined,
  attributes: Record<string, string> | undefined,
  condition: string | undefined,
  brand: string | undefined,
  maxPills: number = 2
): Array<{ key: string; label: string }> {
  const pills: Array<{ key: string; label: string }> = []
  const attrs = attributes || {}
  const priorityKeys =
    CATEGORY_PILL_PRIORITY[categorySlug || ""] || CATEGORY_PILL_PRIORITY.default

  const merged: Record<string, string> = {
    ...attrs,
    condition: condition || attrs.condition || "",
    brand: brand || attrs.brand || "",
  }

  for (const key of priorityKeys) {
    if (pills.length >= maxPills) break
    const value = merged[key]?.trim()
    if (
      value &&
      !pills.some((p) => p.label.toLowerCase() === value.toLowerCase())
    ) {
      pills.push({ key, label: formatPillValue(key, value) })
    }
  }

  return pills
}

// =============================================================================
// PRODUCT CARD COMPONENT
// =============================================================================

const ProductCard = React.forwardRef<HTMLAnchorElement, ProductCardProps>(
  (
    {
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
      condition,
      categorySlug,
      location,
      sellerId,

      // Seller
      sellerName,
      sellerAvatarUrl,
      sellerVerified = false,
      sellerTier = "basic",

      // Shipping
      freeShipping = false,

      // URLs
      slug,
      username,
      storeSlug,

      // CVA variants
      variant = "default",
      state,
      isBoosted,

      // Feature toggles
      showQuickAdd = true,
      showWishlist = true,
      showRating = true,
      showPills = false,

      // Smart pills
      attributes,

      // Context
      index = 0,
      currentUserId,
      inStock = true,
      className,
    },
    ref
  ) => {
    const { addToCart } = useCart()
    const t = useTranslations("Product")
    const tCart = useTranslations("Cart")
    const locale = useLocale()

    // Local state
    const [wishlisted, setWishlisted] = React.useState(false)
    const [inCart, setInCart] = React.useState(false)

    // Resolve deprecated props
    const resolvedOriginalPrice = originalPrice ?? listPrice ?? null
    const resolvedUsername = username ?? storeSlug ?? null

    // Derived values
    const hasDiscount = resolvedOriginalPrice && resolvedOriginalPrice > price
    const discountPercent = hasDiscount
      ? Math.round(
          ((resolvedOriginalPrice - price) / resolvedOriginalPrice) * 100
        )
      : 0

    // Auto-detect state
    const resolvedState =
      state ||
      (isBoosted
        ? "promoted"
        : hasDiscount && discountPercent >= 10
          ? "sale"
          : "default")

    // URLs
    const productUrl =
      resolvedUsername && slug ? `/${resolvedUsername}/${slug}` : `/product/${slug || id}`
    const displayName = sellerName || resolvedUsername || "Seller"

    // Loading strategy
    const loadingStrategy = getImageLoadingStrategy(index, 4)

    const imageSrc = React.useMemo(() => getProductCardImageSrc(image), [image])

    // Smart pills
    const smartPills = React.useMemo(
      () =>
        showPills && variant === "featured"
          ? getSmartPills(categorySlug, attributes, condition, brand)
          : [],
      [showPills, variant, categorySlug, attributes, condition, brand]
    )

    // Check if own product
    const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

    // Price formatting - EUR is base currency (Bulgaria joined Eurozone)
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
        toast.error(
          locale === "bg" ? "Не можете да купите собствен продукт" : "Cannot buy your own product"
        )
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

    const handleWishlist = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setWishlisted(!wishlisted)
      toast.success(
        wishlisted
          ? locale === "bg"
            ? "Премахнато от любими"
            : "Removed from favorites"
          : locale === "bg"
            ? "Добавено в любими"
            : "Added to favorites"
      )
    }

    // Tier label for featured variant
    const tierLabel =
      sellerTier === "business"
        ? locale === "bg"
          ? "Бизнес продавач"
          : "Pro Seller"
        : sellerTier === "premium"
          ? locale === "bg"
            ? "Топ продавач"
            : "Top Rated"
          : locale === "bg"
            ? "Продавач"
            : "Seller"

    return (
      <Link
        ref={ref}
        href={productUrl}
        className={cn(productCardVariants({ variant, state: resolvedState }), className)}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            SELLER HEADER - Featured variant only (promoted/business sellers)
            Swiss Design: Clean horizontal layout, minimal visual weight
        ═══════════════════════════════════════════════════════════════════ */}
        {variant === "featured" && (
          <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="size-7 shrink-0 border border-border">
                <AvatarImage src={sellerAvatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-transparent p-0">
                  <BoringAvatar
                    size={28}
                    name={sellerId || displayName}
                    variant="beam"
                    colors={AVATAR_COLORS}
                  />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span className="max-w-[100px] truncate text-xs font-medium text-foreground">
                    {displayName}
                  </span>
                  {sellerVerified && (
                    <ShieldCheck size={12} weight="fill" className="shrink-0 text-primary" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{tierLabel}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 rounded-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <DotsThree size={16} weight="bold" />
              <span className="sr-only">More options</span>
            </Button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            IMAGE SECTION - Square aspect ratio for maximum image visibility
            Standardized: 1:1 ratio like eBay/Vinted for consistent grid alignment
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            variant === "default" && "rounded-lg"
          )}
        >
          {/* Square aspect ratio - industry standard for product grids */}
          <AspectRatio ratio={1}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="size-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={productBlurDataURL()}
              loading={loadingStrategy.loading}
              priority={loadingStrategy.priority}
            />
          </AspectRatio>

          {/* Wishlist Button - Top Right (Shadcn Ghost Button) */}
          {showWishlist && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-1.5 top-1.5 z-10 size-7 rounded-full bg-background/80 backdrop-blur-sm transition-colors duration-150",
                "hover:bg-background hover:shadow-sm",
                wishlisted && "bg-primary/10 text-primary"
              )}
              onClick={handleWishlist}
            >
              <Heart
                size={16}
                weight={wishlisted ? "fill" : "regular"}
                className={wishlisted ? "text-primary" : "text-muted-foreground"}
              />
              <span className="sr-only">
                {wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              </span>
            </Button>
          )}

          {/* Quick Add Button - Blue on card hover as requested */}
          {showQuickAdd && (
            <Button
              variant={inCart ? "default" : "outline"}
              size="icon"
              className={cn(
                "absolute bottom-1.5 right-1.5 z-10 size-7 rounded-full",
                !inCart && [
                  "bg-background/90 backdrop-blur-sm border-border/50",
                  "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                ],
                inCart && "bg-primary text-primary-foreground"
              )}
              onClick={handleAddToCart}
              disabled={isOwnProduct || !inStock}
            >
              {inCart ? (
                <ShoppingCart size={14} weight="fill" />
              ) : (
                <Plus size={14} weight="bold" />
              )}
              <span className="sr-only">{inCart ? "In cart" : "Add to cart"}</span>
            </Button>
          )}

          {/* Badges - Top Left (Flat, no shadows per Swiss design) */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {resolvedState === "promoted" && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                <Sparkle size={10} weight="fill" />
                {locale === "bg" ? "Промо" : "Ad"}
              </span>
            )}
            {hasDiscount && discountPercent >= 5 && (
              <span className="rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTENT SECTION - Ultra-tight spacing & Refined Typography
            Swiss Design: Clear hierarchy, optimized for desktop scanning
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "flex flex-col gap-0",
            variant === "featured" ? "p-2.5" : "pt-1.5"
          )}
        >
          {/* Meta info: Brand & Condition */}
          {(brand || condition) && (
            <div className="flex items-center gap-1 truncate text-[9px] uppercase tracking-widest font-bold text-muted-foreground/60">
              {brand && <span className="truncate">{brand}</span>}
              {brand && condition && (
                <span className="size-0.5 shrink-0 rounded-full bg-muted-foreground/20" />
              )}
              {condition && <span className="shrink-0">{condition}</span>}
            </div>
          )}

          {/* Title - Refined for desktop */}
          <h3
            className={cn(
              "text-sm font-medium leading-tight text-foreground/90",
              variant === "featured" ? "line-clamp-2" : "line-clamp-1"
            )}
          >
            {title}
          </h3>

          {/* Price Row - Bold, prominent */}
          <div className="flex items-baseline gap-1 pt-0.5">
            <span
              className={cn(
                "text-base font-bold tracking-tight",
                hasDiscount ? "text-destructive" : "text-foreground"
              )}
            >
              {formatPrice(price)}
            </span>
            {hasDiscount && resolvedOriginalPrice && (
              <span className="text-[10px] text-muted-foreground/50 line-through decoration-muted-foreground/30">
                {formatPrice(resolvedOriginalPrice)}
              </span>
            )}
          </div>

          {/* Rating Row - Compact stars */}
          {showRating && rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={10}
                    weight="fill"
                    className={cn(
                      i <= Math.floor(rating)
                        ? "text-amber-500 dark:text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              {reviews > 0 && (
                <span className="text-xs text-muted-foreground">({reviews.toLocaleString()})</span>
              )}
            </div>
          )}

          {/* Free Shipping - Trust signal */}
          {freeShipping && (
            <p className="inline-flex items-center gap-1 pt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Truck size={12} weight="bold" />
              {locale === "bg" ? "Безплатна доставка" : "Free shipping"}
            </p>
          )}

          {/* Location - Marketplace essential */}
          {location && (
            <p className="truncate text-[10px] text-muted-foreground pt-0.5">{location}</p>
          )}
        </div>
      </Link>
    )
  }
)

ProductCard.displayName = "ProductCard"

// =============================================================================
// PRODUCT GRID - Standardized CSS Grid (eBay/Amazon reference)
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  /**
   * Grid density preset
   * - compact: More items visible (mobile-first marketplaces like Vinted)
   * - default: Balanced (like eBay)
   * - comfortable: Larger cards (like Airbnb)
   */
  density?: "compact" | "default" | "comfortable"
  /** Gap between items */
  gap?: "sm" | "md" | "lg"
  className?: string
}

/**
 * ProductGrid Component
 * ----------------------
 * Standardized CSS Grid for product catalogs.
 *
 * STANDARDIZED BREAKPOINTS (based on eBay/Amazon):
 * - Mobile (< 640px):   2 columns - essential for thumb reach
 * - Tablet (640-1024):  3 columns - balanced density
 * - Desktop (1024+):    4 columns - optimal for scanning
 * - Wide (1280+):       4-5 columns max - prevents images from getting too small
 *
 * Gap Strategy:
 * - sm: gap-2 sm:gap-3 (8-12px) - Compact
 * - md: gap-3 sm:gap-4 (12-16px) - Default
 * - lg: gap-4 sm:gap-6 (16-24px) - Comfortable
 */
function ProductGrid({ children, density = "default", gap = "md", className }: ProductGridProps) {
  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 lg:gap-5",
    lg: "gap-4 sm:gap-6",
  }

  // Standardized column configurations
  const densityClasses = {
    // Compact: 2 → 3 → 4 → 5 (Vinted-style, more items)
    compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    // Default: 2 → 3 → 4 → 4 (eBay-style, balanced)
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5",
    // Comfortable: 2 → 2 → 3 → 4 (Airbnb-style, larger cards)
    comfortable: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid", densityClasses[density], gapClasses[gap], className)}>
      {children}
    </div>
  )
}

ProductGrid.displayName = "ProductGrid"

// =============================================================================
// SKELETON - Matches Modern Minimal card design
// =============================================================================

interface ProductCardSkeletonProps {
  variant?: "default" | "featured"
  className?: string
}

/**
 * ProductCardSkeleton
 * -------------------
 * Skeleton loader matching the ProductCard layout.
 * Uses same aspect ratio (4:3 for default, 1:1 for featured) and spacing.
 */
function ProductCardSkeleton({ variant = "default", className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "h-full overflow-hidden",
        variant === "featured" && "rounded-xl border border-border bg-card",
        variant === "default" && "rounded-lg",
        className
      )}
    >
      {/* Seller Header Skeleton - Featured only */}
      {variant === "featured" && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
          <Skeleton className="size-7 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-14" />
          </div>
        </div>
      )}

      {/* Image Skeleton - Square aspect ratio */}
      <div className={cn("bg-muted", variant === "default" && "rounded-lg")}>
        <AspectRatio ratio={1}>
          <Skeleton className="size-full" />
        </AspectRatio>
      </div>

      {/* Content Skeleton - Matches card padding */}
      <div className={cn("flex flex-col gap-1.5", variant === "featured" ? "p-3 md:p-4" : "pt-2 md:pt-3")}>
        {/* Brand */}
        <Skeleton className="h-3 w-16" />
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        {variant === "featured" && <Skeleton className="h-4 w-3/4" />}
        {/* Price */}
        <Skeleton className="h-5 w-20" />
        {/* Rating */}
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

ProductCardSkeleton.displayName = "ProductCardSkeleton"

// =============================================================================
// SKELETON GRID - Uses ProductGrid for consistent layout
// =============================================================================

interface ProductCardSkeletonGridProps {
  count?: number
  variant?: "default" | "featured"
  density?: "compact" | "default" | "comfortable"
  gap?: "sm" | "md" | "lg"
  className?: string
}

/**
 * ProductCardSkeletonGrid
 * -----------------------
 * Grid of skeleton cards for loading states.
 * Uses CSS Grid with same responsive breakpoints as ProductGrid.
 */
function ProductCardSkeletonGrid({
  count = 8,
  variant = "default",
  density = "default",
  gap = "md",
  className,
}: ProductCardSkeletonGridProps) {
  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 lg:gap-5",
    lg: "gap-4 sm:gap-6",
  }

  const densityClasses = {
    compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5",
    comfortable: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid", densityClasses[density], gapClasses[gap], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
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
