import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"

type CategoryLite = {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  icon?: string | null
  image_url?: string | null
}

type CategoryContextResponse = {
  current: CategoryLite
  parent: CategoryLite | null
  siblings: CategoryLite[]
  children: CategoryLite[]
  attributes: CategoryAttribute[]
}

type FeedState = {
  products: UIProduct[]
  page: number
  hasMore: boolean
}

function toDisplayName(locale: string, cat: { name: string; name_bg: string | null }): string {
  return locale === "bg" && cat.name_bg ? cat.name_bg : cat.name
}

function withoutAttrParams(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params.toString())
  for (const key of next.keys()) {
    if (key.startsWith("attr_")) next.delete(key)
  }
  return next
}

/**
 * Update URL for category navigation.
 * - For filters: use replaceState (no history entry)
 * - For category changes: use pushState (proper back button support)
 */
function updateUrl(nextPath: string, createHistoryEntry: boolean) {
  try {
    if (createHistoryEntry) {
      window.history.pushState(null, "", nextPath)
    } else {
      window.history.replaceState(null, "", nextPath)
    }
  } catch {
    // Non-blocking; URL sync is a UX enhancement.
  }
}

function buildCategoryPathname(options: {
  locale: string
  slug: string
  parentSlug?: string | null
}) {
  const { locale, slug, parentSlug } = options
  const encodedSlug = encodeURIComponent(slug)
  if (parentSlug) {
    return `/${locale}/categories/${encodeURIComponent(parentSlug)}/${encodedSlug}`
  }
  return `/${locale}/categories/${encodedSlug}`
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { method: "GET", credentials: "same-origin", signal: signal ?? null })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export function useInstantCategoryBrowse(options: {
  enabled: boolean
  locale: string
  /** Initial category slug (the route slug) */
  initialSlug: string
  initialTitle: string
  initialCategoryId: string | undefined
  initialParent: CategoryLite | null
  initialChildren: CategoryLite[]
  initialSiblings: CategoryLite[]
  initialAttributes: CategoryAttribute[]
  initialProducts: UIProduct[]
  /** Initial querystring without leading ? (from server searchParams) */
  initialQueryString?: string
}) {
  const {
    enabled,
    locale,
    initialSlug,
    initialTitle,
    initialCategoryId,
    initialParent,
    initialChildren,
    initialSiblings,
    initialAttributes,
    initialProducts,
    initialQueryString = "",
  } = options

  const [categorySlug, setCategorySlugState] = useState(initialSlug)
  const [categoryId, setCategoryId] = useState<string | undefined>(initialCategoryId)
  const [categoryTitle, setCategoryTitle] = useState(initialTitle)
  const [parent, setParent] = useState<CategoryLite | null>(initialParent)
  const [children, setChildren] = useState<CategoryLite[]>(initialChildren)
  const [siblings, setSiblings] = useState<CategoryLite[]>(initialSiblings)
  const [attributes, setAttributes] = useState<CategoryAttribute[]>(initialAttributes)

  const [appliedParams, setAppliedParams] = useState<URLSearchParams>(() => new URLSearchParams(initialQueryString))
  const [feed, setFeed] = useState<FeedState>(() => ({
    products: initialProducts,
    page: 1,
    hasMore: true,
  }))
  const [isLoading, setIsLoading] = useState(false)
  // Track which category slug is currently being navigated to (for loading indicators)
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  const productsCacheRef = useRef(new Map<string, { products: UIProduct[]; hasMore: boolean }>())
  const contextCacheRef = useRef(new Map<string, CategoryContextResponse>())
  const abortRef = useRef<AbortController | null>(null)

  const activeSlug = categorySlug

  const activeCategoryName = useMemo(() => categoryTitle, [categoryTitle])

  const buildProductsUrl = useCallback((slug: string, params: URLSearchParams, page: number, limit: number) => {
    const next = new URLSearchParams(params.toString())
    next.delete("category")
    next.delete("page")
    next.delete("limit")
    next.set("category", slug)
    next.set("page", String(page))
    next.set("limit", String(limit))
    return `/api/products/newest?${next.toString()}`
  }, [])

  /**
   * Sync URL with current category state.
   * @param createHistoryEntry - true for category changes (back button works), false for filter changes
   */
  const syncUrl = useCallback((
    slug: string,
    params: URLSearchParams,
    parentSlug: string | null,
    createHistoryEntry: boolean = false
  ) => {
    const qs = params.toString()
    const qsSuffix = qs ? `?${qs}` : ""
    const nextPath = `${buildCategoryPathname({ locale, slug, parentSlug })}${qsSuffix}`
    updateUrl(nextPath, createHistoryEntry)
  }, [locale])

  const loadPage = useCallback(async (opts: {
    slug: string
    params: URLSearchParams
    page: number
    append: boolean
  }) => {
    const { slug, params, page, append } = opts
    const limit = 24

    const cacheKey = `${slug}|${params.toString()}|${page}|${limit}`
    const cached = productsCacheRef.current.get(cacheKey)
    if (cached) {
      setFeed((prev) => ({
        products: append ? [...prev.products, ...cached.products] : cached.products,
        page,
        hasMore: cached.hasMore,
      }))
      return
    }

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setIsLoading(true)
    try {
      const url = buildProductsUrl(slug, params, page, limit)
      const data = await fetchJson<{ products: UIProduct[]; hasMore: boolean }>(url, ac.signal)
      const products = Array.isArray(data.products) ? data.products : []
      const hasMore = Boolean(data.hasMore)

      productsCacheRef.current.set(cacheKey, { products, hasMore })

      setFeed((prev) => ({
        products: append ? [...prev.products, ...products] : products,
        page,
        hasMore,
      }))
    } finally {
      setIsLoading(false)
    }
  }, [buildProductsUrl])

  const setFilters = useCallback(async (nextParams: URLSearchParams) => {
    if (!enabled) return

    // New filters apply instantly to current category.
    // Use replaceState (no history entry) - filters shouldn't pollute back button
    setAppliedParams(nextParams)
    syncUrl(categorySlug, nextParams, parent?.slug ?? null, false)

    await loadPage({ slug: categorySlug, params: nextParams, page: 1, append: false })
  }, [enabled, categorySlug, loadPage, parent?.slug, syncUrl])

  /**
   * Internal navigation - fetches context + products for a category.
   * Shared by both user-initiated navigation and popstate handler.
   */
  const navigateToCategory = useCallback(async (
    nextSlug: string,
    nextParams: URLSearchParams,
    updateHistory: boolean
  ) => {
    setLoadingSlug(nextSlug)
    setCategorySlugState(nextSlug)
    setAppliedParams(nextParams)

    // Context (cached) + products
    let resolvedParentSlug: string | null = parent?.slug ?? null
    try {
      const cached = contextCacheRef.current.get(nextSlug)
      const context =
        cached ??
        (await fetchJson<CategoryContextResponse>(`/api/categories/${encodeURIComponent(nextSlug)}/context`))
      if (!cached) contextCacheRef.current.set(nextSlug, context)

      setCategoryId(context.current.id)
      setCategoryTitle(toDisplayName(locale, context.current))
      setParent(context.parent)
      setChildren(context.children)
      setSiblings(context.siblings)
      setAttributes(context.attributes)
      resolvedParentSlug = context.parent?.slug ?? null
    } catch {
      // If context fails, products still load (best-effort).
    }

    if (updateHistory) {
      syncUrl(nextSlug, nextParams, resolvedParentSlug, true)
    }

    await loadPage({ slug: nextSlug, params: nextParams, page: 1, append: false })
    setLoadingSlug(null)
  }, [loadPage, locale, parent?.slug, syncUrl])

  const setCategorySlug = useCallback(async (nextSlug: string, opts?: { clearAttrFilters?: boolean }) => {
    if (!enabled) return
    if (!nextSlug || nextSlug === categorySlug) return

    const nextParams = opts?.clearAttrFilters
      ? withoutAttrParams(appliedParams)
      : new URLSearchParams(appliedParams.toString())

    await navigateToCategory(nextSlug, nextParams, true)
  }, [enabled, categorySlug, appliedParams, navigateToCategory])

  const goBack = useCallback(async () => {
    if (!enabled) return
    if (parent?.slug) {
      await setCategorySlug(parent.slug, { clearAttrFilters: true })
    }
  }, [enabled, parent?.slug, setCategorySlug])

  const loadMore = useCallback(async () => {
    if (!enabled) return
    if (isLoading || !feed.hasMore) return
    await loadPage({ slug: categorySlug, params: appliedParams, page: feed.page + 1, append: true })
  }, [enabled, isLoading, feed.hasMore, feed.page, loadPage, categorySlug, appliedParams])

  // Prefetch category context for faster navigation
  const prefetchCategory = useCallback((slug: string) => {
    if (!enabled) return
    if (contextCacheRef.current.has(slug)) return // Already cached

    // Fire-and-forget prefetch
    fetchJson<CategoryContextResponse>(`/api/categories/${encodeURIComponent(slug)}/context`)
      .then((context) => {
        contextCacheRef.current.set(slug, context)
      })
      .catch(() => {
        // Prefetch failures are silent - non-critical
      })
  }, [enabled])

  // Auto-prefetch children categories for instant drilling down
  useEffect(() => {
    if (!enabled) return
    // Prefetch all child categories in background
    children.forEach((child) => {
      prefetchCategory(child.slug)
    })
  }, [enabled, children, prefetchCategory])

  // Handle browser back/forward navigation (popstate)
  useEffect(() => {
    if (!enabled) return

    const handlePopState = () => {
      const pathWithoutLocale = window.location.pathname.replace(/^\/(en|bg)(?=\/|$)/, "")
      const match = pathWithoutLocale.match(/^\/categories\/([^/?]+)(?:\/([^/?]+))?/)
      const rootSlug = match?.[1] ? decodeURIComponent(match[1]) : null
      const leafSlug = match?.[2] ? decodeURIComponent(match[2]) : null
      const urlSlug = leafSlug ?? rootSlug

      if (urlSlug && urlSlug !== categorySlug) {
        const params = new URLSearchParams(window.location.search)
        // Don't create new history entry - we're responding to existing navigation
        navigateToCategory(urlSlug, params, false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [enabled, categorySlug, navigateToCategory])

  return {
    categorySlug,
    categoryId,
    categoryTitle,
    parent,
    children,
    siblings,
    attributes,
    appliedSearchParams: appliedParams,
    feed,
    isLoading,
    loadingSlug,
    activeSlug,
    activeCategoryName,
    setFilters,
    setCategorySlug,
    goBack,
    loadMore,
    prefetchCategory,
  }
}
