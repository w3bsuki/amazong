"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { CaretRight, TrendUp, GridFour, Fire, Percent } from "@phosphor-icons/react"
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
 * TabbedProductFeed - Desktop optimized product feed with discovery UX
 * Features:
 * - Category quick filters (horizontal scrollable pills)
 * - Feed type tabs (All/Newest/Promoted/Deals)
 * - Clean product grid with load more
 */
export function TabbedProductFeed({ locale }: TabbedProductFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>("all")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [pageSize, setPageSize] = useState(12)

  // Keep the homepage module compact
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

  const tabs: { id: FeedTab; label: string; icon: typeof GridFour; color?: string }[] = [
    { id: "all", label: locale === "bg" ? "Всички" : "All", icon: GridFour },
    { id: "newest", label: locale === "bg" ? "Най-нови" : "Newest", icon: TrendUp, color: "text-success" },
    { id: "promoted", label: locale === "bg" ? "Топ" : "Featured", icon: Fire, color: "text-warning" },
    { id: "deals", label: locale === "bg" ? "Оферти" : "Deals", icon: Percent, color: "text-destructive" },
  ]

  const fetchProducts = useCallback(async (tab: FeedTab, pageNum: number, limit: number, append = false, categorySlug?: string | null) => {
    setIsLoading(true)
    try {
      const endpoint = tab === "promoted"
        ? "/api/products/promoted"
        : tab === "deals"
          ? "/api/products/deals"
          : "/api/products/newest"
      
      const params = new URLSearchParams({ page: String(pageNum), limit: String(limit) })
      if (categorySlug) {
        params.set("category", categorySlug)
      }
      const url = `${endpoint}?${params.toString()}`

      const res = await fetch(url)
      if (!res.ok) return

      let data: unknown = null
      try { data = await res.json() } catch { return }
      if (!data || typeof data !== 'object') return

      const productsRaw = (data as { products?: unknown }).products
      if (!Array.isArray(productsRaw)) return

      const transformed: Product[] = (productsRaw as unknown[]).map((raw) => {
        const p = raw as Record<string, unknown>

        const image = (typeof p.image === 'string' && p.image.length > 0)
          ? (p.image as string)
          : (Array.isArray(p.images) && (p.images as unknown[]).some((x) => typeof x === 'string'))
            ? ((p.images as unknown[]).find((x): x is string => typeof x === 'string') ?? "/placeholder.svg")
            : "/placeholder.svg"

        const listPriceRaw = (p.listPrice ?? p.list_price) as unknown
        const listPrice = (typeof listPriceRaw === 'number') ? listPriceRaw : (typeof listPriceRaw === 'string') ? Number(listPriceRaw) : undefined

        const storeSlug = (typeof p.storeSlug === 'string') ? p.storeSlug : (typeof p.store_slug === 'string') ? p.store_slug : null
        const categorySlugVal = (typeof p.categorySlug === 'string') ? p.categorySlug : (typeof p.category_slug === 'string') ? p.category_slug : null
        const attributes = (p.attributes && typeof p.attributes === 'object' && !Array.isArray(p.attributes)) ? (p.attributes as Record<string, string>) : undefined

        const isOnSale = (typeof p.isOnSale === 'boolean') ? p.isOnSale : (typeof (p as { is_on_sale?: unknown }).is_on_sale === 'boolean') ? Boolean((p as { is_on_sale?: boolean }).is_on_sale) : undefined
        const salePercentRaw = (p.salePercent ?? (p as { sale_percent?: unknown }).sale_percent) as unknown
        const salePercent = (typeof salePercentRaw === 'number') ? salePercentRaw : (typeof salePercentRaw === 'string') ? Number(salePercentRaw) : undefined
        const saleEndDate = (typeof p.saleEndDate === 'string') ? p.saleEndDate : (typeof (p as { sale_end_date?: unknown }).sale_end_date === 'string') ? ((p as { sale_end_date?: string }).sale_end_date ?? null) : null

        return {
          id: p.id as string,
          title: p.title as string,
          price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
          listPrice, isOnSale, salePercent, saleEndDate, image,
          rating: typeof p.rating === 'number' ? p.rating : undefined,
          reviews: typeof p.reviews === 'number' ? p.reviews : (typeof p.review_count === 'number' ? p.review_count : undefined),
          slug: (p.slug as string | null) ?? null,
          storeSlug, categorySlug: categorySlugVal,
          sellerId: typeof p.sellerId === 'string' ? p.sellerId : null,
          sellerName: typeof p.sellerName === 'string' ? p.sellerName : null,
          sellerAvatarUrl: typeof p.sellerAvatarUrl === 'string' ? p.sellerAvatarUrl : null,
          sellerTier: (p.sellerTier === 'basic' || p.sellerTier === 'premium' || p.sellerTier === 'business') ? p.sellerTier : undefined,
          sellerVerified: typeof p.sellerVerified === 'boolean' ? p.sellerVerified : undefined,
          location: typeof p.location === 'string' ? p.location : undefined,
          condition: typeof p.condition === 'string' ? p.condition : undefined,
          brand: typeof p.brand === 'string' ? p.brand : undefined,
          make: typeof p.make === 'string' ? p.make : undefined,
          model: typeof p.model === 'string' ? p.model : undefined,
          year: typeof p.year === 'string' ? p.year : undefined,
          isBoosted: tab === 'promoted' || Boolean(p.isBoosted) || Boolean((p as { is_boosted?: boolean | null }).is_boosted),
          tags: Array.isArray(p.tags) ? (p.tags as unknown[]).filter((x): x is string => typeof x === 'string') : [],
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
      setHasMore(hasMoreFromApi ?? (transformed.length === limit))
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    setProducts([])
    fetchProducts(activeTab, 1, pageSize, false, activeCategory)
  }, [pageSize, fetchProducts, activeTab, activeCategory])

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab)
    setPage(1)
    setProducts([])
  }

  const handleCategoryChange = (slug: string | null) => {
    const newSlug = slug === "all" ? null : slug
    setActiveCategory(newSlug)
    setPage(1)
    setProducts([])
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(activeTab, nextPage, pageSize, true, activeCategory)
    }
  }

  return (
    <section className="w-full" aria-label={locale === "bg" ? "Обяви" : "Listings"}>
      {/* Section Header with Title + Tabs */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {locale === "bg" ? "Обяви" : "Listings"}
          </h2>
          <Link
            href={activeCategory ? `/categories/${activeCategory}` : "/search?sort=newest"}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {locale === "bg" ? "виж всички" : "see all"}
            <CaretRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {/* Feed Type Tabs */}
          <div className="flex items-center gap-1.5" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-muted-foreground/30"
                  )}
                >
                  <Icon size={14} weight={isActive ? "fill" : "regular"} className={cn(!isActive && tab.color)} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="mb-2">
            {/* Category filtering removed - use tab navigation instead */}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div role="list" aria-live="polite">
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
            {activeCategory && (
              <button onClick={() => handleCategoryChange(null)} className="mt-4 text-sm text-primary hover:underline">
                {locale === "bg" ? "Покажи всички категории" : "Show all categories"}
              </button>
            )}
          </div>
        ) : (
          <>
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

export function TabbedProductFeedSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full shrink-0" />
          ))}
        </div>
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
