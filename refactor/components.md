# components/ — Refactor Audit (2026-01-28)

## Snapshot

- Size: ~40,866 lines across 273 files (`refactor/components.files.md`)
- Client files: 162 (`"use client"` inside `components/`)

## Entry Points (make these the “obvious” files)

- Header system: `components/layout/header/app-header.tsx`
- Footer: `components/layout/footer/site-footer.tsx`
- Desktop shell: `components/layout/desktop-shell.tsx`
- Product cards: `components/shared/product/product-card.tsx` (+ `components/shared/product/product-card-*`)
- Quick view: `components/shared/product/quick-view/*` (content) + wrappers:
  - Desktop dialog: `components/desktop/product/product-quick-view-dialog.tsx`
  - Mobile drawer: `components/mobile/drawers/product-quick-view-drawer.tsx`
- Cart UI surfaces:
  - Desktop dropdown: `components/layout/header/cart/cart-dropdown.tsx`
  - Mobile dropdown: `components/layout/header/cart/mobile-cart-dropdown.tsx`
  - Mobile drawer: `components/mobile/drawers/cart-drawer.tsx`

## Treido Audit — components/ (lane: frontend/refactor) — 2026-01-28

### Critical (blocks release)

- [ ] Enforce `components/ui/*` as primitives only (no app logic) → move any composites elsewhere

### High (next sprint)

- [ ] Delete unused files flagged by Knip (checkout variants + misc):
  - `components/desktop/checkout/*` (multiple files)
  - `components/mobile/checkout/*` (multiple files)
  - `components/shared/product/favorites-count.tsx`
  - `components/shared/product/mobile-accordions.tsx`
- [ ] Consolidate quick-view wrappers (dialog vs drawer) so the shared content is truly single-source
- [ ] Consolidate cart surfaces (dropdown vs drawer) to share item list + totals + actions
- [ ] Reduce filter duplication hotspots (`components/shared/filters/filter-hub.tsx` vs `components/shared/filters/filter-modal.tsx`)

### Deferred (backlog)

- [ ] Consolidate product card variants under one API (explicit variants) and delete redundant entry points
- [ ] Reduce provider/context sprawl: prefer server data + props; keep contexts thin and app-wide only when necessary

## Inventory

- Full file list: `refactor/components.files.md`

