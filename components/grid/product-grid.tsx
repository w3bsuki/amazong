/**
 * ProductGrid — Responsive product grid
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { DesktopProductCard } from "@/components/shared/product/card/desktop"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { ProductCardList } from "@/components/shared/product/card/list"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export type ViewMode = "grid" | "list"
export type ProductGridPreset = "desktop" | "mobile-feed" | "mobile-rail"

export interface ProductGridProduct {
  id: string
  title: string
  price: number
  image: string
  listPrice?: number | undefined
  originalPrice?: number | null | undefined
  isOnSale?: boolean | undefined
  salePercent?: number | undefined
  saleEndDate?: string | null | undefined
  createdAt?: string | null | undefined
  slug?: string | null | undefined
  storeSlug?: string | null | undefined
  username?: string | null | undefined
  sellerId?: string | null | undefined
  sellerName?: string | null | undefined
  sellerAvatarUrl?: string | null | undefined
  sellerTier?: "basic" | "premium" | "business" | undefined
  sellerVerified?: boolean | undefined
  location?: string | undefined
  condition?: string | undefined
  isBoosted?: boolean | undefined
  boostExpiresAt?: string | null | undefined
  rating?: number | undefined
  reviews?: number | undefined
  soldCount?: number | undefined
  tags?: string[] | undefined
  categoryRootSlug?: string | undefined
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }> | undefined
  attributes?: Record<string, unknown> | undefined
  freeShipping?: boolean | undefined
}

export interface ProductGridProps {
  products: ProductGridProduct[]
  viewMode?: ViewMode
  density?: "normal" | "compact"
  preset?: ProductGridPreset
  className?: string
  isLoading?: boolean
}

const gridColumnClasses = {
  normal: ["grid-cols-2", "sm:grid-cols-3", "md:grid-cols-4", "lg:grid-cols-5"],
  compact: ["grid-cols-2", "sm:grid-cols-3", "md:grid-cols-4", "lg:grid-cols-5", "xl:grid-cols-6"],
} as const

export function ProductGrid({
  products,
  viewMode = "grid",
  density = "normal",
  preset = "desktop",
  className,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton viewMode={viewMode} density={density} preset={preset} />
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div
      id="product-grid"
      data-slot="product-grid"
      className="@container"
      role="list"
      aria-live="polite"
      tabIndex={-1}
    >
      <div
        className={cn(
          viewMode === "list"
            ? "flex flex-col gap-2"
            : ["grid gap-(--product-grid-gap)", ...gridColumnClasses[density]],
          className
        )}
      >
        {products.map((product, index) => {
          const username = product.storeSlug ?? product.username ?? null

          return (
            <div key={product.id} role="listitem">
              {viewMode === "list" ? (
                <ProductCardList
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.listPrice ?? product.originalPrice ?? null}
                  image={product.image}
                  createdAt={product.createdAt ?? null}
                  slug={product.slug ?? null}
                  username={username}
                  sellerId={product.sellerId ?? null}
                  sellerName={product.sellerName ?? undefined}
                  sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                  sellerVerified={Boolean(product.sellerVerified)}
                  location={product.location}
                  condition={product.condition}
                  freeShipping={product.freeShipping ?? false}
                  isBoosted={Boolean(product.isBoosted)}
                  {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                />
              ) : preset === "desktop" ? (
                <DesktopProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.listPrice ?? product.originalPrice ?? null}
                  isOnSale={Boolean(product.isOnSale)}
                  salePercent={product.salePercent ?? 0}
                  createdAt={product.createdAt ?? null}
                  image={product.image}
                  rating={product.rating ?? 0}
                  reviews={product.reviews ?? 0}
                  soldCount={product.soldCount ?? 0}
                  slug={product.slug ?? null}
                  username={username}
                  sellerId={product.sellerId ?? null}
                  sellerName={product.sellerName ?? undefined}
                  sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                  sellerVerified={Boolean(product.sellerVerified)}
                  freeShipping={product.freeShipping ?? false}
                  location={product.location}
                  condition={product.condition}
                  isBoosted={Boolean(product.isBoosted)}
                  boostExpiresAt={product.boostExpiresAt ?? null}
                  index={index}
                  {...(product.sellerTier ? { sellerTier: product.sellerTier } : {})}
                  {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                  {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                />
              ) : (
                <MobileProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.listPrice ?? product.originalPrice ?? null}
                  salePercent={product.salePercent ?? 0}
                  createdAt={product.createdAt ?? null}
                  image={product.image}
                  rating={product.rating ?? 0}
                  reviews={product.reviews ?? 0}
                  slug={product.slug ?? null}
                  username={username}
                  sellerId={product.sellerId ?? null}
                  sellerName={product.sellerName ?? undefined}
                  sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                  sellerVerified={Boolean(product.sellerVerified)}
                  condition={product.condition}
                  location={product.location}
                  isBoosted={Boolean(product.isBoosted)}
                  boostExpiresAt={product.boostExpiresAt ?? null}
                  index={index}
                  layout={preset === "mobile-rail" ? "rail" : "feed"}
                  {...(product.sellerTier ? { sellerTier: product.sellerTier } : {})}
                  {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ProductGridSkeleton({
  viewMode = "grid",
  density = "normal",
  count = 12,
  preset = "desktop",
}: {
  viewMode?: ViewMode
  density?: "normal" | "compact"
  count?: number
  preset?: ProductGridPreset
}) {
  const ratio = preset === "desktop" ? 1 : 4 / 3

  return (
    <div data-slot="product-grid-skeleton" className="@container">
      <div
        className={cn(
          viewMode === "list"
            ? "flex flex-col gap-2"
            : ["grid gap-(--product-grid-gap)", ...gridColumnClasses[density]]
        )}
      >
        {Array.from({ length: count }).map((_, i) =>
          viewMode === "list" ? (
            <div key={i} className="flex gap-2.5 rounded-xl border border-border bg-card p-2">
              <div className="aspect-square w-24 shrink-0 animate-pulse motion-reduce:animate-none rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse motion-reduce:animate-none rounded-full bg-muted" />
                <div className="h-4 w-1/2 animate-pulse motion-reduce:animate-none rounded-full bg-muted" />
                <div className="h-5 w-1/4 animate-pulse motion-reduce:animate-none rounded-full bg-muted" />
              </div>
            </div>
          ) : (
            <div key={i} className="space-y-2">
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <AspectRatio ratio={ratio} />
              </div>
              <div className="h-4 w-full animate-pulse motion-reduce:animate-none rounded-full bg-muted" />
              <div className="h-4 w-2/3 animate-pulse motion-reduce:animate-none rounded-full bg-muted" />
            </div>
          )
        )}
      </div>
    </div>
  )
}

