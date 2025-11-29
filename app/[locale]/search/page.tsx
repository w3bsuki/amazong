import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { SubcategoryTabs } from "@/components/subcategory-tabs"
import { SearchHeader } from "@/components/search-header"
import { MobileFilters } from "@/components/mobile-filters"
import { DesktopFilters } from "@/components/desktop-filters"
import { FilterChips } from "@/components/filter-chips"
import { SortSelect } from "@/components/sort-select"
import { Suspense } from "react"
import { getLocale } from "next-intl/server"
import type { Metadata } from 'next'

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

// Define types for better type safety
interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

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

// Helper function to search products with ILIKE fallback
async function searchProducts(
  supabase: any, 
  query: string, 
  categoryIds: string[] | null,
  filters: {
    minPrice?: string
    maxPrice?: string
    tag?: string
    minRating?: string
    prime?: string
    availability?: string
  }
): Promise<Product[]> {
  // Build base query
  let dbQuery = supabase.from("products").select("*")
  
  // Apply category filter if provided
  if (categoryIds && categoryIds.length > 0) {
    dbQuery = dbQuery.in("category_id", categoryIds)
  }
  
  // Apply other filters
  if (filters.minPrice) {
    dbQuery = dbQuery.gte("price", Number(filters.minPrice))
  }
  if (filters.maxPrice) {
    dbQuery = dbQuery.lte("price", Number(filters.maxPrice))
  }
  if (filters.tag) {
    dbQuery = dbQuery.contains("tags", [filters.tag])
  }
  if (filters.minRating) {
    dbQuery = dbQuery.gte("rating", Number(filters.minRating))
  }
  if (filters.prime === "true") {
    dbQuery = dbQuery.eq("is_prime", true)
  }
  if (filters.availability === "instock") {
    dbQuery = dbQuery.gt("stock", 0)
  }
  
  // If no query, just return products with filters
  if (!query) {
    const { data } = await dbQuery
    return data || []
  }
  
  // First try with full-text search
  const textSearchQuery = dbQuery.textSearch("search_vector", query, {
    type: "websearch",
    config: "english"
  })
  
  const { data: textSearchResults } = await textSearchQuery
  
  // If text search returns results, use them
  if (textSearchResults && textSearchResults.length > 0) {
    return textSearchResults
  }
  
  // Fallback to ILIKE search for partial matches
  // We need to rebuild the query since textSearch modifies it
  let fallbackQuery = supabase.from("products").select("*")
  
  if (categoryIds && categoryIds.length > 0) {
    fallbackQuery = fallbackQuery.in("category_id", categoryIds)
  }
  
  // Apply other filters again
  if (filters.minPrice) {
    fallbackQuery = fallbackQuery.gte("price", Number(filters.minPrice))
  }
  if (filters.maxPrice) {
    fallbackQuery = fallbackQuery.lte("price", Number(filters.maxPrice))
  }
  if (filters.tag) {
    fallbackQuery = fallbackQuery.contains("tags", [filters.tag])
  }
  if (filters.minRating) {
    fallbackQuery = fallbackQuery.gte("rating", Number(filters.minRating))
  }
  if (filters.prime === "true") {
    fallbackQuery = fallbackQuery.eq("is_prime", true)
  }
  if (filters.availability === "instock") {
    fallbackQuery = fallbackQuery.gt("stock", 0)
  }
  
  // Use ILIKE for partial matching on title and description
  fallbackQuery = fallbackQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  
  const { data: ilikResults } = await fallbackQuery
  return ilikResults || []
}

export default async function SearchPage({
  searchParams: searchParamsPromise,
}: {
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
  }>
}) {
  const searchParams = await searchParamsPromise
  const supabase = await createClient()
  const query = searchParams.q || ""
  let products: Product[] = []
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

        // Use the helper function with ILIKE fallback
        products = await searchProducts(supabase, query, categoryIds, {
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          tag: searchParams.tag,
          minRating: searchParams.minRating,
          prime: searchParams.prime,
          availability: searchParams.availability,
        })
      }
    } else {
      // No category filter - get all products
      products = await searchProducts(supabase, query, null, {
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        tag: searchParams.tag,
        minRating: searchParams.minRating,
        prime: searchParams.prime,
        availability: searchParams.availability,
      })
    }

    // Extract unique brands from products for the filter
    // This would ideally come from a brands table, but for now we can extract from products
    // brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
  }

  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile */}
          <aside className="w-64 hidden lg:block shrink-0">
            <div className="sticky top-28 pr-4 py-4 space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto border-r border-sidebar-border bg-sidebar">
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
                  categories={allCategories}
                  currentCategory={currentCategory}
                  locale={locale}
                  resultsCount={products.length}
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
              <span className="font-semibold text-foreground">{products.length}</span>
              <span> results</span>
              {query && (
                <span className="hidden lg:inline">
                  {" "}for <span className="font-medium text-brand-deal">"{query}"</span>
                </span>
              )}
              {currentCategory && !query && (
                <span className="hidden lg:inline"> in <span className="font-medium">{currentCategory.name}</span></span>
              )}
            </p>
          </div>
          
          {/* Mobile Results Info Strip */}
          <div className="sm:hidden mb-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5">
            <span>
              <span className="font-semibold text-foreground">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
            </span>
            {currentCategory && (
              <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-medium">
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
                image={product.image_url}
                rating={product.rating || 0}
                reviews={product.review_count || 0}
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
                {query 
                  ? `We couldn't find any results for "${query}". Try checking your spelling or use more general terms.`
                  : "We couldn't find any products matching your filters. Try adjusting your search criteria."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/search">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-brand hover:bg-brand/90 text-foreground h-10 px-4 py-2 gap-2">
                    Clear All Filters
                  </button>
                </a>
                <a href="/">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
                    Browse All Products
                  </button>
                </a>
              </div>
              <div className="mt-8 pt-6 border-t border-border max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-3">Popular categories:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <a href="/search?category=electronics" className="text-sm text-link hover:underline">Electronics</a>
                  <span className="text-muted-foreground">•</span>
                  <a href="/search?category=fashion" className="text-sm text-link hover:underline">Fashion</a>
                  <span className="text-muted-foreground">•</span>
                  <a href="/search?category=home" className="text-sm text-link hover:underline">Home</a>
                  <span className="text-muted-foreground">•</span>
                  <a href="/todays-deals" className="text-sm text-link hover:underline">Today's Deals</a>
                </div>
              </div>
            </div>
          )}

          {/* Pagination - Mobile optimized */}
          {products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-0.5 sm:gap-1 border border-border rounded-lg overflow-hidden overflow-x-auto no-scrollbar">
                <button className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border-r border-border disabled:opacity-50 min-h-10 whitespace-nowrap">Previous</button>
                <button className="px-3 sm:px-4 py-2 text-sm font-bold text-foreground bg-muted border-r border-border min-h-10">1</button>
                <button className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border-r border-border min-h-10">2</button>
                <button className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border-r border-border min-h-10">3</button>
                <button className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground hover:bg-muted min-h-10 whitespace-nowrap">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
