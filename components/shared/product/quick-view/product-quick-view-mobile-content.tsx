import { MapPin } from "lucide-react"

import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getConditionBadgeVariant } from "@/components/shared/product/_lib/condition"

import type { ProductQuickViewViewProps } from "./product-quick-view-content"
import { QuickViewImageGallery } from "./quick-view-image-gallery"
import {
  QuickViewActionButtons,
  QuickViewFooterBar,
  QuickViewSellerSection,
  QuickViewShippingBadge,
} from "./quick-view-chrome"

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

          <QuickViewActionButtons
            copyAriaLabel={tModal("copyLink")}
            wishlistAriaLabel={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
            closeAriaLabel={tDrawers("close")}
            inWishlist={inWishlist}
            wishlistPending={wishlistPending}
            shareEnabled={shareEnabled}
            onCopyLink={onCopyLink}
            onToggleWishlist={onToggleWishlist}
            onRequestClose={onRequestClose}
            buttonSize="icon-default"
            iconSize={18}
            closeIconClassName="size-4.5"
            className="gap-1.5"
          />
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
              <QuickViewShippingBadge
                freeShipping={freeShipping}
                label={freeShipping ? tProduct("freeShipping") : tProduct("shippingAvailable")}
              />

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

          <QuickViewSellerSection
            showSellerSkeleton={showSellerSkeleton}
            sellerName={sellerName}
            sellerAvatarUrl={sellerAvatarUrl}
            sellerVerified={sellerVerified}
            rating={rating}
            reviews={reviews}
            onNavigateToProduct={onNavigateToProduct}
            protectionTitle={tProduct("buyerProtection")}
            protectionSubtitle={tProduct("buyerProtectionBadgeSubtitle")}
            easyReturns={tProduct("easyReturns")}
            viewFullPageLabel={tModal("viewFullPage")}
            sellerSkeletonClassName="bg-card"
            titleSkeletonClassName="w-32"
            subtitleSkeletonClassName="w-20"
            protectionCardClassName="bg-card"
          />
        </div>
      </div>

      <QuickViewFooterBar
        containerClassName="px-4 py-2.5"
        buyNowLabel={tProduct("buyNow")}
        addToCartLabel={tProduct("add")}
        addToCartAriaLabel={tProduct("addToCart")}
        onBuyNow={onBuyNow}
        onAddToCart={onAddToCart}
        inStock={inStock}
      />
    </div>
  )
}
