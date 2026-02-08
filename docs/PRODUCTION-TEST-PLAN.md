# PRODUCTION-TEST-PLAN.md — Full Platform QA & Fix Plan

> **Methodical phase-by-phase plan to test every user-facing feature, fix what's broken, and ship.**
> Each phase: test → identify issues → fix → re-test → gate check → next phase.

| Created | 2026-02-08 |
|---------|------------|
| Status | **Active** |
| Approach | Manual QA + automated fixes, phase-gated |
| Pre-requisites | Dev server running (`pnpm dev`), Supabase connected, Stripe test mode |

---

## How To Use This Plan

1. Work through phases **in order** (Phase 1 → 2 → 3 → …).
2. Each phase has a **Test** checklist and a **Fix** section.
3. After testing, mark items ✅ (pass) or ❌ (fail) with a brief note.
4. Fix all ❌ items before moving to the next phase.
5. Run **gate checks** between phases:
   ```bash
   pnpm -s typecheck
   pnpm -s lint
   pnpm -s styles:gate
   ```
6. After all phases, run the **full verification suite** (Phase 10).

### Severity Legend

| Tag | Meaning |
|-----|---------|
| 🔴 P0 | Blocks launch — must fix |
| 🟠 P1 | Major UX issue — should fix before launch |
| 🟡 P2 | Polish — fix if time allows |
| 🟢 P3 | Nice-to-have — post-launch |

---

## Phase 1: Authentication & Session Management

**Goal:** Users can sign up, sign in, verify email, maintain session state, and sign out cleanly.

### 1.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 1.1.1 | Navigate to sign-up page | `/auth/sign-up` | Form renders with email, password, confirm password fields | ⬜ |
| 1.1.2 | Sign up with valid credentials | `/auth/sign-up` | Success message, redirect to `/auth/sign-up-success` | ⬜ |
| 1.1.3 | Sign up validation (weak password, mismatched confirm) | `/auth/sign-up` | Inline validation errors display | ⬜ |
| 1.1.4 | Sign up with existing email | `/auth/sign-up` | Error message (no info leakage about existing accounts) | ⬜ |
| 1.1.5 | Email confirmation link works | Email → `/auth/confirm` | PKCE exchange succeeds, user session created | ⬜ |
| 1.1.6 | Navigate to login page | `/auth/login` | Form renders with email, password fields | ⬜ |
| 1.1.7 | Login with valid credentials | `/auth/login` | Redirect to `/` or `?next=` param, header shows authenticated state | ⬜ |
| 1.1.8 | 🔴 Auth state reflects immediately after login | `/auth/login` → `/` | Header/nav shows user as logged in WITHOUT hard refresh | ⬜ |
| 1.1.9 | Login with wrong password | `/auth/login` | Error message, no crash | ⬜ |
| 1.1.10 | Login with non-existent email | `/auth/login` | Generic error (no info leakage) | ⬜ |
| 1.1.11 | Forgot password flow | `/auth/forgot-password` | Email sent, reset link works | ⬜ |
| 1.1.12 | Reset password | `/auth/reset-password` | New password saved, can login with it | ⬜ |
| 1.1.13 | Sign out | Header menu | Session cleared, redirect to `/`, header shows guest state | ⬜ |
| 1.1.14 | Session persistence across page navigation | Navigate between pages | User stays authenticated | ⬜ |
| 1.1.15 | Session persistence across browser refresh | F5 / reload | User stays authenticated | ⬜ |
| 1.1.16 | Protected route redirect when not logged in | `/account` | Redirect to `/auth/login?next=/account` | ⬜ |
| 1.1.17 | Auth pages redirect when already logged in | `/auth/login` while logged in | Redirect to `/` | ⬜ |
| 1.1.18 | Mobile: sign-up form responsive | `/auth/sign-up` (375px) | Form usable on mobile viewport | ⬜ |
| 1.1.19 | Mobile: login form responsive | `/auth/login` (375px) | Form usable on mobile viewport | ⬜ |

### 1.2 Known Issues (Pre-identified)

| Issue | Severity | Description |
|-------|----------|-------------|
| AUTH-001 | 🔴 P0 | Login doesn't reflect auth state — requires hard refresh to see authenticated header |
| AUTH-002 | 🟠 P1 | Auth forms not using shadcn/ui components, hardcoded styles |
| AUTH-003 | 🟠 P1 | Auth forms missing mobile responsiveness |

