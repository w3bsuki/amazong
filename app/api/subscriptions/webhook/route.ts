import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
})

export async function POST(req: Request) {
  // Create admin client inside handler (not at module level)
  const supabase = createAdminClient()
  
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

        // ============================================================
        // HANDLE LISTING BOOST PAYMENTS (one-time payment)
        // ============================================================
        if (session.metadata?.type === 'listing_boost' && session.mode === 'payment') {
          const sellerId = session.metadata.seller_id
          const productId = session.metadata.product_id
          const durationDays = Number.parseInt(session.metadata.duration_days || '7')
          const amountPaid = (session.amount_total || 0) / 100 // Convert from stotinki

          if (sellerId && productId) {
            // Calculate expiry date
            const startsAt = new Date()
            const expiresAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000)

            // Create listing_boost record
            const { error: boostError } = await supabase
              .from('listing_boosts')
              .insert({
                product_id: productId,
                seller_id: sellerId,
                price_paid: amountPaid,
                duration_days: durationDays,
                starts_at: startsAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                is_active: true,
              })

            if (boostError) {
              console.error('Error creating listing boost:', boostError)
            }

            // Update product to mark as boosted
            const { error: productError } = await supabase
              .from('products')
              .update({
                is_boosted: true,
                boost_expires_at: expiresAt.toISOString(),
                listing_type: 'boosted',
              })
              .eq('id', productId)

            if (productError) {
              console.error('Error updating product boost status:', productError)
            }

            console.log(`✅ Boost activated for product ${productId}: ${durationDays} days, paid ${amountPaid} BGN`)
          }
          break
        }

        // ============================================================
        // HANDLE SUBSCRIPTION PAYMENTS (recurring)
        // ============================================================
        if (session.mode === 'subscription') {
          const profileId = session.metadata?.profile_id || session.metadata?.seller_id // Support both for backwards compat
          const planTier = session.metadata?.plan_tier as 'premium' | 'business'
          const billingPeriod = session.metadata?.billing_period as 'monthly' | 'yearly'
          const subscriptionId = session.subscription as string

          if (profileId && planTier && subscriptionId) {
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

            if (!plan) {
              console.error('Plan not found:', planTier)
              break
            }

            const price = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly

            // Create subscription record
            const { error: subError } = await supabase
              .from('subscriptions')
              .insert({
                seller_id: profileId,
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

            // Update profile tier and ALL fee fields from plan
            const { error: profileError } = await supabase
              .from('profiles')
              .update({
                tier: planTier,
                commission_rate: plan.final_value_fee || plan.commission_rate || 12.00,
                final_value_fee: plan.final_value_fee || plan.commission_rate || 12.00,
                insertion_fee: plan.insertion_fee || 0,
                per_order_fee: plan.per_order_fee || 0,
              })
              .eq('id', profileId)

            if (profileError) {
              console.error('Error updating profile:', profileError)
            }

            console.log(`✅ Subscription activated for profile ${profileId}: ${planTier}, FVF: ${plan.final_value_fee || plan.commission_rate}%`)
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
          cancel_at_period_end: boolean
        }

        // Find the subscription in our database
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', stripeSubId)
          .single()

        if (existingSub) {
          // Map Stripe status to our status
          // KEY: Don't downgrade when cancel_at_period_end is true - user keeps access until expiry
          const newStatus = subscription.status === 'active' ? 'active' 
            : subscription.status === 'canceled' ? 'cancelled'
            : subscription.status === 'past_due' ? 'expired'
            : existingSub.status

          const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()
          
          // Track auto_renew based on cancel_at_period_end
          const autoRenew = !subscription.cancel_at_period_end

          await supabase
            .from('subscriptions')
            .update({
              status: newStatus,
              expires_at: expiresAt,
              auto_renew: autoRenew,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.id)

          // IMPORTANT: Only downgrade profile when subscription is ACTUALLY cancelled/expired
          // NOT when cancel_at_period_end is set (user still has access until period ends)
          if (newStatus === 'cancelled' || newStatus === 'expired') {
            await supabase
              .from('profiles')
              .update({
                tier: 'free',
                commission_rate: 12.00,
                final_value_fee: 12.00,
                insertion_fee: 0,
                per_order_fee: 0,
              })
              .eq('id', existingSub.seller_id)
            
            console.log(`⬇️ Subscription ${newStatus} for profile ${existingSub.seller_id} - downgraded to free tier`)
          } else if (newStatus === 'active' && !autoRenew) {
            console.log(`⏳ Subscription scheduled for cancellation at ${expiresAt} for profile ${existingSub.seller_id}`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        // This fires when subscription period actually ends (after cancel_at_period_end)
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
              status: 'expired', // Subscription has ended
              auto_renew: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.id)

          // NOW downgrade profile to free tier (subscription has actually ended)
          await supabase
            .from('profiles')
            .update({
              tier: 'free',
              commission_rate: 12.00,
              final_value_fee: 12.00,
              insertion_fee: 0,
              per_order_fee: 0,
            })
            .eq('id', existingSub.seller_id)
          
          console.log(`🔚 Subscription ended for profile ${existingSub.seller_id} - downgraded to free tier`)
        }
        break
      }

      case 'invoice.paid': {
        // Successful recurring payment - extend subscription
        const invoice = event.data.object as Stripe.Invoice
        const invoiceData = invoice as unknown as { 
          subscription: string | null
          lines?: { data?: Array<{ period?: { end?: number } }> }
        }
        const subscriptionId = invoiceData.subscription

        if (subscriptionId) {
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (existingSub) {
            // Get the period end from invoice lines
            const periodEnd = invoiceData.lines?.data?.[0]?.period?.end
            const newExpiresAt = periodEnd 
              ? new Date(periodEnd * 1000).toISOString()
              : existingSub.expires_at

            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                expires_at: newExpiresAt,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingSub.id)

            console.log(`💰 Invoice paid for subscription ${subscriptionId}, extended to ${newExpiresAt}`)
          }
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
            
            console.log(`❌ Invoice payment failed for subscription ${subscriptionId}`)
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

// Note: runtime = 'nodejs' removed as it's not compatible with Next.js 16 cacheComponents
