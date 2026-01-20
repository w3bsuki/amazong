import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { PlansContent } from "./plans-content"
import {
  cancelSubscription,
  createBillingPortalSession,
  createSubscriptionCheckoutSession,
  reactivateSubscription,
} from "@/app/actions/subscriptions"

const PROFILE_SELECT_FOR_PLANS = 'id,tier,account_type,commission_rate,stripe_customer_id'

interface PlansPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function PlansPage({ params }: PlansPageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const _t = await getTranslations({ locale, namespace: 'Account' })

  if (!supabase) {
    redirect("/auth/login")
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile info (seller fields are now on profiles)
  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT_FOR_PLANS)
    .eq('id', user.id)
    .single()

  // Fetch subscription plans (only valid fields)
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('id, name, tier, price_monthly, price_yearly, description, features, is_active, stripe_price_monthly_id, stripe_price_yearly_id, max_listings, commission_rate, account_type, final_value_fee, insertion_fee, per_order_fee, boosts_included, priority_support, analytics_access')
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
  const seller = profile ? {
    id: profile.id,
    tier: profile.tier || 'free',
    commission_rate: Number(profile.commission_rate) || 12,
    stripe_customer_id: profile.stripe_customer_id,
  } : null

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{locale === 'bg' ? 'Планове' : 'Plans'}</h1>
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
