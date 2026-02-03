import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"

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
  const { id } = await params

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
  }

  // Check if user already viewed this product in this session
  const viewedKey = `viewed_${id}`
  const viewedCookie = request.cookies.get(viewedKey)

  if (viewedCookie) {
    // Already counted this view in current session
    return NextResponse.json({ success: true, already_counted: true })
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
  const response = NextResponse.json({ success: true })
  response.cookies.set(viewedKey, "1", {
    maxAge: 3600, // 1 hour
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return response
}
