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
import { FavoritesCount } from "./favorites-count"
import { FreshnessIndicator } from "./freshness-indicator"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { buildHeroBadgeText } from "@/lib/product-card-hero-attributes"
import { cva, type VariantProps } from "class-variance-authority"
import { Truck } from "@phosphor-icons/react"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { isFeatureEnabled } from "@/lib/feature-flags"

function formatTimeAgo(input: string, locale: string): string | null {
  const d = new Date(input)
  const ms = d.getTime()
  if (!Number.isFinite(ms)) return null

  const diffSeconds = Math.round((ms - Date.now()) / 1000)
  const abs = Math.abs(diffSeconds)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" })

  if (abs < 60) return rtf.format(diffSeconds, "second")

  const diffMinutes = Math.round(diffSeconds / 60)
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute")

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour")

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day")

  const diffWeeks = Math.round(diffDays / 7)
  if (Math.abs(diffWeeks) < 5) return rtf.format(diffWeeks, "week")

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month")

  const diffYears = Math.round(diffDays / 365)
  return rtf.format(diffYears, "year")
}

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
  const pathname = usePathname()
  const isMobile = useIsMobile()
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

  const isRouteModalQuickViewEnabled =
    isFeatureEnabled("routeModalProductQuickView") &&
    !isMobile &&
    isSearchRoute &&
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

        {/* Promoted badge - top left (ad disclosure) */}
        {isBoosted && (
          <Badge variant="promoted" className="absolute top-1.5 left-1.5 z-10">
            {t("adBadge")}
          </Badge>
        )}

        {/* Wishlist button - using ProductCardActions */}
        <ProductCardActions
          id={id}
          title={title}
          price={price}
          image={image}
          slug={slug ?? null}
          username={username ?? null}
          showQuickAdd={false}
          showWishlist={showWishlist}
          inStock={inStock}
          isOwnProduct={isOwnProduct}
        />

        {/* Favorites count - bottom left overlay (Vinted style) */}
        {favoritesCount && favoritesCount > 0 && (
          <div className="absolute bottom-1.5 left-1.5 z-10 bg-background/80 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            <FavoritesCount count={favoritesCount} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative z-2 mt-1">
        {/* Title - Treido: text-compact line-clamp-2 */}
        <p className="line-clamp-2 break-words text-compact font-medium text-foreground leading-tight">
          {title}
        </p>

        {/* Smart Badge - contextual category info (e.g., "BMW 320d" for cars) */}
        {smartBadge && (
          <p className="text-tiny text-muted-foreground truncate mt-0.5">
            {smartBadge}
          </p>
        )}

        {/* Price + Condition + Protection */}
        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          conditionLabel={conditionLabel}
          showBuyerProtection={showBuyerProtection}
          buyerProtectionLabel={t("buyerProtectionInline")}
        />

        {/* Meta row: Location + Freshness indicator */}
        <div className="flex items-center gap-1.5 text-tiny min-w-0">
          {location && (
            <span className="text-muted-foreground truncate min-w-0 flex-1">{location}</span>
          )}
          {location && createdAt && <span className="text-muted-foreground shrink-0">·</span>}
          <FreshnessIndicator createdAt={createdAt} className="shrink-0" />
        </div>

        {/* Free Shipping - Treido subtle style */}
        {freeShipping && (
          <span className="inline-flex items-center gap-0.5 text-tiny text-muted-foreground">
            <Truck size={10} weight="bold" />
            <span className="hidden xs:inline">{t("freeShipping")}</span>
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

        {/* Seller Row + Quick-Add (desktop only) */}
        <div className="hidden lg:flex items-center justify-between gap-2 mt-1">
          {/* Seller Info */}
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

          {/* Quick-Add Button - using ProductCardActions */}
          <ProductCardActions
            id={id}
            title={title}
            price={price}
            image={image}
            slug={slug ?? null}
            username={username ?? null}
            showQuickAdd={showQuickAdd}
            showWishlist={false}
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