### 1.3 Fix Targets

- [ ] **AUTH-001**: Debug `AuthStateManager` → ensure `onAuthStateChange` properly triggers re-render after `signInWithPassword()`. Check if `router.refresh()` is called after login action. Verify cookies are set correctly.
- [ ] **AUTH-002**: Refactor sign-up and login forms to use shadcn `<Input>`, `<Button>`, `<Label>`, `<Card>`, `<Form>` with proper Tailwind v4 tokens.
- [ ] **AUTH-003**: Ensure auth layout and forms are fully responsive (stack on mobile, proper padding/spacing).

### 1.4 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 2: Onboarding & Account Setup

**Goal:** First-time users see onboarding, choose personal/business, set up their profile correctly.

### 2.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 2.1.1 | First login redirects to onboarding | `/` after first sign-up | Redirect to onboarding if `onboarding_completed=false` | ⬜ |
| 2.1.2 | Onboarding: choose Personal account | Onboarding flow | Account type set to `personal` in profiles | ⬜ |
| 2.1.3 | Onboarding: choose Business account | Onboarding flow | Account type set to `business` in profiles | ⬜ |
| 2.1.4 | Onboarding: set username | Onboarding flow | Username saved, unique constraint enforced | ⬜ |
| 2.1.5 | Onboarding: set display name | Onboarding flow | Full name saved to profile | ⬜ |
| 2.1.6 | Onboarding: set avatar (optional) | Onboarding flow | Avatar uploaded to storage, URL saved | ⬜ |
| 2.1.7 | Onboarding: complete flow | Onboarding flow | `onboarding_completed=true`, redirect to `/` | ⬜ |
| 2.1.8 | After onboarding, not redirected again | Navigate normally | No more onboarding redirect | ⬜ |
| 2.1.9 | Public routes NOT gated by onboarding | `/search`, `/cart`, `/categories` | Pages accessible even if onboarding incomplete | ⬜ |
| 2.1.10 | Mobile: onboarding responsive | Onboarding (375px) | All steps usable on mobile | ⬜ |

### 2.2 Known Issues (Pre-identified)

| Issue | Severity | Description |
|-------|----------|-------------|
| ONB-001 | 🟠 P1 | Onboarding forms not styled with shadcn/Tailwind v4 tokens — hardcoded |
| ONB-002 | 🟠 P1 | Public routes (`/search`, `/cart`, `/categories`) gated by onboarding redirect |
| ONB-003 | 🟡 P2 | Missing mobile responsiveness on onboarding steps |

### 2.3 Fix Targets

- [ ] **ONB-001**: Refactor onboarding UI to shadcn components (`Card`, `RadioGroup`, `Input`, `Button`, `Avatar`).
- [ ] **ONB-002**: Fix middleware to only gate `/account/*`, `/sell/*`, `/chat/*` behind onboarding — NOT public routes.
- [ ] **ONB-003**: Make onboarding layout responsive (single-column stack on mobile).

### 2.4 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 3: Profile & Account Management

**Goal:** Users can view and edit their profile, manage addresses, security settings, payment methods.

### 3.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 3.1.1 | Account dashboard loads | `/account` | Dashboard with account overview | ⬜ |
| 3.1.2 | Profile page loads | `/account/profile` | Profile form with current data | ⬜ |
| 3.1.3 | Edit display name | `/account/profile` | Name updates, toast confirmation | ⬜ |
| 3.1.4 | Edit avatar | `/account/profile` | Avatar uploads and displays | ⬜ |
| 3.1.5 | Edit bio/description | `/account/profile` | Saved to profile | ⬜ |
| 3.1.6 | Address book: add address | `/account/addresses` | Address saved | ⬜ |
| 3.1.7 | Address book: edit address | `/account/addresses` | Address updated | ⬜ |
| 3.1.8 | Address book: delete address | `/account/addresses` | Address removed | ⬜ |
| 3.1.9 | Address book: set default | `/account/addresses` | Default flag toggled | ⬜ |
| 3.1.10 | Security: change password | `/account/security` | Password updated (requires current password) | ⬜ |
| 3.1.11 | Payment methods: add card | `/account/payments` | Stripe Setup checkout → card saved | ⬜ |
| 3.1.12 | Payment methods: remove card | `/account/payments` | Card deleted | ⬜ |
| 3.1.13 | Payment methods: set default | `/account/payments` | Default flag updated | ⬜ |
| 3.1.14 | Account sidebar navigation | `/account/*` | All sidebar links work | ⬜ |
| 3.1.15 | Public profile page | `/:username` | Public profile visible with listings | ⬜ |
| 3.1.16 | Mobile: account pages responsive | `/account/*` (375px) | Sidebar collapses, content readable | ⬜ |

