import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

type SharedWishlistRow = Database["public"]["Functions"]["get_shared_wishlist"]["Returns"][number]

function noStoreJson(data: unknown, init?: ResponseInit) {
  const res = NextResponse.json(data, init)
  res.headers.set("Cache-Control", "private, no-store")
  res.headers.set("CDN-Cache-Control", "private, no-store")
  res.headers.set("Vercel-CDN-Cache-Control", "private, no-store")
  return res
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  if (!token || token.length !== 32) {
    return noStoreJson({ error: "Invalid token" }, { status: 400 })
  }

  const supabase = await createClient()
  if (!supabase) {
    return noStoreJson({ error: "Database unavailable" }, { status: 503 })
  }

  const { data, error } = await supabase.rpc("get_shared_wishlist", { p_share_token: token })

  if (error || !data || data.length === 0) {
    return noStoreJson({ error: "Not found" }, { status: 404 })
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

  return noStoreJson({ meta, items })
}
