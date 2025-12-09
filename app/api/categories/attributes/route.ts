import { createClient } from "@/lib/supabase/server"
import { NextResponse, connection } from "next/server"

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
  await connection()
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("slug")
    const includeParents = searchParams.get("includeParents") !== "false" // Default true

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

    // Get all ancestor category IDs for attribute inheritance (L0 → L1 → L2)
    const categoryIds = includeParents 
      ? await getCategoryAncestorIds(supabase, resolvedCategoryId)
      : [resolvedCategoryId]
    
    // Also include global attributes (category_id is null)
    // Get attributes for this category AND all parent categories
    const { data: attributes, error } = await supabase
      .from("category_attributes")
      .select("*")
      .or(`category_id.in.(${categoryIds.join(",")}),category_id.is.null`)
      .order("sort_order")

    if (error) {
      console.error("Error fetching category attributes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Deduplicate attributes by name (child category attributes override parent)
    const seenNames = new Set<string>()
    const deduplicatedAttributes = []
    
    // Process in reverse order so child attributes take priority
    const sortedAttributes = [...(attributes || [])].sort((a, b) => {
      // Category-specific attributes come before global (null category_id)
      if (a.category_id === resolvedCategoryId && b.category_id !== resolvedCategoryId) return -1
      if (b.category_id === resolvedCategoryId && a.category_id !== resolvedCategoryId) return 1
      // Then by sort_order
      return (a.sort_order || 0) - (b.sort_order || 0)
    })
    
    for (const attr of sortedAttributes) {
      if (!seenNames.has(attr.name)) {
        seenNames.add(attr.name)
        deduplicatedAttributes.push(attr)
      }
    }

    // Sort final result by sort_order
    deduplicatedAttributes.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

    return NextResponse.json({ 
      attributes: deduplicatedAttributes,
      categoryId: resolvedCategoryId,
      inheritedFrom: categoryIds 
    })
  } catch (error: unknown) {
    console.error("Category Attributes API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
