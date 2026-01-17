"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { ProductCardList } from "@/components/shared/product/product-card-list"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useViewMode } from "@/hooks/use-view-mode"
import type { CategoryTreeNode } from "@/lib/category-tree"
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
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// New components
import { DesktopCategorySidebar, type CategoryPath } from "./desktop-category-sidebar"
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

interface UnifiedDesktopFeedProps {
  locale: string
  categories?: CategoryTreeNode[]
  initialTab?: FeedTab
  initialProducts?: Product[]
  initialHasMore?: boolean
}

// =============================================================================
// MAIN COMPONENT - Unified Desktop Layout V2
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
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([])
  const [selectedL3Slug, setSelectedL3Slug] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)

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
    
    // Find L0
    const l0 = categories.find((c) => c.slug === l0Slug)
    if (!l0?.children) return []
    
    // Find L1
    const l1 = l0.children.find((c) => c.slug === l1Slug)
    if (!l1?.children) return []
    
    // If we're at L2, show L2's children (L3)
    if (l2Slug) {
      const l2 = l1.children.find((c) => c.slug === l2Slug)
      return l2?.children ?? []
    }
    
    // If we're at L1, show L1's children (L2) as pills
    return l1.children
  }, [categories, categoryPath])

  // URL sync for category
  const urlCategory = searchParams.get("category")
  useEffect(() => {
    if (urlCategory && urlCategory !== activeCategorySlug) {
      // URL has a category but our state doesn't match - reconstruct path
      // For now, just use the slug directly; full path reconstruction would need API call
      // This is a simplified approach
    }
  }, [urlCategory, activeCategorySlug])

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
    
    // Update URL with deepest category
    const deepestSlug = path.length > 0 ? path[path.length - 1]?.slug ?? null : null
    updateUrl(deepestSlug)
  }

  const handleBreadcrumbNavigate = (depth: number) => {
    if (depth === 0) {
      // Navigate to "All"
      setCategoryPath([])
      setSelectedL3Slug(null)
      updateUrl(null)
    } else {
      // Navigate to specific depth
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
    
    // Update URL
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
    <section id="listings" className="w-full bg-muted/50" aria-label={t("sectionAriaLabel")}>
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-5">
          {/* LEFT SIDEBAR: Categories + Filters */}
          <aside className="hidden lg:flex flex-col shrink-0 gap-3 sticky top-20 self-start">
            <DesktopCategorySidebar
              categories={categories}
              locale={locale}
              selectedPath={categoryPath}
              onCategorySelect={handleCategorySelect}
              categoryCounts={categoryCounts}
            />
            {/* Filters Card - always visible */}
            <DesktopFiltersCard
              locale={locale}
              filters={filters}
              onFiltersChange={setFilters}
              onApply={() => {
                setPage(1)
                fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
              }}
            />
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 @container space-y-4">
            {/* TOOLBAR ROW: Search + Filters + Count + Sort + View — all inside a card */}
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-center gap-3">
                {/* Left: Category filters dropdowns (Size, Brand, Condition) */}
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
                  <CategoryFilters
                    categorySlug={activeCategorySlug}
                    locale={locale}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>

                {/* Right: Count + Sort + View */}
                <div className="flex items-center gap-3 shrink-0">
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
                  <div className="flex items-center rounded-md border border-border bg-muted/40">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "size-9 rounded-l-md rounded-r-none",
                        viewMode === "grid"
                          ? "bg-background text-foreground"
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
                        "size-9 rounded-r-md rounded-l-none",
                        viewMode === "list"
                          ? "bg-background text-foreground"
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

            {/* Quick Pills (L3 subcategories when at L2+ depth) */}
            {l3Subcategories.length > 0 && (
              <DesktopQuickPills
                subcategories={l3Subcategories}
                activeSlug={selectedL3Slug}
                locale={locale}
                onSelect={handleQuickPillSelect}
              />
            )}

            {/* Product Grid Container */}
            <div className="rounded-lg border border-border bg-background p-4">
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
                              "grid gap-4",
                              // Container query breakpoints for optimal fill
                              "grid-cols-2",
                              "@[520px]:grid-cols-3",
                              "@[720px]:grid-cols-4",
                              "@[960px]:grid-cols-5"
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
            "inline-flex items-center gap-1.5 rounded-md px-3 h-9",
            "text-sm font-medium whitespace-nowrap transition-colors border",
            "bg-muted/40 text-foreground border-border hover:bg-muted/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <ActiveIcon size={16} weight="fill" />
          <span>{activeTabData.label}</span>
          <CaretDown size={12} weight="bold" className="text-muted-foreground" />
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
              "grid gap-4",
              "grid-cols-2",
              "@[520px]:grid-cols-3",
              "@[720px]:grid-cols-4",
              "@[960px]:grid-cols-5"
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

export function UnifiedDesktopFeedSkeleton() {
  return (
    <div className="bg-muted/50">
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-5">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:flex flex-col shrink-0 gap-3">
            <div className="rounded-lg border border-border bg-background p-1.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md mb-1" />
              ))}
            </div>
            <div className="rounded-lg border border-border bg-background p-3 space-y-3">
              <Skeleton className="h-4 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
              </div>
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-1.5">
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-18 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
              </div>
            </div>
          </aside>

          {/* Main content skeleton */}
          <div className="flex-1 min-w-0 @container space-y-4">
            {/* Toolbar */}
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
                <div className="flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>

            {/* Products container */}
            <div className="rounded-lg border border-border bg-background p-4">
              <div className={cn(
                "grid gap-4",
                "grid-cols-2",
                "@[520px]:grid-cols-3",
                "@[720px]:grid-cols-4",
                "@[960px]:grid-cols-5"
              )}>
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
    </div>
  )
}

