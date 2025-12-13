import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { getTranslations } from "next-intl/server"
import { BillingContent } from "./billing-content"

interface BillingPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function BillingPage({ params }: BillingPageProps) {
  await connection()
  const { locale } = await params
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: 'Account' })

  if (!supabase) {
    redirect("/auth/login")
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Parallel fetch for better performance
  const [
    { data: seller },
    { data: subscription },
    { data: boosts },
    { data: profile },
  ] = await Promise.all([
    // Fetch seller info (if exists)
    supabase
      .from('sellers')
      .select('*, subscription_plans(*)')
      .eq('id', user.id)
      .single(),
    
    // Fetch active subscription
    supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('seller_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    
    // Fetch recent listing boosts
    supabase
      .from('listing_boosts')
      .select('*, products(id, title, images)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),

    // Fetch profile for stripe customer id
    supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single(),
  ])

  const hasStripeCustomer = !!(seller?.stripe_customer_id || profile?.stripe_customer_id)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{locale === 'bg' ? 'Фактуриране' : 'Billing'}</h1>
      <BillingContent 
        locale={locale}
        seller={seller}
        subscription={subscription}
        boosts={boosts || []}
        hasStripeCustomer={hasStripeCustomer}
        userEmail={user.email || ''}
      />
    </div>
  )
}
