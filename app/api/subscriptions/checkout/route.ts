import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { buildLocaleUrl, inferLocaleFromRequest } from '@/lib/stripe-locale'

const PROFILE_SELECT_FOR_STRIPE = 'id,stripe_customer_id'
const SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT =
  'id,tier,name,price_monthly,price_yearly,stripe_price_monthly_id,stripe_price_yearly_id,commission_rate,final_value_fee'

/**
 * Validate that a stripe_price_*_id is properly configured.
 * Returns true if valid (starts with 'price_'), false if null/undefined/empty (fallback allowed),
 * throws if malformed (non-empty but not a valid Stripe Price ID format).
 */
function validateStripePriceId(priceId: string | null | undefined, fieldName: string): boolean {
  if (!priceId || priceId.trim() === '') {
    // Empty/null = fallback to inline price_data is allowed
    return false
  }
  if (!priceId.startsWith('price_')) {
    // Non-empty but malformed = explicit config error
    throw new Error(`Invalid ${fieldName}: expected 'price_...' format, got '${priceId.slice(0, 20)}...'`)
  }
  return true
}

export async function POST(req: Request) {
  // Parse body early to get locale for error URLs
  let body: { planId?: string; billingPeriod?: 'monthly' | 'yearly'; locale?: 'en' | 'bg' } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { planId, billingPeriod, locale } = body
  const resolvedLocale = inferLocaleFromRequest(req, locale)
  const accountPlansUrl = buildLocaleUrl('account/plans', resolvedLocale)

  // Validate required fields (4xx for bad input)
  if (!planId || typeof planId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid planId' }, { status: 400 })
  }
  if (!billingPeriod || (billingPeriod !== 'monthly' && billingPeriod !== 'yearly')) {
    return NextResponse.json({ error: 'Missing or invalid billingPeriod (expected "monthly" or "yearly")' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Validate stripe_price_*_id configuration (guardrail: explicit config error if malformed)
    const priceField = billingPeriod === 'yearly' ? 'stripe_price_yearly_id' : 'stripe_price_monthly_id'
    const rawPriceId = billingPeriod === 'yearly' ? plan.stripe_price_yearly_id : plan.stripe_price_monthly_id

    let useStripePriceId = false
    try {
      useStripePriceId = validateStripePriceId(rawPriceId, priceField)
    } catch (configError) {
      // Config error: price ID is set but malformed - this is a server-side config issue
      console.error('[checkout] Config error:', configError instanceof Error ? configError.message : configError)
      return NextResponse.json(
        { error: 'Subscription plan configuration error. Please contact support.' },
        { status: 500 }
      )
    }

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

    // Build line_items - use Price ID if available and valid, otherwise create inline price
    // Note: Bulgaria joins Eurozone Jan 2026, all prices in EUR
    const lineItems = useStripePriceId
      ? [{ price: rawPriceId!, quantity: 1 }]
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
    // Log error details server-side (no secrets - Stripe SDK doesn't expose keys in errors)
    // Sanitize: only log error type + message, not full stack with potential request data
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    console.error(`[checkout] ${errorType}: ${errorMessage}`)

    // Determine if this is a Stripe error vs other failure
    const isStripeError = error instanceof Error &&
      (error.message.includes('Stripe') || 'type' in error || 'statusCode' in error)

    return NextResponse.json(
      { error: isStripeError ? 'Payment service error. Please try again.' : 'Internal server error' },
      { status: 500 }
    )
  }
}