// =============================================================================
// CATEGORY FILTERS - Dynamic filters based on category type
// =============================================================================

interface CategoryFiltersProps {
  categorySlug: string | null
  locale: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

// Category-to-filter mapping
const CATEGORY_FILTERS: Record<string, { id: string; labelEn: string; labelBg: string; options: { value: string; labelEn: string; labelBg: string }[] }[]> = {
  // Fashion categories
  fashion: [
    { id: "size", labelEn: "Size", labelBg: "Размер", options: [
      { value: "xs", labelEn: "XS", labelBg: "XS" },
      { value: "s", labelEn: "S", labelBg: "S" },
      { value: "m", labelEn: "M", labelBg: "M" },
      { value: "l", labelEn: "L", labelBg: "L" },
      { value: "xl", labelEn: "XL", labelBg: "XL" },
    ]},
    { id: "brand", labelEn: "Brand", labelBg: "Марка", options: [
      { value: "nike", labelEn: "Nike", labelBg: "Nike" },
      { value: "adidas", labelEn: "Adidas", labelBg: "Adidas" },
      { value: "zara", labelEn: "Zara", labelBg: "Zara" },
      { value: "hm", labelEn: "H&M", labelBg: "H&M" },
    ]},
  ],
  clothing: [
    { id: "size", labelEn: "Size", labelBg: "Размер", options: [
      { value: "xs", labelEn: "XS", labelBg: "XS" },
      { value: "s", labelEn: "S", labelBg: "S" },
      { value: "m", labelEn: "M", labelBg: "M" },
      { value: "l", labelEn: "L", labelBg: "L" },
      { value: "xl", labelEn: "XL", labelBg: "XL" },
      { value: "xxl", labelEn: "XXL", labelBg: "XXL" },
    ]},
    { id: "color", labelEn: "Color", labelBg: "Цвят", options: [
      { value: "black", labelEn: "Black", labelBg: "Черен" },
      { value: "white", labelEn: "White", labelBg: "Бял" },
      { value: "blue", labelEn: "Blue", labelBg: "Син" },
      { value: "red", labelEn: "Red", labelBg: "Червен" },
    ]},
  ],
  shoes: [
    { id: "size", labelEn: "Size", labelBg: "Размер", options: [
      { value: "36", labelEn: "36", labelBg: "36" },
      { value: "37", labelEn: "37", labelBg: "37" },
      { value: "38", labelEn: "38", labelBg: "38" },
      { value: "39", labelEn: "39", labelBg: "39" },
      { value: "40", labelEn: "40", labelBg: "40" },
      { value: "41", labelEn: "41", labelBg: "41" },
      { value: "42", labelEn: "42", labelBg: "42" },
      { value: "43", labelEn: "43", labelBg: "43" },
      { value: "44", labelEn: "44", labelBg: "44" },
    ]},
    { id: "brand", labelEn: "Brand", labelBg: "Марка", options: [
      { value: "nike", labelEn: "Nike", labelBg: "Nike" },
      { value: "adidas", labelEn: "Adidas", labelBg: "Adidas" },
      { value: "puma", labelEn: "Puma", labelBg: "Puma" },
      { value: "converse", labelEn: "Converse", labelBg: "Converse" },
    ]},
  ],
  // Electronics
  electronics: [
    { id: "brand", labelEn: "Brand", labelBg: "Марка", options: [
      { value: "apple", labelEn: "Apple", labelBg: "Apple" },
      { value: "samsung", labelEn: "Samsung", labelBg: "Samsung" },
      { value: "sony", labelEn: "Sony", labelBg: "Sony" },
      { value: "lg", labelEn: "LG", labelBg: "LG" },
    ]},
    { id: "storage", labelEn: "Storage", labelBg: "Памет", options: [
      { value: "64gb", labelEn: "64GB", labelBg: "64GB" },
      { value: "128gb", labelEn: "128GB", labelBg: "128GB" },
      { value: "256gb", labelEn: "256GB", labelBg: "256GB" },
      { value: "512gb", labelEn: "512GB", labelBg: "512GB" },
    ]},
  ],
  // Vehicles
  vehicles: [
    { id: "fuel", labelEn: "Fuel", labelBg: "Гориво", options: [
      { value: "petrol", labelEn: "Petrol", labelBg: "Бензин" },
      { value: "diesel", labelEn: "Diesel", labelBg: "Дизел" },
      { value: "electric", labelEn: "Electric", labelBg: "Електрически" },
      { value: "hybrid", labelEn: "Hybrid", labelBg: "Хибрид" },
    ]},
    { id: "transmission", labelEn: "Transmission", labelBg: "Скорости", options: [
      { value: "manual", labelEn: "Manual", labelBg: "Ръчни" },
      { value: "automatic", labelEn: "Automatic", labelBg: "Автоматик" },
    ]},
  ],
}

// Default filters for all categories
const DEFAULT_FILTERS = [
  { id: "condition", labelEn: "Condition", labelBg: "Състояние", options: [
    { value: "new", labelEn: "New", labelBg: "Ново" },
    { value: "like_new", labelEn: "Like new", labelBg: "Като ново" },
    { value: "used", labelEn: "Used", labelBg: "Използвано" },
  ]},
]

function CategoryFilters({ categorySlug, locale, filters, onFiltersChange }: CategoryFiltersProps) {
  // Get category-specific filters, fall back to parent category
  const getCategoryFilters = (slug: string | null) => {
    if (!slug) return DEFAULT_FILTERS
    
    // Check exact match first
    if (CATEGORY_FILTERS[slug]) {
      return [...CATEGORY_FILTERS[slug], ...DEFAULT_FILTERS]
    }
    
    // Check if slug contains category keywords
    const slugLower = slug.toLowerCase()
    if (slugLower.includes("cloth") || slugLower.includes("fashion") || slugLower.includes("men") || slugLower.includes("women")) {
      return [...(CATEGORY_FILTERS.clothing || []), ...DEFAULT_FILTERS]
    }
    if (slugLower.includes("shoe") || slugLower.includes("footwear")) {
      return [...(CATEGORY_FILTERS.shoes || []), ...DEFAULT_FILTERS]
    }
    if (slugLower.includes("electron") || slugLower.includes("phone") || slugLower.includes("computer")) {
      return [...(CATEGORY_FILTERS.electronics || []), ...DEFAULT_FILTERS]
    }
    if (slugLower.includes("car") || slugLower.includes("vehicle") || slugLower.includes("auto")) {
      return [...(CATEGORY_FILTERS.vehicles || []), ...DEFAULT_FILTERS]
    }
    
    return DEFAULT_FILTERS
  }

  const categoryFilters = getCategoryFilters(categorySlug)
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null)

