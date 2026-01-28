# Tailwind v4 + shadcn/ui Audit — 2026-01-28

## Scope (what was audited)

- [x] Runtime code: `app/`, `components/`, `lib/`, `hooks/`
- [x] Runtime CSS layers: `app/globals.css`, `app/utilities.css`, `app/shadcn-components.css`, `app/legacy-vars.css`
- [x] Excluded: Storybook (`.storybook/`, `*.stories.*`)
- [x] Excluded: tests (`__tests__/`, `e2e/`, `test/`)
- [x] Excluded: dev/demo routes (`app/[locale]/(main)/demo*`, `app/[locale]/design-system*`)
- [x] Excluded: Knip-unused files (delete candidates)

Coverage note: scan included **717 files** across `app/`, `components/`, `lib/`, `hooks/` (after exclusions).

## Definition: “Tailwind v4 + shadcn perfection” (Treido rules)

- [ ] No Tailwind palette colors (`gray-100`, `blue-600`, `fill-amber-400`, etc.)
- [ ] No gradients (`bg-gradient-*`, `from-*`, `to-*`, `linear-gradient(`, etc.)
- [ ] No arbitrary values (`h-[42px]`, `text-[13px]`, `top-[48%]`, etc.)
- [ ] No “opacity hacks” on semantic tokens:
  - [ ] `bg-muted/30` / `bg-muted/20` / `bg-muted/50`
  - [ ] `bg-primary/10` / `bg-primary/5`
  - [ ] `border-primary/20` / `border-primary/30`
- [ ] No legacy color aliases (`bg-brand*`, `text-brand*`, `border-brand*`) in runtime UI
- [ ] No hardcoded canvas/text colors (`bg-white`, `text-black`, `text-white/80`, etc.)
- [ ] No custom shadows/glows (`shadow-[…]`, `shadow-2xl` in app UI)
- [ ] No UI animations (Treido rule: “no animations”)
- [ ] All UI uses semantic tokens from `docs/DESIGN.md` and `app/globals.css` theme bridge

## Snapshot — automated scan results (used code only)

PASS:
- Palette colors: **0**
- Gradients: **0**

FAIL (must fix):
- Arbitrary values: **38**
- `bg-muted/*` opacity usage: **271**
- `bg-primary/*` opacity usage: **160**
- `border-primary/*` opacity usage: **78**
- Hardcoded white/black (incl `/opacity`): **24**
- Legacy `brand` tokens: **236**
- Animations (`tw-animate-css` patterns): **55**
- Custom shadow utilities: **2** (`shadow-[…]`)
- Heavy shadows in runtime: **2** (`shadow-xl|2xl`)

## Top offenders (where to start)

### 1) `bg-muted/*` drift (replace with semantic surfaces)

Top files by count:
- `components/shared/filters/filter-hub.tsx`
- `components/shared/filters/filter-modal.tsx`
- `app/[locale]/(sell)/_components/fields/attributes-field.tsx`
- `app/[locale]/(sell)/_components/steps/step-details.tsx`
- `app/[locale]/(sell)/_components/ui/category-modal/index.tsx`
- `app/[locale]/(plans)/_components/plans-page-client.tsx`
- `components/desktop/desktop-search.tsx`
- `components/mobile/product/mobile-product-info-tab.tsx`
- `components/layout/sidebar/sidebar-menu-v2.tsx`

### 2) `bg-primary/*` + `border-primary/*` drift (replace with semantic interactive tokens)

Top files by count:
- `app/[locale]/(auth)/_components/welcome-client.tsx`
- `app/[locale]/(sell)/_components/fields/shipping-field.tsx`
- `app/[locale]/(account)/account/selling/_components/boost-dialog.tsx`
- `components/layout/sidebar/sidebar-menu-v2.tsx`
- `app/[locale]/(sell)/_components/ui/category-modal/index.tsx`
- `components/desktop/desktop-filter-modal.tsx`
- `app/[locale]/(sell)/_components/fields/condition-field.tsx`
- `app/[locale]/(sell)/_components/fields/pricing-field.tsx`
- `app/[locale]/(main)/assistant/_components/assistant-playground.tsx`
- `app/[locale]/(checkout)/_components/checkout-page-client.tsx`

### 3) Legacy `brand` tokens (replace with `primary` + semantic tokens)

Top files by count:
- `app/[locale]/(main)/about/_components/about-page-content.tsx`
- `app/[locale]/(main)/(support)/contact/page.tsx`
- `app/[locale]/(main)/(legal)/returns/page.tsx`
- `app/[locale]/(main)/(support)/security/page.tsx`
- `app/[locale]/(main)/registry/page.tsx`
- `app/[locale]/(account)/account/_components/account-addresses-grid.tsx`

### 4) Arbitrary values (delete or replace with tokens/utilities)

Top files by count:
- `components/shared/seller/seller-payout-setup.tsx`
- `components/ui/dialog.tsx`
- `components/mobile/horizontal-product-card.tsx`
- `components/shared/product/product-card.tsx`
- `components/layout/header/mobile/product-header.tsx`

