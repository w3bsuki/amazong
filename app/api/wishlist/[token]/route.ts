import { createRouteHandlerClient } from "@/lib/supabase/server"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import type { Database } from "@/lib/supabase/database.types"
import { logger } from "@/lib/logger"
import type { NextRequest } from "next/server"
import { z } from "zod"

type SharedWishlistRow = Database["public"]["Functions"]["get_shared_wishlist"]["Returns"][number]

const SharedWishlistParamsSchema = z
  .object({
    token: z.string().length(32).regex(/^[a-z0-9]+$/i),
  })
  .strict()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const parsedParams = SharedWishlistParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return noStoreJson({ error: "Invalid token" }, { status: 400 })
  }

  const { token } = parsedParams.data

  const { supabase, applyCookies } = createRouteHandlerClient(req)

  try {
    const { data, error } = await supabase.rpc("get_shared_wishlist", { p_share_token: token })

    if (error) {
      logger.error("[api/wishlist/shared] rpc_failed", error, { token })
      return applyCookies(noStoreJson({ error: "Internal server error" }, { status: 500 }))
    }

    if (!data || data.length === 0) {
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
  } catch (error) {
    logger.error("[api/wishlist/shared] unexpected_error", error, { token })
    return applyCookies(noStoreJson({ error: "Internal server error" }, { status: 500 }))
  }
}
