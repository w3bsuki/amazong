# Requirements (Launch SSOT)

This is the “end goal” checklist for production readiness. Only check `[x]` when the feature is verified and gated.

## Definition of done (for a checkbox)

- Works for both `/en` and `/bg` where applicable (i18n-safe).
- No secrets/PII in logs.
- No gradients; no arbitrary Tailwind values unless unavoidable.
- Typecheck passes (`pnpm -s exec tsc -p tsconfig.json --noEmit`).
- E2E smoke passes when the feature affects flows (`REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`).

---

## Authentication & onboarding

- [ ] Signup (email/password)
- [ ] Sign-in
- [ ] Sign-out
- [ ] Email confirmation / callback flow
- [ ] Password reset
- [ ] Session persistence (refresh + cross-tab)
- [ ] Post-signup onboarding (personal vs business intent)
- [ ] Protected route gating (Sell/Chat/Wishlist/etc)

## Profiles & account

- [ ] Profile page (public)
- [ ] Profile edit (name, avatar, username, bio)
- [ ] Account settings (`/account`)
- [ ] Address book (if in scope)
- [ ] Notifications (read/unread, email vs in-app if in scope)

## Marketplace discovery

- [ ] Home feed
- [ ] Category pages
- [ ] Search (query + filters + sort)
- [ ] Saved searches (if in scope)

## Product pages

- [ ] Product detail page (PDP) core info
- [ ] Gallery (images)
- [ ] Variants (size/color) (if in scope)
- [ ] Related items / recommendations (optional)
- [ ] Share / copy link

## Wishlist / likes

- [ ] Wishlist add/remove
- [ ] Wishlist page
- [ ] Wishlist privacy/sharing (optional)

## Cart

- [ ] Add to cart
- [ ] Update quantities / remove
- [ ] Cart persistence
- [ ] Cart UI matches checkout line items

## Checkout & payments (Stripe)

- [ ] Checkout page renders correctly
- [ ] Stripe payment intent/session creation
- [ ] Success/cancel handling
- [ ] Webhooks verified + idempotent
- [ ] Order created reliably from webhook

## Orders (buyer)

- [ ] Orders list
- [ ] Order detail
- [ ] Buyer actions (cancel/report/confirm received) (as scoped)
- [ ] Order status lifecycle visible and consistent

## Orders (seller)

- [ ] Seller orders list
- [ ] Seller order detail
- [ ] Seller actions (confirm/sent/refund) (as scoped)
- [ ] Inventory/stock updates (if applicable)

## Selling / listings

- [ ] Sell entrypoint (gated)
- [ ] Listing creation (draft → publish)
- [ ] Image upload
- [ ] Edit listing
- [ ] Delete/unlist listing

## Stripe Connect (seller payouts)

- [ ] Connect onboarding
- [ ] Payout eligibility gating
- [ ] Seller payout status visible

## Messaging (buyer ↔ seller)

- [ ] Start conversation from listing
- [ ] Chat list + chat thread
- [ ] Unread indicators
- [ ] Attachments (if in scope)
- [ ] Conversation/report actions

## Reviews / ratings / feedback

- [ ] Leave product review
- [ ] Seller feedback
- [ ] Display reviews on PDP/profile
- [ ] Prevent duplicate/invalid reviews (rules enforced)

## Trust & safety

- [ ] Report product
- [ ] Report conversation/order issue (buyer protection entry point)
- [ ] Block user
- [ ] Admin/moderation surfaces (minimum viable)

## Business dashboard (B2B)

- [ ] Dashboard access gating (tier/plan)
- [ ] Business profile setup
- [ ] Business listing + orders management
- [ ] Subscription management (if in scope)

## Internationalization (next-intl)

- [ ] No hardcoded UI strings (en/bg parity)
- [ ] Locale routing is consistent
- [ ] Locale-safe links/navigation everywhere

## Accessibility (baseline)

- [ ] Keyboard navigation for core flows
- [ ] Focus management for dialogs/drawers
- [ ] Form labels/errors are screen-reader friendly

## Production readiness

- [ ] Environment variables documented
- [ ] Vercel build passes
- [ ] Error reporting strategy (logs without secrets)
- [ ] Legal pages exist (privacy/terms/cookies) (if in scope)

