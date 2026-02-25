"use server"


import { z } from 'zod'
import { errorEnvelope, successEnvelope, type Envelope } from '@/lib/api/envelope'
import { requireAuth } from '@/lib/auth/require-auth'
import { stripe } from '@/lib/stripe'
import { STRIPE_CUSTOMER_ID_SELECT } from '@/lib/supabase/selects/billing'
import { buildLocaleUrl } from '@/lib/stripe-locale'

import { logError } from "@/lib/logger"
const NOT_AUTHENTICATED = 'Not authenticated'

const paymentMethodInputSchema = z.object({
  paymentMethodId: z.string().min(1),
  dbId: z.string().min(1),
})

const PAYMENT_METHOD_SELECT = 'id,stripe_payment_method_id' as const

type PaymentSetupSessionResult = Envelope<
  { url: string | null | undefined },
  { error: string }
>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- intentionally empty: no extra success payload
type PaymentMethodMutationResult = Envelope<{}, { error: string }>

async function getOwnedPaymentMethod(params: {
  userId: string
  dbId: string
  paymentMethodId: string
  supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>>['supabase']
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId, dbId, paymentMethodId, supabase } = params

  const { data: paymentMethod, error: paymentMethodError } = await supabase
    .from('user_payment_methods')
    .select(PAYMENT_METHOD_SELECT)
    .eq('id', dbId)
    .eq('user_id', userId)
    .maybeSingle()

  if (paymentMethodError) {
    logError('payments_owned_method_lookup_failed', paymentMethodError, {
      userId,
      dbId,
    })
    return { ok: false, error: 'Failed to validate payment method' }
  }

  if (!paymentMethod || paymentMethod.stripe_payment_method_id !== paymentMethodId) {
    return { ok: false, error: 'Invalid input' }
  }

  return { ok: true }
}

async function getOwnedPaymentMethodMutationContext(
  input: { paymentMethodId: string; dbId: string }
): Promise<
  | {
      ok: true
      user: NonNullable<Awaited<ReturnType<typeof requireAuth>>>['user']
      supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>>['supabase']
      paymentMethodId: string
      dbId: string
    }
  | { ok: false; result: PaymentMethodMutationResult }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { ok: false, result: errorEnvelope({ error: NOT_AUTHENTICATED }) }
  }

  const { user, supabase } = auth

  const parsed = paymentMethodInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, result: errorEnvelope({ error: 'Invalid input' }) }
  }

  const { paymentMethodId, dbId } = parsed.data

  const ownedMethodCheck = await getOwnedPaymentMethod({
    userId: user.id,
    dbId,
    paymentMethodId,
    supabase,
  })
  if (!ownedMethodCheck.ok) {
    return {
      ok: false,
      result: errorEnvelope({ error: ownedMethodCheck.error }),
    }
  }

  return { ok: true, user, supabase, paymentMethodId, dbId }
}

async function withOwnedPaymentMethodMutationContext(
  input: { paymentMethodId: string; dbId: string },
  opts: { logKey: string; errorMessage: string },
  fn: (ctx: {
    user: NonNullable<Awaited<ReturnType<typeof requireAuth>>>['user']
    supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>>['supabase']
    paymentMethodId: string
    dbId: string
  }) => Promise<PaymentMethodMutationResult>
): Promise<PaymentMethodMutationResult> {
  try {
    const context = await getOwnedPaymentMethodMutationContext(input)
    if (!context.ok) {
      return context.result
    }

    return await fn(context)
  } catch (error) {
    logError(opts.logKey, error)
    return errorEnvelope({ error: opts.errorMessage })
  }
}

export async function createPaymentMethodSetupSession(
  input?: { locale?: 'en' | 'bg' }
): Promise<PaymentSetupSessionResult> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: NOT_AUTHENTICATED })
    }

    const { user, supabase } = auth

    const { data: profile, error: profileError } = await supabase
      .from('private_profiles')
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq('id', user.id)
      .single()

    if (profileError) {
      logError('payments_profile_lookup_failed', profileError, { userId: user.id })
      return errorEnvelope({ error: 'Failed to create setup session' })
    }

    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        ...(user.email ? { email: user.email } : {}),
        metadata: {
          supabase_user_id: user.id,
        },
      })

      stripeCustomerId = customer.id

      const { error: profileUpdateError } = await supabase
        .from('private_profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)

      if (profileUpdateError) {
        logError('payments_profile_update_failed', profileUpdateError, { userId: user.id })
        return errorEnvelope({ error: 'Failed to create setup session' })
      }
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
    logError('payments_create_setup_session_failed', error)
    return errorEnvelope({ error: 'Failed to create setup session' })
  }
}

export async function deletePaymentMethod(
  input: { paymentMethodId: string; dbId: string }
): Promise<PaymentMethodMutationResult> {
  return withOwnedPaymentMethodMutationContext(
    input,
    { logKey: 'payments_delete_method_failed', errorMessage: 'Failed to delete payment method' },
    async ({ user, supabase, paymentMethodId, dbId }) => {
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
    }
  )
}

export async function setDefaultPaymentMethod(
  input: { paymentMethodId: string; dbId: string }
): Promise<PaymentMethodMutationResult> {
  return withOwnedPaymentMethodMutationContext(
    input,
    { logKey: 'payments_set_default_method_failed', errorMessage: 'Failed to set default payment method' },
    async ({ user, supabase, paymentMethodId, dbId }) => {
      const { data: profile, error: profileError } = await supabase
        .from('private_profiles')
        .select(STRIPE_CUSTOMER_ID_SELECT)
        .eq('id', user.id)
        .single()

      if (profileError) {
        logError('payments_profile_lookup_failed', profileError, { userId: user.id })
        return errorEnvelope({ error: 'Failed to set default payment method' })
      }

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
    }
  )
}
