import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useCategoryAttributes } from "./use-category-attributes"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useViewMode } from "./use-view-mode"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { getCategoryName, type CategoryDisplay } from "@/lib/data/categories/display"
import { type FeedTab, type FilterState } from "@/components/desktop/feed-toolbar"
import { type CategoryPath } from "./category-sidebar"
import { type ProductGridProduct } from "@/components/shared/product/product-grid"
import type { DesktopHomeProduct } from "./desktop-home.types"

interface UseDesktopHomeControllerParams {
  locale: string
  categories: CategoryTreeNode[]
  initialProducts: DesktopHomeProduct[]
  promotedProducts: DesktopHomeProduct[]
}

function toGridProduct(product: DesktopHomeProduct, boostedOverride?: boolean): ProductGridProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    listPrice: product.listPrice,
    isOnSale: product.isOnSale,
    salePercent: product.salePercent,
    saleEndDate: product.saleEndDate,
    createdAt: product.createdAt,
    slug: product.slug,
    storeSlug: product.storeSlug,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    sellerAvatarUrl: product.sellerAvatarUrl,
    sellerTier: product.sellerTier,
    sellerVerified: product.sellerVerified,
    location: product.location,
    condition: product.condition,
    isBoosted: boostedOverride ?? product.isBoosted,
    rating: product.rating,
    reviews: product.reviews,
    tags: product.tags,
    categoryRootSlug: product.categoryRootSlug,
    categoryPath: product.categoryPath,
    attributes: product.attributes,
  }
}

function getOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined
}

function getOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function getProductImage(product: Record<string, unknown>) {
  const image = getOptionalString(product.image)
  if (image) return image

  const images = Array.isArray(product.images) ? (product.images as string[]) : []
  return images[0] ?? "/placeholder.svg"
}

function getSellerTier(value: unknown): "business" | "premium" | "basic" {
  if (value === "business") return "business"
  if (value === "premium") return "premium"
  return "basic"
}

function getCreatedAt(product: Record<string, unknown>) {
  const createdAt = getOptionalString(product.createdAt)
  if (createdAt) return createdAt
  return getOptionalString(product.created_at) ?? null
}

function getCategoryPath(
  value: unknown
): { slug: string; name: string; nameBg?: string | null }[] | undefined {
  return Array.isArray(value)
    ? (value as { slug: string; name: string; nameBg?: string | null }[])
    : undefined
}

function getAttributes(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return undefined
}

function applyOptionalFeedFields(
  product: Record<string, unknown>,
  transformed: DesktopHomeProduct
) {
  const listPrice = getOptionalNumber(product.listPrice) ?? getOptionalNumber(product.list_price)
  const rating = getOptionalNumber(product.rating)
  const reviews = getOptionalNumber(product.reviews)
  const categoryRootSlug = getOptionalString(product.categoryRootSlug)
  const categoryPath = getCategoryPath(product.categoryPath)
  const attributes = getAttributes(product.attributes)
  const location = getOptionalString(product.location)
  const condition = getOptionalString(product.condition)
  const salePercent = getOptionalNumber(product.salePercent)

  if (typeof listPrice === "number") transformed.listPrice = listPrice
  if (typeof rating === "number") transformed.rating = rating
  if (typeof reviews === "number") transformed.reviews = reviews
  if (typeof categoryRootSlug === "string") transformed.categoryRootSlug = categoryRootSlug
  if (categoryPath) transformed.categoryPath = categoryPath
  if (attributes) transformed.attributes = attributes
  if (typeof location === "string") transformed.location = location
  if (typeof condition === "string") transformed.condition = condition
  if (typeof salePercent === "number") transformed.salePercent = salePercent
}

function transformFeedProduct(product: Record<string, unknown>): DesktopHomeProduct {
  const transformed: DesktopHomeProduct = {
    id: product.id as string,
    title: product.title as string,
    price: typeof product.price === "number" ? product.price : Number(product.price ?? 0),
    image: getProductImage(product),
    slug: (product.slug as string | null) ?? null,
    storeSlug: (product.storeSlug as string | null) ?? (product.store_slug as string | null) ?? null,
    sellerId: typeof product.sellerId === "string" ? product.sellerId : null,
    sellerName: typeof product.sellerName === "string" ? product.sellerName : null,
    sellerAvatarUrl: typeof product.sellerAvatarUrl === "string" ? product.sellerAvatarUrl : null,
    sellerTier: getSellerTier(product.sellerTier),
    sellerVerified: Boolean(product.sellerVerified),
    isBoosted: Boolean(product.isBoosted || product.is_boosted),
    createdAt: getCreatedAt(product),
    tags: Array.isArray(product.tags) ? (product.tags as string[]) : [],
    isOnSale: Boolean(product.isOnSale),
    saleEndDate: typeof product.saleEndDate === "string" ? product.saleEndDate : null,
  }

  applyOptionalFeedFields(product, transformed)

  return transformed
}

