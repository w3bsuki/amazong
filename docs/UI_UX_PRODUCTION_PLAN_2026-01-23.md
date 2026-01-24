# UI/UX Production Audit & Improvement Plan (Mobile + Desktop)

Date: **2026-01-23**

Goal: ship a production‑ready marketplace UX where **all listing signals (badges, promos, pricing, shipping flags)** are **Supabase‑backed**, and “Boost listing” reliably takes payment via Stripe and activates promotion.

This doc is an execution plan (not a new design SSOT). Canonical rails: `docs/DESIGN.md`, `docs/FRONTEND.md`, `docs/ENGINEERING.md`, `docs/BACKEND.md`, `docs/PRODUCTION.md`.

Related audits (baseline):
- `docs/UI_UX_AUDIT_2026-01-22.md`
- `docs/desktop_uiux_audit.md`
- `docs/AUDIT_DRAWERS_SHADCN_TAILWIND_V4.md`

---

## Current State (as of 2026-01-23)

### Gates / drift scans (local)
- ✅ Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- ✅ Unit tests: `pnpm test:unit`
- ✅ E2E smoke: `pnpm test:e2e:smoke`
- ✅ Tailwind scan: `pnpm -s styles:scan` (0 gradients, 0 arbitrary; hex mostly in `components/shared/filters/color-swatches.tsx`)

### Boost listing (Stripe → Supabase)
Implemented end‑to‑end:
- Checkout: `app/api/boost/checkout/route.ts` (creates Stripe Checkout Session for boosts)
- Webhook: `app/api/payments/webhook/route.ts` (listens for `checkout.session.completed` and activates boost in DB)
- Seller UI entry: `app/[locale]/(account)/account/selling/_components/boost-dialog.tsx` + `app/[locale]/(account)/account/selling/selling-products-list.tsx`

### Badges on listing cards (intended SSOT)
These *should* be data‑driven from Supabase:
- **Promoted / “Ad”**: `products.is_boosted` + `products.boost_expires_at` (and `listing_boosts` history)
- **Discount**: `products.list_price` vs `products.price`, and/or explicit sale fields `is_on_sale/sale_percent/sale_end_date`
- **Free shipping**: `products.free_shipping`

---

## Key UX Findings (what’s not production‑ready yet)

### 1) “Promoted” is not clearly labeled on the main card
Symptoms:
- `ProductFeed` passes `state="promoted"` into `ProductCard`, but `components/shared/product/product-card.tsx` does not visually surface a promoted marker (state variant is currently a no‑op).
- This matches the earlier audit note: promoted vs organic is easy to miss.

Impact:
- Paid boost value is unclear; users may distrust “Boost” if it doesn’t visibly change placement/labeling.

### 2) Badge/data propagation is inconsistent across endpoints
Findings:
- `lib/data/products.ts` `toUI()` expects `p.free_shipping`, but `normalizeProductRow()` currently does not map `free_shipping` into the normalized `Product`.
- Multiple API routes use `toUI(normalizeProductRow(p))` (e.g. `app/api/products/feed/route.ts`, `app/api/products/deals/route.ts`), so **free shipping can silently disappear** depending on which surface loaded the data.

Impact:
- Users see “random” or inconsistent badges (or badges missing) depending on where the listings are rendered.

### 3) Deals/discount semantics aren’t fully unified
Examples:
- Search “deals” filter uses “`list_price` present” best‑effort (`app/[locale]/(main)/search/_lib/search-products.ts`).
- `/api/products/deals` defines deals as explicit sale flags (`is_on_sale=true && sale_percent>0 && not expired`).
- UI discount indicators often use compare‑at math (`list_price > price`) in the card components.

Impact:
- “Deals” surfaces can show different products than “discount” badges imply.

### 4) Boost UX loop has sharp edges
Current issues:
- `app/api/boost/checkout/route.ts` uses `cancel_url` that returns to `/sell?...` (but the boost entrypoint is typically `/account/selling`), so cancel feedback/toasts won’t show.
- Seller list page only shows a success toast; it doesn’t explicitly handle “boost activation pending” (webhook can be delayed), and doesn’t intentionally refresh/poll to update the boosted state.
- Boost pricing is duplicated in UI (`BOOST_OPTIONS` in `boost-dialog.tsx`) and server (`DEFAULT_BOOST_PRICING` in `app/api/boost/checkout/route.ts`). DB‑driven pricing (`boost_prices`) is supported in the API but not surfaced in the dialog.

Impact:
- Higher support burden (“I paid but it’s not promoted”), higher cancellation, lower trust.

### 5) Seller/buyer management UX exists, but polish/consistency isn’t finished
Examples found in current code:
- Many account/seller screens use `locale === 'bg' ? ... : ...` and hardcoded strings instead of `next-intl` (rail violation).
- Seller orders UI has hardcoded English strings and emoji labels (`app/[locale]/(sell)/sell/orders/client.tsx`).
- Buyer orders page currently over‑selects (`products(*)`) in `app/[locale]/(account)/account/orders/page.tsx` (perf/cost risk).

Impact:
- i18n drift, inconsistent tone/terminology, and future maintainability issues.

### 6) “Today’s Deals” page is demo content (not Supabase‑backed)
- `app/[locale]/(main)/todays-deals/_components/todays-deals-page-client.tsx` contains hardcoded products and strings.

Impact:
- Production UX inconsistency and “fake” merch undermines marketplace trust.

---

## Product Badges & Promo SSOT (what we should enforce)

### Listing signals: source of truth table

