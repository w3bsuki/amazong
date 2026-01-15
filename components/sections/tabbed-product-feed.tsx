"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { TrendUp, GridFour, Fire, Percent, Star, Tag, MapPin, ChartLineUp, Eye, CaretRight } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { ProductCard } from "@/components/shared/product/product-card"
import { ProductCardList } from "@/components/shared/product/product-card-list"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useViewMode } from "@/hooks/use-view-mode"
import { ViewModeToggle } from "@/components/shared/filters/view-mode-toggle"
import type { CategoryTreeNode } from "@/lib/category-tree"

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
  createdAt?: string | null
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
  sellerEmailVerified?: boolean
  sellerPhoneVerified?: boolean
  sellerIdVerified?: boolean
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
  /** Categories (L0 + L1 recommended) for desktop browse tabs */
  categories?: CategoryTreeNode[]
  /** Initial tab for the sort/feed selector */
  initialTab?: FeedTab
  /** Initial products fetched server-side to avoid client waterfall */
  initialProducts?: Product[]
  /** Whether more products are available after initial load */
  initialHasMore?: boolean
  /** Optional hero/banner content to show at top of discovery card */
  children?: React.ReactNode
}

/**
 * TabbedProductFeed - Desktop optimized product feed with discovery UX
 * Features:
 * - Server-side initial data (no client fetch on first load)
 * - Category quick filters (horizontal scrollable pills)
 * - Feed type tabs (All/Newest/Promoted/Deals)
 * - Clean product grid with load more (client-side pagination)
 */
