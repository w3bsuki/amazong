# Critical Flows (Top 5)

These are the launch-blocker flows. Each has:
- automated coverage (where it exists in `e2e/*.spec.ts`)
- manual QA steps (what to actually click)

## 1) Signup + Login

Automated:
- `e2e/auth.spec.ts`
- `e2e/smoke.spec.ts` (may include auth sanity depending on suite)

Manual QA:
- Create account (both locales if possible)
- Validation errors (empty/invalid email/weak password)
- Successful sign-in persists after refresh
- Sign out returns UI to logged-out state

## 2) Buy (cart → checkout)

Automated:
- `e2e/full-flow.spec.ts`
- `e2e/orders.spec.ts`

Manual QA:
- Add to cart from product page
- Cart quantity changes update totals
- Checkout navigation works (guest + logged-in)
- Stripe redirect / success / failure states

## 3) Sell (onboarding → listing)

Automated:
- `e2e/full-flow.spec.ts` (if it includes sell)
- `e2e/smoke.spec.ts` (if it includes basic sell page loads)

Manual QA:
- Seller onboarding completes
- Create listing with:
  - category selection
  - attributes load
  - photo upload works
  - pricing validates
  - publish succeeds

## 4) Profile / Account

Automated:
- `e2e/profile.spec.ts`
- `e2e/orders.spec.ts` (order history appears)

Manual QA:
- Account dashboard loads
- Orders list loads (and order detail page)
- Wishlist loads
- Profile edit saves

## 5) Browse + Search (homepage/category/product)

Automated:
- `e2e/smoke.spec.ts`
- `e2e/reviews.spec.ts` (product page + reviews coverage)

Manual QA:
- Homepage sections render without layout shifts
- Category filters/sort/pagination work
- Product page gallery works (mouse + touch)
- Search works from desktop header and mobile UI

---

## A11y baseline (must-pass)

Automated:
- `e2e/accessibility.spec.ts` (runs under `accessibility` project)

Manual QA (fast checks):
- Keyboard tab through header/search/cart
- Focus ring visible
- Modals trap focus + close via Esc
- Form fields have labels and errors are announced