  return (
    <>
      {categoryFilters.map((filter) => (
        <DropdownMenu key={filter.id} open={activeFilter === filter.id} onOpenChange={(open) => setActiveFilter(open ? filter.id : null)}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 h-9 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                "bg-muted/40 text-foreground border border-border hover:bg-muted/60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {locale === "bg" ? filter.labelBg : filter.labelEn}
              <CaretDown size={12} weight="bold" className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-36">
            {filter.options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    [filter.id]: filters[filter.id as keyof FilterState] === option.value ? null : option.value,
                  } as FilterState)
                }}
                className="cursor-pointer"
              >
                {locale === "bg" ? option.labelBg : option.labelEn}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      
      {/* Active filter badges */}
      {Object.entries(filters).map(([key, value]) => {
        if (!value || key === "priceMin" || key === "priceMax") return null
        const filter = categoryFilters.find(f => f.id === key)
        const option = filter?.options.find(o => o.value === value)
        if (!option) return null
        
        return (
          <button
            key={key}
            type="button"
            onClick={() => onFiltersChange({ ...filters, [key]: null } as FilterState)}
            className="inline-flex items-center gap-1.5 px-3 h-9 text-sm font-medium rounded-md bg-foreground text-background whitespace-nowrap"
          >
            {locale === "bg" ? option.labelBg : option.labelEn}
            <span className="text-background/70">×</span>
          </button>
        )
      })}
    </>
  )
}
