import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"

/**
 * GET /api/badges
 * Returns the current user's badges with definitions
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, applyCookies } = createRouteHandlerClient(request)
    const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) => {
      const res = NextResponse.json(body, init)
      res.headers.set('Cache-Control', 'private, no-store')
      res.headers.set('CDN-Cache-Control', 'private, no-store')
      res.headers.set('Vercel-CDN-Cache-Control', 'private, no-store')
      return applyCookies(res)
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json({ badges: [], total: 0 })
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
      return json({ error: "Failed to fetch badges" }, { status: 500 })
    }
    
    // Transform the data
    const transformedBadges = (badges || []).map(b => ({
      ...b.badge_definitions,
      user_badge_id: b.id,
      awarded_at: b.awarded_at,
    }))
    
    return json({
      badges: transformedBadges,
      total: transformedBadges.length,
    })
    
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}