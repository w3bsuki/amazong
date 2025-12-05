import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Type for the RPC return
interface CategoryHierarchyRow {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  depth: number
  path: string[]
  image_url: string | null
  icon: string | null
  display_order: number | null
}

// Type for the nested category structure
interface CategoryWithChildren {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon: string | null
  image_url: string | null
  display_order: number | null
  children?: CategoryWithChildren[]
}

// Transform flat RPC results into nested tree structure
function buildCategoryTree(rows: CategoryHierarchyRow[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []
  
  // First pass: create all category objects
  for (const row of rows) {
    categoryMap.set(row.id, {
      id: row.id,
      name: row.name,
      name_bg: row.name_bg,
      slug: row.slug,
      icon: row.icon,
      image_url: row.image_url,
      display_order: row.display_order,
      children: []
    })
  }
  
  // Second pass: build tree structure
  for (const row of rows) {
    const category = categoryMap.get(row.id)!
    
    if (row.parent_id && categoryMap.has(row.parent_id)) {
      // Add to parent's children
      const parent = categoryMap.get(row.parent_id)!
      parent.children = parent.children || []
      parent.children.push(category)
    } else if (row.depth === 0) {
      // Root category
      rootCategories.push(category)
    }
  }
  
  // Sort children by display_order, then by name
  function sortChildren(cats: CategoryWithChildren[]): CategoryWithChildren[] {
    cats.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
    for (const cat of cats) {
      if (cat.children && cat.children.length > 0) {
        sortChildren(cat.children)
      }
    }
    return cats
  }
  
  return sortChildren(rootCategories)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentSlug = searchParams.get("parent")
    const includeChildren = searchParams.get("children") === "true"
    const depth = parseInt(searchParams.get("depth") || "1")

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    if (parentSlug) {
      // Use RPC for specific parent category hierarchy
      const { data: hierarchyData, error } = await supabase.rpc('get_category_hierarchy', {
        p_slug: parentSlug,
        p_depth: depth
      })
      
      if (error) {
        console.error("RPC Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      const rows = (hierarchyData || []) as CategoryHierarchyRow[]
      const tree = buildCategoryTree(rows)
      
      // Find the parent from the tree (depth=0)
      const parent = tree.length > 0 ? {
        id: tree[0].id,
        name: tree[0].name,
        name_bg: tree[0].name_bg,
        slug: tree[0].slug
      } : null
      
      // Return children of the parent
      return NextResponse.json({
        categories: tree.length > 0 ? tree[0].children || [] : [],
        parent
      })
    }

    if (includeChildren) {
      // Use RPC for full hierarchy - single query replaces N+1!
      const { data: hierarchyData, error } = await supabase.rpc('get_category_hierarchy', {
        p_slug: null,
        p_depth: depth
      })
      
      if (error) {
        console.error("RPC Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      const rows = (hierarchyData || []) as CategoryHierarchyRow[]
      const tree = buildCategoryTree(rows)
      
      return NextResponse.json({ categories: tree })
    }

    // Simple query for just root categories (no children)
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, image_url, parent_id, display_order")
      .is("parent_id", null)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Categories Query Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error: any) {
    console.error("Categories API Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
