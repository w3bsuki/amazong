"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Surface } from "@/components/ui/surface"
import { Lightning } from "@phosphor-icons/react"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { isBoostActiveNow } from "@/lib/boost/boost-status"
import { shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"
import { getListingOverlayBadgeVariants } from "@/lib/ui/badge-intent"

import { ProductCardActions } from "./product-card-actions"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { ProductCardSocialProof } from "./product-card-social-proof"
import { FreshnessIndicator } from "./freshness-indicator"
import { CategoryBadge } from "./category-badge"
import { VerifiedSellerBadge } from "./verified-seller-badge"
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

const HOME_MIN_RATING_REVIEWS = 8

type ProductCardPresetKey =
  `${NonNullable<ProductCardViewConfig["uiVariant"]>}:${NonNullable<ProductCardViewConfig["appearance"]>}:${NonNullable<ProductCardViewConfig["density"]>}`

interface ProductCardPreset {
  surfaceVariant: "card" | "tile"
  surfaceInteractive: boolean
  showImageDivider: boolean
  bodyClass: string
  titleClass: string
  metaClass: string
  priceEmphasis: "default" | "strong"
  discountAsBadge: boolean
}

const PRODUCT_CARD_PRESETS: Record<ProductCardPresetKey, ProductCardPreset> = {
  "default:card:default": {
    surfaceVariant: "card",
    surfaceInteractive: true,
    showImageDivider: true,
    bodyClass: "space-y-1.5 p-2.5 pt-2.5",
    titleClass: "text-sm font-semibold",
    metaClass: "mt-1 flex min-w-0 items-center gap-1.5 text-tiny text-muted-foreground",
    priceEmphasis: "default",
    discountAsBadge: false,
  },
  "default:card:compact": {
    surfaceVariant: "card",
    surfaceInteractive: true,
    showImageDivider: true,
    bodyClass: "space-y-1.5 p-2.5 pt-2.5",
    titleClass: "text-compact font-semibold",
    metaClass: "mt-1 flex min-w-0 items-center gap-1.5 text-tiny text-muted-foreground",
    priceEmphasis: "default",
    discountAsBadge: false,
  },
  "default:tile:default": {
    surfaceVariant: "tile",
    surfaceInteractive: false,
    showImageDivider: false,
    bodyClass: "space-y-1 px-1.5 pb-2 pt-2",
    titleClass: "text-sm font-medium",
    metaClass: "mt-1 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground",
    priceEmphasis: "default",
    discountAsBadge: false,
  },
  "default:tile:compact": {
    surfaceVariant: "tile",
    surfaceInteractive: false,
    showImageDivider: false,
    bodyClass: "space-y-1 px-1.5 pb-2 pt-2",
    titleClass: "text-compact font-medium",
    metaClass: "mt-1 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground",
    priceEmphasis: "default",
    discountAsBadge: false,
  },
  "home:card:default": {
    surfaceVariant: "tile",
    surfaceInteractive: false,
    showImageDivider: false,
    bodyClass: "space-y-1 px-1 py-1.5",
    titleClass: "text-compact font-medium",
    metaClass: "mt-0.5 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground",
    priceEmphasis: "strong",
    discountAsBadge: true,
  },
  "home:card:compact": {
    surfaceVariant: "tile",
    surfaceInteractive: false,
    showImageDivider: false,
    bodyClass: "space-y-1 px-1 py-1.5",
    titleClass: "text-compact font-medium",
    metaClass: "mt-0.5 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground",
    priceEmphasis: "strong",
    discountAsBadge: true,
  },
  "home:tile:default": {
    surfaceVariant: "tile",
    surfaceInteractive: false,
    showImageDivider: false,
    bodyClass: "space-y-1 px-1 py-1.5",
    titleClass: "text-compact font-medium",
    metaClass: "mt-0.5 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground",
    priceEmphasis: "strong",
    discountAsBadge: true,
  },
  "home:tile:compact": {
    surfaceVariant: "tile",
    surfaceInteractive: false,
    showImageDivider: false,
    bodyClass: "space-y-1 px-1 py-1.5",
    titleClass: "text-compact font-medium",
    metaClass: "mt-0.5 flex min-w-0 items-center gap-1 text-2xs text-muted-foreground",
    priceEmphasis: "strong",
    discountAsBadge: true,
  },
}

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
  showCategoryBadge = true,
  disableQuickView = false,
  appearance = "card",
  media = "square",
  density = "default",
  titleLines = 1,
  uiVariant = "default",
  radius = "xl",
  maxOverlayBadges,
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
  const isHomeUi = uiVariant === "home"
  const mediaRatio = media === "landscape" ? 4 / 3 : media === "square" ? 1 : 4 / 5
  const radiusClass = radius === "2xl" ? "rounded-2xl" : "rounded-xl"
  const actionSize = "icon-compact"
  const radiusTopClass = radius === "2xl" ? "rounded-t-2xl" : "rounded-t-xl"
  const presetKey = `${uiVariant}:${appearance}:${density}` as ProductCardPresetKey
  const visualPreset = PRODUCT_CARD_PRESETS[presetKey] ?? PRODUCT_CARD_PRESETS["default:card:default"]

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : (salePercent ?? 0)

  const reviewCount = typeof reviews === "number" ? reviews : 0
  const hasRating = typeof rating === "number" && rating > 0
  const hasHomeRating = hasRating && reviewCount >= HOME_MIN_RATING_REVIEWS
  const showRating = isHomeUi ? hasHomeRating : hasRating
  const hasSoldCount = typeof soldCount === "number" && soldCount > 0
  const hasSocialProof = showRating || hasSoldCount

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
  const showFreshness = hasFreshness && !isHomeUi

  const rootCategoryBadge = React.useMemo(() => {
    const root = categoryPath?.[0]
    if (!root) return null
    return {
      slug: root.slug,
      name: root.name,
      name_bg: root.nameBg ?? null,
      icon: root.icon ?? null,
    }
  }, [categoryPath])

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
  const resolvedMaxOverlayBadges = Math.max(
    0,
    maxOverlayBadges ?? (isHomeUi ? 2 : 2)
  )
  const visibleOverlayBadgeVariants = React.useMemo(
    () => overlayBadgeVariants.slice(0, resolvedMaxOverlayBadges),
    [overlayBadgeVariants, resolvedMaxOverlayBadges]
  )
  const hasPromotedOverlay = visibleOverlayBadgeVariants.includes("promoted")
  const showOverlayVerified = isHomeUi && sellerVerified && !hasPromotedOverlay
  const showVerifiedInMeta = sellerVerified && !isHomeUi
  const showHomeShipping = isHomeUi && freeShipping === true
  const hasTrustSignals = Boolean(freeShipping || showVerifiedInMeta)
  const hasInfoMeta =
    isHomeUi
      ? false
      : Boolean(conditionLabel || locationLabel || hasTrustSignals)
  const hasDiscountOverlay = visibleOverlayBadgeVariants.includes("discount")
  const showInlineDiscount = isHomeUi && hasDiscount && discountPercent >= 5 && !hasDiscountOverlay

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
      variant={visualPreset.surfaceVariant}
      interactive={visualPreset.surfaceInteractive}
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
            "relative overflow-hidden bg-surface-subtle",
            visualPreset.surfaceVariant === "card" && !isTile
              ? cn(radiusTopClass, "rounded-b-none")
              : radiusClass,
            visualPreset.showImageDivider && !isTile && "border-b border-border-subtle"
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

          {inStock && (visibleOverlayBadgeVariants.length > 0 || showOverlayVerified) && (
            <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1 pointer-events-none">
              {visibleOverlayBadgeVariants.map((variant) => {
                if (variant === "promoted") {
                  return (
                    <span
                      key="promoted"
                      className="flex size-6 items-center justify-center rounded-full bg-promoted text-promoted-foreground shadow-sm"
                      role="img"
                      aria-label={t("adBadge")}
                    >
                      <Lightning size={14} weight="fill" />
                    </span>
                  )
                }
                return (
                  <Badge key="discount" size="compact" variant="discount">
                    -{discountPercent}%
                  </Badge>
                )
              })}
              {showOverlayVerified && (
                <VerifiedSellerBadge
                  label={t("b2b.verifiedShort")}
                  variant="icon"
                  size="sm"
                />
              )}
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
          visualPreset.bodyClass
        )}
      >
        {isHomeUi && showCategoryBadge && rootCategoryBadge && (
          <CategoryBadge
            locale={locale}
            category={rootCategoryBadge}
            size="sm"
            className="w-fit max-w-full border-border-subtle bg-surface-subtle text-foreground"
          />
        )}

        <h3
          className={cn(
            "min-w-0 text-foreground leading-tight tracking-tight",
            titleLines === 1 ? "truncate" : "line-clamp-2 break-words",
            visualPreset.titleClass
          )}
        >
          {title}
        </h3>

        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          compact={isCompact}
          homeEmphasis={isHomeUi}
          priceEmphasis={visualPreset.priceEmphasis}
          showOriginalPrice={!showInlineDiscount}
          discountAsBadge={visualPreset.discountAsBadge}
          {...(showInlineDiscount ? { trailingLabel: `-${discountPercent}%` } : {})}
        />

        {(hasSocialProof || showFreshness || showHomeShipping) && (
          <div className={visualPreset.metaClass}>
            {hasSocialProof && (
              <>
                <ProductCardSocialProof
                  rating={showRating ? rating : undefined}
                  reviews={showRating ? reviews : undefined}
                  soldCount={soldCount}
                  soldLabel={t("sold")}
                />
              </>
            )}
            {hasSocialProof && showFreshness && <span aria-hidden="true">·</span>}
            {showFreshness && (
              <FreshnessIndicator
                createdAt={createdAt}
                variant="text"
                showIcon={false}
                className="text-tiny text-muted-foreground"
              />
            )}
            {(hasSocialProof || showFreshness) && showHomeShipping && <span aria-hidden="true">·</span>}
            {showHomeShipping && (
              <Badge variant="shipping" size="compact" className="shrink-0">
                {t("freeDeliveryShort")}
              </Badge>
            )}
          </div>
        )}

        {hasInfoMeta && (
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-tiny text-muted-foreground">
            {conditionLabel && <span className="shrink-0">{conditionLabel}</span>}
            {conditionLabel && locationLabel && <span aria-hidden="true">·</span>}
            {locationLabel && <span className="min-w-0 truncate">{locationLabel}</span>}
            {(conditionLabel || locationLabel) && hasTrustSignals && <span aria-hidden="true">·</span>}
            {freeShipping && (
              <span className="shrink-0 font-medium text-foreground">{t("freeDeliveryShort")}</span>
            )}
            {freeShipping && showVerifiedInMeta && <span aria-hidden="true">·</span>}
            {showVerifiedInMeta && (
              <VerifiedSellerBadge
                label={t("b2b.verifiedShort")}
                className="shrink-0"
              />
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
