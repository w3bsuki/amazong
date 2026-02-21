# Domain 2 — (main) Route Group

> **135 files · 16,022 LOC** — the marketplace, search, product pages, cart, home.
> **Read `refactor/shared-rules.md` first.**

---

## Scope

Everything under `app/[locale]/(main)/`. The public-facing marketplace: home page, search, product detail, cart, wishlist, category browse, deals.

## Audit Checklist

1. **Home page bloat:**
   - `_components/mobile-home.tsx` (671L) and `_components/desktop-home.tsx` (540L) = **1,211 LOC** for the home page alone
   - How much is shared between mobile and desktop? Can they share a data layer + render differently?
   - Are there home sub-components that are tiny over-extractions?

2. **Search + filters:**
   - `search/page.tsx` (597L) — oversized page component
   - `components/shared/filters/filter-hub.tsx` (579L) — the filter system
   - How many files serve the filter/search flow? Is it over-architected?

3. **Product pages:**
   - How many files are in the product detail flow? Quick view + full page + cards
   - `components/shared/product/` (23 files, 3.4K LOC) — that's a lot for product rendering

4. **Cart:**
   - `components/providers/cart-context.tsx` (461L) — oversized context
   - How many cart-related files exist? Can the provider be simplified?

5. **Desktop filter modal:**
   - `_components/desktop/desktop-filter-modal.tsx` (530L) — massive

6. **Tiny files:** List all <50L files. Merge candidates.

7. **"use client" audit:** Count and evaluate.

8. **Dead code:** Check _components/ exports for zero usage.

## Refactor Targets

### Oversized files (671L, 597L, 540L, 530L)
- Home: extract shared data/logic, keep layout-specific renderers lean
- Search page: extract filters orchestration, results rendering
- Desktop filter modal: extract filter sections

### Product component consolidation
- 23 files in `components/shared/product/` — audit each, merge tiny ones
- Quick view chrome (created in session 16) — are those small files justified?

### Cart context simplification
- 461L context provider — extract cart logic from rendering, slim the state

### "use client" sweep
- Home components and cart are likely heavy — can anything server-render?

## DON'T TOUCH
- `hooks/use-home-discovery-feed.ts` internals (data fetching strategy)
- Payment/checkout flow (separate domain)
- Product card shared components used by other domains

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
