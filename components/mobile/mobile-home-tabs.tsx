"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryName, getCategoryShortName, type Category } from "@/hooks/use-categories-cache"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import type { UIProduct } from "@/lib/data/products"
import { CaretLeft, Megaphone, Clock, Sparkle, Storefront, TrendUp } from "@phosphor-icons/react"
import { usePathname, useSearchParams } from "next/navigation"

// =============================================================================
// Types
// =============================================================================

interface MobileHomeTabsProps {
  initialProducts: UIProduct[]
  /** Categories with children from server (L0→L1→L2 pre-loaded) */
  initialCategories?: Category[]
  defaultTab?: string | null
  defaultSubTab?: string | null
  showBanner?: boolean
  pageTitle?: string | null
}

interface TabData {
  products: UIProduct[]
  page: number
  hasMore: boolean
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-(--page-inset)">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col h-full">
          <Skeleton className="aspect-square w-full rounded-md mb-1" />
          <div className="space-y-1 flex-1 px-0.5">
            <Skeleton className="h-2.5 w-full rounded-sm" />
            <Skeleton className="h-2.5 w-2/3 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Constants
// =============================================================================

const ALL_TAB_FILTERS = [
  { id: 'promoted', label: { en: 'Promoted', bg: 'Промотирани' }, icon: Megaphone },
  { id: 'newest', label: { en: 'Newest', bg: 'Най-нови' }, icon: Clock },
  { id: 'suggested', label: { en: 'Suggested', bg: 'Предложени' }, icon: Sparkle },
  { id: 'top-sellers', label: { en: 'Top Sellers', bg: 'Топ търговци' }, icon: Storefront },
  { id: 'top-listings', label: { en: 'Top Listings', bg: 'Топ обяви' }, icon: TrendUp },
] as const

// =============================================================================
// Main Component
// =============================================================================

export function MobileHomeTabs({ 
  initialProducts, 
  initialCategories = [],
  defaultTab = null,
  defaultSubTab = null,
  showBanner = true,
  pageTitle = null,
}: MobileHomeTabsProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [headerHeight, setHeaderHeight] = useState(0)
  
  // Categories from server (L0→L1→L2 pre-loaded, no client fetch needed)
  const displayCategories = initialCategories

  // Initialize from URL params or props
  const initialTab = defaultTab || searchParams.get('tab') || "all"
  const initialSubTab = defaultSubTab || searchParams.get('sub') || null
  
  // ==========================================================================
  // Navigation State - Simple hierarchy: L0 → L1 → L2 → L3 (pill)
  // ==========================================================================
  const [activeTab, setActiveTab] = useState<string>(initialTab)       // L0 category slug
  const [activeL1, setActiveL1] = useState<string | null>(initialSubTab) // L1 category slug
  const [activeL2, setActiveL2] = useState<string | null>(null)        // L2 category slug
  const [selectedPill, setSelectedPill] = useState<string | null>(null) // L3 pill slug
  
  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest")

  // Product feed state
  const [isLoading, setIsLoading] = useState(false)
  const [tabData, setTabData] = useState<Record<string, TabData>>({
    all: {
      products: initialProducts,
      page: 1,
      hasMore: initialProducts.length >= 12,
    }
  })

  // L3 children cache (fetched on-demand via API)
  const [l3ChildrenCache, setL3ChildrenCache] = useState<Record<string, Category[]>>({})

  const isAllTab = activeTab === "all"

  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const subTabsContainerRef = useRef<HTMLDivElement>(null)
  const pillsContainerRef = useRef<HTMLDivElement>(null)

  // ==========================================================================
  // Derived State (computed from server-provided categories)
  // ==========================================================================

  // L0 category (Fashion, Electronics, etc.)
  const currentL0 = useMemo(() => 
    displayCategories.find(c => c.slug === activeTab),
    [displayCategories, activeTab]
  )

  // L1 categories (children of L0: Men, Women, Kids for Fashion)
  const l1Categories = useMemo(() => 
    currentL0?.children ?? [],
    [currentL0]
  )

  // Current L1 category
  const currentL1 = useMemo(() => 
    l1Categories.find(c => c.slug === activeL1),
    [l1Categories, activeL1]
  )

  // L2 categories (children of L1: Clothing, Shoes, Accessories)
  const l2Categories = useMemo(() => 
    currentL1?.children ?? [],
    [currentL1]
  )

  // Current L2 category
  const currentL2 = useMemo(() => 
    l2Categories.find(c => c.slug === activeL2),
    [l2Categories, activeL2]
  )

  // L3 categories (children of L2: T-shirts, Shirts, Pants) - from cache or server
  const l3Categories = useMemo(() => {
    if (!activeL2) return []
    // First check if L2 has children from server data
    if (currentL2?.children?.length) return currentL2.children
    // Otherwise use cached API response
    return l3ChildrenCache[activeL2] ?? []
  }, [activeL2, currentL2, l3ChildrenCache])

  // Determine what to show
  const showL1Circles = !activeL1 && l1Categories.length > 0
  const showL2Circles = !!activeL1 && l2Categories.length > 0
  const circlesToDisplay = showL2Circles ? l2Categories : (showL1Circles ? l1Categories : [])
  
  // Show L3 pills when L2 is selected
  const showPills = !!activeL2 && l3Categories.length > 0

  // Effective category slug for fetching products (most specific selection)
  const activeSlug = useMemo(() => {
    if (selectedPill) return selectedPill
    if (activeL2) return activeL2
    if (activeL1) return activeL1
    return activeTab
  }, [selectedPill, activeL2, activeL1, activeTab])

  // Get current category name for empty state
  const activeCategoryName = useMemo(() => {
    if (selectedPill) {
      const pill = l3Categories.find(c => c.slug === selectedPill)
      return pill ? getCategoryName(pill, locale) : null
    }
    if (activeL2 && currentL2) return getCategoryName(currentL2, locale)
    if (activeL1 && currentL1) return getCategoryName(currentL1, locale)
    if (activeTab !== "all" && currentL0) return getCategoryName(currentL0, locale)
    return null
  }, [selectedPill, activeL2, activeL1, activeTab, currentL0, currentL1, currentL2, l3Categories, locale])

  // Current feed data
  const activeFeed = tabData[activeSlug] ?? { products: [], page: 0, hasMore: true }

  // Measure header height for sticky positioning
  useEffect(() => {
    const update = () => {
      const header = document.querySelector("header")
      setHeaderHeight(header ? header.offsetHeight : 0)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Auto-scroll selected tab to left edge (respecting container padding)
  useEffect(() => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const activeBtn = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
      if (activeBtn) {
        const padding = parseFloat(getComputedStyle(container).paddingLeft)
        container.scrollLeft = Math.max(0, activeBtn.offsetLeft - padding)
      }
    }
  }, [activeTab])

  // ==========================================================================
  // Data Fetching
  // ==========================================================================

  // Fetch products for a slug
  const loadPage = useCallback(
    async (slug: string, nextPage: number) => {
      let url = `/api/products/newest?page=${nextPage}&limit=12`
      
      if (slug !== "all") {
        url += `&category=${slug}`
      } else if (activeAllFilter === 'promoted') {
        url = `/api/products/promoted?page=${nextPage}&limit=12`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      return data as {
        products?: UIProduct[]
        hasMore?: boolean
      }
    },
    [activeAllFilter]
  )

  // Fetch L3 children for an L2 category (only if not already in server data)
  const loadL3Children = useCallback(async (l2Slug: string) => {
    if (l3ChildrenCache[l2Slug]) return // Already cached
    
    try {
      const response = await fetch(`/api/categories?parent=${l2Slug}&depth=1`)
      const data = await response.json()
      if (data.categories) {
        setL3ChildrenCache(prev => ({
          ...prev,
          [l2Slug]: data.categories
        }))
      }
    } catch (error) {
      console.error(`Failed to load L3 children for ${l2Slug}:`, error)
    }
  }, [l3ChildrenCache])

  // Track which slugs have been loaded to prevent infinite loops
  const loadedSlugsRef = useRef<Set<string>>(new Set(["all"]))

  // Load initial products for a slug if empty
  useEffect(() => {
    // Skip if already loaded
    if (loadedSlugsRef.current.has(activeSlug)) return
    
    // Mark as loading to prevent re-runs
    loadedSlugsRef.current.add(activeSlug)

    let cancelled = false
    setIsLoading(true)

    loadPage(activeSlug, 1)
      .then((data) => {
        if (cancelled) {
          loadedSlugsRef.current.delete(activeSlug)
          return
        }
        const first = data.products || []
        setTabData(prev => ({
          ...prev,
          [activeSlug]: {
            products: first,
            page: first.length > 0 ? 1 : 0,
            hasMore: data.hasMore ?? first.length === 12,
          },
        }))
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(`Failed to load ${activeSlug} products:`, error)
          loadedSlugsRef.current.delete(activeSlug)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [activeSlug, loadPage])

  // Load L3 children when L2 is selected (if server didn't provide them)
  useEffect(() => {
    if (activeL2 && !currentL2?.children?.length && !l3ChildrenCache[activeL2]) {
      loadL3Children(activeL2)
    }
  }, [activeL2, currentL2, l3ChildrenCache, loadL3Children])

  // Load more products (infinite scroll)
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !activeFeed.hasMore) return
    
    setIsLoading(true)
    try {
      const nextPage = (activeFeed.page || 0) + 1
      const data = await loadPage(activeSlug, nextPage)

      const nextProducts = data.products || []
      if (nextProducts.length === 0) {
        setTabData((prev) => {
          const current = prev[activeSlug] ?? { products: [], page: 0, hasMore: true }
          return {
            ...prev,
            [activeSlug]: { ...current, hasMore: false },
          }
        })
        return
      }

      setTabData(prev => {
        const current = prev[activeSlug] || { products: [], page: 0, hasMore: true }
        const existingIds = new Set(current.products.map(p => p.id))
        const uniqueNewProducts = nextProducts.filter(p => !existingIds.has(p.id))
        
        return {
          ...prev,
          [activeSlug]: {
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
  }, [activeFeed.hasMore, activeFeed.page, activeSlug, isLoading, loadPage])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries.at(0)
        if (firstEntry?.isIntersecting && activeFeed.hasMore && !isLoading) {
          loadMoreProducts()
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [activeFeed.hasMore, isLoading, loadMoreProducts])

  // ==========================================================================
  // Navigation Handlers
  // ==========================================================================

  // Update URL when state changes (shallow routing - no page reload)
  const updateUrl = useCallback((tab: string, l1: string | null) => {
    const params = new URLSearchParams()
    if (tab !== 'all') params.set('tab', tab)
    if (l1) params.set('sub', l1)
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    window.history.replaceState(null, '', newUrl)
  }, [pathname])

  // Handle L0 tab change
  const handleTabChange = (slug: string) => {
    if (slug === activeTab) return
    setActiveTab(slug)
    setActiveL1(null)
    setActiveL2(null)
    setSelectedPill(null)
    updateUrl(slug, null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle circle click (L1 or L2)
  const handleCircleClick = (category: Category) => {
    if (!activeL1) {
      // Currently showing L1 circles - click selects L1, shows L2 circles
      setActiveL1(category.slug)
      setActiveL2(null)
      setSelectedPill(null)
      updateUrl(activeTab, category.slug)
    } else {
      // Currently showing L2 circles - click selects L2, shows L3 pills
      setActiveL2(category.slug)
      setSelectedPill(null)
    }
  }

  // Handle back button (go from L2 back to L1)
  const handleBackToL1 = () => {
    setActiveL1(null)
    setActiveL2(null)
    setSelectedPill(null)
    updateUrl(activeTab, null)
  }

  // Handle L3 pill click
  const handlePillClick = (category: Category) => {
    if (selectedPill === category.slug) {
      // Double-click could navigate deeper (if L4 exists), for now just toggle off
      setSelectedPill(null)
    } else {
      setSelectedPill(category.slug)
    }
  }

  // Handle All tab filter click
  const handleAllFilterClick = (id: string) => {
    setActiveAllFilter(id)
    setTabData(prev => ({
      ...prev,
      all: { products: [], page: 0, hasMore: true }
    }))
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 
        1. Sticky Tabs Header (L0)
      */}
      <div 
        className="sticky z-30 bg-background border-b border-border/40"
        style={{ top: headerHeight }}
      >
        <div 
          ref={tabsContainerRef}
          className="relative flex items-center gap-3 overflow-x-auto no-scrollbar px-(--page-inset)"
          role="tablist"
        >
          {/* "All" Tab */}
          <button
            type="button"
            role="tab"
            data-tab="all"
            onClick={() => handleTabChange("all")}
            aria-selected={activeTab === "all"}
            className={cn(
              "shrink-0 py-3 text-sm relative",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "transition-colors",
              activeTab === "all"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Zero-layout-shift technique: invisible bold text reserves width */}
            <span className="relative inline-flex flex-col items-center">
              <span className={cn(
                "transition-[font-weight] duration-100",
                activeTab === "all" ? "font-bold" : "font-medium"
              )}>
                {locale === "bg" ? "Всички" : "All"}
              </span>
              <span className="font-bold invisible h-0 overflow-hidden" aria-hidden="true">
                {locale === "bg" ? "Всички" : "All"}
              </span>
              {activeTab === "all" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </span>
          </button>

          {/* Category Tabs */}
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              data-tab={cat.slug}
              onClick={() => handleTabChange(cat.slug)}
              aria-selected={activeTab === cat.slug}
              className={cn(
                "shrink-0 py-3 text-sm relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-colors",
                activeTab === cat.slug
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Zero-layout-shift technique: invisible bold text reserves width */}
              <span className="relative inline-flex flex-col items-center">
                <span className={cn(
                  "transition-[font-weight] duration-100",
                  activeTab === cat.slug ? "font-bold" : "font-medium"
                )}>
                  {getCategoryName(cat, locale)}
                </span>
                <span className="font-bold invisible h-0 overflow-hidden" aria-hidden="true">
                  {getCategoryName(cat, locale)}
                </span>
                {activeTab === cat.slug && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 
        2. Full-bleed Seller Banner (All tab only) - Professional C2C marketplace style
      */}
      {showBanner && isAllTab && (
        <>
          <StartSellingBanner locale={locale} variant="full-bleed" showTrustRow />
        </>
      )}

      {/* Optional Page Title (for category pages) */}
      {pageTitle && (
        <div className="bg-background px-(--page-inset) py-3 border-b border-border/40">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
        </div>
      )}

      {/* 
        3. Subcategory Circles (L1 or L2) OR "All" Tab Quick Filters
        Positioned below the banner so filters affect products below
      */}
      <div className={cn(
        "bg-background border-b border-border/40",
        "py-2.5"
      )}>
        {isAllTab ? (
          <div className="px-(--page-inset)">
            <div className="flex overflow-x-auto no-scrollbar gap-2 snap-x snap-mandatory items-center">
              {ALL_TAB_FILTERS.map((filter) => {
                const Icon = filter.icon
                const isActive = activeAllFilter === filter.id
                return (
                  <button
                    key={filter.id}
                    onClick={() => handleAllFilterClick(filter.id)}
                    className={cn(
                      "flex items-center gap-1.5 h-8 px-3 shrink-0 snap-start rounded-lg text-xs font-medium transition-all duration-100",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      isActive
                        ? "bg-brand text-white shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    aria-pressed={isActive}
                  >
                    <Icon size={14} weight={isActive ? "fill" : "regular"} className={isActive ? "" : "opacity-70"} />
                    <span className="whitespace-nowrap">
                      {filter.label[locale as 'en' | 'bg'] || filter.label.en}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (circlesToDisplay.length > 0 || showL2Circles) ? (
          <div 
            ref={subTabsContainerRef}
            className="flex overflow-x-auto no-scrollbar gap-2 snap-x snap-mandatory items-start px-(--page-inset)"
          >
            {/* Back Button (when showing L2) */}
            {showL2Circles && (
              <div className="flex flex-col items-center gap-1 shrink-0 snap-start w-14">
                <button
                  type="button"
                  onClick={handleBackToL1}
                  className="size-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center hover:bg-brand/20 transition-colors duration-100"
                >
                  <CaretLeft size={20} weight="bold" className="text-brand" aria-hidden="true" />
                  <span className="sr-only">{locale === "bg" ? "Назад" : "Back"}</span>
                </button>
                <span className="text-2xs text-center leading-tight text-muted-foreground w-full font-medium">
                  {locale === "bg" ? "Назад" : "Back"}
                </span>
              </div>
            )}

            {circlesToDisplay.map((sub) => {
              const isActive = showL2Circles 
                ? activeL2 === sub.slug
                : activeL1 === sub.slug

              const dimmed =
                (showL2Circles ? !!activeL2 : !!activeL1) && !isActive

              return (
                <CategoryCircle
                  key={sub.slug}
                  category={sub}
                  onClick={() => handleCircleClick(sub)}
                  active={isActive}
                  dimmed={dimmed}
                  circleClassName="size-10"
                  fallbackIconSize={20}
                  fallbackIconWeight={isActive ? "fill" : "regular"}
                  variant="muted"
                  label={getCategoryShortName(sub, locale)}
                  className={cn("w-14", "transition-opacity duration-100")}
                  labelClassName={cn(
                    "text-2xs text-center leading-tight line-clamp-2 w-full font-medium",
                    isActive ? "text-brand" : "text-muted-foreground"
                  )}
                />
              )
            })}
          </div>
        ) : null}
      </div>

      {/* 
        3. Deep Navigation Pills (L3)
        Revealed when L2 is selected and has children.
      */}
      {showPills && (
        <div className="bg-background py-3 px-(--page-inset) overflow-x-auto no-scrollbar" ref={pillsContainerRef}>
          <div className="flex gap-2 items-center">
            {/* "All" Pill */}
            <button
              onClick={() => setSelectedPill(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border focus-visible:outline-none transition-colors",
                selectedPill === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border/50 hover:bg-secondary/80"
              )}
            >
              {locale === "bg" ? "Всички" : "All"}
            </button>

            {/* L3 Pills */}
            {l3Categories.map((child) => {
              const isSelected = selectedPill === child.slug
              return (
                <button
                  key={child.slug}
                  onClick={() => handlePillClick(child)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border focus-visible:outline-none transition-colors",
                    isSelected 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-secondary text-secondary-foreground border-border/50 hover:bg-secondary/80"
                  )}
                >
                  {getCategoryName(child, locale)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 
        4. Product Feed 
      */}
      <div className="pt-1">
        {activeFeed.products.length === 0 && !isLoading ? (
          <EmptyStateCTA 
            variant={isAllTab ? "no-listings" : "no-category"}
            {...(activeCategoryName ? { categoryName: activeCategoryName } : {})}
          />
        ) : (
          <div className="grid grid-cols-2 gap-1.5 px-(--page-inset)">
            {activeFeed.products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${activeSlug}`}
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.listPrice ?? null}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                {...(product.isBoosted ? { state: "promoted" as const } : {})}
                index={index}
                slug={product.slug ?? null}
                storeSlug={product.storeSlug ?? null}
                sellerId={product.sellerId ?? null}
                {...((product.sellerName || product.storeSlug)
                  ? { sellerName: product.sellerName || product.storeSlug || "" }
                  : {})}
                sellerAvatarUrl={product.sellerAvatarUrl || null}
                sellerTier={product.sellerTier ?? "basic"}
                sellerVerified={Boolean(product.sellerVerified)}
                {...(product.condition ? { condition: product.condition } : {})}
                {...(product.brand ? { brand: product.brand } : {})}
                {...(product.categorySlug ? { categorySlug: product.categorySlug } : {})}
                {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                {...(product.make ? { make: product.make } : {})}
                {...(product.model ? { model: product.model } : {})}
                {...(product.year ? { year: product.year } : {})}
                {...(product.location ? { location: product.location } : {})}
                {...(product.attributes ? { attributes: product.attributes } : {})}
                cardStyle="marketplace"
                showSellerRow={false}
                showMetaPills={true}
              />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="py-3">
          {isLoading && <ProductGridSkeleton count={4} />}
          {!activeFeed.hasMore && activeFeed.products.length > 0 && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
              <span className="h-px w-12 bg-border" />
              <span>{locale === "bg" ? "Край на резултатите" : "End of results"}</span>
              <span className="h-px w-12 bg-border" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
