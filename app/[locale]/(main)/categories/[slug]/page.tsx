import { createStaticClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { SubcategoryTabs } from "@/components/category/subcategory-tabs"
import { MobileFilters } from "@/components/shared/filters/mobile-filters"
import { DesktopFilters } from "@/components/shared/filters/desktop-filters"
import { FilterChips } from "@/components/shared/filters/filter-chips"
import { SortSelect } from "@/components/shared/search/sort-select"
import { SearchPagination } from "@/components/shared/search/search-pagination"
import { SearchFilters } from "@/components/shared/search/search-filters"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { Link, routing } from "@/i18n/routing"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import {
  getCategoryBySlug,
  getCategoryContext,
  getRootCategoriesWithChildren,
  getCategoryHierarchy,
  getCategoryAncestry,
} from "@/lib/data/categories"
import { searchProducts } from "./_lib/search-products"
import type { Product } from "./_lib/types"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"
import { getNewestProducts, toUI } from "@/lib/data/products"

// =============================================================================
// CATEGORY PAGE - HYBRID CACHING STRATEGY
// 
// Static/Cached data (via 'use cache' functions):
// - Category hierarchy (getCategoryContext, getRootCategoriesWithChildren)
// - Category metadata (getCategoryBySlug)
// 
// Dynamic data (user-specific, requires cookies):
// - Shipping zone filter (from user cookie)
// - Product search results (filtered by user preferences)
// =============================================================================

const PLACEHOLDER_SLUG = '__placeholder__'

// Generate static params for all categories (for SSG)
// Uses createStaticClient because this runs at build time outside request scope
export async function generateStaticParams() {
  const supabase = createStaticClient()
  // With Cache Components enabled, `generateStaticParams` must return at least
  // one param. When Supabase isn't configured (e.g. local/E2E), fall back to a
  // placeholder param to avoid build-time empty-array errors.
  if (!supabase) {
    return routing.locales.map((locale) => ({ locale, slug: PLACEHOLDER_SLUG }))
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("slug")

  const slugs = (categories || [])
    .map((category) => category.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)

  if (slugs.length === 0) {
    return routing.locales.map((locale) => ({ locale, slug: PLACEHOLDER_SLUG }))
  }

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

// Generate metadata for SEO - Uses cached getCategoryBySlug
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  setRequestLocale(locale)

  if (slug === PLACEHOLDER_SLUG) {
    return {
      title: locale === 'bg' ? 'Категории' : 'Categories',
    }
  }

  // Use cached function instead of direct query
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  const categoryName = locale === "bg" && category.name_bg
    ? category.name_bg
    : category.name

  return {
    title: `${categoryName} - Shop`,
    description: `Browse our wide selection of ${categoryName} products. Find the best deals with fast shipping and great prices.`,
    openGraph: {
      title: `${categoryName} - Shop`,
      description: `Browse our wide selection of ${categoryName} products.`,
    },
  }
}


export default async function CategoryPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<{
    minPrice?: string
    maxPrice?: string
    minRating?: string
    subcategory?: string
    tag?: string
    deals?: string
    brand?: string
    availability?: string
    sort?: string
    page?: string
    [key: string]: string | string[] | undefined  // Dynamic attr_* params
  }>
}) {
  // NO connection() here - category data is CACHED via 'use cache' functions
  // Only cookies() makes this dynamic (for shipping zone filter)
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const { slug, locale } = params

  if (slug === PLACEHOLDER_SLUG) {
    notFound()
  }

  setRequestLocale(locale)
  const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10))

  const supabase = createStaticClient()

  // Read shipping zone from cookie (set by header "Доставка до" dropdown)
  // Only filter if user has selected a specific zone (not WW = worldwide = show all)
  const cookieStore = await cookies()
  const userZone = cookieStore.get('user-zone')?.value
  const parsedZone = parseShippingRegion(userZone)
  const shippingFilter = parsedZone !== 'WW'
    ? getShippingFilter(parsedZone)
    : ''

  if (!supabase) {
    notFound()
  }

  // ============================================================================
  // PHASE 2: Use cached data fetching functions (Next.js 16+ 'use cache' pattern)
  // These functions use cacheTag and cacheLife for granular cache invalidation
  // ============================================================================

  // Fetch category context (current, parent, siblings, children, attributes) - CACHED
  const categoryContext = await getCategoryContext(slug)

  if (!categoryContext) {
    notFound()
  }

  const { current: currentCategory, parent: parentCategory, children: subcategories } = categoryContext

  // Fetch ALL categories for the sidebar - use cached function
  const allCategoriesWithSubs = await getRootCategoriesWithChildren()
  const allCategories = allCategoriesWithSubs.map(c => c.category)

  // Products still use direct Supabase query (dynamic, user-specific filters)
  let products: Product[] = []
  let totalProducts = 0

  // Get products from this category AND all its subcategories
  const categoryIds = [currentCategory.id, ...subcategories.map(s => s.id)]

  // Extract attr_* params for attribute filtering
  const attributeFilters: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith('attr_') && value) {
      const attrName = key.replace('attr_', '')
      attributeFilters[attrName] = value
    }
  }

  const result = await searchProducts(supabase, categoryIds, {
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    tag: searchParams.tag,
    minRating: searchParams.minRating,
    availability: searchParams.availability,
    sort: searchParams.sort,
    attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
  }, currentPage, ITEMS_PER_PAGE, shippingFilter)
  products = result.products
  totalProducts = result.total

  const categoryName = locale === 'bg' && currentCategory.name_bg
    ? currentCategory.name_bg
    : currentCategory.name

  // Extract filterable attributes for the filter toolbar
  const filterableAttributes = categoryContext.attributes.filter(attr => attr.is_filterable)

  // Get translations for category page UI
  const t = await getTranslations('SearchFilters')

  // ==========================================================================
  // MOBILE: Use MobileHomeTabs with pre-selected category state
  // This provides instant client-side navigation (no page reloads)
  // ==========================================================================
  
  // Get category ancestry to determine L0, L1, L2, L3 levels
  const ancestry = await getCategoryAncestry(slug)
  
  // Fetch category hierarchy for MobileHomeTabs (L0→L1→L2 only, ~60KB)
  // L3 categories are lazy-loaded when L2 is clicked
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)
  
  // Get initial products for MobileHomeTabs
  const newestProducts = await getNewestProducts(12)
  const mobileInitialProducts = newestProducts.map(p => toUI(p))
  
  // Map ancestry to tab state: [L0, L1?, L2?, L3?]
  // L0 = activeTab (defaultTab)
  // L1 = activeL1 (defaultSubTab) 
  // L2 = activeL2 (defaultL2)
  // L3 = selectedPill (defaultL3)
  const defaultTab = ancestry?.[0] ?? null
  const defaultSubTab = ancestry?.[1] ?? null
  const defaultL2 = ancestry?.[2] ?? null
  const defaultL3 = ancestry?.[3] ?? null

  return (
    <>
      {/* Mobile: MobileHomeTabs with instant client-side navigation */}
      <div className="lg:hidden">
        <MobileHomeTabs 
          initialProducts={mobileInitialProducts} 
          initialCategories={categoriesWithChildren}
          defaultTab={defaultTab}
          defaultSubTab={defaultSubTab}
          defaultL2={defaultL2}
          defaultL3={defaultL3}
          showBanner={false}
          l0Style="pills"
          circlesNavigateToPages
          locale={locale}
          filterableAttributes={filterableAttributes}
        />
      </div>
      
      {/* Desktop: Full filter/sort/pagination experience */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="container px-2 sm:px-4 py-1">
          {/* No breadcrumb needed - sidebar provides all navigation context:
              - Category title at top
              - Back link to parent/all categories  
              - Subcategory navigation
              Breadcrumb would be redundant (Amazon pattern) */}

          {/* Layout: Sidebar (desktop) + Main Content */}
          <div className="flex gap-0">
            {/* Sidebar Filters - Desktop Only */}
            <aside className="w-56 shrink-0 border-r border-border">
            <div className="sticky top-16 pr-4 py-1 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar">
              <Suspense>
                <SearchFilters
                  categories={allCategories}
                  subcategories={subcategories}
                  currentCategory={currentCategory}
                  parentCategory={parentCategory}
                  allCategoriesWithSubs={allCategoriesWithSubs}
                  brands={[]}
                  basePath={`/categories/${slug}`}
                />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:pl-5">

            {/* Subcategory Circles or Category Banner (when at deepest level) */}
            <Suspense>
              <SubcategoryTabs
                currentCategory={currentCategory}
                subcategories={subcategories}
                parentCategory={parentCategory}
                basePath="/categories"
              />
            </Suspense>

            {/* Filter & Sort Row - Compact toolbar */}
            <div className="mb-2 sm:mb-4 flex items-center gap-2">
              {/* Mobile Filters (Sheet) */}
              <div className="lg:hidden">
                <Suspense>
                  <MobileFilters
                    locale={locale}
                    resultsCount={totalProducts}
                    attributes={filterableAttributes}
                  />
                </Suspense>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:contents">
                <SortSelect />
              </div>

              {/* Results Count - Show on mobile too */}
              <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                <span className="font-semibold text-foreground">{totalProducts}</span>
                <span> {t('results')}</span>
                <span className="hidden lg:inline"> {t('in')} <span className="font-medium">{categoryName}</span></span>
              </p>

              {/* Desktop Filters - Now includes attribute filters */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap ml-auto">
                <Suspense>
                  <DesktopFilters
                    attributes={filterableAttributes}
                    categorySlug={slug}
                  />
                </Suspense>
              </div>
            </div>

            {/* Active Filter Pills - Moved below toolbar */}
            <div className="mb-4">
              <Suspense>
                <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} />
              </Suspense>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => {
                const image = product.image_url || product.images?.[0] || "/placeholder.svg"
                const sellerName =
                  product.sellers?.display_name ||
                  product.sellers?.business_name ||
                  product.sellers?.store_slug

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={image}
                    rating={product.rating || 0}
                    reviews={product.review_count || 0}
                    originalPrice={product.list_price ?? null}
                    tags={product.tags || []}
                    slug={product.slug ?? null}
                    username={product.sellers?.store_slug ?? null}
                    sellerId={product.sellers?.id ?? null}
                    {...(sellerName ? { sellerName } : {})}
                    sellerAvatarUrl={product.sellers?.avatar_url ?? null}
                    sellerTier={
                      product.sellers?.account_type === "business"
                        ? "business"
                        : product.sellers?.tier === "premium"
                          ? "premium"
                          : "basic"
                    }
                    sellerVerified={Boolean(product.sellers?.is_verified_business)}
                    categorySlug={slug}
                    {...(product.attributes?.condition ? { condition: product.attributes.condition } : {})}
                    {...(product.attributes?.brand ? { brand: product.attributes.brand } : {})}
                    {...(product.attributes?.make ? { make: product.attributes.make } : {})}
                    {...(product.attributes?.model ? { model: product.attributes.model } : {})}
                    {...(product.attributes?.year ? { year: product.attributes.year } : {})}
                    {...(product.attributes?.location ? { location: product.attributes.location } : {})}
                  />
                )
              })}
            </div>

            {products.length === 0 && (
              <EmptyStateCTA
                variant="no-category"
                categoryName={categoryName}
                className="mt-8"
              />
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <Suspense>
                <SearchPagination
                  totalItems={totalProducts}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                />
              </Suspense>
            )}
          </div>
          {/* End Main Content */}
        </div>
        {/* End flex container */}
      </div>
      </div>
    </>
  )
}
