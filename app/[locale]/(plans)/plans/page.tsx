import { createClient } from "@/lib/supabase/server"
import { getActivePlans } from "@/lib/data/plans"
import { createSubscriptionCheckoutSession } from "../../../actions/subscriptions-reads"
import { downgradeToFreeTier } from "../../../actions/subscriptions-mutations"
import PlansPageClient from "../_components/plans-page-client"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"

// =============================================================================
// Types
// =============================================================================

interface PlansPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "Plans.page" })

  return {
    title: t("title"),
    description: t("subtitle"),
  }
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
