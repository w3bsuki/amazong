"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, icon, parent_id")
    .is("parent_id", null)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

export async function getSubcategories(parentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, icon, parent_id")
    .eq("parent_id", parentId)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching subcategories:", error)
    return []
  }

  return data
}

export async function getCategoryAttributes(categoryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("category_attributes")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching attributes:", error)
    return []
  }

  return data
}
