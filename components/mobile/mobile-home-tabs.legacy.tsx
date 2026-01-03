"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategoryShortName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import type { UIProduct } from "@/lib/data/products"
import { Link, useRouter } from "@/i18n/routing"
import { CaretLeft, CaretRight, Megaphone, Clock, Sparkle, Storefront, TrendUp, ListBullets } from "@phosphor-icons/react"
import { usePathname, useSearchParams } from "next/navigation"
import { MobileFilters } from "@/components/shared/filters/mobile-filters"
import { SortSelect } from "@/components/shared/search/sort-select"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

interface MobileHomeTabsProps {
  initialProducts: UIProduct[]
  /** Categories with children from server (L0→L1→L2 pre-loaded, L3 lazy) */
  initialCategories?: Category[]
  defaultTab?: string | null
  defaultSubTab?: string | null
  defaultL2?: string | null
  defaultL3?: string | null
  showBanner?: boolean
  pageTitle?: string | null
  /** Hide the L0 sticky tab header (useful when a parent layout already provides tabs). */
  showL0Tabs?: boolean
  /** L0 navigation style: "tabs" (default underline tabs) or "pills" (compact quick pills) */
  l0Style?: "tabs" | "pills"
  /**
   * When true, clicking L0 tabs navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of updating query params.
   */
  tabsNavigateToPages?: boolean
  /**
   * When true, clicking L1/L2 circles navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of drilling down within tabs.
   */
  circlesNavigateToPages?: boolean
  /** Locale from server - avoids useLocale() hydration issues */
  locale?: string
  /** Filterable attributes for the current category (for filter drawer) */
  filterableAttributes?: Array<{
    id: string
    category_id: string | null
    name: string
    name_bg: string | null
    attribute_type: 'select' | 'multiselect' | 'boolean' | 'number' | 'text'
    options: string[] | null
    options_bg: string[] | null
    placeholder?: string | null
    placeholder_bg?: string | null
    is_filterable: boolean | null
    is_required: boolean | null
    sort_order: number | null
    validation_rules?: unknown | null
  }>
}

interface TabData {
  products: UIProduct[]
  page: number
  hasMore: boolean
}

// L3 children fetched on demand (lazy-loaded)
interface L3Cache {
  [parentId: string]: Category[]
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-1 px-1">
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

function PillsSkeleton() {
  return (
    <div className="flex gap-2 items-center animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full" />
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
  defaultL2 = null,
  defaultL3 = null,
  showBanner = true,
  pageTitle = null,
  showL0Tabs = true,
  l0Style = "tabs",
  tabsNavigateToPages = false,
  circlesNavigateToPages = false,
  locale: localeProp,
  filterableAttributes = [],
}: MobileHomeTabsProps) {
  const intlLocale = useLocale()
  const locale = localeProp || intlLocale
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [headerHeight, setHeaderHeight] = useState(0)

  // Categories from server (L0→L1→L2 pre-loaded, L3 lazy-loaded on demand)
  const displayCategories = initialCategories
  
  // L3 cache: lazy-loaded children keyed by parent L2 id
  const [l3Cache, setL3Cache] = useState<L3Cache>({})
  const [l3Loading, setL3Loading] = useState<string | null>(null)

  // Initialize from URL params or props.
  // IMPORTANT: On `/categories` we want the quick pills + circles experience by default.
  // If there's no `?tab=`, prefer the first root category (pills mode) instead of "all"
  // (which would render the homepage-like "All" feed and no circles).
  const urlInitialTab = searchParams.get('tab')
  const urlInitialSubTab = searchParams.get('sub')
  const pillsDefaultTab =
    l0Style === "pills" && displayCategories.length > 0
      ? displayCategories[0]!.slug
      : "all"

  const initialTab = defaultTab || urlInitialTab || pillsDefaultTab
  const initialSubTab = defaultSubTab || urlInitialSubTab || null
  const initialL2 = defaultL2 ?? null
  const initialL3 = defaultL3 ?? null
  const initialActiveSlug = initialL3 ?? initialL2 ?? initialSubTab ?? initialTab

  // ==========================================================================
  // Navigation State - Simple hierarchy: L0 → L1 → L2 → L3 (pill)
  // ==========================================================================
  const [activeTab, setActiveTab] = useState<string>(initialTab)       // L0 category slug
  const [activeL1, setActiveL1] = useState<string | null>(initialSubTab) // L1 category slug
  const [activeL2, setActiveL2] = useState<string | null>(initialL2)        // L2 category slug
  const [selectedPill, setSelectedPill] = useState<string | null>(initialL3) // L3 pill slug

  // Sync state with URL params when they change (e.g. from drawer navigation)
  // IMPORTANT: Only sync from URL when the URL actually provides `tab`.
  // Category pages like `/[locale]/categories/[slug]` pass defaults via props but
  // do not include `?tab=...`; treating missing `tab` as `all` causes a hydration
  // flip after ~1s ("works then breaks") when the effect runs.
  const urlTab = searchParams.get('tab')
  const urlSub = searchParams.get('sub')
  useEffect(() => {
    // If `tab` is absent, defaults are driving initial state; do not override.
    if (urlTab === null) return

    if (urlTab !== activeTab) {
      setActiveTab(urlTab)
      setActiveL2(null)
      setSelectedPill(null)
    }

    // When URL controls state, treat missing `sub` as "no sub".
    if (urlSub !== activeL1) {
      setActiveL1(urlSub)
      setActiveL2(null)
      setSelectedPill(null)
    }
  }, [urlTab, urlSub]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest")

  // Detect filter/sort URL changes (ignore tab/sub/page, which are controlled internally).
  // When these change, we need to refetch products; otherwise the UI would show stale results.
  const filterQueryKey = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tab')
    params.delete('sub')
    params.delete('page')
    return params.toString()
  }, [searchParams])

