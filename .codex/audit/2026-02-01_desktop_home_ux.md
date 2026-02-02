# Audit — 2026-02-01 — Desktop home UX polish (feed tabs + category drilldown)

## Scope
- Goal: Fix cheap-looking desktop feed tabs; restore category context (header + subcategory circles) when drilling via sidebar.
- Bundle: UI (`spec-tailwind` + `spec-shadcn`)
- Files:
  - `components/desktop/feed-toolbar.tsx`
  - `components/desktop/desktop-home.tsx`
  - `components/category/subcategory-circles.tsx`

## TW4

### Scope
- Files:
  - components/desktop/feed-toolbar.tsx
  - components/desktop/desktop-home.tsx
  - components/category/subcategory-circles.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | components/category/subcategory-circles.tsx:116 | Opacity modifier on semantic tokens (`bg-secondary/30`, `border-border/60`) breaks TW4 rails and creates inconsistent surfaces. | Replace with token-safe surfaces (e.g., `bg-surface-subtle` + `border-border`), and use `bg-selected`/`border-selected-border` for selected state. |
| TW4-002 | Medium | components/desktop/feed-toolbar.tsx:207 | Tab buttons use `border-border/50` (opacity hack) and ad-hoc per-button surfaces; reads as “cheap pills” vs a cohesive segmented control. | Build a single segmented container (`bg-surface-subtle` + `border-border`) and style items inside it; remove opacity modifiers. |
| TW4-003 | Medium | components/desktop/feed-toolbar.tsx:262 | View toggle uses `border-border/50` (opacity hack) which drifts vs the rest of the token system. | Use `border-border` (no opacity) and rely on existing surface tokens for separation. |
| TW4-004 | High | components/desktop/desktop-home.tsx:348 | When a category is selected, desktop home renders the product grid directly; no subcategory circles like `/categories/<slug>` browse. | When `categoryPath.length > 0`, render `SubcategoryCircles` above the grid using the active category’s children. |
| TW4-005 | Medium | components/desktop/desktop-home.tsx:331 | Category selection has no strong header/context; users lose orientation after drilling via sidebar. | Add a category header (name + count) when a category is selected. Use token-safe typography and spacing. |

### Acceptance Checks
- [ ] Visual: feed tabs render as a single segmented control container (not separate outline buttons).
- [ ] Visual: selecting a category via sidebar shows a category header + subcategory circles above the product grid.
- [ ] `pnpm -s styles:gate`

### Risks
- Category “count” may be ambiguous: `categoryCounts[slug]` (global) vs the current `products.length` (filtered by tab/attributes). Decide and keep consistent with existing toolbar count.
- Avoid introducing new tokens; stay within existing semantic tokens from `app/globals.css`.

## SHADCN

### Scope
- Files:
  - components/desktop/feed-toolbar.tsx
  - components/desktop/desktop-home.tsx
  - components/category/subcategory-circles.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Medium | components/desktop/feed-toolbar.tsx:192 | Feed “tabs” are implemented as repeated `Button` instances with custom class overrides; hard to keep states consistent and doesn’t read as a segmented control. | Use shadcn `ToggleGroup` (`type="single"`) for segmented selection + consistent focus/pressed states; keep styling token-safe. |

### Acceptance Checks
- [ ] Keyboard: arrow/tab navigation works across feed tabs and focus states are visible.
- [ ] No shadcn boundary drift: no app logic is added to `components/ui/*`.
- [ ] `pnpm -s typecheck`

### Risks
- `ToggleGroup` styling may need careful tuning to avoid introducing non-token shadows/borders; keep the recipe minimal and consistent with existing `ToggleGroup` usage in the toolbar.

