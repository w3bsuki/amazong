'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

// Boost pricing options (in BGN)
const BOOST_PRICING = {
  '7': { price: 2.99, label: '7 days' },
  '14': { price: 5.0, label: '14 days' },
  '30': { price: 9.99, label: '30 days' },
} as const

type BoostDuration = keyof typeof BOOST_PRICING

export async function createBoostCheckoutSession(input: {
  productId: string
  durationDays: string
}) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Database connection failed')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { productId, durationDays } = input

  if (!productId || !durationDays) {
    throw new Error('Missing required fields: productId, durationDays')
  }

  if (!(durationDays in BOOST_PRICING)) {
    throw new Error('Invalid duration. Must be 7, 14, or 30 days')
  }

  const duration = durationDays as BoostDuration
  const pricing = BOOST_PRICING[duration]

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    throw new Error('Profile not found')
  }

  const { data: product } = await supabase
    .from('products')
    .select('id, title, seller_id, is_boosted')
    .eq('id', productId)
    .eq('seller_id', user.id)
    .single()

  if (!product) {
    throw new Error('Product not found or not owned by you')
  }

  if (product.is_boosted) {
    throw new Error('This product is already boosted')
  }

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
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', profile.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'bgn',
          product_data: {
            name: `Listing Boost - ${pricing.label}`,
            description: `Boost "${product.title}" for ${pricing.label} with premium visibility`,
            images: [],
          },
          unit_amount: Math.round(pricing.price * 100),
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

  return {
    sessionId: session.id,
    url: session.url,
    price: pricing.price,
    duration: pricing.label,
  }
}
