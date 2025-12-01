import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
})

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          const sellerId = session.metadata?.seller_id
          const planTier = session.metadata?.plan_tier as 'premium' | 'business'
          const billingPeriod = session.metadata?.billing_period as 'monthly' | 'yearly'
          const subscriptionId = session.subscription as string

          if (sellerId && planTier && subscriptionId) {
            // Get subscription details from Stripe
            const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
            const subscription = subscriptionResponse as unknown as { current_period_end: number }
            
            // Calculate expiry date
            const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

            // Get plan details
            const { data: plan } = await supabase
              .from('subscription_plans')
              .select('*')
              .eq('tier', planTier)
              .single()

            const price = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly

            // Create subscription record
            const { error: subError } = await supabase
              .from('subscriptions')
              .insert({
                seller_id: sellerId,
                plan_type: planTier,
                status: 'active',
                price_paid: price,
                billing_period: billingPeriod,
                starts_at: new Date().toISOString(),
                expires_at: expiresAt,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: subscriptionId,
              })

            if (subError) {
              console.error('Error creating subscription:', subError)
            }

            // Update seller tier and commission rate
            const { error: sellerError } = await supabase
              .from('sellers')
              .update({
                tier: planTier,
                commission_rate: plan.commission_rate,
              })
              .eq('id', sellerId)

            if (sellerError) {
              console.error('Error updating seller:', sellerError)
            }

            console.log(`Subscription activated for seller ${sellerId}: ${planTier}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscriptionEvent = event.data.object as Stripe.Subscription
        const stripeSubId = subscriptionEvent.id
        const subscription = subscriptionEvent as unknown as { 
          status: string
          current_period_end: number 
        }

        // Find the subscription in our database
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', stripeSubId)
          .single()

        if (existingSub) {
          const newStatus = subscription.status === 'active' ? 'active' 
            : subscription.status === 'canceled' ? 'cancelled'
            : subscription.status === 'past_due' ? 'expired'
            : existingSub.status

          const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

          await supabase
            .from('subscriptions')
            .update({
              status: newStatus,
              expires_at: expiresAt,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.id)

          // Update seller tier if cancelled
          if (newStatus === 'cancelled' || newStatus === 'expired') {
            await supabase
              .from('sellers')
              .update({
                tier: 'basic',
                commission_rate: 10.00,
              })
              .eq('id', existingSub.seller_id)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscriptionEvent = event.data.object as Stripe.Subscription
        const stripeSubId = subscriptionEvent.id

        // Update subscription status
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', stripeSubId)
          .single()

        if (existingSub) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.id)

          // Reset seller to basic tier
          await supabase
            .from('sellers')
            .update({
              tier: 'basic',
              commission_rate: 10.00,
            })
            .eq('id', existingSub.seller_id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceData = invoice as unknown as { subscription: string | null }
        const subscriptionId = invoiceData.subscription

        if (subscriptionId) {
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (existingSub) {
            // Mark as expired/pending
            await supabase
              .from('subscriptions')
              .update({
                status: 'expired',
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingSub.id)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
