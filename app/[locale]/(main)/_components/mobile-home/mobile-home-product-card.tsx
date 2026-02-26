import type { UIProduct } from "@/lib/types/products"
import { MobileProductCard } from "@/components/shared/product/card/mobile"

interface MobileHomeProductCardProps {
  product: UIProduct
  index: number
}

export function MobileHomeProductCard({ product, index }: MobileHomeProductCardProps) {
  return (
    <MobileProductCard
      key={`${product.id}-${index}`}
      id={product.id}
      title={product.title}
      price={product.price}
      createdAt={product.createdAt ?? null}
      originalPrice={product.listPrice ?? null}
      image={product.image}
      rating={product.rating}
      reviews={product.reviews}
      showWishlist={false}
      {...(product.freeShipping === true ? { freeShipping: true } : {})}
      {...(product.isBoosted ? { isBoosted: true } : {})}
      {...(product.boostExpiresAt ? { boostExpiresAt: product.boostExpiresAt } : {})}
      index={index}
      slug={product.slug ?? null}
      username={product.storeSlug ?? null}
      sellerId={product.sellerId ?? null}
      {...(product.sellerName || product.storeSlug
        ? { sellerName: product.sellerName || product.storeSlug || "" }
        : {})}
      sellerAvatarUrl={product.sellerAvatarUrl || null}
      sellerTier={product.sellerTier ?? "basic"}
      sellerVerified={Boolean(product.sellerVerified)}
      {...(product.condition ? { condition: product.condition } : {})}
      {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
      {...(product.location ? { location: product.location } : {})}
      titleLines={2}
      layout="feed"
    />
  )
}
