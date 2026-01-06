# 🛒 Buying & Cart

> **Status**: 🟡 85% Complete
> **Priority**: P0

---

## ✅ Working Features

- [x] Add to cart (logged-in and guest users)
- [x] Cart persistence:
  - Guests: localStorage
  - Logged-in: Supabase sync
- [x] Cart merges on login (guest items added to account cart)
- [x] Stripe checkout integration
- [x] Order creation on payment success
- [x] Stock decrement on purchase
- [x] Prevents buying own products
- [x] Quantity adjustment in cart
- [x] Remove items from cart

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
- [ ] **Currency hardcoded to USD** - Must be EUR for EU market
  - File: `app/[locale]/(checkout)/_actions/checkout.ts`
  - Stripe `currency: 'usd'` → `currency: 'eur'`

### P1 - High Priority
- [ ] **Guest checkout flow** - Currently limited, consider full guest checkout
- [ ] **Cart empty state** - Add "Continue shopping" CTA
- [ ] **Out of stock handling** - Clear message if item becomes unavailable
- [ ] **Price change notification** - Alert if price changed since adding to cart

### P2 - Nice to Have
- [ ] Save for later feature
- [ ] Apply discount codes
- [ ] Shipping cost calculation before checkout
- [ ] Multiple shipping addresses

---

## 🧪 Test Cases

### Manual QA
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | Add item to cart (logged in) | Item added, count updates | ⬜ |
| 2 | Add item to cart (guest) | Item added to localStorage cart | ⬜ |
| 3 | Guest logs in with cart items | Cart merges, items preserved | ⬜ |
| 4 | Checkout with Stripe | Payment succeeds, order created | ⬜ |
| 5 | Try to buy own product | Prevented with error message | ⬜ |
| 6 | Buy item, stock decrements | Quantity reduced in listing | ⬜ |
| 7 | Remove item from cart | Item removed, totals update | ⬜ |
| 8 | Checkout on mobile | Full flow works | ⬜ |

### Automated (E2E)
- [e2e/full-flow.spec.ts](../../e2e/full-flow.spec.ts) - Complete buyer journey

---

## 📁 Key Files

```
lib/
└── cart-store.ts                  # Zustand cart state (265 lines)

app/[locale]/(main)/
├── cart/page.tsx                  # Cart page
└── product/[id]/                  # Product detail with add to cart

app/[locale]/(checkout)/
├── _actions/checkout.ts           # Stripe session creation
├── checkout/page.tsx              # Checkout flow
└── success/page.tsx               # Order confirmation
```

---

## 📝 Currency Fix Required

**Critical for launch** - Currently in `checkout.ts`:
```typescript
// WRONG - USD
const session = await stripe.checkout.sessions.create({
  line_items: [...],
  currency: 'usd',  // ← Change to 'eur'
})
```

Should be:
```typescript
// CORRECT - EUR for EU market
const session = await stripe.checkout.sessions.create({
  line_items: [...],
  currency: 'eur',
})
```

Also check:
- Product prices stored in correct currency
- Price display formatting uses EUR symbol (€)
- `lib/format-price.ts` handles EUR correctly

---

## 📝 Cart State Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Guest User    │     │  Logged-in User │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  localStorage   │────▶│    Supabase     │
│   (temp cart)   │merge│   (cart table)  │
└─────────────────┘     └─────────────────┘
```

---

## 🎯 Acceptance Criteria for Launch

- [ ] **EUR currency** in Stripe checkout
- [ ] Add to cart works (logged in & guest)
- [ ] Cart merges correctly on login
- [ ] Checkout completes successfully
- [ ] Order created with correct details
- [ ] Stock decremented properly
- [ ] E2E test passes: `pnpm test:e2e -- full-flow.spec.ts`
- [ ] Mobile checkout works