### 3.2 Fix Targets

- [ ] Ensure all account forms use shadcn components with proper token styling.
- [ ] Validate account sidebar navigation works for all subroutes.
- [ ] Mobile: sidebar should collapse or become a dropdown/drawer on small screens.

### 3.3 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 4: Selling — Create & Manage Listings

**Goal:** Sellers can create listings via `/sell`, upload images, select categories, and publish. Existing listings can be edited/deleted.

### 4.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 4.1.1 | Navigate to sell page (unauthenticated) | `/sell` | Redirect to login | ⬜ |
| 4.1.2 | Navigate to sell page (authenticated) | `/sell` | Sell form wizard loads | ⬜ |
| 4.1.3 | Sell wizard: Step 1 — category selection | `/sell` | Category tree loads, L0→L1→L2→L3 drill-down works | ⬜ |
| 4.1.4 | Sell wizard: Step 2 — product details (title, desc, condition) | `/sell` | Fields validate, required fields enforced | ⬜ |
| 4.1.5 | Sell wizard: Step 3 — price & shipping | `/sell` | Price entry in EUR, shipping options | ⬜ |
| 4.1.6 | Sell wizard: Step 4 — image upload | `/sell` | Images upload to Supabase storage, previews display | ⬜ |
| 4.1.7 | 🔴 Sell wizard: final submit/publish | `/sell` | Listing created in DB, redirect to listing page | ⬜ |
| 4.1.8 | Sell wizard: draft save | `/sell` | Can save as draft, resume later | ⬜ |
| 4.1.9 | My listings page | `/account/selling` | All user listings displayed | ⬜ |
| 4.1.10 | Edit listing | `/account/selling/:id/edit` | Pre-filled form, can update | ⬜ |
| 4.1.11 | Delete/unpublish listing | `/account/selling` | Listing removed/hidden | ⬜ |
| 4.1.12 | Seller payout setup (Stripe Connect) | `/seller/settings/payouts` | Can start Connect onboarding | ⬜ |
| 4.1.13 | Seller payout status display | `/seller/settings/payouts` | Shows onboarding progress | ⬜ |
| 4.1.14 | Sell wizard: mobile responsive | `/sell` (375px) | All steps usable on mobile | ⬜ |

### 4.2 Known Issues (Pre-identified)

| Issue | Severity | Description |
|-------|----------|-------------|
| SELL-001 | 🔴 P0 | Sell form gets stuck on last step — cannot submit/publish listing |
| SELL-002 | 🟠 P1 | Sell form styling needs shadcn/Tailwind v4 refactor |
| SELL-003 | 🟡 P2 | Mobile responsiveness issues on sell wizard |

### 4.3 Fix Targets

- [ ] **SELL-001**: Debug sell form submission — check form provider, action handler, Supabase insert, image upload finalization. Likely a state/validation issue on the final step.
- [ ] **SELL-002**: Refactor sell wizard steps to use shadcn `Card`, `Input`, `Select`, `Button`, `RadioGroup`, file upload components.
- [ ] **SELL-003**: Ensure wizard steps stack properly on mobile, image preview grid adapts.

### 4.4 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 5: Marketplace Discovery & Product Display

**Goal:** Homepage feed, categories, search, filters, product pages all work correctly with proper category display.