export function TabbedProductFeed({
  locale: _locale,
  categories = [],
  initialTab = "newest",
  initialProducts = [],
  initialHasMore = true,
  children,
}: TabbedProductFeedProps) {
  const t = useTranslations("TabbedProductFeed")
  const [activeTab, setActiveTab] = useState<FeedTab>(initialTab)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  // State for expanded L0 category (OLX-style: click circle to show L1 subcategories)
  const [expandedL0, setExpandedL0] = useState<string | null>(null)
  // Initialize with server-side data to avoid loading state flash
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false) // Start false since we have initial data
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)

  // View mode persistence (grid vs list)
  const [viewMode, setViewMode] = useViewMode("grid")

  // Category counts for abundance display
  const { counts: categoryCounts } = useCategoryCounts()

  const pageSize = 24

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

  const tabs: { id: FeedTab; label: string; icon: typeof GridFour; color?: string }[] = [
    { id: "all", label: t("tabs.all"), icon: GridFour },
    { id: "newest", label: t("tabs.newest"), icon: TrendUp, color: "text-success" },
    { id: "best_sellers", label: t("tabs.best_sellers"), icon: ChartLineUp, color: "text-primary" },
    { id: "most_viewed", label: t("tabs.most_viewed"), icon: Eye, color: "text-info" },
    { id: "top_rated", label: t("tabs.top_rated"), icon: Star, color: "text-warning" },
    { id: "promoted", label: t("tabs.promoted"), icon: Fire, color: "text-warning" },
    { id: "deals", label: t("tabs.deals"), icon: Percent, color: "text-destructive" },
    { id: "price_low", label: t("tabs.price_low"), icon: Tag, color: "text-info" },
    { id: "nearby", label: t("tabs.nearby"), icon: MapPin, color: "text-info" },
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

        const rating = typeof p.rating === 'number' ? p.rating : undefined
        const reviews = typeof p.reviews === 'number' ? p.reviews : (typeof p.review_count === 'number' ? p.review_count : undefined)
        const sellerTier = (p.sellerTier === 'basic' || p.sellerTier === 'premium' || p.sellerTier === 'business') ? p.sellerTier : undefined
        const sellerVerified = typeof p.sellerVerified === 'boolean' ? p.sellerVerified : undefined
        const location = typeof p.location === 'string' ? p.location : undefined
        const condition = typeof p.condition === 'string' ? p.condition : undefined
        const brand = typeof p.brand === 'string' ? p.brand : undefined
        const make = typeof p.make === 'string' ? p.make : undefined
        const model = typeof p.model === 'string' ? p.model : undefined
        const year = typeof p.year === 'string' ? p.year : undefined
        const createdAt = (typeof p.createdAt === 'string') ? p.createdAt : (typeof (p as { created_at?: unknown }).created_at === 'string') ? ((p as { created_at?: string }).created_at ?? null) : null

        const base: Product = {
          id: p.id as string,
          title: p.title as string,
          price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
          saleEndDate,
          image,
          slug: (p.slug as string | null) ?? null,
          storeSlug,
          categorySlug: categorySlugVal,
          sellerId: typeof p.sellerId === 'string' ? p.sellerId : null,
          sellerName: typeof p.sellerName === 'string' ? p.sellerName : null,
          sellerAvatarUrl: typeof p.sellerAvatarUrl === 'string' ? p.sellerAvatarUrl : null,
          // Rely only on API-computed boost status (is_boosted && boost_expires_at > now)
          isBoosted: Boolean(p.isBoosted) || Boolean((p as { is_boosted?: boolean | null }).is_boosted),
          tags: Array.isArray(p.tags) ? (p.tags as unknown[]).filter((x): x is string => typeof x === 'string') : [],
        }

        return {
          ...base,
          ...(createdAt ? { createdAt } : {}),
          ...(listPrice !== undefined ? { listPrice } : {}),
          ...(isOnSale !== undefined ? { isOnSale } : {}),
          ...(salePercent !== undefined ? { salePercent } : {}),
          ...(rating !== undefined ? { rating } : {}),
          ...(reviews !== undefined ? { reviews } : {}),
          ...(sellerTier !== undefined ? { sellerTier } : {}),
          ...(sellerVerified !== undefined ? { sellerVerified } : {}),
          ...(location ? { location } : {}),
          ...(condition ? { condition } : {}),
          ...(brand ? { brand } : {}),
          ...(make ? { make } : {}),
          ...(model ? { model } : {}),
          ...(year ? { year } : {}),
          ...(attributes ? { attributes } : {}),
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

  // Track previous values to detect actual changes - prevents infinite loops
  const prevTabRef = useRef(activeTab)
  const prevCategoryRef = useRef(activeCategory)
  // Mark as done if we have server-side initial data for "all" tab
  const initialFetchDone = useRef(initialProducts.length > 0)

  useEffect(() => {
    const tabChanged = prevTabRef.current !== activeTab
    const categoryChanged = prevCategoryRef.current !== activeCategory

    prevTabRef.current = activeTab
    prevCategoryRef.current = activeCategory

    // Need initial fetch if no server-side data was provided
    const needsInitialFetch = !initialFetchDone.current

    if (needsInitialFetch) {
      initialFetchDone.current = true
      fetchProducts(activeTab, 1, pageSize, false, activeCategory)
      return
    }

    // Only reset page and fetch when tab or category actually changed
    if (tabChanged || categoryChanged) {
      setPage(1)
      fetchProducts(activeTab, 1, pageSize, false, activeCategory)
    }
  }, [fetchProducts, activeTab, activeCategory])

  const handleTabChange = (tab: FeedTab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setPage(1)
  }

  const handleCategoryChange = (slug: string | null) => {
    const newSlug = slug === "all" ? null : slug
    if (newSlug === activeCategory) return // Prevent redundant updates
    setActiveCategory(newSlug)
    updateUrlCategory(newSlug)
    setPage(1)
    // Don't setProducts([]) - causes flash
  }

  // Handle L0 circle click: toggle subcategory expansion (OLX-style)
  const handleCircleClick = (slug: string | null) => {
    if (slug === null) {
      // "All" clicked - collapse any expanded L0 and clear category filter
      setExpandedL0(null)
      handleCategoryChange(null)
    } else if (expandedL0 === slug) {
      // Same L0 clicked again - collapse it
      setExpandedL0(null)
    } else {
      // Different L0 clicked - expand it (don't filter yet, let user pick L1 or "View all")
      setExpandedL0(slug)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(activeTab, nextPage, pageSize, true, activeCategory)
    }
  }

  const topCategories = categories
    .slice()
    .sort((a, b) => {
      const ao = a.display_order ?? 9999
      const bo = b.display_order ?? 9999
      if (ao !== bo) return ao - bo
      return getCategoryName(a, _locale).localeCompare(getCategoryName(b, _locale))
    })

  // L0 categories displayed in the grid (13 + "All" = 14 total)
  const railL0 = topCategories.slice(0, 13)

  // Get expanded L0 category data for OLX-style subcategory display
  const expandedL0Data = expandedL0 ? topCategories.find((c) => c.slug === expandedL0) : null

  // Scroll ref for category rail
  const categoryRailRef = useRef<HTMLDivElement>(null)

  return (
    <section id="listings" className="w-full" aria-label={t("sectionAriaLabel")}>
      {/* Discovery Card - Hero + Categories */}
      <div className="mb-5 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Hero Banner Slot */}
        {children && (
          <div className="border-b border-border/50 px-5 py-4">
            {children}
          </div>
        )}

        {/* Category Circles - Responsive grid that fits screen width naturally */}
        {railL0.length > 0 && (
          <div className="px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">{t("browseCategories")}</h2>
              <Link
                href="/categories"
                className="text-sm font-medium text-primary hover:underline underline-offset-2"
              >
                {t("categories.all")}
              </Link>
            </div>
            {/* Responsive grid: auto-fit circles */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-x-2 gap-y-3 justify-items-center">
              {/* "All" circle */}
              <CategoryCircle
                category={{ slug: "all" }}
                label={t("categories.all")}
                active={!expandedL0 && !activeCategory}
                onClick={() => handleCircleClick(null)}
                circleClassName="size-20"
                fallbackIconSize={32}
                fallbackIconWeight="regular"
                variant="muted"
                className="w-full max-w-22"
                labelClassName={cn(
                  "w-full text-center text-xs font-medium leading-tight line-clamp-2 mt-1.5",
                  !expandedL0 && !activeCategory ? "text-foreground" : "text-muted-foreground"
                )}
              />

              {/* Category circles */}
              {railL0.map((cat) => {
                const label = getCategoryName(cat, _locale)
                const isExpanded = expandedL0 === cat.slug
                const count = categoryCounts[cat.slug]
                return (
                  <CategoryCircle
                    key={cat.slug}
                    category={cat}
                    label={label}
                    active={isExpanded}
                    onClick={() => handleCircleClick(cat.slug)}
                    circleClassName="size-20"
                    fallbackIconSize={32}
                    fallbackIconWeight="regular"
                    variant="colorful"
                    count={count}
                    className="w-full max-w-22"
                    labelClassName={cn(
                      "w-full text-center text-xs font-medium leading-tight line-clamp-2 mt-1.5",
                      isExpanded ? "text-foreground" : "text-muted-foreground"
                    )}
                  />
                )
              })}
            </div>

            {/* Subcategory Pills - inside discovery card, right below circles for better UX */}
            {expandedL0Data && expandedL0Data.children && expandedL0Data.children.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/categories/${expandedL0Data.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>
                      {_locale === "bg"
                        ? `Виж всички в ${getCategoryName(expandedL0Data, _locale)}`
                        : `View all in ${getCategoryName(expandedL0Data, _locale)}`}
                    </span>
                    <CaretRight className="size-4" weight="bold" />
                  </Link>
                  {expandedL0Data.children.map((l1) => (
                    <Link
                      key={l1.slug}
                      href={`/categories/${l1.slug}`}
                      className="inline-flex items-center rounded-full border border-border/80 bg-background px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted/60 hover:border-foreground/20 transition-colors"
                    >
                      {getCategoryName(l1, _locale)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Filter Pills + View Mode Toggle */}
      <div className="mb-5 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2.5 pr-10 lg:pr-16">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                      "border",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-background text-muted-foreground border-border/80 hover:bg-muted/60 hover:text-foreground hover:border-foreground/20"
                    )}
                  >
                    <Icon size={16} weight={isActive ? "fill" : "regular"} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
          {/* View Mode Toggle - Desktop only */}
          <div className="hidden lg:flex items-center shrink-0 pl-4 border-l border-border/50">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      <div role="list" aria-live="polite">
        {products.length === 0 && isLoading ? (
          <div className={cn(
            viewMode === "list"
              ? "flex flex-col gap-3"
              : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2"
          )} aria-busy="true">
            {Array.from({ length: 12 }).map((_, i) => (
              viewMode === "list" ? (
                <div key={i} className="flex gap-4 rounded-lg border border-border p-3">
                  <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-24 mt-auto" />
                  </div>
                </div>
              ) : (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-3/4 w-full rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              )
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyStateCTA
            variant={activeCategory ? "no-category" : "no-listings"}
            {...(activeCategory ? { categoryName: activeCategory } : {})}
          />
        ) : (
          <>
            <div className={cn(
              viewMode === "list"
                ? "flex flex-col gap-3"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-6"
            )}>
              {products.map((product, index) => (
                <div key={product.id} role="listitem">
                  {viewMode === "list" ? (
                    <ProductCardList
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.listPrice ?? null}
                      image={product.image}
                      createdAt={product.createdAt ?? null}
                      slug={product.slug ?? null}
                      username={product.storeSlug ?? null}
                      sellerId={product.sellerId ?? null}
                      sellerName={product.sellerName || product.storeSlug || undefined}
                      sellerVerified={Boolean(product.sellerVerified)}
                      location={product.location}
                      condition={product.condition}
                      freeShipping={false}
                    />
                  ) : (() => {
                    const resolvedSellerName = product.sellerName ?? product.storeSlug ?? undefined
                    return (
                      <ProductCard
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        originalPrice={product.listPrice ?? null}
                        isOnSale={Boolean(product.isOnSale)}
                        salePercent={product.salePercent ?? 0}
                        saleEndDate={product.saleEndDate ?? null}
                        createdAt={product.createdAt ?? null}
                        image={product.image}
                        rating={product.rating ?? 0}
                        reviews={product.reviews ?? 0}
                        slug={product.slug ?? null}
                        username={product.storeSlug ?? null}
                        sellerId={product.sellerId ?? null}
                        {...(resolvedSellerName ? { sellerName: resolvedSellerName } : {})}
                        sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                        {...(product.sellerTier ? { sellerTier: product.sellerTier } : {})}
                        sellerVerified={Boolean(product.sellerVerified)}
                        sellerEmailVerified={Boolean(product.sellerEmailVerified)}
                        sellerPhoneVerified={Boolean(product.sellerPhoneVerified)}
                        sellerIdVerified={Boolean(product.sellerIdVerified)}
                      {...(product.location ? { location: product.location } : {})}
                      {...(product.brand ? { brand: product.brand } : {})}
                      {...(product.condition ? { condition: product.condition } : {})}
                      {...(product.make ? { make: product.make } : {})}
                      {...(product.model ? { model: product.model } : {})}
                      {...(product.year ? { year: product.year } : {})}
                      tags={product.tags ?? []}
                      state={product.isBoosted ? "promoted" : undefined}
                      index={index}
                    />
                    )
                  })()}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <Button onClick={loadMore} disabled={isLoading} size="lg" className="min-w-36">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      {t("loading")}
                    </span>
                  ) : (
                    t("loadMore")
                  )}
                </Button>
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
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
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
