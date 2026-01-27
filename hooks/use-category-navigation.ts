"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import type { UIProduct } from "@/lib/data/products"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

interface TabData {
  products: UIProduct[]
  page: number
  hasMore: boolean
}

// Cache children for any parent category (supports L3, L4, etc.)
interface ChildrenCache {
  [parentId: string]: Category[]
}

export interface UseCategoryNavigationProps {
  initialCategories: Category[]
  defaultTab: string | null
  defaultSubTab: string | null
  defaultL2: string | null
  defaultL3: string | null
  tabsNavigateToPages: boolean
  l0Style: "tabs" | "pills"
  initialProducts: UIProduct[]
  /** Which category slug the initialProducts are for. Defaults to "all". */
  initialProductsSlug?: string
  locale: string
  activeAllFilter: string
}

export interface UseCategoryNavigationReturn {
  // Navigation state
  activeTab: string
  activeL1: string | null
  activeL2: string | null
  activeL3: string | null
  selectedPill: string | null
  setSelectedPill: (pill: string | null) => void

  // Derived data
  currentL0: Category | undefined
  l1Categories: Category[]
  currentL1: Category | undefined
  l2Categories: Category[]
  currentL2: Category | undefined
  l3Categories: Category[]
  currentL3: Category | undefined
  l4Categories: Category[]
  circlesToDisplay: Category[]
  showL1Circles: boolean
  showL2Circles: boolean
  showL3Circles: boolean
  showL4Circles: boolean
  showPills: boolean
  isDrilledDown: boolean
  isL3Loading: boolean
  isL4Loading: boolean
  isLeafCategory: boolean
  activeSlug: string
  isAllTab: boolean
  activeCategoryName: string | null

  // Handlers
  handleTabChange: (slug: string) => void
  handleCircleClick: (category: Category) => void
  handleBack: () => void
  handlePillClick: (category: Category) => void
  updateUrl: (tab: string, l1: string | null) => void

  // Product feed state
  tabData: Record<string, TabData>
  setTabData: React.Dispatch<React.SetStateAction<Record<string, TabData>>>
  activeFeed: TabData
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  loadPage: (slug: string, nextPage: number) => Promise<{ products?: UIProduct[]; hasMore?: boolean }>
  loadMoreProducts: () => Promise<void>
  loadedSlugsRef: React.MutableRefObject<Set<string>>

  // Filter state
  filterQueryKey: string
}

