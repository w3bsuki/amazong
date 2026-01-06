import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

const PROFILE_SELECT_FOR_STRIPE = 'id,stripe_customer_id'
const SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT =
  'id,tier,name,price_monthly,price_yearly,stripe_price_monthly_id,stripe_price_yearly_id,commission_rate,final_value_fee'

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function normalizeLocale(locale: unknown): 'en' | 'bg' {
  return locale === 'bg' ? 'bg' : 'en'
}

function inferLocaleFromRequest(req: Request, bodyLocale?: unknown): 'en' | 'bg' {
  if (bodyLocale) return normalizeLocale(bodyLocale)

  const headerLocale = req.headers.get('x-next-intl-locale')
  if (headerLocale) return normalizeLocale(headerLocale)

  const referer = req.headers.get('referer')
  if (referer) {
    try {
      const url = new URL(referer)
      const firstSegment = url.pathname.split('/').filter(Boolean)[0]
      if (firstSegment) return normalizeLocale(firstSegment)
    } catch {
      // ignore invalid referer
    }
  }

  return 'en'
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { planId, billingPeriod, locale } = body as { planId: string; billingPeriod: 'monthly' | 'yearly'; locale?: 'en' | 'bg' }

    if (!planId || !billingPeriod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resolvedLocale = inferLocaleFromRequest(req, locale)
    const accountPlansUrl = `${getAppUrl()}/${resolvedLocale}/account/plans`

    // Get profile info
    const { data: profile } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT_FOR_STRIPE)
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get the subscription plan by ID
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select(SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT)
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Can't subscribe to free tier via Stripe
    if (plan.price_monthly === 0) {
      return NextResponse.json({ error: 'Cannot subscribe to free tier' }, { status: 400 })
    }

    const price = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly

    // Create or get Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        ...(user.email ? { email: user.email } : {}),
        metadata: {
          profile_id: profile.id,
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.id)
    }

    // Check if we have a pre-configured Stripe Price ID (recommended for production)
    const stripePriceId = billingPeriod === 'yearly' 
      ? plan.stripe_price_yearly_id 
      : plan.stripe_price_monthly_id

    // Build line_items - use Price ID if available, otherwise create inline price
    // Note: Bulgaria joins Eurozone Jan 2026, all prices in EUR
    const lineItems = stripePriceId
      ? [{ price: stripePriceId, quantity: 1 }]
      : [{
          price_data: {
            currency: 'eur' as const,
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.name} seller subscription - ${billingPeriod}`,
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents
            recurring: {
              interval: (billingPeriod === 'yearly' ? 'year' : 'month') as 'year' | 'month',
            },
          },
          quantity: 1,
        }]

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      metadata: {
        profile_id: profile.id,
        plan_id: planId,
        plan_tier: plan.tier,
        billing_period: billingPeriod,
        commission_rate: (plan.final_value_fee ?? plan.commission_rate ?? 12).toString(),
      },
      // Allow promotion codes for discounts
      allow_promotion_codes: true,
      // Collect billing address for invoicing
      billing_address_collection: 'required',
      success_url: `${accountPlansUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${accountPlansUrl}?canceled=true`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Subscription checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}