"use client"

import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import type { UIProduct } from "@/lib/data/products"
import { cn } from "@/lib/utils"
import { BULGARIAN_CITIES, getCityLabel } from "@/lib/bulgarian-cities"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NewestListingsSectionProps {
  initialProducts: UIProduct[]
  title?: string
  /** Total count of products available */
  totalCount?: number
  categories?: Array<{ id: string; name: string; name_bg: string; slug: string }>
}

// Loading skeleton for the product grid
function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 px-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col h-full">
          <Skeleton className="aspect-square w-full rounded-md mb-1" />
          <div className="space-y-1 flex-1 px-0.5">
            <Skeleton className="h-2.5 w-full rounded-sm" />
            <Skeleton className="h-2.5 w-2/3 rounded-sm" />
          </div>
          <div className="mt-1.5 flex items-center justify-between px-0.5 pb-0.5">
            <Skeleton className="h-3.5 w-12 rounded-sm" />
            <Skeleton className="size-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NewestListingsSection({ 
  initialProducts,
  title: _title,
  totalCount = 100,
  categories = []
}: NewestListingsSectionProps) {
  const locale = useLocale()

  const [nearMeCity, setNearMeCity] = useState<string>("")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("near-me-city")
      if (saved) setNearMeCity(saved)
    } catch {
      // ignore
    }
  }, [])

  type FeedTab = "newest" | "promoted" | "near_me" | string

  const tabs = useMemo(
    () => {
      const baseTabs = [
        { id: "newest", label: locale === "bg" ? "За теб" : "For you" },
        { id: "promoted", label: locale === "bg" ? "Промотирани" : "Promoted" },
        { id: "near_me", label: locale === "bg" ? "Наблизо" : "Near me" },
      ]
      
      const categoryTabs = categories.map(cat => ({
        id: `cat:${cat.slug}`,
        label: locale === "bg" ? cat.name_bg : cat.name
      }))
      
      return [...baseTabs, ...categoryTabs]
    },
    [locale, categories]
  )

  const [activeTab, setActiveTab] = useState<FeedTab>("newest")
  const [isLoading, setIsLoading] = useState(false)
  const [tabData, setTabData] = useState<
    Record<string, { products: UIProduct[]; page: number; hasMore: boolean }>
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
    near_me: {
      products: [],
      page: 0,
      hasMore: true,
    },
    ...Object.fromEntries(categories.map(cat => [
      `cat:${cat.slug}`, 
      { products: [], page: 0, hasMore: true }
    ]))
  })
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const active = tabData[activeTab] || { products: [], page: 0, hasMore: true }

  const getEndpointForTab = useCallback((tab: string) => {
    if (tab === "promoted") return "/api/products/promoted"
    if (tab === "near_me") return "/api/products/nearby"
    if (tab.startsWith("cat:")) return "/api/products/newest"
    return "/api/products/newest"
  }, [])

  const loadPage = useCallback(
    async (tab: string, nextPage: number) => {
      const endpoint = getEndpointForTab(tab)
      let url = `${endpoint}?page=${nextPage}&limit=12`

      if (tab === "near_me") {
        url += `&city=${encodeURIComponent(nearMeCity)}`
      }
      
      if (tab.startsWith("cat:")) {
        const slug = tab.split(":")[1]
        url += `&category=${slug}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      return data as {
        products?: UIProduct[]
        hasMore?: boolean
        totalCount?: number
      }
    },
    [getEndpointForTab, nearMeCity]
  )

  // Reset and reload Near Me when city changes
  useEffect(() => {
    if (activeTab !== "near_me") return

    setTabData(prev => ({
      ...prev,
      near_me: { products: [], page: 0, hasMore: true },
    }))

    if (!nearMeCity) return

    let cancelled = false
    setIsLoading(true)
    loadPage("near_me", 1)
      .then((data) => {
        if (cancelled) return
        const first = data.products || []
        setTabData(prev => ({
          ...prev,
          near_me: {
            products: first,
            page: first.length > 0 ? 1 : 0,
            hasMore: data.hasMore ?? first.length === 12,
          },
        }))
      })
      .catch((error) => {
        if (!cancelled) console.error("Failed to load near me products:", error)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab, loadPage, nearMeCity])

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
        const current = prev[activeTab] || { products: [], page: 0, hasMore: true }
        // Deduplicate: filter out any products we already have
        const existingIds = new Set(current.products.map(p => p.id))
        const uniqueNewProducts = nextProducts.filter(p => !existingIds.has(p.id))
        
        return {
          ...prev,
          [activeTab]: {
            products: [...current.products, ...uniqueNewProducts],
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

  // Lazy-load tabs on first open
  useEffect(() => {
    if (activeTab === "newest") return
    const current = tabData[activeTab]
    if (current && current.page !== 0) return

    let cancelled = false
    setIsLoading(true)

    loadPage(activeTab, 1)
      .then((data) => {
        if (cancelled) return
        const first = data.products || []
        setTabData(prev => ({
          ...prev,
          [activeTab]: {
            products: first,
            page: first.length > 0 ? 1 : 0,
            hasMore: data.hasMore ?? first.length === 12,
          },
        }))
      })
      .catch((error) => {
        if (!cancelled) console.error(`Failed to load ${activeTab} products:`, error)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab, loadPage, tabData])

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
      {/* Mobile feed tabs - Quick Pills style like reference image */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md px-3 py-2 border-b border-border/40">
        <div className="flex items-center justify-between gap-2">
          <div 
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 px-4 h-touch rounded-full text-xs font-semibold transition-all duration-200",
                  "flex items-center justify-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  activeTab === tab.id
                    ? "bg-cta-trust-blue text-cta-trust-blue-text shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
              >
                {tab.id === "promoted" && (
                  <span className="mr-1 inline-flex items-center justify-center size-3.5 rounded-full bg-success text-[9px] text-primary-foreground">
                    %
                  </span>
                )}
                {tab.id === "near_me" && (
                  <span className="mr-1 inline-flex items-center justify-center text-[12px]">
                    📍
                  </span>
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "near_me" && (
          <div className="mt-2">
            <Select
              value={nearMeCity}
              onValueChange={(val) => {
                setNearMeCity(val)
                try {
                  localStorage.setItem("near-me-city", val)
                } catch {
                  // ignore
                }
              }}
            >
              <SelectTrigger className="h-10 rounded-full">
                <SelectValue
                  placeholder={locale === "bg" ? "Изберете град..." : "Select city..."}
                />
              </SelectTrigger>
              <SelectContent>
                {BULGARIAN_CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value} className="font-medium">
                    {locale === "bg" ? city.labelBg : city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!!nearMeCity && (
              <p className="mt-1 px-1 text-xs text-muted-foreground">
                {locale === "bg"
                  ? `Показваме обяви от ${getCityLabel(nearMeCity, "bg")}`
                  : `Showing listings from ${getCityLabel(nearMeCity, "en")}`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Product Grid - 2 columns on mobile, consistent gap */}
      {active.products.length === 0 && activeTab === "near_me" && !isLoading && !nearMeCity ? (
        <div className="px-3 py-4">
          <div className="rounded-xl border border-border bg-card px-4 py-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              {locale === "bg" ? "Изберете град" : "Select a city"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "bg" ? "За да видите обяви наблизо" : "To see listings near you"}
            </p>
          </div>
        </div>
      ) : active.products.length === 0 && activeTab === "promoted" && !isLoading ? (
        <div className="px-3 py-4">
          <div className="rounded-xl border border-border bg-card px-4 py-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              {locale === "bg" ? "Няма промотирани обяви" : "No promoted listings"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "bg" ? "Провери по-късно" : "Check again later"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 px-3 py-1.5">
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
              state={activeTab === "promoted" || product.isBoosted ? "promoted" : undefined}
              index={index}
              slug={product.slug}
              storeSlug={product.storeSlug}
              sellerId={product.sellerId || undefined}
              sellerName={(product.sellerName || product.storeSlug) || undefined}
              sellerAvatarUrl={product.sellerAvatarUrl || null}
              sellerTier={product.sellerTier}
              sellerVerified={product.sellerVerified}
              condition={product.condition}
              brand={product.brand}
              categorySlug={product.categorySlug}
              make={product.make}
              model={product.model}
              year={product.year}
              location={product.location}
              attributes={product.attributes}
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
