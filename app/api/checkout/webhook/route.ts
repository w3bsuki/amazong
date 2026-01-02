import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { getStripeWebhookSecret } from '@/lib/env';
import type Stripe from 'stripe';

// PRODUCTION: Use centralized admin client for consistency
const supabase = createAdminClient();

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
      getStripeWebhookSecret()
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
      // Idempotency: avoid creating duplicate orders for the same payment intent.
      if (session.payment_intent) {
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', session.payment_intent as string)
          .maybeSingle();

        if (existingOrder?.id) {
          console.log('Order already exists for payment intent:', session.payment_intent);
          return NextResponse.json({ received: true });
        }
      }

      // Get line items for order details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Create order in database
      const shippingAddr = session.customer_details?.address ? {
        name: session.customer_details.name || null,
        email: session.customer_details.email || null,
        address: {
          city: session.customer_details.address.city || null,
          country: session.customer_details.address.country || null,
          line1: session.customer_details.address.line1 || null,
          line2: session.customer_details.address.line2 || null,
          postal_code: session.customer_details.address.postal_code || null,
          state: session.customer_details.address.state || null,
        },
      } : null

      const userId = session.client_reference_id || session.metadata?.user_id
      if (!userId) {
        console.error('No user_id found in session');
        return NextResponse.json({ error: 'No user_id' }, { status: 400 });
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: (session.amount_total || 0) / 100,
          status: 'paid',
          shipping_address: shippingAddr as import("@/lib/supabase/database.types").Json,
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
        let itemsData: { id: string; variantId?: string | null; qty: number; price: number }[] = [];
        try {
          if (session.metadata?.items_json) {
            itemsData = JSON.parse(session.metadata.items_json);
          }
        } catch {
          console.warn('Could not parse items_json from metadata');
        }

        // Get product details including seller_id for each item
        const productIds = itemsData.map(item => item.id).filter(Boolean);
        
        if (productIds.length > 0) {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, seller_id')
            .in('id', productIds);

          if (productsError) {
            console.error('Error fetching products:', productsError);
          }

          // Create a map of product_id to seller_id
          const productSellerMap = new Map(
            products?.map(p => [p.id, p.seller_id]) || []
          );

          // Build valid order items with required seller_id
          const validItems = itemsData
            .filter(item => item.id && productSellerMap.get(item.id))
            .map((item) => ({
              order_id: order.id,
              product_id: item.id,
              seller_id: productSellerMap.get(item.id)!,
              quantity: item.qty || 1,
              price_at_purchase: item.price,
              ...(item.variantId ? { variant_id: item.variantId } : {}),
            }));

          if (validItems.length > 0) {
            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(validItems);

            if (itemsError) {
              console.error('Error creating order items:', itemsError);
            } else {
              console.log('Order items created:', validItems.length);
            }

            // Create order conversations for buyer-seller communication
            // This is handled by the create_order_conversation trigger on orders table
            // Sellers will see the new order in their dashboard and can message buyers
            console.log('Order created - conversation trigger should fire for order:', order.id);
            
            // Log seller IDs that will receive the order
            const sellerIds = [...new Set(validItems.map(item => item.seller_id))];
            console.log('Sellers notified via order:', sellerIds.join(', '));
          }
        }
      }

      // Send buyer confirmation email
      // Future: Integrate with Resend or SendGrid when email service is set up
      // await sendOrderConfirmationEmail(session.customer_details.email, order);
      if (session.customer_details?.email) {
        console.log('Order confirmation pending email setup:', session.customer_details.email);
      }

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

// Note: runtime = 'nodejs' removed as it's not compatible with Next.js 16 cacheComponents
// Stripe webhook signature verification still works with the default runtime
