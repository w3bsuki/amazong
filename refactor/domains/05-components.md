# Domain 5 — components/ Tree

> **142 files · 14,524 LOC across ui(35f/2.8K), shared(60f/6.7K), layout(15f/2.3K), auth(3f/713), providers(10f/2.2K), mobile(11f/1.7K), desktop(4f/491), dropdowns(4f/401).**
> **Read `refactor/shared-rules.md` first.**

---

## Scope

Everything under `components/`. These are cross-route shared components, UI primitives, layout shells, and providers.

## Audit Checklist

### components/shared/ (60 files · 6,743 LOC) — BIGGEST

This grew during the refactor as shared primitives were extracted. Sessions 8-16 added stat-card, header-dropdown, drawer-shell, account-menu-items, dashboard-header-shell, order-detail/*, activity-feed, order-list-item, order-summary-line, quick-view-chrome, dashboard-sidebar.

**Key questions:**
- Are the extracted primitives actually used by 2+ route groups? (That was the rule.)
  ```bash
  # For each component in components/shared/, count route group consumers
  grep -rn "from.*components/shared/" app/ --include="*.tsx" --include="*.ts" | 
    sed 's/:.*//' | sort -u  # unique consumer files
  ```
- Are any <50L files that could merge? (e.g., order-detail/ has 4 files for 257 LOC)
- `filter-hub.tsx` (579L) — the single biggest shared component. Split?

**Sub-areas:**
- `product/` (23f/3.4K) — product cards, quick view, grid. Over-fragmented?
- `filters/` (14f/1.9K) — filter system. 14 files seems a lot.
- `order-detail/` (4f/257) — average 64L each, fine
- `search/` (2f/367) — fine
- `wishlist/` (2f/230) — fine

### components/ui/ (35 files · 2,814 LOC)

shadcn primitives. Generally don't touch, but check:
- Any dead UI components nobody imports?
- Any that grew beyond primitive scope (domain logic crept in)?

### components/layout/ (15 files · 2,257 LOC)

Header, sidebar, footer.
- `sidebar/sidebar-menu.tsx` (484L) + `sidebar/sidebar.tsx` (471L) = 955L for sidebar
- `header/desktop/desktop-search.tsx` (426L) — oversized search component
- Can sidebar be simplified? Is 955L across 2 files reasonable?

### components/providers/ (10 files · 2,241 LOC)

- `cart-context.tsx` (461L) — oversized
- How many providers are there? Which are actually used?
- Any dead providers from old patterns?

### components/mobile/ (11 files · 1,678 LOC)

Mobile-specific components (drawers, tab bar).
- After session 9's drawer-shell extraction, are these properly sized?
- Any dead mobile components?

### components/auth/ (3 files · 713 LOC)

- `sign-up-form-body.tsx` (413L) — oversized
- 3 files for auth forms — count is fine, just need to split the big one

### components/desktop/ (4 files · 491 LOC) + components/dropdowns/ (4 files · 401 LOC)

Small areas. Quick audit for dead code only.

## Refactor Targets

### Oversized splits
- `filter-hub.tsx` (579L) → extract filter sections
- `sidebar-menu.tsx` (484L) + `sidebar.tsx` (471L) → slim the pair
- `cart-context.tsx` (461L) → extract cart logic/types
- `desktop-search.tsx` (426L) → extract search sections
- `sign-up-form-body.tsx` (413L) → extract form sections

### Over-extraction cleanup
- `components/shared/product/` (23 files) — merge tiny pieces
- `components/shared/filters/` (14 files) — merge tiny pieces

### Dead shared primitives
- Verify every `components/shared/` export is used by 2+ route groups
- If only used by 1 → move to that route's `_components/`
- If used by 0 → delete

### Provider simplification
- Audit all 10 providers for active usage
- Slim `cart-context.tsx`

## DON'T TOUCH
- `components/ui/` internals (shadcn managed — don't refactor)
- Auth state manager provider (`auth-state-manager.tsx`)
- Provider deletion without thorough consumer audit

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
