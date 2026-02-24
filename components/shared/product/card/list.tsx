import Image from "next/image"
import { MapPin, ShieldCheck, Truck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { getConditionBadgeVariant, getConditionKey } from "@/components/shared/product/condition"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { computeBadgeSpecsClient, shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"
import { getCategoryName } from "@/lib/data/categories/display"
import { normalizeImageUrl } from "@/lib/normalize-image-url"
import { getListingOverlayBadgeVariants } from "@/lib/ui/badge-intent"

import { FreshnessIndicator } from "../freshness-indicator"
import { VerifiedSellerBadge } from "../verified-seller-badge"
import { ProductCardActions } from "./actions"
import { ProductCardPrice } from "./price"

type CategoryPathItem = {
  slug: string
  name: string
  nameBg?: string | null
  icon?: string | null
}

interface ProductCardListProps {
  // Required
  id: string
  title: string
  price: number
  image: string
  isBoosted?: boolean

  // Meta
  createdAt?: string | null | undefined
  description?: string | null

  // Pricing
  originalPrice?: number | null

  // Seller
  sellerId?: string | null
  sellerName?: string | undefined
  sellerVerified?: boolean

  // Shipping
  freeShipping?: boolean

  // Location
  location?: string | undefined

  // URLs
  slug?: string | null
  username?: string | null

  // Feature toggles
  showWishlist?: boolean

  // Context
  currentUserId?: string | null
  inStock?: boolean
  className?: string

  // Condition for C2C
  condition?: "new" | "like_new" | "used" | "refurbished" | string | undefined

  // Trust
  showBuyerProtection?: boolean

  // Category context for smart badges
  categorySlug?: string | null
  rootCategorySlug?: string | null
  attributes?: Record<string, unknown>
  categoryPath?: CategoryPathItem[] | undefined
}

/**
 * ProductCardList - Horizontal list view card showing more info
 * OLX/Bazar-style with image on left, details on right
 */
export function ProductCardList({
  id,
  title,
  price,
  image,
  isBoosted = false,
  createdAt,
  description,
  originalPrice,
  sellerId,
  sellerName,
  sellerVerified,
  freeShipping = false,
  location,
  slug,
  username,
  showWishlist = true,
  currentUserId,
  inStock = true,
  className,
  condition,
  showBuyerProtection = false,
  categorySlug,
  rootCategorySlug,
  attributes = {},
  categoryPath,
}: ProductCardListProps) {
  const t = useTranslations("Product")
  const locale = useLocale()

  // URLs
  const productUrl = username ? `/${username}/${slug || id}` : "#"

  // Check if own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Category-aware smart badges
  const smartBadges = computeBadgeSpecsClient({
    categorySlug: categorySlug || null,
    rootCategorySlug: rootCategorySlug || null,
    condition: condition || null,
    attributes,
  })

  const formatBadgeValue = (badge: { key: string; value: string }): string => {
    if (badge.key === "condition") {
      const key = getConditionKey(badge.value)
      return key ? t(key) : badge.value
    }

    if (badge.key === "mileage" || badge.key === "range") {
      const numeric = Number(badge.value)
      const formatted = Number.isFinite(numeric)
        ? new Intl.NumberFormat(locale).format(numeric)
        : badge.value
      return t("badges.values.kilometers", { value: formatted })
    }

    return badge.value
  }

  const getBadgeLabel = (badgeKey: string): string => {
    return t(`badges.labels.${badgeKey}` as never)
  }

  // Fallback condition label for categories that show condition
  // If smart badges already include condition, don't duplicate.
  const conditionLabel = (() => {
    if (smartBadges.some((badge) => badge.key === "condition")) return null
    if (!shouldShowConditionBadge(categorySlug || null, rootCategorySlug || null)) return null
    if (!condition) return null
    const key = getConditionKey(condition)
    if (key) return t(key)
    return condition.slice(0, 8)
  })()

  const rootCategoryLabel = (() => {
    const rootCategory = categoryPath?.[0]
    if (!rootCategory) return null

    const fallbackName = rootCategory.name?.trim()
    if (!fallbackName) return null

    const localizedName = getCategoryName(
      {
        id: rootCategory.slug || fallbackName,
        slug: rootCategory.slug || fallbackName,
        name: fallbackName,
        name_bg: rootCategory.nameBg ?? null,
      },
      locale
    ).trim()

    return localizedName || fallbackName
  })()

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0
  const overlayBadgeVariants = getListingOverlayBadgeVariants({
    isPromoted: isBoosted,
    discountPercent,
    minDiscountPercent: 1,
  })

  return (
    <Card
      data-slot="surface"
      className={cn(
        "group relative flex gap-3 border-border-subtle p-2.5 shadow-none transition-colors hover:border-border hover:bg-hover active:bg-active",
        className
      )}
    >
      {/* Full-card link for accessibility */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={t("openProduct", { title })}
      >
        <span className="sr-only">{title}</span>
      </Link>

      {/* Image - Left side */}
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-surface-subtle sm:h-40 sm:w-40">
        <Image
          src={normalizeImageUrl(image)}
          alt={title}
          fill
          sizes="(max-width: 640px) 128px, 160px"
          className="pointer-events-none object-cover"
        />

        {/* Status badges (Promo / Discount) */}
        {overlayBadgeVariants.length > 0 && (
          <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
            {overlayBadgeVariants.map((variant) =>
              variant === "promoted" ? (
                <MarketplaceBadge key={variant} variant="promoted">
                  {t("adBadge")}
                </MarketplaceBadge>
              ) : (
                <MarketplaceBadge key={variant} variant="discount">
                  -{discountPercent}%
                </MarketplaceBadge>
              )
            )}
          </div>
        )}

        {/* Wishlist button overlay */}
        <div className="absolute right-1.5 top-1.5 z-20">
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
            size="icon-compact"
          />
        </div>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface-overlay">
            <span className="text-xs font-medium text-muted-foreground">{t("outOfStock")}</span>
          </div>
        )}
      </div>

      {/* Content - Right side */}
      <div className="relative z-0 flex min-w-0 flex-1 flex-col">
        {/* Title */}
        <h3 className="mb-1 min-w-0 truncate text-sm sm:text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>

        {rootCategoryLabel && (
          <span
            data-slot="category"
            className="mb-1 block min-w-0 truncate text-2xs font-medium text-muted-foreground"
          >
            {rootCategoryLabel}
          </span>
        )}

        {/* Description (if available) */}
        {description && (
          <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
        )}

        {/* Meta row: smart badges, location, freshness */}
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {/* Category-aware smart badges (mileage for cars, condition for clothing, etc.) */}
          {smartBadges.map((badge) => {
            const value = formatBadgeValue(badge)
            return (
              <MarketplaceBadge
                key={badge.key}
                size="compact"
                variant={badge.key === "condition" ? getConditionBadgeVariant(badge.value) : "condition"}
                className="text-2xs"
                title={`${getBadgeLabel(badge.key)}: ${value}`}
              >
                {value}
              </MarketplaceBadge>
            )
          })}
          {/* Fallback condition badge if no smart badges and condition applies */}
          {smartBadges.length === 0 && conditionLabel && (
            <MarketplaceBadge size="compact" variant={getConditionBadgeVariant(condition)} className="text-2xs">
              {conditionLabel}
            </MarketplaceBadge>
          )}
          {location && (
            <span className="inline-flex items-center gap-0.5">
              <MapPin size={12} />
              {location}
            </span>
          )}
          <FreshnessIndicator createdAt={createdAt} showIcon />
        </div>

        {/* Price */}
        <div className="mt-auto">
          <ProductCardPrice
            price={price}
            originalPrice={originalPrice}
            locale={locale}
            presentation="price-badge"
          />
        </div>

        {/* Badges row */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {freeShipping && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
              <Truck size={14} />
              {t("freeShipping")}
            </span>
          )}
          {showBuyerProtection && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck size={14} />
              {t("buyerProtectionInline")}
            </span>
          )}
        </div>

        {/* Seller row */}
        {sellerName && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{sellerName}</span>
            {sellerVerified && (
              <VerifiedSellerBadge
                label={t("verified")}
                className="shrink-0"
              />
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
