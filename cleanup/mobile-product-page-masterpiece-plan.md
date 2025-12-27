# Mobile Product Page Masterpiece Plan (C2C Marketplace)

Date: 2025-12-27

Target route example:
- `http://localhost:3000/bg/shop4e/aysifon`

Primary goal:
- Make the mobile PDP feel like a premium, fast, thumb-friendly marketplace page (C2C trust-forward), while staying strictly inside your Tailwind + shadcn + CSS variable design system.

Non-negotiable constraints (do not violate):
1. **No new colors**: do not add Tailwind colors like `text-green-600`. Use semantic tokens already in the theme (`text-success`, `text-primary`, `text-muted-foreground`, `border-border`, `bg-muted/...`).
2. **No new shadows** unless already used globally. Prefer borders + subtle muted backgrounds.
3. **No placeholders in trust-critical UI**: if data isn’t real, hide the row.
4. **One seller identity surface above-the-fold** (mobile). No duplication.
5. **Touch targets**: interactive controls must be ≥ 44×44 unless an explicit token exception exists in your mobile tokens.

Sources of truth:
- Mobile design tokens: `cleanup/mobile-design-tokens.md`

---

## Current implementation anchors (what to build on)

Route composition:
- `app/[locale]/[username]/[productSlug]/page.tsx`

Mobile-specific components already used:
- `components/shared/product/similar-items-bar.tsx` (currently rendered only on mobile)
- `components/shared/product/mobile-seller-card.tsx` (`lg:hidden`)
- `components/shared/product/product-buy-box.tsx` (mobile section inside)
- `components/shared/product/product-gallery-hybrid.tsx` (mobile edge-to-edge + dots)
- `components/shared/product/mobile-accordions.tsx` (`lg:hidden`)
- `components/shared/product/mobile-sticky-bar.tsx` (`lg:hidden`)

---

## North Star mobile layout (order + responsibilities)

Mobile should read in this order:
1) Gallery (edge-to-edge)
2) Title + rating + seller link (inside `ProductBuyBox` mobile)
3) Price + stock/shipping summary (inside `ProductBuyBox` mobile)
4) Action row (qty / wishlist / add-to-cart) (inside `ProductBuyBox` mobile)
5) Seller compact row (exactly once) (`MobileSellerCard`)
6) Details accordions (`MobileAccordions`) collapsed by default
7) “More from this seller” (mobile carousel variant) and/or reviews summary (collapsed)
8) Sticky bottom bar (price + primary CTA)

Explicitly de-emphasize/avoid on mobile:
- Any “banner-like” modules before the gallery

---

## Phase 0 — Baseline + guardrails (30–60 min)

1) Establish a reproducible mobile QA run
- Use viewport ~390×844 DPR2 (your audits already use this).
- Capture baseline screenshots (top fold, mid, bottom) before changes.

2) Add invariants checklist to PR description
- Seller shown once above fold
- CTAs visible and thumb-friendly
- No new colors introduced

Acceptance criteria:
- Everyone reviewing knows exactly what “done” means.

---

## Phase 1 — Above-the-fold hierarchy (P0)

### P0.1 Make SimilarItemsBar non-invasive (or relocate)

Problem:
- A seller + thumbnails bar above the hero can push the gallery down and feel like an ad.

Action (pick ONE; simplest is recommended):
- Option A (recommended): move SimilarItemsBar below the hero (after `MobileSellerCard`) on mobile.
- Option B: keep position but remove seller identity inside the bar on mobile (thumbnails-only row).

Where:
- `app/[locale]/[username]/[productSlug]/page.tsx`
- `components/shared/product/similar-items-bar.tsx`

Acceptance criteria:
- First screen is dominated by the product itself (gallery + title/price), not banners.
- Seller identity above fold appears in exactly one place.

### P0.2 Ensure single seller module above fold

Action:
- Keep `MobileSellerCard` as the only “seller card” above the fold.
- If `ProductBuyBox` mobile shows a seller link, that link is fine, but it must not look like a second seller card.

Where:
- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/mobile-seller-card.tsx`

Acceptance criteria:
- Visually, there is one seller block (not two).

---

## Phase 2 — Touch targets + ergonomics (P0)

### P0.3 Normalize interactive sizes to mobile tokens

Use (from your tokens):
- Standard touch: 44px (`h-touch` concept)
- Icon buttons: `h-11 w-11`

Concrete checks:
- Quantity +/- buttons: ≥ 44×44
- Wishlist button: ≥ 44×44
- Add to cart: ≥ 44px height
- Sticky bar buttons: ≥ 44px height

Where:
- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/mobile-sticky-bar.tsx`

Acceptance criteria:
- A Playwright tap-target audit (or manual checks) finds no real sub-44px tap targets in the hero.

---

## Phase 3 — Truthful trust signals (P0)

Rule:
- If you don’t have the data, **don’t show the row**.

Changes:
- In `ProductBuyBox` mobile “In Stock / Free Shipping” line:
  - Show “In stock” only if stock is known and > 0
  - Show shipping text only if shipping is known
- Seller rating (“98%”) must be real, or hide it.

Where:
- `app/[locale]/[username]/[productSlug]/page.tsx` (data mapping)
- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/mobile-seller-card.tsx`

Acceptance criteria:
- No UI surfaces “98% / Free shipping / condition” unless backed by real product/seller data.

---

## Phase 4 — Reduce depth without removing value (P1)

### P1.1 Make “More from this seller” mobile-first

Behavior:
- Mobile: horizontal scroll (1 row; optional 2nd row only if needed)
- Desktop: keep the richer grid

Where:
- `components/shared/product/seller-products-grid.tsx`

Acceptance criteria:
- The page does not feel endless on mobile; below-the-fold content is still discoverable.

### P1.2 Reviews: summary-first on mobile

Behavior:
- Mobile: summary card with two buttons (“Write review”, “See all”) and collapse the heavy breakdown.

Where:
- `components/shared/product/customer-reviews-hybrid.tsx`

Acceptance criteria:
- Reviews do not dominate the mobile scroll unless user explicitly expands.

---

## Phase 5 — Visual consistency (P1/P2)

Rules:
- Prefer `border` + `bg-muted/..` over shadows.
- Use consistent radius (`rounded-lg` / `rounded-xl`) and spacing (`gap-3`, `gap-4`, `py-3`, `mt-4`).

Targets:
- Seller row, buy box action row, sticky bar, accordions.

Acceptance criteria:
- Everything looks like one system.

---

## Verification checklist (must run)

Automated:
- Task: Typecheck `pnpm -s exec tsc -p tsconfig.json --noEmit`
- E2E smoke (reuse server): `pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium`

Manual mobile QA:
- Gallery: swipe + dots + open zoom, close zoom
- Sticky bar: does not cover content; respects safe-area
- All hero controls feel thumb-friendly
- No duplicated seller surfaces

Done definition:
- Mobile above-the-fold shows gallery + title + price + CTA comfortably on first screen.
