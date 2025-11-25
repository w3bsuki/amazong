import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { SubcategoryTabs } from "@/components/subcategory-tabs"
import { SearchHeader } from "@/components/search-header"
import { Suspense } from "react"

// Define types for better type safety
interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
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
      .select("id, name, name_bg, slug, parent_id")
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



  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-w-[1500px] mx-auto">
        {/* Sidebar Filters */}
        <div className="w-64 p-4 border-r border-[#eee] hidden lg:block space-y-6">
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
        <div className="flex-1 p-4">
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

          <div className="mb-4 flex items-center justify-between border-b border-[#eee] pb-2">
            <h1 className="font-bold text-sm">
              {products.length} results
              {query && (
                <span>
                  {" "}
                  for <span className="text-[#c45500]">"{query}"</span>
                </span>
              )}
              {currentCategory && !query && (
                <span className="font-normal text-[#565959]"> in {currentCategory.name}</span>
              )}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#555]">Sort by:</span>
              <select className="text-sm bg-[#f0f2f2] border border-[#d5d9d9] rounded-[8px] px-2 py-1 shadow-sm hover:bg-[#e3e6e6] cursor-pointer focus:ring-[#e77600] focus:border-[#e77600]">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Avg. Customer Review</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image_url}
                rating={product.rating || 0} // Use actual rating from DB
                reviews={product.review_count || 0} // Use actual review count from DB
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-medium">No results found.</h2>
              <p className="text-zinc-600">Try checking your spelling or use more general terms.</p>
            </div>
          )}

          {/* Pagination Placeholder */}
          {products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-1 border border-[#d5d9d9] rounded-[7px] overflow-hidden">
                <button className="px-3 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#f7f7f7] border-r border-[#d5d9d9] disabled:opacity-50">Previous</button>
                <button className="px-3 py-2 text-sm font-bold text-[#0F1111] bg-[#f7f7f7] border-r border-[#d5d9d9]">1</button>
                <button className="px-3 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#f7f7f7] border-r border-[#d5d9d9]">2</button>
                <button className="px-3 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#f7f7f7] border-r border-[#d5d9d9]">3</button>
                <button className="px-3 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#f7f7f7]">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
