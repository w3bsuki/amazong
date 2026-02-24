import type { NextRequest } from "next/server"
import { errorEnvelope, successEnvelope } from '@/lib/api/envelope'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { STRIPE_CUSTOMER_ID_SELECT } from '@/lib/supabase/selects/billing'
import { stripe } from '@/lib/stripe'
import { isNextPrerenderInterrupted } from '@/lib/next/is-next-prerender-interrupted'
import { noStoreJson } from "@/lib/api/response-helpers"

export async function GET(request: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return noStoreJson(successEnvelope({ skipped: true }), { status: 200 })
  }

  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json(errorEnvelope({ error: 'Unauthorized' }), { status: 401 })
    }

    // Get user's stripe_customer_id from private profile (PII/billing surface)
    const { data: profile } = await supabase
      .from('private_profiles')
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq('id', user.id)
      .single()

    const customerIds = [
      profile?.stripe_customer_id,
    ].filter(Boolean) as string[]

    if (customerIds.length === 0) {
      return json(successEnvelope({ invoices: [], charges: [] }))
    }

    // Fetch invoices and charges from all customer IDs
    const allInvoices: Array<{
      id: string
      number: string | null
      status: string | null
      amount_paid: number
      amount_due: number
      currency: string
      created: number
      hosted_invoice_url: string | null
      invoice_pdf: string | null
      description: string | null
      subscription: string | null
      period_start: number | null
      period_end: number | null
    }> = []

    const allCharges: Array<{
      id: string
      amount: number
      currency: string
      status: string
      created: number
      description: string | null
      receipt_url: string | null
      metadata: Record<string, string>
    }> = []

    for (const customerId of customerIds) {
      // Fetch invoices (for subscriptions)
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 50,
      })

      for (const invoice of invoices.data) {
        const invoiceData = invoice as unknown as { subscription?: string | null }
        allInvoices.push({
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          amount_paid: invoice.amount_paid,
          amount_due: invoice.amount_due,
          currency: invoice.currency,
          created: invoice.created,
          hosted_invoice_url: invoice.hosted_invoice_url ?? null,
          invoice_pdf: invoice.invoice_pdf ?? null,
          description: invoice.description,
          subscription: typeof invoiceData.subscription === 'string' ? invoiceData.subscription : null,
          period_start: invoice.period_start,
          period_end: invoice.period_end,
        })
      }

      // Fetch charges (for one-time payments like boosts)
      const charges = await stripe.charges.list({
        customer: customerId,
        limit: 50,
      })

      for (const charge of charges.data) {
        // Skip charges that are part of an invoice (already counted above)
        if ('invoice' in charge && charge.invoice) continue
        
        allCharges.push({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          created: charge.created,
          description: charge.description,
          receipt_url: charge.receipt_url,
          metadata: charge.metadata as Record<string, string>,
        })
      }
    }

    // Sort by created date, newest first
    allInvoices.sort((a, b) => b.created - a.created)
    allCharges.sort((a, b) => b.created - a.created)

    return json(successEnvelope({ 
      invoices: allInvoices,
      charges: allCharges,
    }))
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) {
      return json(successEnvelope({ skipped: true }), { status: 200 })
    }
    console.error('Error fetching billing data:', error)

    return json(
      errorEnvelope({ error: 'Failed to fetch billing data' }),
      { status: 500 }
    )
  }
}
