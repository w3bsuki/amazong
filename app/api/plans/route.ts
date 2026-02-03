import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { cachedJsonResponse } from "@/lib/api/response-helpers"

export async function GET() {
  try {
    const supabase = createStaticClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }
    
    const SUBSCRIPTION_PLANS_SELECT =
      "id,name,tier,account_type,description,description_bg,features,price_monthly,price_yearly,currency,commission_rate,final_value_fee,insertion_fee,per_order_fee,max_listings,boosts_included,analytics_access,badge_type,priority_support,stripe_price_monthly_id,stripe_price_yearly_id,is_active,created_at" as const

    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select(SUBSCRIPTION_PLANS_SELECT)
      .eq("is_active", true)
      .order("account_type", { ascending: true })
      .order("price_monthly", { ascending: true })

    if (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : ""

      if (message.includes("During prerendering, fetch() rejects when the prerender is complete")) {
        return cachedJsonResponse([], "catalog")
      }

      console.error("Error fetching plans:", error)
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
    }

    return cachedJsonResponse(plans, "catalog")
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes("During prerendering, fetch() rejects when the prerender is complete")) {
      return cachedJsonResponse([], "catalog")
    }

    console.error("Plans API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
