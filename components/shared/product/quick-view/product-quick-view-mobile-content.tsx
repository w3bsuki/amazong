import { ChevronRight, Heart, Link as LinkSimple, X } from "lucide-react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getConditionBadgeVariant } from "@/components/shared/product/condition"

import type { ProductQuickViewViewProps } from "./product-quick-view-content"
import { QuickViewImageGallery } from "./quick-view-image-gallery"
import { QuickViewShippingBadge } from "./quick-view-chrome"
import { QuickViewPriceRow } from "./quick-view-price-row"

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
  showConditionSkeleton,
  onCopyLink,
  onToggleWishlist,
}: ProductQuickViewViewProps) {
  const tDrawers = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const tModal = useTranslations("ProductModal")

  const {
    freeShipping,
    condition,
    inStock = true,
  } = product

  return (
    <div className="flex flex-col bg-surface-elevated">
      {/* Header — title + actions */}
      <div className="border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-foreground">
            {titleText}
          </h2>
          <div className="flex items-center gap-1">
            <IconButton
              type="button"
              variant="ghost"
              size="icon-default"
              onClick={onCopyLink}
              aria-label={tModal("copyLink")}
              disabled={!shareEnabled}
              className="text-muted-foreground hover:text-foreground"
            >
              <LinkSimple size={16} />
            </IconButton>
            <IconButton
              type="button"
              variant="ghost"
              size="icon-default"
              onClick={onToggleWishlist}
              aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
              disabled={wishlistPending}
              className={cn(
                inWishlist
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart size={16} className={cn(inWishlist && "fill-primary")} />
            </IconButton>
            <IconButton
              type="button"
              variant="ghost"
              size="icon-default"
              onClick={() => onRequestClose?.()}
              aria-label={tDrawers("close")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Content — image, info, actions — all inline, no scroll needed */}
      <div className="space-y-2.5 px-4 py-3">
        <QuickViewImageGallery
          images={allImages}
          title={titleText}
          discountPercent={showDiscount ? discountPercent : undefined}
          onNavigateToProduct={onNavigateToProduct}
          compact
          compactRatio={3 / 2}
        />

        {/* Title + price */}
        <div className="space-y-1">
          <h2 className="line-clamp-2 text-base font-semibold tracking-tight leading-tight text-foreground">
            {titleText}
          </h2>
          {descriptionPreview ? (
            <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">
              {descriptionPreview}
            </p>
          ) : null}
          <QuickViewPriceRow
            formattedPrice={formattedPrice}
            formattedOriginalPrice={formattedOriginalPrice}
            showDiscount={showDiscount}
            discountPercent={discountPercent}
            inStock={inStock}
            outOfStockLabel={tProduct("outOfStock")}
            priceClassName="text-xl font-semibold"
          />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <QuickViewShippingBadge
            freeShipping={freeShipping}
            label={freeShipping ? tProduct("freeShipping") : tProduct("shippingAvailable")}
          />

          {conditionLabel ? (
            <MarketplaceBadge size="compact" variant={getConditionBadgeVariant(condition)}>
              {conditionLabel}
            </MarketplaceBadge>
          ) : showConditionSkeleton ? (
            <Skeleton className="h-5 w-20 rounded-full" />
          ) : null}
        </div>

        {/* Actions — inline, not a sticky footer */}
        <div className="grid grid-cols-2 gap-2 pt-1 pb-safe-max">
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

        {/* View full product page */}
        <button
          type="button"
          onClick={onNavigateToProduct}
          className="flex min-h-(--control-default) w-full items-center justify-center gap-1 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground active:text-foreground"
        >
          {tModal("viewFullPage")}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
