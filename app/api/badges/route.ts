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
        awarded_at,
        badge_definitions (
          id,
          code,
          name,
          description,
          icon,
          color,
          category,
          tier,
          criteria
        )
      `)
      .eq("user_id", user.id)
      .is("revoked_at", null)
      .order("awarded_at", { ascending: false })
    
    if (error) {
      console.error("Failed to fetch badges:", error)
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
    }
    
    // Transform the data
    const transformedBadges = (badges || []).map(b => ({
      ...b.badge_definitions,
      user_badge_id: b.id,
      awarded_at: b.awarded_at,
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
