"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useDrawer, type QuickViewProduct } from "@/components/providers/drawer-context"
import { isBoostActiveNow } from "@/lib/boost/boost-status"
import { getListingOverlayBadgeVariants } from "@/lib/ui/badge-intent"

import { ProductCardActions } from "./product-card-actions"
import { ProductCardImage } from "./product-card-image"
import { ProductCardPrice } from "./product-card-price"
import { FreshnessIndicator } from "./freshness-indicator"
import type { MobileProductCardLayout, ProductCardBaseProps } from "./product-card.types"

export interface MobileProductCardProps extends ProductCardBaseProps {
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
  const { openProductQuickView, enabledDrawers, isDrawerSystemEnabled } = useDrawer()

  const isQuickViewEnabled = isDrawerSystemEnabled && enabledDrawers.productQuickView
  const shouldUseDrawerQuickView = isQuickViewEnabled && !disableQuickView

  const productUrl = username ? `/${username}/${slug || id}` : "#"
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const hasDiscount = Boolean(originalPrice && originalPrice > price)
  const discountPercent = hasDiscount
    ? Math.round((((originalPrice ?? 0) - price) / (originalPrice ?? 1)) * 100)
    : (salePercent ?? 0)

  const sellerNameLabel = React.useMemo(() => {
    const normalized = sellerName?.trim()
    return normalized && normalized.length > 0 ? normalized : null
  }, [sellerName])

  const isBoostedActive = React.useMemo(() => {
    if (!isBoosted) return false
    if (!boostExpiresAt) return true
    return isBoostActiveNow({ is_boosted: true, boost_expires_at: boostExpiresAt })
  }, [boostExpiresAt, isBoosted])

  const overlayBadgeVariants = React.useMemo(
    () =>
      getListingOverlayBadgeVariants({
        isPromoted: isBoostedActive,
        discountPercent,
        minDiscountPercent: 5,
      }),
    [discountPercent, isBoostedActive]
  )

  const visibleOverlayBadgeVariants = overlayBadgeVariants.filter((variant) => variant === "promoted")

  const isVerifiedBusinessSeller = sellerTier === "business" && Boolean(sellerVerified)
  const mediaRatio = layout === "rail" ? 1 : 4 / 3
  const pricePresentation = "price-badge"

  const handleCardClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!shouldUseDrawerQuickView) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      e.preventDefault()
      const quickViewData: QuickViewProduct = {
        id,
        title,
        price,
        image,
        ...(typeof window !== "undefined" ? { sourceScrollY: window.scrollY } : {}),
        ...(images ? { images } : {}),
        ...(originalPrice != null ? { originalPrice } : {}),
        ...(description != null ? { description } : {}),
        ...(categoryPath ? { categoryPath } : {}),
        ...(condition != null ? { condition } : {}),
        ...(location != null ? { location } : {}),
        ...(rating !== undefined ? { rating } : {}),
        ...(reviews !== undefined ? { reviews } : {}),
        ...(inStock !== undefined ? { inStock } : {}),
        ...(slug != null ? { slug } : {}),
        ...(username != null ? { username } : {}),
        ...(sellerId != null ? { sellerId } : {}),
        ...(sellerName != null ? { sellerName } : {}),
        ...(sellerAvatarUrl != null ? { sellerAvatarUrl } : {}),
        ...(sellerVerified !== undefined ? { sellerVerified } : {}),
      }
      openProductQuickView(quickViewData)
    },
    [
      categoryPath,
      condition,
      description,
      id,
      image,
      images,
      inStock,
      location,
      openProductQuickView,
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
        "tap-highlight tap-transparent group relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border-border/40 shadow-none",
        className
      )}
    >
      <Link
        href={productUrl}
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

        {inStock && visibleOverlayBadgeVariants.length > 0 && (
          <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
            <Badge key="promoted" size="compact" variant="promoted" data-testid="product-card-ad-badge">
              {t("adBadge")}
            </Badge>
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
              overlayDensity="compact"
            />
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-1 p-2 pt-2">
        {(sellerNameLabel || createdAt) && (
          <div className="flex min-w-0 items-center gap-1.5 text-2xs text-muted-foreground" data-testid="product-card-seller-row">
            {sellerNameLabel && (
              <>
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
                      aria-label={t("b2b.verifiedShort")}
                    >
                      <Check className="size-2" aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="truncate text-xs font-medium text-foreground">{sellerNameLabel}</span>
              </>
            )}
            {createdAt && (
              <FreshnessIndicator
                createdAt={createdAt}
                variant="text"
                showIcon={false}
                className="ml-auto shrink-0 text-2xs text-muted-foreground"
              />
            )}
          </div>
        )}

        <h3
          className={cn(
            "min-w-0 text-compact font-medium leading-tight tracking-tight text-foreground",
            titleLines === 1 ? "truncate" : "line-clamp-2 break-words"
          )}
        >
          {title}
        </h3>

        <div className="min-w-0">
          <ProductCardPrice
            price={price}
            originalPrice={originalPrice}
            locale={locale}
            compact
            homeEmphasis
            priceEmphasis="strong"
            presentation={pricePresentation}
            showOriginalPrice={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export type { MobileProductCardLayout } from "./product-card.types"
