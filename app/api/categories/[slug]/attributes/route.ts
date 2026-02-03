import { NextRequest, NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { cacheLife, cacheTag } from "next/cache";
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted";
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key";
import { CATEGORY_ATTRIBUTES_SELECT } from "@/lib/supabase/selects/categories";

// Public endpoint: use anon key so RLS is still enforced

// Align CDN cache headers with next.config.ts cacheLife.categories
// (revalidate: 3600s, stale: 300s)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

// Use the generated database type for category attributes
type CategoryAttributeRow = Database["public"]["Tables"]["category_attributes"]["Row"];

async function getCategoryAttributesCached(slugOrId: string) {
  'use cache'
  cacheLife('categories')
  cacheTag('categories:tree')

  const supabase = createStaticClient()

  // First, try to find the category by slug or ID
  let categoryId = slugOrId

  // If slug doesn't look like a UUID, look up by slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)
  if (!isUuid) {
    cacheTag(`category:${slugOrId}`)

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slugOrId)
      .single()

    if (categoryError || !category) {
      return { ok: false as const, status: 404 as const, message: "Category not found" }
    }
    categoryId = category.id
  }

  cacheTag(`attrs:category:${categoryId}`)

  // Fetch attributes for this category
  const { data: attributes, error } = await supabase
    .from("category_attributes")
    .select(CATEGORY_ATTRIBUTES_SELECT)
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching category attributes:", error)
    return { ok: false as const, status: 500 as const, message: "Failed to fetch category attributes" }
  }

  // Walk up the full parent chain to collect inherited attributes
  // e.g., Clothing -> Men's -> Fashion (we need Fashion's attrs like Condition, Size, Color)
  const { data: category } = await supabase
    .from("categories")
    .select("parent_id")
    .eq("id", categoryId)
    .single()

  const inheritedAttributes: CategoryAttributeRow[] = []

  const getAttrKey = (attr: Pick<CategoryAttributeRow, "attribute_key" | "name" | "id">) => {
    const key = attr.attribute_key ?? normalizeAttributeKey(attr.name)
    return key || attr.id
  }

  const seenAttributeKeys = new Set((attributes || []).map((a) => getAttrKey(a)))

  // Walk up the parent chain
  let currentParentId = category?.parent_id
  while (currentParentId) {
    cacheTag(`attrs:category:${currentParentId}`)

    const { data: parentAttrs } = await supabase
      .from("category_attributes")
      .select(CATEGORY_ATTRIBUTES_SELECT)
      .eq("category_id", currentParentId)
      .order("sort_order", { ascending: true })

    // Add parent attrs that we haven't seen yet (child takes precedence)
    if (parentAttrs) {
      for (const attr of parentAttrs) {
        const key = getAttrKey(attr)
        if (!seenAttributeKeys.has(key)) {
          inheritedAttributes.push(attr)
          seenAttributeKeys.add(key)
        }
      }
    }

    // Get next parent
    const { data: parentCat } = await supabase
      .from("categories")
      .select("parent_id")
      .eq("id", currentParentId)
      .single()

    currentParentId = parentCat?.parent_id
  }

  // Merge all attributes and sort by sort_order
  // Inherited attrs from top-level parents (Fashion) have lower sort_order (0-7)
  // Child-specific attrs (Clothing) have higher sort_order (10+)
  const allAttributes = [...(attributes || []), ...inheritedAttributes]
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))

  // Transform to cleaner format for frontend
  const formattedAttributes = allAttributes.map((attr) => ({
    id: attr.id,
    name: attr.name,
    nameBg: attr.name_bg,
    type: attr.attribute_type,
    attributeKey: attr.attribute_key ?? (normalizeAttributeKey(attr.name) || null),
    required: attr.is_required,
    filterable: attr.is_filterable,
    isHeroSpec: attr.is_hero_spec,
    heroPriority: attr.hero_priority,
    unitSuffix: attr.unit_suffix,
    options: attr.options as string[] | null,
    optionsBg: attr.options_bg as string[] | null,
    placeholder: attr.placeholder,
    placeholderBg: attr.placeholder_bg,
    validationRules: attr.validation_rules as Record<string, unknown> | null,
    sortOrder: attr.sort_order,
  }))

  return {
    ok: true as const,
    categoryId,
    attributes: formattedAttributes,
    count: formattedAttributes.length,
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
        categoryId: result.categoryId,
        attributes: result.attributes,
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
