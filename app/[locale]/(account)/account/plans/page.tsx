import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PlansContent } from "./plans-content"
import {
  PLANS_SELECT_FOR_PLANS_PAGE,
  PRIVATE_PROFILE_SELECT_FOR_UPGRADE,
  PROFILE_SELECT_FOR_PLANS,
} from "@/lib/data/plans"
import { cancelSubscription, reactivateSubscription } from "../../../../actions/subscriptions-mutations"
import { createBillingPortalSession, createSubscriptionCheckoutSession } from "../../../../actions/subscriptions-reads"

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
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  setRequestLocale(locale)
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: "Account" })

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Fetch profile info (public surface) + private billing fields
  const [
    { data: profile },
    { data: privateProfile },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select(PROFILE_SELECT_FOR_PLANS)
      .eq('id', user.id)
      .single(),
    supabase
      .from('private_profiles')
      .select(PRIVATE_PROFILE_SELECT_FOR_UPGRADE)
      .eq('id', user.id)
      .maybeSingle(),
  ])

  // Fetch subscription plans (only valid fields)
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select(PLANS_SELECT_FOR_PLANS_PAGE)
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  // Fetch current subscription if exists (include cancelled-but-not-expired)
  const { data: currentSubscription } = await supabase
    .from('subscriptions')
    .select('id, seller_id, plan_type, status, billing_period, expires_at, auto_renew, stripe_subscription_id')
    .eq('seller_id', user.id)
    .in('status', ['active']) // Active subscriptions only
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const currentTier = profile?.tier || 'free'
  const accountType = profile?.account_type || 'personal'

  // Filter plans by seller's account type (null handled as string comparison)
  const filteredPlans = (plans || []).filter(
    (plan) => plan.account_type === accountType || plan.account_type === null
  )

  // Map profile to seller interface expected by PlansContent
  const commissionRate = privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
  const seller = profile ? {
    id: profile.id,
    tier: profile.tier || 'free',
    account_type: (accountType === 'business' ? 'business' : 'personal') as 'personal' | 'business',
    commission_rate: commissionRate,
    stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
  } : null

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{t("header.plans")}</h1>
      <PlansContent
        locale={locale}
        plans={filteredPlans as Parameters<typeof PlansContent>[0]['plans']}    
        currentTier={currentTier}
        seller={seller}
        currentSubscription={currentSubscription as Parameters<typeof PlansContent>[0]['currentSubscription']}
        actions={{
          cancelSubscription,
          reactivateSubscription,
          createBillingPortalSession,
          createSubscriptionCheckoutSession,
        }}
      />
    </div>
  )
}
