"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { getConditionBadgeVariant } from "@/components/shared/product/_lib/condition-badges"
import { computeBadgeSpecsClient, shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"
import { ProductCardActions } from "./product-card-actions"
import { FreshnessIndicator } from "./freshness-indicator"
import { Truck, MapPin, ShieldCheck } from "@phosphor-icons/react"
import Image from "next/image"
import { normalizeImageUrl } from "@/lib/normalize-image-url"
import { Badge } from "@/components/ui/badge"

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
  isOnSale?: boolean
  salePercent?: number

  // Seller
  sellerId?: string | null
  sellerName?: string | undefined
  sellerAvatarUrl?: string | null
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
}: ProductCardListProps) {
  const t = useTranslations("Product")
  const locale = useLocale()

  // URLs
  const productUrl = username ? `/${username}/${slug || id}` : "#"

  // Check if own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Category-aware smart badges
  const smartBadges = React.useMemo(() => {
    return computeBadgeSpecsClient({
      categorySlug: categorySlug || null,
      rootCategorySlug: rootCategorySlug || null,
      condition: condition || null,
      attributes,
    })
  }, [categorySlug, rootCategorySlug, condition, attributes])

  const getConditionKey = (value: string): string | null => {
    const normalized = value.toLowerCase().replace(/[\s_-]/g, "")
    switch (normalized) {
      case "new":
      case "novo":
      case "ново":
        return "condition.new"
      case "newwithtags":
        return "condition.newWithTags"
      case "newwithouttags":
        return "condition.newWithoutTags"
      case "likenew":
      case "usedlikenew":
      case "катоново":
        return "condition.likeNew"
      case "usedexcellent":
        return "condition.usedExcellent"
      case "usedgood":
        return "condition.usedGood"
      case "usedfair":
        return "condition.usedFair"
      case "refurbished":
      case "refurb":
      case "рефърбиш":
        return "condition.refurbished"
      case "used":
      case "употребявано":
        return "condition.used"
      case "good":
        return "condition.good"
      case "fair":
        return "condition.fair"
      default:
        return null
    }
  }

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
  const conditionLabel = React.useMemo(() => {
    // If smart badges already include condition, don't duplicate
    if (smartBadges.some(b => b.key === "condition")) return null
    // If this category shouldn't show condition, skip
    if (!shouldShowConditionBadge(categorySlug || null, rootCategorySlug || null)) return null
    if (!condition) return null
    const key = getConditionKey(condition)
    if (key) return t(key)
    return condition.slice(0, 8)
  }, [condition, t, smartBadges, categorySlug, rootCategorySlug])

  // Format price
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price)

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }).format(originalPrice)
    : null

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0
  const showDiscountBadge = hasDiscount && discountPercent >= 1

  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-hover active:bg-active",
        className
      )}
    >
      {/* Full-card link for accessibility */}
      <Link
        href={productUrl}
        scroll={false}
        className="absolute inset-0 z-0"
        aria-label={t("openProduct", { title })}
      >
        <span className="sr-only">{title}</span>
      </Link>

      {/* Image - Left side */}
      <div className="relative shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-muted">
        <Image
          src={normalizeImageUrl(image)}
          alt={title}
          fill
          sizes="(max-width: 640px) 128px, 160px"
          className="object-cover"
        />

        {/* Status badges (Promo / Discount) */}
        {(isBoosted || showDiscountBadge) && (
          <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
            {isBoosted && (
              <Badge variant="promoted">{t("adBadge")}</Badge>
            )}
            {showDiscountBadge && (
              <Badge variant="discount">
                -{discountPercent}%
              </Badge>
            )}
          </div>
        )}

        {/* Wishlist button overlay */}
        <div className="absolute top-1.5 right-1.5 z-10">
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

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-glass">
            <span className="text-xs font-medium text-muted-foreground">{t("outOfStock")}</span>
          </div>
        )}
      </div>

      {/* Content - Right side */}
      <div className="relative z-1 flex-1 min-w-0 flex flex-col">
        {/* Title */}
        <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-foreground mb-1">
          {title}
        </h3>

        {/* Description (if available) */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {description}
          </p>
        )}

        {/* Meta row: smart badges, location, freshness */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
          {/* Category-aware smart badges (mileage for cars, condition for clothing, etc.) */}
          {smartBadges.map((badge) => (
            <Badge 
              key={badge.key} 
              variant={badge.key === "condition" ? getConditionBadgeVariant(badge.value) : "condition"}
              className="text-2xs"
              title={`${getBadgeLabel(badge.key)}: ${formatBadgeValue(badge)}`}
            >
              {formatBadgeValue(badge)}
            </Badge>
          ))}
          {/* Fallback condition badge if no smart badges and condition applies */}
          {smartBadges.length === 0 && conditionLabel && (
            <Badge variant={getConditionBadgeVariant(condition)} className="text-2xs">
              {conditionLabel}
            </Badge>
          )}
          {location && (
            <span className="inline-flex items-center gap-0.5">
              <MapPin size={12} />
              {location}
            </span>
          )}
          <FreshnessIndicator createdAt={createdAt} showIcon />
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-foreground">{formattedPrice}</span>
          {hasDiscount && formattedOriginalPrice && (
            <span className="text-sm text-muted-foreground line-through">{formattedOriginalPrice}</span>
          )}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {freeShipping && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Truck size={14} weight="bold" />
              {t("freeShipping")}
            </span>
          )}
          {showBuyerProtection && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck size={14} weight="fill" />
              {t("buyerProtectionInline")}
            </span>
          )}
        </div>

        {/* Seller row */}
        {sellerName && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <span>{sellerName}</span>
            {sellerVerified && (
              <span className="text-muted-foreground">✓</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
