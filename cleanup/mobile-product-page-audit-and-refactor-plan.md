# Mobile Product Page Audit + Refactor Plan

Target route: `http://localhost:3000/bg/shop4e/12322`

Date: 2025-12-26

## Evidence (Playwright)

- Mobile viewport used by audit script: **390×844 @ dpr2**
- Audit artifacts (screenshots + JSON): `cleanup/mobile-audit-20251226-235350/`
- Tap-target failures flagged by script: **26** (`summary.totalFailingTapTargets44`)
  - Notes:
    - Some failures are expected/“false positives” for **skip links** because they are `sr-only` and become large only on `:focus`.
    - The remaining failures are real UX issues (small icon buttons, small text links, quantity +/- buttons, cookie consent controls).

## Executive Summary (What feels “super bad” on mobile)

### 1) Above-the-fold hierarchy is noisy and duplicative
The current mobile stack is effectively:

1. Full site header (brand + locale + search + auth + cart)
2. **SimilarItemsBar** (seller + “shop store” link + thumbnail strip)
3. **MobileSellerCard** (seller repeated again)
4. Gallery + buy box

This produces the “duplicate banners” feeling and pushes the product’s actual hero (gallery/title/price/CTAs) down.

### 2) Tap targets are frequently below the 44×44 guideline
Concrete examples from the audit report:

- Quantity +/- buttons are 32×32 (`ProductBuyBox` uses `h-8 w-8`).
- Gallery zoom button is 40×40 (`ProductGalleryHybrid` uses `h-10 w-10`).
- Seller links in SimilarItemsBar are text-only (e.g. 44×16 and 63×16).
- Wishlist/close icon buttons show up as 38×38 and 32×32.

### 3) Content depth is heavy for mobile
Mobile users get:

- Gallery + buy box
- Mobile accordions
- Large “More from this seller” grid
- Reviews module
- Sticky bar

This is a lot of modules, and some of them duplicate intent (e.g., SimilarItemsBar vs seller grid).

---

## P0 Priorities (Ship these first)

### P0.1 Remove “duplicate banners” at the top
**Goal:** one clear seller module and faster access to product hero.

**Proposed changes**

- Make the SimilarItemsBar **desktop-only** (or seller-only desktop, thumbnails-only mobile).
  - Option A (simplest): hide it on mobile: `className="hidden lg:block"` at call site.
  - Option B: adapt component: on mobile show only a single-row “More from this seller” scroller, and remove seller row entirely.
- Keep exactly one seller module on mobile: **MobileSellerCard**.
- Ensure MobileSellerCard is visually “compact” and matches the buy box styling language.

**Files**

- `app/[locale]/[username]/[productSlug]/page.tsx` (composition)
- `components/shared/product/similar-items-bar.tsx`
- `components/shared/product/mobile-seller-card.tsx`

**Acceptance criteria**

- On mobile, seller identity is shown exactly once above the fold.
- The user can see Gallery + Title + Price within the first screen without feeling like they’re “wading through banners”.

### P0.2 Fix tap targets (44×44 minimum)
**Goal:** all frequently-used mobile controls meet $\ge 44\times44$.

**Proposed changes**

- Standardize a “mobile tap target” size:
  - Icons: `h-11 w-11` (44×44)
  - Small pills/chips: `min-h-11 px-3` (or `px-4`), and ensure line-height doesn’t shrink.
- Product buy box:
  - Quantity +/- buttons: `h-11 w-11` on mobile (`lg:h-8 lg:w-8` if needed for desktop).
  - “Visit” button: raise to at least 44px height on mobile.
  - Message/heart buttons: min 44px.
- Gallery:
  - Zoom button: `h-11 w-11`.
- Seller products grid + wishlist:
  - Ensure wishlist buttons are 44×44 (padding or size).
- Cookie consent:
  - If the bottom consent UI stays present on product pages, make its primary/secondary buttons 44px tall.

**Files (likely)**

- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/product-gallery-hybrid.tsx`
- `components/shared/product/seller-products-grid.tsx`
- `components/layout/cookie-consent.tsx`

**Acceptance criteria**

- Mobile audit: “real” tap target failures are 0.
  - Skip links may remain flagged by the script until the script is adjusted to ignore `sr-only`/off-screen elements.

### P0.3 Tighten the hero layout
**Goal:** the product hero reads like a modern marketplace PDP.

**Proposed changes**

- Make gallery truly full-width on mobile (edge-to-edge image container, minimal padding), then title/price.
- Reduce “label” noise in the buy box on mobile:
  - Prefer a key/value compact layout or chips (“Condition”, “In stock”) rather than repeated “Price:”, “Condition:” rows.
- Ensure primary actions (Buy/Add to cart/Watchlist) are grouped and sized for thumbs.

**Files**

- `components/shared/product/product-gallery-hybrid.tsx`
- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/mobile-sticky-bar.tsx`

---

## P1 Improvements (Next sprint)

### P1.1 Make “More from this seller” mobile-first
**Goal:** avoid a huge grid immediately after the hero.

**Proposed changes**

- Convert to a horizontal scroll carousel on mobile, 2 rows max.
- Keep “See all (519)” as a full-height 44px button on mobile.
- Make wishlist an overlay but large enough.

**Files**

- `components/shared/product/seller-products-grid.tsx`

### P1.2 Reviews module ergonomics
**Goal:** readable, scannable reviews; filters usable on mobile.

**Proposed changes**

- Ensure review filter pills are 44px tall.
- Consider collapsing distribution charts into an accordion.

**Files**

- `components/shared/product/customer-reviews-hybrid.tsx`

### P1.3 Align SimilarItemsBar purpose
**Goal:** remove redundancy between SimilarItemsBar and seller grid.

**Proposed changes**

- Rename/repurpose it to one of:
  - “More from this seller” (desktop)
  - “Similar items” (true similarity; not just seller’s items)
- If it stays, remove any duplicate seller identity content.

---

## P2 (Cleanup / consistency)

### P2.1 Skip links: ensure no duplicates across layouts
The codebase currently defines skip links in both:

- `app/[locale]/(main)/layout.tsx`
- `app/[locale]/[username]/layout.tsx`

Even if the product route doesn’t always render both, this pattern makes duplication likely across the app.

**Proposed changes**

- Extract a shared `SkipLinks` component and render it in exactly one place per route tree.
- Update E2E tests to expect exactly one skip link to `#main-content` and one to `#footerHeader` (instead of accepting “any of them”).

---

## Verification checklist (Playwright)

1. Run the existing mobile audit:
   - `pnpm -s exec node scripts/mobile-audit.mjs http://localhost:3000/bg/shop4e/12322`
   - Confirm tap targets are clean (or only skip links are flagged).
2. Run smoke E2E (reusing dev server):
   - `pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium`
3. Manual mobile flows:
   - Swipe gallery, open zoom, close zoom.
   - Add to cart / buy now button states.
   - Sticky bar doesn’t obscure content or duplicate CTAs.

---

## Suggested next step

If you want, I can implement the P0.1 + P0.2 changes directly (hide SimilarItemsBar on mobile, enlarge tap targets in `ProductBuyBox`/`ProductGalleryHybrid`, fix wishlist icon sizing) and then re-run the mobile audit + smoke tests to confirm.
