import { MapPin, Truck } from "lucide-react"

import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getConditionBadgeVariant } from "@/components/shared/product/condition"

import type { ProductQuickViewViewProps } from "./product-quick-view-content"
import { QuickViewImageGallery } from "./quick-view-image-gallery"
import {
  QuickViewActionButtons,
  QuickViewFooterBar,
  QuickViewSellerSection,
} from "./quick-view-chrome"

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
            buttonSize="icon-compact"
            iconSize={16}
            closeIconClassName="size-4"
            className="gap-2"
          />
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
                      <MarketplaceBadge size="compact" variant={getConditionBadgeVariant(condition)}>
                        {conditionLabel}
                      </MarketplaceBadge>
                    </div>
                  ) : showConditionSkeleton ? (
                    <Skeleton className="h-5 w-20 rounded-full" />
                  ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
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
              sellerSkeletonClassName="bg-surface-subtle"
              titleSkeletonClassName="w-36"
              subtitleSkeletonClassName="w-24"
              protectionCardClassName="bg-surface-subtle"
            />
          </div>
        </div>
      </div>

      <QuickViewFooterBar
        containerClassName="px-4 py-3 lg:px-6"
        buyNowLabel={tProduct("buyNow")}
        addToCartLabel={tProduct("addToCart")}
        onBuyNow={onBuyNow}
        onAddToCart={onAddToCart}
        inStock={inStock}
      />
    </div>
  )
}
