"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import type { UIProduct } from "@/lib/data/products"
import { ProductCard } from "@/components/shared/product/product-card"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { Skeleton } from "@/components/ui/skeleton"

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
// Loading Skeleton
// =============================================================================

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-1 px-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col h-full">
          <Skeleton className="aspect-square w-full rounded-md mb-1" />
          <div className="space-y-1 flex-1 px-0.5">
            <Skeleton className="h-2.5 w-full rounded-sm" />
            <Skeleton className="h-2.5 w-2/3 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// End of Results
// =============================================================================

function EndOfResults({ locale }: { locale: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
      <span className="h-px w-12 bg-border" />
      <span>{locale === "bg" ? "Край на резултатите" : "End of results"}</span>
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
      {products.length === 0 && !isLoading ? (
        <EmptyStateCTA
          variant={isAllTab ? "no-listings" : "no-category"}
          {...(activeCategoryName ? { categoryName: activeCategoryName } : {})}
        />
      ) : (
        <div className="grid grid-cols-2 gap-1 px-1">
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
        </div>
      )}

      <div ref={loadMoreRef} className="py-3">
        {isLoading && <ProductGridSkeleton count={4} />}
        {!hasMore && products.length > 0 && <EndOfResults locale={locale} />}
      </div>
    </div>
  )
}
