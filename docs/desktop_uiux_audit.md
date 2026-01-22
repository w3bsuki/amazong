# UI/UX + A11y Audit (Desktop + Mobile)

Date: 2026-01-22
Target: http://localhost:3000/en

## Method
- Playwright MCP navigation + console error capture.
- Manual UX walk-through of public flows.

## Viewport
- Playwright MCP viewport: 756×487 (mobile nav visible).
- Tool limitation: I could not change viewport to true desktop in this session.

## Limitations
- No password/OTP for radevalentin@gmail.com → auth-gated flows blocked (onboarding, selling, orders, payouts, ratings submit, Stripe checkout).
- Stripe payment flow not executed (no authenticated checkout).

---

## Treido Audit - 2026-01-22

### Critical (blocks release)
- [ ] Hydration mismatch observed on /en and product pages → causes UI instability and console errors. Fix SSR/CSR divergence.
- [ ] Add-to-cart interaction does not reflect in /en/cart (cart remains empty) while cart badge shows “1” → cart state desync.

### High (next sprint)
- [ ] Cookie consent modal repeatedly blocks key CTAs (Add to Cart, Follow, Review) until dismissed; it intercepts pointer events across pages → make it non-blocking or auto-dismiss after action.
- [ ] “Follow” on seller page logs “optimistic state update outside a transition” and does not change state → wrap optimistic updates in transitions/actions and confirm auth handling.
- [ ] Review dialog opens but `Submit` remains disabled even after star selection + text → validation state or auth gating is broken or unclear.
- [ ] /en/help navigates to /en/customer-service but /en/help title initially renders as “Treido” → inconsistent routing/metadata.
- [ ] Header search affordance is a button labeled “Search…” (not an input) → low discoverability and a11y label ambiguity.
- [ ] Login page shows duplicate checkbox for “Remember me” (two inputs in DOM) → a11y and form state risk.

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
- Review dialog opens without auth gate, but `Submit` stays disabled after star + text.
- CTA cluster: Share, Wishlist, Chat, Add to Cart, Review — prioritization unclear.
- Hydration warning appears intermittently.

### 5) Cart (/en/cart)
- After clicking `Add to Cart` on product page, cart still shows empty state.
- Cart badge shows “1” on some pages, implying state desync.

### 6) Help (/en/help → /en/customer-service)
- Route appears to redirect to /en/customer-service; initial title metadata shows “Treido” before redirect.

### 7) Seller page (/en/tech_haven)
- `Follow` click produces optimistic update warning and state does not change.

### 8) Auth (/en/auth/login)
- “Remember me” renders two checkboxes in DOM.
- Sign-in CTA disabled until fields filled (expected).

---

## Mobile UX Notes
- Cookie consent dialog frequently blocks taps on primary CTAs.
- Product CTA hierarchy is unclear; primary action not dominant.
- Category list is excessively verbose at mobile width.

## Desktop UX Notes
- Desktop viewport could not be set in this Playwright MCP session; desktop-specific layout not verified.

---

## What I need to complete the full audit
- Password or OTP for radevalentin@gmail.com.
- Confirmation that I can complete seller onboarding, place a Stripe test order, and submit a review.
- Any seeded order IDs or test listings if required.
