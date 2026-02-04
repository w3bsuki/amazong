"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Surface } from "@/components/ui/surface"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { isBoostActiveNow } from "@/lib/boost/boost-status"
import { shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"

import { ProductCardActions } from "./product-card-actions"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { ProductCardSocialProof } from "./product-card-social-proof"
import { FreshnessIndicator } from "./freshness-indicator"
import { getConditionKey } from "./_lib/condition"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const productCardVariants = cva(
  "tap-transparent group relative flex h-full min-w-0 cursor-pointer flex-col",
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
// TYPES - Essential props + B2B support
// =============================================================================

interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Meta
  createdAt?: string | null

  // Pricing
  originalPrice?: number | null
  isOnSale?: boolean
  salePercent?: number

  // Product info - for smart badge
  categoryRootSlug?: string
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }>
  attributes?: Record<string, unknown>

  // Additional images & description (for quick view drawer)
  images?: string[]
  description?: string | null

  // Seller
  sellerId?: string | null
  sellerName?: string | undefined
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerEmailVerified?: boolean
  sellerPhoneVerified?: boolean
  sellerIdVerified?: boolean

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null

  // Feature toggles
  showQuickAdd?: boolean
  showWishlist?: boolean
  showSeller?: boolean
  /** Disable opening the product quick view overlay on click (force navigation). */
  disableQuickView?: boolean

  /** Visual surface style: bordered card vs inline tile (mobile browse). */
  appearance?: "card" | "tile"
  /** Media aspect ratio (mobile browse uses landscape 4:3). */
  media?: "square" | "landscape"
  /** Density tuning for compact mobile browse. */
  density?: "default" | "compact"
  /** Title line clamp. Defaults to 2. */
  titleLines?: 1 | 2

  // Context
  index?: number
  currentUserId?: string | null
  inStock?: boolean
  className?: string

  // Rating & social proof (Pro Commerce style)
  rating?: number
  reviews?: number
  soldCount?: number
  favoritesCount?: number

  // Trust indicators
  showBuyerProtection?: boolean

  // Condition for C2C
  condition?: "new" | "like_new" | "used" | "refurbished" | string

  // B2B specific
  minOrderQuantity?: number
  bulkPricing?: { qty: number; price: number }[]
  businessVerified?: boolean
  samplesAvailable?: boolean

  // Promotion (boosted listing)
  isBoosted?: boolean
  boostExpiresAt?: string | null

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

// =============================================================================
// PRODUCT CARD COMPONENT - Pro Commerce: Temu Density + eBay Trust + Shein Polish
// =============================================================================

function ProductCard({
  id,
  title,
  price,
  image,
  images,
  description,
  originalPrice,
  isOnSale,
  salePercent,
  createdAt,
  categoryPath,
  categoryRootSlug,
  sellerId,
  sellerName,
  sellerAvatarUrl,
  sellerVerified,
  freeShipping = false,
  slug,
  username,
  variant = "default",
  state,
  showWishlist = true,
  disableQuickView = false,
  appearance = "card",
  media = "square",
  density = "default",
  titleLines = 2,
  index = 0,
  currentUserId,
  inStock = true,
  className,
  ref,
  rating,
  reviews,
  soldCount,
  condition,
  location,
  categorySlug,
  // Promotion
  isBoosted,
  boostExpiresAt,
}: ProductCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const pathname = usePathname() ?? "/"
  const { openProductQuickView, enabledDrawers, isDrawerSystemEnabled } = useDrawer()
  const isQuickViewEnabled = isDrawerSystemEnabled && enabledDrawers.productQuickView

  const isCompact = density === "compact"
  const isTile = appearance === "tile"
  const mediaRatio = media === "landscape" ? 4 / 3 : 1

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : (salePercent ?? 0)

  const hasRating = typeof rating === "number" && rating > 0
  const hasSoldCount = typeof soldCount === "number" && soldCount > 0
  const hasSocialProof = hasRating || hasSoldCount

  const shouldShowCondition =
    condition != null &&
    (categorySlug || categoryRootSlug
      ? shouldShowConditionBadge(categorySlug ?? null, categoryRootSlug ?? null)
      : true)

  const conditionLabel = React.useMemo(() => {
    if (!condition || !shouldShowCondition) return null
    const key = getConditionKey(condition)
    if (key) return t(key)
    return condition
  }, [condition, shouldShowCondition, t])

  const locationLabel = React.useMemo(() => location?.trim() || null, [location])
  const showFreshness =
    !!createdAt &&
    (conditionLabel ? 1 : 0) + (locationLabel ? 1 : 0) < 2

  // Resolve state
  const resolvedState = state ?? (isOnSale || hasDiscount ? "sale" : "default")

  const isBoostedActive = React.useMemo(() => {
    if (!isBoosted) return false
    if (!boostExpiresAt) return true
    return isBoostActiveNow({ is_boosted: true, boost_expires_at: boostExpiresAt })
  }, [boostExpiresAt, isBoosted])

  // URLs
  const productUrl = username ? `/${username}/${slug || id}` : "#"

  const isSearchRoute = React.useMemo(() => {
    const rawSegments = pathname.split("/").filter(Boolean)
    const segments = [...rawSegments]
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return segments.at(0) === "search"
  }, [pathname])

  const isCategoriesRoute = React.useMemo(() => {
    const rawSegments = pathname.split("/").filter(Boolean)
    const segments = [...rawSegments]
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return segments.at(0) === "categories"
  }, [pathname])

  const isBrowseRoute = isSearchRoute || isCategoriesRoute

  const isRouteModalQuickViewEnabled =
    isFeatureEnabled("routeModalProductQuickView") &&
    isBrowseRoute &&
    productUrl !== "#"

  const shouldUseDrawerQuickView =
    isQuickViewEnabled && !isRouteModalQuickViewEnabled && !disableQuickView

  // Check if own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Quick view handler (no URL change)
  // - Standard click: open quick view overlay
  // - Modified click: keep normal link behavior
  const handleCardClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!shouldUseDrawerQuickView) return

      // Allow expected link behaviors (new tab/window, copy link, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      e.preventDefault()
      // Build quick view data, only including defined properties
      // (exactOptionalPropertyTypes requires this pattern)
      const quickViewData: QuickViewProduct = {
        id,
        title,
        price,
        image,
        ...(images ? { images } : {}),
        ...(originalPrice != null ? { originalPrice } : {}),
        ...(description != null ? { description } : {}),
        ...(categoryPath ? { categoryPath } : {}),
        ...(condition != null ? { condition } : {}),
        ...(location != null ? { location } : {}),
        ...(freeShipping !== undefined ? { freeShipping } : {}),
        ...(rating !== undefined ? { rating } : {}),
        ...(reviews !== undefined ? { reviews } : {}),
        ...(inStock !== undefined ? { inStock } : {}),
        ...(slug != null ? { slug } : {}),
        ...(username != null ? { username } : {}),
        ...(sellerId != null ? { sellerId } : {}),
        ...(sellerName != null ? { sellerName } : {}),
        ...(sellerAvatarUrl != null ? { sellerAvatarUrl } : {}),
        ...(sellerVerified !== undefined ? { sellerVerified } : {}),
      }
      openProductQuickView(quickViewData)
    },
    [
      shouldUseDrawerQuickView,
      id,
      title,
      price,
      image,
      images,
      originalPrice,
      description,
      categoryPath,
      condition,
      location,
      freeShipping,
      rating,
      reviews,
      inStock,
      slug,
      username,
      sellerId,
      sellerName,
      sellerAvatarUrl,
      sellerVerified,
      openProductQuickView,
    ]
  )

  return (
    <Surface
      ref={ref}
      variant="card"
      interactive
      className={cn(
        productCardVariants({ variant, state: resolvedState }),
        isTile && "border-0 bg-transparent",
        className
      )}
    >
      {/* Full-card link for accessibility */}
      <Link
        href={productUrl}
        scroll={false}
        className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={t("openProduct", { title })}
        onClick={handleCardClick}
      >
        <span className="sr-only">{title}</span>
      </Link>

      <div className="relative">
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <ProductCardImage
            src={image}
            alt={title}
            index={index}
            inStock={inStock}
            outOfStockLabel={t("outOfStock")}
            ratio={mediaRatio}
          />

          {(isBoostedActive || (hasDiscount && discountPercent >= 5)) && (
            <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
              {isBoostedActive && (
                <Badge variant="secondary" className="text-2xs px-2 py-0.5">
                  {t("adBadge")}
                </Badge>
              )}
              {hasDiscount && discountPercent >= 5 && (
                <Badge
                  variant="destructive"
                  className="text-2xs px-2 py-0.5 font-semibold tabular-nums"
                >
                  -{discountPercent}%
                </Badge>
              )}
            </div>
          )}

          {showWishlist && (
            <div className="absolute right-1.5 top-1.5 z-10">
              <ProductCardActions
                id={id}
                title={title}
                price={price}
                image={image}
                slug={slug ?? null}
                username={username ?? null}
                showQuickAdd={false}
                showWishlist
                inStock={inStock}
                isOwnProduct={isOwnProduct}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          isTile
            ? cn(
                "px-0.5 pb-0.5 pt-2",
                isCompact ? "space-y-0.5" : "space-y-1"
              )
            : "space-y-1 p-2.5 pt-2"
        )}
      >
        <h3
          className={cn(
            "break-words font-medium text-foreground leading-snug",
            titleLines === 1 ? "line-clamp-1" : "line-clamp-2",
            isCompact ? "text-compact" : "text-sm"
          )}
        >
          {title}
        </h3>

        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          compact={isCompact}
        />

        {hasSocialProof ? (
          <ProductCardSocialProof
            rating={rating}
            reviews={reviews}
            soldCount={soldCount}
            soldLabel={t("sold")}
          />
        ) : (
          (conditionLabel || locationLabel || showFreshness) && (
            <div className="mt-1 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground">
              {conditionLabel && (
                <span className="shrink-0">{conditionLabel}</span>
              )}
              {conditionLabel && locationLabel && <span aria-hidden="true">·</span>}
              {locationLabel && (
                <span className="min-w-0 truncate">{locationLabel}</span>
              )}
              {(conditionLabel || locationLabel) && showFreshness && <span aria-hidden="true">·</span>}
              {showFreshness && (
                <FreshnessIndicator
                  createdAt={createdAt}
                  variant="text"
                  showIcon={false}
                  className="text-2xs text-muted-foreground"
                />
              )}
            </div>
          )
        )}
      </div>
    </Surface>
  )
}

// =============================================================================
// RE-EXPORTS FROM PRODUCT-GRID
// =============================================================================

export {
  ProductGrid,
  ProductCardSkeleton,
  ProductCardSkeletonGrid,
  type ProductGridProps,
  type ProductCardSkeletonProps,
  type ProductCardSkeletonGridProps,
} from "./product-grid"

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCard, productCardVariants, type ProductCardProps }
