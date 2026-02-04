"use client"

import type { UIProduct } from "@/lib/data/products"

import { ProductCard } from "./product-card"

export interface HorizontalProductStripCardProps {
  product: UIProduct
  /** Disable quick view overlay (force navigation). */
  disableQuickView?: boolean
}

export function HorizontalProductCard({
  product,
  disableQuickView = false,
}: HorizontalProductStripCardProps) {
  return (
    <div className="shrink-0 w-40">
      <ProductCard
        id={product.id}
        title={product.title}
        price={product.price}
        image={product.image}
        originalPrice={product.listPrice ?? null}
        slug={product.slug ?? null}
        username={product.storeSlug ?? null}
        sellerId={product.sellerId ?? null}
        sellerName={product.sellerName ?? undefined}
        sellerAvatarUrl={product.sellerAvatarUrl ?? null}
        sellerVerified={Boolean(product.sellerVerified)}
        rating={product.rating ?? 0}
        reviews={product.reviews ?? 0}
        isBoosted={Boolean(product.isBoosted)}
        boostExpiresAt={product.boostExpiresAt ?? null}
        disableQuickView={disableQuickView}
        appearance="tile"
        media="landscape"
        density="compact"
        titleLines={1}
      />
    </div>
  )
}
