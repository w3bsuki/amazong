import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

// Boost pricing options (in BGN)
const BOOST_PRICING = {
  '7': { price: 2.99, label: '7 days' },
  '14': { price: 5.00, label: '14 days' },
  '30': { price: 9.99, label: '30 days' },
} as const

type BoostDuration = keyof typeof BOOST_PRICING

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
    const { productId, durationDays } = body as { productId: string, durationDays: string }

    if (!productId || !durationDays) {
      return NextResponse.json({ error: 'Missing required fields: productId, durationDays' }, { status: 400 })
    }

    // Validate duration
    if (!(durationDays in BOOST_PRICING)) {
      return NextResponse.json({ error: 'Invalid duration. Must be 7, 14, or 30 days' }, { status: 400 })
    }

    const duration = durationDays as BoostDuration
    const pricing = BOOST_PRICING[duration]

    // Get profile info (seller fields are now on profiles)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Verify product belongs to seller
    const { data: product } = await supabase
      .from('products')
      .select('id, title, seller_id, is_boosted')
      .eq('id', productId)
      .eq('seller_id', user.id)
      .single()

    if (!product) {
      return NextResponse.json({ error: 'Product not found or not owned by you' }, { status: 404 })
    }

    // Check if already boosted
    if (product.is_boosted) {
      return NextResponse.json({ error: 'This product is already boosted' }, { status: 400 })
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

    // Create Stripe Checkout Session for one-time boost payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment', // One-time payment, not subscription
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'bgn',
            product_data: {
              name: `Listing Boost - ${pricing.label}`,
              description: `Boost "${product.title}" for ${pricing.label} with premium visibility`,
              images: [], // Could add product image here
            },
            unit_amount: Math.round(pricing.price * 100), // Stripe uses stotinki (cents)
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/selling?boost_success=true&product_id=${productId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sell?boost_canceled=true&product_id=${productId}`,
    })

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      price: pricing.price,
      duration: pricing.label 
    })
  } catch (error) {
    console.error('Boost checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get available boost pricing
export async function GET() {
  return NextResponse.json({
    options: Object.entries(BOOST_PRICING).map(([days, { price, label }]) => ({
      days: Number.parseInt(days),
      price,
      label,
      currency: 'BGN'
    }))
  })
}