import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getStripeSubscriptionWebhookSecret } from '@/lib/env'
import type Stripe from 'stripe'

const SUBSCRIPTION_SELECT_FOR_UPDATES = 'id,seller_id,status,expires_at'
const SUBSCRIPTION_PLAN_SELECT_FOR_WEBHOOK =
  'id,tier,price_monthly,price_yearly,commission_rate,final_value_fee,insertion_fee,per_order_fee'

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
      getStripeSubscriptionWebhookSecret()
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('Webhook signature verification failed:', message)
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
          const sellerId = session.metadata.seller_id ?? session.metadata.profile_id
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
          }
          break
        }

        // ============================================================
        // HANDLE SUBSCRIPTION PAYMENTS (recurring)
        // ============================================================
        if (session.mode === 'subscription') {
          const profileId = session.metadata?.profile_id || session.metadata?.seller_id // Support both for backwards compat
          const planId = session.metadata?.plan_id
          const billingPeriod = session.metadata?.billing_period as 'monthly' | 'yearly' | undefined
          const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null

          if (!profileId || !planId || !billingPeriod || !subscriptionId) break

          // Get subscription details from Stripe (for period end + price id)
          const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['items.data.price'],
          })

          const currentPeriodEnd = (subscriptionResponse as unknown as { current_period_end: number }).current_period_end
          const expiresAt = new Date(currentPeriodEnd * 1000).toISOString()
          const stripePriceId = subscriptionResponse.items?.data?.[0]?.price?.id ?? null

          // Get plan details by ID (this is the source of truth)
          const { data: plan } = await supabase
            .from('subscription_plans')
            .select(SUBSCRIPTION_PLAN_SELECT_FOR_WEBHOOK)
            .eq('id', planId)
            .eq('is_active', true)
            .single()

          if (!plan) {
            console.error('Plan not found for plan_id')
            break
          }

          const pricePaid = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly

          // Idempotency: if Stripe retries, don't create duplicates
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .maybeSingle()

          if (existingSub?.id) {
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                seller_id: profileId,
                plan_type: plan.tier,
                status: 'active',
                price_paid: pricePaid,
                billing_period: billingPeriod,
                expires_at: expiresAt,
                stripe_customer_id: (typeof session.customer === 'string' ? session.customer : null),
                stripe_price_id: stripePriceId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingSub.id)

            if (updateError) {
              console.error('Error updating subscription:', updateError.message)
            }
          } else {
            const { error: subError } = await supabase
              .from('subscriptions')
              .insert({
                seller_id: profileId,
                plan_type: plan.tier,
                status: 'active',
                price_paid: pricePaid,
                billing_period: billingPeriod,
                starts_at: new Date().toISOString(),
                expires_at: expiresAt,
                stripe_customer_id: (typeof session.customer === 'string' ? session.customer : null),
                stripe_subscription_id: subscriptionId,
                stripe_price_id: stripePriceId,
              })

            if (subError) {
              console.error('Error creating subscription:', subError.message)
            }
          }

          // Update profile tier and fee fields from plan
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              tier: plan.tier,
              commission_rate: plan.final_value_fee || plan.commission_rate || 12.0,
              final_value_fee: plan.final_value_fee || plan.commission_rate || 12.0,
              insertion_fee: plan.insertion_fee || 0,
              per_order_fee: plan.per_order_fee || 0,
            })
            .eq('id', profileId)

          if (profileError) {
            console.error('Error updating profile:', profileError.message)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscriptionEvent = event.data.object as Stripe.Subscription
        const stripeSubId = subscriptionEvent.id

        // Find the subscription in our database
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select(SUBSCRIPTION_SELECT_FOR_UPDATES)
          .eq('stripe_subscription_id', stripeSubId)
          .single()

        if (existingSub) {
          // Map Stripe status to our status
          // KEY: Don't downgrade when cancel_at_period_end is true - user keeps access until expiry
          const stripeStatus = subscriptionEvent.status
          const newStatus = stripeStatus === 'active' ? 'active' 
            : stripeStatus === 'canceled' ? 'cancelled'
            : stripeStatus === 'past_due' ? 'expired'
            : existingSub.status

          const expiresAt = new Date((subscriptionEvent as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
          
          // Track auto_renew based on cancel_at_period_end
          const autoRenew = !subscriptionEvent.cancel_at_period_end

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
          .select(SUBSCRIPTION_SELECT_FOR_UPDATES)
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
        }
        break
      }

      case 'invoice.paid': {
        // Successful recurring payment - extend subscription
        const invoice = event.data.object
        // Extract subscription ID safely - can be string, Subscription object, or null
        const subField = 'subscription' in invoice ? invoice.subscription : null
        let subscriptionId: string | null = null
        if (typeof subField === 'string') {
          subscriptionId = subField
        } else if (subField && typeof subField === 'object' && 'id' in subField && typeof subField.id === 'string') {
          subscriptionId = subField.id
        }

        if (subscriptionId) {
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select(SUBSCRIPTION_SELECT_FOR_UPDATES)
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (existingSub) {
            // Get the period end from invoice lines
            const invoiceLines = 'lines' in invoice ? invoice.lines : null
            const firstLine = invoiceLines?.data?.[0]
            const periodEnd = firstLine?.period?.end
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
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        // Extract subscription ID safely - can be string, Subscription object, or null
        const subField = 'subscription' in invoice ? invoice.subscription : null
        let subscriptionId: string | null = null
        if (typeof subField === 'string') {
          subscriptionId = subField
        } else if (subField && typeof subField === 'object' && 'id' in subField && typeof subField.id === 'string') {
          subscriptionId = subField.id
        }

        if (subscriptionId) {
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select(SUBSCRIPTION_SELECT_FOR_UPDATES)
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

// Note: runtime = 'nodejs' removed as it's not compatible with Next.js 16 cacheComponents
