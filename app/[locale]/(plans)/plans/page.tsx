import { createClient } from "@/lib/supabase/server"
import { getActivePlans } from "@/lib/data/plans"
import { createSubscriptionCheckoutSession, downgradeToFreeTier } from "@/app/actions/subscriptions"
import PlansPageClient from "../_components/plans-page-client"

// =============================================================================
// Types
// =============================================================================

interface PlansPageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: "Plans | Treido",
  description: "Explore Treido plans and upgrade anytime.",
}

export default async function PlansPage({ params }: PlansPageProps) {
  const { locale } = await params

  const plans = await getActivePlans()

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
      initialPlans={plans as Parameters<typeof PlansPageClient>[0]["initialPlans"]}
      initialUserId={initialUserId}
      initialCurrentTier={initialCurrentTier}
      actions={{ createSubscriptionCheckoutSession, downgradeToFreeTier }}
    />
  )
}