export function useDesktopHomeController({
  locale,
  categories,
  initialProducts,
  promotedProducts,
}: UseDesktopHomeControllerParams) {
  const [activeTab, setActiveTab] = useState<FeedTab>("newest")
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([])
  const [products, setProducts] = useState<DesktopHomeProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    priceMin: "",
    priceMax: "",
    condition: null,
    attributes: {},
    quickFilters: [],
  })
  const [viewMode, setViewMode] = useViewMode("grid")
  const isMobileViewport = useIsMobile()
  const [userCity, setUserCity] = useState<string>("sofia")

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("treido_user_city")
      if (savedCity) setUserCity(savedCity)
    } catch {
      // Ignore storage access errors
    }
  }, [])

  const handleCityChange = useCallback((city: string) => {
    setUserCity(city)
    if (typeof window !== "undefined") {
      localStorage.setItem("treido_user_city", city)
    }
  }, [])

  const { counts: categoryCounts } = useCategoryCounts({ enabled: !isMobileViewport })
  const pageSize = 24

  const activeCategorySlug = useMemo(() => {
    if (categoryPath.length > 0) return categoryPath[categoryPath.length - 1]?.slug ?? null
    return null
  }, [categoryPath])

  const activeCategoryNode = useMemo(() => {
    if (categoryPath.length === 0) return null

    let nodes = categories
    let current: CategoryTreeNode | undefined

    for (const step of categoryPath) {
      current = nodes.find((c) => c.slug === step.slug)
      if (!current) return null
      nodes = current.children ?? []
    }

    return current ?? null
  }, [categories, categoryPath])

  const siblingCategories = useMemo(() => {
    if (categoryPath.length === 0) return []
    if (!activeCategoryNode) return []
    if (activeCategoryNode.children && activeCategoryNode.children.length > 0) return []

    if (categoryPath.length === 1) {
      return categories
    }

    let nodes = categories
    let parentNode: CategoryTreeNode | undefined

    for (let index = 0; index < categoryPath.length - 1; index++) {
      const step = categoryPath[index]
      if (!step) continue
      const found = nodes.find((c) => c.slug === step.slug)
      if (!found) return []
      parentNode = found
      nodes = found.children ?? []
    }

    return parentNode?.children ?? []
  }, [categories, categoryPath, activeCategoryNode])

  const { attributes: categoryAttributes, isLoading: isLoadingAttributes } = useCategoryAttributes(activeCategorySlug)

  useEffect(() => {
    setFilters((previous) => ({ ...previous, attributes: {} }))
  }, [activeCategorySlug])

  const handleSubcategorySelect = useCallback(
    (category: CategoryDisplay) => {
      setCategoryPath((previous) => {
        const lastSlug = previous[previous.length - 1]?.slug
        if (lastSlug === category.slug) return previous
        return [...previous, { slug: category.slug, name: getCategoryName(category, locale) }]
      })
      setPage(1)
    },
    [locale]
  )

  const handleSiblingSelect = useCallback(
    (category: CategoryDisplay) => {
      setCategoryPath((previous) => {
        if (previous.length === 0) return previous
        const lastSlug = previous[previous.length - 1]?.slug
        if (lastSlug === category.slug) return previous
        const nextPath = previous.slice(0, -1)
        return [...nextPath, { slug: category.slug, name: getCategoryName(category, locale) }]
      })
      setPage(1)
    },
    [locale]
  )

  const fetchProducts = useCallback(
    async (tab: FeedTab, pageNum: number, limit: number, append = false, catSlug?: string | null, city?: string | null, quickFilters: string[] = []) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          sort: tab,
          page: String(pageNum),
          limit: String(limit),
        })
        if (catSlug) params.set("category", catSlug)
        if (quickFilters.includes("nearby") && city) params.set("city", city)
        if (quickFilters.length > 0) params.set("filters", quickFilters.join(","))

        const response = await fetch(`/api/products/feed?${params.toString()}`)
        if (!response.ok) return

        const data: unknown = await response.json()
        if (!data || typeof data !== "object") return

        const { products: rawProducts, hasMore: rawHasMore } = data as {
          products?: unknown
          hasMore?: unknown
        }
        if (!Array.isArray(rawProducts)) return

        const transformed: DesktopHomeProduct[] = rawProducts.map(
          (product: Record<string, unknown>) => transformFeedProduct(product)
        )

        if (append) {
          setProducts((previous) => [...previous, ...transformed])
        } else {
          setProducts(transformed)
        }
        const hasMore = typeof rawHasMore === "boolean" ? rawHasMore : transformed.length === limit
        setHasMore(hasMore)
      } catch {
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const initialFetchDone = useRef(initialProducts.length > 0)
  useEffect(() => {
    if (initialFetchDone.current) return
    initialFetchDone.current = true
    fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug, userCity, filters.quickFilters)
  }, [activeTab, activeCategorySlug, userCity, filters.quickFilters, fetchProducts])

  const prevTab = useRef(activeTab)
  const prevCat = useRef<string | null>(null)
  const prevCity = useRef<string | null>(userCity)
  const prevQuickFilters = useRef<string[]>([])
  useEffect(() => {
    const tabChanged = prevTab.current !== activeTab
    const catChanged = prevCat.current !== activeCategorySlug
    const nearbyActive = filters.quickFilters?.includes("nearby") ?? false
    const cityChanged = nearbyActive && prevCity.current !== userCity
    const quickFiltersChanged = JSON.stringify(prevQuickFilters.current) !== JSON.stringify(filters.quickFilters)
    prevTab.current = activeTab
    prevCat.current = activeCategorySlug
    prevCity.current = userCity
    prevQuickFilters.current = filters.quickFilters ?? []

    if (tabChanged || catChanged || cityChanged || quickFiltersChanged) {
      setPage(1)
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug, userCity, filters.quickFilters)
    }
  }, [activeTab, activeCategorySlug, userCity, filters.quickFilters, fetchProducts])

  const handleCategorySelect = useCallback((path: CategoryPath[]) => {
    setCategoryPath(path)
  }, [])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(activeTab, nextPage, pageSize, true, activeCategorySlug, userCity, filters.quickFilters)
    }
  }, [activeTab, activeCategorySlug, fetchProducts, filters.quickFilters, hasMore, isLoading, page, userCity])

  const refreshCurrent = useCallback(() => {
    void fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug, userCity, filters.quickFilters)
  }, [activeTab, activeCategorySlug, fetchProducts, filters.quickFilters, userCity])

  const gridProducts: ProductGridProduct[] = products.map((product) => toGridProduct(product))

  const activePromotedProducts = useMemo(() => {
    const now = Date.now()
    return promotedProducts.filter((product) => {
      if (!product.isBoosted) return false
      if (!product.boostExpiresAt) return false
      const expiresAt = Date.parse(product.boostExpiresAt)
      return Number.isFinite(expiresAt) && expiresAt > now
    })
  }, [promotedProducts])

  const finalGridProducts: ProductGridProduct[] = useMemo(() => {
    if (activePromotedProducts.length > 0) {
      const promotedGridProducts: ProductGridProduct[] = activePromotedProducts.map((product) => toGridProduct(product, true))
      const regularFiltered = gridProducts.filter(
        (product) => !promotedGridProducts.some((promoted) => promoted.id === product.id)
      )
      return [...promotedGridProducts, ...regularFiltered]
    }
    return gridProducts
  }, [activePromotedProducts, gridProducts])

  return {
    activeTab,
    setActiveTab,
    categoryPath,
    activeCategorySlug,
    activeCategoryNode,
    siblingCategories,
    products,
    isLoading,
    hasMore,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    userCity,
    handleCityChange,
    categoryCounts,
    categoryAttributes,
    isLoadingAttributes,
    handleSubcategorySelect,
    handleSiblingSelect,
    handleCategorySelect,
    loadMore,
    refreshCurrent,
    finalGridProducts,
    activePromotedProducts,
  }
}
