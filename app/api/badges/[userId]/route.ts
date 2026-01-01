import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ userId: string }>
}

interface BadgeDefinition {
  id: string
  code: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  category: string
  tier: number
}

interface UserBadge {
  id: string
  awarded_at: string
  badge_definitions: BadgeDefinition | null
}

// Public, userId-keyed endpoint. Align caching with next.config.ts cacheLife.user.
const CACHE_TTL_SECONDS = 60
const CACHE_STALE_WHILE_REVALIDATE = 30

function cachedJsonResponse(data: unknown, init?: ResponseInit) {
  const res = NextResponse.json(data, init)
  res.headers.set(
    "Cache-Control",
    `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`
  )
  res.headers.set("CDN-Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}`)
  res.headers.set("Vercel-CDN-Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}`)
  return res
}

/**
 * GET /api/badges/[userId]
 * Returns a specific user's public badges
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await params
    const supabase = createStaticClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
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
    const typedBadges = (badges || []) as UserBadge[]
    const transformedBadges = typedBadges
      .filter(b => b.badge_definitions?.category === 'verification' || (b.badge_definitions?.tier ?? 0) >= 2)
      .slice(0, 5) // Limit to 5 featured badges
      .map(b => ({
        id: b.id,
        awarded_at: b.awarded_at,
        ...b.badge_definitions,
      }))
    
    return cachedJsonResponse({
      badges: transformedBadges,
      total: transformedBadges.length,
    })
    
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
