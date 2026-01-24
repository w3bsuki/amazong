import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { getStripeWebhookSecrets } from '@/lib/env';
import { ensureOrderConversations } from "@/lib/order-conversations"
import type Stripe from 'stripe';

// PRODUCTION: Use centralized admin client for consistency
const supabase = createAdminClient();

/**
 * Canonical ownership:
 * - Orders (one-time product checkout): this route
 * - Listing boosts: `app/api/payments/webhook/route.ts`
 * - Subscriptions: `app/api/subscriptions/webhook/route.ts`
 * - Connect account events: `app/api/connect/webhook/route.ts`
 */

type OrderItemPayload = {
  id: string;
  variantId?: string | null;
  qty: number;
  price: number;
};

function parseOrderItems(
  session: Stripe.Checkout.Session
): OrderItemPayload[] {
  const rawItems = session.metadata?.items_json;
  if (!rawItems) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawItems);
    if (Array.isArray(parsed)) {
      return parsed as OrderItemPayload[];
    }
  } catch {
    return [];
  }

  return [];
}

type OrderConversationSeed = { productId: string; sellerId: string }

async function ensureOrderItems(
  orderId: string,
  itemsData: OrderItemPayload[]
): Promise<OrderConversationSeed[]> {
  // Avoid duplicate inserts if the webhook retries after order creation.
  const { data: existingItems, error: existingItemsError } = await supabase
    .from('order_items')
    .select('product_id, seller_id')
    .eq('order_id', orderId);

  if (existingItemsError) {
    console.error('Error checking order items:', existingItemsError);
    return [];
  }

  if (existingItems?.length) {
    return existingItems.map((item) => ({
      productId: item.product_id,
      sellerId: item.seller_id,
    }))
  }

  if (itemsData.length === 0) {
    return []
  }

  const productIds = itemsData.map(item => item.id).filter(Boolean);
  if (productIds.length === 0) {
    return [];
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, seller_id')
    .in('id', productIds);

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  const productSellerMap = new Map(
    products?.map((product) => [product.id, product.seller_id]) || []
  );

  const validItems = itemsData
    .map((item) => {
      if (!item.id) return null
      const sellerId = productSellerMap.get(item.id)
      if (!sellerId) return null

      return {
        order_id: orderId,
        product_id: item.id,
        seller_id: sellerId,
        quantity: item.qty || 1,
        price_at_purchase: item.price,
        ...(item.variantId ? { variant_id: item.variantId } : {}),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (validItems.length === 0) {
    return [];
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(validItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
  }

  return validItems.map((item) => ({
    productId: item.product_id,
    sellerId: item.seller_id,
  }))
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event | undefined;

  try {
    const secrets = getStripeWebhookSecrets();
    let lastError: unknown;

    for (const secret of secrets) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, secret);
        lastError = undefined;
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!event) {
      throw lastError ?? new Error('Unknown error');
    }
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

    try {
      // Avoid duplicate processing across webhook endpoints.
      // Boost and subscription sessions are handled by their dedicated webhook routes.
      if (session.metadata?.type === 'listing_boost') {
        return NextResponse.json({ received: true });
      }
      if (session.mode === 'subscription' || session.mode === 'setup') {
        return NextResponse.json({ received: true });
      }

      const itemsData = parseOrderItems(session);

      const sessionBuyerId = session.client_reference_id || session.metadata?.user_id

      // Idempotency: avoid creating duplicate orders for the same payment intent.
      if (session.payment_intent) {
        const { data: existingOrders, error: existingOrdersError } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', session.payment_intent as string)
          .order('created_at', { ascending: false })
          .limit(1);

        if (existingOrdersError) {
          console.error('Error checking existing orders:', existingOrdersError);
        }

        const existingOrderId = existingOrders?.[0]?.id;

        if (existingOrderId) {
          const conversationSeeds = await ensureOrderItems(existingOrderId, itemsData)
          if (sessionBuyerId && conversationSeeds.length > 0) {
            await ensureOrderConversations(
              supabase,
              conversationSeeds.map((seed) => ({
                orderId: existingOrderId,
                buyerId: sessionBuyerId,
                sellerId: seed.sellerId,
                productId: seed.productId,
              }))
            )
          }

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

      const userId = sessionBuyerId
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
        .select("id")
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        // Don't return error to Stripe - log it and investigate
        // Stripe will retry on 5xx errors
        return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
      }

      // Create order items from line items
      if (lineItems.data.length > 0) {
        const conversationSeeds = await ensureOrderItems(order.id, itemsData);
        if (conversationSeeds.length > 0) {
          await ensureOrderConversations(
            supabase,
            conversationSeeds.map((seed) => ({
              orderId: order.id,
              buyerId: userId,
              sellerId: seed.sellerId,
              productId: seed.productId,
            }))
          )
        }
      }

      // TODO: Send buyer confirmation email when email service is set up
      // await sendOrderConfirmationEmail(session.customer_details?.email, order);

    } catch (error) {
      console.error('Error processing checkout session:', error);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  // Handle payment_intent.succeeded for additional verification
  if (event.type === 'payment_intent.succeeded') {
    // Payment verified - order creation handled in checkout.session.completed
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
