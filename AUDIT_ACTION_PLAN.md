# AMZN Audit - Action Plan

## Quick Start Fixes

### 🔴 Critical Issue #1: Orders Not Being Created

**Problem:** Stripe payment succeeds but no order is created in database.

**Fix Steps:**

1. **Create/Update Stripe Webhook Handler**
   
   ```typescript
   // app/api/checkout/webhook/route.ts
   import { NextResponse } from 'next/server';
   import Stripe from 'stripe';
   import { createClient } from '@supabase/supabase-js';

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );

   export async function POST(req: Request) {
     const body = await req.text();
     const sig = req.headers.get('stripe-signature')!;
     
     let event: Stripe.Event;
     
     try {
       event = stripe.webhooks.constructEvent(
         body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET!
       );
     } catch (err) {
       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
     }

     if (event.type === 'checkout.session.completed') {
       const session = event.data.object as Stripe.Checkout.Session;
       
       // Create order in database
       const { data: order, error } = await supabase
         .from('orders')
         .insert({
           user_id: session.client_reference_id,
           stripe_session_id: session.id,
           status: 'paid',
           total: session.amount_total! / 100,
           currency: session.currency,
         })
         .select()
         .single();
         
       if (error) {
         console.error('Order creation error:', error);
       }
     }

     return NextResponse.json({ received: true });
   }
   ```

2. **Set up Stripe CLI for local testing**
   ```bash
   # Install Stripe CLI
   stripe login
   
   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/checkout/webhook
   ```

3. **Add webhook endpoint to Stripe Dashboard**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/checkout/webhook`
   - Select event: `checkout.session.completed`

---

### 🔴 Critical Issue #2: Hydration Errors

**Problem:** Radix UI components generate different IDs on server vs client.

**Fix Steps:**

1. **Wrap problematic components with dynamic import**
   
   ```typescript
   // components/sidebar-menu.tsx
   'use client';
   
   import dynamic from 'next/dynamic';
   
   const Sheet = dynamic(
     () => import('@/components/ui/sheet').then(mod => mod.Sheet),
     { ssr: false }
   );
   ```

2. **Or use useId() for stable IDs**
   
   ```typescript
   import { useId } from 'react';
   
   function MyComponent() {
     const id = useId();
     return <Accordion id={id}>...</Accordion>;
   }
   ```

---

### 🟡 Issue #3: Add Favicon

**Fix:**
```bash
# Add favicon to public folder
# public/favicon.ico (32x32 or 16x16 .ico file)

# Or configure in app/layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: '/icon.png',
  },
};
```

---

### 🟡 Issue #4: Fix Brand Icons

**Current broken icons:**
- `canon` → Try `canoninc` 
- `xbox` → Verify spelling
- `nintendo` → Try `nintendo` or `nintendoswitch`

**Quick fix - use fallback images:**
```tsx
<img 
  src={`https://cdn.simpleicons.org/${brandSlug}/${color}`}
  onError={(e) => {
    e.currentTarget.src = '/images/brand-placeholder.png';
  }}
  alt={brandName}
/>
```

---

### 🟡 Issue #5: About Page Hero Contrast

**Location:** `app/[locale]/about/page.tsx` (or similar)

**Fix:**
```css
/* Add text shadow */
.hero-title {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

/* Or add semi-transparent overlay */
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.3)
  );
}
```

---

## 🆕 NEW ISSUES FOUND (Playwright Live Testing - Nov 29, 2025)

### 🔴 Critical Issue #6: Cart Hydration Mismatch

**Problem:** The cart button's `aria-label` differs between server and client render.

**Error Location:** `components/mobile-cart-dropdown.tsx`

**Full Error:**
```
Error: Hydration failed because the server rendered text didn't match the client.
  <button aria-label="Cart - 1 item">  // Client
  <button aria-label="Cart - 0 items"> // Server
