"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocale } from "next-intl"
import type { UIProduct } from "@/lib/data/products"

interface NewestListingsSectionProps {
  initialProducts: UIProduct[]
  title?: string
  /** Total count of products available */
  totalCount?: number
}

// Loading skeleton for the product grid
function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 px-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border border-border p-2">
          <Skeleton className="aspect-square w-full rounded-md mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function NewestListingsSection({ 
  initialProducts,
  title,
  totalCount = 100
}: NewestListingsSectionProps) {
  const locale = useLocale()
  const [products, setProducts] = useState<UIProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount)
  const [page, setPage] = useState(1)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const sectionTitle = title || (locale === "bg" ? "Най-нови обяви" : "Newest Listings")

  // Fetch more products
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/newest?page=${page + 1}&limit=12`)
      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...data.products])
        setPage(prev => prev + 1)
        setHasMore(data.hasMore ?? data.products.length === 12)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load more products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreProducts()
        }
      },
      { 
        rootMargin: "200px", // Load before user reaches the end
        threshold: 0.1 
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, loadMoreProducts])

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-2">
      {/* Section Header - Full-width banner matching Trending section */}
      <div className="bg-cta-trust-blue text-cta-trust-blue-text px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">
            {sectionTitle}
          </h2>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">
            {locale === "bg" ? "Ново" : "New"}
          </span>
        </div>
        <span className="text-xs opacity-80">
          {locale === "bg" ? "Безкраен скрол" : "Endless scroll"} ↓
        </span>
      </div>

      {/* Product Grid - 2 columns on mobile, consistent gap */}
      <div className="grid grid-cols-2 gap-2 px-3 py-2">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.listPrice}
            image={product.image}
            rating={product.rating}
            reviews={product.reviews}
            variant="compact"
            index={index}
            slug={product.slug}
            storeSlug={product.storeSlug}
            condition={product.condition}
            brand={product.brand}
            categorySlug={product.categorySlug}
            make={product.make}
            model={product.model}
            year={product.year}
            location={product.location}
          />
        ))}
      </div>

      {/* Load More Trigger / Loading State */}
      <div ref={loadMoreRef} className="mt-4 mb-2">
        {isLoading && <ProductGridSkeleton count={4} />}
        {!hasMore && products.length > 12 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            {locale === "bg" ? "Това са всички обяви" : "That's all for now"}
          </p>
        )}
      </div>
    </section>
  )
}

// Export skeleton for Suspense fallback
export function NewestListingsSectionSkeleton() {
  return (
    <section className="mt-3">
      <div className="flex items-center justify-between px-3 mb-2">
        <Skeleton className="h-5 w-32" />
      </div>
      <ProductGridSkeleton count={6} />
    </section>
  )
}
