"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryName, getCategoryShortName, type Category } from "@/hooks/use-categories-cache"
import { getCategoryIcon } from "@/lib/category-icons"
import type { UIProduct } from "@/lib/data/products"
import { CaretLeft } from "@phosphor-icons/react"

import { StartSellingBanner } from "@/components/sections/start-selling-banner"

interface MobileHomeTabsProps {
  initialProducts: UIProduct[]
  initialCategories?: Category[] // Categories with children from server
}

// Loading skeleton for the product grid
function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-2">
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

export function MobileHomeTabs({ initialProducts, initialCategories = [] }: MobileHomeTabsProps) {
  const locale = useLocale()
  const [headerHeight, setHeaderHeight] = useState(0)
  
  // Use server-provided categories (already includes children)
  // No client-side fetch needed - categories come from server cache
  const displayCategories = initialCategories

  const [activeTab, setActiveTab] = useState<string>("all") // L0
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null) // L1
  
  // Deep navigation stack for L2+ (e.g. ["sneakers", "running-shoes"])
  const [activeDeepPath, setActiveDeepPath] = useState<Category[]>([])
  const [selectedPill, setSelectedPill] = useState<Category | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  
  // Effective category slug for fetching products
  // If deep path exists, use the last item. Else use subtab (L1). Else use tab (L0).
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

  // Scroll active tab into view (Temu style: moves to first position)
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeBtn = tabsContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
      if (activeBtn) {
        const container = tabsContainerRef.current
        const newScrollLeft = activeBtn.offsetLeft - 16
        container.scrollTo({ left: newScrollLeft, behavior: "auto" })
      }
    }
  }, [activeTab])

  // Scroll active sub-tab (L1) into view
  useEffect(() => {
    if (subTabsContainerRef.current && activeSubTab) {
      const activeBtn = subTabsContainerRef.current.querySelector(`[data-subtab="${activeSubTab}"]`) as HTMLElement
      if (activeBtn) {
        const container = subTabsContainerRef.current
        const newScrollLeft = activeBtn.offsetLeft - 16
        container.scrollTo({ left: newScrollLeft, behavior: "auto" })
      }
    }
  }, [activeSubTab])

  const activeFeed = tabData[activeSlug] || { products: [], page: 0, hasMore: true }

  // Fetch products for a slug
  const loadPage = useCallback(
    async (slug: string, nextPage: number) => {
      let url = `/api/products/newest?page=${nextPage}&limit=12`
      
      if (slug !== "all") {
        url += `&category=${slug}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      return data as {
        products?: UIProduct[]
        hasMore?: boolean
      }
    },
    []
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
    
    // If we don't have products, fetch them
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
        // Deduplicate
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
      // Clicked L1
      handleSubTabChange(category.slug)
    } else {
      // Clicked L2
      // Set deep path to just this L2 (resetting any deeper selection)
      setActiveDeepPath([category])
      setSelectedPill(null)
    }
  }

  const handleBackToL1 = () => {
    setActiveSubTab(null)
    setActiveDeepPath([])
    setSelectedPill(null)
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


  const handleTabChange = (slug: string) => {
    if (slug === activeTab) return
    setActiveTab(slug)
    setActiveSubTab(null)
    setActiveDeepPath([])
    setSelectedPill(null)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  const handleSubTabChange = (slug: string) => {
    if (slug === activeSubTab) {
      // Deselect L1 -> Go back to L0
      setActiveSubTab(null)
      setActiveDeepPath([])
      setSelectedPill(null)
    } else {
      setActiveSubTab(slug)
      setActiveDeepPath([]) // Reset deep path when switching L1
      setSelectedPill(null)
    }
  }

  const handlePillClick = (category: Category) => {
    if (selectedPill?.slug === category.slug) {
      // Already selected -> Drill down
      setActiveDeepPath(prev => [...prev, category])
      setSelectedPill(null)
      // Scroll pills container to start
      if (pillsContainerRef.current) {
        pillsContainerRef.current.scrollTo({ left: 0, behavior: "auto" })
      }
    } else {
      // Select as filter (keep siblings visible)
      setSelectedPill(category)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 
        1. Sticky Tabs Header 
        Temu style: Text tabs that slide
      */}
      <div 
        className="sticky z-30 bg-background border-b border-border/40"
        style={{ top: headerHeight }}
      >
        <div 
          ref={tabsContainerRef}
          className="relative flex items-center gap-6 overflow-x-auto no-scrollbar px-4"
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
              "shrink-0 py-3 text-sm font-medium relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              activeTab === "all"
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {locale === "bg" ? "Всички" : "All"}
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full" />
            )}
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
                "shrink-0 py-3 text-sm font-medium relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                activeTab === cat.slug
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {getCategoryName(cat, locale)}
              {activeTab === cat.slug && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 
        2. Subcategory Circles (L1 or L2)
        Temu style: Circles with icons/images. 
      */}
      <div className="bg-background py-2 min-h-[80px] border-b border-border/40">
        {activeTab === "all" ? (
          <div className="px-4">
            <StartSellingBanner locale={locale} className="w-full" />
          </div>
        ) : circlesToDisplay.length > 0 || showL2Circles ? (
          <div 
            ref={subTabsContainerRef}
            className="flex overflow-x-auto no-scrollbar gap-2 px-4 snap-x snap-mandatory items-start"
          >
            {/* Back Button (when showing L2) */}
            {showL2Circles && (
              <div className="flex flex-col items-center gap-1.5 shrink-0 snap-start w-12">
                <button
                  type="button"
                  onClick={handleBackToL1}
                  className="size-12 rounded-full border-2 border-border/40 bg-secondary/50 flex items-center justify-center"
                >
                  <CaretLeft size={20} weight="bold" className="text-primary/70" aria-hidden="true" />
                  <span className="sr-only">{locale === "bg" ? "Назад" : "Back"}</span>
                </button>
                <span className="text-[10px] text-center leading-tight text-muted-foreground w-full">
                  {locale === "bg" ? "Назад" : "Back"}
                </span>
              </div>
            )}

            {circlesToDisplay.map((sub) => {
              const isActive = showL2Circles 
                ? activeDeepPath[0]?.slug === sub.slug
                : activeSubTab === sub.slug

              return (
                <button
                  key={sub.slug}
                  type="button"
                  data-subtab={sub.slug}
                  onClick={() => handleCircleClick(sub)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 shrink-0 snap-start w-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    (showL2Circles ? activeDeepPath.length > 0 : activeSubTab) && !isActive 
                      ? "opacity-60" 
                      : "opacity-100"
                  )}
                >
                  <div className={cn(
                    "size-12 rounded-full border-2 flex items-center justify-center overflow-hidden",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border/40 bg-secondary/50"
                  )}>
                    {sub.image_url ? (
                      <img src={sub.image_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    ) : (
                      <span className={isActive ? "text-primary" : "text-primary/70"}>
                        {getCategoryIcon(sub.slug, { size: 20, weight: "duotone" })}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] text-center leading-tight line-clamp-2 w-full",
                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {getCategoryShortName(sub, locale)}
                  </span>
                </button>
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
        <div className="bg-background py-3 px-4 overflow-x-auto no-scrollbar" ref={pillsContainerRef}>
          <div className="flex gap-2 items-center">
            {/* Current Context Label (Only show if deeper than L2/Circles) */}
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
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
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
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
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
      <div className="pt-2">
        {activeFeed.products.length === 0 && !isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>{locale === "bg" ? "Няма намерени продукти" : "No products found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 px-2">
            {activeFeed.products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${activeSlug}`} // Force re-render on category change
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

        {/* Loading Indicator */}
        <div ref={loadMoreRef} className="py-4">
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
