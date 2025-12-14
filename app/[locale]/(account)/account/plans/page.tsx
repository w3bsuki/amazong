import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { getTranslations } from "next-intl/server"
import { PlansContent } from "./plans-content"

interface PlansPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function PlansPage({ params }: PlansPageProps) {
  await connection()
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

  // Fetch seller info
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch subscription plans
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
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

  const currentTier = seller?.tier || 'basic'
  const accountType = seller?.account_type || 'personal'

  // Filter plans by seller's account type
  const filteredPlans = (plans || []).filter(
    (plan: { account_type?: string }) => plan.account_type === accountType
  )

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{locale === 'bg' ? 'Планове' : 'Plans'}</h1>
      <PlansContent 
        locale={locale}
        plans={filteredPlans}
        currentTier={currentTier}
        seller={seller}
        currentSubscription={currentSubscription}
      />
    </div>
  )
}
