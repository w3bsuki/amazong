"use client"

import { useRef, useEffect } from "react"
import type { UIProduct } from "@/lib/data/products"
import { ProductCard, ProductCardSkeletonGrid, ProductGrid } from "@/components/shared/product/product-card"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

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
  /** When true, shows loading overlay instead of replacing content (smoother category switching) */
  showLoadingOverlay?: boolean
}

// =============================================================================
// End of Results
// =============================================================================

function EndOfResults({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
      <span className="h-px w-12 bg-border" />
      <span>{label}</span>
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

  // Intersection Observer for infinite scroll
  // Only observe if we have products AND hasMore - avoid spam on empty categories
  useEffect(() => {
    // Don't set up observer if no products loaded yet (empty category)
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
    <div className="pt-1">
      {/* Announce category changes for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {categoryAnnouncement}
      </div>

      <div aria-busy={isLoading} aria-label={isLoading ? loadingLabel : undefined} className="relative">
      {/* Loading overlay for smooth category transitions */}
      {showLoadingOverlay && isLoading && products.length > 0 && (
        <div className="absolute inset-0 bg-background/60 z-10 flex items-start justify-center pt-20">
          <div className="flex flex-col items-center gap-2">
            <div className="size-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">{loadingLabel}</span>
          </div>
        </div>
      )}
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
        <ProductGrid density="compact" className={cn("py-1 transition-opacity duration-200", showLoadingOverlay && isLoading && "opacity-50")}>
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id}-${activeSlug}`}
              id={product.id}
              title={product.title}
              price={product.price}
              createdAt={product.createdAt ?? null}
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
              sellerEmailVerified={Boolean(product.sellerEmailVerified)}
              sellerPhoneVerified={Boolean(product.sellerPhoneVerified)}
              sellerIdVerified={Boolean(product.sellerIdVerified)}
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
          <EndOfResults label={tFeed("endOfResults", { count: products.length })} />
        )}
      </div>
    </div>
  )
}
