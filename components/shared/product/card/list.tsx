import { useLocale, useTranslations } from "next-intl"

import { getConditionKey } from "@/components/shared/product/condition"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { computeBadgeSpecsClient, shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"
import { getCategoryName } from "@/lib/data/categories/display"
import { getListingOverlayBadgeVariants } from "@/lib/ui/badge-intent"

import { ProductCardListContentSection } from "./list-content-section"
import { ProductCardListMediaSection } from "./list-media-section"
import type { ProductCardListBadge, ProductCardListProps } from "./list.types"

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
  const smartBadges: ProductCardListBadge[] = computeBadgeSpecsClient({
    categorySlug: categorySlug || null,
    rootCategorySlug: rootCategorySlug || null,
    condition: condition || null,
    attributes,
  })

  const formatBadgeValue = (badge: ProductCardListBadge): string => {
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

      <ProductCardListMediaSection
        id={id}
        title={title}
        price={price}
        image={image}
        slug={slug}
        username={username}
        inStock={inStock}
        showWishlist={showWishlist}
        isOwnProduct={isOwnProduct}
        overlayBadgeVariants={overlayBadgeVariants}
        discountPercent={discountPercent}
        adBadgeLabel={t("adBadge")}
        outOfStockLabel={t("outOfStock")}
      />

      <ProductCardListContentSection
        title={title}
        rootCategoryLabel={rootCategoryLabel}
        description={description}
        smartBadges={smartBadges}
        conditionLabel={conditionLabel}
        condition={condition}
        location={location}
        createdAt={createdAt}
        price={price}
        originalPrice={originalPrice}
        locale={locale}
        freeShipping={freeShipping}
        showBuyerProtection={showBuyerProtection}
        sellerName={sellerName}
        sellerVerified={sellerVerified}
        freeShippingLabel={t("freeShipping")}
        buyerProtectionLabel={t("buyerProtectionInline")}
        verifiedLabel={t("verified")}
        formatBadgeValue={formatBadgeValue}
        getBadgeLabel={getBadgeLabel}
      />
    </Card>
  )
}
