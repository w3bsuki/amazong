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

  // Fetch current subscription if exists
  const { data: currentSubscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('seller_id', user.id)
    .eq('status', 'active')
    .single()

  const currentTier = seller?.tier || 'basic'

  return (
    <div className="p-4 lg:p-6">
      <PlansContent 
        locale={locale}
        plans={plans || []}
        currentTier={currentTier}
        seller={seller}
        currentSubscription={currentSubscription}
      />
    </div>
  )
}
