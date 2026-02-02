"use client"

/**
 * Desktop Home
 * 
 * The desktop homepage layout with unified header + content approach where:
 * - Logo and user actions stay in a slim top bar
 * - Search is integrated INTO the content area (inline with sidebar + grid)
 * - Categories sidebar and product grid share a container
 * - The whole thing feels like one cohesive surface, not header + body
 * 
 * Design principles:
 * - Header is minimal - just logo + user actions
 * - Search lives WHERE the content is (contextual, not global)
 * - Lighter background (muted/30) for the container vs white cards
 * - Grid borders create visual rhythm without heavy separation
 */

import * as React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useCategoryAttributes } from "@/hooks/use-category-attributes"
import { useViewMode } from "@/hooks/use-view-mode"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, type CategoryDisplay } from "@/lib/category-display"
// Extracted components
import { FeedToolbar, type FeedTab, type FilterState } from "@/components/desktop/feed-toolbar"
import { CompactCategorySidebar, type CategoryPath } from "@/components/desktop/category-sidebar"
import { FiltersSidebar } from "@/components/desktop/filters-sidebar"
import { ProductGridSkeleton } from "@/components/shared/product/product-grid-skeleton"
import { PromotedSection } from "@/components/desktop/promoted-section"
import { DesktopShell, DesktopShellSkeleton } from "@/components/layout/desktop-shell"
import { ProductGrid, type ProductGridProduct } from "@/components/grid"
import { SubcategoryCircles } from "@/components/category/subcategory-circles"
import type { UIProduct } from "@/lib/data/products"

import type { User } from "@supabase/supabase-js"

// =============================================================================
// TYPES
// =============================================================================

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
  sellerVerified?: boolean
  location?: string
  condition?: string
  isBoosted?: boolean
  boostExpiresAt?: string | null
  tags?: string[]
  // Category & attributes for contextual display
  categoryRootSlug?: string
  categoryPath?: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[]
  attributes?: Record<string, unknown>
}

interface CuratedSections {
  deals: UIProduct[]
  fashion: UIProduct[]
  electronics: UIProduct[]
  automotive: UIProduct[]
}