| UI Signal | Supabase source | Write path | Read path(s) | Display rule |
|---|---|---|---|---|
| Promoted (“Ad”) | `products.is_boosted`, `products.boost_expires_at`, `listing_boosts` | Stripe webhook `app/api/payments/webhook/route.ts` | `lib/data/products.ts` + feeds/search | Show only when `is_boosted=true && boost_expires_at > now` |
| Discount percent | `products.list_price` + `products.price` OR sale fields | Seller sets via listing mgmt actions | cards/search/deals | Show only when effective discount ≥ threshold (e.g. ≥5%) |
| Deals surface | Prefer a single definition (see below) | seller action / scheduled expiry | `/api/products/deals`, search filters | Must match discount semantics |
| Free shipping | `products.free_shipping` | sell form + edit listing | everywhere | Show only when true |

### Unify “Deals”
Pick **one** definition for V1 and use it everywhere:
- Option A (simple, data‑driven): `list_price IS NOT NULL AND list_price > price`
- Option B (explicit campaigns): `is_on_sale=true AND sale_percent>0 AND sale_end_date not expired`
- Option C (best): rely on DB view (e.g. `deal_products` with `effective_discount`) and query it consistently

---

## UX Improvement Plan (prioritized, mobile + desktop)

### P0 — Release blockers (production correctness + monetization trust)
- [ ] **Promoted labeling on all listing surfaces** → ensure boosted listings are clearly marked (card badge + a11y label). Start with `components/shared/product/product-card.tsx`.
- [ ] **Fix badge propagation bugs** → ensure `free_shipping` (and any other “card flags”) survive normalization across all API routes (`lib/data/products.ts`, affected API routes).
- [ ] **Boost checkout loop UX**:
  - [ ] Return users to the initiating surface on cancel (likely `/[locale]/account/selling`)
  - [ ] Add “activation pending” handling (poll/refresh + messaging) when returning from Stripe
  - [ ] Remove pricing duplication: load options from `GET /api/boost/checkout` (backed by `boost_prices` with safe fallback)
- [ ] **Remove/convert demo “Today’s Deals”** → either:
  - [ ] replace with Supabase‑backed deals feed, or
  - [ ] convert to `ComingSoonPage` and remove links pointing to it

Verification:
- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `pnpm test:unit`
- `pnpm test:e2e:smoke`

### P1 — Seller listing management (make it “done”)
- [ ] Post‑publish step in `/sell`: after listing creation, show “Boost this listing” CTA (same dialog) and “Manage listing” CTA to `/account/selling`.
- [ ] Ensure listing actions are coherent:
  - [ ] Discount UI: clarify “compare‑at” vs “sale” vs “manual price drop”
  - [ ] Boost UI: show remaining time + expiry in list rows (and consistent promoted marker)
  - [ ] Statuses: active/draft/archived/out_of_stock language consistent with buyer‑facing states
- [ ] Seller “sales vs orders” navigation clarity: decide if `/sell/orders` and `/account/sales` both remain; otherwise consolidate.

### P2 — Orders UX (buyer + seller)
- [ ] Align UI copy and status mapping to the escrow/order lifecycle doc: `docs/MARKETPLACE-ESCROW-PLAN.md`.
- [ ] Buyer orders:
  - [ ] Reduce overfetch (`products(*)`) and define explicit select projections
  - [ ] Ensure “message seller” works reliably (conversation mapping)
- [ ] Seller orders:
  - [ ] Replace hardcoded strings/emoji with `next-intl` keys
  - [ ] Ensure status transitions are clear, guarded, and auditable

### P3 — Global UX consistency (a11y + i18n + navigation)
- [ ] **i18n rail pass**: remove remaining `locale === ... ?` branching for user‑facing strings; replace with `useTranslations()`/`getTranslations()` keys (including metadata titles/descriptions).
- [ ] **A11y pass**: icon buttons must have accessible names; touch targets ≥32px; no nested `<main>`; fix missing `alt` where needed (see `docs/UI_UX_AUDIT_2026-01-22.md`).
- [ ] Confirm drawer/sheet rules and single pattern across mobile (see `docs/AUDIT_DRAWERS_SHADCN_TAILWIND_V4.md`).

---

## Implementation Notes (batching + file targets)

Keep changes small (1–3 files per batch) and always re-run gates.

Suggested first batches:
1) **Promoted badge on `ProductCard`**:
   - Primary file: `components/shared/product/product-card.tsx`
   - Supporting: translations under `messages/en.json` + `messages/bg.json` for a single “Ad/Promoted” label used everywhere.
2) **Badge propagation SSOT**:
   - Primary file: `lib/data/products.ts` (`normalizeProductRow` + `toUI` contract)
   - Verify affected API routes: `app/api/products/feed/route.ts`, `app/api/products/deals/route.ts`
3) **Boost UX loop**:
   - Primary files: `app/api/boost/checkout/route.ts`, `app/[locale]/(account)/account/selling/_components/boost-dialog.tsx`, `app/[locale]/(account)/account/selling/selling-products-list.tsx`

---

## Open Questions (need your decisions)

1) What is the V1 definition of “Deals”?
   - Compare‑at (`list_price`) vs explicit sale (`is_on_sale/sale_percent`) vs DB view (`deal_products`).
2) Should “Boost listing” be available only from listing management (`/account/selling`), or also immediately after publish in `/sell`?
3) Should `/todays-deals` ship in V1 at all (and if yes, as marketplace deals, not Amazon‑style demo content)?

