import { createStaticClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { SubcategoryTabs } from "@/components/category/subcategory-tabs"
import { MobileFilters } from "@/components/common/filters/mobile-filters"
import { DesktopFilters } from "@/components/common/filters/desktop-filters"
import { FilterChips } from "@/components/common/filters/filter-chips"
import { SortSelect } from "@/components/shared/search/sort-select"
import { SearchPagination } from "@/components/shared/search/search-pagination"
import { SearchFilters } from "@/components/shared/search/search-filters"
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
} from "@/lib/data/categories"
import { searchProducts } from "./_lib/search-products"
import type { Product } from "./_lib/types"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"

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

// Generate static params for all categories (for SSG)
// Uses createStaticClient because this runs at build time outside request scope
export async function generateStaticParams() {
  const supabase = createStaticClient()
  if (!supabase) return []
  
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")
  
  const slugs = (categories || []).map((category) => category.slug)
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
  setRequestLocale(locale)
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10))
  
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        {/* No breadcrumb needed - sidebar provides all navigation context:
            - Category title at top
            - Back link to parent/all categories  
            - Subcategory navigation
            Breadcrumb would be redundant (Amazon pattern) */}

        {/* Layout: Sidebar (desktop) + Main Content */}
        <div className="flex gap-0">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="w-56 hidden lg:block shrink-0 border-r border-border">
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
            {/* Subcategory Circles - only show if subcategories exist */}
            <Suspense>
              <SubcategoryTabs
                currentCategory={currentCategory}
                subcategories={subcategories}
                parentCategory={parentCategory}
                basePath="/categories"
              />
            </Suspense>

            {/* Active Filter Pills */}
            <div className="mb-2">
              <Suspense>
                <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} />
              </Suspense>
            </div>

          {/* Filter & Sort Row - Consolidated toolbar with all filters */}
          <div className="mb-3 sm:mb-5 grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 sm:gap-2.5">
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
            
            {/* Desktop Filters - Now includes attribute filters */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              <Suspense>
                <DesktopFilters 
                  attributes={filterableAttributes}
                  categorySlug={slug}
                />
              </Suspense>
            </div>
            
            {/* Results Count */}
            <p className="hidden sm:block text-sm text-muted-foreground ml-auto whitespace-nowrap">
              <span className="font-semibold text-foreground">{totalProducts}</span>
              <span> {t('results')}</span>
              <span className="hidden lg:inline"> {t('in')} <span className="font-medium">{categoryName}</span></span>
            </p>
          </div>
          
          {/* Mobile Results Info Strip */}
          <div className="sm:hidden mb-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5">
            <span>
              <span className="font-semibold text-foreground">{totalProducts}</span> {totalProducts === 1 ? t('product') : t('products')}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {categoryName}
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image_url || product.images?.[0] || ""}
                rating={product.rating || 0}
                reviews={product.review_count || 0}
                originalPrice={product.list_price}
                tags={product.tags || []}
                slug={product.slug}
                storeSlug={product.sellers?.store_slug}
                sellerId={product.sellers?.id || undefined}
                sellerName={(product.sellers?.display_name || product.sellers?.business_name || product.sellers?.store_slug) || undefined}
                sellerAvatarUrl={product.sellers?.avatar_url || null}
                sellerTier={product.sellers?.account_type === 'business' ? 'business' : (product.sellers?.tier === 'premium' ? 'premium' : 'basic')}
                sellerVerified={Boolean(product.sellers?.is_verified_business)}
                categorySlug={slug}
                condition={product.attributes?.condition}
                brand={product.attributes?.brand}
                make={product.attributes?.make}
                model={product.attributes?.model}
                year={product.attributes?.year}
                location={product.attributes?.location}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="mt-12 text-center py-12 px-4">
              <div className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="size-10 text-muted-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{t('noProductsFound')}</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t('noResultsInCategory')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/categories/${slug}`}>
                  <Button variant="default" className="h-touch-sm px-6">
                    {t('clearAllFiltersButton')}
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" className="h-touch-sm px-6">
                    {t('browseAllCategories')}
                  </Button>
                </Link>
              </div>
            </div>
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
  )
}
