import { NextRequest } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { noStoreJson } from "@/lib/api/response-helpers"
import { z } from "zod"

const ProductViewParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict()

/**
 * POST /api/products/[id]/view
 * Increment view count for a product.
 * 
 * Uses session-based deduplication via cookie to prevent abuse.
 * One view per session per product.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const parsedParams = ProductViewParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return noStoreJson({ error: "Invalid product ID" }, { status: 400 })
  }

  const { id } = parsedParams.data

  // Check if user already viewed this product in this session
  const viewedKey = `viewed_${id}`
  const viewedCookie = request.cookies.get(viewedKey)

  if (viewedCookie) {
    // Already counted this view in current session
    return noStoreJson({ success: true, already_counted: true })
  }

  const supabase = createStaticClient()

  // Use the RPC function to increment view count atomically
  const { error } = await supabase.rpc("increment_view_count", {
    product_id: id,
  })

  if (error) {
    // Log but don't fail - view tracking is non-critical
    console.error("[view-count] Failed to increment:", error)
  }

  // Set cookie to prevent duplicate counts (expires in 1 hour)
  const response = noStoreJson({ success: true })
  response.cookies.set(viewedKey, "1", {
    maxAge: 3600, // 1 hour
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return response
}