### 5.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 5.1.1 | Homepage loads with product feed | `/` | Products display in grid/feed | ⬜ |
| 5.1.2 | Categories page loads | `/categories` | All L0 categories display | ⬜ |
| 5.1.3 | Category page loads | `/categories/:slug` | Products filtered by category | ⬜ |
| 5.1.4 | Subcategory navigation works | `/categories/:slug/:sub` | Drill-down to subcategories | ⬜ |
| 5.1.5 | Search page loads | `/search` | Search input, results area | ⬜ |
| 5.1.6 | Search returns results | `/search?q=shoes` | Matching products displayed | ⬜ |
| 5.1.7 | Search filters work (price, condition) | `/search` | Results filter correctly | ⬜ |
| 5.1.8 | Search sorting works (price, date) | `/search` | Results sort correctly | ⬜ |
| 5.1.9 | Product detail page (PDP) | `/:username/:productSlug` | Full product info, images, seller card | ⬜ |
| 5.1.10 | PDP image gallery (swipe + thumbnails) | PDP | Images load, gallery functional | ⬜ |
| 5.1.11 | PDP seller info card | PDP | Seller name, rating, link to profile | ⬜ |
| 5.1.12 | PDP attributes display | PDP | Condition, brand, size, etc. | ⬜ |
| 5.1.13 | PDP share/copy link | PDP | Share button works | ⬜ |
| 5.1.14 | 🔴 Product cards show L0 category | Feed/search/category pages | Cards show "Electronics", "Automotive" — NOT deep subcategories like "Официални ризи" | ⬜ |
| 5.1.15 | Quick view modal | Search results | Product quick view opens correctly | ⬜ |
| 5.1.16 | Recently viewed | PDP → other pages | Recently viewed section shows visited products | ⬜ |
| 5.1.17 | Today's deals page | `/todays-deals` | Deals load (or "no deals" state) | ⬜ |
| 5.1.18 | Sellers directory | `/sellers` | Seller list loads | ⬜ |
| 5.1.19 | Mobile: product feed responsive | `/` (375px) | Grid adapts, cards readable | ⬜ |
| 5.1.20 | Mobile: search responsive | `/search` (375px) | Filters accessible, results scrollable | ⬜ |
| 5.1.21 | Mobile: PDP responsive | PDP (375px) | Image gallery swipeable, content stacked | ⬜ |

### 5.2 Known Issues (Pre-identified)

| Issue | Severity | Description |
|-------|----------|-------------|
| CAT-001 | 🔴 P0 | Product cards displaying deep subcategory (L4 like "Официални ризи") instead of L0 category (e.g., "Fashion") |

### 5.3 Fix Targets

- [ ] **CAT-001**: Fix product card category display logic. Product cards should resolve and display the **L0 (root) category** name. Likely need to traverse `parent_id` chain up to root, or store/join L0 slug directly on products.

### 5.4 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 6: Cart & Checkout (Stripe Integration)

**Goal:** Add to cart, view cart, checkout with Stripe test mode, order creation via webhook.

### 6.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 6.1.1 | Add product to cart | PDP | Cart updates, badge count increments | ⬜ |
| 6.1.2 | Add multiple quantities | PDP | Quantity reflected in cart | ⬜ |
| 6.1.3 | Cart page loads | `/cart` | All cart items displayed with prices | ⬜ |
| 6.1.4 | Update quantity in cart | `/cart` | Total recalculates | ⬜ |
| 6.1.5 | Remove item from cart | `/cart` | Item removed, total updates | ⬜ |
| 6.1.6 | Cart badge count matches items | Header | Badge shows correct count | ⬜ |
| 6.1.7 | Cannot buy own products | Add own product to cart | Error/prevented | ⬜ |
| 6.1.8 | Proceed to checkout | `/cart` → `/checkout` | Checkout page loads | ⬜ |
| 6.1.9 | Checkout shows order summary | `/checkout` | Items, buyer protection fee, total | ⬜ |
| 6.1.10 | Buyer protection fee calculated correctly | `/checkout` | Fee matches tier formula | ⬜ |
| 6.1.11 | Stripe Checkout redirect | `/checkout` → Stripe | Redirects to Stripe hosted checkout | ⬜ |
| 6.1.12 | 🔴 Complete purchase (test card 4242…) | Stripe Checkout | Payment succeeds, redirects to success page | ⬜ |
| 6.1.13 | Success page shows order confirmation | `/checkout/success` | Order ID, items summary | ⬜ |
| 6.1.14 | Webhook creates order in DB | Supabase `orders` table | Order + order_items rows created | ⬜ |
| 6.1.15 | Cart clears after purchase | `/cart` | Cart empty after successful checkout | ⬜ |
| 6.1.16 | Failed payment handling | Stripe (4000 0000 0000 0002) | Error displayed, user can retry | ⬜ |
| 6.1.17 | Cancel checkout returns to cart | Stripe cancel button | Redirects back to `/cart` | ⬜ |
| 6.1.18 | Mobile: cart responsive | `/cart` (375px) | Cart items stack, totals visible | ⬜ |
| 6.1.19 | Mobile: checkout responsive | `/checkout` (375px) | Summary readable, CTA accessible | ⬜ |

