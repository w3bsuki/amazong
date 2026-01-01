import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"

// Public endpoint. Plans change rarely; align with next.config.ts cacheLife.categories.
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

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

export async function GET() {
  try {
    const supabase = createStaticClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }
    
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("account_type", { ascending: true })
      .order("price_monthly", { ascending: true })

    if (error) {
      console.error("Error fetching plans:", error)
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
    }

    return cachedJsonResponse(plans)
  } catch (error) {
    console.error("Plans API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}