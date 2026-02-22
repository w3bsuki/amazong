"use client"

import { useEffect, useMemo, useRef } from "react"
import type { UIProduct } from "@/lib/data/products"
import { ProductGrid, ProductGridSkeleton, type ProductGridProduct } from "@/components/grid/product-grid"
import { EmptyStateCTA } from "../../../../../_components/empty-state-cta"
import { useTranslations } from "next-intl"

export interface ProductFeedProps {
  products: UIProduct[]
  hasMore: boolean
  isLoading: boolean
  activeSlug: string
  locale: string
  isAllTab: boolean
  activeCategoryName: string | null
  onLoadMore: () => void
  showLoadingOverlay?: boolean
}

function EndOfResults({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
      <span className="h-px w-12 bg-border" />
      <span>{label}</span>
      <span className="h-px w-12 bg-border" />
    </div>
  )
}

function mapToGridProduct(product: UIProduct): ProductGridProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    listPrice: product.listPrice ?? undefined,
    originalPrice: product.listPrice ?? null,
    isOnSale: Boolean(product.isOnSale),
    salePercent: product.salePercent ?? undefined,
    saleEndDate: product.saleEndDate ?? null,
    createdAt: product.createdAt ?? null,
    slug: product.slug ?? null,
    storeSlug: product.storeSlug ?? null,
    sellerId: product.sellerId ?? null,
    sellerName: product.sellerName || product.storeSlug || undefined,
    sellerAvatarUrl: product.sellerAvatarUrl ?? null,
    sellerTier: product.sellerTier ?? "basic",
    sellerVerified: Boolean(product.sellerVerified),
    location: product.location ?? undefined,
    condition: product.condition ?? undefined,
    isBoosted: Boolean(product.isBoosted),
    boostExpiresAt: product.boostExpiresAt ?? null,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    categoryRootSlug: product.categoryRootSlug ?? undefined,
    categoryPath: product.categoryPath ?? undefined,
    freeShipping: product.freeShipping ?? false,
  }
}

export function ProductFeed({
  products,
  hasMore,
  isLoading,
  activeSlug,
  locale: _locale,
  isAllTab,
  activeCategoryName,
  onLoadMore,
  showLoadingOverlay = false,
}: ProductFeedProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const tFeed = useTranslations("ProductFeed")

  const categoryAnnouncement = activeCategoryName
    ? tFeed("categoryAnnouncement", { categoryName: activeCategoryName })
    : null

  const loadingLabel = tFeed("loadingProducts")
  const showInlineRefreshSkeleton = showLoadingOverlay && isLoading && products.length > 0

  const gridProducts = useMemo(() => products.map(mapToGridProduct), [products])

  useEffect(() => {
    if (products.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries.at(0)
        if (firstEntry?.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, products.length])

  return (
    <div className="pt-2">
      <div role="status" aria-live="polite" className="sr-only">
        {categoryAnnouncement}
      </div>

      <div aria-busy={isLoading} aria-label={isLoading ? loadingLabel : undefined} className="relative">
        {products.length === 0 && !isLoading ? (
          <EmptyStateCTA
            variant={isAllTab ? "no-listings" : "no-category"}
            {...(activeCategoryName ? { categoryName: activeCategoryName } : {})}
          />
        ) : isLoading && products.length === 0 ? (
          <ProductGridSkeleton count={6} density="compact" preset="mobile-feed" />
        ) : (
          <>
            <ProductGrid
              key={activeSlug}
              products={gridProducts}
              viewMode="grid"
              density="compact"
              preset="mobile-feed"
              className="py-1 transition-colors duration-200"
            />

            {showInlineRefreshSkeleton && (
              <ProductGridSkeleton count={2} density="compact" preset="mobile-feed" />
            )}
          </>
        )}
      </div>

      <div ref={loadMoreRef} className="py-3">
        {isLoading && products.length > 0 && (
          <ProductGridSkeleton count={4} density="compact" preset="mobile-feed" />
        )}
        {!hasMore && products.length > 0 && (
          <EndOfResults label={tFeed("endOfResults", { count: products.length })} />
        )}
      </div>
    </div>
  )
}
