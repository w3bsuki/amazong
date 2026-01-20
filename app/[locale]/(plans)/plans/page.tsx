import { createClient, createStaticClient } from "@/lib/supabase/server"
import PlansPageClient from "../_components/plans-page-client"

// =============================================================================
// Types
// =============================================================================

interface PlansPageProps {
  params: Promise<{ locale: string }>
}

export default async function PlansPage({ params }: PlansPageProps) {
  const { locale } = await params

  const staticClient = createStaticClient()
  const SUBSCRIPTION_PLANS_SELECT =
    "id,name,tier,account_type,description,description_bg,features,price_monthly,price_yearly,currency,commission_rate,final_value_fee,seller_fee_percent,buyer_protection_percent,buyer_protection_fixed,buyer_protection_cap,insertion_fee,per_order_fee,max_listings,boosts_included,analytics_access,badge_type,priority_support,stripe_price_monthly_id,stripe_price_yearly_id,is_active,created_at" as const
  const { data: plans } = await staticClient
    .from("subscription_plans")
    .select(SUBSCRIPTION_PLANS_SELECT)
    .eq("is_active", true)
    .order("account_type", { ascending: true })
    .order("price_monthly", { ascending: true })

  let initialUserId: string | null = null
  let initialCurrentTier = "free"

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      initialUserId = user.id
      const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single()
      if (profile?.tier) initialCurrentTier = profile.tier
    }
  } catch {
    // Anonymous users are allowed on this page
  }

  return (
    <PlansPageClient
      locale={locale || "en"}
      initialPlans={(plans ?? []) as Parameters<typeof PlansPageClient>[0]["initialPlans"]}
      initialUserId={initialUserId}
      initialCurrentTier={initialCurrentTier}
    />
  )
}
