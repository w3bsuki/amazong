"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { ProductCardActions } from "./product-card-actions"
import { ProductCardB2BBadges } from "./product-card-b2b-badges"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { ProductCardSeller } from "./product-card-seller"
import { ProductCardSocialProof } from "./product-card-social-proof"
import { ProductCardWishlistButton } from "./product-card-wishlist-button"
import { FreshnessIndicator } from "./freshness-indicator"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { buildHeroBadgeText } from "@/lib/product-card-hero-attributes"
import { cva, type VariantProps } from "class-variance-authority"
import { Truck } from "@phosphor-icons/react"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { formatTimeAgo } from "@/lib/utils/format-time"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const productCardVariants = cva(
  // Marketplace style: no shadow, no padding, tight and clean
  "tap-transparent group relative block h-full min-w-0 cursor-pointer active:opacity-95 transition-colors",
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
  createdAt,
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
  sellerEmailVerified,
  sellerPhoneVerified,
  sellerIdVerified,
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
  favoritesCount,
  showBuyerProtection = false,
  condition,
  location,
  // B2B props
  minOrderQuantity,
  businessVerified,
  samplesAvailable,
  // Promotion
  isBoosted,
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

  // URLs
  const productUrl = username ? `/${username}/${slug || id}` : "#"
  // Seller display name (prefer sellerName, fallback to username)
  const displaySellerName = showSeller ? (sellerName || username || null) : null

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

  const shouldUseDrawerQuickView = isQuickViewEnabled && !isRouteModalQuickViewEnabled

  // Check if own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Smart badge text (category-aware attributes)
  const smartBadge = React.useMemo(() => {
    return buildHeroBadgeText(categoryRootSlug, attributes, categoryPath, locale)
  }, [categoryRootSlug, attributes, categoryPath, locale])

  const categoryLabel = React.useMemo(() => {
    const last = categoryPath?.at(-1)
    if (!last) return null
    if (locale === "bg" && last.nameBg) return last.nameBg
    return last.name
  }, [categoryPath, locale])

  // Condition badge helper (C2C feature)
  const conditionLabel = React.useMemo(() => {
    if (!condition) return null
    const c = condition.toLowerCase()
    if (c === "new" || c === "novo" || c === "ново") return t("condition.new")
    if (c === "like_new" || c === "like new" || c === "като ново") return t("condition.likeNew")
    if (c === "used" || c === "употребявано") return t("condition.usedShort")
    if (c === "refurbished" || c === "рефърбиш") return t("condition.refurbShort")
    return condition.slice(0, 8)
  }, [condition, t])

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
        className="absolute inset-0 z-1"
        aria-label={t("openProduct", { title })}
        onClick={handleCardClick}
      >
        <span className="sr-only">{title}</span>
      </Link>

      {/* Image Container - using card radius for consistent e-commerce look */}
      <div className="relative aspect-square overflow-hidden rounded-(--radius-card) bg-muted">
        <ProductCardImage
          src={image}
          alt={title}
          index={index}
          inStock={inStock}
          outOfStockLabel={t("outOfStock")}
        />

        {/* Top-left: Stacked badges (promoted + discount on mobile) */}
        {(isBoosted || (hasDiscount && discountPercent >= 5)) && (
          <div className="absolute top-1 left-1 lg:top-1.5 lg:left-1.5 z-10 flex flex-col gap-0.5">
            {isBoosted && (
              <Badge variant="promoted" className="text-2xs rounded-full px-1.5 py-0.5">
                {t("adBadge")}
              </Badge>
            )}
            {/* Discount pill - mobile only (desktop shows inline in content) */}
            {hasDiscount && discountPercent >= 5 && (
              <Badge variant="sale" className="text-2xs rounded-full px-1.5 py-0.5 font-semibold lg:hidden">
                -{discountPercent}%
              </Badge>
            )}
          </div>
        )}

        {/* Top-right: Wishlist button with count (desktop only - mobile uses drawer) */}
        {showWishlist && (
          <div className="hidden lg:block">
            <ProductCardWishlistButton
              id={id}
              title={title}
              price={price}
              image={image}
              {...(favoritesCount !== undefined ? { favoritesCount } : {})}
              isOwnProduct={isOwnProduct}
            />
          </div>
        )}
      </div>

      {/* Content Area - Ultra-clean mobile-first layout */}
      <div className="relative z-2 mt-1 lg:mt-1.5 space-y-0">
        {/* Category + Time row - compact pill style */}
        <div className="flex items-center gap-1 text-2xs min-w-0">
          {(categoryLabel || smartBadge) && (
            <span className="min-w-0 truncate rounded-sm bg-surface-subtle px-1 py-px text-muted-foreground">
              {smartBadge || categoryLabel}
            </span>
          )}
          {createdAt && (
            <>
              {(categoryLabel || smartBadge) && <span className="text-muted-foreground/50">·</span>}
              <FreshnessIndicator createdAt={createdAt} className="shrink-0 text-muted-foreground/70" />
            </>
          )}
          {/* Desktop: show discount + free shipping inline */}
          <span className="hidden lg:contents">
            {hasDiscount && discountPercent >= 5 && (
              <><span className="text-muted-foreground/50">·</span><span className="text-destructive font-medium">-{discountPercent}%</span></>
            )}
            {freeShipping && (
              <><span className="text-muted-foreground/50">·</span><span className="text-success font-medium">{t("freeShipping")}</span></>
            )}
          </span>
        </div>

        {/* Title - clean, tight, de-emphasized vs price */}
        <h3 className="line-clamp-2 break-words text-compact lg:text-sm font-normal lg:font-medium text-foreground leading-tight">
          {title}
        </h3>

        {/* Price - compact, clean typography */}
        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          conditionLabel={conditionLabel}
          showBuyerProtection={showBuyerProtection}
          buyerProtectionLabel={t("buyerProtectionInline")}
          compact
        />

        {/* Location - mobile only, if no category shown */}
        {location && (
          <span className="block lg:hidden text-2xs text-muted-foreground/70 truncate">
            {location}
          </span>
        )}

        {/* Social Proof Row: Rating + Sold Count */}
        <ProductCardSocialProof
          rating={rating}
          reviews={reviews}
          soldCount={soldCount}
          soldLabel={t("sold")}
        />

        {/* B2B Badges (if applicable) */}
        <ProductCardB2BBadges
          minOrderQuantity={minOrderQuantity}
          businessVerified={businessVerified}
          samplesAvailable={samplesAvailable}
          labels={{
            moq: t("b2b.moqShort"),
            samples: t("b2b.samples"),
            verified: t("b2b.verifiedShort"),
          }}
        />

        {/* Seller Row + Quick-Add (desktop only - cleaner mobile UX) */}
        <div className="hidden lg:flex items-center justify-between gap-2 pt-1">
          {displaySellerName ? (
            <ProductCardSeller
              name={displaySellerName}
              avatarUrl={sellerAvatarUrl}
              verified={sellerVerified}
              emailVerified={sellerEmailVerified}
              phoneVerified={sellerPhoneVerified}
              idVerified={sellerIdVerified}
            />
          ) : (
            <div className="flex-1" />
          )}
          <ProductCardActions
            id={id}
            title={title}
            price={price}
            image={image}
            slug={slug ?? null}
            username={username ?? null}
            showQuickAdd={showQuickAdd}
            showWishlist={false} // Wishlist is now in top-right of image
            inStock={inStock}
            isOwnProduct={isOwnProduct}
          />
        </div>
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
