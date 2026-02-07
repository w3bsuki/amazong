
> Execution Status: Reference Only
> This playbook is an input reference. Active execution tracking lives in codex/master-refactor-plan.md and codex/phases/*.md.

# Task: Component Library (shadcn/ui) Audit & Refactor

> **Read `codex/AGENTS.md` first.** It contains the project context, folder map, non-negotiables, and verification gates.

## Objective

Audit every component in the repository. Delete unused components. Consolidate duplicates. Enforce the folder boundary contract: `components/ui/` = primitives only, `components/shared/` = reusable composites, `components/mobile/` and `components/desktop/` = viewport-specific (or merged into responsive components in `components/shared/`). Kill all "v2", "simplified", "alternative" variants — keep one canonical version of each component.

---

## Phase 1: Kill Storybook Stories in `components/ui/`

### Current state

`components/ui/` contains 37+ `.stories.tsx` files mixed in with the primitives:
```
accordion.stories.tsx, alert-dialog.stories.tsx, alert.stories.tsx, aspect-ratio.stories.tsx,
avatar.stories.tsx, badge.stories.tsx, breadcrumb.stories.tsx, button.stories.tsx,
card.stories.tsx, checkbox.stories.tsx, command.stories.tsx, chart.stories.tsx,
dialog.stories.tsx, drawer.stories.tsx, dropdown-menu.stories.tsx, hover-card.stories.tsx,
input.stories.tsx, label.stories.tsx, pagination.stories.tsx, popover.stories.tsx,
progress.stories.tsx, radio-group.stories.tsx, scroll-area.stories.tsx, select.stories.tsx,
separator.stories.tsx, sheet.stories.tsx, skeleton.stories.tsx, slider.stories.tsx,
switch.stories.tsx, table.stories.tsx, tabs.stories.tsx, textarea.stories.tsx,
toast.stories.tsx, toggle-group.stories.tsx, toggle.stories.tsx, tooltip.stories.tsx
```

### Action

1. Delete ALL `.stories.tsx` files from `components/ui/`. Stories for primitives belong in `components/storybook/` if needed.
2. Check if `components/storybook/` needs any of these stories. If the project is not actively using Storybook for development, consider deleting all stories across the entire project.
3. Check if `components/shared/product/` has any stories files — same treatment.

---

## Phase 2: `components/ui/` Primitives Boundary Enforcement

### Rules

`components/ui/` must contain ONLY shadcn/ui primitives:
- No imports from `app/` or any route-specific code
- No business logic
- No data fetching
- No complex compositions (those go in `components/shared/`)

### Audit each file

For every file in `components/ui/`, verify:
1. It does NOT import from `app/`, `lib/data/`, `lib/supabase/`, `lib/auth/`, or any server-side module.
2. It is a genuine primitive (single responsibility, generic props like `className`, `children`, `variant`).
3. If it has app-specific behavior (Treido/iOS drawer behavior, marketplace-specific logic), move it to `components/shared/`.

### Known violations to investigate

- `components/ui/icon-button.tsx` — Might be a composite, not a primitive. Check if it wraps `Button` with icon-specific logic. If simple enough, keep; if composite, move to `components/shared/`.
- `components/ui/surface.tsx` — Unclear purpose. Read it. If it's a layout primitive, keep. If it's a Treido-specific surface component, move.

---

## Phase 3: Single-File Folder Audit

Several `components/` subfolders contain only 1-3 files. Evaluate whether each folder justifies its existence:

### `components/sections/` — 1 file
- `start-selling-banner.tsx`
- Action: Move to `components/shared/` (or to the route that uses it as `_components/`). Delete `components/sections/`.

### `components/navigation/` — 1 file
- `app-breadcrumb.tsx`
- Action: Move to `components/layout/` (it's part of the app shell). Delete `components/navigation/`.

### `components/charts/` — 1 file
- `chart-area-interactive.tsx`
- Action: Check if used. If yes, move to `components/shared/charts/`. If no, delete. Delete `components/charts/`.

### `components/design-system2/` — 1 file
- `theme.css`
- Action: This should already be handled by `tailwindv4.md` task. If it still exists, merge into `globals.css` and delete the folder.

### `components/onboarding/` — 3 files
- `account-type-card.tsx`, `interest-chip.tsx`, `onboarding-shell.tsx`
- Action: Check if these are used by `app/[locale]/(onboarding)/`. If yes, either keep here or move to `app/[locale]/(onboarding)/_components/` since they're route-private. If unused, delete.

### `components/pricing/` — 1 file
- `plan-card.tsx`
- Action: Check if used by `app/[locale]/(plans)/`. If yes, move to `app/[locale]/(plans)/_components/`. If shared across routes, move to `components/shared/`. Delete `components/pricing/`.

### `components/seller/` — 2 files
- `follow-seller-button.tsx`, `follow-seller-button.stories.tsx`
- Action: Delete the story file. Check if the component is used. If yes, move to `components/shared/seller/`.  Delete `components/seller/`.

### `components/orders/` — 2 files
- `order-status-badge.tsx`, `order-status-config.ts`
- Action: Check if used. If yes, move to `components/shared/orders/`. If only used by one route, move to that route's `_components/`. Delete `components/orders/`.

### `components/grid/` — 2 files (+index.ts)
- `product-grid.tsx`, `index.ts`
- Action: `components/shared/product/` already has a `product-grid.tsx`. Check if `components/grid/product-grid.tsx` is a duplicate. If yes, delete the duplicate and its folder. Update all importers.

---

## Phase 4: Mobile vs Desktop Consolidation

### The problem

The codebase has separate `components/mobile/` and `components/desktop/` folders with parallel implementations:

**Mobile:**
```
mobile/mobile-home.tsx
mobile/mobile-category-browser.tsx
mobile/mobile-category-browser-contextual.tsx
mobile/mobile-category-browser-traditional.tsx
mobile/mobile-tab-bar.tsx
mobile/mobile-menu-sheet.tsx
mobile/home-section-header.tsx
mobile/home-sticky-category-pills.tsx
mobile/category-nav/
mobile/drawers/
mobile/filters/
mobile/product/
```

**Desktop:**
```
desktop/desktop-home.tsx
desktop/desktop-search.tsx
desktop/desktop-filter-modal.tsx
desktop/desktop-filter-toolbar.tsx
desktop/filters-sidebar.tsx
desktop/category-sidebar.tsx
desktop/feed-toolbar.tsx
desktop/quick-filter-pills.tsx
desktop/promoted-section.tsx
desktop/product/
```

### Actions

#### 4.1 Category Browser Variants

There are THREE category browser variants in mobile:
- `mobile-category-browser.tsx`
- `mobile-category-browser-contextual.tsx`
- `mobile-category-browser-traditional.tsx`

Plus a `category-nav/` subfolder. Determine which variant is actually used on the live homepage. Delete the unused variants. There should be ONE category browser component.

#### 4.2 Home Page Components

- `mobile/mobile-home.tsx` and `desktop/desktop-home.tsx` — These are the two entry points for the homepage. They MUST remain separate because they render fundamentally different layouts. BUT: check that there's only ONE of each. No "homeV2", "home-simplified", etc.

#### 4.3 Filter Components

- `mobile/filters/mobile-filter-controls.tsx`
- `desktop/desktop-filter-modal.tsx`
- `desktop/desktop-filter-toolbar.tsx`
- `desktop/filters-sidebar.tsx`
- `components/shared/filters/` (18+ files!)

This is a major area of potential duplication. Audit all filter components:
1. Map out which filter components render which UI.
2. Find duplicated filter logic.
3. The shared filter logic should live in `components/shared/filters/`. Viewport-specific wrappers can remain in `mobile/` and `desktop/`.
4. Delete any filter component that is unused or redundant.

#### 4.4 Product Components

- `mobile/product/` — 5 files (mobile product page components)
- `desktop/product/` — 5 files (desktop product page components)
- `components/shared/product/` — 30+ files! this is the main product component library

Audit for:
1. Duplicate product card implementations
2. Product page components that could be responsive instead of separate mobile/desktop
3. Unused product components in `components/shared/product/`

---

## Phase 5: `components/shared/` Deep Audit

### 5.1 Duplicate Checks

Check each file in `components/shared/` for duplicates against `components/mobile/`, `components/desktop/`, and route `_components/` folders:
- `components/shared/product/product-grid.tsx` vs `components/grid/product-grid.tsx`
- `components/shared/filters/` vs `desktop/filters-sidebar.tsx`, `desktop/desktop-filter-toolbar.tsx`
- `components/shared/search/` — 7 files. Check against `desktop/desktop-search.tsx`

### 5.2 Unused Components

For every file in `components/shared/`:
```bash
grep -rn "import.*from.*shared/<filename>" --include="*.ts" --include="*.tsx" app/ components/
```

If a component has zero importers, delete it.

### 5.3 Support Components

- `components/support/customer-service-chat.tsx`
- `components/support/support-chat-widget.tsx`

Are these two components doing the same thing? If so, keep one, delete the other. If they serve different purposes, verify both are used.

---

## Phase 6: Provider Audit

`components/providers/` contains 10+ context providers:
```
auth-state-manager.tsx, cart-context.tsx, currency-context.tsx, drawer-context.tsx,
header-context.tsx, message-context.tsx, messages/, sonner.tsx, theme-provider.tsx,
wishlist-context.tsx, _lib/
```

Plus additional providers in:
- `app/[locale]/_providers/commerce-providers.tsx`
- `app/[locale]/_providers/intl-client-provider.tsx`
- `app/[locale]/(main)/_providers/onboarding-provider.tsx`

Audit for:
1. Unused providers — if no component reads from the context, delete the provider
2. Redundant providers — if two providers manage similar state, consolidate
3. Over-engineered providers — if a provider wraps a single useState, inline it into the consuming component

---

## Phase 7: Storybook Audit

`components/storybook/` contains:
- `design-system.stories.tsx`
- `introduction.mdx`
- `sellers-grid.stories.tsx`

Plus scattered story files throughout the codebase.

1. If Storybook is actively used for development, consolidate ALL story files into `components/storybook/`.
2. If Storybook is NOT actively used, delete ALL story files and consider removing `@storybook/*` dependencies (flag for human decision on dependency removal).

---

## Verification

After all changes:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s knip          # Verify no new unused exports created
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Completion Criteria

- `components/ui/` contains ONLY shadcn primitives (zero stories, zero composites, zero app imports)
- No single-file folders in `components/` — either the folder holds 2+ related files or the file is moved elsewhere
- No duplicate/variant components (no "v2", "simplified", "alternative", "traditional", "contextual" variants of the same component unless genuinely different UIs)
- `components/grid/`, `components/sections/`, `components/navigation/`, `components/design-system2/`, `components/pricing/` folders deleted (contents moved or deleted)
- Mobile category browser: exactly ONE implementation
- Filter system: no duplicate filter components across `shared/`, `mobile/`, `desktop/`
- Every component in `components/shared/` has at least one importer
- All gates pass
