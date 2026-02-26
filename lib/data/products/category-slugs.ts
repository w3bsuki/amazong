import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function fetchCategorySlugsByIds(
  supabase: DbClient,
  categoryIds: Array<string | null | undefined>
): Promise<string[]> {
  const ids = [...new Set(categoryIds.filter((id): id is string => typeof id === "string" && id.length > 0))]
  if (ids.length === 0) return []

  const { data } = await supabase.from("categories").select("id, slug").in("id", ids)

  const slugs = (data ?? [])
    .map((row) => row?.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)

  return [...new Set(slugs)]
}

export async function fetchCategorySlugsForProducts(supabase: DbClient, productIds: string[]): Promise<string[]> {
  const ids = [...new Set(productIds.filter((id) => typeof id === "string" && id.length > 0))]
  if (ids.length === 0) return []

  const { data: products } = await supabase
    .from("products")
    .select("id, category_id")
    .in("id", ids)

  const categoryIds = (products ?? [])
    .map((product) => product?.category_id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  return fetchCategorySlugsByIds(supabase, categoryIds)
}

