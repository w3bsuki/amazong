import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentSlug = searchParams.get("parent")
    const includeChildren = searchParams.get("children") === "true"
    const depth = parseInt(searchParams.get("depth") || "1") // Support depth=2 for L2, depth=3 for L3

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Helper function to recursively fetch children up to specified depth
    async function fetchChildrenRecursively(parentId: string, currentDepth: number, maxDepth: number): Promise<any[]> {
      if (currentDepth > maxDepth) return []
      
      const { data: children } = await supabase!
        .from("categories")
        .select("id, name, name_bg, slug, icon, image_url, display_order")
        .eq("parent_id", parentId)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true })
      
      if (!children || children.length === 0) return []
      
      if (currentDepth < maxDepth) {
        const childrenWithGrandchildren = await Promise.all(
          children.map(async (child) => ({
            ...child,
            children: await fetchChildrenRecursively(child.id, currentDepth + 1, maxDepth)
          }))
        )
        return childrenWithGrandchildren
      }
      
      return children
    }

    if (parentSlug) {
      // Get subcategories of a specific parent category
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug")
        .eq("slug", parentSlug)
        .single()

      if (!parentCategory) {
        return NextResponse.json({ categories: [], parent: null })
      }

      const subcategories = await fetchChildrenRecursively(parentCategory.id, 1, depth)
      
      return NextResponse.json({
        categories: subcategories,
        parent: parentCategory
      })
    }

    // Get all top-level categories (no parent)
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, image_url, parent_id, display_order")
      .is("parent_id", null)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (includeChildren && categories) {
      // For each L0 category, fetch children recursively based on depth
      const categoriesWithChildren = await Promise.all(
        categories.map(async (cat) => ({
          ...cat,
          children: await fetchChildrenRecursively(cat.id, 1, depth)
        }))
      )
      return NextResponse.json({ categories: categoriesWithChildren })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error: any) {
    console.error("Categories API Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
