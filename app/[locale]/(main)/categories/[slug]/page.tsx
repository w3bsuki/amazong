import { createStaticClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/ui/product-card"
import { SubcategoryTabs } from "@/components/subcategory-tabs"
import { MobileFilters } from "@/components/mobile-filters"
import { DesktopFilters } from "@/components/desktop-filters"
import { FilterChips } from "@/components/filter-chips"
import { SortSelect } from "@/components/sort-select"
import { SearchPagination } from "@/components/search-pagination"
import { SearchFilters } from "@/components/search-filters"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { Link } from "@/i18n/routing"
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
  list_price: number | null
  images: string[]
  rating: number | null
  review_count: number | null
  category_id: string | null
  image_url?: string | null
  slug?: string | null
  sellers?: {
    store_slug: string | null
    display_name: string | null
    business_name: string | null
    avatar_url: string | null
    tier: string | null
    account_type: string | null
    is_verified_business: boolean | null
    id?: string | null
  } | null
  /** Product attributes JSONB (condition, brand, make, model, year, location) */
  attributes?: Record<string, string> | null
  /** Product tags for display */
  tags?: string[]
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
  supabase: ReturnType<typeof createStaticClient>, 
  categoryIds: string[],
  filters: {
    minPrice?: string
    maxPrice?: string
    tag?: string
    minRating?: string
    prime?: string
    availability?: string
    sort?: string
    attributes?: Record<string, string | string[]>  // Dynamic attr_* filters
  },
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  shippingFilter: string = ''
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit
  
  // Build count query
  let countQuery = supabase.from("products").select("*", { count: "exact", head: true })
  let dbQuery = supabase.from("products").select("*, profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business)")
  
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

  // Apply attribute filters (uses idx_products_attr_* indexes)
  if (filters.attributes) {
    for (const [attrName, attrValue] of Object.entries(filters.attributes)) {
      if (attrValue) {
        // For single value, use JSONB containment which uses GIN index
        const value = Array.isArray(attrValue) ? attrValue[0] : attrValue
        if (value) {
          countQuery = countQuery.contains('attributes', { [attrName]: value })
          dbQuery = dbQuery.contains('attributes', { [attrName]: value })
        }
      }
    }
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
  
  // Transform DB data to Product interface (handle nullable fields)
  // Note: profiles is the join from products_seller_id_fkey, uses username as store_slug
  const products: Product[] = (data || []).map(p => {
    const profile = p.profiles && !Array.isArray(p.profiles) ? p.profiles : null
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      list_price: p.list_price,
      images: p.images || [],
      rating: p.rating,
      review_count: p.review_count,
      category_id: p.category_id,
      image_url: p.images?.[0] || null,
      slug: p.slug,
      sellers: profile ? {
        id: profile.id ?? null,
        store_slug: profile.username ?? null,
        display_name: profile.display_name ?? null,
        business_name: profile.business_name ?? null,
        avatar_url: profile.avatar_url ?? null,
        tier: profile.tier ?? null,
        account_type: profile.account_type ?? null,
        is_verified_business: profile.is_verified_business ?? null,
      } : null,
      attributes: p.attributes as Record<string, string> | null,
      tags: Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === 'string') : [],
    }
  })
  
  return { products, total: total || 0 }
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
    [key: string]: string | string[] | undefined  // Dynamic attr_* params
  }>
}) {
  await connection()
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
    prime: searchParams.prime,
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
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-brand hover:bg-brand/90 text-foreground h-10 px-4 py-2 gap-2">
                    {t('clearAllFiltersButton')}
                  </button>
                </Link>
                <Link href="/categories">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
                    {t('browseAllCategories')}
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
