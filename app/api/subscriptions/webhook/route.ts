import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { getStripeSubscriptionWebhookSecrets } from '@/lib/env'
import type Stripe from 'stripe'

/**
 * Canonical ownership:
 * - Subscriptions + invoices: this route (separate webhook secret)
 *
 * Orders are handled by `app/api/checkout/webhook/route.ts`.
 * Listing boosts + card setup are handled by `app/api/payments/webhook/route.ts`.
 */
const SUBSCRIPTION_SELECT_FOR_UPDATES = 'id,seller_id,status,expires_at'
const SUBSCRIPTION_PLAN_SELECT_FOR_WEBHOOK =
  'id,tier,price_monthly,price_yearly,stripe_price_monthly_id,stripe_price_yearly_id,commission_rate,final_value_fee,insertion_fee,per_order_fee'

/** Sanitized error logging - never log full objects or secrets */
function logWebhookError(context: string, err: unknown): void {
  const type = err instanceof Error ? err.constructor.name : typeof err
  const message = err instanceof Error ? err.message : 'Unknown error'
  // Only log type + message, never full stack/object
  console.error(`[webhook/${context}] ${type}: ${message}`)
}

/** Safe Stripe subscription retrieval - returns null on failure instead of throwing */
async function safeRetrieveSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price'],
    })
  } catch (err) {
    logWebhookError('stripe-retrieve', err)
    return null
  }
}

async function getFreeTierFeesForProfile(
  supabase: ReturnType<typeof createAdminClient>,
  profileId: string
): Promise<{ finalValueFee: number; insertionFee: number; perOrderFee: number }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", profileId)
    .single()

  const accountType = profile?.account_type === "business" ? "business" : "personal"

  const { data: freePlan } = await supabase
    .from("subscription_plans")
    .select("final_value_fee,commission_rate,insertion_fee,per_order_fee")
    .eq("tier", "free")
    .eq("account_type", accountType)
    .eq("is_active", true)
    .single()

  const finalValueFee = Number(freePlan?.final_value_fee ?? freePlan?.commission_rate ?? 0)
  const insertionFee = Number(freePlan?.insertion_fee ?? 0)
  const perOrderFee = Number(freePlan?.per_order_fee ?? 0)

  return { finalValueFee, insertionFee, perOrderFee }
}

