# Production Launch Checklist

> Single source of truth for launch readiness. Organized by user journey.
> Status: ⬜ not started · 🔄 in progress · ✅ pass · ❌ fail (needs fix)
> Priority: P0 = must launch · P1 = should launch · P2 = can soft-launch without

---

## P0 — Must Work

### 1. Infrastructure & Gates ✅
- [x] `pnpm -s typecheck` — zero errors
- [x] `pnpm -s lint` — zero warnings
- [x] `pnpm -s styles:gate` — no palette/hex/gradient violations
- [x] `pnpm -s test:unit` — all pass
- [x] `pnpm -s build` — production build succeeds
- [x] No `console.log` / `console.error` in production code (intentional logging excluded)

**Scope:** Project-wide gates. No file scoping — Codex runs gates and fixes what fails.

### 2. Auth ✅
- [x] Sign up (email) — form validation, success, redirect
- [x] Sign in — form validation, success, redirect to previous page or home
- [x] Sign out — clears session, redirects to home
- [x] Forgot password — form, email sent confirmation
- [x] Reset password — form, success, redirect to login
- [x] Email confirmation — callback handles token, shows success/error
- [x] Session persistence — refresh page stays logged in
- [x] Auth guards — protected routes redirect to login when unauthenticated
- [x] Auth error page — handles auth callback errors gracefully
- [x] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(auth)/`, `app/[locale]/(auth)/_actions/`, `app/[locale]/(auth)/_components/`, `components/auth/`, `lib/auth/`, `app/api/auth/`, `app/actions/` (auth-related)

### 3. Selling 🔄
- [ ] Sell form loads — all fields render, category/subcategory selection works
- [ ] Image upload — select, preview, remove, reorder, multiple images
- [ ] Form validation — required fields, price format, helpful error messages
- [ ] Listing creation — submits successfully, product appears in seller's listings
- [ ] Edit listing — loads existing data, saves changes
- [ ] Delete listing — confirmation, removes product
- [ ] Listing management page — shows all seller's products with status
- [x] Sell form accessible to authenticated users only
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(sell)/`, `app/[locale]/(sell)/_actions/`, `app/[locale]/(sell)/_components/`, `app/[locale]/(sell)/_lib/`, `app/[locale]/(account)/account/selling/`, `app/actions/products-*.ts`, `lib/sell/`, `app/api/upload-image/`

### 4. Product Display (PDP) ✅
- [x] PDP loads — title, description, price, images, seller info
- [ ] Image gallery — swipe on mobile, click on desktop, zoom
- [x] Seller info section — name, avatar, rating, link to profile
- [x] Price display — correct currency format, original price if discounted
- [ ] Buy / Add to Cart button — works, adds to cart
- [x] Share functionality — works or hidden if not implemented
- [x] Report — button exists, flow works or is stubbed gracefully
- [x] Condition, location, shipping info displayed
- [x] Category breadcrumb / badge
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/[username]/[productSlug]/`, `app/[locale]/[username]/[productSlug]/_components/`, `components/shared/product/`, `lib/view-models/`

### 5. Search & Browse ✅
- [x] Homepage loads — featured products, categories, deals
- [x] Category page — products listed, filters available
- [x] Search — input, results page, relevant results returned
- [x] Filters — price range, condition, location, rating work
- [x] Sort — relevance, price low/high, newest
- [x] Pagination or infinite scroll works
- [x] Empty states — no results message with suggestions
- [x] Category navigation (mobile rail / desktop sidebar)
- [x] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(main)/page.tsx`, `app/[locale]/(main)/search/`, `app/[locale]/(main)/categories/`, `app/[locale]/(main)/_components/`, `app/[locale]/(main)/_lib/`, `components/shared/search/`, `components/shared/filters/`, `components/mobile/category-nav/`, `lib/filters/`, `hooks/use-product-search.ts`

### 6. Checkout & Payments 🔄
- [ ] Checkout page loads — order summary, payment form
- [ ] Stripe payment — card entry, processing, success
- [ ] Order creation — order record created in DB after payment
- [ ] Success page — confirmation with order details
- [x] Error handling — payment failure shows helpful message
- [x] Webhook processing — `checkout.session.completed` creates order (idempotent)
- [x] Redirect to login if unauthenticated
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(checkout)/`, `app/[locale]/(checkout)/_actions/`, `app/[locale]/(checkout)/_components/`, `app/api/checkout/`, `app/api/payments/`, `app/actions/payments.ts`, `lib/stripe.ts`, `lib/stripe-connect.ts`

### 7. Orders ✅
- [x] Buyer order list — shows orders with status, pagination
- [x] Seller order list (sales) — shows incoming orders
- [x] Order detail page — full order info, items, status, tracking
- [ ] Status updates — seller can update order status
- [ ] Rating/review — buyer can rate after delivery
- [ ] Order-linked conversations — link to chat from order
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(account)/account/orders/`, `app/[locale]/(account)/account/sales/`, `app/[locale]/(sell)/sell/orders/`, `app/actions/orders-*.ts`, `components/shared/order-detail/`, `components/shared/order-list-item.tsx`, `lib/order-status.ts`, `lib/order-conversations.ts`

---

