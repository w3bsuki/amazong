import type { NextRequest } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import { resolveCategoryAttributes } from "@/lib/data/category-attributes"
import { z } from "zod"

const CategoryParamSchema = z.string().trim().min(1).max(64)

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
    const { slug: rawSlug } = await params
    const slugResult = CategoryParamSchema.safeParse(rawSlug)

    if (!slugResult.success) {
      return noStoreJson({ error: "Category slug/ID is required" }, { status: 400 })
    }

    const slug = slugResult.data

    const result = await getCategoryAttributesCached(slug)
    if (!result.ok) {
      return noStoreJson({ error: result.message }, { status: result.status })
    }

    return cachedJsonResponse(
      {
        category_id: result.category_id,
        attributes: result.attributes,
        inherited_from: result.inherited_from,
        count: result.count,
      },
      "categories",
    )
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Unexpected error:", error)
    return noStoreJson({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
