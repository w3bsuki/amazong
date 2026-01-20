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
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/shared/product/product-card"
import { ProductCardList } from "@/components/shared/product/product-card-list"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useCategoryAttributes } from "@/hooks/use-category-attributes"
import { useViewMode } from "@/hooks/use-view-mode"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { Fire } from "@phosphor-icons/react"

// Extracted components
import { FeedToolbar, type FeedTab, type FilterState } from "@/components/desktop/feed-toolbar"
import { CompactCategorySidebar, type CategoryPath } from "@/components/desktop/category-sidebar"
import { FiltersSidebar } from "@/components/desktop/filters-sidebar"
import { ProductGridSkeleton } from "@/components/shared/product/product-grid-skeleton"
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
  tags?: string[]
  // Category & attributes for contextual display
  categoryRootSlug?: string
  categoryPath?: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[]
  attributes?: Record<string, unknown>
}

interface DesktopHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  initialProducts?: Product[]
  promotedProducts?: Product[]
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
  })
  const [viewMode, setViewMode] = useViewMode("grid")

  const { counts: categoryCounts } = useCategoryCounts()
  const pageSize = 24

  const activeCategorySlug = useMemo(() => {
    if (categoryPath.length > 0) return categoryPath[categoryPath.length - 1]?.slug ?? null
    return null
  }, [categoryPath])

  const { attributes: categoryAttributes, isLoading: isLoadingAttributes } = useCategoryAttributes(activeCategorySlug)

  // Clear attribute filters when category changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, attributes: {} }))
  }, [activeCategorySlug])

  // Fetch products
  const fetchProducts = useCallback(
    async (tab: FeedTab, pageNum: number, limit: number, append = false, catSlug?: string | null) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          type: tab,
          page: String(pageNum),
          limit: String(limit),
        })
        if (catSlug) params.set("category", catSlug)

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
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
    }
  }, [])

  // Fetch on tab/category change
  const prevTab = useRef(activeTab)
  const prevCat = useRef<string | null>(null)
  useEffect(() => {
    const tabChanged = prevTab.current !== activeTab
    const catChanged = prevCat.current !== activeCategorySlug
    prevTab.current = activeTab
    prevCat.current = activeCategorySlug

    if (tabChanged || catChanged) {
      setPage(1)
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
    }
  }, [activeTab, activeCategorySlug, fetchProducts])

  const handleCategorySelect = (path: CategoryPath[], _cat: CategoryTreeNode | null) => {
    setCategoryPath(path)
    setPage(1)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const next = page + 1
      setPage(next)
      fetchProducts(activeTab, next, pageSize, true, activeCategorySlug)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header is rendered by layout - no duplicate here */}

      {/* Main content - unified container */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:flex flex-col shrink-0 gap-4 sticky top-20 self-start">
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
                onApply={() => fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)}
              />
            )}
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 @container">
            {/* PROMOTED ROW: always first on desktop */}
            {activeTab !== "promoted" && promotedProducts.length > 0 && (
              <section
                aria-label={t("tabs.promoted")}
                className="mb-4 rounded-xl border border-border bg-muted/20 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Fire size={16} weight="fill" className="text-fire shrink-0" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {t("tabs.promoted")}{" "}
                    <span className="text-muted-foreground font-normal">
                      {t("sectionAriaLabel").toLocaleLowerCase(locale)}
                    </span>
                  </h2>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-4">
                    {promotedProducts.slice(0, 10).map((product, index) => (
                      <div key={product.id} className="w-56 shrink-0">
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
                          sellerName={product.sellerName || product.storeSlug || undefined}
                          sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                          sellerVerified={Boolean(product.sellerVerified)}
                          {...(product.location ? { location: product.location } : {})}
                          {...(product.condition ? { condition: product.condition } : {})}
                          tags={product.tags ?? []}
                          state="promoted"
                          index={index}
                          {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                          {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                          {...(product.attributes ? { attributes: product.attributes } : {})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Feed toolbar: count + category pills (left) | sort + view toggle (right) */}
            <FeedToolbar
              locale={locale}
              productCount={products.length}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              categorySlug={activeCategorySlug}
              filters={filters}
              onFiltersChange={setFilters}
              categoryAttributes={categoryAttributes}
              isLoadingAttributes={isLoadingAttributes}
            />

            {/* Product Grid - with proper container styling */}
            <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
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
                          : "grid gap-4 grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 @[960px]:grid-cols-5"
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
                              sellerName={product.sellerName || product.storeSlug || undefined}
                              sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                              sellerVerified={Boolean(product.sellerVerified)}
                              {...(product.location ? { location: product.location } : {})}
                              {...(product.condition ? { condition: product.condition } : {})}
                              tags={product.tags ?? []}
                              state={product.isBoosted ? "promoted" : undefined}
                              index={index}
                              // Category-aware contextual attributes
                              {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                              {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                              {...(product.attributes ? { attributes: product.attributes } : {})}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DesktopHomeSkeleton() {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container h-14 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 flex-1 max-w-2xl rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:flex flex-col shrink-0 space-y-4">
            <div className="rounded-lg border border-border bg-card p-1.5 shadow-sm">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md mb-1" />
              ))}
            </div>
          </aside>

          {/* Main skeleton */}
          <div className="flex-1 min-w-0">
            {/* Promoted row skeleton */}
            <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-56 shrink-0 space-y-2">
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
            <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 18 }).map((_, i) => (
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
