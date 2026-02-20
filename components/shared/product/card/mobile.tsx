"use client"

import * as React from "react"
import { Check, Megaphone as MegaphoneSimple } from "lucide-react";


import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"

import { ProductCardActions } from "./actions"
import { ProductCardImage } from "./image"
import { ProductCardPrice } from "./price"
import { useProductCardQuickView } from "./use-product-card-quick-view"
import {
  getDiscountPercent,
  getOverlayBadgeVariants,
  getProductUrl,
  getRootCategoryLabel,
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
  layout = "feed",
}: MobileProductCardProps) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const allowWishlistAction = showWishlistAction ?? showWishlist

  const productUrl = getProductUrl(username, slug, id)
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const discountPercent = getDiscountPercent(price, originalPrice, salePercent)

  const sellerNameLabel = React.useMemo(() => {
    const normalized = sellerName?.trim()
    return normalized && normalized.length > 0 ? normalized : null
  }, [sellerName])

  const rootCategoryLabel = React.useMemo(() => {
    return getRootCategoryLabel(categoryPath, locale)
  }, [categoryPath, locale])

  const overlayBadgeVariants = React.useMemo(
    () => getOverlayBadgeVariants({ isBoosted, boostExpiresAt, discountPercent }),
    [boostExpiresAt, discountPercent, isBoosted]
  )

  const visibleOverlayBadgeVariants = overlayBadgeVariants.filter((variant) => variant === "promoted")

  const isVerifiedBusinessSeller = sellerTier === "business" && Boolean(sellerVerified)
  const mediaRatio = layout === "rail" ? 1 : 4 / 3
  const pricePresentation = "price-badge"

  const quickViewInput = React.useMemo(
    () => ({
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
    }),
    [
      categoryPath,
      condition,
      description,
      id,
      image,
      images,
      inStock,
      location,
      originalPrice,
      price,
      rating,
      reviews,
      sellerAvatarUrl,
      sellerId,
      sellerName,
      sellerVerified,
      slug,
      title,
      username,
    ]
  )

  const handleCardClick = useProductCardQuickView({
    disableQuickView,
    product: quickViewInput,
  })

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
          ratio={mediaRatio}
        />

        {showPromotedBadge && inStock && visibleOverlayBadgeVariants.length > 0 && (
          <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
            <Badge
              key="promoted"
              size="compact"
              variant="glass"
              data-testid="product-card-ad-badge"
              className="px-1.5"
            >
              <MegaphoneSimple size={10} aria-hidden="true" />
              <span className="sr-only">{t("adBadge")}</span>
            </Badge>
          </div>
        )}

        {allowWishlistAction && (
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
              overlayDensity="compact"
            />
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-1 p-2 pt-2">
        {rootCategoryLabel && (
          <MarketplaceBadge
            data-slot="category"
            size="compact"
            variant="category"
            className="max-w-full justify-start overflow-hidden px-1.5 text-2xs"
          >
            <span className="truncate">{rootCategoryLabel}</span>
          </MarketplaceBadge>
        )}

        {sellerNameLabel && (
          <div
            className="flex min-w-0 items-center gap-1.5 text-2xs text-muted-foreground"
            data-testid="product-card-seller-row"
          >
            <span className="relative shrink-0">
              <UserAvatar
                name={sellerNameLabel}
                avatarUrl={sellerAvatarUrl ?? null}
                size="sm"
                className="size-5 border border-border-subtle"
                fallbackClassName="text-2xs font-semibold"
              />
              {isVerifiedBusinessSeller && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 inline-flex size-3 items-center justify-center rounded-full border border-background bg-verified-business text-verified-business-foreground"
                  role="img"
                  aria-label={t("b2b.verifiedShort")}
                >
                  <Check className="size-2" aria-hidden="true" />
                </span>
              )}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{sellerNameLabel}</span>
          </div>
        )}

        <h3
          className={cn(
            "min-w-0 text-compact font-semibold leading-tight tracking-tight text-foreground",
            titleLines === 1 ? "truncate" : "line-clamp-2 break-words"
          )}
        >
          {title}
        </h3>

        <div className="flex min-w-0 items-center gap-1.5" data-testid="product-card-price-row">
          <div className="min-w-0 shrink-0">
            <ProductCardPrice
              price={price}
              originalPrice={originalPrice}
              locale={locale}
              compact
              homeEmphasis
              priceEmphasis="strong"
              presentation={pricePresentation}
              showOriginalPrice={false}
              forceSymbolPrefix
            />
          </div>
          {createdAt && (
            <FreshnessIndicator
              createdAt={createdAt}
              variant="text"
              showIcon={false}
              className="ml-auto min-w-0 shrink-0 text-2xs text-muted-foreground"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

