"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { ProductCardList } from "@/components/shared/product/product-card-list"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useViewMode } from "@/hooks/use-view-mode"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import {
  SquaresFour,
  TrendUp,
  ChartLineUp,
  Eye,
  Star,
  Percent,
  GridFour,
  Fire,
  Tag,
  CaretDown,
  Rows,
  X,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// =============================================================================
// TYPES
// =============================================================================

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
  sellerTier?: "basic" | "premium" | "business"
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

interface UnifiedDesktopFeedProps {
  locale: string
  categories?: CategoryTreeNode[]
  initialTab?: FeedTab
  initialProducts?: Product[]
  initialHasMore?: boolean
}

// =============================================================================
// MAIN COMPONENT - Unified Desktop Layout (Experimental)
// =============================================================================

export function UnifiedDesktopFeed({
  locale,
  categories = [],
  initialTab = "newest",
  initialProducts = [],
  initialHasMore = true,
}: UnifiedDesktopFeedProps) {
  const t = useTranslations("TabbedProductFeed")

  // State
  const [activeTab, setActiveTab] = useState<FeedTab>(initialTab)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)

  // View mode (grid/list)
  const [viewMode, setViewMode] = useViewMode("grid")

  // Category counts
  const { counts: categoryCounts } = useCategoryCounts()

  const pageSize = 24
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track previous values for change detection
  const prevTabRef = useRef(activeTab)
  const prevCategoryRef = useRef(activeCategory)
  const initialFetchDone = useRef(initialProducts.length > 0)

  // URL sync for category
  const urlCategory = searchParams.get("category")
  useEffect(() => {
    setActiveCategory(urlCategory && urlCategory.length > 0 ? urlCategory : null)
  }, [urlCategory])

  const updateUrlCategory = useCallback(
    (category: string | null) => {
      const next = new URLSearchParams(searchParams.toString())
      if (category) next.set("category", category)
      else next.delete("category")

      const qs = next.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ""}#listings`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // Fetch products
  const fetchProducts = useCallback(
    async (
      tab: FeedTab,
      pageNum: number,
      limit: number,
      append = false,
      categorySlug?: string | null
    ) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          type: tab,
          page: String(pageNum),
          limit: String(limit),
        })

        if (categorySlug) {
          params.set("category", categorySlug)
        }

        const url = `/api/products/feed?${params.toString()}`
        const res = await fetch(url)
        if (!res.ok) return

        let data: unknown = null
        try {
          data = await res.json()
        } catch {
          return
        }
        if (!data || typeof data !== "object") return

        const productsRaw = (data as { products?: unknown }).products
        if (!Array.isArray(productsRaw)) return

        const transformed: Product[] = (productsRaw as unknown[]).map((raw) => {
          const p = raw as Record<string, unknown>

          const image =
            typeof p.image === "string" && p.image.length > 0
              ? (p.image as string)
              : Array.isArray(p.images) &&
                  (p.images as unknown[]).some((x) => typeof x === "string")
                ? ((p.images as unknown[]).find((x): x is string => typeof x === "string") ??
                    "/placeholder.svg")
                : "/placeholder.svg"

          const listPriceRaw = (p.listPrice ?? p.list_price) as unknown
          const listPrice =
            typeof listPriceRaw === "number"
              ? listPriceRaw
              : typeof listPriceRaw === "string"
                ? Number(listPriceRaw)
                : undefined

          const storeSlug =
            typeof p.storeSlug === "string"
              ? p.storeSlug
              : typeof p.store_slug === "string"
                ? p.store_slug
                : null

          const isOnSale =
            typeof p.isOnSale === "boolean"
              ? p.isOnSale
              : typeof (p as { is_on_sale?: unknown }).is_on_sale === "boolean"
                ? Boolean((p as { is_on_sale?: boolean }).is_on_sale)
                : undefined

          const salePercentRaw = (p.salePercent ?? (p as { sale_percent?: unknown }).sale_percent) as unknown
          const salePercent =
            typeof salePercentRaw === "number"
              ? salePercentRaw
              : typeof salePercentRaw === "string"
                ? Number(salePercentRaw)
                : undefined

          const saleEndDate =
            typeof p.saleEndDate === "string"
              ? p.saleEndDate
              : typeof (p as { sale_end_date?: unknown }).sale_end_date === "string"
                ? ((p as { sale_end_date?: string }).sale_end_date ?? null)
                : null

          const createdAt =
            typeof p.createdAt === "string"
              ? p.createdAt
              : typeof (p as { created_at?: unknown }).created_at === "string"
                ? ((p as { created_at?: string }).created_at ?? null)
                : null

          return {
            id: p.id as string,
            title: p.title as string,
            price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
            saleEndDate,
            image,
            slug: (p.slug as string | null) ?? null,
            storeSlug,
            sellerId: typeof p.sellerId === "string" ? p.sellerId : null,
            sellerName: typeof p.sellerName === "string" ? p.sellerName : null,
            sellerAvatarUrl: typeof p.sellerAvatarUrl === "string" ? p.sellerAvatarUrl : null,
            isBoosted: Boolean(p.isBoosted) || Boolean((p as { is_boosted?: boolean | null }).is_boosted),
            tags: Array.isArray(p.tags) ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string") : [],
            ...(createdAt ? { createdAt } : {}),
            ...(listPrice !== undefined ? { listPrice } : {}),
            ...(isOnSale !== undefined ? { isOnSale } : {}),
            ...(salePercent !== undefined ? { salePercent } : {}),
            ...(typeof p.rating === "number" ? { rating: p.rating } : {}),
            ...(typeof p.reviews === "number" ? { reviews: p.reviews } : {}),
            ...(typeof p.location === "string" ? { location: p.location } : {}),
            ...(typeof p.condition === "string" ? { condition: p.condition } : {}),
          }
        })

        const hasMoreRaw = (data as { hasMore?: unknown }).hasMore
        const hasMoreFromApi = typeof hasMoreRaw === "boolean" ? hasMoreRaw : undefined

        if (append) {
          setProducts((prev) => [...prev, ...transformed])
        } else {
          setProducts(transformed)
        }
        setHasMore(hasMoreFromApi ?? transformed.length === limit)
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Effect to fetch on tab/category change
  useEffect(() => {
    const tabChanged = prevTabRef.current !== activeTab
    const categoryChanged = prevCategoryRef.current !== activeCategory

    prevTabRef.current = activeTab
    prevCategoryRef.current = activeCategory

    const needsInitialFetch = !initialFetchDone.current

    if (needsInitialFetch) {
      initialFetchDone.current = true
      fetchProducts(activeTab, 1, pageSize, false, activeCategory)
      return
    }

    if (tabChanged || categoryChanged) {
      setPage(1)
      fetchProducts(activeTab, 1, pageSize, false, activeCategory)
    }
  }, [fetchProducts, activeTab, activeCategory])

  // Handlers
  const handleTabChange = (tab: FeedTab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setPage(1)
  }

  const handleCategoryChange = (slug: string | null) => {
    const newSlug = slug === "all" ? null : slug
    if (newSlug === activeCategory) return
    setActiveCategory(newSlug)
    updateUrlCategory(newSlug)
    setPage(1)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(activeTab, nextPage, pageSize, true, activeCategory)
    }
  }

  // Get active category name
  const activeCategoryObj = activeCategory ? categories.find((c) => c.slug === activeCategory) : null
  const activeCategoryName = activeCategoryObj ? getCategoryName(activeCategoryObj, locale) : null

  // Product count
  const productCount = products.length

  return (
    <section id="listings" className="w-full" aria-label={t("sectionAriaLabel")}>
      {/* UNIFIED LAYOUT - Container width, inline styling */}
      <div className="container py-4">
        <div className="flex gap-4">
          {/* LEFT SIDEBAR - Categories + Filters (darker bg to stand out) */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0 space-y-3">
            {/* Categories Card - no title, self-explanatory */}
            <div className="rounded-lg border border-border bg-muted/40">
              <nav className="p-1.5 max-h-[400px] overflow-y-auto">
                {/* All */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange(null)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition-all text-left",
                    !activeCategory
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  <SquaresFour size={18} weight={!activeCategory ? "fill" : "regular"} />
                  <span className="flex-1">{locale === "bg" ? "Всички" : "All"}</span>
                  <span className="text-xs tabular-nums opacity-60">
                    {Object.values(categoryCounts).reduce((a, b) => a + b, 0) || "—"}
                  </span>
                </button>

                {/* Category list */}
                {categories
                  .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
                  .map((cat) => {
                    const isActive = activeCategory === cat.slug
                    const count = categoryCounts[cat.slug]
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition-all text-left",
                          isActive
                            ? "bg-foreground text-background font-medium"
                            : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                        )}
                      >
                        <span className={isActive ? "text-background" : "text-muted-foreground"}>
                          {getCategoryIcon(cat.slug, { size: 20, weight: isActive ? "fill" : "regular" })}
                        </span>
                        <span className="flex-1 truncate">{getCategoryName(cat, locale)}</span>
                        {typeof count === "number" && (
                          <span className="text-xs tabular-nums opacity-60">{count}</span>
                        )}
                      </button>
                    )
                  })}
              </nav>
            </div>

            {/* Filters Card - darker bg */}
            <div className="rounded-lg border border-border bg-muted/40">
              <div className="px-3 py-2 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === "bg" ? "Филтри" : "Filters"}
                </h3>
              </div>
              <div className="p-3 space-y-3">
                {/* Price Range */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {locale === "bg" ? "Цена" : "Price"}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={locale === "bg" ? "Мин" : "Min"}
                      className="h-8 text-sm bg-background"
                    />
                    <span className="text-muted-foreground text-xs">–</span>
                    <Input
                      type="number"
                      placeholder={locale === "bg" ? "Макс" : "Max"}
                      className="h-8 text-sm bg-background"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {locale === "bg" ? "Състояние" : "Condition"}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: "new", label: locale === "bg" ? "Ново" : "New" },
                      { id: "like_new", label: locale === "bg" ? "Като ново" : "Like new" },
                      { id: "used", label: locale === "bg" ? "Използвано" : "Used" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="px-2.5 py-1 text-xs rounded-full border border-border bg-background hover:bg-muted/50 transition-colors"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply button */}
                <Button size="sm" className="w-full h-8 text-xs">
                  {locale === "bg" ? "Приложи" : "Apply"}
                </Button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Search + Toolbar Row */}
            <div className="flex items-center gap-3 mb-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass
                  size={18}
                  weight="regular"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="search"
                  placeholder={locale === "bg" ? "Търси в обяви..." : "Search listings..."}
                  className="pl-9 h-9 bg-card"
                />
              </div>

              {/* Active category pill */}
              {activeCategoryName && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground text-background text-sm font-medium">
                  <span>{activeCategoryName}</span>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(null)}
                    className="hover:opacity-70"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              )}

              {/* Results count */}
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {productCount.toLocaleString()} {locale === "bg" ? "обяви" : "listings"}
              </span>

              {/* Sort Dropdown */}
              <CompactSortTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                locale={locale}
              />

              {/* View Toggle */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-muted/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "size-7 rounded",
                    viewMode === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                  )}
                  aria-label="Grid view"
                >
                  <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "size-7 rounded",
                    viewMode === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                  )}
                  aria-label="List view"
                >
                  <Rows size={16} weight={viewMode === "list" ? "fill" : "regular"} />
                </Button>
              </div>
            </div>

            {/* Product Grid - lighter bg */}
            <div className="rounded-lg border border-border bg-card p-4">
            <div role="list" aria-live="polite">
              {products.length === 0 && isLoading ? (
                <ProductGridSkeleton viewMode={viewMode} />
              ) : products.length === 0 ? (
                <EmptyStateCTA
                  variant={activeCategory ? "no-category" : "no-listings"}
                  {...(activeCategory ? { categoryName: activeCategory } : {})}
                />
              ) : (
                <>
                  <div
                    className={cn(
                      viewMode === "list"
                        ? "flex flex-col gap-3"
                        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                    )}
                  >
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
                        ) : (
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
                            sellerName={(product.sellerName ?? product.storeSlug) || undefined}
                            sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                            sellerVerified={Boolean(product.sellerVerified)}
                            {...(product.location ? { location: product.location } : {})}
                            {...(product.condition ? { condition: product.condition } : {})}
                            tags={product.tags ?? []}
                            state={product.isBoosted ? "promoted" : undefined}
                            index={index}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-8 text-center">
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
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// COMPACT SORT TABS
// =============================================================================

function CompactSortTabs({
  activeTab,
  onTabChange,
  locale,
}: {
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  locale: string
}) {
  const t = useTranslations("TabbedProductFeed")

  const tabs: { id: FeedTab; label: string; icon: typeof GridFour }[] = [
    { id: "newest", label: t("tabs.newest"), icon: TrendUp },
    { id: "best_sellers", label: t("tabs.best_sellers"), icon: ChartLineUp },
    { id: "most_viewed", label: t("tabs.most_viewed"), icon: Eye },
    { id: "top_rated", label: t("tabs.top_rated"), icon: Star },
    { id: "deals", label: t("tabs.deals"), icon: Percent },
    { id: "promoted", label: t("tabs.promoted"), icon: Fire },
    { id: "price_low", label: t("tabs.price_low"), icon: Tag },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]!
  const ActiveIcon = activeTabData.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 h-8",
            "text-sm font-medium whitespace-nowrap transition-colors border",
            "bg-background text-foreground border-border hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <ActiveIcon size={14} weight="fill" />
          <span>{activeTabData.label}</span>
          <CaretDown size={12} weight="bold" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <DropdownMenuItem
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isActive && "bg-muted font-medium"
              )}
            >
              <Icon size={14} weight={isActive ? "fill" : "regular"} />
              {tab.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// SKELETONS
// =============================================================================

function ProductGridSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  return (
    <div
      className={cn(
        viewMode === "list"
          ? "flex flex-col gap-3"
          : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
      )}
      aria-busy="true"
    >
      {Array.from({ length: 18 }).map((_, i) =>
        viewMode === "list" ? (
          <div key={i} className="flex gap-4 rounded-md border border-border p-3 bg-card">
            <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-24 mt-auto" />
            </div>
          </div>
        ) : (
          <div key={i} className="space-y-3 bg-card rounded-lg p-2">
            <Skeleton className="aspect-square w-full rounded-md" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        )
      )}
    </div>
  )
}

export function UnifiedDesktopFeedSkeleton() {
  return (
    <div className="container py-4">
      <div className="flex gap-4">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 space-y-3">
          {/* Categories - no title */}
          <div className="rounded-lg border border-border bg-muted/40 p-1.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md mb-1" />
            ))}
          </div>
          {/* Filters */}
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <Skeleton className="h-5 w-16 mb-2" />
            <Skeleton className="h-8 w-full rounded-md mb-2" />
            <div className="flex gap-1">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </aside>

        {/* Main content skeleton */}
        <div className="flex-1 min-w-0">
          {/* Toolbar with search */}
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-9 w-64 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <div className="flex-1" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>

          {/* Products */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
