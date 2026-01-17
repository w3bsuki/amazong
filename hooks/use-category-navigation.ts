"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useRouter } from "@/i18n/routing"
import { usePathname, useSearchParams } from "next/navigation"
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

interface L3Cache {
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
  selectedPill: string | null
  setSelectedPill: (pill: string | null) => void

  // Derived data
  currentL0: Category | undefined
  l1Categories: Category[]
  currentL1: Category | undefined
  l2Categories: Category[]
  currentL2: Category | undefined
  l3Categories: Category[]
  circlesToDisplay: Category[]
  showL1Circles: boolean
  showL2Circles: boolean
  showPills: boolean
  isDrilledDown: boolean // Treido pattern: true when circles hidden, pills visible
  isL3Loading: boolean
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
  const [l3Cache, setL3Cache] = useState<L3Cache>({})
  const [l3Loading, setL3Loading] = useState<string | null>(null)

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
      setSelectedPill(null)
    }

    if (urlSub !== activeL1) {
      setActiveL1(urlSub)
      setActiveL2(null)
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
    return l3Cache[currentL2.id] ?? []
  }, [currentL2, l3Cache])

  // Fetch L3 children when L2 is selected
  useEffect(() => {
    if (!currentL2) return
    if (l3Cache[currentL2.id] || l3Loading === currentL2.id) return

    const fetchL3 = async () => {
      setL3Loading(currentL2.id)
      try {
        const res = await fetch(`/api/categories/${currentL2.id}/children`)
        if (!res.ok) throw new Error("Failed to fetch L3 categories")
        const data = await res.json()
        setL3Cache((prev) => ({
          ...prev,
          [currentL2.id]: data.children || [],
        }))
      } catch (err) {
        console.error("Failed to load L3 categories:", err)
        setL3Cache((prev) => ({ ...prev, [currentL2.id]: [] }))
      } finally {
        setL3Loading(null)
      }
    }

    fetchL3()
  }, [currentL2, l3Cache, l3Loading])

  // ==========================================================================
  // Visual Drill-Down Navigation (Treido-mock pattern)
  // ==========================================================================
  // KEY INSIGHT: Never show circles AND pills at the same time!
  //
  // STATE A (Showroom): Show circles, NO pills
  //   - L1 circles when no L1 selected
  //   - L2 circles when L1 selected but no L2 selected
  //
  // STATE B (Drilled Down): NO circles, show morphed back pill + L3 pills
  //   - When L2 is selected, circles HIDE completely
  //   - The active L2 morphs into a dark "back pill" with icon + X
  //   - L3 subcategories appear as text pills next to the back pill
  // ==========================================================================

  const isDrilledDown = !!activeL2 // STATE B: circles hidden, pills visible
  const isL3Loading = !!currentL2 && l3Loading === currentL2.id

  // Determine what to show based on drill-down state
  const showL1Circles = !isDrilledDown && !activeL1 && l1Categories.length > 0
  const showL2Circles = !isDrilledDown && !!activeL1 && l2Categories.length > 0
  const circlesToDisplay = isDrilledDown
    ? [] // STATE B: No circles!
    : showL2Circles
      ? l2Categories
      : showL1Circles
        ? l1Categories
        : []

  // Pills shown in drilled-down state (STATE B). Even if L3 is empty/not loaded yet,
  // we still want the "back pill" row to exist and not fall back to circles.
  const showPills = isDrilledDown

  // Effective category slug for fetching products
  const activeSlug = useMemo(() => {
    if (selectedPill) return selectedPill
    if (activeL2) return activeL2
    if (activeL1) return activeL1
    return activeTab
  }, [selectedPill, activeL2, activeL1, activeTab])

  // Get current category name for empty state
  const activeCategoryName = useMemo(() => {
    if (selectedPill) {
      const pill = l3Categories.find((c) => c.slug === selectedPill)
      return pill ? getCategoryName(pill, locale) : null
    }
    if (activeL2 && currentL2) return getCategoryName(currentL2, locale)
    if (activeL1 && currentL1) return getCategoryName(currentL1, locale)
    if (activeTab !== "all" && currentL0) return getCategoryName(currentL0, locale)
    return null
  }, [
    selectedPill,
    activeL2,
    activeL1,
    activeTab,
    currentL0,
    currentL1,
    currentL2,
    l3Categories,
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
      setSelectedPill(null)
      updateUrl(slug, null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [activeTab, tabsNavigateToPages, router, updateUrl]
  )

  const handleCircleClick = useCallback(
    (category: Category) => {
      if (!activeL1) {
        setActiveL1(category.slug)
        setActiveL2(null)
        setSelectedPill(null)
        updateUrl(activeTab, category.slug)
      } else {
        setActiveL2(category.slug)
        setSelectedPill(null)
      }
    },
    [activeL1, activeTab, updateUrl]
  )

  const handleBack = useCallback(() => {
    if (selectedPill) {
      setSelectedPill(null)
    } else if (activeL2) {
      setActiveL2(null)
      setSelectedPill(null)
    } else if (activeL1) {
      setActiveL1(null)
      setActiveL2(null)
      setSelectedPill(null)
      updateUrl(activeTab, null)
    }
  }, [selectedPill, activeL2, activeL1, activeTab, updateUrl])

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
    selectedPill,
    setSelectedPill,

    // Derived data
    currentL0,
    l1Categories,
    currentL1,
    l2Categories,
    currentL2,
    l3Categories,
    circlesToDisplay,
    showL1Circles,
    showL2Circles,
    showPills,
    isDrilledDown,
    isL3Loading,
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
