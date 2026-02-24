import { createStaticClient } from "@/lib/supabase/server"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import { PLANS_SELECT_FULL } from "@/lib/data/plans"

export async function GET() {
  try {
    const supabase = createStaticClient()
    
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select(PLANS_SELECT_FULL)
      .eq("is_active", true)
      .order("account_type", { ascending: true })
      .order("price_monthly", { ascending: true })

    if (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: unknown }).message)
          : ""

      if (message.includes("During prerendering, fetch() rejects when the prerender is complete")) {
        return cachedJsonResponse([], "catalog")
      }

      console.error("Error fetching plans:", error)
      return noStoreJson({ error: "Failed to fetch plans" }, { status: 500 })
    }

    return cachedJsonResponse(plans, "catalog")
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes("During prerendering, fetch() rejects when the prerender is complete")) {
      return cachedJsonResponse([], "catalog")
    }

    console.error("Plans API error:", error)
    return noStoreJson({ error: "Internal server error" }, { status: 500 })
  }
}