export function useCategoryNavigation({
  initialCategories,
  defaultTab,
  defaultSubTab,
  defaultL2,
  defaultL3,
  tabsNavigateToPages,
  l0Style,
  initialProducts,
  initialProductsSlug = "all",
  locale,
  activeAllFilter,
}: UseCategoryNavigationProps): UseCategoryNavigationReturn {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Categories from server (L0→L1→L2 pre-loaded, L3 lazy-loaded on demand)
  const displayCategories = initialCategories

  // L3 cache: lazy-loaded children keyed by parent L2 id
  // Generic children cache for lazy-loaded categories (L3, L4, etc.)
  const [childrenCache, setChildrenCache] = useState<ChildrenCache>({})
  const [childrenLoading, setChildrenLoading] = useState<string | null>(null)
  
  // L3 navigation state (L4 becomes selectedPill)
  const [activeL3, setActiveL3] = useState<string | null>(null)

  // Initialize from URL params or props
  const urlInitialTab = searchParams.get("tab")
  const urlInitialSubTab = searchParams.get("sub")
  // Always default to "all" tab so promoted listings/recommendations show
  const pillsDefaultTab = "all"

  const initialTab = defaultTab || urlInitialTab || pillsDefaultTab
  const initialSubTab = defaultSubTab || urlInitialSubTab || null
  const initialL2 = defaultL2 ?? null
  const initialL3 = defaultL3 ?? null
  const initialActiveSlug = initialL3 ?? initialL2 ?? initialSubTab ?? initialTab

  // ==========================================================================
  // Navigation State
  // ==========================================================================
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [activeL1, setActiveL1] = useState<string | null>(initialSubTab)
  const [activeL2, setActiveL2] = useState<string | null>(initialL2)
  const [selectedPill, setSelectedPill] = useState<string | null>(initialL3)

  // Sync state with URL params when they change
  const urlTab = searchParams.get("tab")
  const urlSub = searchParams.get("sub")
  useEffect(() => {
    if (urlTab === null) return

    if (urlTab !== activeTab) {
      setActiveTab(urlTab)
      setActiveL2(null)
      setActiveL3(null)
      setSelectedPill(null)
    }

    if (urlSub !== activeL1) {
      setActiveL1(urlSub)
      setActiveL2(null)
      setActiveL3(null)
      setSelectedPill(null)
    }
  }, [urlTab, urlSub]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter state - detect filter/sort URL changes
  const filterQueryKey = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("tab")
    params.delete("sub")
    params.delete("page")
    return params.toString()
  }, [searchParams])

  // Product feed state
  const [isLoading, setIsLoading] = useState(false)
  const isMountedRef = useRef(true)
  const loadRequestIdRef = useRef(0)
  const [tabData, setTabData] = useState<Record<string, TabData>>(() => {
    // Only seed the bucket that matches what the server actually fetched
    // Homepage fetches "all" products, category pages fetch specific category products
    if (initialProducts.length === 0) {
      return {}
    }
    const seed: TabData = {
      products: initialProducts,
      page: 1,
      hasMore: initialProducts.length >= 12,
    }
    return { [initialProductsSlug]: seed }
  })

  const isAllTab = activeTab === "all"

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const beginLoading = useCallback(() => {
    const requestId = ++loadRequestIdRef.current
    if (isMountedRef.current) setIsLoading(true)
    return requestId
  }, [])

  const endLoading = useCallback((requestId: number) => {
    if (!isMountedRef.current) return
    if (loadRequestIdRef.current === requestId) setIsLoading(false)
  }, [])

  // ==========================================================================
  // Derived State
  // ==========================================================================

  const currentL0 = useMemo(
    () => displayCategories.find((c) => c.slug === activeTab),
    [displayCategories, activeTab]
  )

  const l1Categories = useMemo(() => currentL0?.children ?? [], [currentL0])

  const currentL1 = useMemo(
    () => l1Categories.find((c) => c.slug === activeL1),
    [l1Categories, activeL1]
  )

  const l2Categories = useMemo(() => currentL1?.children ?? [], [currentL1])

  const currentL2 = useMemo(
    () => l2Categories.find((c) => c.slug === activeL2),
    [l2Categories, activeL2]
  )

  // L3 categories - LAZY LOADED from cache
  const l3Categories = useMemo(() => {
    if (!currentL2) return []
    return childrenCache[currentL2.id] ?? []
  }, [currentL2, childrenCache])

  const currentL3 = useMemo(
    () => l3Categories.find((c) => c.slug === activeL3),
    [l3Categories, activeL3]
  )

  // L4 categories - LAZY LOADED from cache
  const l4Categories = useMemo(() => {
    if (!currentL3) return []
    return childrenCache[currentL3.id] ?? []
  }, [currentL3, childrenCache])

  // Generic fetch children for any parent category
  const fetchChildrenFor = useCallback(async (parentId: string) => {
    if (childrenCache[parentId] || childrenLoading === parentId) return
    
    setChildrenLoading(parentId)
    try {
      const res = await fetch(`/api/categories/${parentId}/children`)
      if (!res.ok) throw new Error("Failed to fetch child categories")
      const data = await res.json()
      setChildrenCache((prev) => ({
        ...prev,
        [parentId]: data.children || [],
      }))
    } catch (err) {
      console.error("Failed to load child categories:", err)
      setChildrenCache((prev) => ({ ...prev, [parentId]: [] }))
    } finally {
      setChildrenLoading(null)
    }
  }, [childrenCache, childrenLoading])

  // Fetch L3 children when L2 is selected
  useEffect(() => {
    if (!currentL2) return
    fetchChildrenFor(currentL2.id)
  }, [currentL2?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch L4 children when L3 is selected
  useEffect(() => {
    if (!currentL3) return
    fetchChildrenFor(currentL3.id)
  }, [currentL3?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ==========================================================================
  // Visual Drill-Down Navigation (Temu-style continuous circles)
  // ==========================================================================
  // Keep showing circles at each level until we reach a leaf category:
  //   - L0 selected → show L1 circles (Men's, Women's, Kids)
  //   - L1 selected → show L2 circles (Clothing, Shoes, Accessories)
  //   - L2 selected → show L3 circles (T-Shirts, Pants, Jackets)
  //   - L3 selected → show L4 circles (if any)
  //   - L4 selected OR leaf reached → show banner + products
  // ==========================================================================

  const isL3Loading = !!currentL2 && childrenLoading === currentL2.id
  const isL4Loading = !!currentL3 && childrenLoading === currentL3.id
  
  // Check if we're at a leaf category (fetched but no children)
  const isL3Leaf = !!currentL3 && childrenCache[currentL3.id] !== undefined && (childrenCache[currentL3.id]?.length ?? 0) === 0
  const isL4Selected = !!selectedPill
  const isLeafCategory = isL3Leaf || isL4Selected

  // Determine which circles to show based on current drill-down level
  // Keep showing current level while next level is loading
  const showL1Circles = !activeL1 && l1Categories.length > 0
  const showL2Circles = !!activeL1 && (!activeL2 || isL3Loading) && l2Categories.length > 0
  const showL3Circles = !!activeL2 && (!activeL3 || isL4Loading) && l3Categories.length > 0
  const showL4Circles = !!activeL3 && !selectedPill && !isL3Leaf && l4Categories.length > 0

  const circlesToDisplay = showL4Circles
    ? l4Categories
    : showL3Circles
      ? l3Categories
      : showL2Circles
        ? l2Categories
        : showL1Circles
          ? l1Categories
          : []

  // Only show pills when at deepest level
  const isDrilledDown = isLeafCategory
  // we still want the "back pill" row to exist and not fall back to circles.
  const showPills = isDrilledDown

  // Effective category slug for fetching products
  const activeSlug = useMemo(() => {
    if (selectedPill) return selectedPill
    if (activeL3) return activeL3
    if (activeL2) return activeL2
    if (activeL1) return activeL1
    return activeTab
  }, [selectedPill, activeL3, activeL2, activeL1, activeTab])

  // Get current category name for empty state
  const activeCategoryName = useMemo(() => {
    if (selectedPill) {
      const pill = l4Categories.find((c) => c.slug === selectedPill)
      return pill ? getCategoryName(pill, locale) : null
    }
    if (activeL3 && currentL3) return getCategoryName(currentL3, locale)
    if (activeL2 && currentL2) return getCategoryName(currentL2, locale)
    if (activeL1 && currentL1) return getCategoryName(currentL1, locale)
    if (activeTab !== "all" && currentL0) return getCategoryName(currentL0, locale)
    return null
  }, [
    selectedPill,
    activeL3,
    activeL2,
    activeL1,
    activeTab,
    currentL0,
    currentL1,
    currentL2,
    currentL3,
    l4Categories,
    locale,
  ])

  // Current feed data
  const activeFeed = tabData[activeSlug] ?? { products: [], page: 0, hasMore: true }

  // ==========================================================================
  // Data Fetching
  // ==========================================================================

  const loadPage = useCallback(
    async (slug: string, nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(nextPage))
      params.set("limit", "12")

      if (slug !== "all") {
        params.set("category", slug)
      } else {
        params.delete("category")
      }

      if (slug === "all" && activeAllFilter === "promoted") {
        params.set("type", "promoted")
      } else {
        params.delete("type")
      }

      const url = `/api/products/newest?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()
      return data as { products?: UIProduct[]; hasMore?: boolean }
    },
    [activeAllFilter, searchParams]
  )

  // Track which slugs have been loaded
  // Only mark initialProductsSlug as loaded (that's what server actually fetched)
  const loadedSlugsRef = useRef<Set<string>>(
    new Set(initialProducts.length > 0 ? [initialProductsSlug] : [])
  )

  const lastFilterQueryKeyRef = useRef<string>(filterQueryKey)
  useEffect(() => {
    if (lastFilterQueryKeyRef.current === filterQueryKey) return
    lastFilterQueryKeyRef.current = filterQueryKey

    loadedSlugsRef.current.delete(activeSlug)
    setTabData((prev) => ({
      ...prev,
      [activeSlug]: { products: [], page: 0, hasMore: true },
    }))
  }, [filterQueryKey, activeSlug])

  // Load initial products for a slug if empty
  useEffect(() => {
    if (loadedSlugsRef.current.has(activeSlug)) return

    loadedSlugsRef.current.add(activeSlug)

    let cancelled = false
    let completed = false
    const requestId = beginLoading()

    loadPage(activeSlug, 1)
      .then((data) => {
        if (cancelled) return
        completed = true
        const first = data.products || []
        setTabData((prev) => ({
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
      .finally(() => endLoading(requestId))

    return () => {
      cancelled = true
      if (!completed) loadedSlugsRef.current.delete(activeSlug)
    }
  }, [activeSlug, beginLoading, endLoading, loadPage])

  // Load more products (infinite scroll)
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !activeFeed.hasMore) return

    const requestId = beginLoading()
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

      setTabData((prev) => {
        const current = prev[activeSlug] || { products: [], page: 0, hasMore: true }
        const existingIds = new Set(current.products.map((p) => p.id))
        const uniqueNewProducts = nextProducts.filter((p) => !existingIds.has(p.id))

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
      endLoading(requestId)
    }
  }, [
    activeFeed.hasMore,
    activeFeed.page,
    activeSlug,
    beginLoading,
    endLoading,
    isLoading,
    loadPage,
  ])

  // ==========================================================================
  // Navigation Handlers
  // ==========================================================================

  const updateUrl = useCallback(
    (tab: string, l1: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (tab !== "all") params.set("tab", tab)
      else params.delete("tab")
      if (l1) params.set("sub", l1)
      else params.delete("sub")
      params.delete("page")

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      window.history.replaceState(null, "", newUrl)
    },
    [pathname, searchParams]
  )

  const handleTabChange = useCallback(
    (slug: string) => {
      if (slug === activeTab) return

      if (tabsNavigateToPages) {
        if (slug === "all") {
          router.push("/categories")
        } else {
          router.push(`/categories/${slug}`)
        }
        return
      }

      setActiveTab(slug)
      setActiveL1(null)
      setActiveL2(null)
      setActiveL3(null)
      setSelectedPill(null)
      updateUrl(slug, null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [activeTab, tabsNavigateToPages, router, updateUrl]
  )

  const handleCircleClick = useCallback(
    (category: Category) => {
      // Determine category level based on which list it belongs to
      const isL1Category = l1Categories.some((c) => c.slug === category.slug)
      const isL2Category = l2Categories.some((c) => c.slug === category.slug)
      const isL3Category = l3Categories.some((c) => c.slug === category.slug)
      const isL4Category = l4Categories.some((c) => c.slug === category.slug)
      
      if (isL1Category) {
        // Clicking an L1 category - update L1 selection, reset deeper levels
        setActiveL1(category.slug)
        setActiveL2(null)
        setActiveL3(null)
        setSelectedPill(null)
        updateUrl(activeTab, category.slug)
      } else if (isL2Category) {
        // Clicking an L2 category - update L2 selection
        setActiveL2(category.slug)
        setActiveL3(null)
        setSelectedPill(null)
      } else if (isL3Category) {
        // Clicking an L3 category - update L3 selection
        setActiveL3(category.slug)
        setSelectedPill(null)
      } else if (isL4Category) {
        // Clicking an L4 category - set as selected pill (deepest level)
        setSelectedPill(category.slug)
      }
    },
    [activeTab, updateUrl, l1Categories, l2Categories, l3Categories, l4Categories]
  )

  const handleBack = useCallback(() => {
    if (selectedPill) {
      setSelectedPill(null)
    } else if (activeL3) {
      setActiveL3(null)
      setSelectedPill(null)
    } else if (activeL2) {
      setActiveL2(null)
      setActiveL3(null)
      setSelectedPill(null)
    } else if (activeL1) {
      setActiveL1(null)
      setActiveL2(null)
      setActiveL3(null)
      setSelectedPill(null)
      updateUrl(activeTab, null)
    }
  }, [selectedPill, activeL3, activeL2, activeL1, activeTab, updateUrl])

  const handlePillClick = useCallback(
    (category: Category) => {
      if (selectedPill === category.slug) {
        setSelectedPill(null)
      } else {
        setSelectedPill(category.slug)
      }
    },
    [selectedPill]
  )

  return {
    // Navigation state
    activeTab,
    activeL1,
    activeL2,
    activeL3,
    selectedPill,
    setSelectedPill,

    // Derived data
    currentL0,
    l1Categories,
    currentL1,
    l2Categories,
    currentL2,
    l3Categories,
    currentL3,
    l4Categories,
    circlesToDisplay,
    showL1Circles,
    showL2Circles,
    showL3Circles,
    showL4Circles,
    showPills,
    isDrilledDown,
    isL3Loading,
    isL4Loading,
    isLeafCategory,
    activeSlug,
    isAllTab,
    activeCategoryName,

    // Handlers
    handleTabChange,
    handleCircleClick,
    handleBack,
    handlePillClick,
    updateUrl,

    // Product feed state
    tabData,
    setTabData,
    activeFeed,
    isLoading,
    setIsLoading,
    loadPage,
    loadMoreProducts,
    loadedSlugsRef,

    // Filter state
    filterQueryKey,
  }
}
