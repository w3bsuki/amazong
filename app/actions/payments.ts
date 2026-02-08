'use server'

import { z } from 'zod'
import { errorEnvelope, successEnvelope, type Envelope } from '@/lib/api/envelope'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { STRIPE_CUSTOMER_ID_SELECT } from '@/lib/supabase/selects/billing'
import { buildLocaleUrl } from '@/lib/stripe-locale'

const NOT_AUTHENTICATED = 'Not authenticated'

const paymentMethodInputSchema = z.object({
  paymentMethodId: z.string().min(1),
  dbId: z.string().min(1),
})

type PaymentSetupSessionResult = Envelope<
  { url: string | null | undefined },
  { error: string }
>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- intentionally empty: no extra success payload
type PaymentMethodMutationResult = Envelope<{}, { error: string }>

export async function createPaymentMethodSetupSession(
  input?: { locale?: 'en' | 'bg' }
): Promise<PaymentSetupSessionResult> {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const { data: profile } = await supabase
      .from('private_profiles')
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq('id', user.id)
      .single()

    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        ...(user.email ? { email: user.email } : {}),
        metadata: {
          supabase_user_id: user.id,
        },
      })

      stripeCustomerId = customer.id

      await supabase
        .from('private_profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    if (!stripeCustomerId) {
      return errorEnvelope({ error: 'Stripe customer creation failed' })
    }

    const locale = input?.locale === 'bg' ? 'bg' : 'en'
    const successUrl = buildLocaleUrl('account/payments', locale, 'setup=success')
    const cancelUrl = buildLocaleUrl('account/payments', locale, 'setup=canceled')

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'setup',
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
      },
    })

    return successEnvelope({ url: session.url })
  } catch (error) {
    console.error('createPaymentMethodSetupSession error:', error)
    return errorEnvelope({ error: 'Failed to create setup session' })
  }
}

export async function deletePaymentMethod(
  input: { paymentMethodId: string; dbId: string }
): Promise<PaymentMethodMutationResult> {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const parsed = paymentMethodInputSchema.safeParse(input)
    if (!parsed.success) {
      return errorEnvelope({ error: 'Invalid input' })
    }

    const { paymentMethodId, dbId } = parsed.data

    await stripe.paymentMethods.detach(paymentMethodId)

    const { error: deleteError } = await supabase
      .from('user_payment_methods')
      .delete()
      .eq('id', dbId)
      .eq('user_id', user.id)

    if (deleteError) {
      return errorEnvelope({ error: 'Failed to delete payment method' })
    }

    return successEnvelope()
  } catch (error) {
    console.error('deletePaymentMethod error:', error)
    return errorEnvelope({ error: 'Failed to delete payment method' })
  }
}

export async function setDefaultPaymentMethod(
  input: { paymentMethodId: string; dbId: string }
): Promise<PaymentMethodMutationResult> {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const parsed = paymentMethodInputSchema.safeParse(input)
    if (!parsed.success) {
      return errorEnvelope({ error: 'Invalid input' })
    }

    const { paymentMethodId, dbId } = parsed.data

    const { data: profile } = await supabase
      .from('private_profiles')
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return errorEnvelope({ error: 'No Stripe customer found' })
    }

    await stripe.customers.update(profile.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    const { error: clearDefaultsError } = await supabase
      .from('user_payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.id)

    if (clearDefaultsError) {
      return errorEnvelope({ error: 'Failed to set default payment method' })
    }

    const { error: updateError } = await supabase
      .from('user_payment_methods')
      .update({ is_default: true })
      .eq('id', dbId)
      .eq('user_id', user.id)

    if (updateError) {
      return errorEnvelope({ error: 'Failed to set default payment method' })
    }

    return successEnvelope()
  } catch (error) {
    console.error('setDefaultPaymentMethod error:', error)
    return errorEnvelope({ error: 'Failed to set default payment method' })
  }
}
