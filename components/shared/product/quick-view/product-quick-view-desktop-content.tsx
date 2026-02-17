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

export function ProductQuickViewDesktopContent({
  product,
  onRequestClose,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
  titleText,
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
      <div className="sticky top-0 z-20 border-b border-border bg-surface-elevated px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-foreground">
            {titleText}
          </h2>
          <IconButton
            type="button"
            variant="ghost"
            size="icon-compact"
            onClick={onCopyLink}
            aria-label={tModal("copyLink")}
            disabled={!shareEnabled}
            className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
          >
            <LinkSimple size={16} />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            size="icon-compact"
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
              size={16}
              className={cn(inWishlist && "fill-primary text-primary")}
            />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            size="icon-compact"
            className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
            onClick={() => onRequestClose?.()}
            aria-label={tDrawers("close")}
          >
            <X className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-1 gap-3 px-4 py-3 lg:grid-cols-5 lg:gap-6 lg:px-6 lg:py-5">
          <div className="space-y-3 lg:col-span-3">
            <QuickViewImageGallery
              images={allImages}
              title={titleText}
              discountPercent={showDiscount ? discountPercent : undefined}
              onNavigateToProduct={onNavigateToProduct}
            />

            <div className="space-y-3 rounded-2xl border border-border-subtle bg-card p-4">
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

              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Truck size={17} />
                  {freeShipping ? tProduct("freeShipping") : tProduct("shippingAvailable")}
                </span>

                {location ? (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {location}
                  </span>
                ) : showLocationSkeleton ? (
                  <Skeleton className="h-4 w-28" />
                ) : null}

                {conditionLabel ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge size="compact" variant={getConditionBadgeVariant(condition)}>
                      {conditionLabel}
                    </Badge>
                  </div>
                ) : showConditionSkeleton ? (
                  <Skeleton className="h-5 w-20 rounded-full" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            {showSellerSkeleton ? (
              <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-(--control-default) rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
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

            <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3 text-sm text-muted-foreground">
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
      </div>

      <div className="sticky bottom-0 z-20 shrink-0 border-t border-border bg-surface-elevated px-4 py-3 pb-safe-max lg:px-6">
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
            disabled={!inStock}
          >
            {tProduct("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  )
}
