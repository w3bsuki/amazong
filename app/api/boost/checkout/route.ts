import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createRouteHandlerClient, createStaticClient } from '@/lib/supabase/server'
import { eurToBgnApprox } from '@/lib/currency'
import { isBoostActive } from '@/lib/boost/boost-status'
import { getTranslations } from 'next-intl/server'

const PROFILE_SELECT_FOR_STRIPE = 'id,stripe_customer_id'

const DEFAULT_BOOST_PRICING = {
  1: { priceEur: 0.99, durationKey: 'duration24h', sku: 'boost_24h' },
  7: { priceEur: 4.99, durationKey: 'duration7d', sku: 'boost_7d' },
  30: { priceEur: 14.99, durationKey: 'duration30d', sku: 'boost_30d' },
} as const

type BoostDurationDays = keyof typeof DEFAULT_BOOST_PRICING

type BoostLocale = 'en' | 'bg'

function toBoostLocale(locale: string | undefined): BoostLocale {
  return locale === 'bg' ? 'bg' : 'en'
}

function parseDurationDays(input: string): BoostDurationDays | null {
  const parsed = Number.parseInt(input, 10)
  if (Number.isNaN(parsed)) return null
  if (parsed === 1 || parsed === 7 || parsed === 30) return parsed
  return null
}

async function getBoostPriceEur(
  supabase: ReturnType<typeof createRouteHandlerClient>["supabase"],
  durationDays: BoostDurationDays
): Promise<number | null> {
  const { data, error } = await supabase
    .from("boost_prices")
    .select("price,currency,is_active")
    .eq("duration_days", durationDays)
    .eq("is_active", true)
    .eq("currency", "EUR")
    .maybeSingle()

  if (error || !data) return null

  const priceEur = Number(data.price)
  if (!Number.isFinite(priceEur) || priceEur <= 0) return null
  return priceEur
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

    const parsedDuration = parseDurationDays(durationDays)
    if (!parsedDuration) {
      return json({ errorKey: 'errors.invalidDuration' }, { status: 400 })
    }

    const pricingMeta = DEFAULT_BOOST_PRICING[parsedDuration]
    const priceFromDb = await getBoostPriceEur(supabase, parsedDuration)
    const priceEur = priceFromDb ?? pricingMeta.priceEur

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
              name: t('checkoutItemName', { duration: t(pricingMeta.durationKey) }),
              description: t('checkoutItemDescription', {
                productTitle: product.title,
                duration: t(pricingMeta.durationKey),
              }),
              images: [], // Could add product image here
            },
            unit_amount: Math.round(priceEur * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        profile_id: profile.id,
        product_id: productId,
        duration_days: String(parsedDuration),
        sku: pricingMeta.sku,
        type: 'listing_boost',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${resolvedLocale}/account/selling?boost_success=true&product_id=${productId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${resolvedLocale}/account/selling?boost_canceled=true&product_id=${productId}`,
    })

    return json({ 
      sessionId: session.id, 
      url: session.url,
      sku: pricingMeta.sku,
      priceEur,
      priceBgn: eurToBgnApprox(priceEur),
      durationKey: pricingMeta.durationKey,
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
  const supabase = createStaticClient()

  let source = {} as Partial<Record<BoostDurationDays, number>>

  try {
    const { data } = await supabase
      .from("boost_prices")
      .select("duration_days,price,currency,is_active")
      .eq("is_active", true)
      .eq("currency", "EUR")
      .order("duration_days", { ascending: true })

    const rows = (data ?? [])
      .map((row) => ({
        days: row.duration_days as BoostDurationDays,
        priceEur: Number(row.price),
      }))
      .filter((row) =>
        (row.days === 1 || row.days === 7 || row.days === 30) &&
        Number.isFinite(row.priceEur) &&
        row.priceEur > 0
      )

    if (rows.length > 0) {
      source = Object.fromEntries(rows.map(({ days, priceEur }) => [days, priceEur])) as Partial<
        Record<BoostDurationDays, number>
      >
    }
  } catch {
    source = {}
  }

  return NextResponse.json({
    options: (Object.entries(DEFAULT_BOOST_PRICING) as Array<
      [unknown, { priceEur: number; durationKey: string; sku: string }]
    >).map(([daysRaw, { priceEur: fallbackPriceEur, durationKey, sku }]) => {
      const days = Number(daysRaw) as BoostDurationDays
      const priceEur = source[days] ?? fallbackPriceEur
      return {
        days,
        sku,
        priceEur,
        priceBgn: eurToBgnApprox(priceEur),
        durationKey,
        currency: "EUR",
      }
    }),
  })
}
