import { createRouteHandlerClient } from "@/lib/supabase/server"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import type { Database } from "@/lib/supabase/database.types"
import type { NextRequest } from "next/server"

type SharedWishlistRow = Database["public"]["Functions"]["get_shared_wishlist"]["Returns"][number]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  if (!token || token.length !== 32) {
    return noStoreJson({ error: "Invalid token" }, { status: 400 })
  }

  const { supabase, applyCookies } = createRouteHandlerClient(req)

  const { data, error } = await supabase.rpc("get_shared_wishlist", { p_share_token: token })

  if (error || !data || data.length === 0) {
    return applyCookies(noStoreJson({ error: "Not found" }, { status: 404 }))
  }

  const meta = {
    name: data[0]?.wishlist_name ?? "Wishlist",
    description: data[0]?.wishlist_description ?? null,
    owner_name: data[0]?.owner_name ?? null,
    count: data.length,
  }

  const items = data.map((row: SharedWishlistRow) => ({
    product_id: row.product_id,
    product_title: row.product_title,
    product_price: row.product_price,
    product_image: row.product_image,
    added_at: row.added_at,
  }))

  return applyCookies(cachedJsonResponse({ meta, items }, "shared"))
}