export async function POST(req: Request) {
  // Create admin client inside handler (not at module level)
  const supabase = createAdminClient()

  let body: string
  try {
    body = await req.text()
  } catch (err) {
    logWebhookError('body-read', err)
    return NextResponse.json({ received: true })
  }

  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event | undefined

  try {
    const secrets = getStripeSubscriptionWebhookSecrets()
    let lastError: unknown

    for (const secret of secrets) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, secret)
        lastError = undefined
        break
      } catch (err) {
        lastError = err
      }
    }

    if (!event) {
      throw lastError ?? new Error('Invalid signature')
    }
  } catch (err) {
    logWebhookError('signature', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Process events - always return 200 { received: true } after signature verification
  // to prevent Stripe retries from causing load spikes
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // NOTE: Listing boost payments are handled by app/api/payments/webhook/route.ts
        // to avoid duplicate processing. Do not add boost handling here.

        // ============================================================
        // HANDLE SUBSCRIPTION PAYMENTS (recurring)
        // ============================================================
        if (session.mode === 'subscription') {
          const profileId = session.metadata?.profile_id || session.metadata?.seller_id // Support both for backwards compat
          const planId = session.metadata?.plan_id
          const billingPeriodRaw = session.metadata?.billing_period
          const billingPeriod =
            billingPeriodRaw === 'monthly' || billingPeriodRaw === 'yearly'
              ? (billingPeriodRaw as 'monthly' | 'yearly')
              : undefined
          const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null

          // Safe no-op if required metadata is missing
          if (!profileId || !planId || !billingPeriod || !subscriptionId) {
            logWebhookError('subscription-checkout', new Error('Missing required metadata (profile_id/plan_id/billing_period/subscription_id)'))
            break
          }

          // Get subscription details from Stripe (for period end + price id)
          // Safe retrieval - returns null on failure, doesn't throw
          const subscriptionResponse = await safeRetrieveSubscription(subscriptionId)
          if (!subscriptionResponse) {
            logWebhookError('subscription-checkout', new Error('Failed to retrieve subscription from Stripe'))
            break
          }

          const currentPeriodEnd = (subscriptionResponse as unknown as { current_period_end: number }).current_period_end
          const expiresAt = new Date(currentPeriodEnd * 1000).toISOString()
          const stripePriceId = subscriptionResponse.items?.data?.[0]?.price?.id ?? null
          const startsAt = new Date(subscriptionResponse.start_date * 1000).toISOString()

          // Get plan details by ID (this is the source of truth)
          const { data: plan } = await supabase
            .from('subscription_plans')
            .select(SUBSCRIPTION_PLAN_SELECT_FOR_WEBHOOK)
            .eq('id', planId)
            .eq('is_active', true)
            .single()

          if (!plan) {
            logWebhookError('subscription-checkout', new Error('Plan not found for plan_id'))
            break
          }

          // Plan consistency check: if plan has explicit Stripe price IDs,
          // ensure the subscription item price matches the expected billing period.
          const expectedStripePriceId =
            billingPeriod === 'monthly'
              ? plan.stripe_price_monthly_id
              : plan.stripe_price_yearly_id

          if (expectedStripePriceId && stripePriceId && stripePriceId !== expectedStripePriceId) {
            logWebhookError(
              'subscription-price-mismatch',
              new Error(
                `Stripe price mismatch for plan_id=${planId} period=${billingPeriod}: got=${stripePriceId} expected=${expectedStripePriceId}`
              )
            )
            break
          }

          const pricePaid = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly

          // Verify Stripe price amount matches the plan (defense-in-depth against tampered metadata)
          const stripeUnitAmount = subscriptionResponse.items?.data?.[0]?.price?.unit_amount
          if (typeof stripeUnitAmount === 'number' && Number.isFinite(pricePaid)) {
            const expectedUnitAmount = Math.round(pricePaid * 100)
            if (expectedUnitAmount !== stripeUnitAmount) {
              logWebhookError(
                'subscription-price-mismatch',
                new Error(`Expected unit_amount ${expectedUnitAmount}, got ${stripeUnitAmount}`)
              )
              break
            }
          }

          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
              seller_id: profileId,
              plan_type: plan.tier,
              status: 'active',
              price_paid: pricePaid,
              billing_period: billingPeriod,
              starts_at: startsAt,
              expires_at: expiresAt,
              stripe_customer_id: (typeof session.customer === 'string' ? session.customer : null),
              stripe_subscription_id: subscriptionId,
              stripe_price_id: stripePriceId,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'stripe_subscription_id' })

          if (subError) {
            logWebhookError('subscription-upsert', subError)
          }

          // Update profile tier (public surface) and fee fields (private surface) from plan
          const finalValueFee = Number(plan.final_value_fee ?? plan.commission_rate ?? 0)
          const [{ error: profileError }, { error: privateError }] = await Promise.all([
            supabase
              .from('profiles')
              .update({ tier: plan.tier })
              .eq('id', profileId),
            supabase
              .from('private_profiles')
              .upsert({
                id: profileId,
                commission_rate: finalValueFee,
                final_value_fee: finalValueFee,
                insertion_fee: plan.insertion_fee ?? 0,
                per_order_fee: plan.per_order_fee ?? 0,
              }, { onConflict: 'id' }),
          ])

          if (profileError) logWebhookError('profile-update', profileError)
          if (privateError) logWebhookError('private-profile-update', privateError)
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
            const { finalValueFee, insertionFee, perOrderFee } = await getFreeTierFeesForProfile(
              supabase,
              existingSub.seller_id
            )
            await Promise.all([
              supabase
                .from('profiles')
                .update({ tier: 'free' })
                .eq('id', existingSub.seller_id),
              supabase
                .from('private_profiles')
                .upsert({
                  id: existingSub.seller_id,
                  commission_rate: finalValueFee,
                  final_value_fee: finalValueFee,
                  insertion_fee: insertionFee,
                  per_order_fee: perOrderFee,
                }, { onConflict: 'id' }),
            ])
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
          const { finalValueFee, insertionFee, perOrderFee } = await getFreeTierFeesForProfile(
            supabase,
            existingSub.seller_id
          )
          await Promise.all([
            supabase
              .from('profiles')
              .update({ tier: 'free' })
              .eq('id', existingSub.seller_id),
            supabase
              .from('private_profiles')
              .upsert({
                id: existingSub.seller_id,
                commission_rate: finalValueFee,
                final_value_fee: finalValueFee,
                insertion_fee: insertionFee,
                per_order_fee: perOrderFee,
              }, { onConflict: 'id' }),
          ])
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
    // Always return 200 after signature verification to prevent Stripe retry storms
    // Log sanitized error for debugging, never log full object/stack
    logWebhookError('processing', error)
    return NextResponse.json({ received: true })
  }
}

// Note: runtime = 'nodejs' removed as it's not compatible with Next.js 16 cacheComponents
