# 06 — TypeScript: Current State

---

## Configuration

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true,
  "exactOptionalPropertyTypes": true,
  "module": "esnext",
  "moduleResolution": "bundler",
  "allowJs": true,  // ← should be false (no JS in source)
  "paths": { "@/*": ["./*"] }
}
```

Strict mode is on — good. But `allowJs: true` is unnecessary for a TypeScript-first repo.

---

## Unsafe Casts: 46 Occurrences

### By Category

| Category | Count | Files |
|----------|-------|-------|
| Test files | 12 | Mocking Stripe/Next/Supabase types |
| Supabase query typing | 13 | `.select()` returns don't match app types |
| Order page typing | 5 | Complex joined query results |
| Window type augmentation | 4 | Auth, wishlist, cart, geo providers |
| Stripe typing | 3 | Webhook event casting |
| zodResolver | 2 | React Hook Form type mismatch |
| Misc | 7 | Various one-off casts |

### Top Offenders (Non-Test)
- `sell-persistence.ts` — 3 casts (Supabase insert/update results)
- `subscriptions/webhook/route.ts` — 2 casts (Stripe event types)
- `cart-helpers.ts` — 2 casts (cart item transformation)
- `orders/page.tsx` — 2 casts (order list query)
- `orders/[id]/page.tsx` — 2 casts (order detail query)
- `badges/feature/route.ts` — 2 casts (badge data)

---

## Return Type Inconsistency

### Envelope Pattern (11 actions)
```ts
// lib/api/envelope.ts (actual contract)
type SuccessEnvelope<T> = { success: true } & T;
type ErrorEnvelope<T>   = { success: false } & T;
type Envelope<TSuccess, TError> = SuccessEnvelope<TSuccess> | ErrorEnvelope<TError>;
```

Used by: `payments.ts`, `subscriptions-mutations.ts`, `subscriptions-reads.ts`, `blocked-users.ts`, `boosts-checkout.ts`, `boosts-shared.ts`, `buyer-feedback.ts`, `orders-reads-*` (5 files)

### Ad-hoc Pattern (29 actions)
```ts
// Various shapes:
{ success: true } | { success: false; errorCode: string }
{ error: string } | { data: T }
// Some return void, throw, or use formState
```

Used by: `profile-mutations.ts`, `products-create.ts`, `products-update.ts`, `onboarding.ts`, `orders-status.ts`, `reviews.ts`, `seller-feedback.ts`, and 22 more.

**73% of actions don't use Envelope.** This forces bespoke UI error handling per feature.

---

## Zod Usage

Zod 4.x is used for boundary validation:
- Form schemas in `lib/validation/`
- Webhook payload verification in API routes
- Server action input parsing in some (but not all) actions

### Gap
Not all server actions validate inputs with Zod before processing. Some trust the form data shape.

---

## Pain Points

1. **`allowJs: true`** — unnecessary, should be `false`
2. **46 unsafe casts** — indicates typing gaps at query boundaries
3. **Two return type systems** — Envelope (11) vs ad-hoc (29) creates inconsistency
4. **Incomplete Zod validation** — not all action inputs validated at boundary
5. **Window type extensions** — augmenting `window` for cart/wishlist/auth state
