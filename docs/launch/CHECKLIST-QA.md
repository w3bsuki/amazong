# Manual QA Checklist (15–45 minutes)

Run this on staging, then again on production right after go-live.

## 0) Setup

- Use a clean browser profile (no cookies).
- Test both locales: `/en` and `/bg`.
- Have at least:
  - one buyer account
  - one seller account
  - one business account (if in-scope)

## 1) Locale + routing

- Visit `/` and confirm you land in the intended locale.
- Navigate between locales and confirm URLs are correct.

## 2) Auth flows

- Sign up (personal + business intent if supported) → confirm email link redirects correctly.
- Login/logout works.
- Forgot password → reset password works.

## 3) Marketplace browse/search

- Home loads fast and without console errors.
- Categories page works.
- Search with filters works and URL params update.
- Product detail page loads and renders images.

## 4) Seller flow

- Become seller (onboarding) completes.
- Create listing:
  - upload images
  - set category + attributes
  - publish
- Edit listing works.

## 5) Messaging

- Start a conversation with a seller.
- Send message.
- Upload chat image.
- Report conversation (if exposed).
- On mobile viewport: verify scroll containment + avatars.

## 6) Cart/checkout/orders (only if in-scope)

- Add item to cart.
- Checkout succeeds (test mode is fine on staging).
- Order appears in buyer `/account/orders`.
- Seller can view incoming orders (`/sell/orders`).
- Seller status updates create the expected system messages.

## 7) Reviews/ratings

- Reviews section renders.
- Unauthenticated user is blocked from submitting review.
- Authenticated buyer can submit review; helpful vote increments.
- Delete own review works.

## 8) Business dashboard (only if in-scope)

- Non-business accounts are blocked from `/dashboard`.
- Business account without subscription is redirected to upgrade.
- Business account with subscription can access:
  - `/dashboard/products`
  - `/dashboard/orders`

## 9) Admin (if used)

- Non-admin cannot access `/admin`.
- Admin can load `/admin` and view stats pages.

## 10) Go/no-go criteria

No-go if:
- Auth links redirect incorrectly
- Checkout or webhooks fail (if in-scope)
- Orders/stock are inconsistent
- Supabase security advisors show unresolved warnings
- E2E smoke fails

