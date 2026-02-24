import type { NextRequest } from "next/server"
import { errorEnvelope, successEnvelope } from '@/lib/api/envelope'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { STRIPE_CUSTOMER_ID_SELECT } from '@/lib/supabase/selects/billing'
import { stripe } from '@/lib/stripe'
import { noStoreJson } from "@/lib/api/response-helpers"

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function normalizeLocale(locale: unknown): 'en' | 'bg' {
  return locale === 'bg' ? 'bg' : 'en'
}

function inferLocaleFromRequest(req: Request): 'en' | 'bg' {
  const headerLocale = req.headers.get('x-next-intl-locale')
  if (headerLocale) return normalizeLocale(headerLocale)

  const referer = req.headers.get('referer')
  if (referer) {
    try {
      const url = new URL(referer)
      const firstSegment = url.pathname.split('/').filter(Boolean)[0]
      if (firstSegment) return normalizeLocale(firstSegment)
    } catch {
      // ignore invalid referer
    }
  }

  return 'en'
}

export async function POST(req: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(req)
  const json = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json(errorEnvelope({ error: 'Unauthorized' }), { status: 401 })
    }

    // Get seller's subscription to find the Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq('seller_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription?.stripe_customer_id) {
      return json(
        errorEnvelope({ error: 'No active subscription found' }),
        { status: 404 }
      )
    }

    const locale = inferLocaleFromRequest(req)
    const accountPlansUrl = `${getAppUrl()}/${locale}/account/plans`

    // Create a Stripe billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: accountPlansUrl,
    })

    return json(successEnvelope({ url: portalSession.url }))
  } catch (error) {
    console.error('Portal session error:', error)
    return json(
      errorEnvelope({ error: 'Failed to create portal session' }),
      { status: 500 }
    )
  }
}
