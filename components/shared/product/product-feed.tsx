"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import type { UIProduct } from "@/lib/data/products"
import { ProductCard, ProductCardSkeletonGrid, ProductGrid } from "@/components/shared/product/product-card"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"

// =============================================================================
// Types
// =============================================================================

interface TabData {
  products: UIProduct[]
  page: number
  hasMore: boolean
}

export interface ProductFeedProps {
  products: UIProduct[]
  hasMore: boolean
  isLoading: boolean
  activeSlug: string
  locale: string
  isAllTab: boolean
  activeCategoryName: string | null
  onLoadMore: () => void
}

// =============================================================================
// End of Results
// =============================================================================

function EndOfResults({ locale, count }: { locale: string; count: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
      <span className="h-px w-12 bg-border" />
      <span>
        {locale === "bg" ? `${count} продукта` : `${count} products`}
      </span>
      <span className="h-px w-12 bg-border" />
    </div>
  )
}

// =============================================================================
// Component
// =============================================================================

export function ProductFeed({
  products,
  hasMore,
  isLoading,
  activeSlug,
  locale,
  isAllTab,
  activeCategoryName,
  onLoadMore,
}: ProductFeedProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const categoryAnnouncement = activeCategoryName
    ? (locale === "bg"
        ? `Показване на ${activeCategoryName}`
        : `Now showing ${activeCategoryName}`)
    : null

  const loadingLabel = locale === "bg" ? "Зареждане на продукти" : "Loading products"

  // Intersection Observer for infinite scroll
  useEffect(() => {
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
  }, [hasMore, isLoading, onLoadMore])

  return (
    <div className="pt-1">
      {/* Announce category changes for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {categoryAnnouncement}
      </div>

      <div aria-busy={isLoading} aria-label={isLoading ? loadingLabel : undefined}>
      {products.length === 0 && !isLoading ? (
        <EmptyStateCTA
          variant={isAllTab ? "no-listings" : "no-category"}
          {...(activeCategoryName ? { categoryName: activeCategoryName } : {})}
        />
      ) : isLoading && products.length === 0 ? (
        <ProductCardSkeletonGrid
          count={6}
          density="compact"
          className="py-1"
        />
      ) : (
        <ProductGrid density="compact" className="py-1">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id}-${activeSlug}`}
              id={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.listPrice ?? null}
              image={product.image}
              rating={product.rating}
              reviews={product.reviews}
              {...(product.isBoosted ? { state: "promoted" as const } : {})}
              index={index}
              slug={product.slug ?? null}
              username={product.storeSlug ?? null}
              sellerId={product.sellerId ?? null}
              {...((product.sellerName || product.storeSlug)
                ? { sellerName: product.sellerName || product.storeSlug || "" }
                : {})}
              sellerAvatarUrl={product.sellerAvatarUrl || null}
              sellerTier={product.sellerTier ?? "basic"}
              sellerVerified={Boolean(product.sellerVerified)}
              {...(product.condition ? { condition: product.condition } : {})}
              {...(product.brand ? { brand: product.brand } : {})}
              {...(product.categorySlug ? { categorySlug: product.categorySlug } : {})}
              {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
              {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
              {...(product.make ? { make: product.make } : {})}
              {...(product.model ? { model: product.model } : {})}
              {...(product.year ? { year: product.year } : {})}
              {...(product.location ? { location: product.location } : {})}
              {...(product.attributes ? { attributes: product.attributes } : {})}
            />
          ))}
        </ProductGrid>
      )}

      </div>

      <div ref={loadMoreRef} className="py-3">
        {isLoading && products.length > 0 && (
          <ProductCardSkeletonGrid
            count={4}
            density="compact"
            className="py-1"
          />
        )}
        {!hasMore && products.length > 0 && (
          <EndOfResults locale={locale} count={products.length} />
        )}
      </div>
    </div>
  )
}
