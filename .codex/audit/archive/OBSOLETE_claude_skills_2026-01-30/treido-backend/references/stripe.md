# Stripe Integration Reference for Treido

## Environment Variables Required
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Checkout Session Creation

### Basic Checkout
```tsx
'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(cartItems: CartItem[]) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: cartItems.map(item => ({
      price_data: {
        currency: 'bgn',
        product_data: {
          name: item.title,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      // Store order info for webhook processing
      user_id: userId,
      order_items: JSON.stringify(cartItems.map(i => i.id)),
    },
  });
  
  return session.url;
}
```

### With Stripe Connect (Marketplace)
```tsx
export async function createConnectCheckoutSession(
  cartItems: CartItem[],
  sellerId: string
) {
  // Get seller's Stripe account
  const seller = await getSeller(sellerId);
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: cartItems.map(item => ({
      price_data: {
        currency: 'bgn',
        product_data: { name: item.title },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    payment_intent_data: {
      // Split payment between platform and seller
      application_fee_amount: calculatePlatformFee(cartItems),
      transfer_data: {
        destination: seller.stripe_account_id,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  });
  
  return session.url;
}
```

## Webhook Handling

### Signature Verification (Required)
```tsx
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }
  
  // Process event...
}
```

### Idempotent Event Processing
```tsx
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  
  // Check if already processed (idempotency)
  const existingOrder = await db.orders.findUnique({
    where: { stripe_session_id: session.id }
  });
  
  if (existingOrder) {
    console.log('Order already processed:', session.id);
    return; // Already handled
  }
  
  // Process the order
  await db.orders.create({
    data: {
      stripe_session_id: session.id,
      user_id: session.metadata?.user_id,
      status: 'paid',
      // ...
    }
  });
}
```

### Common Webhook Events
```tsx
switch (event.type) {
  case 'checkout.session.completed':
    // Payment successful, fulfill order
    await handleCheckoutComplete(event.data.object);
    break;
    
  case 'checkout.session.expired':
    // Session expired, clean up pending order
    await handleCheckoutExpired(event.data.object);
    break;
    
  case 'payment_intent.payment_failed':
    // Payment failed, notify user
    await handlePaymentFailed(event.data.object);
    break;
    
  case 'account.updated':
    // Connect account updated (for sellers)
    await handleAccountUpdated(event.data.object);
    break;
}
```

## Stripe Connect (Seller Onboarding)

### Create Connect Account
```tsx
export async function createSellerAccount(userId: string, email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: { user_id: userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  
  // Store account ID
  await db.sellers.update({
    where: { user_id: userId },
    data: { stripe_account_id: account.id },
  });
  
  return account.id;
}
```

### Generate Onboarding Link
```tsx
export async function getSellerOnboardingLink(accountId: string) {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboarding/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboarding/complete`,
    type: 'account_onboarding',
  });
  
  return link.url;
}
```

## Testing Webhooks Locally

```bash
# Install Stripe CLI
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

## Security Checklist

- [ ] Always verify webhook signatures
- [ ] Process webhooks idempotently
- [ ] Never log full Stripe objects (contain sensitive data)
- [ ] Use metadata for order correlation
- [ ] Handle all relevant event types
- [ ] Return 200 quickly (process async if needed)