  // Product feed state
  const [isLoading, setIsLoading] = useState(false)
  const [tabData, setTabData] = useState<Record<string, TabData>>(() => {
    const seed: TabData = {
      products: initialProducts,
      page: 1,
      hasMore: initialProducts.length >= 12,
    }
    return {
      all: seed,
      ...(initialActiveSlug !== "all" ? { [initialActiveSlug]: seed } : null),
    }
  })

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

  // L3 categories - LAZY LOADED from cache (not server-provided)
  // This reduces initial payload from ~400KB to ~60KB (13K → 3.4K categories)
  const l3Categories = useMemo(() => {
    if (!currentL2) return []
    // Check cache first, otherwise return empty (will trigger fetch)
    return l3Cache[currentL2.id] ?? []
  }, [currentL2, l3Cache])

  // Fetch L3 children when L2 is selected (lazy loading)
  useEffect(() => {
    if (!currentL2) return
    
    // Already cached or loading
    if (l3Cache[currentL2.id] || l3Loading === currentL2.id) return
    
    const fetchL3 = async () => {
      setL3Loading(currentL2.id)
      try {
        // Use existing /api/categories/[slug]/children endpoint
        // The "slug" param accepts a category ID for fetching children
        const res = await fetch(`/api/categories/${currentL2.id}/children`)
        if (!res.ok) throw new Error('Failed to fetch L3 categories')
        const data = await res.json()
        setL3Cache(prev => ({
          ...prev,
          [currentL2.id]: data.children || []
        }))
      } catch (err) {
        console.error('Failed to load L3 categories:', err)
        // Cache empty array to prevent retry spam
        setL3Cache(prev => ({ ...prev, [currentL2.id]: [] }))
      } finally {
        setL3Loading(null)
      }
    }
    
    fetchL3()
  }, [currentL2, l3Cache, l3Loading])

  // Determine what to show
  const showL1Circles = !activeL1 && l1Categories.length > 0
  const showL2Circles = !!activeL1 && l2Categories.length > 0
  const circlesToDisplay = showL2Circles ? l2Categories : (showL1Circles ? l1Categories : [])

  // Show L3 pills when L2 is selected (either loading or has data)
  const isL3Loading = !!currentL2 && l3Loading === currentL2.id
  const showPills = !!activeL2 && (l3Categories.length > 0 || isL3Loading)

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
    const header = document.querySelector("header")

    const update = () => {
      if (!(header instanceof HTMLElement)) {
        setHeaderHeight(0)
        return
      }

      // The site header is typically `position: sticky` and already occupies space
      // in normal document flow. Applying its height as a sticky `top` offset would
      // make our own sticky bars become "stuck" immediately and visually slide down,
      // causing the quick pills to appear under the circles (and creating a blank gap).
      const headerPosition = getComputedStyle(header).position
      setHeaderHeight(headerPosition === "fixed" ? header.offsetHeight : 0)
    }

    update()

    // Header height can change after hydration (auth, country, subheader, etc.).
    // ResizeObserver keeps sticky offsets stable instead of "breaking" after a few seconds.
    const ro =
      header && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null

