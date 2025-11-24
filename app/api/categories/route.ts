import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentSlug = searchParams.get("parent")
    const includeChildren = searchParams.get("children") === "true"

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    if (parentSlug) {
      // Get subcategories of a specific parent category
      // First get parent category ID
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug")
        .eq("slug", parentSlug)
        .single()

      if (!parentCategory) {
        return NextResponse.json({ categories: [], parent: null })
      }

      // Then get all children
      const { data: subcategories } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, icon, image_url")
        .eq("parent_id", parentCategory.id)
        .order("name")

      return NextResponse.json({
        categories: subcategories || [],
        parent: parentCategory
      })
    }

    // Get all top-level categories (no parent)
    let query = supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, image_url, parent_id")
      .is("parent_id", null)
      .order("name")

    const { data: categories } = await query

    if (includeChildren && categories) {
      // For each category, fetch its children
      const categoriesWithChildren = await Promise.all(
        categories.map(async (cat) => {
          const { data: children } = await supabase
            .from("categories")
            .select("id, name, name_bg, slug, icon, image_url")
            .eq("parent_id", cat.id)
            .order("name")
          
          return {
            ...cat,
            children: children || []
          }
        })
      )
      return NextResponse.json({ categories: categoriesWithChildren })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error: any) {
    console.error("Categories API Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
