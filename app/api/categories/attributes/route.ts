import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("slug")

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

    // Get attributes for this category
    const { data: attributes, error } = await supabase
      .from("category_attributes")
      .select("*")
      .eq("category_id", resolvedCategoryId)
      .order("sort_order")

    if (error) {
      console.error("Error fetching category attributes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      attributes: attributes || [],
      categoryId: resolvedCategoryId 
    })
  } catch (error: any) {
    console.error("Category Attributes API Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
