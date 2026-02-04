# webhooks.md — Stripe Webhook Handling

> Webhook event processing for Treido.

## Webhook Setup

### API Route

```tsx
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/service';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  
  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  try {
    await handleEvent(event);
  } catch (err) {
    console.error('Error handling webhook:', err);
    return NextResponse.json(
      { error: 'Handler failed' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event) {
  const supabase = createServiceClient();
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(
        event.data.object as Stripe.Checkout.Session,
        supabase
      );
      break;
      
    case 'checkout.session.expired':
      await handleCheckoutExpired(
        event.data.object as Stripe.Checkout.Session,
        supabase
      );
      break;
      
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(
        event.data.object as Stripe.PaymentIntent,
        supabase
      );
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(
        event.data.object as Stripe.PaymentIntent,
        supabase
      );
      break;
      
    case 'charge.refunded':
      await handleRefund(
        event.data.object as Stripe.Charge,
        supabase
      );
      break;
      
    case 'charge.dispute.created':
      await handleDispute(
        event.data.object as Stripe.Dispute,
        supabase
      );
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}
```

## Event Handlers

### Checkout Complete

```tsx
async function handleCheckoutComplete(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient
) {
  const userId = session.metadata?.user_id;
  
  if (!userId) {
    throw new Error('Missing user_id in metadata');
  }
  
  // Retrieve line items (not included by default)
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'paid',
      total: (session.amount_total ?? 0) / 100,
      subtotal: (session.amount_subtotal ?? 0) / 100,
      shipping_cost: (session.total_details?.amount_shipping ?? 0) / 100,
      tax: (session.total_details?.amount_tax ?? 0) / 100,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      shipping_address: session.shipping_details?.address,
    })
    .select()
    .single();
  
  if (orderError) throw orderError;
  
  // Create order items
  const orderItems = lineItems.data.map(item => ({
    order_id: order.id,
    product_id: item.price?.product as string,
    name: item.description,
    quantity: item.quantity,
    unit_price: (item.amount_total ?? 0) / 100 / (item.quantity ?? 1),
    total: (item.amount_total ?? 0) / 100,
  }));
  
  await supabase.from('order_items').insert(orderItems);
  
  // Update product stock
  for (const item of lineItems.data) {
    const productId = item.price?.metadata?.product_id;
    if (productId) {
      await supabase.rpc('decrement_stock', {
        p_product_id: productId,
        p_quantity: item.quantity,
      });
    }
  }
  
  // Clear user's cart
  await supabase.from('cart_items').delete().eq('user_id', userId);
  
  // Queue confirmation email
  // await queueEmail('order_confirmation', { orderId: order.id });
  
  console.log(`Order ${order.id} created for session ${session.id}`);
}
```

### Payment Failed

```tsx
async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: SupabaseClient
) {
  const orderId = paymentIntent.metadata?.order_id;
  
  if (orderId) {
    await supabase
      .from('orders')
      .update({
        status: 'payment_failed',
        error_message: paymentIntent.last_payment_error?.message,
      })
      .eq('id', orderId);
  }
  
  // Notify user
  // await sendEmail('payment_failed', { ... });
  
  console.log(`Payment failed for intent ${paymentIntent.id}`);
}
```

### Refund

```tsx
async function handleRefund(
  charge: Stripe.Charge,
  supabase: SupabaseClient
) {
  const paymentIntentId = charge.payment_intent as string;
  
  // Find order by payment intent
  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();
  
  if (order) {
    const refundAmount = charge.amount_refunded / 100;
    const isFullRefund = charge.amount_refunded === charge.amount;
    
    await supabase
      .from('orders')
      .update({
        status: isFullRefund ? 'refunded' : 'partially_refunded',
        refunded_amount: refundAmount,
      })
      .eq('id', order.id);
    
    // Restore stock for full refunds
    if (isFullRefund) {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id);
      
      for (const item of items ?? []) {
        await supabase.rpc('increment_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }
    }
  }
}
```

## Local Development

### Stripe CLI

```bash
# Install
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Forward specific events
stripe listen \
  --forward-to localhost:3000/api/webhooks/stripe \
  --events checkout.session.completed,payment_intent.succeeded

# Trigger test events
stripe trigger checkout.session.completed
```

### Webhook secret

```bash
# The CLI will show the signing secret
> Ready! Your webhook signing secret is whsec_123...

# Add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_123...
```

## Production Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://treido.com/api/webhooks/stripe`
3. Select events to listen to
4. Copy webhook signing secret to production env

### Required events

| Event | Purpose |
|-------|---------|
| checkout.session.completed | Create order |
| checkout.session.expired | Clean up pending orders |
| payment_intent.succeeded | Confirm payment |
| payment_intent.payment_failed | Handle failures |
| charge.refunded | Process refunds |
| charge.dispute.created | Handle disputes |

### Optional events (Connect)

| Event | Purpose |
|-------|---------|
| account.updated | Seller account status |
| transfer.created | Payout to seller |
| payout.failed | Seller payout failed |

## Idempotency

Handle duplicate webhooks:

```tsx
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // Check if already processed
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single();
  
  if (existing) {
    console.log(`Order already exists for session ${session.id}`);
    return;  // Already processed
  }
  
  // Process order...
}
```

## Error Handling

```tsx
// Return 200 even for non-critical errors to prevent Stripe retries
try {
  await handleEvent(event);
} catch (err) {
  // Log error but return 200 for non-retriable errors
  if (isNonRetriableError(err)) {
    console.error('Non-retriable error:', err);
    return NextResponse.json({ received: true, error: 'handled' });
  }
  
  // Return 500 for retriable errors (Stripe will retry)
  throw err;
}
```
