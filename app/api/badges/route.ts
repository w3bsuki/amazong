import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { noStoreJson } from "@/lib/api/response-helpers"

/**
 * GET /api/badges
 * Returns the current user's badges with definitions
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return noStoreJson({ skipped: true }, { status: 200 })
  }
  try {
    const { supabase, applyCookies } = createRouteHandlerClient(request)
    const json = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
      applyCookies(noStoreJson(body, init))

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
    if (isNextPrerenderInterrupted(error)) {
      return noStoreJson({ skipped: true }, { status: 200 })
    }
    console.error("Error fetching badges:", error)
    return noStoreJson({ error: "Internal server error" }, { status: 500 })
  }
}
