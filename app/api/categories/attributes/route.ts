import { NextRequest, NextResponse } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { resolveCategoryAttributes } from "@/lib/data/category-attributes"

// Align CDN cache headers with next.config.ts cacheLife.categories
// (revalidate: 3600s, stale: 300s)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

async function getCategoryAttributesCached(params: {
  categoryId: string | null
  categorySlug: string | null
  includeParents: boolean
  includeGlobal: boolean
}) {
  'use cache'
  cacheLife('categories')
  cacheTag('categories:tree')

  const { categoryId, categorySlug, includeParents, includeGlobal } = params
  const slugOrId = categoryId ?? categorySlug ?? null

  if (!slugOrId) {
    return { ok: false as const, status: 400 as const, message: "Category is required" }
  }

  cacheTag(`category:${slugOrId}`)

  const result = await resolveCategoryAttributes({
    slugOrId,
    includeParents,
    includeGlobal,
  })

  if (!result.categoryId) {
    return { ok: false as const, status: 404 as const, message: "Category not found" }
  }

  for (const id of result.ancestorIds) {
    cacheTag(`attrs:category:${id}`)
  }
  if (includeGlobal) cacheTag('attrs:global')

  return {
    ok: true as const,
    category_id: result.categoryId,
    attributes: result.attributes,
    inherited_from: result.ancestorIds,
    include_parents: includeParents,
    include_global: includeGlobal,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("slug")
    const includeParents = searchParams.get("includeParents") === "true"
    const includeGlobal = searchParams.get("includeGlobal") === "true"

    const result = await getCategoryAttributesCached({
      categoryId,
      categorySlug,
      includeParents,
      includeGlobal,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json(
      {
        category_id: result.category_id,
        attributes: result.attributes,
        inherited_from: result.inherited_from,
        include_parents: result.include_parents,
        include_global: result.include_global,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          "CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
          "Vercel-CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
        },
      }
    )
  } catch (error: unknown) {
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Category Attributes API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
