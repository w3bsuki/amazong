"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
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
import type { User } from "@supabase/supabase-js"
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
  MagnifyingGlass,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sidebar components
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MarketplaceSidebar, type CategoryPath } from "./marketplace-sidebar"

// Other components
import { DesktopBreadcrumbRow } from "./desktop-breadcrumb-row"
import { DesktopQuickPills } from "./desktop-quick-pills"
import { DesktopFiltersCard, type FilterState } from "./desktop-filters-card"

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

interface UnifiedDesktopFeedV3Props {
  locale: string
  user: User | null
  categories?: CategoryTreeNode[]
  initialTab?: FeedTab
  initialProducts?: Product[]
  initialHasMore?: boolean
}

// =============================================================================
// MAIN COMPONENT - Unified Desktop Layout V3 with Sidebar
// =============================================================================

export function UnifiedDesktopFeedV3({
  locale,
  user,
  categories = [],
  initialTab = "newest",
  initialProducts = [],
  initialHasMore = true,
}: UnifiedDesktopFeedV3Props) {
  const t = useTranslations("TabbedProductFeed")

  // State
  const [activeTab, setActiveTab] = useState<FeedTab>(initialTab)
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([])
  const [selectedL3Slug, setSelectedL3Slug] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [searchQuery, setSearchQuery] = useState("")

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    priceMin: "",
    priceMax: "",
    condition: null,
  })

  // View mode (grid/list)
  const [viewMode, setViewMode] = useViewMode("grid")

  // Category counts
  const { counts: categoryCounts } = useCategoryCounts()

  const pageSize = 24
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track previous values
  const prevTabRef = useRef(activeTab)
  const prevCategoryRef = useRef<string | null>(null)
  const initialFetchDone = useRef(initialProducts.length > 0)

  // Get the deepest selected category slug for API calls
  const activeCategorySlug = useMemo(() => {
    if (selectedL3Slug) return selectedL3Slug
    if (categoryPath.length > 0) return categoryPath[categoryPath.length - 1]?.slug ?? null
    return null
  }, [categoryPath, selectedL3Slug])

  // Get L3 children for quick pills (when at L2 level)
  const l3Subcategories = useMemo(() => {
    if (categoryPath.length < 2) return []
    
    const l0Slug = categoryPath[0]?.slug
    const l1Slug = categoryPath[1]?.slug
    const l2Slug = categoryPath[2]?.slug
    
    const l0 = categories.find((c) => c.slug === l0Slug)
    if (!l0?.children) return []
    
    const l1 = l0.children.find((c) => c.slug === l1Slug)
    if (!l1?.children) return []
    
    if (l2Slug) {
      const l2 = l1.children.find((c) => c.slug === l2Slug)
      return l2?.children ?? []
    }
    
    return l1.children
  }, [categories, categoryPath])

  const updateUrl = useCallback(
    (categorySlug: string | null) => {
      const next = new URLSearchParams(searchParams.toString())
      if (categorySlug) {
        next.set("category", categorySlug)
      } else {
        next.delete("category")
      }

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
    const categoryChanged = prevCategoryRef.current !== activeCategorySlug

    prevTabRef.current = activeTab
    prevCategoryRef.current = activeCategorySlug

    const needsInitialFetch = !initialFetchDone.current

    if (needsInitialFetch) {
      initialFetchDone.current = true
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
      return
    }

    if (tabChanged || categoryChanged) {
      setPage(1)
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
    }
  }, [fetchProducts, activeTab, activeCategorySlug])

  // Handlers
  const handleTabChange = (tab: FeedTab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setPage(1)
  }

  const handleCategorySelect = (path: CategoryPath[], _category: CategoryTreeNode | null) => {
    setCategoryPath(path)
    setSelectedL3Slug(null)
    setPage(1)
    
    const deepestSlug = path.length > 0 ? path[path.length - 1]?.slug ?? null : null
    updateUrl(deepestSlug)
  }

  const handleBreadcrumbNavigate = (depth: number) => {
    if (depth === 0) {
      setCategoryPath([])
      setSelectedL3Slug(null)
      updateUrl(null)
    } else {
      const newPath = categoryPath.slice(0, depth)
      setCategoryPath(newPath)
      setSelectedL3Slug(null)
      updateUrl(newPath[newPath.length - 1]?.slug ?? null)
    }
    setPage(1)
  }

  const handleBreadcrumbClear = () => {
    setCategoryPath([])
    setSelectedL3Slug(null)
    updateUrl(null)
    setPage(1)
  }

  const handleQuickPillSelect = (slug: string | null) => {
    setSelectedL3Slug(slug)
    setPage(1)
    
    if (slug) {
      updateUrl(slug)
    } else {
      const deepestSlug = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1]?.slug ?? null : null
      updateUrl(deepestSlug)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(activeTab, nextPage, pageSize, true, activeCategorySlug)
    }
  }

  // Product count
  const productCount = products.length

  return (
    <SidebarProvider defaultOpen={true}>
      <MarketplaceSidebar
        user={user}
        categories={categories}
        selectedPath={categoryPath}
        onCategorySelect={handleCategorySelect}
        categoryCounts={categoryCounts}
      />
      <SidebarInset>
        <section id="listings" className="w-full min-h-screen bg-muted/30" aria-label={t("sectionAriaLabel")}>
          {/* Content Header with Search + Sort */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container py-3">
              <div className="flex items-center gap-3">
                {/* Sidebar Toggle */}
                <SidebarTrigger className="shrink-0" />
                
                {/* Search Bar - now in content header */}
                <div className="relative flex-1 max-w-xl">
                  <MagnifyingGlass
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="search"
                    placeholder={locale === "bg" ? "Търсене в продукти, марки и още..." : "Search products, brands and more..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-muted/50 border-border/50 focus:bg-background"
                  />
                </div>

                {/* Results count */}
                <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                  {productCount.toLocaleString()} {locale === "bg" ? "обяви" : "listings"}
                </span>

                {/* Spacer */}
                <div className="flex-1 hidden lg:block" />

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
                      "size-8 rounded",
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                    )}
                    aria-label="Grid view"
                  >
                    <SquaresFour size={18} weight={viewMode === "grid" ? "fill" : "regular"} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "size-8 rounded",
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                    )}
                    aria-label="List view"
                  >
                    <Rows size={18} weight={viewMode === "list" ? "fill" : "regular"} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container py-4 @container">
            {/* Breadcrumb Row (shows when category selected) */}
            {categoryPath.length > 0 && (
              <DesktopBreadcrumbRow
                path={categoryPath}
                locale={locale}
                onNavigate={handleBreadcrumbNavigate}
                onClear={handleBreadcrumbClear}
                resultCount={productCount}
                className="mb-3"
              />
            )}

            {/* Quick Filter Pills (when category selected) */}
            {categoryPath.length > 0 && (
              <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                {[
                  { id: "new", label: locale === "bg" ? "Ново" : "New" },
                  { id: "like_new", label: locale === "bg" ? "Като ново" : "Like new" },
                  { id: "used", label: locale === "bg" ? "Използвано" : "Used" },
                ].map((c) => {
                  const isActive = filters.condition === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          condition: prev.condition === c.id ? null : c.id,
                        }))
                      }}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap",
                        isActive
                          ? "bg-foreground text-background border-foreground font-medium"
                          : "bg-background border-border hover:bg-muted/50"
                      )}
                    >
                      {c.label}
                    </button>
                  )
                })}
                {(filters.priceMin || filters.priceMax) && (
                  <span className="px-3 py-1.5 text-xs rounded-full bg-foreground text-background font-medium whitespace-nowrap">
                    {filters.priceMin && filters.priceMax
                      ? `${filters.priceMin}–${filters.priceMax} лв`
                      : filters.priceMin
                        ? `≥${filters.priceMin} лв`
                        : `≤${filters.priceMax} лв`}
                  </span>
                )}
              </div>
            )}

            {/* Quick Pills (L3 subcategories when at L2+ depth) */}
            {l3Subcategories.length > 0 && (
              <DesktopQuickPills
                subcategories={l3Subcategories}
                activeSlug={selectedL3Slug}
                locale={locale}
                onSelect={handleQuickPillSelect}
                className="mb-3"
              />
            )}

            {/* Product Grid */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div role="list" aria-live="polite">
                {products.length === 0 && isLoading ? (
                  <ProductGridSkeleton viewMode={viewMode} />
                ) : products.length === 0 ? (
                  <EmptyStateCTA
                    variant={activeCategorySlug ? "no-category" : "no-listings"}
                    {...(activeCategorySlug ? { categoryName: activeCategorySlug } : {})}
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        viewMode === "list"
                          ? "flex flex-col gap-3"
                          : cn(
                              "grid gap-3",
                              "grid-cols-2",
                              "@[480px]:grid-cols-3",
                              "@[640px]:grid-cols-4",
                              "@[896px]:grid-cols-5",
                              "@[1152px]:grid-cols-6"
                            )
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
        </section>
      </SidebarInset>
    </SidebarProvider>
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
            "inline-flex items-center gap-1.5 rounded-md px-3 h-9",
            "text-sm font-medium whitespace-nowrap transition-colors border",
            "bg-background text-foreground border-border hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <ActiveIcon size={14} weight="fill" />
          <span className="hidden sm:inline">{activeTabData.label}</span>
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
          : cn(
              "grid gap-3",
              "grid-cols-2",
              "@[480px]:grid-cols-3",
              "@[640px]:grid-cols-4",
              "@[896px]:grid-cols-5",
              "@[1152px]:grid-cols-6"
            )
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

export function UnifiedDesktopFeedV3Skeleton() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="w-64 bg-sidebar border-r animate-pulse" />
      <SidebarInset>
        <div className="min-h-screen bg-muted/30">
          {/* Header skeleton */}
          <div className="sticky top-0 z-10 bg-background border-b border-border">
            <div className="container py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded" />
                <Skeleton className="h-10 flex-1 max-w-xl rounded-md" />
                <Skeleton className="h-5 w-20" />
                <div className="flex-1" />
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="container py-4 @container">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className={cn(
                "grid gap-3",
                "grid-cols-2",
                "@[480px]:grid-cols-3",
                "@[640px]:grid-cols-4",
                "@[896px]:grid-cols-5",
                "@[1152px]:grid-cols-6"
              )}>
                {Array.from({ length: 18 }).map((_, i) => (
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
      </SidebarInset>
    </SidebarProvider>
  )
}
