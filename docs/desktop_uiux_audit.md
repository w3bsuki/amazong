# UI/UX + A11y Audit (Desktop + Mobile)

Date: 2026-01-22
Target: http://localhost:3000/en

## Method
- Playwright MCP navigation + console error capture.
- Manual UX walk-through of public flows.
- Switched to webpack dev server after Turbopack client-manifest crash.

## Viewport
- Playwright MCP viewport: 756×487 (mobile nav visible).
- Tool limitation: I could not change viewport to true desktop in this session.

## Limitations
- Playwright MCP viewport: desktop breakpoint not reachable in this session.
- Stripe Connect onboarding fails with 500, blocking payouts and listing creation.
- Checkout could not render usable state due to cart desync (see findings).

---

## Treido Audit - 2026-01-22

### Critical (blocks release)
- [ ] Turbopack dev server crashes after sign-in: missing client manifest for `OnboardingProvider` → global error page. Webpack dev server required to proceed.
- [ ] Hydration mismatch observed on /en and product pages → causes UI instability and console errors. Fix SSR/CSR divergence.
- [ ] Add-to-cart interaction does not reflect in /en/cart (cart remains empty) while cart badge shows items → cart state desync.
- [ ] /en/checkout renders only shell/loader and no line items after navigation → purchase flow blocked.
- [ ] Seller payouts onboarding triggers 500 at /api/connect/onboarding → cannot set up payouts or list products.

### High (next sprint)
- [ ] Cookie consent modal repeatedly blocks key CTAs (Add to Cart, Follow, Review) until dismissed; it intercepts pointer events across pages → make it non-blocking or auto-dismiss after action.
- [ ] Region detection modal blocks interactions on first visit until dismissed.
- [ ] “Follow” on seller page logs “optimistic state update outside a transition” even though state flips to Following → wrap optimistic updates in transitions/actions.
- [ ] Review submission increments rating count but new review does not appear in list without refresh → review rendering or data refresh issue.
- [ ] /en/help navigates to /en/customer-service but /en/help title initially renders as “Treido” → inconsistent routing/metadata.
- [ ] Header search affordance is a button labeled “Search…” (not an input) → low discoverability and a11y label ambiguity.
- [ ] Login page shows duplicate checkbox for “Remember me” (two inputs in DOM) → a11y and form state risk.
- [ ] /en/sell flow depends on username + payouts; buyer accounts show blank page in earlier session while seller accounts show gating steps → inconsistent entry behavior.

### Deferred (backlog)
- [ ] Category list on /en/categories is text-heavy on mobile, long sublabels overwhelm scanability.
- [ ] Product page CTA cluster is dense (Share, Wishlist, Chat, Add to Cart, Review) → reduce cognitive load or reorder by intent.

---

## Flow Audit (Desktop + Mobile)

### 1) Home (/en)
- Mobile nav visible at current viewport.
- Long horizontal category rail increases cognitive load.
- Hydration mismatch error appears in console on first render.

### 2) Search (/en/search)
- Filters + sort controls are present but visually light; not sticky.
- Product card density high, scanability suffers at mobile width.

### 3) Categories (/en/categories)
- Each category card includes very long subcategory text; walls of text on mobile.

### 4) Product page (/en/tech_haven/philips-sonicare-diamondclean)
- Review submission increments rating count (now 2 global ratings) but new review does not appear in list without refresh.
- CTA cluster: Share, Wishlist, Chat, Add to Cart, Review — prioritization unclear.
- Hydration warning appears intermittently, especially on opening review dialog.

### 5) Cart (/en/cart)
- After clicking `Add to Cart` on product page, cart still shows empty state.
- Cart badge shows “9” on some pages, implying state desync.

### 6) Checkout (/en/checkout)
- Checkout renders only shell/loader (no line items) after navigation.
- Title remains generic (“Treido”) instead of descriptive checkout metadata.

### 7) Help (/en/help → /en/customer-service)
- Route appears to redirect to /en/customer-service; initial title metadata shows “Treido” before redirect.

### 8) Seller page (/en/tech_haven)
- `Follow` click switches to Following and shows toast, but logs an optimistic update warning.

### 9) Auth (/en/auth/login)
- “Remember me” renders two checkboxes in DOM.
- Sign-in CTA disabled until fields filled (expected).
- After sign-in, /en/account can still redirect back to login.

### 10) Orders (/en/account/orders)
- Empty state shown for new accounts (no orders to validate order management actions).

### 11) Selling (/en/account/selling)
- Seller flow requires username; after setting username, /en/sell blocks on payouts.
- Payout setup page loads, but “Set Up Payouts” call returns 500 (/api/connect/onboarding) and does not redirect to Stripe Connect.

---

## Mobile UX Notes
- Cookie consent dialog frequently blocks taps on primary CTAs.
- Region detection modal blocks taps until dismissed.
- Product CTA hierarchy is unclear; primary action not dominant.
- Category list is excessively verbose at mobile width.

## Desktop UX Notes
- Desktop viewport could not be set in this Playwright MCP session; desktop-specific layout not verified.

---

## What I need to complete the full audit
- Stripe Connect onboarding endpoint fixed (avoid 500 on /api/connect/onboarding).
- Cart/checkout data synced so /en/cart and /en/checkout render line items.
- Confirmation of preferred Stripe test cards and any seeded listings/orders for end-to-end purchase validation.
