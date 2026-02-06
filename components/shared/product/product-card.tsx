"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Surface } from "@/components/ui/surface"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { isBoostActiveNow } from "@/lib/boost/boost-status"
import { shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"
import { getListingOverlayBadgeVariants } from "@/lib/ui/badge-intent"

import { ProductCardActions } from "./product-card-actions"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { ProductCardSocialProof } from "./product-card-social-proof"
import { FreshnessIndicator } from "./freshness-indicator"
import { getConditionKey } from "./_lib/condition"
import type { ProductCardData, ProductCardViewConfig } from "./product-card.types"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const productCardVariants = cva(
  "tap-highlight tap-transparent group relative flex h-full min-w-0 cursor-pointer flex-col",
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

interface ProductCardProps
  extends ProductCardData,
    ProductCardViewConfig,
    VariantProps<typeof productCardVariants> {
  // NOTE: ProductCardData + ProductCardViewConfig are the preferred input contracts.
  // ProductCardProps remains as a compatibility superset during incremental migration.
  // Context
  index?: number
  currentUserId?: string | null
  className?: string

  // Rating & social proof (Pro Commerce style)
  showBuyerProtection?: boolean

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
  titleLines = 1,
  uiVariant = "default",
  radius = "xl",
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
  const { openProductQuickView, enabledDrawers, isDrawerSystemEnabled } = useDrawer()
  const isQuickViewEnabled = isDrawerSystemEnabled && enabledDrawers.productQuickView

  const isCompact = density === "compact"
  const isTile = appearance === "tile"
  const mediaRatio = media === "landscape" ? 4 / 3 : 1
  const radiusClass = radius === "2xl" ? "rounded-xl" : "rounded-lg"
  const actionSize = "icon"
  const radiusTopClass = radius === "2xl" ? "rounded-t-xl" : "rounded-t-lg"

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
  const hasFreshness = !!createdAt

  // Resolve state
  const resolvedState = state ?? (isOnSale || hasDiscount ? "sale" : "default")

  const isBoostedActive = React.useMemo(() => {
    if (!isBoosted) return false
    if (!boostExpiresAt) return true
    return isBoostActiveNow({ is_boosted: true, boost_expires_at: boostExpiresAt })
  }, [boostExpiresAt, isBoosted])

  const overlayBadgeVariants = React.useMemo(
    () =>
      getListingOverlayBadgeVariants({
        isPromoted: isBoostedActive,
        discountPercent,
        minDiscountPercent: 5,
      }),
    [discountPercent, isBoostedActive]
  )

  // URLs
  const productUrl = username ? `/${username}/${slug || id}` : "#"
  const shouldUseDrawerQuickView = isQuickViewEnabled && !disableQuickView

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
        ...(typeof window !== "undefined" ? { sourceScrollY: window.scrollY } : {}),
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
      variant={isTile ? "tile" : "card"}
      interactive={!isTile}
      className={cn(
        productCardVariants({ variant, state: resolvedState }),
        radiusClass,
        className
      )}
    >
      {/* Full-card link for accessibility */}
      <Link
        href={productUrl}
        data-slot="product-card-link"
        className={cn(
          "absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
          radiusClass
        )}
        aria-label={t("openProduct", { title })}
        onClick={handleCardClick}
      >
        <span className="sr-only">{title}</span>
      </Link>

      <div className="relative">
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            isTile ? radiusClass : cn(radiusTopClass, "rounded-b-none"),
            !isTile && "border-b border-border-subtle"
          )}
        >
          <ProductCardImage
            src={image}
            alt={title}
            index={index}
            inStock={inStock}
            outOfStockLabel={t("outOfStock")}
            ratio={mediaRatio}
          />

          {inStock && overlayBadgeVariants.length > 0 && (
            <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1 pointer-events-none">
              {overlayBadgeVariants.map((variant) => {
                if (variant === "promoted") {
                  return (
                    <Badge key="promoted" variant="promoted" className="text-2xs px-2 py-0.5">
                      {t("adBadge")}
                    </Badge>
                  )
                }
                return (
                  <Badge key="discount" variant="discount" className="text-2xs px-2 py-0.5">
                    -{discountPercent}%
                  </Badge>
                )
              })}
            </div>
          )}

          {showWishlist && (
            <div className="absolute right-1.5 top-1.5 z-20">
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
                size={actionSize}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          isTile
            ? cn(
                "px-1.5 pb-1.5 pt-2",
                isCompact ? "space-y-1" : "space-y-1.5"
              )
            : "space-y-1.5 p-3 pt-2.5"
        )}
      >
        <h3
          className={cn(
            "min-w-0 font-medium text-foreground leading-tight",
            titleLines === 1 ? "truncate" : "line-clamp-2 break-words",
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

        {(hasSocialProof || conditionLabel || locationLabel || hasFreshness) && (
          <div className="mt-1 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground">
            {hasSocialProof ? (
              <>
                <ProductCardSocialProof
                  rating={rating}
                  reviews={reviews}
                  soldCount={soldCount}
                  soldLabel={t("sold")}
                />
                {hasFreshness && <span aria-hidden="true">·</span>}
                {hasFreshness && (
                  <FreshnessIndicator
                    createdAt={createdAt}
                    variant="text"
                    showIcon={false}
                    className="text-2xs text-muted-foreground"
                  />
                )}
              </>
            ) : (
              <>
                {conditionLabel && (
                  <span className="shrink-0">{conditionLabel}</span>
                )}
                {conditionLabel && locationLabel && <span aria-hidden="true">·</span>}
                {locationLabel && (
                  <span className="min-w-0 truncate">{locationLabel}</span>
                )}
                {(conditionLabel || locationLabel) && hasFreshness && <span aria-hidden="true">·</span>}
                {hasFreshness && (
                  <FreshnessIndicator
                    createdAt={createdAt}
                    variant="text"
                    showIcon={false}
                    className="text-2xs text-muted-foreground"
                  />
                )}
              </>
            )}
          </div>
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
export type { ProductCardData, ProductCardViewConfig } from "./product-card.types"
