# subscriptions.md — Subscription Management

> Subscription lifecycle, billing portal, and plan management for Treido.

## Overview

Treido subscriptions use **Stripe Checkout** for creation and **Billing Portal** for management.

| Component | Purpose |
|-----------|---------|
| Checkout Sessions | Create new subscriptions |
| Customer Portal | Self-service management |
| Webhooks | Sync state changes |

## Server Actions

Location: [app/actions/subscriptions.ts](../../../app/actions/subscriptions.ts)

### Create Subscription Checkout

```tsx
'use server';
export async function createSubscriptionCheckoutSession(
  planId: string,
  billingPeriod: 'monthly' | 'yearly'
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/auth/login');
  
  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomer(user.id, user.email!);
  
  // Get price ID from plan
  const priceId = await getPriceIdForPlan(planId, billingPeriod);
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${BASE_URL}/settings/subscription?success=true`,
    cancel_url: `${BASE_URL}/pricing`,
    metadata: {
      profile_id: user.id,
      plan_id: planId,
      billing_period: billingPeriod,
    },
    subscription_data: {
      metadata: {
        profile_id: user.id,
        plan_id: planId,
      },
    },
  });
  
  redirect(session.url!);
}
```

### Billing Portal Session

```tsx
'use server';
export async function createBillingPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user!.id)
    .single();
  
  if (!profile?.stripe_customer_id) {
    throw new Error('No Stripe customer');
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${BASE_URL}/settings/subscription`,
  });
  
  redirect(session.url);
}
```

### Cancel Subscription

```tsx
'use server';
export async function cancelSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('profile_id', user!.id)
    .eq('status', 'active')
    .single();
  
  if (!sub?.stripe_subscription_id) {
    throw new Error('No active subscription');
  }
  
  // Cancel at period end (not immediately)
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true,
  });
  
  // Webhook will update database status
  revalidatePath('/settings/subscription');
}
```

### Reactivate Subscription

```tsx
'use server';
export async function reactivateSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('profile_id', user!.id)
    .single();
  
  // Clear cancel flag
  await stripe.subscriptions.update(sub!.stripe_subscription_id, {
    cancel_at_period_end: false,
  });
  
  revalidatePath('/settings/subscription');
}
```

## Webhook Events

Location: [app/api/subscriptions/webhook/route.ts](../../../app/api/subscriptions/webhook/route.ts)

### Event Flow

```
checkout.session.completed (mode: subscription)
    → Create subscription record
    → Update profile.tier

customer.subscription.updated
    → Sync status, cancel_at_period_end
    → Update profile.tier if plan changed

customer.subscription.deleted
    → Mark subscription inactive
    → Downgrade profile to free tier

invoice.paid
    → Extend subscription period
    → Log payment

invoice.payment_failed
    → Mark subscription as past_due
    → Notify user (optional)
```

### Handler Example

```tsx
case 'customer.subscription.updated':
  const subscription = event.data.object as Stripe.Subscription;
  
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq('stripe_subscription_id', subscription.id);
  break;

case 'customer.subscription.deleted':
  const deletedSub = event.data.object as Stripe.Subscription;
  const profileId = deletedSub.metadata?.profile_id;
  
  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', deletedSub.id);
  
  // Downgrade to free tier
  if (profileId) {
    await supabase
      .from('profiles')
      .update({ tier: 'free' })
      .eq('id', profileId);
  }
  break;
```

## Database Schema

```sql
-- subscriptions table
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) not null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  plan_id text not null,
  status text not null, -- 'active', 'canceled', 'past_due', 'trialing'
  cancel_at_period_end boolean default false,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for lookups
create index idx_subscriptions_profile on subscriptions(profile_id);
create index idx_subscriptions_stripe_id on subscriptions(stripe_subscription_id);
```

## Plan Tiers

| Tier | Features | Price ID Env Var |
|------|----------|------------------|
| `free` | Basic access | — |
| `pro` | Enhanced features | `STRIPE_PRICE_PRO_MONTHLY` / `_YEARLY` |
| `business` | Full platform | `STRIPE_PRICE_BUSINESS_MONTHLY` / `_YEARLY` |

### Price ID Resolution

```tsx
async function getPriceIdForPlan(
  planId: string,
  period: 'monthly' | 'yearly'
): Promise<string> {
  // First check env vars
  const envKey = `STRIPE_PRICE_${planId.toUpperCase()}_${period.toUpperCase()}`;
  const envPrice = process.env[envKey];
  if (envPrice) return envPrice;
  
  // Fall back to database
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('stripe_price_id_monthly, stripe_price_id_yearly')
    .eq('id', planId)
    .single();
  
  return period === 'yearly' 
    ? plan!.stripe_price_id_yearly 
    : plan!.stripe_price_id_monthly;
}
```

## Billing Portal Configuration

Configure in Stripe Dashboard → Settings → Billing → Customer Portal:

- **Subscriptions:** Allow cancel, upgrade, downgrade
- **Payment methods:** Allow add/remove
- **Invoices:** Show invoice history
- **Branding:** Match Treido colors

## Testing

```bash
# Create test subscription
stripe trigger checkout.session.completed --add checkout_session:mode=subscription

# Update subscription
stripe trigger customer.subscription.updated

# Cancel subscription
stripe trigger customer.subscription.deleted

# Payment failure
stripe trigger invoice.payment_failed
```

## Idempotency

Handle duplicate webhooks:

```tsx
// Check if subscription already exists
const { data: existing } = await supabase
  .from('subscriptions')
  .select('id')
  .eq('stripe_subscription_id', subscription.id)
  .single();

if (existing) {
  console.log(`Subscription ${subscription.id} already exists`);
  return; // Already processed
}
```
