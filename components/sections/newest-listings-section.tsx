"use client"

import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocale } from "next-intl"
import type { UIProduct } from "@/lib/data/products"
import { cn } from "@/lib/utils"

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
  title: _title,
  totalCount = 100
}: NewestListingsSectionProps) {
  const locale = useLocale()

  type FeedTab = "newest" | "promoted"

  const tabs = useMemo(
    () =>
      [
        { id: "newest" as const, label: locale === "bg" ? "Нови" : "Newest" },
        { id: "promoted" as const, label: locale === "bg" ? "Промотирани" : "Promoted" },
      ],
    [locale]
  )

  const [activeTab, setActiveTab] = useState<FeedTab>("newest")
  const [isLoading, setIsLoading] = useState(false)
  const [tabData, setTabData] = useState<
    Record<FeedTab, { products: UIProduct[]; page: number; hasMore: boolean }>
  >({
    newest: {
      products: initialProducts,
      page: 1,
      hasMore: initialProducts.length < totalCount,
    },
    promoted: {
      products: [],
      page: 0,
      hasMore: true,
    },
  })
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const active = tabData[activeTab]

  const getEndpointForTab = useCallback((tab: FeedTab) => {
    switch (tab) {
      case "newest":
        return "/api/products/newest"
      case "promoted":
        return "/api/products/promoted"
    }
  }, [])

  const loadPage = useCallback(
    async (tab: FeedTab, nextPage: number) => {
      const endpoint = getEndpointForTab(tab)
      const response = await fetch(`${endpoint}?page=${nextPage}&limit=12`)
      const data = await response.json()
      return data as {
        products?: UIProduct[]
        hasMore?: boolean
        totalCount?: number
      }
    },
    [getEndpointForTab]
  )

  // Fetch more products
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !active.hasMore) return
    
    setIsLoading(true)
    try {
      const nextPage = (active.page || 0) + 1
      const data = await loadPage(activeTab, nextPage)

      const nextProducts = data.products || []
      if (nextProducts.length === 0) {
        setTabData(prev => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], hasMore: false },
        }))
        return
      }

      setTabData(prev => {
        // Deduplicate: filter out any products we already have
        const existingIds = new Set(prev[activeTab].products.map(p => p.id))
        const uniqueNewProducts = nextProducts.filter(p => !existingIds.has(p.id))
        
        return {
          ...prev,
          [activeTab]: {
            products: [...prev[activeTab].products, ...uniqueNewProducts],
            page: nextPage,
            hasMore: data.hasMore ?? nextProducts.length === 12,
          },
        }
      })
    } catch (error) {
      console.error("Failed to load more products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [active.hasMore, active.page, activeTab, isLoading, loadPage])

  // Lazy-load promoted tab on first open
  useEffect(() => {
    if (activeTab !== "promoted") return
    if (tabData.promoted.page !== 0) return

    let cancelled = false
    setIsLoading(true)

    loadPage("promoted", 1)
      .then((data) => {
        if (cancelled) return
        const first = data.products || []
        setTabData(prev => ({
          ...prev,
          promoted: {
            products: first,
            page: first.length > 0 ? 1 : 0,
            hasMore: data.hasMore ?? first.length === 12,
          },
        }))
      })
      .catch((error) => {
        if (!cancelled) console.error("Failed to load promoted products:", error)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab, loadPage, tabData.promoted.page])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && active.hasMore && !isLoading) {
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
  }, [active.hasMore, isLoading, loadMoreProducts])

  if (active.products.length === 0 && activeTab === "newest") {
    return null
  }

  return (
    <section>
      {/* Mobile feed tabs - Premium segmented control */}
      <div className="px-3 pb-1.5">
        <div 
          className="relative flex h-10 rounded-xl bg-card p-1 ring-1 ring-border/50"
          role="tablist"
        >
          {/* Sliding indicator */}
          <div
            className={cn(
              "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg",
              "bg-primary shadow-sm",
              "transition-transform duration-300 ease-out",
              activeTab === "newest" ? "translate-x-0" : "translate-x-[calc(100%+4px)]"
            )}
            aria-hidden="true"
          />
          
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative z-10 flex-1 flex items-center justify-center gap-1.5",
                "rounded-lg text-[13px] font-semibold tracking-tight",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-1",
                "active:scale-[0.98]",
                activeTab === tab.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - 2 columns on mobile, consistent gap */}
      {active.products.length === 0 && activeTab === "promoted" && !isLoading ? (
        <div className="px-3 py-6">
          <div className="rounded-lg border border-border bg-card px-3 py-4 text-center">
            <p className="text-sm font-semibold text-foreground">
              {locale === "bg" ? "Няма промотирани обяви" : "No promoted listings"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "bg" ? "Провери по-късно" : "Check again later"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-3 py-2">
          {active.products.map((product, index) => (
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
      )}

      {/* Load More Trigger / Loading State */}
      <div ref={loadMoreRef} className="mt-4 mb-2">
        {isLoading && <ProductGridSkeleton count={4} />}
        {!active.hasMore && active.products.length > 12 && (
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
