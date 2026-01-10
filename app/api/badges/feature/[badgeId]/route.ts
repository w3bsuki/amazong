import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ badgeId: string }>
}

/**
 * PATCH /api/badges/feature/[badgeId]
 * Note: is_featured column doesn't exist in DB yet.
 * This endpoint currently returns badge info but toggle is disabled.
 * To enable, add is_featured column to user_badges table.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))

  try {
    const { badgeId } = await params
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get the badge and verify ownership
    const { data: badge, error: badgeError } = await supabase
      .from("user_badges")
      .select("id, user_id")
      .eq("id", badgeId)
      .single()
    
    if (badgeError || !badge) {
      return json({ error: "Badge not found" }, { status: 404 })
    }
    
    if (badge.user_id !== user.id) {
      return json({ error: "Forbidden" }, { status: 403 })
    }
    
    // NOTE: is_featured column doesn't exist in DB schema yet.
    // For now, just return success. To enable feature toggle:
    // 1. Add is_featured boolean column to user_badges table
    // 2. Uncomment the update logic below
    
    return json({
      success: true,
      message: "Badge feature toggle is not yet implemented",
    })
    
  } catch (error) {
    console.error("Error updating badge:", error)
    return json({ error: "Internal server error" }, { status: 500 })
  }
}
