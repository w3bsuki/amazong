# checkout.md — Stripe Checkout Options

> Comprehensive checkout configuration for Treido.

## Checkout Session Configuration

### Full configuration example

```tsx
const session = await stripe.checkout.sessions.create({
  // Mode
  mode: 'payment',  // 'payment' | 'subscription' | 'setup'
  
  // Payment methods
  payment_method_types: ['card'],
  
  // Line items
  line_items: [
    {
      price_data: {
        currency: 'bgn',
        product_data: {
          name: 'Product Name',
          description: 'Product description',
          images: ['https://example.com/image.jpg'],
          metadata: {
            product_id: 'prod_123',
          },
        },
        unit_amount: 2999,  // 29.99 BGN in stotinki
      },
      quantity: 1,
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10,
      },
    },
  ],
  
  // Or use existing prices
  // line_items: [{ price: 'price_123', quantity: 1 }],
  
  // Customer
  customer: 'cus_123',  // Existing customer
  // OR
  customer_email: 'customer@example.com',  // New customer
  
  // Shipping
  shipping_address_collection: {
    allowed_countries: ['BG', 'RO', 'GR'],  // Bulgaria + neighbors
  },
  shipping_options: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 500,  // 5 BGN
          currency: 'bgn',
        },
        display_name: 'Standard Shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 3 },
          maximum: { unit: 'business_day', value: 5 },
        },
      },
    },
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 1500,  // 15 BGN
          currency: 'bgn',
        },
        display_name: 'Express Shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 1 },
          maximum: { unit: 'business_day', value: 2 },
        },
      },
    },
  ],
  
  // Discounts
  allow_promotion_codes: true,
  // OR
  discounts: [{ coupon: 'coupon_123' }],
  
  // Tax
  automatic_tax: { enabled: true },
  
  // URLs
  success_url: 'https://treido.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://treido.com/cart',
  
  // Metadata (retrieve later via webhook)
  metadata: {
    user_id: 'user_123',
    cart_id: 'cart_456',
  },
  
  // Locale
  locale: 'bg',  // Bulgarian
  
  // Expiration
  expires_at: Math.floor(Date.now() / 1000) + 3600,  // 1 hour
  
  // Custom text
  custom_text: {
    submit: {
      message: 'Your order will be processed within 24 hours',
    },
  },
  
  // Payment intent data (for Connect)
  payment_intent_data: {
    application_fee_amount: 150,  // 1.50 BGN fee
    transfer_data: {
      destination: 'acct_seller123',
    },
    metadata: {
      order_id: 'order_789',
    },
  },
});
```

## Treido-Specific Patterns

### Standard checkout

```tsx
export async function createStandardCheckout(
  cartItems: CartItem[],
  userId: string,
  userEmail: string
) {
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'bgn',
      product_data: {
        name: item.name,
        images: item.images,
        metadata: { product_id: item.id },
      },
      unit_amount: toStotinki(item.price),
    },
    quantity: item.quantity,
  }));
  
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    customer_email: userEmail,
    shipping_address_collection: {
      allowed_countries: ['BG'],
    },
    shipping_options: SHIPPING_OPTIONS,
    allow_promotion_codes: true,
    locale: 'bg',
    success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/cart`,
    metadata: { user_id: userId },
    expires_at: Math.floor(Date.now() / 1000) + 7200,  // 2 hours
  });
}
```

### Marketplace checkout (Connect)

```tsx
export async function createMarketplaceCheckout(
  items: MarketplaceItem[],
  userId: string
) {
  // Group items by seller
  const itemsBySeller = groupBy(items, 'sellerId');
  
  // Create checkout with transfers
  // Note: Stripe Checkout supports single destination per session
  // For multi-seller, create separate sessions or use PaymentIntents
  
  const sellerItems = itemsBySeller[Object.keys(itemsBySeller)[0]];
  const seller = await getSellerProfile(sellerItems[0].sellerId);
  
  const total = sellerItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const platformFee = Math.round(total * 0.05);  // 5% platform fee
  
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: sellerItems.map(item => ({
      price_data: {
        currency: 'bgn',
        product_data: { name: item.name },
        unit_amount: toStotinki(item.price),
      },
      quantity: item.quantity,
    })),
    payment_intent_data: {
      application_fee_amount: toStotinki(platformFee),
      transfer_data: {
        destination: seller.stripeAccountId,
      },
    },
    // ... other options
  });
}
```

## Success Page

### Retrieve session details

```tsx
// app/checkout/success/page.tsx
import { stripe } from '@/lib/stripe';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { session_id } = await searchParams;
  
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent', 'customer'],
  });
  
  return (
    <div>
      <h1>Order Confirmed!</h1>
      <p>Order ID: {session.metadata?.order_id}</p>
      <p>Total: {formatBGN(session.amount_total! / 100)}</p>
      
      <h2>Items</h2>
      {session.line_items?.data.map(item => (
        <div key={item.id}>
          {item.description} × {item.quantity}
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

```tsx
try {
  const session = await stripe.checkout.sessions.create({ ... });
  redirect(session.url!);
} catch (error) {
  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case 'StripeCardError':
        return { error: 'Card was declined' };
      case 'StripeRateLimitError':
        return { error: 'Too many requests, try again' };
      case 'StripeInvalidRequestError':
        return { error: 'Invalid request' };
      default:
        return { error: 'Payment error' };
    }
  }
  throw error;
}
```

## Testing

### Test cards

| Number | Scenario |
|--------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 3220 | 3D Secure required |
| 4000 0025 0000 3155 | Requires authentication |

### Test mode

```bash
# Use test keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
