"use client"

import { RefreshCw as ArrowsClockwise, SquareArrowOutUpRight as ArrowSquareOut, Heart, Link as LinkSimple, MapPin, ShieldCheck, Truck, X } from "lucide-react";


import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { getConditionBadgeVariant } from "@/components/shared/product/_lib/condition-badges"
import { cn } from "@/lib/utils"

import type { ProductQuickViewViewProps } from "./product-quick-view-content"
import { QuickViewImageGallery } from "./quick-view-image-gallery"
import { QuickViewSellerCard } from "./quick-view-seller-card"

export function ProductQuickViewMobileContent({
  product,
  onRequestClose,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
  titleText,
  descriptionPreview,
  allImages,
  showDiscount,
  discountPercent,
  formattedPrice,
  formattedOriginalPrice,
  conditionLabel,
  inWishlist,
  wishlistPending,
  shareEnabled,
  showSellerSkeleton,
  showLocationSkeleton,
  showConditionSkeleton,
  onCopyLink,
  onToggleWishlist,
}: ProductQuickViewViewProps) {
  const tDrawers = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const tModal = useTranslations("ProductModal")

  const {
    freeShipping,
    location,
    condition,
    inStock = true,
    sellerName,
    sellerAvatarUrl,
    sellerVerified,
    rating,
    reviews,
  } = product

  return (
    <div className="flex min-h-full flex-col bg-surface-elevated">
      <div className="sticky top-0 z-20 border-b border-border bg-surface-elevated px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-tight text-muted-foreground">
            {tDrawers("quickView")}
          </p>

          <div className="flex items-center gap-1.5">
            <IconButton
              type="button"
              variant="ghost"
              size="icon-default"
              onClick={onCopyLink}
              aria-label={tModal("copyLink")}
              disabled={!shareEnabled}
              className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
            >
              <LinkSimple size={18} />
            </IconButton>
            <IconButton
              type="button"
              variant="ghost"
              size="icon-default"
              onClick={onToggleWishlist}
              aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
              disabled={wishlistPending}
              className={cn(
                "border border-border-subtle bg-background",
                inWishlist
                  ? "text-primary hover:bg-hover active:bg-active"
                  : "text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
              )}
            >
              <Heart
                size={18}
                className={cn(inWishlist && "fill-primary text-primary")}
              />
            </IconButton>
            <IconButton
              type="button"
              variant="ghost"
              size="icon-default"
              className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
              onClick={() => onRequestClose?.()}
              aria-label={tDrawers("close")}
            >
              <X className="size-4.5" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-3 px-4 py-3">
          <QuickViewImageGallery
            images={allImages}
            title={titleText}
            discountPercent={showDiscount ? discountPercent : undefined}
            onNavigateToProduct={onNavigateToProduct}
            compact
            compactRatio={4 / 3}
          />

          <div className="space-y-2.5 rounded-xl border border-border-subtle bg-card p-3">
            <div className="space-y-1.5">
              <h2 className="line-clamp-2 text-base font-semibold tracking-tight leading-tight text-foreground">
                {titleText}
              </h2>
              {descriptionPreview ? (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {descriptionPreview}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums tracking-tight text-price">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm tabular-nums text-muted-foreground line-through">
                  {formattedOriginalPrice}
                </span>
              )}
              {showDiscount && discountPercent > 0 && (
                <Badge variant="destructive" size="compact" className="tabular-nums">
                  -{discountPercent}%
                </Badge>
              )}
              {!inStock && (
                <Badge
                  variant="outline"
                  className="ml-auto border-destructive bg-destructive-subtle text-destructive"
                >
                  {tProduct("outOfStock")}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={freeShipping ? "shipping-free" : "shipping"} size="compact">
                <Truck />
                {freeShipping ? tProduct("freeShipping") : tProduct("shippingAvailable")}
              </Badge>

              {conditionLabel ? (
                <Badge size="compact" variant={getConditionBadgeVariant(condition)}>
                  {conditionLabel}
                </Badge>
              ) : showConditionSkeleton ? (
                <Skeleton className="h-5 w-20 rounded-full" />
              ) : null}

              {location ? (
                <Badge size="compact" variant="outline" className="max-w-full">
                  <MapPin />
                  <span className="truncate">{location}</span>
                </Badge>
              ) : showLocationSkeleton ? (
                <Skeleton className="h-5 w-28 rounded-full" />
              ) : null}
            </div>
          </div>

          {showSellerSkeleton ? (
            <div className="rounded-xl border border-border-subtle bg-card p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-(--control-default) rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ) : (
            <QuickViewSellerCard
              compact
              sellerName={sellerName}
              sellerAvatarUrl={sellerAvatarUrl}
              sellerVerified={sellerVerified}
              rating={rating}
              reviews={reviews}
              onNavigateToProduct={onNavigateToProduct}
            />
          )}

          <div className="rounded-xl border border-border-subtle bg-card p-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <ShieldCheck size={17} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold tracking-tight text-foreground">{tProduct("buyerProtection")}</p>
                <p className="text-xs text-muted-foreground">{tProduct("buyerProtectionBadgeSubtitle")}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <ArrowsClockwise size={16} className="shrink-0" />
              <span>{tProduct("easyReturns")}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onNavigateToProduct}
            className="w-full justify-center gap-2"
          >
            {tModal("viewFullPage")}
            <ArrowSquareOut size={16} />
          </Button>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 shrink-0 border-t border-border bg-surface-elevated px-4 py-2.5 pb-safe-max">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="default"
            size="primary"
            className="w-full"
            onClick={onBuyNow}
            disabled={!inStock}
          >
            {tProduct("buyNow")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="primary"
            className="w-full"
            onClick={onAddToCart}
            aria-label={tProduct("addToCart")}
            disabled={!inStock}
          >
            {tProduct("add")}
          </Button>
        </div>
      </div>
    </div>
  )
}
