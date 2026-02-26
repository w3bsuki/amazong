"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Check, Megaphone as MegaphoneSimple } from "lucide-react"

import { cn, safeAvatarSrc } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { shouldShowConditionBadge } from "@/lib/badges/category-badge-specs"

import { ProductCardPrice } from "./price"
import { ProductCardWishlistOverlay } from "./product-card-wishlist-overlay"
import { buildProductCardFrameSurface, ProductCardFrame } from "./product-card-frame"
import { useProductCardQuickViewInput } from "./use-product-card-quick-view-input"
import {
  getDiscountPercent,
  getOverlayBadgeVariants,
  getProductUrl,
} from "./metadata"
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
}: DesktopProductCardProps) {
  const t = useTranslations("Product")
  const locale = useLocale()

  const productUrl = getProductUrl(username, slug, id)
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const discountPercent = React.useMemo(
    () => getDiscountPercent(price, originalPrice, salePercent),
    [originalPrice, price, salePercent]
  )

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

  const overlayBadgeVariants = React.useMemo(
    () => getOverlayBadgeVariants({ isBoosted, boostExpiresAt, discountPercent }),
    [boostExpiresAt, discountPercent, isBoosted]
  )

  const showDiscountBadge = inStock && discountPercent >= 5
  const showConditionBadge = inStock && !showDiscountBadge && Boolean(conditionLabel)
  const showPromotedOverlay =
    inStock &&
    !showDiscountBadge &&
    !showConditionBadge &&
    showPromotedBadge &&
    overlayBadgeVariants.includes("promoted")

  const safeSellerName = React.useMemo(() => {
    const normalized = sellerName?.trim()
    if (normalized) return normalized

    const fromUsername = username?.trim()
    if (fromUsername) return fromUsername

    return t("seller")
  }, [sellerName, t, username])

  const avatarSrc = React.useMemo(() => safeAvatarSrc(sellerAvatarUrl), [sellerAvatarUrl])
  const isVerifiedBusinessSeller = sellerTier === "business" && Boolean(sellerVerified)

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

  const surfaceClassName = cn(className, "border-0 bg-transparent shadow-none")

  return (
    <ProductCardFrame
      disableQuickView={disableQuickView}
      quickViewInput={quickViewInput}
      surface={buildProductCardFrameSurface(productUrl, title, surfaceClassName, image, index, inStock, 3 / 4)}
      mediaOverlay={
        <>
          {showDiscountBadge ? (
            <div className="pointer-events-none absolute left-2 top-2 z-10">
              <Badge size="compact" variant="destructive" data-testid="product-card-discount-badge">
                -{discountPercent}%
              </Badge>
            </div>
          ) : showConditionBadge ? (
            <div className="pointer-events-none absolute bottom-2 left-2 z-10">
              <Badge size="compact" variant="glass" data-testid="product-card-condition-badge">
                {conditionLabel}
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
      <CardContent className="flex flex-col gap-0.5 p-0 pt-1.5">
        <div className="flex min-w-0 items-center gap-1.5" data-testid="product-card-price-row">
          <div className="min-w-0 shrink-0">
            <ProductCardPrice
              price={price}
              originalPrice={originalPrice}
              locale={locale}
              presentation="default"
              showOriginalPrice={Boolean(originalPrice && originalPrice > price)}
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
          <Avatar className="size-4">
            {avatarSrc ? <AvatarImage src={avatarSrc} alt={safeSellerName} /> : null}
            <AvatarFallback className="text-2xs font-semibold text-foreground">
              {(safeSellerName.trim()[0] ?? "?").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 truncate">{safeSellerName}</span>
          {isVerifiedBusinessSeller ? (
            <span
              className="inline-flex size-3 shrink-0 items-center justify-center rounded-full text-success"
              role="img"
              aria-label={t("b2b.verifiedShort")}
            >
              <Check className="size-3" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      </CardContent>
    </ProductCardFrame>
  )
}
