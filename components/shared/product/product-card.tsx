"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { ProductCardActions } from "./product-card-actions"
import { ProductCardB2BBadges } from "./product-card-b2b-badges"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { ProductCardSeller } from "./product-card-seller"
import { ProductCardSocialProof } from "./product-card-social-proof"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { buildHeroBadgeText } from "@/lib/product-card-hero-attributes"
import { cva, type VariantProps } from "class-variance-authority"
import { Truck } from "@phosphor-icons/react"

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
  "tap-transparent group relative block h-full min-w-0 cursor-pointer overflow-hidden bg-transparent focus-within:ring-2 focus-within:ring-ring/40 lg:rounded-md lg:border lg:border-transparent lg:bg-card lg:transition-colors lg:duration-100 lg:hover:border-border",
  {
    variants: {
      variant: {
        default: "",
        featured: "lg:border-primary/30 lg:bg-primary/5",
      },
      state: {
        default: "",
        promoted: "lg:border-top-rated/40",
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

// =============================================================================
// PRODUCT CARD COMPONENT - Pro Commerce: Temu Density + eBay Trust + Shein Polish
// =============================================================================

function ProductCard({
  id,
  title,
  price,
  image,
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
  location,
  // B2B props
  minOrderQuantity,
  businessVerified,
  samplesAvailable,
}: ProductCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const t = useTranslations("Product")
  const locale = useLocale()

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

  const createdAtLabel = React.useMemo(() => {
    if (!createdAt) return null
    return formatTimeAgo(createdAt, locale)
  }, [createdAt, locale])

  const metaParts = React.useMemo(() => {
    const parts: string[] = []
    if (typeof location === "string" && location.trim()) parts.push(location.trim())
    if (typeof createdAtLabel === "string" && createdAtLabel.trim()) parts.push(createdAtLabel.trim())
    return parts
  }, [location, createdAtLabel])

  return (
    <div
      ref={ref}
      className={cn(productCardVariants({ variant, state: resolvedState }), className)}
    >
      {/* Full-card link for accessibility */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-1"
        aria-label={t("openProduct", { title })}
      >
        <span className="sr-only">{title}</span>
      </Link>

      {/* Image Container - 1:1 aspect ratio for consistent grid display */}
      <div className="relative overflow-hidden rounded-md border border-border/30 bg-muted lg:rounded-none lg:border-0">
        <ProductCardImage
          src={image}
          alt={title}
          index={index}
          inStock={inStock}
          outOfStockLabel={t("outOfStock")}
        />

        {/* Category Badge - Top Left (smaller, subtle background) */}
        {(categoryLabel || smartBadge) && (
          <Badge
            variant="category"
            className="absolute left-1.5 top-1.5 max-w-[calc(100%-2.75rem)] z-10 truncate border-transparent bg-background/80 text-2xs text-foreground/80 shadow-sm backdrop-blur-sm"
          >
            {categoryLabel ?? smartBadge}
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
      </div>

      {/* Content Area */}
      <div className="relative z-2 pt-1.5 lg:p-2">
        {/* Title (dense mobile grid) */}
        <h3 className="line-clamp-1 break-words text-body font-medium leading-snug text-foreground sm:line-clamp-2">
          {title}
        </h3>

        {/* Price + Condition */}
        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          conditionLabel={conditionLabel}
        />

        {/* Meta (C2C-style): location • time */}
        {metaParts.length > 0 && (
          <div className="mt-0.5 line-clamp-1 flex items-center gap-1 text-2xs text-muted-foreground">
            {metaParts.map((part, i) => (
              <React.Fragment key={`${part}-${i}`}>
                {i > 0 && <span aria-hidden="true">•</span>}
                <span className="truncate">{part}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Free Shipping (desktop only) */}
        {freeShipping && (
          <span className="mt-0.5 hidden sm:inline-flex items-center gap-0.5 rounded-sm bg-shipping-free/10 px-1 py-px text-2xs font-medium text-shipping-free">
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
        <div className="mt-1 hidden lg:flex items-center justify-between gap-2">
          {/* Seller Info */}
          {displaySellerName ? (
            <ProductCardSeller
              name={displaySellerName}
              avatarUrl={sellerAvatarUrl}
              verified={sellerVerified}
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
