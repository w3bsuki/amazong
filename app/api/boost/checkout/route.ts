import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { eurToBgnApprox } from '@/lib/currency'
import { isBoostActive } from '@/lib/boost/boost-status'
import { getTranslations } from 'next-intl/server'

const PROFILE_SELECT_FOR_STRIPE = 'id,stripe_customer_id'

const BOOST_PRICING = {
  '1': { priceEur: 0.99, durationKey: 'duration24h' },
  '7': { priceEur: 4.99, durationKey: 'duration7d' },
  '30': { priceEur: 14.99, durationKey: 'duration30d' },
} as const

type BoostDuration = keyof typeof BOOST_PRICING

type BoostLocale = 'en' | 'bg'

function toBoostLocale(locale: string | undefined): BoostLocale {
  return locale === 'bg' ? 'bg' : 'en'
}

export async function POST(req: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(req)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json({ errorKey: 'errors.unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, durationDays, locale } = body as { productId: string, durationDays: string, locale?: string }
    const resolvedLocale = toBoostLocale(locale)
    const t = await getTranslations({ locale: resolvedLocale, namespace: 'Boost' })

    if (!productId || !durationDays) {
      return json({ errorKey: 'errors.missingFields' }, { status: 400 })
    }

    // Validate duration
    if (!(durationDays in BOOST_PRICING)) {
      return json({ errorKey: 'errors.invalidDuration' }, { status: 400 })
    }

    const duration = durationDays as BoostDuration
    const pricing = BOOST_PRICING[duration]

    // Get profile info (seller fields are now on profiles)
    const { data: profile } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT_FOR_STRIPE)
      .eq('id', user.id)
      .single()

    if (!profile) {
      return json({ errorKey: 'errors.profileNotFound' }, { status: 404 })
    }

    // Verify product belongs to seller
    const { data: product } = await supabase
      .from('products')
      .select('id, title, seller_id, is_boosted, boost_expires_at')
      .eq('id', productId)
      .eq('seller_id', user.id)
      .single()

    if (!product) {
      return json({ errorKey: 'errors.productNotFound' }, { status: 404 })      
    }

    // Check if already boosted
    if (isBoostActive({ is_boosted: product.is_boosted, boost_expires_at: product.boost_expires_at })) {
      return json({ errorKey: 'errors.alreadyBoosted' }, { status: 400 })       
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

    // Create Stripe Checkout Session for one-time boost payment (EUR per DEC-003)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment', // One-time payment, not subscription
      payment_method_types: ['card'],
      locale: resolvedLocale,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: t('checkoutItemName', { duration: t(pricing.durationKey) }),
              description: t('checkoutItemDescription', {
                productTitle: product.title,
                duration: t(pricing.durationKey),
              }),
              images: [], // Could add product image here
            },
            unit_amount: Math.round(pricing.priceEur * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        profile_id: profile.id,
        product_id: productId,
        duration_days: durationDays,
        type: 'listing_boost',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${resolvedLocale}/account/selling?boost_success=true&product_id=${productId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${resolvedLocale}/sell?boost_canceled=true&product_id=${productId}`,
    })

    return json({ 
      sessionId: session.id, 
      url: session.url,
      priceEur: pricing.priceEur,
      priceBgn: eurToBgnApprox(pricing.priceEur),
      durationKey: pricing.durationKey,
      locale: resolvedLocale,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    console.error(`[boost-checkout] ${errorType}: ${errorMessage}`)
    return json(
      { errorKey: 'errors.internal' },
      { status: 500 }
    )
  }
}

// Get available boost pricing
export async function GET() {
  return NextResponse.json({
    options: Object.entries(BOOST_PRICING).map(([days, { priceEur, durationKey }]) => ({
      days: Number.parseInt(days),
      priceEur,
      priceBgn: eurToBgnApprox(priceEur),
      durationKey,
      currency: 'EUR'
    }))
  })
}
