import { getTranslations } from "next-intl/server"
import { PlansContent } from "./plans-content"
import {
  PLANS_SELECT_FOR_PLANS_PAGE,
  PRIVATE_PROFILE_SELECT_FOR_UPGRADE,
  PROFILE_SELECT_FOR_PLANS,
} from "@/lib/data/plans"
import { cancelSubscription, reactivateSubscription } from "../../../../actions/subscriptions-mutations"
import { createBillingPortalSession, createSubscriptionCheckoutSession } from "../../../../actions/subscriptions-reads"
import { withAccountPageShell } from "../_lib/account-page-shell"

interface PlansPageProps {
  params: Promise<{
    locale: string
  }>
}

export const metadata = {
  title: "Plans | Treido",
  description: "Manage your subscription and plan.",
}

export default async function PlansPage({ params }: PlansPageProps) {
  return withAccountPageShell(params, async ({ locale, supabase, user }) => {
    const t = await getTranslations({ locale, namespace: "Account" })

    const [{ data: profile }, { data: privateProfile }] = await Promise.all([
      supabase
        .from("profiles")
        .select(PROFILE_SELECT_FOR_PLANS)
        .eq("id", user.id)
        .single(),
      supabase
        .from("private_profiles")
        .select(PRIVATE_PROFILE_SELECT_FOR_UPGRADE)
        .eq("id", user.id)
        .maybeSingle(),
    ])

    const { data: plans } = await supabase
      .from("subscription_plans")
      .select(PLANS_SELECT_FOR_PLANS_PAGE)
      .eq("is_active", true)
      .order("price_monthly", { ascending: true })

    const { data: currentSubscription } = await supabase
      .from("subscriptions")
      .select(
        "id, seller_id, plan_type, status, billing_period, expires_at, auto_renew, stripe_subscription_id"
      )
      .eq("seller_id", user.id)
      .in("status", ["active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const currentTier = profile?.tier || "free"
    const accountType = profile?.account_type || "personal"

    const filteredPlans = (plans ?? []).filter(
      (plan) => plan.account_type === accountType || plan.account_type === null
    )

    const commissionRate =
      privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
    const seller = profile
      ? {
          id: profile.id,
          tier: profile.tier || "free",
          account_type: (accountType === "business" ? "business" : "personal") as
            | "personal"
            | "business",
          commission_rate: commissionRate,
          stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
        }
      : null

    return {
      title: t("header.plans"),
      content: (
        <PlansContent
          locale={locale}
          plans={filteredPlans as Parameters<typeof PlansContent>[0]["plans"]}
          currentTier={currentTier}
          seller={seller}
          currentSubscription={
            currentSubscription as Parameters<
              typeof PlansContent
            >[0]["currentSubscription"]
          }
          actions={{
            cancelSubscription,
            reactivateSubscription,
            createBillingPortalSession,
            createSubscriptionCheckoutSession,
          }}
        />
      ),
    }
  })
}
