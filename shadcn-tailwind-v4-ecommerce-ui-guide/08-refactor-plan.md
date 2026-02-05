# 08 — Refactor Plan (save the project without chaos)

This is a pragmatic plan to go from “ugly generic UI” → “app-like marketplace UI” **without rewriting everything at once**.

---

## Phase 0 — Guardrails (same day)

**Goal:** prevent further UI damage.

- [ ] Freeze UI work that adds new one-off styles.
- [ ] Add `09-agent-rules.md` into your repo and enforce it.
- [ ] Create a `ui/` or `components/` structure:
  - `components/ui/*` = shadcn primitives only
  - domain components elsewhere

Deliverable: agent can’t keep producing random gray divs.

---

## Phase 1 — Tokens & base theme (1–2 PRs)

**Goal:** make your UI instantly less ugly everywhere.

1) Implement the token system in `globals.css`:
   - `:root` + `.dark`
   - `@theme inline` mapping
   - add brand + semantic colors
   - add shadow tokens (`shadow-card`, `shadow-float`)

2) Ensure base app uses token utilities:
   - `bg-background text-foreground`
   - `border-border`
   - `ring-ring`

3) Set up dark mode toggle (optional now, but token-ready)

Deliverable: consistent surfaces and color semantics.

---

## Phase 2 — App Shell (sticky header + bottom nav)

**Goal:** the “native app” feel appears.

1) Build `AppShell`
2) Build `AppHeader` with:
   - menu/categories trigger
   - search
   - wishlist + cart icons w/ badges
3) Build `BottomNav`
4) Apply safe-area padding

Deliverable: navigation feels app-like immediately.

---

## Phase 3 — Core commerce components (ProductCard first)

**Goal:** make listings look like a real marketplace.

1) Build `ProductCard` with variants:
   - `default` grid
   - `promoted` carousel
2) Ensure it includes:
   - image aspect ratio
   - promo badge
   - wishlist button overlay
   - price + optional old price
   - rating meta

Deliverable: your inventory looks premium.

---

## Phase 4 — Homepage rebuild (promoted first + vertical grid)

**Goal:** ship a conversion-focused home.

1) Promoted section:
   - shadcn `Carousel`
   - SectionHeader (“Promoted”, “See all”)
2) Category chips row
3) “New” grid feed

Deliverable: matches the screenshot structure and feels modern.

---

## Phase 5 — Categories overlay (sheet/drawer)

**Goal:** browsing becomes effortless.

1) Implement `CategoriesSheet`:
   - `SheetContent side="bottom"` (or Drawer)
   - grid of icons
   - scroll for overflow
2) Link chips and nav to categories page

Deliverable: your app can be explored without search.

---

## Phase 6 — Listings/search UX (filters + sort)

**Goal:** power-user browsing without ugliness.

- Filters: `Drawer` on mobile with sticky footer actions.
- Sort: `Select` or `DropdownMenu`.
- Skeletons and empty states.

---

## Phase 7 — Polish + metrics

- Add telemetry for:
  - search usage
  - category clicks
  - add-to-wishlist
  - add-to-cart / contact seller
- Run design QA:
  - spacing consistency
  - contrast
  - touch targets
  - performance on low-end devices

---

## Regression checklist per PR

- [ ] Visual diff review (mobile first)
- [ ] Keyboard navigation works
- [ ] Focus rings visible
- [ ] Loading skeletons show correctly
- [ ] No layout shift (CLS)
- [ ] Safe area not broken on iOS
- [ ] Colors are tokens, not hard-coded
