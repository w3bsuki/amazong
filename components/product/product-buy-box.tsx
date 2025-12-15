"use client"

import { Heart } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { AddToCart } from "@/components/add-to-cart"
import { formatPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"

interface ProductBuyBoxProps {
  product: {
    id: string
    title: string
    price: number
    originalPrice?: number | null
    images: string[]
    sellerId?: string
    slug?: string
  }
  sellerStoreSlug?: string | null
  currentUserId: string | null
  isWatching: boolean
  isWishlistPending: boolean
  onWatchlistToggle: () => void
  discountPercentage: number
  locale: string
  t: {
    addToWatchlist: string
    watching: string
  }
}

export function ProductBuyBox({
  product,
  sellerStoreSlug,
  currentUserId,
  isWatching,
  isWishlistPending,
  onWatchlistToggle,
  discountPercentage,
  locale,
  t,
}: ProductBuyBoxProps) {
  return (
    <div className="space-y-2">
      {/* Price Section */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-foreground tracking-tight">
          {formatPrice(product.price, { locale })}
        </span>
        {product.originalPrice && discountPercentage > 0 && (
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-muted-foreground line-through">
              {formatPrice(product.originalPrice, { locale })}
            </span>
            <span className="text-deal-text font-semibold">(-{discountPercentage}%)</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <AddToCart
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          seller_id: product.sellerId,
          slug: product.slug,
          storeSlug: sellerStoreSlug,
        }}
        currentUserId={currentUserId}
        variant="buyNowOnly"
        showBuyNow={true}
        className="h-12 text-base font-semibold rounded-full touch-manipulation"
      />
      <AddToCart
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          seller_id: product.sellerId,
          slug: product.slug,
          storeSlug: sellerStoreSlug,
        }}
        currentUserId={currentUserId}
        variant="outline"
        showBuyNow={false}
        className="h-12 text-base font-semibold rounded-full border-primary text-primary hover:bg-primary/5 touch-manipulation"
      />
      <Button 
        variant="outline" 
        disabled={isWishlistPending}
        className={cn(
          "w-full h-12 text-base font-semibold rounded-full gap-2 border-primary text-primary hover:bg-primary/5 touch-manipulation",
          isWatching && "bg-blue-50 border-primary text-primary dark:bg-primary/10"
        )}
        onClick={onWatchlistToggle}
      >
        <Heart 
          className={cn("w-5 h-5", isWatching && "fill-current", isWishlistPending && "animate-pulse")} 
          weight={isWatching ? "fill" : "regular"} 
        />
        {isWatching ? t.watching : t.addToWatchlist}
      </Button>
    </div>
  )
}
