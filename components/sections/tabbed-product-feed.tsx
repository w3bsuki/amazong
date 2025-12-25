"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { CaretRight, TrendUp, Tag, Sparkle, GridFour } from "@phosphor-icons/react"
import { ProductCard } from "@/components/shared/product/product-card"
import { Link } from "@/i18n/routing"
import { Skeleton } from "@/components/ui/skeleton"

type FeedTab = "all" | "newest" | "promoted" | "deals"

interface Product {
  id: string
  title: string
  price: number
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
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
  const [pageSize, setPageSize] = useState(12)

  // Keep the homepage module compact: target ~2 rows at each desktop breakpoint.
  // md=3 cols => 6 items, lg=4 => 8, xl=5 => 10, 2xl=7 => 14
  useEffect(() => {
    const computePageSize = () => {
      const w = window.innerWidth
      if (w >= 1536) return 14
      if (w >= 1280) return 10
      if (w >= 1024) return 8
      if (w >= 768) return 6
      return 4
    }

    const apply = () => setPageSize(computePageSize())
    apply()

    let t: ReturnType<typeof setTimeout> | null = null
    const onResize = () => {
      if (t) clearTimeout(t)
      t = setTimeout(apply, 150)
    }

    window.addEventListener("resize", onResize)
    return () => {
      if (t) clearTimeout(t)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const tabs: { id: FeedTab; label: string; icon: typeof GridFour }[] = [
    { id: "all", label: locale === "bg" ? "Всички" : "All", icon: GridFour },
    { id: "newest", label: locale === "bg" ? "Най-нови" : "Newest", icon: TrendUp },
    { id: "promoted", label: locale === "bg" ? "Промотирани" : "Promoted", icon: Sparkle },
    { id: "deals", label: locale === "bg" ? "Оферти" : "Deals", icon: Tag },
  ]

  const fetchProducts = useCallback(async (tab: FeedTab, pageNum: number, limit: number, append = false) => {
    setIsLoading(true)
    try {
      // Map tab to correct API endpoint
      const endpoint = tab === "promoted"
        ? "/api/products/promoted"
        : tab === "deals"
          ? "/api/products/deals"
          : "/api/products/newest"
      const url = `${endpoint}?page=${pageNum}&limit=${limit}`

      const res = await fetch(url)
      if (!res.ok) {
        return
      }

      let data: unknown = null
      try {
        data = await res.json()
      } catch {
        return
      }

      if (!data || typeof data !== 'object') {
        return
      }

      const productsRaw = (data as { products?: unknown }).products
      if (!Array.isArray(productsRaw)) {
        return
      }

      {
        const transformed: Product[] = (productsRaw as unknown[]).map((raw) => {
          const p = raw as Record<string, unknown>

          const image = (typeof p.image === 'string' && p.image.length > 0)
            ? (p.image as string)
            : (Array.isArray(p.images) && (p.images as unknown[]).some((x) => typeof x === 'string'))
              ? ((p.images as unknown[]).find((x): x is string => typeof x === 'string') ?? "/placeholder.svg")
              : "/placeholder.svg"

          const listPriceRaw = (p.listPrice ?? p.list_price) as unknown
          const listPrice = (typeof listPriceRaw === 'number')
            ? listPriceRaw
            : (typeof listPriceRaw === 'string')
              ? Number(listPriceRaw)
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

          const isOnSale = (typeof p.isOnSale === 'boolean')
            ? (p.isOnSale as boolean)
            : (typeof (p as { is_on_sale?: unknown }).is_on_sale === 'boolean')
              ? Boolean((p as { is_on_sale?: boolean }).is_on_sale)
              : undefined

          const salePercentRaw = (p.salePercent ?? (p as { sale_percent?: unknown }).sale_percent) as unknown
          const salePercent = (typeof salePercentRaw === 'number')
            ? salePercentRaw
            : (typeof salePercentRaw === 'string')
              ? Number(salePercentRaw)
              : undefined

          const saleEndDate = (typeof p.saleEndDate === 'string')
            ? (p.saleEndDate as string)
            : (typeof (p as { sale_end_date?: unknown }).sale_end_date === 'string')
              ? ((p as { sale_end_date?: string }).sale_end_date ?? null)
              : null

          return {
            id: p.id as string,
            title: p.title as string,
            price: typeof p.price === 'number' ? (p.price as number) : Number(p.price ?? 0),
            listPrice,
            isOnSale,
            salePercent,
            saleEndDate,
            image,
            rating: typeof p.rating === 'number' ? (p.rating as number) : undefined,
            reviews: typeof p.reviews === 'number'
              ? (p.reviews as number)
              : (typeof p.review_count === 'number' ? (p.review_count as number) : undefined),
            slug: (p.slug as string | null) ?? null,
            storeSlug,
            categorySlug,
            sellerId: typeof p.sellerId === 'string' ? (p.sellerId as string) : null,
            sellerName: typeof p.sellerName === 'string' ? (p.sellerName as string) : null,
            sellerAvatarUrl: typeof p.sellerAvatarUrl === 'string' ? (p.sellerAvatarUrl as string) : null,
            sellerTier: (p.sellerTier === 'basic' || p.sellerTier === 'premium' || p.sellerTier === 'business') 
              ? (p.sellerTier as 'basic' | 'premium' | 'business') 
              : undefined,
            sellerVerified: typeof p.sellerVerified === 'boolean' ? (p.sellerVerified as boolean) : undefined,
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

        const hasMoreRaw = (data as { hasMore?: unknown }).hasMore
        const hasMoreFromApi = typeof hasMoreRaw === 'boolean' ? hasMoreRaw : undefined

        if (append) {
          setProducts(prev => [...prev, ...transformed])
        } else {
          setProducts(transformed)
        }

        // Prefer API-provided pagination hint; fall back to heuristic.
        setHasMore(hasMoreFromApi ?? (transformed.length === limit))
      }
    } catch (error) {
      // Avoid console noise; UI can safely show empty state.
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    setPage(1)
    setProducts([])
    fetchProducts("newest", 1, pageSize, false)
  }, [pageSize, fetchProducts])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts("newest", nextPage, pageSize, true)
    }
  }

  return (
    <section 
      className="w-full"
      aria-label={locale === "bg" ? "Обяви" : "Listings"}
    >
      {/* Header - Simple Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {locale === "bg" ? "Най-нови обяви" : "New Arrivals"}
        </h2>

        {/* See All Link */}
        <Link
          href="/search?sort=newest"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <CaretRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>

      {/* Product Grid */}
      <div 
        role="list"
        aria-live="polite"
      >
        {products.length === 0 && isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4" aria-busy="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" role="status">
            <div className="text-4xl mb-4" aria-hidden="true">📦</div>
            <p className="text-lg">{locale === "bg" ? "Няма намерени обяви" : "No listings found"}</p>
          </div>
        ) : (
          <>
            {/* 
              Grid Layout - Clean, no cards
            */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
              {products.map((product, index) => (
                <div key={product.id} role="listitem">
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.listPrice}
                    isOnSale={product.isOnSale}
                    salePercent={product.salePercent}
                    saleEndDate={product.saleEndDate}
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
                    showPills={true}
                    index={index}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className={cn(
                    "px-8 py-3 rounded-full font-medium text-sm transition-all",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
