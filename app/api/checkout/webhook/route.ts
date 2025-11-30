import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// Use service role key to bypass RLS for order creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) {
    console.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('Processing checkout.session.completed:', session.id);

    try {
      // Get line items for order details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.client_reference_id || session.metadata?.user_id,
          total_amount: (session.amount_total || 0) / 100,
          status: 'paid',
          shipping_address: session.customer_details?.address ? {
            name: session.customer_details.name,
            email: session.customer_details.email,
            address: session.customer_details.address,
          } : null,
          // Store Stripe payment intent for reference
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        // Don't return error to Stripe - log it and investigate
        // Stripe will retry on 5xx errors
        return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
      }

      console.log('Order created successfully:', order.id);

      // Create order items from line items
      if (lineItems.data.length > 0) {
        // Try to get items from metadata
        let itemsData: { id: string; qty: number; price: number }[] = [];
        try {
          if (session.metadata?.items_json) {
            itemsData = JSON.parse(session.metadata.items_json);
          }
        } catch {
          console.warn('Could not parse items_json from metadata');
        }

        const orderItems = lineItems.data.map((item, index) => ({
          order_id: order.id,
          product_id: itemsData[index]?.id || null,
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100 / (item.quantity || 1),
        }));

        // Filter out items without valid product_id
        const validItems = orderItems.filter(item => item.product_id);

        if (validItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(validItems);

          if (itemsError) {
            console.error('Error creating order items:', itemsError);
          }
        }
      }

      // Optional: Send confirmation email
      // await sendOrderConfirmation(session.customer_details?.email, order);

    } catch (error) {
      console.error('Error processing checkout session:', error);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  // Handle payment_intent.succeeded for additional verification
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('Payment succeeded:', paymentIntent.id);
  }

  // Handle payment failures
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing - Stripe requires raw body for signature verification
export const runtime = 'nodejs';
