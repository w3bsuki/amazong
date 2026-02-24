import Image from "next/image"

import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { normalizeImageUrl } from "@/lib/normalize-image-url"
import type { ListingOverlayBadgeVariant } from "@/lib/ui/badge-intent"

import { ProductCardActions } from "./actions"

interface ProductCardListMediaSectionProps {
  id: string
  title: string
  price: number
  image: string
  slug: string | null | undefined
  username: string | null | undefined
  inStock: boolean
  showWishlist: boolean
  isOwnProduct: boolean
  overlayBadgeVariants: ListingOverlayBadgeVariant[]
  discountPercent: number
  adBadgeLabel: string
  outOfStockLabel: string
}

export function ProductCardListMediaSection({
  id,
  title,
  price,
  image,
  slug,
  username,
  inStock,
  showWishlist,
  isOwnProduct,
  overlayBadgeVariants,
  discountPercent,
  adBadgeLabel,
  outOfStockLabel,
}: ProductCardListMediaSectionProps) {
  return (
    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-surface-subtle sm:h-40 sm:w-40">
      <Image
        src={normalizeImageUrl(image)}
        alt={title}
        fill
        sizes="(max-width: 640px) 128px, 160px"
        className="pointer-events-none object-cover"
      />

      {overlayBadgeVariants.length > 0 && (
        <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
          {overlayBadgeVariants.map((variant) =>
            variant === "promoted" ? (
              <MarketplaceBadge key={variant} variant="promoted">
                {adBadgeLabel}
              </MarketplaceBadge>
            ) : (
              <MarketplaceBadge key={variant} variant="discount">
                -{discountPercent}%
              </MarketplaceBadge>
            )
          )}
        </div>
      )}

      <div className="absolute right-1.5 top-1.5 z-20">
        <ProductCardActions
          id={id}
          title={title}
          price={price}
          image={image}
          slug={slug ?? null}
          username={username ?? null}
          showQuickAdd={false}
          showWishlist={showWishlist}
          inStock={inStock}
          isOwnProduct={isOwnProduct}
          size="icon-compact"
        />
      </div>

      {!inStock && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface-overlay">
          <span className="text-xs font-medium text-muted-foreground">{outOfStockLabel}</span>
        </div>
      )}
    </div>
  )
}