### 5) Animations (remove)

Main sources:
- `components/ui/sheet.tsx`
- `components/ui/dialog.tsx`
- `components/ui/alert-dialog.tsx`
- `components/ui/drawer.tsx`
- `app/shadcn-components.css`

### 6) Shadows/glows (remove)

- Custom shadows (delete):
  - `components/layout/header/mobile/product-header.tsx` (`shadow-[…]`)
- Heavy shadows (downgrade/remove):
  - `components/providers/sonner.tsx` (`shadow-xl`)
  - `components/mobile/drawers/product-quick-view-drawer.tsx` (`shadow-2xl`)

## Fix cookbook (mechanical replacements)

Use `docs/DESIGN.md` as the source of truth. These are the high-signal swaps:

### Surfaces

- Replace `bg-muted/30` (and similar) with one of:
  - `bg-surface-subtle` (subtle section surfaces)
  - `bg-hover` (hover surface)
  - `bg-active` (pressed surface)
  - `bg-selected` (selected surface)

### Interactive “primary tint” states (kill `primary/10`)

- Replace `bg-primary/10` with `bg-selected` (for selected) or `bg-hover` (for hover)
- Replace `bg-primary/5` with `bg-hover`
- Replace `border-primary/20` with `border-selected-border` (selection) or `border-border` (default)

### Text contrast (kill `text-white`, `text-white/80`, `text-black`)

- Replace `bg-primary text-white` with `bg-primary text-primary-foreground`
- Replace `bg-success text-white` with `bg-success text-success-foreground`
- Replace `bg-warning text-white` with `bg-warning text-warning-foreground`
- Replace `bg-error text-white` with `bg-error text-error-foreground`
- Replace any `bg-brand*` usage with `bg-primary` + the correct `*-foreground` token

### Brand aliases (kill `brand`)

- Replace `bg-brand` → `bg-primary`
- Replace `bg-brand-dark` / `bg-brand-light` → define explicit semantic tokens (preferred) or use `bg-primary` + `hover:bg-hover` / `active:bg-active`
- Replace `text-brand` → `text-primary`
- Replace `border-brand*` → `border-selected-border` or `border-border`

### Animations (kill)

- Remove `tw-animate-css` import from `app/globals.css` once no components rely on it
- Remove `animate-in/animate-out/slide-in*/zoom-in*` classes from shadcn primitives
- Remove animation `@apply` blocks from `app/shadcn-components.css`

## Findings (lane format)

## Tailwind Lane Phase 1 Audit — 2026-01-28

### Critical (blocks production polish)

- [ ] Remove `bg-muted/*` opacity usage (271 occurrences) → replace with `bg-surface-subtle` / `bg-hover` / `bg-active` / `bg-selected` → focus: filters + sell flows
- [ ] Remove `bg-primary/*` + `border-primary/*` opacity usage (238 occurrences) → replace with semantic interactive tokens (`bg-selected`, `border-selected-border`, etc.)
- [ ] Remove legacy `brand` tokens (236 occurrences) → unify to `primary` + semantic tokens
- [ ] Remove animations (55 occurrences + `tw-animate-css` import + `app/shadcn-components.css` `@apply animate-*`)
- [ ] Remove custom shadows (`shadow-[…]`) and downgrade heavy shadows (`shadow-xl|2xl`) in runtime UI
- [ ] Replace hardcoded white/black (`text-white(/80)`, `bg-white`, `text-black`) with `*-foreground` tokens

### High (next sprint)

- [ ] Remove arbitrary values (38 occurrences) → replace with theme spacing/sizing tokens (`h-touch-*`, `max-h-*`, `rounded-*`) or delete the need (especially if animations are removed)
- [ ] Consolidate repeated “card recipes” into shared primitives (stop copy/paste of `rounded-lg border bg-muted/30 p-*`)
- [ ] Add/extend style drift gates to catch:
  - `bg-muted/*`, `bg-primary/*`, `border-primary/*`
  - `bg-brand*`, `text-brand*`, `border-brand*`
  - `text-white*`, `bg-white`, `text-black`
  - `animate-in/out` patterns (if “no animations” is enforced)

### Deferred (backlog)

- [ ] Token diet in `app/globals.css` (dedupe shadow + spacing tokens; reduce cognitive load)
- [ ] Replace hardcoded SVG placeholder colors (`lib/image-utils.ts`) with theme-aware token-derived values (if desired)
- [ ] Decide whether avatar palettes (`lib/avatar-palettes.ts`) are “product colors” (allowed) or should be theme-driven

## Execution plan (small batches, zero behavior change)

1. Batch A: replace `bg-muted/*` in one area (filters) → run `pnpm -s styles:gate` + e2e smoke
2. Batch B: replace `bg-primary/*` + `border-primary/*` in one area (sell flow) → run gates
3. Batch C: remove animations in shadcn primitives (Dialog/Sheet/Drawer) → verify keyboard/focus + e2e smoke
4. Batch D: remove `brand` aliases in public/legal/support pages → visual pass + smoke
5. Batch E: remove remaining arbitrary values + custom shadows

