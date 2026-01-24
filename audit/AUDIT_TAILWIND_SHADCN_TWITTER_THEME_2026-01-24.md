# Tailwind v4 + shadcn/ui Theme Audit (Twitter) — 2026-01-24

Goal: make the whole app look like **one product** (Twitter theme), using **semantic tokens everywhere** (no palette classes), with **tighter corners**, and a small set of reusable UI recipes for cards/badges/banners.

Scope (what this audit looked at):
- Theme/tokens: `app/globals.css` (`:root`, `.dark`, `@theme inline`, `@theme`)
- Key offenders users notice: sidebar/hamburger vs PDP (product page)
- Drift tooling: `scripts/scan-tailwind-palette.mjs`, `scripts/scan-tailwind-arbitrary.mjs` (wired via `pnpm styles:scan`)

---

## Current State Snapshot

- Tailwind: v4 (CSS-first) with `@import "tailwindcss";` and `@theme` tokens defined in `app/globals.css`.
- shadcn/ui: style `new-york`, `cssVariables: true` (`components.json`).
- We already have drift scans:
  - `pnpm -s styles:scan` (reports palette/arbitrary usage).
  - `pnpm -s styles:gate` (fails CI when drift exists).

**Key observation:** this repo is *not* “hardcoding everything” via Tailwind palette classes — the scan shows palette drift mostly in a demo route. The “weird grays” are primarily coming from **semantic tokens/recipes being used inconsistently** and from **token values diverging from the canonical Twitter theme**.

---

## Why Colors Feel “Random” (Root Causes)

### 1) Our base “Twitter” tokens diverge from the canonical Twitter theme
`app/globals.css` defines a Twitter theme, but several *load-bearing* tokens (notably `--card`, `--muted`, `--sidebar`, plus some hues) don’t match the canonical Twitter theme values. This is why some surfaces read “gray” even when you’re using semantic classes correctly (`bg-card`, `bg-muted`, etc.).

### 2) We have multiple “page canvas” recipes (and they’re visually far apart)
Examples:
- Layout shells: `bg-background` (`app/[locale]/(main)/layout.tsx`, `app/[locale]/[username]/layout.tsx`)
- Many pages: `bg-muted/30` (auth, checkout, sell, etc.)
- Mobile PDP: `bg-surface-page` (`components/mobile/product/mobile-product-page.tsx`)
- Desktop PDP: `bg-muted/30` + large `bg-background` card (`components/shared/product/product-page-layout.tsx`)

Result: you can go from “clean white Twitter UI” to “gray-tinted app” page-to-page, even though everything is “tokenized”.

### 3) Radius drift makes the UI feel inconsistent (and “too round”)
- Global tokens currently set `--radius` to ~10px.
- Card surfaces use `--radius-card` (currently ~12px) via `rounded-(--radius-card)` (`components/ui/card.tsx`).
- PDP uses a mix of `rounded-md`, `rounded-lg`, `rounded-xl` across sections.

Result: even if colors are fixed, the app still feels inconsistent.

### 4) Component boundaries exist, but recipes aren’t enforced
We have shadcn primitives, and we even have docs (`DESIGN.md`) telling people what to do — but pages still invent their own “surface + border + radius + padding + hover” combos.

Result: “every page is different styling”.

---

## Tailwind Lane Phase 1 Audit — 2026-01-24

### Critical (blocks Phase 2)
- [x] Canonicalize the **base Twitter theme tokens** → `app/globals.css` → Replace `:root` + `.dark` core tokens with the canonical Twitter theme values; keep only intentional overrides (notably smaller `--radius`).
- [x] Fix **global radius drift** → `app/globals.css`, `components/ui/card.tsx` → Set `--radius` so `rounded-md` ≈ 4px and make `--radius-card` match the system (no special 12px card rounding).
- [x] Choose **one page surface recipe** → `DESIGN.md` + shared wrapper → Define a canonical `PageShell` (canvas + padding + max-width) and stop hand-choosing `bg-muted/30` vs `bg-background` vs `bg-surface-page` per route.
- [x] Align animations plugin with v4 shadcn guidance → `package.json`, `app/globals.css` → Migrate from `tailwindcss-animate` to `tw-animate-css` (if we’re following the current shadcn baseline).

