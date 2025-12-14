import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ userId: string }>
}

/**
 * GET /api/badges/[userId]
 * Returns a specific user's public badges
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await params
    const supabase = await createClient()
    
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
          tier
        )
      `)
      .eq("user_id", userId)
      .is("revoked_at", null)
      .order("awarded_at", { ascending: false })
    
    if (error) {
      console.error("Failed to fetch badges:", error)
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
    }
    
    // Transform the data - return verification badges and top-tier ones
    const transformedBadges = (badges || [])
      .filter(b => (b.badge_definitions as any)?.category === 'verification' || (b.badge_definitions as any)?.tier >= 2)
      .slice(0, 5) // Limit to 5 featured badges
      .map(b => ({
        id: b.id,
        awarded_at: b.awarded_at,
        ...(b.badge_definitions as any),
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
