import { NextRequest, NextResponse } from 'next/server'
import { errorEnvelope, successEnvelope } from '@/lib/api/envelope'
import { stripe } from '@/lib/stripe'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { ID_AND_STRIPE_CUSTOMER_ID_SELECT } from '@/lib/supabase/selects/billing'
import { buildLocaleUrl, inferLocaleFromRequest } from '@/lib/stripe-locale'
import type Stripe from 'stripe'

const SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT =
  'id,tier,name,price_monthly,price_yearly,stripe_price_monthly_id,stripe_price_yearly_id,commission_rate,final_value_fee'

type CheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams
type CheckoutLineItem = Stripe.Checkout.SessionCreateParams.LineItem

export async function POST(req: NextRequest) {
  // Parse body early to get locale for error URLs
  let body: { planId?: string; billingPeriod?: 'monthly' | 'yearly'; locale?: 'en' | 'bg' } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(errorEnvelope({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const { planId, billingPeriod, locale } = body
  const resolvedLocale = inferLocaleFromRequest(req, locale)
  const accountPlansUrl = buildLocaleUrl('account/plans', resolvedLocale)

  // Validate required fields (4xx for bad input)
  if (!planId || typeof planId !== 'string') {
    return NextResponse.json(errorEnvelope({ error: 'Missing or invalid planId' }), { status: 400 })
  }
  if (!billingPeriod || (billingPeriod !== 'monthly' && billingPeriod !== 'yearly')) {
    return NextResponse.json(
      errorEnvelope({ error: 'Missing or invalid billingPeriod (expected "monthly" or "yearly")' }),
      { status: 400 }
    )
  }

  const { supabase, applyCookies } = createRouteHandlerClient(req)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json(errorEnvelope({ error: 'Unauthorized' }), { status: 401 })
    }

    // Get profile info
    const { data: profile } = await supabase
      .from('private_profiles')
      .select(ID_AND_STRIPE_CUSTOMER_ID_SELECT)
      .eq('id', user.id)
      .single()

    if (!profile) {
      return json(errorEnvelope({ error: 'Profile not found' }), { status: 404 })
    }

    // Get the subscription plan by ID
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select(SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT)
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (!plan) {
      return json(errorEnvelope({ error: 'Plan not found' }), { status: 404 })
    }

    // Can't subscribe to free tier via Stripe
    if (plan.price_monthly === 0) {
      return json(errorEnvelope({ error: 'Cannot subscribe to free tier' }), { status: 400 })
    }

    const price = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly
    const stripePriceId = billingPeriod === 'yearly' ? plan.stripe_price_yearly_id : plan.stripe_price_monthly_id

    // Use Stripe Price IDs when available (preferred), fallback to inline EUR pricing
    const useStripePriceId = !!(stripePriceId && stripePriceId.startsWith('price_'))

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

      await supabase
        .from('private_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.id)
    }

    const lineItems: CheckoutLineItem[] = useStripePriceId
      ? [{ price: stripePriceId, quantity: 1 }]
      : [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.name} seller subscription - ${billingPeriod}`,
            },
            unit_amount: Math.round(price * 100),
            recurring: {
              interval: billingPeriod === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        }]

    const checkoutParams: Omit<CheckoutSessionCreateParams, 'line_items'> = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      metadata: {
        profile_id: profile.id,
        plan_id: planId,
        plan_tier: plan.tier,
        billing_period: billingPeriod,
        commission_rate: (plan.final_value_fee ?? plan.commission_rate ?? 12).toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      success_url: `${accountPlansUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${accountPlansUrl}?canceled=true`,
    }

    let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>
    session = await stripe.checkout.sessions.create({
      ...checkoutParams,
      line_items: lineItems,
    })

    return json(successEnvelope({ sessionId: session.id, url: session.url }))
  } catch (error) {
    // Log error details server-side (no secrets - Stripe SDK doesn't expose keys in errors)
    // Sanitize: only log error type + message, not full stack with potential request data
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    console.error(`[checkout] ${errorType}: ${errorMessage}`)

    // Determine if this is a Stripe error vs other failure
    const isStripeError = error instanceof Error &&
      (error.message.includes('Stripe') || 'type' in error || 'statusCode' in error)

    return json(
      errorEnvelope({
        error: isStripeError ? 'Payment service error. Please try again.' : 'Internal server error'
      }),
      { status: 500 }
    )
  }
}
