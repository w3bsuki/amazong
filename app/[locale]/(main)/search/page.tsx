import { createStaticClient } from "@/lib/supabase/server"
import { Link, routing } from "@/i18n/routing"
import { ProductCard } from "@/components/shared/product/product-card"
import { SearchFilters } from "@/components/shared/search/search-filters"
import { SubcategoryTabs } from "@/components/category/subcategory-tabs"
import { SearchHeader } from "./_components/search-header"
import { searchProducts } from "./_components/search-products"
import type { Category, Product } from "./_components/types"
import { MobileFilters } from "@/components/common/filters/mobile-filters"
import { DesktopFilters } from "@/components/common/filters/desktop-filters"
import { FilterChips } from "@/components/common/filters/filter-chips"
import { SortSelect } from "@/components/shared/search/sort-select"
import { SearchPagination } from "@/components/shared/search/search-pagination"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { cookies } from "next/headers"
import type { Metadata } from 'next'
import { getShippingFilter, parseShippingRegion } from '@/lib/shipping'
import { ITEMS_PER_PAGE } from "../_lib/pagination"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ q?: string; category?: string }>
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category || '';
  
  let title = 'Search Results';
  if (query) {
    title = `"${query}" - Search Results`;
  } else if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Shop`;
  }
  
  return {
    title,
    description: query 
      ? `Find the best deals on "${query}" at AMZN. Fast shipping and great prices.`
      : 'Browse our wide selection of products. Find electronics, fashion, home goods and more.',
  };
}


export default async function SearchPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q?: string
    category?: string
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
  const { locale } = await params
  setRequestLocale(locale)
  const searchParams = await searchParamsPromise
  const supabase = createStaticClient()
  const query = searchParams.q || ""
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10))
  
  // Read shipping zone from cookie (set by header "Доставка до" dropdown)
  // Only filter if user has selected a specific zone (not WW = worldwide = show all)
  const cookieStore = await cookies()
  const userZone = cookieStore.get('user-zone')?.value
  const parsedZone = parseShippingRegion(userZone)
  const shippingFilter = parsedZone !== 'WW'
    ? (getShippingFilter(parsedZone) || undefined)
    : undefined
  
  let products: Product[] = []
  let totalProducts = 0
  let currentCategory: Category | null = null
  let parentCategory: Category | null = null
  let subcategories: Category[] = []
  let allCategories: Category[] = []
  let allCategoriesWithSubs: { category: Category; subs: Category[] }[] = []
  let brands: string[] = []

  if (supabase) {
    // Fetch ALL categories (both top-level and subcategories) in one query
    const { data: allCats } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, image_url")
      .order("name")
    
    if (allCats) {
      // Separate top-level and subcategories
      allCategories = allCats.filter(c => c.parent_id === null)
      
      // Build the hierarchical structure for the sidebar
      allCategoriesWithSubs = allCategories.map(cat => ({
        category: cat,
        subs: allCats.filter(c => c.parent_id === cat.id)
      }))
    }

    // If a category is specified, get its details and subcategories
    if (searchParams.category) {
      // Find the category from our already fetched data
      const categoryData = allCats?.find(c => c.slug === searchParams.category) || null

      if (categoryData) {
        currentCategory = categoryData

        // Check if this is a subcategory (has parent_id)
        if (categoryData.parent_id) {
          parentCategory = allCats?.find(c => c.id === categoryData.parent_id) || null
          // No subcategories for a subcategory
          subcategories = []
        } else {
          // This is a main category - get its subcategories
          subcategories = allCats?.filter(c => c.parent_id === categoryData.id) || []
        }

        // Build product query with category filter
        // Get products from this category AND all its subcategories
        const categoryIds = [categoryData.id, ...subcategories.map(s => s.id)]

        // Extract attr_* params for attribute filtering
        const attributeFilters: Record<string, string | string[]> = {}
        for (const [key, value] of Object.entries(searchParams)) {
          if (key.startsWith('attr_') && value) {
            const attrName = key.replace('attr_', '')
            attributeFilters[attrName] = value
          }
        }

        // Use the helper function with pagination and shipping filter
        const result = await searchProducts(supabase, query, categoryIds, {
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
      }
    } else {
      // No category filter - get all products filtered by shipping zone
      // Extract attr_* params for attribute filtering
      const attributeFilters: Record<string, string | string[]> = {}
      for (const [key, value] of Object.entries(searchParams)) {
        if (key.startsWith('attr_') && value) {
          const attrName = key.replace('attr_', '')
          attributeFilters[attrName] = value
        }
      }

      const result = await searchProducts(supabase, query, null, {
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
    }

    // Extract unique brands from products for the filter
    // This would ideally come from a brands table, but for now we can extract from products
    // brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
  }

  // Get translations for search page UI
  const t = await getTranslations('SearchFilters')

  return (
    <div className="min-h-screen bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile */}
          <aside className="w-64 hidden lg:block shrink-0 border-r border-border">
            <div className="sticky top-28 py-4 pr-4 space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
            <Suspense>
              <SearchFilters 
                categories={allCategories}
                subcategories={subcategories}
                currentCategory={currentCategory}
                allCategoriesWithSubs={allCategoriesWithSubs}
                brands={brands}
              />
            </Suspense>
          </div>
        </aside>

        {/* Main Results */}
        <div className="flex-1 py-4 sm:py-6">
          {/* Show SubcategoryTabs when in a category, SearchHeader otherwise */}
          {currentCategory ? (
            <Suspense>
              <SubcategoryTabs
                currentCategory={currentCategory}
                subcategories={subcategories}
                parentCategory={parentCategory}
              />
            </Suspense>
          ) : (
            <Suspense>
              <SearchHeader 
                query={query}
                totalResults={products.length}
              />
            </Suspense>
          )}

          {/* Active Filter Pills - Show on all devices, only when filters are active */}
          <div className="mb-4">
            <Suspense>
              <FilterChips currentCategory={currentCategory} />
            </Suspense>
          </div>

          {/* Filter & Sort Row - Amazon/Target style toolbar */}
          <div className="mb-3 sm:mb-5 flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Filter Button - Larger on mobile */}
            <div className="flex-1 lg:hidden">
              <Suspense>
                <MobileFilters 
                  locale={locale}
                  resultsCount={totalProducts}
                />
              </Suspense>
            </div>
            
            {/* Sort Dropdown - Left aligned on all devices, larger on mobile */}
            <div className="flex-1 lg:max-w-[180px] lg:flex-initial">
              <SortSelect />
            </div>
            
            {/* Desktop Quick Filters */}
            <div className="hidden lg:flex items-center gap-2">
              <Suspense>
                <DesktopFilters />
              </Suspense>
            </div>
            
            {/* Results count - right aligned, hidden on mobile since it clutters the UI */}
            <p className="hidden sm:block text-sm text-muted-foreground ml-auto whitespace-nowrap">
              <span className="font-semibold text-foreground">{totalProducts}</span>
              <span> {t('results')}</span>
              {query && (
                <span className="hidden lg:inline">
                  {" "}{t('for')} <span className="font-medium text-primary">&quot;{query}&quot;</span>
                </span>
              )}
              {currentCategory && !query && (
                <span className="hidden lg:inline"> {t('in')} <span className="font-medium">{locale === 'bg' && currentCategory.name_bg ? currentCategory.name_bg : currentCategory.name}</span></span>
              )}
            </p>
          </div>
          
          {/* Mobile Results Info Strip */}
          <div className="sm:hidden mb-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5">
            <span>
              <span className="font-semibold text-foreground">{totalProducts}</span> {totalProducts === 1 ? t('product') : t('products')}
            </span>
            {currentCategory && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {locale === 'bg' && currentCategory.name_bg ? currentCategory.name_bg : currentCategory.name}
              </span>
            )}
          </div>

          {/* Product Grid - Optimized for search results */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image_url || product.images?.[0] || "/placeholder.svg"}
                rating={product.rating || 0}
                reviews={product.review_count || 0}
                originalPrice={product.list_price}
                tags={product.tags || []}
                slug={product.slug}
                storeSlug={product.profiles?.username}
                sellerId={product.profiles?.id || undefined}
                sellerName={(product.profiles?.display_name || product.profiles?.business_name || product.profiles?.username) || undefined}
                sellerAvatarUrl={product.profiles?.avatar_url || null}
                sellerTier={product.profiles?.account_type === 'business' ? 'business' : (product.profiles?.tier === 'premium' ? 'premium' : 'basic')}
                sellerVerified={Boolean(product.profiles?.is_verified_business)}
                categorySlug={product.categories?.slug || currentCategory?.slug}
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
                {query 
                  ? t('noResultsForQuery', { query })
                  : t('noResultsForFilters')
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/search">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-brand hover:bg-brand/90 text-foreground h-10 px-4 py-2 gap-2">
                    {t('clearAllFiltersButton')}
                  </button>
                </Link>
                <Link href="/">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
                    {t('browseAllProducts')}
                  </button>
                </Link>
              </div>
              <div className="mt-8 pt-6 border-t border-border max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-3">{t('popularCategories')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/search?category=electronics" className="text-sm text-link hover:underline">{locale === 'bg' ? 'Електроника' : 'Electronics'}</Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/search?category=fashion" className="text-sm text-link hover:underline">{locale === 'bg' ? 'Мода' : 'Fashion'}</Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/search?category=home" className="text-sm text-link hover:underline">{locale === 'bg' ? 'Дом' : 'Home'}</Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/todays-deals" className="text-sm text-link hover:underline">{locale === 'bg' ? 'Оферти днес' : 'Today\'s Deals'}</Link>
                </div>
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
      </div>
    </div>
    </div>
  )
}
