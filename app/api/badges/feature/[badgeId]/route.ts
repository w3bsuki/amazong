import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ badgeId: string }>
}

/**
 * PATCH /api/badges/feature/[badgeId]
 * Note: is_featured column doesn't exist in DB yet.
 * This endpoint currently returns badge info but toggle is disabled.
 * To enable, add is_featured column to user_badges table.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { badgeId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get the badge and verify ownership
    const { data: badge, error: badgeError } = await supabase
      .from("user_badges")
      .select("id, user_id")
      .eq("id", badgeId)
      .single()
    
    if (badgeError || !badge) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 })
    }
    
    if (badge.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // NOTE: is_featured column doesn't exist in DB schema yet.
    // For now, just return success. To enable feature toggle:
    // 1. Add is_featured boolean column to user_badges table
    // 2. Uncomment the update logic below
    
    return NextResponse.json({
      success: true,
      message: "Badge feature toggle is not yet implemented",
    })
    
  } catch (error) {
    console.error("Error updating badge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
