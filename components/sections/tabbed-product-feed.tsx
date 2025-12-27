"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { CaretRight, TrendUp, GridFour, Fire, Percent, Star, Tag, MapPin, ChartLineUp, Eye } from "@phosphor-icons/react"
import { ProductCard } from "@/components/shared/product/product-card"
import { Link } from "@/i18n/routing"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FeedTab =
  | "all"
  | "newest"
  | "promoted"
  | "deals"
  | "top_rated"
  | "best_sellers"
  | "most_viewed"
  | "price_low"
  | "nearby"

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

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL-driven category selection: /?category=slug
  const urlCategory = searchParams.get("category")
  useEffect(() => {
    setActiveCategory(urlCategory && urlCategory.length > 0 ? urlCategory : null)
  }, [urlCategory])

  const updateUrlCategory = useCallback((category: string | null) => {
    const next = new URLSearchParams(searchParams.toString())
    if (category) next.set("category", category)
    else next.delete("category")

    const qs = next.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ""}#listings`, { scroll: false })
  }, [pathname, router, searchParams])

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
    { id: "best_sellers", label: locale === "bg" ? "Най-продавани" : "Best Sellers", icon: ChartLineUp, color: "text-primary" },
    { id: "most_viewed", label: locale === "bg" ? "Най-разглеждани" : "Most Viewed", icon: Eye, color: "text-info" },
    { id: "top_rated", label: locale === "bg" ? "Топ оценени" : "Top Rated", icon: Star, color: "text-warning" },
    { id: "promoted", label: locale === "bg" ? "Промотирани" : "Promoted", icon: Fire, color: "text-warning" },
    { id: "deals", label: locale === "bg" ? "Оферти" : "Deals", icon: Percent, color: "text-destructive" },
    { id: "price_low", label: locale === "bg" ? "Най-ниска цена" : "Lowest Price", icon: Tag, color: "text-info" },
    { id: "nearby", label: locale === "bg" ? "Близо до мен" : "Near Me", icon: MapPin, color: "text-info" },
  ]

  const fetchProducts = useCallback(async (tab: FeedTab, pageNum: number, limit: number, append = false, categorySlug?: string | null) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ 
        type: tab,
        page: String(pageNum), 
        limit: String(limit) 
      })
      
      if (categorySlug) {
        params.set("category", categorySlug)
      }

      // For "Near Me", we'd ideally get the city from a cookie or profile
      // For now, we'll let the API handle it or use a default if we had one
      // const city = getCookie('user-city')
      // if (city) params.set("city", city)

      const url = `/api/products/feed?${params.toString()}`

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
    updateUrlCategory(newSlug)
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
    <section id="listings" className="w-full" aria-label={locale === "bg" ? "Обяви" : "Listings"}>
      {/* Unified Navigation Row - Professional Nav Pills */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <Tabs
            value={activeTab}
            onValueChange={(next) => handleTabChange(next as FeedTab)}
            className="w-full"
          >
            <div className="relative">
              <div className="overflow-x-auto no-scrollbar pb-1">
                <TabsList
                  aria-label={locale === "bg" ? "Филтър на обявите" : "Listings filter"}
                  className="h-auto w-max min-w-full justify-start gap-1 rounded-full border border-border bg-muted/30 p-1 md:w-full md:justify-center"
                >
                  {tabs.map((tab) => {
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                          "h-touch-sm flex-none rounded-full border-none px-4 text-sm md:text-base font-semibold",
                          "text-muted-foreground hover:text-foreground hover:bg-background/50",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "md:flex-1 md:justify-center"
                        )}
                      >
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>
            </div>

            {/* Keep a real tabpanel in the DOM for a11y without duplicating content */}
            <TabsContent value={activeTab} className="mt-0">
              {/* Product Grid */}
              <div role="list" aria-live="polite">
                {products.length === 0 && isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4" aria-busy="true">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="aspect-3/4 w-full rounded-lg" />
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export function TabbedProductFeedSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
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
