"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { isBoostActiveNow } from "@/lib/boost/boost-status"

import { ProductCardActions } from "./product-card-actions"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { ProductCardSocialProof } from "./product-card-social-proof"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const productCardVariants = cva(
  "tap-transparent group relative flex h-full min-w-0 cursor-pointer flex-col rounded-xl border border-border bg-card p-2.5 transition-colors hover:bg-hover active:bg-active",
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
  categoryPath,
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
  index = 0,
  currentUserId,
  inStock = true,
  className,
  ref,
  rating,
  reviews,
  condition,
  location,
  // Promotion
  isBoosted,
  boostExpiresAt,
}: ProductCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const pathname = usePathname() ?? "/"
  const { openProductQuickView, enabledDrawers, isDrawerSystemEnabled } = useDrawer()
  const isQuickViewEnabled = isDrawerSystemEnabled && enabledDrawers.productQuickView

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : (salePercent ?? 0)

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
    <div
      ref={ref}
      className={cn(productCardVariants({ variant, state: resolvedState }), className)}
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
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <ProductCardImage
            src={image}
            alt={title}
            index={index}
            inStock={inStock}
            outOfStockLabel={t("outOfStock")}
          />

          {(isBoostedActive || (hasDiscount && discountPercent >= 5)) && (
            <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
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
            <div className="absolute right-2 top-2 z-10">
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

      <div className="mt-2 space-y-1">
        <h3 className="line-clamp-2 break-words text-sm font-medium leading-snug text-foreground">
          {title}
        </h3>

        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
        />

        <ProductCardSocialProof
          rating={rating}
          reviews={reviews}
          soldCount={undefined}
          soldLabel={t("sold")}
        />
      </div>
    </div>
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
