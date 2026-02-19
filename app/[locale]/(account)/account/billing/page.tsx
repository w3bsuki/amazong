import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { BillingContent } from "./billing-content"
import { createBillingPortalSession } from "@/app/actions/subscriptions"

interface BillingPageProps {
  params: Promise<{
    locale: string
  }>
}

export const metadata = {
  title: "Billing | Treido",
  description: "View your billing details and history.",
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "Account" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Parallel fetch for better performance
  const [
    { data: profile },
    { data: privateProfile },
    { data: subscription },
    { data: boostsRaw },
  ] = await Promise.all([
    // Public profile surface
    supabase
      .from('profiles')
      .select('id, tier')
      .eq('id', user.id)
      .single(),

    // Private billing fields
    supabase
      .from('private_profiles')
      .select('id, commission_rate, stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle(),
    
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

  const hasStripeCustomer = !!privateProfile?.stripe_customer_id

  // Map profile to seller interface expected by BillingContent
  const commissionRate = privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
  const seller = profile ? {
    id: profile.id,
    tier: profile.tier || 'free',
    commission_rate: commissionRate,
    stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
  } : null

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{t("header.billing")}</h1>
      <BillingContent
        locale={locale}
        seller={seller}
        subscription={subscription as Parameters<typeof BillingContent>[0]['subscription']}
        boosts={(boosts || []) as Parameters<typeof BillingContent>[0]['boosts']}
        hasStripeCustomer={hasStripeCustomer}
        userEmail={user.email || ''}
        actions={{ createBillingPortalSession }}
      />
    </div>
  )
}
