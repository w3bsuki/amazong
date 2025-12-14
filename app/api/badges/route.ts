import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/badges
 * Returns the current user's badges with definitions
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get user's badges with definitions
    const { data: badges, error } = await supabase
      .from("user_badges")
      .select(`
        id,
        earned_at,
        is_featured,
        badge_definitions (
          id,
          code,
          name,
          description,
          icon,
          color,
          category,
          tier,
          criteria,
          sort_order
        )
      `)
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })
    
    if (error) {
      console.error("Failed to fetch badges:", error)
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
    }
    
    // Transform the data
    const transformedBadges = (badges || []).map(b => ({
      id: b.id,
      earned_at: b.earned_at,
      is_featured: b.is_featured,
      ...b.badge_definitions,
    }))
    
    return NextResponse.json({
      badges: transformedBadges,
      total: transformedBadges.length,
    })
    
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
