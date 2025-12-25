import { createClient, createStaticClient } from "@/lib/supabase/server"
import { connection } from "next/server"
import PlansPageClient from "../_components/plans-page-client"

// =============================================================================
// Types
// =============================================================================

interface PlansPageProps {
  params: Promise<{ locale: string }>
}

export default async function PlansPage({ params }: PlansPageProps) {
  await connection()
  const { locale } = await params

  const staticClient = createStaticClient()
  const { data: plans } = await staticClient
    .from("subscription_plans")
    .select("*")
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