### 6.2 Fix Targets

- [ ] Verify Stripe test keys are configured in `.env.local`.
- [ ] Set up Stripe CLI webhook forwarding for local testing: `stripe listen --forward-to localhost:3000/api/checkout/webhook`.
- [ ] Test idempotency: replaying same webhook event doesn't create duplicate orders.

### 6.3 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
pnpm -s test:unit  # Payment tests
```

---

## Phase 7: Order Management (Buyer + Seller)

**Goal:** Both buyers and sellers can view orders, sellers can ship/deliver, buyers can confirm receipt.

### 7.1 Test Checklist — Buyer Side

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 7.1.1 | Orders list loads | `/account/orders` | All orders displayed with status | ⬜ |
| 7.1.2 | Order detail page | `/account/orders/:id` | Full order info: items, status, tracking | ⬜ |
| 7.1.3 | Order status shows "pending" | `/account/orders/:id` | Correct status after purchase | ⬜ |
| 7.1.4 | Buyer can "confirm received" | `/account/orders/:id` | Status updates, triggers payout | ⬜ |
| 7.1.5 | Buyer can report issue | `/account/orders/:id` | Report form works (buyer protection) | ⬜ |
| 7.1.6 | Order status tracking updates | `/account/orders/:id` | Status reflects seller actions | ⬜ |

### 7.2 Test Checklist — Seller Side

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 7.2.1 | Seller orders list loads | `/sell/orders` | All seller orders displayed | ⬜ |
| 7.2.2 | Seller order detail | `/sell/orders` (or detail view) | Full order info from seller perspective | ⬜ |
| 7.2.3 | Mark order as shipped | `/sell/orders` | Status updates to "shipped" | ⬜ |
| 7.2.4 | Add tracking number | `/sell/orders` | Tracking info saved | ⬜ |
| 7.2.5 | Mark as delivered | `/sell/orders` | Status updates to "delivered" | ⬜ |
| 7.2.6 | Seller sees buyer confirmation | `/sell/orders` | Shows "completed" after buyer confirms | ⬜ |

### 7.3 Test Checklist — Business Dashboard Orders

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 7.3.1 | Business orders page loads | `/dashboard/orders` | All business orders displayed | ⬜ |
| 7.3.2 | Business order detail | `/dashboard/orders/:orderId` | Full detail view | ⬜ |
| 7.3.3 | Order management actions | `/dashboard/orders` | Ship/deliver actions available | ⬜ |

### 7.4 Fix Targets

- [ ] Ensure order status flow works end-to-end: `pending → shipped → delivered → completed`.
- [ ] Verify buyer "confirm received" triggers payout release.
- [ ] Both buyer and seller order views use proper shadcn components with consistent styling.

### 7.5 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 8: Social Features — Wishlist, Messaging, Reviews, Following

**Goal:** All social/engagement features work correctly.

### 8.1 Test Checklist — Wishlist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 8.1.1 | Add to wishlist from PDP | PDP | Heart fills, product added | ⬜ |
| 8.1.2 | Add to wishlist from product card | Feed/search | Heart toggle works | ⬜ |
| 8.1.3 | Wishlist page loads | `/wishlist` | All wishlisted products displayed | ⬜ |
| 8.1.4 | Remove from wishlist | `/wishlist` | Product removed | ⬜ |
| 8.1.5 | Wishlist count in header | Header | Count updates on add/remove | ⬜ |

### 8.2 Test Checklist — Messaging

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 8.2.1 | Start conversation from PDP | PDP → "Message Seller" | Chat opens with seller | ⬜ |
| 8.2.2 | Chat inbox loads | `/chat` | All conversations listed | ⬜ |
| 8.2.3 | Send text message | `/chat/:id` | Message appears in real-time | ⬜ |
| 8.2.4 | Receive message (real-time) | `/chat/:id` | New messages appear without refresh | ⬜ |
| 8.2.5 | Send image attachment | `/chat/:id` | Image uploads and displays | ⬜ |
| 8.2.6 | Unread indicators | `/chat` | Unread badge on conversations | ⬜ |
| 8.2.7 | Block user | Chat → actions | User blocked, conversation hidden | ⬜ |
| 8.2.8 | Report conversation | Chat → actions | Report submitted | ⬜ |

### 8.3 Test Checklist — Reviews & Ratings

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 8.3.1 | Leave product review (after purchase) | PDP or order detail | Review form works, stars + text | ⬜ |
| 8.3.2 | Reviews display on PDP | PDP | Reviews section visible | ⬜ |
| 8.3.3 | Leave seller feedback | After order | Feedback form works | ⬜ |
| 8.3.4 | Reviews display on seller profile | `/:username` | Ratings/reviews visible | ⬜ |
| 8.3.5 | Helpful vote | PDP reviews | Helpful count increments (auth required) | ⬜ |
| 8.3.6 | Delete own review | PDP reviews | Review removed | ⬜ |
| 8.3.7 | No duplicate reviews | PDP | Second review attempt blocked | ⬜ |

### 8.4 Test Checklist — Following

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 8.4.1 | Follow seller | `/:username` | Follow button toggles | ⬜ |
| 8.4.2 | Following list | `/account/following` | Followed sellers displayed | ⬜ |
| 8.4.3 | Unfollow seller | `/account/following` | Seller removed from list | ⬜ |

### 8.5 Fix Targets

- [ ] All social feature UIs use shadcn components.
- [ ] Real-time messaging works (Supabase Realtime subscription).
- [ ] Helpful vote requires auth (anon EXECUTE revoked per STRUCT task).

### 8.6 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 9: Business Dashboard & Subscriptions

**Goal:** Business sellers can access dashboard, manage products, view analytics, upgrade plans.

### 9.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 9.1.1 | Dashboard access gating (no subscription) | `/dashboard` | Redirected or upgrade prompt | ⬜ |
| 9.1.2 | Plans page loads | `/plans` | All plans displayed with pricing | ⬜ |
| 9.1.3 | Subscribe to plan | `/plans` → Stripe | Stripe subscription checkout works | ⬜ |
| 9.1.4 | Dashboard loads (with subscription) | `/dashboard` | Dashboard home with metrics | ⬜ |
| 9.1.5 | Business products page | `/dashboard/products` | All business products listed | ⬜ |
| 9.1.6 | Business analytics page | `/dashboard/analytics` | Analytics data displayed | ⬜ |
| 9.1.7 | Business customers page | `/dashboard/customers` | Customer data displayed | ⬜ |
| 9.1.8 | Business settings | `/dashboard/settings` | Business settings form | ⬜ |
| 9.1.9 | Manage subscription (portal) | `/account/plans` | Stripe billing portal link works | ⬜ |
| 9.1.10 | Upgrade subscription | `/account/plans/upgrade` | Upgrade flow works | ⬜ |
| 9.1.11 | Business inventory management | `/dashboard/inventory` | Inventory view works | ⬜ |
| 9.1.12 | Business discounts | `/dashboard/discounts` | Discount management works | ⬜ |
| 9.1.13 | Mobile: dashboard responsive | `/dashboard` (375px) | Sidebar collapses, content readable | ⬜ |

### 9.2 Fix Targets

- [ ] Ensure dashboard gating works based on subscription tier.
- [ ] All dashboard pages have proper error boundaries.
- [ ] Mobile: dashboard sidebar should collapse to hamburger menu.

### 9.3 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 10: Trust, Safety & Admin

**Goal:** Reporting, blocking, and admin moderation features work.

### 10.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 10.1.1 | Report product | PDP → Report | Report form submits | ⬜ |
| 10.1.2 | Report user | `/:username` → Report | Report form submits | ⬜ |
| 10.1.3 | Block user | Profile/chat → Block | User blocked, content hidden | ⬜ |
| 10.1.4 | Admin dashboard loads | `/admin` | Admin metrics, quick actions | ⬜ |
| 10.1.5 | Admin: user management | `/admin/users` | User list, moderation actions | ⬜ |
| 10.1.6 | Admin: product management | `/admin/products` | Product list, moderation actions | ⬜ |
| 10.1.7 | Admin: order management | `/admin/orders` | All orders visible | ⬜ |
| 10.1.8 | Admin: sellers management | `/admin/sellers` | Seller list, verification | ⬜ |
| 10.1.9 | Admin route gating (non-admin user) | `/admin` | Access denied | ⬜ |

### 10.2 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 11: i18n, Accessibility & Legal Pages

**Goal:** Locale switching, translations, keyboard navigation, and legal pages all work.

### 11.1 Test Checklist

| # | Test Case | Route | Expected | Status |
|---|-----------|-------|----------|--------|
| 11.1.1 | English locale | `/en/` | All content in English | ⬜ |
| 11.1.2 | Bulgarian locale | `/bg/` | All content in Bulgarian | ⬜ |
| 11.1.3 | Locale switcher | Header | Switching preserves current page | ⬜ |
| 11.1.4 | Currency display (EUR) | Product cards/PDP | Prices show in EUR | ⬜ |
| 11.1.5 | Currency display (BGN) | Product cards/PDP (if BGN locale) | Prices show in BGN | ⬜ |
| 11.1.6 | No hardcoded strings in UI | All pages | All user-facing text from `messages/` | ⬜ |
| 11.1.7 | Keyboard navigation on main flows | Homepage → PDP → Cart | Tab order logical, focus visible | ⬜ |
| 11.1.8 | Focus management on modals/drawers | Quick view, menus | Focus trapped in modal, restored on close | ⬜ |
| 11.1.9 | Privacy policy page | `/privacy` | Content loads | ⬜ |
| 11.1.10 | Terms of service page | `/terms` | Content loads | ⬜ |
| 11.1.11 | Cookie policy page | `/cookies` | Content loads | ⬜ |
| 11.1.12 | Returns policy page | `/returns` | Content loads | ⬜ |
| 11.1.13 | About page | `/about` | Content loads | ⬜ |
| 11.1.14 | Contact page | `/contact` | Form works | ⬜ |
| 11.1.15 | FAQ page | `/faq` | Content loads | ⬜ |
| 11.1.16 | Help center | `/help` | Content loads | ⬜ |

### 11.2 Gate Check

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

---

## Phase 12: Cross-Cutting — Styling & Responsiveness Audit

**Goal:** Systematic sweep of ALL pages for shadcn/Tailwind v4 compliance and mobile responsiveness.

### 12.1 Styling Audit Checklist

| # | Area | Check | Status |
|---|------|-------|--------|
| 12.1.1 | Auth forms | shadcn components, semantic tokens | ⬜ |
| 12.1.2 | Onboarding wizard | shadcn components, semantic tokens | ⬜ |
| 12.1.3 | Sell wizard | shadcn components, semantic tokens | ⬜ |
| 12.1.4 | Product cards | Consistent token usage | ⬜ |
| 12.1.5 | Product detail page | Proper spacing, typography tokens | ⬜ |
| 12.1.6 | Cart page | shadcn components | ⬜ |
| 12.1.7 | Checkout page | shadcn components | ⬜ |
| 12.1.8 | Account pages | shadcn forms, cards, tables | ⬜ |
| 12.1.9 | Business dashboard | shadcn panels, charts | ⬜ |
| 12.1.10 | Chat/messaging | Proper styling | ⬜ |
| 12.1.11 | Search page + filters | shadcn components | ⬜ |
| 12.1.12 | Category pages | Consistent with design system | ⬜ |

### 12.2 Mobile Responsiveness Audit

| # | Page | Viewport | Check | Status |
|---|------|----------|-------|--------|
| 12.2.1 | Homepage | 375px | Grid adapts, no horizontal scroll | ⬜ |
| 12.2.2 | Search | 375px | Filters accessible, results scroll | ⬜ |
| 12.2.3 | PDP | 375px | Images swipeable, content stacked | ⬜ |
| 12.2.4 | Cart | 375px | Items stack, CTAs accessible | ⬜ |
| 12.2.5 | Auth forms | 375px | Full-width inputs, no overflow | ⬜ |
| 12.2.6 | Sell wizard | 375px | Steps usable, upload works | ⬜ |
| 12.2.7 | Account pages | 375px | Sidebar collapses | ⬜ |
| 12.2.8 | Chat | 375px | Full-height, input accessible | ⬜ |
| 12.2.9 | Dashboard | 375px | Sidebar collapses, charts resize | ⬜ |
| 12.2.10 | Onboarding | 375px | Steps stack vertically | ⬜ |

### 12.3 Verification

```bash
pnpm -s styles:gate
```

---

## Phase 13: Final Verification & Pre-Deploy

**Goal:** All automated gates pass. E2E smoke test passes. Manual spot-check of critical flows.

### 13.1 Automated Gates

| # | Gate | Command | Status |
|---|------|---------|--------|
| 13.1.1 | TypeScript | `pnpm -s typecheck` | ⬜ |
| 13.1.2 | ESLint | `pnpm -s lint` | ⬜ |
| 13.1.3 | Tailwind style gate | `pnpm -s styles:gate` | ⬜ |
| 13.1.4 | Unit tests | `pnpm -s test:unit` | ⬜ |
| 13.1.5 | Build succeeds | `pnpm build` | ⬜ |
| 13.1.6 | E2E smoke test | `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` | ⬜ |

### 13.2 Critical Path Manual Spot-Check

| # | Flow | Steps | Status |
|---|------|-------|--------|
| 13.2.1 | New user journey | Sign up → confirm email → onboard → browse → add to cart → checkout → view order | ⬜ |
| 13.2.2 | Seller journey | Login → sell → upload listing → view listing live → receive order → ship → get paid | ⬜ |
| 13.2.3 | Social engagement | Browse → wishlist → message seller → leave review → follow seller | ⬜ |
| 13.2.4 | Business seller | Subscribe to plan → access dashboard → manage products → view analytics | ⬜ |
| 13.2.5 | Locale switch | Complete flow in EN, switch to BG mid-flow, verify continuity | ⬜ |

### 13.3 Supabase Security

```bash
# Via Supabase MCP
mcp__supabase__get_advisors({ type: "security" })
mcp__supabase__get_advisors({ type: "performance" })
```

### 13.4 Stripe Verification

- [ ] All 4 webhook endpoints registered and active
- [ ] Test mode keys in dev, live keys in production env vars
- [ ] Webhook signing secrets match between Stripe and Vercel
- [ ] Idempotency: replaying checkout webhook doesn't create duplicate orders

### 13.5 Definition of Done

- [ ] All phases tested, all P0/P1 issues fixed
- [ ] All automated gates pass
- [ ] E2E smoke passes
- [ ] Supabase security advisor clean (or exceptions documented)
- [ ] Manual critical path flows verified
- [ ] `FEATURES.md` updated to reflect actual shipped state

---

## Issue Tracker

> Log all issues found during testing here. Transfer to `TASKS.md` for execution.

### Open Issues

| ID | Phase | Severity | Description | Status |
|----|-------|----------|-------------|--------|
| AUTH-001 | 1 | 🔴 P0 | Login doesn't reflect auth state without hard refresh | Open |
| CAT-001 | 5 | 🔴 P0 | Product cards show L4 subcategory instead of L0 root | Open |
| SELL-001 | 4 | 🔴 P0 | Sell form stuck on last step, cannot publish | Open |
| AUTH-002 | 1 | 🟠 P1 | Auth forms not styled with shadcn/TW4 | Open |
| AUTH-003 | 1 | 🟠 P1 | Auth forms missing mobile responsiveness | Open |
| ONB-001 | 2 | 🟠 P1 | Onboarding forms hardcoded styles | Open |
| ONB-002 | 2 | 🟠 P1 | Public routes gated by onboarding redirect | Open |
| SELL-002 | 4 | 🟠 P1 | Sell wizard needs shadcn refactor | Open |

### Resolved Issues

| ID | Phase | Description | Resolution | Date |
|----|-------|-------------|------------|------|
| — | — | — | — | — |

---

## Execution Priority Order

> Work on P0 issues first, across all phases. Then P1, then P2.

### Round 1 — P0 Blockers (Do First)

1. **AUTH-001**: Fix login auth state reflection (no hard refresh)
2. **SELL-001**: Fix sell form final step submission
3. **CAT-001**: Fix product card category to show L0

### Round 2 — P1 UX Issues

4. **AUTH-002 + AUTH-003**: Refactor auth forms (shadcn + mobile)
5. **ONB-001 + ONB-003**: Refactor onboarding (shadcn + mobile)
6. **ONB-002**: Fix public route onboarding gating
7. **SELL-002 + SELL-003**: Refactor sell wizard (shadcn + mobile)

### Round 3 — Phase-by-Phase Testing

8. Test Phase 3–13 systematically, logging new issues
9. Fix issues by severity (P0 → P1 → P2)
10. Final verification (Phase 13)

---

*Last updated: 2026-02-08*
