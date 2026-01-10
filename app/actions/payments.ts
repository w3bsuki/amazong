'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

const NOT_AUTHENTICATED = 'Not authenticated'

const paymentMethodInputSchema = z.object({
  paymentMethodId: z.string().min(1),
  dbId: z.string().min(1),
})

export async function createPaymentMethodSetupSession(input?: { locale?: "en" | "bg" }) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error(NOT_AUTHENTICATED)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error(NOT_AUTHENTICATED)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
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
      .from('profiles')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', user.id)
  }

  if (!stripeCustomerId) {
    throw new Error('Stripe customer creation failed')
  }

  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const locale = input?.locale === "bg" ? "bg" : "en"

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'setup',
    payment_method_types: ['card'],
    success_url: `${origin}/${locale}/account/payments?setup=success`,
    cancel_url: `${origin}/${locale}/account/payments?setup=canceled`,
    metadata: {
      user_id: user.id,
    },
  })

  return { url: session.url }
}

export async function deletePaymentMethod(input: { paymentMethodId: string; dbId: string }) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error(NOT_AUTHENTICATED)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error(NOT_AUTHENTICATED)
  }

  const parsed = paymentMethodInputSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error('Invalid input')
  }

  const { paymentMethodId, dbId } = parsed.data

  await stripe.paymentMethods.detach(paymentMethodId)

  const { error: deleteError } = await supabase
    .from('user_payment_methods')
    .delete()
    .eq('id', dbId)
    .eq('user_id', user.id)

  if (deleteError) {
    throw deleteError
  }

  return { success: true }
}

export async function setDefaultPaymentMethod(input: { paymentMethodId: string; dbId: string }) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error(NOT_AUTHENTICATED)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error(NOT_AUTHENTICATED)
  }

  const parsed = paymentMethodInputSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error('Invalid input')
  }

  const { paymentMethodId, dbId } = parsed.data

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    throw new Error('No Stripe customer found')
  }

  await stripe.customers.update(profile.stripe_customer_id, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })

  await supabase
    .from('user_payment_methods')
    .update({ is_default: false })
    .eq('user_id', user.id)

  const { error: updateError } = await supabase
    .from('user_payment_methods')
    .update({ is_default: true })
    .eq('id', dbId)
    .eq('user_id', user.id)

  if (updateError) {
    throw updateError
  }

  return { success: true }
}
