import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  if (!token || token.length !== 32) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  const { data, error } = await supabase.rpc("get_shared_wishlist", { p_share_token: token })

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const meta = {
    name: data[0]?.wishlist_name ?? "Wishlist",
    description: data[0]?.wishlist_description ?? null,
    owner_name: data[0]?.owner_name ?? null,
    count: data.length,
  }

  const items = data.map((row: any) => ({
    product_id: row.product_id,
    product_title: row.product_title,
    product_price: row.product_price,
    product_image: row.product_image,
    added_at: row.added_at,
  }))

  return NextResponse.json({ meta, items })
}