    if (ro && header) ro.observe(header)

    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      ro?.disconnect()
    }
  }, [])

  // Auto-scroll selected tab to left edge (respecting container padding)
  useEffect(() => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const activeBtn = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
      if (activeBtn) {
        const padding = Number.parseFloat(getComputedStyle(container).paddingLeft)
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
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(nextPage))
      params.set('limit', '12')

      // Category selection (hierarchical handled server-side)
      if (slug !== "all") {
        params.set('category', slug)
      } else {
        params.delete('category')
      }

      // Home-only promoted filter maps to a feed type
      if (slug === 'all' && activeAllFilter === 'promoted') {
        params.set('type', 'promoted')
      } else {
        params.delete('type')
      }

      const url = `/api/products/newest?${params.toString()}`

      const response = await fetch(url)
      const data = await response.json()
      return data as {
        products?: UIProduct[]
        hasMore?: boolean
      }
    },
    [activeAllFilter, searchParams]
  )

  // Track which slugs have been loaded to prevent infinite loops
  const loadedSlugsRef = useRef<Set<string>>(new Set(["all"]))

  const lastFilterQueryKeyRef = useRef<string>(filterQueryKey)
  useEffect(() => {
    if (lastFilterQueryKeyRef.current === filterQueryKey) return
    lastFilterQueryKeyRef.current = filterQueryKey

    // Reset only the currently active feed; keep other tabs cached.
    loadedSlugsRef.current.delete(activeSlug)
    setTabData((prev) => ({
      ...prev,
      [activeSlug]: { products: [], page: 0, hasMore: true },
    }))
  }, [filterQueryKey, activeSlug])

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
    // Preserve existing search params (filters/sort) while updating tab/sub.
    const params = new URLSearchParams(searchParams.toString())
    if (tab !== 'all') params.set('tab', tab)
    else params.delete('tab')
    if (l1) params.set('sub', l1)
    else params.delete('sub')

    // Navigation changes should reset pagination.
    params.delete('page')

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    window.history.replaceState(null, '', newUrl)
  }, [pathname, searchParams])

  // Handle L0 tab change
  const handleTabChange = (slug: string) => {
    if (slug === activeTab) return
    
    // When tabsNavigateToPages is true, navigate to proper category page
    // for correct server-side filter fetching (SEO + proper filters)
    if (tabsNavigateToPages) {
      if (slug === 'all') {
        router.push('/categories')
      } else {
        router.push(`/categories/${slug}`)
      }
      return
    }
    
    // Client-side state update (fast UX but no server-side filter fetch)
    setActiveTab(slug)
    setActiveL1(null)
    setActiveL2(null)
    setSelectedPill(null)
    updateUrl(slug, null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle circle click (L1 or L2)
  const handleCircleClick = (category: Category) => {
    if (circlesNavigateToPages) return
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

  // Handle back button - goes back one level at a time
  const handleBack = () => {
    if (selectedPill) {
      // Go back from L3 pill to L2 level
      setSelectedPill(null)
    } else if (activeL2) {
      // Go back from L2 to L1 level
      setActiveL2(null)
      setSelectedPill(null)
    } else if (activeL1) {
      // Go back from L1 to L0 level
      setActiveL1(null)
      setActiveL2(null)
      setSelectedPill(null)
      updateUrl(activeTab, null)
    }
  }

  // Handle back button (go from L2 back to L1) - legacy, kept for compatibility
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
        1. Sticky Tabs Header (L0) - Two variants: tabs (underline) or pills (compact)
      */}
      {showL0Tabs && l0Style === "tabs" && (
        <div
          className="sticky z-30 bg-background border-b border-border/40"
          style={{ top: headerHeight }}
        >
          <div
            ref={tabsContainerRef}
            className="relative flex items-center gap-3 overflow-x-auto no-scrollbar px-(--page-inset)"
            role="tablist"
          >
            {/* "All" Tab - Use Link when navigating to pages for prefetch */}
            {tabsNavigateToPages ? (
              <Link
                href="/categories"
                role="tab"
                data-tab="all"
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
              </Link>
            ) : (
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
            )}

            {/* Category Tabs - Use Link when navigating to pages for prefetch */}
            {displayCategories.map((cat) => 
              tabsNavigateToPages ? (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  role="tab"
                  data-tab={cat.slug}
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
                </Link>
              ) : (
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
              )
            )}
          </div>
        </div>
      )}

      {/* 
        1b. Quick Pills variant for L0 (compact rounded pills)
      */}
      {showL0Tabs && l0Style === "pills" && (
        <div
          className="sticky z-30 bg-background border-b border-border/40"
          style={{ top: headerHeight }}
        >
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-(--page-inset) py-2"
            role="tablist"
          >
            {/* "All" Pill - Use Link when navigating to pages for prefetch */}
            {tabsNavigateToPages ? (
              <Link
                href="/categories"
                role="tab"
                data-tab="all"
                aria-selected={activeTab === "all"}
                className={cn(
                  "shrink-0 h-7 px-3 text-xs font-medium rounded-full whitespace-nowrap",
                  "flex items-center justify-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  "transition-colors",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {locale === "bg" ? "Всички" : "All"}
              </Link>
            ) : (
              <button
                type="button"
                role="tab"
                data-tab="all"
                onClick={() => handleTabChange("all")}
                aria-selected={activeTab === "all"}
                className={cn(
                  "shrink-0 h-7 px-3 text-xs font-medium rounded-full whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  "transition-colors",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {locale === "bg" ? "Всички" : "All"}
              </button>
            )}

            {/* Category Pills - Use Link when navigating to pages for prefetch */}
            {displayCategories.map((cat) =>
              tabsNavigateToPages ? (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  role="tab"
                  data-tab={cat.slug}
                  aria-selected={activeTab === cat.slug}
                  className={cn(
                    "shrink-0 h-7 px-3 text-xs font-medium rounded-full whitespace-nowrap",
                    "flex items-center justify-center",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "transition-colors",
                    activeTab === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {getCategoryName(cat, locale)}
                </Link>
              ) : (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  data-tab={cat.slug}
                  onClick={() => handleTabChange(cat.slug)}
                  aria-selected={activeTab === cat.slug}
                  className={cn(
                    "shrink-0 h-7 px-3 text-xs font-medium rounded-full whitespace-nowrap",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "transition-colors",
                    activeTab === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {getCategoryName(cat, locale)}
                </button>
              )
            )}
          </div>
        </div>
      )}

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
        Note: All-tab quick filters should be available in both styles.
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
        ) : !isAllTab ? (
          <div className="px-(--page-inset) flex items-start justify-between gap-3">
            {/* Always show back button when deeper than L0, even if no circles to display */}
            {(circlesToDisplay.length > 0 || activeL1) ? (
              <div
                ref={subTabsContainerRef}
                className="flex-1 flex overflow-x-auto no-scrollbar gap-2 snap-x snap-mandatory items-start"
              >
                {/* Back Button - shows when L1 or deeper is selected */}
                {activeL1 && (
                  <div className="flex flex-col items-center gap-1 shrink-0 snap-start w-14">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="size-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center hover:bg-brand/20 transition-colors duration-100"
                    >
                      <CaretLeft size={22} weight="bold" className="text-brand" aria-hidden="true" />
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

                  // When circlesNavigateToPages is true, navigate to the category's own page
                  // NOT a nested URL - just /categories/{slug} since that's our route structure
                  const href = circlesNavigateToPages && activeTab !== "all"
                    ? (`/categories/${sub.slug}` as const)
                    : undefined

                  return (
                    <CategoryCircle
                      key={sub.slug}
                      category={sub}
                      {...(href ? { href } : { onClick: () => handleCircleClick(sub) })}
                      active={isActive}
                      dimmed={dimmed}
                      circleClassName="size-(--category-circle-mobile)"
                      fallbackIconSize={24}
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
            ) : (
              <div className="flex-1" />
            )}
          </div>
        ) : null}
      </div>

      {/* 
        3. Deep Navigation Pills (L3)
        Revealed when L2 is selected. Lazy-loaded from API.
        Must appear ABOVE the filter/sort row per design.
      */}
      {showPills && (
        <div className="bg-background py-3 px-(--page-inset) overflow-x-auto no-scrollbar" ref={pillsContainerRef}>
          {isL3Loading ? (
            <PillsSkeleton />
          ) : (
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
          )}
        </div>
      )}

      {/*
        Mobile Filter + Sort toolbar with results count
        - Required on /categories (quick pills + circles) so users can filter/sort the feed.
        - Keep it off the homepage default tabs mode to avoid clutter.
        - Appears BELOW the quick pills per design.
      */}
      {l0Style === "pills" && (
        <div className="bg-background border-b border-border/40 px-(--page-inset) py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <MobileFilters locale={locale} attributes={filterableAttributes} />
            </div>
            <div className="flex-1">
              <SortSelect />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <ListBullets size={14} aria-hidden="true" />
              {activeFeed.products.length}
            </span>
          </div>
        </div>
      )}

      {/*
        "View all" link - ONLY on HOMEPAGE (tabs mode) to navigate to /categories
        This makes no sense on /categories page itself - you're already there!
      */}
      {l0Style === "tabs" && !isAllTab && activeSlug !== "all" && (
        <div className="bg-background px-(--page-inset) pt-2 pb-3 border-b border-border/40">
          <Link
            href={`/categories/${activeSlug}`}
            aria-label={locale === "bg" ? "Виж всички" : "View all"}
            className={cn(
              "w-full",
              "h-8 rounded-lg",
              "inline-flex items-center justify-between gap-2",
              "bg-secondary text-secondary-foreground",
              "border border-border/50",
              "px-3",
              "text-xs font-medium",
              "hover:bg-secondary/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            )}
          >
            <span className="whitespace-nowrap">
              {locale === "bg" ? "Виж всички" : "View all"}
            </span>
            <CaretRight size={14} weight="bold" aria-hidden="true" />
          </Link>
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
          <div className="grid grid-cols-2 gap-1 px-1">
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
                username={product.storeSlug ?? null}
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
