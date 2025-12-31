"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryName, getCategoryShortName, type Category } from "@/hooks/use-categories-cache"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import type { UIProduct } from "@/lib/data/products"
import { CaretLeft, Megaphone, Clock, Sparkle, Storefront, TrendUp } from "@phosphor-icons/react"
import { usePathname, useSearchParams } from "next/navigation"

interface MobileHomeTabsProps {
  initialProducts: UIProduct[]
  initialCategories?: Category[] // Categories with children from server
  /** Default tab from URL (e.g., "electronics") */
  defaultTab?: string | null
  /** Default subtab from URL (e.g., "smartphones") */
  defaultSubTab?: string | null

  /** Whether to show the seller banner (default: true for homepage) */
  showBanner?: boolean
  /** Optional SEO heading for category pages */
  pageTitle?: string | null
}

// Loading skeleton for the product grid
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

const ALL_TAB_FILTERS = [
  { id: 'promoted', label: { en: 'Promoted', bg: 'Промотирани' }, icon: Megaphone },
  { id: 'newest', label: { en: 'Newest', bg: 'Най-нови' }, icon: Clock },
  { id: 'suggested', label: { en: 'Suggested', bg: 'Предложени' }, icon: Sparkle },
  { id: 'top-sellers', label: { en: 'Top Sellers', bg: 'Топ търговци' }, icon: Storefront },
  { id: 'top-listings', label: { en: 'Top Listings', bg: 'Топ обяви' }, icon: TrendUp },
]

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
  
  // Use server-provided categories (already includes children)
  const displayCategories = initialCategories

  // Initialize from URL params or props
  const initialTab = defaultTab || searchParams.get('tab') || "all"
  const initialSubTab = defaultSubTab || searchParams.get('sub') || null
  
  const [activeTab, setActiveTab] = useState<string>(initialTab) // L0
  const [activeSubTab, setActiveSubTab] = useState<string | null>(initialSubTab) // L1
  
  // Deep navigation stack for L2+ (e.g. ["sneakers", "running-shoes"])
  const [activeDeepPath, setActiveDeepPath] = useState<Category[]>([])
  const [selectedPill, setSelectedPill] = useState<Category | null>(null)
  
  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest")

  const [isLoading, setIsLoading] = useState(false)
  const isAllTab = activeTab === "all"
  
  // Effective category slug for fetching products
  const activeSlug = selectedPill 
    ? selectedPill.slug 
    : (activeDeepPath.length > 0 
        ? activeDeepPath[activeDeepPath.length - 1].slug 
        : (activeSubTab || activeTab))

  // State for product feeds per slug
  const [tabData, setTabData] = useState<
    Record<string, { products: UIProduct[]; page: number; hasMore: boolean }>
  >({
    all: {
      products: initialProducts,
      page: 1,
      hasMore: true,
    }
  })

  // Dynamic children fetching for deep navigation
  const [dynamicChildren, setDynamicChildren] = useState<Record<string, Category[]>>({})

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const subTabsContainerRef = useRef<HTMLDivElement>(null)
  const pillsContainerRef = useRef<HTMLDivElement>(null)

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

  const activeFeed = tabData[activeSlug] || { products: [], page: 0, hasMore: true }

  // Fetch products for a slug
  const loadPage = useCallback(
    async (slug: string, nextPage: number) => {
      let url = `/api/products/newest?page=${nextPage}&limit=12`
      
      if (slug !== "all") {
        url += `&category=${slug}`
      } else if (activeAllFilter) {
        if (activeAllFilter === 'promoted') url = `/api/products/promoted?page=${nextPage}&limit=12`
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

  // Fetch children for a category (L2+)
  const loadChildren = useCallback(async (parentSlug: string) => {
    try {
      const response = await fetch(`/api/categories?parent=${parentSlug}&depth=1`)
      const data = await response.json()
      if (data.categories) {
        setDynamicChildren(prev => ({
          ...prev,
          [parentSlug]: data.categories
        }))
      }
    } catch (error) {
      console.error(`Failed to load children for ${parentSlug}:`, error)
    }
  }, [])

  // Load initial data for a slug if empty
  useEffect(() => {
    const current = tabData[activeSlug]
    if (!current || current.page === 0) {
      let cancelled = false
      setIsLoading(true)

      loadPage(activeSlug, 1)
        .then((data) => {
          if (cancelled) return
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
          if (!cancelled) console.error(`Failed to load ${activeSlug} products:`, error)
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })

      return () => {
        cancelled = true
      }
    }
  }, [activeSlug, loadPage, tabData])

  // Load children when a deep path item is added
  useEffect(() => {
    if (activeDeepPath.length > 0) {
      const lastCategory = activeDeepPath[activeDeepPath.length - 1]
      if (!dynamicChildren[lastCategory.slug]) {
        loadChildren(lastCategory.slug)
      }
    }
  }, [activeDeepPath, dynamicChildren, loadChildren])

  // Load more products (infinite scroll)
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !activeFeed.hasMore) return
    
    setIsLoading(true)
    try {
      const nextPage = (activeFeed.page || 0) + 1
      const data = await loadPage(activeSlug, nextPage)

      const nextProducts = data.products || []
      if (nextProducts.length === 0) {
        setTabData(prev => ({
          ...prev,
          [activeSlug]: { ...prev[activeSlug], hasMore: false },
        }))
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

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && activeFeed.hasMore && !isLoading) {
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

  // Get current category object to find children
  const currentCategory = displayCategories.find(c => c.slug === activeTab)
  const subcategories = currentCategory?.children || []
  
  // Get current subcategory object to find L2 children (initial set)
  const currentSubCategory = subcategories.find(c => c.slug === activeSubTab)

  // L2 Categories (for Circles)
  const l2Categories = currentSubCategory 
    ? (currentSubCategory.children?.length ? currentSubCategory.children : dynamicChildren[currentSubCategory.slug] || [])
    : []

  const showL2Circles = !!activeSubTab
  const circlesToDisplay = showL2Circles ? l2Categories : subcategories

  const handleCircleClick = (category: Category) => {
    if (!showL2Circles) {
      // Clicked L1 -> Go to L2 (Circles)
      handleSubTabChange(category.slug)
    } else {
      // Clicked L2 -> Go to L3 (Pills)
      setActiveDeepPath([category])
      setSelectedPill(null)
    }
  }

  const handleBackToL1 = () => {
    setActiveSubTab(null)
    setActiveDeepPath([])
    setSelectedPill(null)
    updateUrl(activeTab, null)
  }
  
  // Determine which pills to show (L3+)
  let pills: Category[] = []

  if (activeDeepPath.length > 0) {
    // We are deep (L2+ selected). Show children of the current deepest selection.
    const lastSelected = activeDeepPath[activeDeepPath.length - 1]
    pills = dynamicChildren[lastSelected.slug] || []
  }

  // Effect to fetch L2 children if missing from cache
  useEffect(() => {
    if (activeSubTab && currentSubCategory && (!currentSubCategory.children || currentSubCategory.children.length === 0)) {
      if (!dynamicChildren[activeSubTab]) {
        loadChildren(activeSubTab)
      }
    }
  }, [activeSubTab, currentSubCategory, dynamicChildren, loadChildren])


  // Update URL when state changes (shallow routing - no page reload)
  const updateUrl = useCallback((tab: string, sub: string | null) => {
    const params = new URLSearchParams()
    if (tab !== 'all') params.set('tab', tab)
    if (sub) params.set('sub', sub)
    
    const queryString = params.toString()
    const newUrl = queryString 
      ? `${pathname}?${queryString}` 
      : pathname
    
    // Use replaceState to avoid polluting browser history for every tab click
    window.history.replaceState(null, '', newUrl)
  }, [pathname])

  const handleTabChange = (slug: string) => {
    if (slug === activeTab) return
    setActiveTab(slug)
    setActiveSubTab(null)
    setActiveDeepPath([])
    setSelectedPill(null)
    updateUrl(slug, null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubTabChange = (slug: string) => {
    if (slug === activeSubTab) {
      setActiveSubTab(null)
      setActiveDeepPath([])
      setSelectedPill(null)
      updateUrl(activeTab, null)
    } else {
      setActiveSubTab(slug)
      setActiveDeepPath([]) 
      setSelectedPill(null)
      updateUrl(activeTab, slug)
    }
  }

  const handlePillClick = (category: Category) => {
    if (selectedPill?.slug === category.slug) {
      setActiveDeepPath(prev => [...prev, category])
      setSelectedPill(null)
      if (pillsContainerRef.current) {
        pillsContainerRef.current.scrollTo({ left: 0, behavior: "smooth" })
      }
    } else {
      setSelectedPill(category)
    }
  }

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
              <div className="flex flex-col items-center gap-1.5 shrink-0 snap-start w-[72px]">
                <button
                  type="button"
                  onClick={handleBackToL1}
                  className="size-14 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors duration-100"
                >
                  <CaretLeft size={24} weight="bold" className="text-foreground" aria-hidden="true" />
                  <span className="sr-only">{locale === "bg" ? "Назад" : "Back"}</span>
                </button>
                <span className="text-2xs text-center leading-tight text-muted-foreground w-full font-medium">
                  {locale === "bg" ? "Назад" : "Back"}
                </span>
              </div>
            )}

            {circlesToDisplay.map((sub) => {
              const isActive = showL2Circles 
                ? activeDeepPath[0]?.slug === sub.slug
                : activeSubTab === sub.slug

              const dimmed =
                (showL2Circles ? activeDeepPath.length > 0 : !!activeSubTab) && !isActive

              return (
                <CategoryCircle
                  key={sub.slug}
                  category={sub}
                  onClick={() => handleCircleClick(sub)}
                  active={isActive}
                  dimmed={dimmed}
                  circleClassName="size-14"
                  fallbackIconSize={26}
                  fallbackIconWeight={isActive ? "fill" : "regular"}
                  variant="muted"
                  label={getCategoryShortName(sub, locale)}
                  className={cn("w-[72px]", "transition-opacity duration-100")}
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
        3. Deep Navigation Pills (L3, L4...)
        Revealed when L2 is selected (activeDeepPath > 0).
      */}
      {activeDeepPath.length > 0 && (
        <div className="bg-background py-3 px-(--page-inset) overflow-x-auto no-scrollbar" ref={pillsContainerRef}>
          <div className="flex gap-2 items-center">
            {/* Current Context Label */}
            {activeDeepPath.length > 1 && (
              <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground border border-primary whitespace-nowrap shrink-0">
                {getCategoryName(activeDeepPath[activeDeepPath.length - 1], locale)}
              </div>
            )}

            {/* "All" Pill */}
            {pills.length > 0 && (
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
            )}

            {/* Children Pills */}
            {pills.map((child) => {
              const isSelected = selectedPill?.slug === child.slug
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
            
            {/* Empty state for leaf nodes */}
            {pills.length === 0 && (
              <span className="text-xs text-muted-foreground italic px-2">
                {locale === "bg" ? "Всички продукти" : "All products"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 
        4. Product Feed 
      */}
      <div className="pt-1">
        {activeFeed.products.length === 0 && !isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>{locale === "bg" ? "Няма намерени продукти" : "No products found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 px-(--page-inset)">
            {activeFeed.products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${activeSlug}`}
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.listPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                state={product.isBoosted ? "promoted" : undefined}
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
                categoryRootSlug={product.categoryRootSlug}
                categoryPath={product.categoryPath}
                make={product.make}
                model={product.model}
                year={product.year}
                location={product.location}
                attributes={product.attributes}
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
