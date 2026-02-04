import { NextRequest, NextResponse } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { resolveCategoryAttributes } from "@/lib/data/category-attributes"

// Align CDN cache headers with next.config.ts cacheLife.categories
// (revalidate: 3600s, stale: 300s)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

async function getCategoryAttributesCached(slugOrId: string) {
  'use cache'
  cacheLife('categories')
  cacheTag('categories:tree')
  cacheTag(`category:${slugOrId}`)

  const result = await resolveCategoryAttributes({
    slugOrId,
    includeParents: true,
    includeGlobal: true,
  })

  if (!result.categoryId) {
    return { ok: false as const, status: 404 as const, message: "Category not found" }
  }

  for (const id of result.ancestorIds) {
    cacheTag(`attrs:category:${id}`)
  }
  cacheTag('attrs:global')

  return {
    ok: true as const,
    category_id: result.categoryId,
    attributes: result.attributes,
    inherited_from: result.ancestorIds,
    count: result.attributes.length,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: "Category slug/ID is required" }, { status: 400 })
    }

    const result = await getCategoryAttributesCached(slug)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json(
      {
        category_id: result.category_id,
        attributes: result.attributes,
        inherited_from: result.inherited_from,
        count: result.count,
      },
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
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
