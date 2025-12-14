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
          sort_order
        )
      `)
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
    
    if (error) {
      console.error("Failed to fetch badges:", error)
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
    }
    
    // Transform the data - only return featured badges and verification
    const transformedBadges = (badges || [])
      .filter(b => b.is_featured || (b.badge_definitions as any)?.category === 'verification')
      .map(b => ({
        id: b.id,
        earned_at: b.earned_at,
        is_featured: b.is_featured,
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
