import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function normalizeAttrKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

// Helper to get all ancestor category IDs (for attribute inheritance)
async function getCategoryAncestorIds(supabase: Awaited<ReturnType<typeof createClient>>, categoryId: string): Promise<string[]> {
  const ancestorIds: string[] = [categoryId]
  
  if (!supabase) return ancestorIds
  
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("slug")
    // IMPORTANT: default to minimal attributes for the selected category only.
    // Inheritance/global attributes can be extremely noisy for many categories.
    const includeParents = searchParams.get("includeParents") === "true" // Default false
    const includeGlobal = searchParams.get("includeGlobal") === "true" // Default false

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // If slug provided, resolve to ID first
    let resolvedCategoryId = categoryId
    if (categorySlug && !categoryId) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single()
      
      if (category) {
        resolvedCategoryId = category.id
      }
    }

    if (!resolvedCategoryId) {
      return NextResponse.json({ attributes: [] })
    }

    // Get all ancestor category IDs for optional inheritance
    const categoryIds = includeParents
      ? await getCategoryAncestorIds(supabase, resolvedCategoryId)
      : [resolvedCategoryId]

    // Fetch attributes for requested category scope
    let query = supabase
      .from("category_attributes")
      .select("*")

    if (includeGlobal) {
      // Supabase query builder doesn't support mixing `.in` and `.is` in a single OR chain cleanly,
      // so keep a simple string OR with quoted UUIDs.
      const quoted = categoryIds.map((id) => `"${id}"`).join(",")
      query = query.or(`category_id.in.(${quoted}),category_id.is.null`)
    } else {
      query = query.in("category_id", categoryIds)
    }

    const { data: attributes, error } = await query.order("sort_order")

    if (error) {
      console.error("Error fetching category attributes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

    const sortedAttributes = [...(attributes || [])].sort((a, b) => {
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
    const deduplicatedAttributes: any[] = []

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

    return NextResponse.json({ 
      attributes: deduplicatedAttributes,
      categoryId: resolvedCategoryId,
      inheritedFrom: includeParents ? categoryIds : [resolvedCategoryId],
      includeParents,
      includeGlobal,
    })
  } catch (error: unknown) {
    console.error("Category Attributes API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}