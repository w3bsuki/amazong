"use client"

import type { UIProduct } from "@/lib/data/products"

import { ProductCard } from "./product-card"

export interface HorizontalProductStripCardProps {
  product: UIProduct
  /** Disable quick view overlay (force navigation). */
  disableQuickView?: boolean
  /** UI styling variant. Defaults to "default". */
  uiVariant?: "default" | "home"
  /** Card radius scale. Defaults to "xl". */
  radius?: "xl" | "2xl"
  /** Visual surface style. Defaults to "tile". */
  appearance?: "card" | "tile"
  /** Density tuning. Defaults to "compact". */
  density?: "default" | "compact"
  /** Title line clamp. Defaults to 1 for strips. */
  titleLines?: 1 | 2
}

export function HorizontalProductCard({
  product,
  disableQuickView = false,
  uiVariant = "default",
  radius = "xl",
  appearance = "tile",
  density = "compact",
  titleLines = 2,
}: HorizontalProductStripCardProps) {
  return (
    <div className="shrink-0 w-44">
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
        appearance={appearance}
        media="landscape"
        density={density}
        titleLines={titleLines}
        uiVariant={uiVariant}
        radius={radius}
      />
    </div>
  )
}
