import { createStaticClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import { cacheLife, cacheTag } from "next/cache"

import { logger } from "@/lib/logger"
// =============================================================================
// GET /api/categories/[categoryId]/children
// 
// Fetches direct children of a category by parent ID (passed as categoryId param).
// Used for lazy-loading L3 pills when L2 is selected.
// 
// Response is cached at CDN + Next.js cache for optimal performance.
// =============================================================================

const CategoryChildrenParamsSchema = z
  .object({
    categoryId: z.string().uuid(),
  })
  .strict()

interface CategoryChild {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon: string | null
  image_url: string | null
  display_order: number | null
  has_children?: boolean
  children?: CategoryChild[]
}

function isMissingBrowseableColumnError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false

  const record = error as Record<string, unknown>
  const code = typeof record.code === "string" ? record.code : ""
  const message = typeof record.message === "string" ? record.message : ""
  return code === "42703" && message.includes("is_browseable")
}

async function getChildrenCached(parentId: string): Promise<CategoryChild[]> {
  'use cache'
  cacheTag('categories:tree')
  cacheTag(`category-children:${parentId}`)
  cacheTag(`category:${parentId}`)
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return []

  const buildChildrenQuery = () =>
    supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, image_url, display_order")
      .eq("parent_id", parentId)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

  let { data, error } = await buildChildrenQuery().eq("is_browseable", true)
  if (error && isMissingBrowseableColumnError(error)) {
    ;({ data, error } = await buildChildrenQuery())
  }

  if (error) {
    logger.error("getChildrenCached error:", error)
    return []
  }
  
  if (!data || data.length === 0) return []
  
  // Check which children have their own children
  const childIds = data.map(c => c.id)
  const buildGrandchildrenQuery = () =>
    supabase
      .from("categories")
      .select("parent_id")
      .in("parent_id", childIds)
      .lt("display_order", 9000)

  let { data: grandchildren, error: grandchildrenError } = await buildGrandchildrenQuery().eq("is_browseable", true)
  if (grandchildrenError && isMissingBrowseableColumnError(grandchildrenError)) {
    ;({ data: grandchildren, error: grandchildrenError } = await buildGrandchildrenQuery())
  }

  if (grandchildrenError) {
    logger.error("getChildrenCached grandchildren query error:", grandchildrenError)
  }
  
  const hasChildrenSet = new Set((grandchildren || []).map(g => g.parent_id))

  return data.map((cat) => ({
    ...cat,
    image_url: normalizeOptionalImageUrl(cat.image_url),
    has_children: hasChildrenSet.has(cat.id),
    children: [],
  }))
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  // categoryId param contains the parent category ID
  const parsedParams = CategoryChildrenParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return noStoreJson({ error: "Invalid parent ID" }, { status: 400 })
  }
  const { categoryId: parentId } = parsedParams.data

  try {
    const children = await getChildrenCached(parentId)
    
    return cachedJsonResponse({ children }, "categories")
  } catch (error) {
    logger.error("Children API Error:", error)
    return noStoreJson({ error: "Failed to fetch children" }, { status: 500 })
  }
}
