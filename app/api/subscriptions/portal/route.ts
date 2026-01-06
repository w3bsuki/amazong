import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

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

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get seller's subscription to find the Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('seller_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
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

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}