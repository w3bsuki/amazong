import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ badgeId: string }>
}

/**
 * PATCH /api/badges/feature/[badgeId]
 * Toggle a badge's featured status (show on profile)
 * Max 5 featured badges allowed
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
      .select("id, user_id, is_featured")
      .eq("id", badgeId)
      .single()
    
    if (badgeError || !badge) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 })
    }
    
    if (badge.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // If trying to feature, check limit
    if (!badge.is_featured) {
      const { count } = await supabase
        .from("user_badges")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_featured", true)
      
      if ((count ?? 0) >= 5) {
        return NextResponse.json(
          { error: "Maximum of 5 featured badges allowed" },
          { status: 400 }
        )
      }
    }
    
    // Toggle featured status
    const { error: updateError } = await supabase
      .from("user_badges")
      .update({ is_featured: !badge.is_featured })
      .eq("id", badgeId)
    
    if (updateError) {
      console.error("Failed to update badge:", updateError)
      return NextResponse.json({ error: "Failed to update badge" }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      is_featured: !badge.is_featured,
    })
    
  } catch (error) {
    console.error("Error updating badge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
