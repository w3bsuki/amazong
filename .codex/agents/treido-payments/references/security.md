# security.md — Payment Security

> API key management, webhook secrets, PCI compliance, and Connect security.

## API Key Management

### Server-Side Only

| Key | Scope | File |
|-----|-------|------|
| `STRIPE_SECRET_KEY` | Server only | `.env.local` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client safe | `.env.local` |

```tsx
// ✅ lib/stripe.ts (server-only)
import 'server-only';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});
```

### Never Expose Secret Keys

```tsx
// ❌ FORBIDDEN - Client component with secret
'use client';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // EXPOSED!

// ❌ FORBIDDEN - Passing to client
return <ClientComponent stripeKey={process.env.STRIPE_SECRET_KEY} />;

// ✅ CORRECT - Server action
'use server';
export async function createCheckout() {
  const session = await stripe.checkout.sessions.create({...});
  redirect(session.url!);
}
```

## Webhook Secret Rotation

Treido supports graceful webhook secret rotation with comma-separated secrets.

### Configuration

```bash
# .env.local - Single secret
STRIPE_WEBHOOK_SECRET=whsec_old_secret

# During rotation - Both secrets
STRIPE_WEBHOOK_SECRET=whsec_new_secret,whsec_old_secret

# After rotation - New secret only
STRIPE_WEBHOOK_SECRET=whsec_new_secret
```

### Implementation

Location: [lib/env.ts](../../../lib/env.ts)

```tsx
export function getStripeWebhookSecrets(): string[] {
  const raw = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  // Split on comma or newline, trim whitespace
  return raw.split(/[\n,]/g).map(s => s.trim()).filter(Boolean);
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event {
  const secrets = getStripeWebhookSecrets();
  
  for (const secret of secrets) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch {
      continue; // Try next secret
    }
  }
  
  throw new Error('No valid webhook secret');
}
```

### Rotation Steps

1. Add new secret to env var (comma-separated)
2. Deploy
3. Create new webhook endpoint in Stripe Dashboard (or update)
4. Verify new endpoint receives events
5. Remove old secret from env var
6. Delete old webhook in Stripe Dashboard

## PCI Compliance

### Stripe Hosted Checkout

Treido uses **Stripe hosted Checkout** which handles PCI compliance automatically:

| Approach | PCI Level | Treido |
|----------|-----------|--------|
| Stripe Checkout (hosted) | SAQ A | ✅ Used |
| Stripe Elements | SAQ A-EP | — |
| Custom card form | SAQ D | ❌ Never |

### Benefits of Hosted Checkout

- Card data never touches your servers
- Stripe handles 3D Secure
- Automatic payment method detection
- Built-in fraud protection

### Sensitive Data Rules

```tsx
// ❌ NEVER log card details
console.log(paymentMethod.card);

// ❌ NEVER store raw card data
await supabase.from('cards').insert({
  card_number: '4242...',  // NEVER
});

// ✅ Store only Stripe references
await supabase.from('user_payment_methods').insert({
  stripe_payment_method_id: 'pm_xxx',  // Safe reference
  last_four: '4242',  // Display only
  brand: 'visa',
});
```

## Connect Security

### Express Account Protection

```tsx
// ✅ Verify account ownership before operations
export async function getSellerDashboardLink(sellerId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Only seller can access their own dashboard
  if (user?.id !== sellerId) {
    throw new Error('Unauthorized');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', sellerId)
    .single();
  
  return stripe.accounts.createLoginLink(profile!.stripe_account_id);
}
```

### Connect Webhook Verification

Use separate webhook secret for Connect events:

```bash
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_connect_xxx
```

```tsx
// app/api/connect/webhook/route.ts
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_CONNECT_WEBHOOK_SECRET!
);
```

### Account Status Validation

```tsx
// Before creating destination charge, verify account is ready
async function validateSellerAccount(accountId: string): Promise<boolean> {
  const account = await stripe.accounts.retrieve(accountId);
  
  return Boolean(
    account.charges_enabled && 
    account.payouts_enabled &&
    !account.requirements?.currently_due?.length
  );
}
```

## Idempotency Keys

Prevent duplicate charges with idempotency:

```tsx
// ✅ Use unique idempotency key
await stripe.paymentIntents.create(
  {
    amount: 1000,
    currency: 'eur',
    customer: customerId,
  },
  {
    idempotencyKey: `order_${orderId}_payment`,
  }
);

// ✅ Database unique constraints
await supabase.from('orders').insert({
  stripe_payment_intent_id: paymentIntent.id,  // UNIQUE constraint
});
```

## Error Handling

```tsx
import Stripe from 'stripe';

try {
  const session = await stripe.checkout.sessions.create({...});
} catch (error) {
  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case 'StripeCardError':
        // User card declined
        return { error: 'card_declined' };
      case 'StripeRateLimitError':
        // Too many requests
        return { error: 'rate_limited' };
      case 'StripeInvalidRequestError':
        // Invalid parameters (bug)
        console.error('Invalid Stripe request:', error);
        return { error: 'internal_error' };
      case 'StripeAuthenticationError':
        // API key issue (critical)
        console.error('Stripe auth failed:', error);
        return { error: 'internal_error' };
      default:
        return { error: 'payment_failed' };
    }
  }
  throw error;
}
```

## Audit Logging

Log payment events for debugging:

```tsx
// In webhook handler
console.log('[Stripe Webhook]', {
  type: event.type,
  id: event.id,
  created: new Date(event.created * 1000).toISOString(),
  data: {
    // Log non-sensitive fields only
    session_id: session.id,
    amount: session.amount_total,
    status: session.status,
  },
});
```

## Testing Security

```bash
# Verify webhook signatures locally
stripe listen --forward-to localhost:3000/api/checkout/webhook --print-secret

# Test with invalid signature (should fail)
curl -X POST localhost:3000/api/checkout/webhook \
  -H "stripe-signature: invalid" \
  -d '{}'

# Test Connect account flows in test mode
# Use test data in Express onboarding
```

## Checklist

- [ ] `STRIPE_SECRET_KEY` never in client code
- [ ] All webhook endpoints verify signatures
- [ ] Rotation support for webhook secrets
- [ ] Idempotency keys on mutations
- [ ] Unique constraints on `stripe_*_id` columns
- [ ] Connect operations verify account ownership
- [ ] Error handling doesn't expose internals
- [ ] Audit logging for payment events
