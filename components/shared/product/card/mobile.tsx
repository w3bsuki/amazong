"use client"

import * as React from "react"
import { Check, Megaphone as MegaphoneSimple } from "lucide-react";


import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"

import { ProductCardPrice } from "./price"
import { ProductCardWishlistOverlay } from "./product-card-wishlist-overlay"
import { buildProductCardFrameSurface, ProductCardFrame } from "./product-card-frame"
import { useProductCardQuickViewInput } from "./use-product-card-quick-view-input"
import {
  getOverlayBadgeVariants,
  getProductUrl,
} from "./metadata"
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
  createdAt,
  categoryPath,
  sellerId,
  sellerName,
  sellerAvatarUrl,
  sellerTier,
  sellerVerified,
  slug,
  username,
  layout = "feed",
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

  const sellerNameLabel = React.useMemo(() => {
    const normalized = sellerName?.trim()
    return normalized && normalized.length > 0 ? normalized : null
  }, [sellerName])

  const overlayBadgeVariants = React.useMemo(
    () => getOverlayBadgeVariants({ isBoosted, boostExpiresAt, discountPercent: 0 }),
    [boostExpiresAt, isBoosted]
  )

  const isVerifiedBusinessSeller = sellerTier === "business" && Boolean(sellerVerified)
  const mediaRatio = layout === "rail" ? 3 / 4 : 4 / 3
  const pricePresentation = "default"
  const surfaceClassName = cn(className, "border-0 bg-transparent shadow-none")

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
          {inStock && overlayBadgeVariants.length > 0 && (
            <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
              {overlayBadgeVariants.map((variant) => {
                if (variant === "promoted") {
                  if (!showPromotedBadge) return null

                  return (
                    <Badge
                      key={variant}
                      size="compact"
                      variant="glass"
                      data-testid="product-card-ad-badge"
                      className="px-1.5 py-0.5 text-2xs font-semibold rounded"
                    >
                      <MegaphoneSimple size={10} aria-hidden="true" />
                      <span className="sr-only">{t("adBadge")}</span>
                    </Badge>
                  )
                }

                // Mobile card surface stays clean — avoid percent discount badges (tested by e2e smoke).
                return null
              })}
            </div>
          )}

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
          {condition && (
            <div className="pointer-events-none absolute bottom-2 left-2 z-10">
              <span className="bg-card/90 backdrop-blur-sm text-2xs font-medium text-foreground px-1.5 py-0.5 rounded">
                {condition}
              </span>
            </div>
          )}
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

        {sellerNameLabel && (
          <div
            className="flex min-w-0 items-center gap-1 text-2xs text-muted-foreground mt-0.5"
            data-testid="product-card-seller-row"
          >
            <span className="min-w-0 truncate">{sellerNameLabel}</span>
            {isVerifiedBusinessSeller && (
              <span
                className="inline-flex size-3 shrink-0 items-center justify-center rounded-full text-success"
                role="img"
                aria-label={t("b2b.verifiedShort")}
              >
                <Check className="size-3" aria-hidden="true" />
              </span>
            )}
            {createdAt && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <FreshnessIndicator
                  createdAt={createdAt}
                  variant="text"
                  showIcon={false}
                  className="min-w-0 shrink-0 text-2xs text-muted-foreground"
                />
              </>
            )}
          </div>
        )}
      </CardContent>
    </ProductCardFrame>
  )
}
