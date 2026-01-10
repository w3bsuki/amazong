import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import { cacheLife, cacheTag } from "next/cache"

// =============================================================================
// GET /api/categories/[slug]/children
// 
// Fetches direct children of a category by parent ID (passed as slug param).
// Used for lazy-loading L3 pills when L2 is selected.
// 
// Response is cached at CDN + Next.js cache for optimal performance.
// =============================================================================

const CACHE_TTL_SECONDS = 3600  // 1 hour
const CACHE_STALE_WHILE_REVALIDATE = 300  // 5 min

interface CategoryChild {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon: string | null
  image_url: string | null
  display_order: number | null
}

async function getChildrenCached(parentId: string): Promise<CategoryChild[]> {
  'use cache'
  cacheTag('categories:tree')
  cacheTag(`category-children:${parentId}`)
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, icon, image_url, display_order")
    .eq("parent_id", parentId)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("getChildrenCached error:", error)
    return []
  }

  return (data || []).map((cat) => ({
    ...cat,
    image_url: normalizeOptionalImageUrl(cat.image_url),
  }))
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // slug param contains the parent category ID
  const { slug: parentId } = await params

  if (!parentId || parentId.length < 10) {
    return NextResponse.json(
      { error: "Invalid parent ID" },
      { status: 400 }
    )
  }

  try {
    const children = await getChildrenCached(parentId)
    
    return NextResponse.json(
      { children },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          'CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
          'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
        }
      }
    )
  } catch (error) {
    console.error("Children API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    )
  }
}