### High (do in Phase 2)
- [x] Product page (PDP) canvases: move outer wrappers to `PageShell variant="muted"` (keep inner PDP surface tokens for now) → `components/mobile/product/*`, `components/desktop/product/*`, `components/shared/product/product-page-layout.tsx`.
- [ ] Rich text: stop using `prose*` on PDP and use our tokenized `.richtext` style → `components/mobile/product/mobile-specs-tabs.tsx`, `components/desktop/product/desktop-specs-accordion.tsx`, `app/utilities.css`.
- [ ] Standardize product badges/banners/chips via variants instead of freehand spans → Prefer `components/ui/badge.tsx` variants and add a tiny `components/shared/product/product-badge.tsx` wrapper if needed.

### Deferred (Phase 3 or backlog)
- [ ] Token diet: remove/merge unused tokens in `app/globals.css` to reduce cognitive load (keep shadcn core + small marketplace layer).
- [ ] Extend drift scan to also flag `bg-white` / `text-black` / `border-gray-*` (numbers + named) in non-demo code paths.

---

## Proposed Token System (Minimal + Practical)

### Layer 0 — shadcn core (do not rename)
Keep only the standard shadcn tokens as the “global language”:
- Surfaces: `background`, `card`, `popover`
- Text: `foreground`, `muted-foreground`
- Accents: `primary`, `secondary`, `accent`, `destructive`
- Lines: `border`, `input`, `ring`
- Radius: `radius`

This layer is what gives you consistent `bg-background`, `bg-card`, `text-foreground`, `border-border`, etc.

### Layer 1 — small marketplace semantics (additions, not replacements)
Add only tokens that represent meaning (not visuals), and that appear *everywhere*:
- Status: `success`, `warning`, `error`, `info`
- Trust: `verified`, `shipping-free`
- Commerce: `price`, `price-sale`, `price-original`, `price-savings`
- Engagement: `wishlist`, `rating`

Everything else should be a component variant or composition of existing tokens.

### Layer 2 — component recipes (no new colors)
Define canonical recipes (single source of truth) for:
- Product cards (grid + list)
- Badges (promoted, sale, free shipping, verified)
- Urgency banners (low stock / sale / viewers) — derived from Layer 1
- Pills/chips (filters, tabs)

This avoids per-page styling drift while keeping the system small.

---

## Refactor Plan (Phased, Low Overhead)

### Phase 0 — Foundation (fast, high leverage)
1) Update base tokens to canonical Twitter theme values (light + dark) and set tighter `--radius`.
2) Make `Card` and other primitives follow the same radius.
3) Confirm shadcn v4 baseline (animate plugin + focus rings + selectors) matches docs.

### Phase 1 — “One canvas” across the whole app
1) Introduce a single `PageShell` wrapper (canvas + vertical padding + max width).
2) Replace route-level `min-h-screen bg-muted/30`/`bg-surface-page` drift with `PageShell`.
3) Ensure PDP matches the same surface system as search/feed.

### Phase 2 — Product UI coherence (cards/badges/banners)
1) Standardize product card variants and stop ad-hoc per-page “badges”.
2) Make PDP sections use the same card primitives + spacing scale.
3) Replace `prose` usage with `.richtext` (token-based) everywhere.

### Phase 3 — Enforcement + cleanup
1) Strengthen drift scans to prevent regressions.
2) Remove unused tokens and delete dead styling utilities.
3) Update `DESIGN.md` with the finalized tokens/recipes and examples.

---

## Verification Gates

After each batch:
```bash
pnpm -s typecheck
pnpm -s test:e2e:smoke
pnpm -s styles:gate
```
