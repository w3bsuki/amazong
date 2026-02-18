"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Zap as Lightning } from "lucide-react";


import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDrawer } from "@/components/providers/drawer-context"
import { shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"

import { ProductCardActions } from "./actions"
import { ProductCardImage } from "./image"
import { ProductCardPrice } from "./price"
import { ProductCardSocialProof } from "./social-proof"
import {
  buildQuickViewProduct,
  getDiscountPercent,
  getOverlayBadgeVariants,
  getProductUrl,
  getRootCategoryLabel,
} from "./metadata"
import { FreshnessIndicator } from "../freshness-indicator"
import { VerifiedSellerBadge } from "../verified-seller-badge"
import { getConditionKey } from "../_lib/condition"
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
  const { openDrawer, enabledDrawers, isDrawerSystemEnabled } = useDrawer()

  const isQuickViewEnabled = isDrawerSystemEnabled && enabledDrawers.productQuickView
  const shouldUseDrawerQuickView = isQuickViewEnabled && !disableQuickView

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

  const handleCardClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!shouldUseDrawerQuickView) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      e.preventDefault()
      const quickViewData = buildQuickViewProduct({
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
      openDrawer("productQuickView", { product: quickViewData })
    },
    [
      categoryPath,
      condition,
      description,
      freeShipping,
      id,
      image,
      images,
      inStock,
      location,
      openDrawer,
      originalPrice,
      price,
      rating,
      reviews,
      sellerAvatarUrl,
      sellerId,
      sellerName,
      sellerVerified,
      shouldUseDrawerQuickView,
      slug,
      title,
      username,
    ]
  )

  return (
    <Card
      data-slot="surface"
      className={cn(
        "tap-highlight tap-transparent group relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border-border-subtle shadow-none",
        className
      )}
    >
      <Link
        href={productUrl}
        prefetch={false}
        data-slot="product-card-link"
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={t("openProduct", { title })}
        onClick={handleCardClick}
      >
        <span className="sr-only">{title}</span>
      </Link>

      <div className="relative overflow-hidden rounded-t-xl bg-surface-subtle">
        <ProductCardImage
          src={image}
          alt={title}
          index={index}
          inStock={inStock}
          outOfStockLabel={t("outOfStock")}
          ratio={1}
        />

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
                <Badge key="discount" size="compact" variant="discount">
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
              size="icon-compact"
            />
          </div>
        )}
      </div>

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
    </Card>
  )
}

