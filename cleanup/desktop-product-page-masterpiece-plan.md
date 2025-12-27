# Desktop Product Page Masterpiece Plan (C2C Marketplace)

Date: 2025-12-27

Target route example:
- `http://localhost:3000/bg/shop4e/aysifon`

Primary goal:
- Make desktop PDP feel premium, trustworthy, and scan-friendly like top C2C marketplaces, while staying strictly inside your shadcn + Tailwind + CSS variable system.

Non-negotiable constraints (do not violate):
1. **No new colors**: do not introduce raw Tailwind colors (`text-green-600`, etc.). Use semantic tokens.
2. **Avoid “random elevation”**: do not add heavy shadows to create hierarchy; use spacing, typography, borders, muted surfaces.
3. **No fake trust UI**: if shipping/returns/rating/condition/seller stats are unknown, hide the row.
4. **No duplicated seller identity**: desktop should have a single, coherent seller presentation (not multiple competing modules).

---

## Current implementation anchors

Route composition:
- `app/[locale]/[username]/[productSlug]/page.tsx`

Key components:
- `components/shared/product/product-gallery-hybrid.tsx`
- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/seller-products-grid.tsx`
- `components/shared/product/customer-reviews-hybrid.tsx`
- `components/shared/product/product-breadcrumb.tsx`

---

## North Star desktop layout (information architecture)

Desktop should read in this order:
1) Breadcrumbs (already present)
2) Hero 2-column
   - Left: gallery
   - Right: buy box (sticky)
3) Details/specs (main column below hero)
4) More from seller
5) Reviews

Desktop hero principles:
- Constrained max width (already uses `max-w-7xl`): keep.
- Predictable column ratio (gallery should not balloon; buy box should not feel tiny).
- Sticky buy box should not overlap header.

---

## Phase 0 — Baseline + guardrails (30–60 min)

1) Capture before screenshots
- 1280×800 and 1920×945 (top fold + below fold).

2) Define desktop “done” metrics
- Above fold: user sees gallery, title, price, primary CTA without hunting.
- No duplicated seller modules.
- No placeholder data in trust surfaces.

---

## Phase 1 — Layout correctness + proportionality (P0)

### P0.1 Enforce a stable desktop grid with fixed-ish buy box width

Target:
- Use a grid that makes the right column feel intentional.

Recommended approach:
- On large screens, use a fixed sidebar width:
  - `lg:grid-cols-[minmax(0,1fr)_420px]` (adjust within 380–460 after visual check)
  - keep gap consistent (`lg:gap-10` or `lg:gap-12`)

Where:
- `app/[locale]/[username]/[productSlug]/page.tsx`

Acceptance criteria:
- On 1920px, the gallery doesn’t feel comically huge, and the buy box doesn’t look like a narrow sidebar.

### P0.2 Sticky buy box offset must match your header

Action:
- Replace magic `top-24` with a tokenized offset if you have a header height variable; otherwise keep `top-24` but verify no overlap.

Where:
- `app/[locale]/[username]/[productSlug]/page.tsx`

Acceptance criteria:
- Sticky buy box never hides under the header.

---

## Phase 2 — Desktop hierarchy inside the buy box (P0)

### P0.3 Make the buy box “decision-first”

Rules:
- The buy box should prioritize:
  1) price
  2) condition/stock (if real)
  3) primary CTA
  4) secondary actions
  5) shipping/returns summary (if real)

Avoid:
- Long-form content inside buy box (details/specs/description)

Where:
- `components/shared/product/product-buy-box.tsx`

Acceptance criteria:
- Buy box height remains reasonable (so sticky is useful).

### P0.4 Truthful seller presentation

Action:
- Seller avatar/name/link must be real.
- If seller rating/positive% is unknown, hide it.

Where:
- `components/shared/product/product-buy-box.tsx`
- `app/[locale]/[username]/[productSlug]/page.tsx` (data mapping)

Acceptance criteria:
- No “98%” placeholders on desktop.

---

## Phase 3 — Details & specifics belong in the main column (P1)

### P1.1 Create a desktop details section below the hero

Goal:
- Move long-form information to the left/main column below the fold.

Implementation guidance:
- Prefer shadcn primitives you already use (Accordion/Tabs) and keep styling minimal.
- Use existing `ItemSpecifics` rendering (already passed into buy box) but render it in the main column for desktop.

Where:
- `app/[locale]/[username]/[productSlug]/page.tsx`
- `components/shared/product/item-specifics.tsx` (if needs layout tweaks)

Acceptance criteria:
- Desktop users can scan “Item specifics” and description without the right column becoming a wall of text.

---

## Phase 4 — Below-fold modules that feel “marketplace grade” (P1)

### P1.2 More-from-seller: density + consistency

Rules:
- Keep a consistent card layout with your existing design tokens.
- Wishlist buttons (if present) must remain clear and not visually noisy.

Where:
- `components/shared/product/seller-products-grid.tsx`

Acceptance criteria:
- Grid feels intentionally spaced, not “endless tiles”.

### P1.3 Reviews: make summary scannable

Rules:
- Desktop can afford the richer layout, but avoid hard-coded colors.

Where:
- `components/shared/product/customer-reviews-hybrid.tsx`

Acceptance criteria:
- Reviews header + average rating + breakdown are readable and aligned.

---

## Phase 5 — Remove desktop regressions from prior plan executions (P0/P1)

If you previously applied any of these, revert them:
- hard-coded Tailwind colors for trust (`text-green-600`, `text-blue-600`, etc.)
- heavy shadows added only inside the product page
- “blue trust banner” styling that uses non-standard tokens (e.g. `text-cta-trust-blue`) unless it’s part of your official palette

Acceptance criteria:
- Desktop PDP uses the same palette and elevation language as the rest of the app.

---

## Verification checklist (must run)

Automated:
- Task: Typecheck `pnpm -s exec tsc -p tsconfig.json --noEmit`
- E2E smoke (reuse server): `pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium`

Manual desktop QA:
- 1280px and 1920px widths
- Sticky buy box behavior while scrolling
- Gallery proportions
- No duplicate seller identity
- No placeholder trust claims

Done definition:
- Desktop hero looks premium and stable, and the page reads with strong hierarchy without introducing new tokens.
