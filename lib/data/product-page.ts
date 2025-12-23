import { createStaticClient } from "@/lib/supabase/server"

/**
 * Fetch product by seller username + product slug.
 * Returns the product row enriched with `seller` (profile) and `category`.
 */
export async function fetchProductByUsernameAndSlug(
  supabase: ReturnType<typeof createStaticClient>,
  username: string,
  productSlug: string
) {
  if (!supabase) return null

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, verified, is_seller, created_at")
    .ilike("username", username)
    .single()

  if (profileError || !profile) return null

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .eq("seller_id", profile.id)
    .single()

  if (productError || !product) return null

  let category = null
  if (product.category_id) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", product.category_id)
      .single()
    category = data
  }

  return { ...product, seller: profile, category }
}