```

**Root Cause:** Cart count is `0` on server render but updates to actual count on client after hydration.

**Fix Steps:**

1. **Option A: Use suppressHydrationWarning for dynamic cart count:**
   ```tsx
   // components/mobile-cart-dropdown.tsx
   <button
     aria-label={`Cart - ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
     suppressHydrationWarning
   >
   ```

2. **Option B: Use dynamic import with ssr: false (recommended):**
   ```tsx
   // components/site-header.tsx or parent component
   import dynamic from 'next/dynamic';
   
   const MobileCartDropdown = dynamic(
     () => import('./mobile-cart-dropdown'),
     { 
       ssr: false,
       loading: () => (
         <button className="..." aria-label="Cart">
           <ShoppingCartIcon />
           <span>0</span>
         </button>
       )
     }
   );
   ```

3. **Option C: Move cart count to client-only state:**
   ```tsx
   'use client';
   import { useState, useEffect } from 'react';
   
   function CartButton() {
     const [mounted, setMounted] = useState(false);
     const { items } = useCart();
     
     useEffect(() => {
       setMounted(true);
     }, []);
     
     // Always show 0 during SSR
     const displayCount = mounted ? items.length : 0;
     
     return (
       <button aria-label={`Cart - ${displayCount} items`}>
         ...
       </button>
     );
   }
   ```

---

### 🟡 Issue #7: LCP Image Warning

**Problem:** Placeholder image detected as Largest Contentful Paint.

**Warning:**
```
Image with src "/placeholder.svg" was detected as the Largest Contentful Paint (LCP).
```

**Fix:**
```tsx
// components/product-card.tsx or cart item component
<Image 
  src={product.image || '/placeholder.svg'}
  alt={product.name}
  priority={isAboveFold} // true for first 4 visible products
  loading="eager"
  {...dimensions}
/>
```

---

## Verification Checklist

After fixes, verify:

- [ ] Complete a test purchase with Stripe test card `4242424242424242`
- [ ] Check `orders` table in Supabase - new row should appear
- [ ] No hydration errors in browser console
- [ ] Favicon loads (no 404)
- [ ] All brand icons display (no 404)
- [ ] About page hero text is readable

### ✅ Playwright Verified (Nov 29, 2025)

- [x] Homepage loads with all sections ✅
- [x] Search returns results ✅ (3 headphones found)
- [x] Add to cart works ✅
- [x] Cart page displays items ✅
- [x] Account page accessible ✅
- [x] Mobile responsive ✅ (375x812)

### ❌ Still Failing

- [ ] Favicon 404 - NOT FIXED
- [ ] SimpleIcons 404 x3 - NOT FIXED (canon, xbox, nintendo)
- [ ] Cart hydration mismatch - NOT FIXED
- [ ] Mobile nav hydration - NOT FIXED

---

## Commands to Run

```bash
# Start dev server
pnpm dev

# Start Stripe webhook listener (in separate terminal)
stripe listen --forward-to localhost:3000/api/checkout/webhook

# Check for TypeScript errors
pnpm type-check

# Run linting
pnpm lint
```

---

## Testing URLs

| Page | URL | Expected |
|------|-----|----------|
| Homepage | http://localhost:3000/en | Products, categories visible |
| Search | http://localhost:3000/en/search?q=headphones | Results display |
| Product | http://localhost:3000/en/product/[id] | Details, add to cart |
| Cart | http://localhost:3000/en/cart | Items, checkout button |
| Account | http://localhost:3000/en/account | User dashboard |
| Orders | http://localhost:3000/en/account/orders | Order history |
| Sell | http://localhost:3000/en/sell | Product listing form |

---

## Quick Fix Priority Order

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 🔴 P0 | Stripe webhook (orders not created) | Medium | Critical |
| 🔴 P0 | Cart hydration mismatch | Low | High (UX) |
| 🟡 P1 | Favicon missing | Very Low | Low |
| 🟡 P1 | Brand icons 404 | Low | Low |
| 🟡 P1 | Mobile nav hydration | Low | Medium |
| 🟢 P2 | About page contrast | Low | Low |
| 🟢 P2 | LCP warning | Low | Performance |

---

## Screenshot Evidence

Playwright screenshots saved to `j:\amazong\.playwright-mcp\`:
- `homepage-audit.png` - Main homepage verification
- `about-page-audit.png` - About page with contrast issues
- `search-page-audit.png` - Search results for "headphones"
- `cart-page-audit.png` - Cart with items
- `account-page-audit.png` - Account dashboard
- `mobile-homepage-audit.png` - Mobile viewport (375x812)

---

**Last Updated:** November 29, 2025  
**Verified By:** Playwright MCP Browser Automation
