"use client"

import * as React from "react"
import { Check, Megaphone as MegaphoneSimple } from "lucide-react"

import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"

import { ProductCardPrice } from "./price"
import { ProductCardWishlistOverlay } from "./product-card-wishlist-overlay"
import { buildProductCardFrameSurface, ProductCardFrame } from "./product-card-frame"
import { useProductCardQuickViewInput } from "./use-product-card-quick-view-input"
import { getDiscountPercent, getOverlayBadgeVariants, getProductUrl } from "./metadata"
import { getConditionKey } from "../condition"
import { FreshnessIndicator } from "../freshness-indicator"
import type { MobileProductCardLayout, ProductCardBaseProps } from "./types"

interface MobileProductCardProps extends ProductCardBaseProps {
  layout?: MobileProductCardLayout
}

export function MobileProductCard({
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
  sellerId,
  sellerName,
  sellerAvatarUrl,
  sellerTier,
  sellerVerified,
  slug,
  username,
  showWishlist = true,
  showWishlistAction,
  showPromotedBadge = true,
  disableQuickView = false,
  index = 0,
  currentUserId,
  inStock = true,
  className,
  rating,
  reviews,
  condition,
  location,
  titleLines = 1,
  isBoosted,
  boostExpiresAt,
}: MobileProductCardProps) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const allowWishlistAction = showWishlistAction ?? showWishlist

  const productUrl = getProductUrl(username, slug, id)
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const safeSellerName = React.useMemo(() => {
    const normalized = sellerName?.trim()
    if (normalized) return normalized

    const fromUsername = username?.trim()
    if (fromUsername) return fromUsername

    return t("seller")
  }, [sellerName, t, username])

  const discountPercent = React.useMemo(
    () => getDiscountPercent(price, originalPrice, salePercent),
    [originalPrice, price, salePercent]
  )

  const overlayBadgeVariants = React.useMemo(
    () => getOverlayBadgeVariants({ isBoosted, boostExpiresAt, discountPercent }),
    [boostExpiresAt, discountPercent, isBoosted]
  )

  const isVerifiedBusinessSeller = sellerTier === "business" && Boolean(sellerVerified)
  const mediaRatio = 3 / 4
  const pricePresentation = "default"
  const surfaceClassName = cn(className, "border-0 bg-transparent shadow-none")

  const showDiscountBadge = inStock && discountPercent >= 5

  const conditionLabel = React.useMemo(() => {
    if (!condition) return null
    const key = getConditionKey(condition)
    return key ? t(key) : condition
  }, [condition, t])

  const showPromotedOverlay =
    inStock &&
    !showDiscountBadge &&
    !conditionLabel &&
    showPromotedBadge &&
    overlayBadgeVariants.includes("promoted")

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
    rating,
    reviews,
    inStock,
    slug,
    username,
    sellerId,
    sellerName,
    sellerAvatarUrl,
    sellerVerified,
  })

  return (
    <ProductCardFrame
      disableQuickView={disableQuickView}
      quickViewInput={quickViewInput}
      surface={buildProductCardFrameSurface(productUrl, title, surfaceClassName, image, index, inStock, mediaRatio)}
      mediaOverlay={
        <>
          {showDiscountBadge ? (
            <div className="pointer-events-none absolute left-2 top-2 z-10">
              <Badge size="compact" variant="destructive" data-testid="product-card-discount-badge">
                -{discountPercent}%
              </Badge>
            </div>
          ) : showPromotedOverlay ? (
            <div className="pointer-events-none absolute left-2 top-2 z-10">
              <Badge size="compact" variant="glass" data-testid="product-card-ad-badge">
                <MegaphoneSimple className="size-2.5" aria-hidden="true" />
                <span className="sr-only">{t("adBadge")}</span>
              </Badge>
            </div>
          ) : null}

          {allowWishlistAction && (
            <ProductCardWishlistOverlay
              id={id}
              title={title}
              price={price}
              image={image}
              slug={slug}
              username={username}
              inStock={inStock}
              isOwnProduct={isOwnProduct}
              overlayDensity="compact"
            />
          )}
          {!showDiscountBadge && conditionLabel ? (
            <div className="pointer-events-none absolute bottom-2 left-2 z-10">
              <Badge size="compact" variant="glass" data-testid="product-card-condition-badge">
                {conditionLabel}
              </Badge>
            </div>
          ) : null}
        </>
      }
    >
      <CardContent className="flex flex-col gap-0.5 p-0 pt-1.5">
        {/* Price first — design: price → title → seller */}
        <div className="flex min-w-0 items-center gap-1.5" data-testid="product-card-price-row">
          <div className="min-w-0 shrink-0">
            <ProductCardPrice
              price={price}
              originalPrice={originalPrice}
              locale={locale}
              compact
              presentation={pricePresentation}
              showOriginalPrice={Boolean(originalPrice && originalPrice > price)}
              forceSymbolPrefix
            />
          </div>
        </div>

        <h3
          className={cn(
            "min-w-0 text-xs leading-snug text-muted-foreground",
            titleLines === 1 ? "truncate" : "line-clamp-2 break-words"
          )}
        >
          {title}
        </h3>

        <div className="flex min-w-0 items-center gap-1.5 text-2xs text-muted-foreground" data-testid="product-card-seller-row">
          <span className="min-w-0 truncate">{safeSellerName}</span>
          {isVerifiedBusinessSeller && (
            <span
              className="inline-flex size-3 shrink-0 items-center justify-center rounded-full text-success"
              role="img"
              aria-label={t("b2b.verifiedShort")}
            >
              <Check className="size-3" aria-hidden="true" />
            </span>
          )}
          {createdAt ? (
            <>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <FreshnessIndicator
                createdAt={createdAt}
                variant="text"
                showIcon={false}
                className="text-2xs text-muted-foreground"
              />
            </>
          ) : null}
        </div>
      </CardContent>
    </ProductCardFrame>
  )
}