## P1 — Should Work

### 8. Profile & Account ✅
- [ ] View own profile — page loads, shows user info, listings, reviews
- [ ] Edit profile — name, bio, avatar upload
- [ ] Account settings — accessible, all sections load
- [ ] Security settings — password change works
- [x] Public profile page (`/[username]`) — loads, shows seller's products
- [ ] Addresses, billing, payment methods pages load
- [ ] Following page — shows followed sellers
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(account)/`, `app/[locale]/(account)/_components/`, `app/[locale]/(account)/account/`, `app/[locale]/[username]/`, `app/actions/profile-*.ts`, `app/actions/username-*.ts`, `lib/avatar-palettes.ts`

### 9. Cart & Wishlist ✅
- [ ] Add to cart — product added, badge count updates
- [x] Cart page — shows items, quantities, total price
- [ ] Remove from cart — item removed, totals update
- [ ] Proceed to checkout — navigates to checkout with cart contents
- [ ] Wishlist add/remove — heart icon toggles, persists
- [x] Wishlist page — shows saved items, can remove or add to cart
- [ ] Empty states for both cart and wishlist
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(main)/cart/`, `app/[locale]/(main)/wishlist/`, `app/api/wishlist/`, `components/shared/wishlist/`, `components/mobile/drawers/`

### 10. Onboarding 🔄
- [ ] Onboarding flow starts after first sign-up
- [x] Account type selection (personal/business)
- [x] Profile setup — name, avatar
- [x] Business profile setup (if business account)
- [x] Interest selection
- [x] Completion page — redirect to main app
- [ ] Can skip / come back later
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(onboarding)/`, `app/[locale]/(onboarding)/onboarding/`, `app/actions/onboarding.ts`

### 11. Navigation & Layout ✅
- [x] Mobile bottom tab bar — correct routes, active states, badge counts
- [ ] Desktop sidebar — all links work, active states
- [x] Header — search, user menu, cart icon, notifications
- [ ] Dark mode toggle — switches theme, persists
- [ ] i18n switcher — en/bg works, all strings translated
- [ ] Responsive transitions — no layout breaks between 375px–1280px
- [ ] Loading states — skeleton/spinner on route transitions
- [x] Error pages — 404, error boundary, global error

**Scope:** `components/layout/`, `components/mobile/chrome/`, `components/mobile/drawers/`, `components/desktop/`, `components/shared/`, `app/[locale]/layout.tsx`, `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`, `app/global-error.tsx`, `app/global-not-found.tsx`

---

## P2 — Can Soft-Launch Without

### 12. Business Dashboard ⬜
- [ ] Dashboard home — analytics overview loads
- [ ] Products management — list, search, filter
- [ ] Orders management — list, detail
- [ ] Customers — list loads
- [ ] Discounts — create, list, edit
- [ ] Analytics — charts/stats render
- [ ] Accounting — revenue, fees breakdown
- [ ] Settings — business settings page
- [ ] Upgrade prompt if on free plan
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(business)/dashboard/`, `app/[locale]/(business)/_components/`, `app/[locale]/(business)/dashboard/_components/`, `app/[locale]/(business)/dashboard/_lib/`, `app/actions/products-discounts.ts`, `app/actions/subscriptions-*.ts`

### 13. Plans & Subscriptions ⬜
- [ ] Plans page — comparison table, features per plan
- [ ] Upgrade flow — select plan, Stripe Checkout, success
- [ ] Billing management — current plan, invoices, cancel
- [ ] Account plans page — shows current subscription
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(plans)/`, `app/[locale]/(plans)/_components/`, `app/[locale]/(account)/account/plans/`, `app/api/plans/`, `app/api/subscriptions/`, `app/api/billing/`, `app/actions/subscriptions-*.ts`, `lib/subscriptions/`

### 14. Chat & Messaging ⬜
- [ ] Conversation list — shows existing conversations
- [ ] Send message — text input, sends, appears in thread
- [ ] Receive message — real-time or on refresh
- [ ] Order-linked conversations — navigate from order to chat
- [ ] Image upload in chat
- [ ] Empty state — no conversations yet
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(chat)/`, `app/[locale]/(chat)/_actions/`, `app/[locale]/(chat)/_components/`, `app/[locale]/(chat)/chat/`, `app/api/upload-chat-image/`, `lib/order-conversations.ts`

### 15. Support & Legal Pages ⬜
- [ ] FAQ page loads with content
- [ ] Customer service / contact page
- [ ] Terms of service, privacy policy, cookies, returns pages
- [ ] Feedback form
- [ ] All pages render, no broken layouts
- [ ] Mobile (375px) + Desktop (1280px) layouts clean

**Scope:** `app/[locale]/(main)/(support)/`, `app/[locale]/(main)/(legal)/`

---

## Launch Blockers (from TASKS.md)

> These require human approval. Tracked separately.

- [ ] **LAUNCH-001:** Stripe webhook idempotency
- [ ] **LAUNCH-002:** Refund/dispute flow
- [ ] **LAUNCH-003:** Stripe env separation (prod keys)
- [ ] **LAUNCH-004:** Leaked password protection + Supabase Security Advisor

---

*Last updated: 2026-02-24*
