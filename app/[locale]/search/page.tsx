import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { SubcategoryTabs } from "@/components/subcategory-tabs"
import { SearchHeader } from "@/components/search-header"
import { MobileFilters } from "@/components/mobile-filters"
import { FilterChips } from "@/components/filter-chips"
import { Suspense } from "react"
import { getLocale } from "next-intl/server"

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

        let dbQuery = supabase
          .from("products")
          .select("*")
          .in("category_id", categoryIds)

        if (query) {
          dbQuery = dbQuery.textSearch("search_vector", query, {
            type: "websearch",
            config: "english"
          })
        }

        if (searchParams.minPrice) {
          dbQuery = dbQuery.gte("price", Number(searchParams.minPrice))
        }

        if (searchParams.maxPrice) {
          dbQuery = dbQuery.lte("price", Number(searchParams.maxPrice))
        }

        if (searchParams.tag) {
          dbQuery = dbQuery.contains("tags", [searchParams.tag])
        }

        if (searchParams.minRating) {
          dbQuery = dbQuery.gte("rating", Number(searchParams.minRating))
        }

        if (searchParams.prime === "true") {
          dbQuery = dbQuery.eq("is_prime", true)
        }

        if (searchParams.availability === "instock") {
          dbQuery = dbQuery.gt("stock", 0)
        }

        const { data } = await dbQuery
        products = data || []
      }
    } else {
      // No category filter - get all products
      let dbQuery = supabase.from("products").select("*")

      if (query) {
        dbQuery = dbQuery.textSearch("search_vector", query, {
          type: "websearch",
          config: "english"
        })
      }

      if (searchParams.minPrice) {
        dbQuery = dbQuery.gte("price", Number(searchParams.minPrice))
      }

      if (searchParams.maxPrice) {
        dbQuery = dbQuery.lte("price", Number(searchParams.maxPrice))
      }

      if (searchParams.tag) {
        dbQuery = dbQuery.contains("tags", [searchParams.tag])
      }

      if (searchParams.minRating) {
        dbQuery = dbQuery.gte("rating", Number(searchParams.minRating))
      }

      if (searchParams.prime === "true") {
        dbQuery = dbQuery.eq("is_prime", true)
      }

      if (searchParams.availability === "instock") {
        dbQuery = dbQuery.gt("stock", 0)
      }

      const { data } = await dbQuery
      products = data || []
    }

    // Extract unique brands from products for the filter
    // This would ideally come from a brands table, but for now we can extract from products
    // brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
  }

  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row container !px-0">
        {/* Sidebar Filters - Hidden on mobile */}
        <div className="w-64 p-4 border-r border-border hidden lg:block space-y-6 shrink-0">
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

        {/* Main Results */}
        <div className="flex-1 p-4 sm:p-6">
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

          {/* Mobile Filter Chips - Horizontal scroll */}
          <div className="lg:hidden mb-4">
            <Suspense>
              <FilterChips currentCategory={currentCategory} />
            </Suspense>
          </div>

          {/* Results count, mobile filter button, and sort - Same row layout */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{products.length}</span> results
                {query && (
                  <span className="hidden sm:inline">
                    {" "}for <span className="font-medium text-brand-deal">"{query}"</span>
                  </span>
                )}
                {currentCategory && !query && (
                  <span className="hidden sm:inline"> in <span className="font-medium">{currentCategory.name}</span></span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <div className="lg:hidden">
                <Suspense>
                  <MobileFilters 
                    categories={allCategories}
                    currentCategory={currentCategory}
                    locale={locale}
                  />
                </Suspense>
              </div>
              <label htmlFor="sort" className="text-sm text-muted-foreground hidden sm:inline">Sort by:</label>
              <select 
                id="sort"
                className="min-h-9 text-sm bg-card border border-border rounded-lg px-3 py-1.5 hover:bg-secondary cursor-pointer focus:ring-2 focus:ring-ring outline-none appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m2%204%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[right_12px_center] bg-no-repeat"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Avg. Customer Review</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image_url}
                rating={product.rating || 0}
                reviews={product.review_count || 0}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
              <p className="text-muted-foreground">Try checking your spelling or use more general terms.</p>
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
  )
}
