# connect.md — Stripe Connect for Marketplace

> Marketplace payments with seller payouts for Treido.

## Connect Overview

Treido uses **Express** accounts for sellers:
- Stripe handles onboarding, identity verification, tax forms
- Sellers get Stripe Dashboard access
- Platform takes fee, rest goes to seller

## Account Types

| Type | Use Case | Complexity |
|------|----------|------------|
| Express | Most marketplaces | Low |
| Standard | Standalone sellers | Medium |
| Custom | Full white-label | High |

**Treido uses Express** — best balance of control and simplicity.

## Seller Onboarding

### Create Connect Account

```tsx
'use server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createSellerAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');
  
  // Check if already has account
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', user.id)
    .single();
  
  let accountId = profile?.stripe_account_id;
  
  if (!accountId) {
    // Create new Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'BG',
      email: user.email!,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly',
            weekly_anchor: 'monday',
          },
        },
      },
      metadata: {
        user_id: user.id,
      },
    });
    
    accountId = account.id;
    
    // Save account ID
    await supabase
      .from('profiles')
      .update({
        stripe_account_id: accountId,
        seller_status: 'onboarding',
      })
      .eq('id', user.id);
  }
  
  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboarding/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboarding/complete`,
    type: 'account_onboarding',
  });
  
  redirect(accountLink.url);
}
```

### Handle Onboarding Return

```tsx
// app/seller/onboarding/complete/page.tsx
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function OnboardingCompletePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', user!.id)
    .single();
  
  // Check account status
  const account = await stripe.accounts.retrieve(profile!.stripe_account_id);
  
  if (account.charges_enabled && account.payouts_enabled) {
    // Fully onboarded
    await supabase
      .from('profiles')
      .update({
        seller_status: 'active',
        role: 'seller',
      })
      .eq('id', user!.id);
    
    redirect('/seller/dashboard');
  }
  
  // Needs more info
  if (account.requirements?.currently_due?.length) {
    redirect('/seller/onboarding/incomplete');
  }
  
  // Pending verification
  await supabase
    .from('profiles')
    .update({ seller_status: 'pending' })
    .eq('id', user!.id);
  
  redirect('/seller/onboarding/pending');
}
```

## Payment Split

### Checkout with Platform Fee

```tsx
export async function createMarketplaceCheckout(
  items: CartItem[],
  sellerId: string
) {
  // Get seller's Stripe account
  const supabase = await createClient();
  const { data: seller } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', sellerId)
    .single();
  
  if (!seller?.stripe_account_id) {
    throw new Error('Seller not set up for payments');
  }
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = Math.round(total * 0.10);  // 10% platform fee
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'bgn',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    payment_intent_data: {
      application_fee_amount: platformFee * 100,  // In stotinki
      transfer_data: {
        destination: seller.stripe_account_id,
      },
    },
    success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/cart`,
  });
  
  return session;
}
```

### Direct Charge vs Destination Charge

```tsx
// DESTINATION CHARGE (Treido pattern)
// Customer pays platform, platform transfers to seller
payment_intent_data: {
  application_fee_amount: 1000,  // Platform keeps 10 BGN
  transfer_data: {
    destination: 'acct_seller',  // Seller receives remainder
  },
}

// DIRECT CHARGE (alternative)
// Customer pays seller directly, seller pays platform fee
// Requires on_behalf_of and transfer_data
```

## Multi-Seller Orders

Stripe Checkout supports only one destination per session. For multi-seller carts:

### Option 1: Separate Sessions

```tsx
async function createMultiSellerCheckout(cart: Cart) {
  const itemsBySeller = groupBy(cart.items, 'sellerId');
  const sessions = [];
  
  for (const [sellerId, items] of Object.entries(itemsBySeller)) {
    const session = await createMarketplaceCheckout(items, sellerId);
    sessions.push(session);
  }
  
  return sessions;  // User completes multiple checkouts
}
```

### Option 2: PaymentIntents with Transfers

```tsx
async function createSplitPayment(cart: Cart) {
  const itemsBySeller = groupBy(cart.items, 'sellerId');
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
  // Create single PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'bgn',
    metadata: {
      cart_id: cart.id,
      seller_ids: Object.keys(itemsBySeller).join(','),
    },
  });
  
  // After payment succeeds (in webhook), create transfers
  for (const [sellerId, items] of Object.entries(itemsBySeller)) {
    const sellerTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const sellerAmount = Math.round(sellerTotal * 0.90 * 100);  // 90% to seller
    
    const seller = await getSellerProfile(sellerId);
    
    await stripe.transfers.create({
      amount: sellerAmount,
      currency: 'bgn',
      destination: seller.stripeAccountId,
      transfer_group: paymentIntent.id,
    });
  }
}
```

## Dashboard Access

```tsx
// Generate login link for seller to access Express Dashboard
export async function createDashboardLink(sellerId: string) {
  const supabase = await createClient();
  const { data: seller } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', sellerId)
    .single();
  
  const loginLink = await stripe.accounts.createLoginLink(
    seller!.stripe_account_id
  );
  
  return loginLink.url;
}
```

## Webhooks for Connect

```tsx
// Handle Connect account events
case 'account.updated':
  await handleAccountUpdated(event.data.object as Stripe.Account);
  break;

async function handleAccountUpdated(account: Stripe.Account) {
  const userId = account.metadata?.user_id;
  if (!userId) return;
  
  const supabase = createServiceClient();
  
  let status: string;
  if (account.charges_enabled && account.payouts_enabled) {
    status = 'active';
  } else if (account.requirements?.currently_due?.length) {
    status = 'incomplete';
  } else {
    status = 'pending';
  }
  
  await supabase
    .from('profiles')
    .update({ seller_status: status })
    .eq('id', userId);
}
```

## Payouts

Payouts happen automatically based on schedule. To check:

```tsx
// Get seller's balance
async function getSellerBalance(accountId: string) {
  const balance = await stripe.balance.retrieve({
    stripeAccount: accountId,
  });
  
  return {
    available: balance.available[0]?.amount ?? 0,
    pending: balance.pending[0]?.amount ?? 0,
  };
}

// List recent payouts
async function getSellerPayouts(accountId: string) {
  const payouts = await stripe.payouts.list(
    { limit: 10 },
    { stripeAccount: accountId }
  );
  
  return payouts.data;
}
```

## Testing Connect

```bash
# Create test account
stripe accounts create --type=express --country=BG

# Trigger account events
stripe trigger account.updated

# Test with Express Dashboard
# Use test mode — onboarding uses test data
```
