import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { Suspense } from "react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    minRating?: string
    subcategory?: string
    tag?: string
  }
}) {
  const supabase = await createClient()
  const query = searchParams.q || ""
  let products = []

  if (supabase) {
    let dbQuery = supabase.from("products").select("*")

    if (query) {
      // Use Full Text Search with the 'websearch' config for better natural language handling
      dbQuery = dbQuery.textSearch("search_vector", query, {
        type: "websearch",
        config: "english"
      })
    }

    if (searchParams.category) {
      dbQuery = dbQuery.eq("category", searchParams.category)
    }

    if (searchParams.minPrice) {
      dbQuery = dbQuery.gte("price", Number(searchParams.minPrice))
    }

    if (searchParams.maxPrice) {
      dbQuery = dbQuery.lte("price", Number(searchParams.maxPrice))
    }

    if (searchParams.subcategory) {
      dbQuery = dbQuery.ilike("subcategory", `%${searchParams.subcategory}%`)
    }

    if (searchParams.tag) {
      dbQuery = dbQuery.contains("tags", [searchParams.tag])
    }

    // Note: Rating is not in DB yet, so we can't filter by it on server.
    // For now, we will just fetch results and filter on client or ignore rating filter.
    // Assuming we want to eventually add it, we'd add .gte("rating", minRating)

    const { data } = await dbQuery
    products = data || []
  }



  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-w-[1500px] mx-auto">
        {/* Sidebar Filters */}
        <div className="w-[240px] p-4 border-r border-[#eee] hidden lg:block space-y-6">
          <Suspense>
            <SearchFilters />
          </Suspense>
        </div>

        {/* Main Results */}
        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between border-b border-[#eee] pb-2">
            <h1 className="font-bold text-sm">
              {products.length} results
              {query && (
                <span>
                  {" "}
                  for <span className="text-[#c45500]">"{query}"</span>
                </span>
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
