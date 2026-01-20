import { createStaticClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { cacheLife, cacheTag } from "next/cache"

type CategoryAttribute = Database["public"]["Tables"]["category_attributes"]["Row"]

// Align CDN cache headers with next.config.ts cacheLife.categories
// (revalidate: 3600s, stale: 300s)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

function normalizeAttrKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, " ")
}

// Helper to get all ancestor category IDs (for attribute inheritance)
async function getCategoryAncestorIds(supabase: SupabaseClient<Database>, categoryId: string): Promise<string[]> {
  const ancestorIds: string[] = [categoryId]
  
  let currentId: string | null = categoryId
  
  // Walk up the parent chain (max 5 levels to prevent infinite loops)
  for (let i = 0; i < 5 && currentId; i++) {
    const { data } = await supabase
      .from("categories")
      .select("parent_id")
      .eq("id", currentId)
      .single()
    
    const category = data as { parent_id: string | null } | null
    
    if (category?.parent_id) {
      ancestorIds.push(category.parent_id)
      currentId = category.parent_id
    } else {
      break
    }
  }
  
  return ancestorIds
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("slug")
    // IMPORTANT: default to minimal attributes for the selected category only.
    // Inheritance/global attributes can be extremely noisy for many categories.
    const includeParents = searchParams.get("includeParents") === "true" // Default false
    const includeGlobal = searchParams.get("includeGlobal") === "true" // Default false


    // If slug provided, resolve to ID first
    let resolvedCategoryId = categoryId
    const result = await getCategoryAttributesCached({
      categoryId,
      categorySlug,
      includeParents,
      includeGlobal,
    })

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        "CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
        "Vercel-CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    })
  } catch (error: unknown) {
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Category Attributes API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

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

  const supabase = createStaticClient()

  // If slug provided, resolve to ID first
  let resolvedCategoryId = categoryId
  if (categorySlug && !categoryId) {
    cacheTag(`category:${categorySlug}`)

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (category) resolvedCategoryId = category.id
  }

  if (!resolvedCategoryId) {
    return { attributes: [] as CategoryAttribute[] }
  }

  // Get all ancestor category IDs for optional inheritance
  const categoryIds = includeParents
    ? await getCategoryAncestorIds(supabase, resolvedCategoryId)
    : [resolvedCategoryId]

  for (const id of categoryIds) {
    cacheTag(`attrs:category:${id}`)
  }
  if (includeGlobal) cacheTag('attrs:global')

  // Fetch attributes for requested category scope
  const CATEGORY_ATTRIBUTES_SELECT =
    "id, category_id, name, name_bg, attribute_type, options, options_bg, placeholder, placeholder_bg, is_filterable, is_required, sort_order, validation_rules, created_at, attribute_key, is_hero_spec, hero_priority, unit_suffix" as const

  let query = supabase.from("category_attributes").select(CATEGORY_ATTRIBUTES_SELECT)

  if (includeGlobal) {
    // Supabase query builder doesn't support mixing `.in` and `.is` in a single OR chain cleanly,
    // so keep a simple string OR with quoted UUIDs.
    const quoted = categoryIds.map((id) => `"${id}"`).join(",")
    query = query.or(`category_id.in.(${quoted}),category_id.is.null`)
  } else {
    query = query.in("category_id", categoryIds)
  }

  const { data: attributesRaw, error } = await query.order("sort_order")

  if (error) {
    console.error("Error fetching category attributes:", error)
    return { error: error.message }
  }

  const attributes = attributesRaw || []

  // Deduplicate by a normalized key, preferring attributes from the most specific category.
  // Priority order: selected category -> its parents (walking up) -> global (null category_id).
  const priorityByCategoryId = new Map<string, number>()
  if (includeParents) {
    for (let i = 0; i < categoryIds.length; i++) priorityByCategoryId.set(categoryIds[i]!, i)
  } else {
    priorityByCategoryId.set(resolvedCategoryId, 0)
  }

  const getPriority = (category_id: string | null) => {
    if (!category_id) return 10_000
    return priorityByCategoryId.get(category_id) ?? 9_000
  }

  const sortedAttributes = [...attributes].sort((a, b) => {
    const pa = getPriority(a.category_id ?? null)
    const pb = getPriority(b.category_id ?? null)
    if (pa !== pb) return pa - pb

    const sa = a.sort_order ?? 0
    const sb = b.sort_order ?? 0
    if (sa !== sb) return sa - sb

    // Stable-ish fallback for deterministic output
    const na = normalizeAttrKey(a.name)
    const nb = normalizeAttrKey(b.name)
    if (na !== nb) return na.localeCompare(nb)
    return String(a.id ?? "").localeCompare(String(b.id ?? ""))
  })

  const seenKeys = new Set<string>()
  const deduplicatedAttributes: CategoryAttribute[] = []

  for (const attr of sortedAttributes) {
    const nameKey = normalizeAttrKey(attr.name)
    const nameBgKey = normalizeAttrKey(attr.name_bg)
    const typeKey = normalizeAttrKey(attr.attribute_type)

    const candidateNames = [nameKey, nameBgKey].filter(Boolean)
    if (candidateNames.length === 0) {
      deduplicatedAttributes.push(attr)
      continue
    }

    const candidateKeys = candidateNames.map((n) => `${n}::${typeKey}`)

    // If ANY alias key is already seen, treat it as a duplicate.
    if (candidateKeys.some((k) => seenKeys.has(k))) continue

    // Otherwise, keep the first (most specific) attribute and mark all aliases as seen.
    for (const k of candidateKeys) seenKeys.add(k)
    deduplicatedAttributes.push(attr)
  }

  return {
    attributes: deduplicatedAttributes,
    categoryId: resolvedCategoryId,
    inheritedFrom: includeParents ? categoryIds : [resolvedCategoryId],
    includeParents,
    includeGlobal,
  }
}