interface DesktopHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  initialProducts?: Product[]
  promotedProducts?: Product[]
  curatedSections?: CuratedSections
  user?: User | null
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DesktopHome({
  locale,
  categories,
  initialProducts = [],
  promotedProducts = [],
  // curatedSections not used on desktop - category discovery via sidebar
  user,
}: DesktopHomeProps) {
  const t = useTranslations("TabbedProductFeed")

  // State
  const [activeTab, setActiveTab] = useState<FeedTab>("newest")
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([])
  const [products, setProducts] = useState<Product[]>(initialProducts)
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
  
  // User's city for nearby filtering (persisted in localStorage)
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

  const { counts: categoryCounts } = useCategoryCounts()
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

  // Compute sibling categories for leaf-level navigation
  // Siblings are other children of the same parent (for when we're at a leaf with no children)
  const siblingCategories = useMemo(() => {
    if (categoryPath.length === 0) return []
    if (!activeCategoryNode) return []
    // Only compute siblings if active node has no children (leaf level)
    if (activeCategoryNode.children && activeCategoryNode.children.length > 0) return []
    
    // Find the parent node by traversing path up to second-to-last
    if (categoryPath.length === 1) {
      // Parent is root - siblings are root categories
      return categories
    }
    
    // Navigate to parent node
    let nodes = categories
    let parentNode: CategoryTreeNode | undefined
    
    for (let i = 0; i < categoryPath.length - 1; i++) {
      const step = categoryPath[i]
      if (!step) continue
      const found = nodes.find((c) => c.slug === step.slug)
      if (!found) return []
      parentNode = found
      nodes = found.children ?? []
    }
    
    // Siblings are all children of parent (including current)
    return parentNode?.children ?? []
  }, [categories, categoryPath, activeCategoryNode])

  const { attributes: categoryAttributes, isLoading: isLoadingAttributes } = useCategoryAttributes(activeCategorySlug)

  // Clear attribute filters when category changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, attributes: {} }))
  }, [activeCategorySlug])

  const handleSubcategorySelect = useCallback(
    (category: CategoryDisplay) => {
      setCategoryPath((prev) => {
        const lastSlug = prev[prev.length - 1]?.slug
        if (lastSlug === category.slug) return prev
        return [...prev, { slug: category.slug, name: getCategoryName(category, locale) }]
      })
      setPage(1)
    },
    [locale]
  )

  // Handle sibling category selection (replaces current level, not appends)
  const handleSiblingSelect = useCallback(
    (category: CategoryDisplay) => {
      setCategoryPath((prev) => {
        if (prev.length === 0) return prev
        const lastSlug = prev[prev.length - 1]?.slug
        if (lastSlug === category.slug) return prev
        // Replace the last element with the new sibling
        const newPath = prev.slice(0, -1)
        return [...newPath, { slug: category.slug, name: getCategoryName(category, locale) }]
      })
      setPage(1)
    },
    [locale]
  )

  // Fetch products
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
        // Pass city for nearby filter
        if (quickFilters.includes("nearby") && city) params.set("city", city)
        // Pass quick filters
        if (quickFilters.length > 0) params.set("filters", quickFilters.join(","))

        const res = await fetch(`/api/products/feed?${params.toString()}`)
        if (!res.ok) return

        const data = await res.json()
        if (!Array.isArray(data.products)) return

        const transformed: Product[] = data.products.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          title: p.title as string,
          price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
          image: (p.image as string) ?? (Array.isArray(p.images) ? (p.images as string[])[0] : "/placeholder.svg") ?? "/placeholder.svg",
          slug: (p.slug as string | null) ?? null,
          storeSlug: (p.storeSlug as string | null) ?? (p.store_slug as string | null) ?? null,
          sellerId: typeof p.sellerId === "string" ? p.sellerId : null,
          sellerName: typeof p.sellerName === "string" ? p.sellerName : null,
          sellerAvatarUrl: typeof p.sellerAvatarUrl === "string" ? p.sellerAvatarUrl : null,
          sellerVerified: Boolean(p.sellerVerified),
          isBoosted: Boolean(p.isBoosted || p.is_boosted),
          listPrice: typeof p.listPrice === "number" ? p.listPrice : typeof p.list_price === "number" ? p.list_price : undefined,
          rating: typeof p.rating === "number" ? p.rating : undefined,
          reviews: typeof p.reviews === "number" ? p.reviews : undefined,
          createdAt: typeof p.createdAt === "string" ? p.createdAt : typeof p.created_at === "string" ? p.created_at : null,
          tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
          // Category-aware data for contextual smart badges
          categoryRootSlug: typeof p.categoryRootSlug === "string" ? p.categoryRootSlug : undefined,
          categoryPath: Array.isArray(p.categoryPath) ? p.categoryPath as { slug: string; name: string; nameBg?: string | null }[] : undefined,
          attributes: (p.attributes && typeof p.attributes === "object" && !Array.isArray(p.attributes)) ? p.attributes as Record<string, unknown> : undefined,
          // Extra fields for product display
          location: typeof p.location === "string" ? p.location : undefined,
          condition: typeof p.condition === "string" ? p.condition : undefined,
          isOnSale: Boolean(p.isOnSale),
          salePercent: typeof p.salePercent === "number" ? p.salePercent : undefined,
          saleEndDate: typeof p.saleEndDate === "string" ? p.saleEndDate : null,
        }))

        if (append) {
          setProducts((prev) => [...prev, ...transformed])
        } else {
          setProducts(transformed)
        }
        setHasMore(data.hasMore ?? transformed.length === limit)
      } catch {
        // Silent
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Initial fetch
  const initialFetchDone = useRef(initialProducts.length > 0)
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug, userCity, filters.quickFilters)
    }
  }, [])

  // Fetch on tab/category/city/filters change
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

  const handleCategorySelect = (path: CategoryPath[], _cat: CategoryTreeNode | null) => {
    setCategoryPath(path)
    setPage(1)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const next = page + 1
      setPage(next)
      fetchProducts(activeTab, next, pageSize, true, activeCategorySlug, userCity, filters.quickFilters)
    }
  }

  // Convert products to ProductGridProduct format
  const gridProducts: ProductGridProduct[] = products.map((product) => ({
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
    sellerVerified: product.sellerVerified,
    location: product.location,
    condition: product.condition,
    isBoosted: product.isBoosted,
    rating: product.rating,
    reviews: product.reviews,
    tags: product.tags,
    categoryRootSlug: product.categoryRootSlug,
    categoryPath: product.categoryPath,
    attributes: product.attributes,
  }))

  const activePromotedProducts = useMemo(() => {
    const now = Date.now()
    return promotedProducts.filter((p) => {
      if (!p.isBoosted) return false
      if (!p.boostExpiresAt) return false
      const expiresAt = Date.parse(p.boostExpiresAt)
      return Number.isFinite(expiresAt) && expiresAt > now
    })
  }, [promotedProducts])

  // ALWAYS merge promoted products into the grid (unified container design)
  // Promoted products appear first with promo badge, regular products follow
  const finalGridProducts: ProductGridProduct[] = useMemo(() => {
    if (activePromotedProducts.length > 0) {
      // Inject promoted products at the start of the grid
      const promotedGridProducts: ProductGridProduct[] = activePromotedProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        listPrice: p.listPrice,
        isOnSale: p.isOnSale,
        salePercent: p.salePercent,
        saleEndDate: p.saleEndDate,
        createdAt: p.createdAt,
        slug: p.slug,
        storeSlug: p.storeSlug,
        sellerId: p.sellerId,
        sellerName: p.sellerName,
        sellerAvatarUrl: p.sellerAvatarUrl,
        sellerVerified: p.sellerVerified,
        location: p.location,
        condition: p.condition,
        isBoosted: true, // Mark as promoted for badge display
        rating: p.rating,
        reviews: p.reviews,
        tags: p.tags,
        categoryRootSlug: p.categoryRootSlug,
        categoryPath: p.categoryPath,
        attributes: p.attributes,
      }))
      // Remove duplicates (in case a promoted product is also in regular products)
      const regularFiltered = gridProducts.filter(
        (p) => !promotedGridProducts.some((promo) => promo.id === p.id)
      )
      return [...promotedGridProducts, ...regularFiltered]
    }
    return gridProducts
  }, [activePromotedProducts, gridProducts])

  // Sidebar content
  const sidebarContent = (
    <>
      <CompactCategorySidebar
        categories={categories}
        locale={locale}
        selectedPath={categoryPath}
        onCategorySelect={handleCategorySelect}
        categoryCounts={categoryCounts}
      />
      {categoryPath.length > 0 && (
        <FiltersSidebar
          locale={locale}
          filters={filters}
          onFiltersChange={setFilters}
          onApply={() => fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug, userCity)}
        />
      )}
    </>
  )

  return (
    <DesktopShell
      variant="muted"
      sidebar={sidebarContent}
      sidebarSticky
    >
      {/* CATEGORY HEADER + CIRCLES: Always on top when category selected */}
      {activeCategoryNode && (
        <div className="rounded-xl bg-card border border-border p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                {getCategoryName(activeCategoryNode, locale)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {finalGridProducts.length.toLocaleString(locale)}{" "}
                {t("sectionAriaLabel").toLocaleLowerCase(locale)}
              </p>
            </div>
          </div>

          {/* Show subcategories if available, otherwise show siblings for navigation */}
          {Array.isArray(activeCategoryNode.children) && activeCategoryNode.children.length > 0 ? (
            <SubcategoryCircles
              className="mt-3"
              variant="desktop"
              currentCategory={{
                id: activeCategoryNode.id,
                name: activeCategoryNode.name,
                name_bg: activeCategoryNode.name_bg,
                slug: activeCategoryNode.slug,
                parent_id: activeCategoryNode.parent_id ?? null,
                image_url: activeCategoryNode.image_url ?? null,
                ...(typeof categoryCounts[activeCategoryNode.slug] === "number"
                  ? { subtree_product_count: categoryCounts[activeCategoryNode.slug] }
                  : {}),
              }}
              subcategories={activeCategoryNode.children.map((c) => ({
                id: c.id,
                name: c.name,
                name_bg: c.name_bg,
                slug: c.slug,
                parent_id: c.parent_id ?? activeCategoryNode.id ?? null,
                image_url: c.image_url ?? null,
                ...(typeof categoryCounts[c.slug] === "number" ? { subtree_product_count: categoryCounts[c.slug] } : {}),
              }))}
              onSelectCategory={handleSubcategorySelect}
            />
          ) : siblingCategories.length > 0 ? (
            // At leaf level - show sibling categories for navigation
            <SubcategoryCircles
              className="mt-3"
              variant="desktop"
              currentCategory={{
                id: activeCategoryNode.id,
                name: activeCategoryNode.name,
                name_bg: activeCategoryNode.name_bg,
                slug: activeCategoryNode.slug,
                parent_id: activeCategoryNode.parent_id ?? null,
                image_url: activeCategoryNode.image_url ?? null,
                ...(typeof categoryCounts[activeCategoryNode.slug] === "number"
                  ? { subtree_product_count: categoryCounts[activeCategoryNode.slug] }
                  : {}),
              }}
              subcategories={siblingCategories.map((c) => ({
                id: c.id,
                name: c.name,
                name_bg: c.name_bg,
                slug: c.slug,
                parent_id: c.parent_id ?? null,
                image_url: c.image_url ?? null,
                ...(typeof categoryCounts[c.slug] === "number" ? { subtree_product_count: categoryCounts[c.slug] } : {}),
              }))}
              activeSubcategorySlug={activeCategoryNode.slug}
              onSelectCategory={handleSiblingSelect}
            />
          ) : null}
        </div>
      )}

      {/* PROMOTED SECTION: Only on homepage "All" view - standalone section on top */}
      {!activeCategorySlug && activePromotedProducts.length > 0 && (
        <PromotedSection 
          products={activePromotedProducts} 
          locale={locale}
          maxProducts={5}
        />
      )}

      {/* Feed toolbar: count + category pills (left) | sort + view toggle (right) */}
      <FeedToolbar
        locale={locale}
        productCount={products.length}
        showCount={categoryPath.length === 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categorySlug={activeCategorySlug}
        userCity={userCity}
        onCityChange={handleCityChange}
        filters={filters}
        onFiltersChange={setFilters}
        categoryAttributes={categoryAttributes}
        isLoadingAttributes={isLoadingAttributes}
      />

      {/* Product Grid */}
      <div className="rounded-xl bg-card border border-border p-4">
        {finalGridProducts.length === 0 && isLoading ? (
          <ProductGridSkeleton viewMode={viewMode} />
        ) : finalGridProducts.length === 0 ? (
          <EmptyStateCTA
            variant={activeCategorySlug ? "no-category" : "no-listings"}
            {...(activeCategorySlug ? { categoryName: activeCategorySlug } : {})}
          />
        ) : (
          <>
            <ProductGrid
              products={finalGridProducts}
              viewMode={viewMode}
            />

            {hasMore && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} disabled={isLoading} size="lg" className="min-w-36">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
    </DesktopShell>
  )
}

export function DesktopHomeSkeleton() {
  return <DesktopShellSkeleton showSidebar sidebarItems={15} contentRows={16} />
}
