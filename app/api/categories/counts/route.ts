import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

// This endpoint returns product counts for ALL categories (L0, L1, L2)
// Used for sidebar category navigation to show listing counts

// Cache for 1 hour, stale for 5 min (counts don't need to be real-time)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

interface CategoryCount {
  slug: string
  count: number
}

/**
 * Get product counts for all categories (L0, L1, L2).
 * Uses category_ancestors array for efficient counting.
 */
async function getCategoryCountsCached(): Promise<CategoryCount[]> {
  'use cache'
  cacheTag('categories:counts')
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return []

  // Get all categories (L0, L1, L2) - not just root
  const { data: allCats, error: catsError } = await supabase
    .from("categories")
    .select("id, slug, depth")
    .lte("depth", 2) // L0, L1, L2 only
    .lt("display_order", 9000)
    .order("depth", { ascending: true })
    .order("display_order", { ascending: true })

  if (catsError || !allCats) {
    console.error("Error fetching categories:", catsError)
    return []
  }

  // Count products for each category
  // Products have category_ancestors array containing all ancestor category IDs
  const counts = await Promise.all(
    allCats.map(async (cat) => {
      const { count, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .contains('category_ancestors', [cat.id])
      
      if (countError) {
        console.error(`Error counting products for ${cat.slug}:`, countError)
        return { slug: cat.slug, count: 0 }
      }

      return { 
        slug: cat.slug, 
        count: count ?? 0 
      }
    })
  )

  return counts
}

export async function GET() {
  try {
    const counts = await getCategoryCountsCached()
    
    // Convert to map for easier client-side lookup
    const countsMap = Object.fromEntries(
      counts.map(c => [c.slug, c.count])
    )

    return NextResponse.json(
      { counts: countsMap },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          'CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
          'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
        }
      }
    )
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Category Counts API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
