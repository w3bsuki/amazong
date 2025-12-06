import { createClient, createStaticClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { SubcategoryTabs } from "@/components/subcategory-tabs"
import { MobileFilters } from "@/components/mobile-filters"
import { DesktopFilters } from "@/components/desktop-filters"
import { FilterChips } from "@/components/filter-chips"
import { SortSelect } from "@/components/sort-select"
import { SearchPagination } from "@/components/search-pagination"
import { SearchFilters } from "@/components/search-filters"
import { Suspense } from "react"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { Link } from "@/i18n/routing"
import { cookies } from "next/headers"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import {
  getCategoryBySlug,
  getCategoryContext,
  getRootCategoriesWithChildren,
} from "@/lib/data/categories"

const ITEMS_PER_PAGE = 20

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  rating: number | null
  review_count: number | null
  category_id: string | null
  image_url?: string | null
}

// Generate static params for all categories (for SSG)
// Uses createStaticClient because this runs at build time outside request scope
export async function generateStaticParams() {
  const supabase = createStaticClient()
  if (!supabase) return []
  
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")
  
  return (categories || []).map((category) => ({
    slug: category.slug,
  }))
}

// Generate metadata for SEO - Uses cached getCategoryBySlug
export async function generateMetadata({ 
  params 
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  
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

// Helper function to search products with pagination
async function searchProducts(
  supabase: any, 
  categoryIds: string[],
  filters: {
    minPrice?: string
    maxPrice?: string
    tag?: string
    minRating?: string
    prime?: string
    availability?: string
    sort?: string
  },
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  shippingFilter: string = ''
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit
  
  // Build count query
  let countQuery = supabase.from("products").select("*", { count: "exact", head: true })
  let dbQuery = supabase.from("products").select("*")
  
  if (categoryIds.length > 0) {
    countQuery = countQuery.in("category_id", categoryIds)
    dbQuery = dbQuery.in("category_id", categoryIds)
  }
  
  // Apply shipping zone filter
  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
    dbQuery = dbQuery.or(shippingFilter)
  }
  
  if (filters.minPrice) {
    countQuery = countQuery.gte("price", Number(filters.minPrice))
    dbQuery = dbQuery.gte("price", Number(filters.minPrice))
  }
  if (filters.maxPrice) {
    countQuery = countQuery.lte("price", Number(filters.maxPrice))
    dbQuery = dbQuery.lte("price", Number(filters.maxPrice))
  }
  if (filters.tag) {
    countQuery = countQuery.contains("tags", [filters.tag])
    dbQuery = dbQuery.contains("tags", [filters.tag])
  }
  if (filters.minRating) {
    countQuery = countQuery.gte("rating", Number(filters.minRating))
    dbQuery = dbQuery.gte("rating", Number(filters.minRating))
  }
  if (filters.prime === "true") {
    countQuery = countQuery.eq("is_prime", true)
    dbQuery = dbQuery.eq("is_prime", true)
  }
  if (filters.availability === "instock") {
    countQuery = countQuery.gt("stock", 0)
    dbQuery = dbQuery.gt("stock", 0)
  }
  
  // Get total count
  const { count: total } = await countQuery
  
  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      dbQuery = dbQuery.order("created_at", { ascending: false })
      break
    case 'price-asc':
      dbQuery = dbQuery.order("price", { ascending: true })
      break
    case 'price-desc':
      dbQuery = dbQuery.order("price", { ascending: false })
      break
    case 'rating':
      dbQuery = dbQuery.order("rating", { ascending: false, nullsFirst: false })
      break
    default:
      dbQuery = dbQuery.order("rating", { ascending: false, nullsFirst: false })
  }
  
  // Apply pagination
  dbQuery = dbQuery.range(offset, offset + limit - 1)
  
  const { data } = await dbQuery
  return { products: data || [], total: total || 0 }
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
    prime?: string
    deals?: string
    brand?: string
    availability?: string
    sort?: string
    page?: string
  }>
}) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const { slug } = params
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10))
  
  const supabase = await createClient()
  const locale = await getLocale()
  
  // Get shipping zone from cookie for filtering
  const cookieStore = await cookies()
  const userZoneCookie = cookieStore.get('user-zone')?.value
  const userZone = parseShippingRegion(userZoneCookie)
  const shippingFilter = getShippingFilter(userZone)
  
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

  const result = await searchProducts(supabase, categoryIds, {
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    tag: searchParams.tag,
    minRating: searchParams.minRating,
    prime: searchParams.prime,
    availability: searchParams.availability,
    sort: searchParams.sort,
  }, currentPage, ITEMS_PER_PAGE, shippingFilter)
  products = result.products
  totalProducts = result.total

  const categoryName = locale === 'bg' && currentCategory.name_bg 
    ? currentCategory.name_bg 
    : currentCategory.name
  
  // Extract filterable attributes for the filter toolbar
  const filterableAttributes = categoryContext.attributes.filter(attr => attr.is_filterable)

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-6">
        {/* Layout: Sidebar (desktop) + Main Content */}
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="w-64 hidden lg:block shrink-0 border-r border-border">
            <div className="sticky top-28 py-4 pr-4 space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
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
          <div className="flex-1 min-w-0">
            {/* Category Header with Subcategory Tabs */}
            <Suspense>
              <SubcategoryTabs
                currentCategory={currentCategory}
                subcategories={subcategories}
                parentCategory={parentCategory}
                basePath="/categories"
              />
            </Suspense>

            {/* Active Filter Pills */}
            <div className="mb-4">
              <Suspense>
                <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} />
              </Suspense>
            </div>

          {/* Filter & Sort Row - Consolidated toolbar with all filters */}
          <div className="mb-3 sm:mb-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
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
            <SortSelect />
            
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
              <span> results</span>
              <span className="hidden lg:inline"> in <span className="font-medium">{categoryName}</span></span>
            </p>
          </div>
          
          {/* Mobile Results Info Strip */}
          <div className="sm:hidden mb-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5">
            <span>
              <span className="font-semibold text-foreground">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {categoryName}
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product: any) => (
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
                variant="grid"
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
              <h2 className="text-xl font-semibold text-foreground mb-2">No products found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn&apos;t find any products in this category. Try adjusting your filters or browse other categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/categories/${slug}`}>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-brand hover:bg-brand/90 text-foreground h-10 px-4 py-2 gap-2">
                    Clear All Filters
                  </button>
                </Link>
                <Link href="/categories">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
                    Browse All Categories
                  </button>
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
