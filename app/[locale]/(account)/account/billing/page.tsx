import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
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

  if (!supabase) {
    redirect("/auth/login")
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Parallel fetch for better performance
  const [
    { data: profile },
    { data: subscription },
    { data: boostsRaw },
  ] = await Promise.all([
    // Fetch profile info (seller fields are now on profiles)
    supabase
      .from('profiles')
      .select('id, tier, commission_rate, stripe_customer_id')
      .eq('id', user.id)
      .single(),
    
    // Fetch active subscription
    supabase
      .from('subscriptions')
      .select('id, seller_id, plan_type, status, price_paid, billing_period, starts_at, expires_at, stripe_subscription_id')
      .eq('seller_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    
    // Fetch recent listing boosts (without join)
    supabase
      .from('listing_boosts')
      .select('id, product_id, price_paid, duration_days, starts_at, expires_at, is_active, created_at')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Fetch products for boosts separately
  const productIds = [...new Set((boostsRaw || []).map(b => b.product_id))]
  const { data: boostProducts } = productIds.length > 0
    ? await supabase.from('products').select('id, title, images').in('id', productIds)
    : { data: [] }
  
  const productsMap = new Map((boostProducts || []).map(p => [p.id, p]))
  
  // Map boosts with product data
  const boosts = (boostsRaw || []).map(boost => {
    const product = productsMap.get(boost.product_id)
    return {
      ...boost,
      products: product ? { id: product.id, title: product.title, images: product.images || [] } : undefined
    }
  })

  const hasStripeCustomer = !!profile?.stripe_customer_id

  // Map profile to seller interface expected by BillingContent
  const seller = profile ? {
    id: profile.id,
    tier: profile.tier || 'free',
    commission_rate: Number(profile.commission_rate) || 12,
    stripe_customer_id: profile.stripe_customer_id,
  } : null

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{locale === 'bg' ? 'Фактуриране' : 'Billing'}</h1>
      <BillingContent 
        locale={locale}
        seller={seller}
        subscription={subscription as Parameters<typeof BillingContent>[0]['subscription']}
        boosts={(boosts || []) as Parameters<typeof BillingContent>[0]['boosts']}
        hasStripeCustomer={hasStripeCustomer}
        userEmail={user.email || ''}
      />
    </div>
  )
}
