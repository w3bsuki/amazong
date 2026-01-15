import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { cacheLife, cacheTag } from "next/cache"

// Align CDN cache headers with next.config.ts cacheLife.products
// (revalidate: 300s, stale: 60s)
const CACHE_TTL_SECONDS = 300
const CACHE_STALE_WHILE_REVALIDATE = 60

// Get one top-rated product per subcategory for mega-menu display.
// NOTE: This is NOT boost/promoted logic - it's selecting the best-rated product
// per subcategory to showcase in the navigation. "Featured" here means
// "representative product for the category", not a paid boost.
export async function GET(request: import("next/server").NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    
    if (!parentId) {
      return NextResponse.json({ error: "parentId is required" }, { status: 400 })
    }

    const productsByCategory = await getTopRatedProductsBySubcategoryCached(parentId)

    return NextResponse.json(
      { products: productsByCategory },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          "CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
          "Vercel-CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
        },
      }
    )
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Categories Products API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

type TopRatedProduct = {
  id: string
  title: string
  price: number
  list_price: number | null
  image: string | null
  rating: number | null
  slug: string | null
}

/**
 * Get one top-rated product per subcategory.
 * Used for mega-menu navigation to show representative products.
 * NOTE: This is unrelated to paid boosts - it's organic ranking by rating.
 */
async function getTopRatedProductsBySubcategoryCached(parentId: string): Promise<Record<string, TopRatedProduct>> {
  'use cache'
  cacheLife('products')
  cacheTag('categories:tree')
  cacheTag(`category-children:${parentId}`)

  const supabase = createStaticClient()

  // Get all subcategory IDs for this parent
  const { data: subcategories } = await supabase
    .from("categories")
    .select("id, slug")
    .eq("parent_id", parentId)

  if (!subcategories || subcategories.length === 0) {
    return {}
  }

  for (const sub of subcategories) {
    if (sub?.slug) cacheTag(`products:category:${sub.slug}`)
  }

  // For each subcategory, get one product
  const subcategoryIds = subcategories.map((s) => s.id)

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        price,
        list_price,
        images,
        rating,
        slug,
        category_id
      `
    )
    .in("category_id", subcategoryIds)
    .order("rating", { ascending: false })
    .order("review_count", { ascending: false })

  if (error) {
    console.error("Products query error:", error)
    return {}
  }

  // Group by category_id and take only the first (best rated) product per category
  const productsByCategory: Record<string, TopRatedProduct> = {}

  if (products) {
    for (const product of products) {
      const catId = product.category_id
      if (catId && !productsByCategory[catId]) {
        productsByCategory[catId] = {
          id: product.id,
          title: product.title,
          price: product.price,
          list_price: product.list_price,
          image: product.images?.[0] || null,
          rating: product.rating,
          slug: product.slug,
        }
      }
    }
  }

  return productsByCategory
}