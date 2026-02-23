"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Zap as Lightning } from "lucide-react";


import { cn } from "@/lib/utils"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { CardContent } from "@/components/ui/card"
import { shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"

import { ProductCardPrice } from "./price"
import { ProductCardSocialProof } from "./social-proof"
import { ProductCardWishlistOverlay } from "./product-card-wishlist-overlay"
import { buildProductCardFrameSurface, ProductCardFrame } from "./product-card-frame"
import { useProductCardQuickViewInput } from "./use-product-card-quick-view-input"
import {
  getDiscountPercent,
  getOverlayBadgeVariants,
  getProductUrl,
  getRootCategoryLabel,
} from "./metadata"
import { FreshnessIndicator } from "../freshness-indicator"
import { VerifiedSellerBadge } from "../verified-seller-badge"
import { getConditionKey } from "../condition"
import type { ProductCardBaseProps } from "./types"

type DesktopProductCardProps = ProductCardBaseProps

export function DesktopProductCard({
  id,
  title,
  price,
  image,
  images,
  description,
  originalPrice,
  salePercent,
  createdAt,
  categoryPath,
  categoryRootSlug,
  sellerId,
  sellerName,
  sellerAvatarUrl,
  sellerTier,
  sellerVerified,
  freeShipping = false,
  slug,
  username,
  showWishlist = true,
  disableQuickView = false,
  index = 0,
  currentUserId,
  inStock = true,
  className,
  rating,
  reviews,
  soldCount,
  condition,
  location,
  titleLines = 1,
  isBoosted,
  boostExpiresAt,
}: DesktopProductCardProps) {
  const t = useTranslations("Product")
  const locale = useLocale()

  const productUrl = getProductUrl(username, slug, id)
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const discountPercent = getDiscountPercent(price, originalPrice, salePercent)

  const hasRating = typeof rating === "number" && rating > 0
  const hasSoldCount = typeof soldCount === "number" && soldCount > 0
  const hasSocialProof = hasRating || hasSoldCount

  const resolvedRootSlug = categoryRootSlug ?? categoryPath?.[0]?.slug ?? null
  const shouldShowCondition =
    condition != null &&
    (resolvedRootSlug
      ? shouldShowConditionBadge(null, resolvedRootSlug)
      : true)

  const conditionLabel = React.useMemo(() => {
    if (!condition || !shouldShowCondition) return null
    const key = getConditionKey(condition)
    if (key) return t(key)
    return condition
  }, [condition, shouldShowCondition, t])

  const rootCategoryLabel = React.useMemo(() => {
    return getRootCategoryLabel(categoryPath, locale)
  }, [categoryPath, locale])

  const locationLabel = React.useMemo(() => location?.trim() || null, [location])
  const hasFreshness = Boolean(createdAt)

  const overlayBadgeVariants = React.useMemo(
    () => getOverlayBadgeVariants({ isBoosted, boostExpiresAt, discountPercent }),
    [boostExpiresAt, discountPercent, isBoosted]
  )

  const hasTrustSignals = Boolean(freeShipping || sellerVerified)
  const hasInfoMeta = Boolean(conditionLabel || locationLabel || hasTrustSignals)

  const quickViewInput = useProductCardQuickViewInput({
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
    includeFreeShipping: true,
  })

  return (
    <ProductCardFrame
      disableQuickView={disableQuickView}
      quickViewInput={quickViewInput}
      surface={buildProductCardFrameSurface(productUrl, title, className, image, index, inStock, 1)}
      mediaOverlay={
        <>
          {inStock && overlayBadgeVariants.length > 0 && (
            <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
              {overlayBadgeVariants.map((variant) => {
                if (variant === "promoted") {
                  return (
                    <span
                      key="promoted"
                      className="flex size-6 items-center justify-center rounded-full bg-promoted text-promoted-foreground"
                      role="img"
                      aria-label={t("adBadge")}
                    >
                      <Lightning size={14} />
                    </span>
                  )
                }

                return (
                  <MarketplaceBadge key="discount" size="compact" variant="discount">
                    -{discountPercent}%
                  </MarketplaceBadge>
                )
              })}
            </div>
          )}

          {showWishlist && (
            <ProductCardWishlistOverlay
              id={id}
              title={title}
              price={price}
              image={image}
              slug={slug}
              username={username}
              inStock={inStock}
              isOwnProduct={isOwnProduct}
            />
          )}
        </>
      }
    >
      <CardContent className="space-y-1.5 p-2.5 pt-2.5">
        <h3
          className={cn(
            "min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground",
            titleLines === 1 ? "truncate" : "line-clamp-2 break-words"
          )}
        >
          {title}
        </h3>

        {rootCategoryLabel && (
          <span data-slot="category" className="block min-w-0 truncate text-2xs font-medium text-muted-foreground">
            {rootCategoryLabel}
          </span>
        )}

        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          priceEmphasis="strong"
          presentation="price-badge"
          showOriginalPrice
        />

        {(hasSocialProof || hasFreshness) && (
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-tiny text-muted-foreground">
            {hasSocialProof && (
              <ProductCardSocialProof
                rating={hasRating ? rating : undefined}
                reviews={hasRating ? reviews : undefined}
                soldCount={soldCount}
                soldLabel={t("sold")}
              />
            )}
            {hasSocialProof && hasFreshness && <span aria-hidden="true">.</span>}
            {hasFreshness && (
              <FreshnessIndicator
                createdAt={createdAt}
                variant="text"
                showIcon={false}
                className="text-tiny text-muted-foreground"
              />
            )}
          </div>
        )}

        {hasInfoMeta && (
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-tiny text-muted-foreground">
            {conditionLabel && <span className="shrink-0 font-medium">{conditionLabel}</span>}
            {conditionLabel && locationLabel && <span aria-hidden="true" className="text-border">.</span>}
            {locationLabel && <span className="min-w-0 truncate">{locationLabel}</span>}
            {(conditionLabel || locationLabel) && hasTrustSignals && (
              <span aria-hidden="true" className="text-border">.</span>
            )}
            {freeShipping && (
              <span className="shrink-0 font-medium text-success">{t("freeDeliveryShort")}</span>
            )}
            {freeShipping && sellerVerified && <span aria-hidden="true" className="text-border">.</span>}
            {sellerVerified && sellerTier === "business" && (
              <VerifiedSellerBadge label={t("b2b.verifiedShort")} className="shrink-0" />
            )}
          </div>
        )}
      </CardContent>
    </ProductCardFrame>
  )
}
