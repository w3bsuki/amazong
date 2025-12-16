"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { CaretRight, TrendUp, Tag, Sparkle, GridFour } from "@phosphor-icons/react"
import { ProductCard } from "@/components/product-card"
import { Link } from "@/i18n/routing"
import { Skeleton } from "@/components/ui/skeleton"

type FeedTab = "all" | "newest" | "promoted" | "deals"

interface Product {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: 'basic' | 'premium' | 'business'
  sellerVerified?: boolean
  categorySlug?: string | null
  location?: string
  condition?: string
  brand?: string
  make?: string
  model?: string
  year?: string
  isBoosted?: boolean
  tags?: string[]
  attributes?: Record<string, string>
}

interface TabbedProductFeedProps {
  locale: string
}

/**
 * TabbedProductFeed - Desktop optimized product feed
 * Single container with tab navigation for All/Newest/Promoted/Deals
 * Provides better UX than separate carousels - unified browsing experience
 */
export function TabbedProductFeed({ locale }: TabbedProductFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>("all")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const tabs: { id: FeedTab; label: string; icon: typeof GridFour }[] = [
    { id: "all", label: locale === "bg" ? "Всички" : "All", icon: GridFour },
    { id: "newest", label: locale === "bg" ? "Най-нови" : "Newest", icon: TrendUp },
    { id: "promoted", label: locale === "bg" ? "Промотирани" : "Promoted", icon: Sparkle },
    { id: "deals", label: locale === "bg" ? "Оферти" : "Deals", icon: Tag },
  ]

  const fetchProducts = useCallback(async (tab: FeedTab, pageNum: number, append = false) => {
    setIsLoading(true)
    try {
      // Map tab to correct API endpoint
      const endpoint = tab === "promoted" ? "/api/products/promoted" : "/api/products/newest"
      const url = `${endpoint}?page=${pageNum}&limit=20`

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()

      if (data.products) {
        const transformed: Product[] = (data.products as unknown[]).map((raw) => {
          const p = raw as Record<string, unknown>

          const image = (typeof p.image === 'string' && p.image.length > 0)
            ? (p.image as string)
            : (Array.isArray(p.images) && (p.images as unknown[]).some((x) => typeof x === 'string'))
              ? ((p.images as unknown[]).find((x): x is string => typeof x === 'string') ?? "/placeholder.svg")
              : "/placeholder.svg"

          const listPrice = (typeof p.listPrice === 'number')
            ? (p.listPrice as number)
            : (typeof p.list_price === 'number')
              ? (p.list_price as number)
              : undefined

          const storeSlug = (typeof p.storeSlug === 'string')
            ? (p.storeSlug as string)
            : (typeof p.store_slug === 'string')
              ? (p.store_slug as string)
              : null

          const categorySlug = (typeof p.categorySlug === 'string')
            ? (p.categorySlug as string)
            : (typeof p.category_slug === 'string')
              ? (p.category_slug as string)
              : null

          const attributes = (p.attributes && typeof p.attributes === 'object' && !Array.isArray(p.attributes))
            ? (p.attributes as Record<string, string>)
            : undefined

          return {
            id: p.id as string,
            title: p.title as string,
            price: p.price as number,
            listPrice,
            image,
            rating: typeof p.rating === 'number' ? (p.rating as number) : undefined,
            reviews: typeof p.reviews === 'number'
              ? (p.reviews as number)
              : (typeof p.review_count === 'number' ? (p.review_count as number) : undefined),
            slug: (p.slug as string | null) ?? null,
            storeSlug,
            categorySlug,
            location: typeof p.location === 'string' ? (p.location as string) : undefined,
            condition: typeof p.condition === 'string' ? (p.condition as string) : undefined,
            brand: typeof p.brand === 'string' ? (p.brand as string) : undefined,
            make: typeof p.make === 'string' ? (p.make as string) : undefined,
            model: typeof p.model === 'string' ? (p.model as string) : undefined,
            year: typeof p.year === 'string' ? (p.year as string) : undefined,
            isBoosted: tab === 'promoted' || Boolean(p.isBoosted) || Boolean((p as { is_boosted?: boolean | null }).is_boosted),
            tags: Array.isArray(p.tags)
              ? (p.tags as unknown[]).filter((x): x is string => typeof x === 'string')
              : [],
            attributes,
          }
        })

        if (append) {
          setProducts(prev => [...prev, ...transformed])
        } else {
          setProducts(transformed)
        }
        setHasMore(transformed.length === 20)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on tab change
  useEffect(() => {
    setPage(1)
    setProducts([])
    fetchProducts(activeTab, 1, false)
  }, [activeTab, fetchProducts])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(activeTab, nextPage, true)
    }
  }

  return (
    <section 
      className="rounded-xl border border-border bg-card overflow-hidden"
      aria-label={locale === "bg" ? "Обяви" : "Listings"}
    >
      {/* Header with Tabs */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          {/* Title - muted, lighter weight for subheader pattern */}
          <h2 className="text-sm font-medium text-muted-foreground tracking-wide shrink-0">
            {locale === "bg" ? "Обяви" : "Listings"}
          </h2>

          {/* Tab Navigation - Pill style with proper ARIA */}
          <div 
            className="flex items-center gap-1 p-1 rounded-full bg-muted/70 border border-border"
            role="tablist"
            aria-label={locale === "bg" ? "Филтриране на обяви" : "Filter listings"}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "bg-brand text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon size={16} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* See All Link */}
          <Link
            href={`/search?sort=${activeTab === "deals" ? "deals" : activeTab === "promoted" ? "promoted" : "newest"}`}
            className="text-xs font-medium text-link hover:text-link-hover hover:underline underline-offset-2 inline-flex items-center gap-1 shrink-0 transition-colors"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
            <CaretRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Product Grid - with proper tabpanel ARIA */}
      <div 
        className="p-5"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {products.length === 0 && isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4" aria-busy="true" aria-live="polite">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" role="status">
            <div className="text-4xl mb-3" aria-hidden="true">📦</div>
            {locale === "bg" ? "Няма намерени обяви" : "No listings found"}
          </div>
        ) : (
          <>
            {/* 
              Grid Layout - Tailwind v4 best practice:
              - gap-3 for tighter desktop feel (Amazon/eBay density)
              - gap-4 at xl+ for breathing room on large screens
              - 5 columns at xl for optimal card sizing (not too big)
            */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4" role="list" aria-live="polite">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  listPrice={product.listPrice}
                  image={product.image}
                  rating={product.rating}
                  reviews={product.reviews}
                  slug={product.slug}
                  storeSlug={product.storeSlug}
                  sellerId={product.sellerId || undefined}
                  sellerName={(product.sellerName || product.storeSlug) || undefined}
                  sellerAvatarUrl={product.sellerAvatarUrl || null}
                  sellerTier={product.sellerTier}
                  sellerVerified={product.sellerVerified}
                  location={product.location}
                  brand={product.brand}
                  condition={product.condition}
                  make={product.make}
                  model={product.model}
                  year={product.year}
                  tags={product.tags}
                  isBoosted={product.isBoosted}
                  showTagChips={true}
                  variant="marketplace"
                  index={index}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className={cn(
                    "px-8 py-3 rounded-lg font-medium text-sm transition-all",
                    "bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {locale === "bg" ? "Зареждане..." : "Loading..."}
                    </span>
                  ) : (
                    locale === "bg" ? "Зареди още" : "Load more"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

/**
 * Skeleton fallback for TabbedProductFeed
 */
export function TabbedProductFeedSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-80 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4 p-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
