# Audit — 2026-02-01 — `/search` Mobile Header + Context Bloat

## Scope
- Goal: explain why `/search` on mobile shows the “old” two-row header (search trigger under top bar), and identify the highest-ROI sources of structure/component bloat.
- Bundle: Next.js + Tailwind v4 + shadcn + Structure
- Constraints: **Do not touch** `components/mobile/drawers/category-browse-drawer.tsx` while HUMAN is actively changing drawer behavior in another terminal.

## NEXTJS

### Scope
- Files:
  - `app/[locale]/(main)/layout.tsx`
  - `components/layout/header/app-header.tsx`
  - `components/layout/header/mobile/default-header.tsx`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | High | `components/layout/header/app-header.tsx:109-142` | `/search` is not special-cased in `detectRouteConfig`, so it falls back to `{ variant: "default" }`, which maps to the mobile header with the second-row search trigger. | Add `/search` route mapping to the intended variant, or introduce a `search` variant and route it explicitly. |
| NEXTJS-002 | Medium | `components/layout/header/mobile/default-header.tsx:15-22` | The “Search results” comment explicitly ties `/search` to `MobileDefaultHeader` (two-row header), so current behavior is consistent with the default variant. | Update the comment and rewire `/search` to the new header variant to avoid “old header” on mobile. |
| NEXTJS-003 | Low | `app/[locale]/(main)/layout.tsx:58` | `AppHeader` is always rendered without an explicit `variant`, so route auto-detection is the only control path for `/search`. | Pass an explicit `variant` via page-level override (HeaderProvider or prop) for `/search` if you don’t want route detection to decide. |

### Acceptance Checks
- [ ] Open `/search` on mobile viewport and confirm header matches the new design (no second-row search trigger).

### Risks
- Changing `/search` to a non-default variant may hide the search trigger unless the new variant provides an equivalent affordance.

## TW4

### Scope
- Files:
  - `components/layout/header/mobile/default-header.tsx`
  - `app/[locale]/(main)/search/_components/search-header.tsx`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | Medium | `components/layout/header/mobile/default-header.tsx:31` | Opacity hack on token `bg-background/90` for header surface | Replace with `bg-background` (or `bg-surface-page` if a distinct surface is desired) |
| TW4-002 | Medium | `components/layout/header/mobile/default-header.tsx:31` | Opacity hack on token `border-border/50` for header divider | Replace with `border-border` |
| TW4-003 | Medium | `components/layout/header/mobile/default-header.tsx:49` | Opacity hack on token `border-border/40` in header pill | Replace with `border-border` (or `border-hover-border` if lighter chrome is intended) |
| TW4-004 | Medium | `app/[locale]/(main)/search/_components/search-header.tsx:31` | Opacity hack on token `text-muted-foreground/60` for icon | Replace with `text-muted-foreground` (or a dedicated “subtle icon” token) |

### Acceptance Checks
- [ ] `pnpm -s styles:gate`
- [ ] Mobile `/search` header reads clean without translucent chrome

### Risks
- Header chrome may feel heavier after removing opacity; verify contrast on light/dark themes.

## SHADCN

### Scope
- Files:
  - `components/layout/header/mobile/default-header.tsx`
  - `app/[locale]/(main)/search/_components/search-header.tsx`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Medium | `components/layout/header/mobile/default-header.tsx:45` | Mobile header search trigger uses a raw `<button>` with custom classes, bypassing shadcn `Button` variants and causing inconsistent header/search control styling (focus/hover/size) versus page-level search UI. | Replace with `Button` using existing `variant`/`size`; if reused elsewhere, extract a small composite wrapper in `components/shared/` |
| SHADCN-002 | Low | `app/[locale]/(main)/search/_components/search-header.tsx:1` | Page-level search header is route-private and bespoke; without a shared composite, header/search patterns drift and “old header” regressions are likely. | Promote a shared composite in `components/shared/search/*` and reuse across header + search page where possible |

### Acceptance Checks
- [ ] `node .codex/skills/spec-shadcn/scripts/scan.mjs`
- [ ] Mobile header search trigger matches shadcn `Button` hover/focus/size tokens

### Risks
- Introducing a shared composite may require minor prop alignment between header and search page layouts.

## STRUCTURE

### Scope
- Files:
  - `components/layout/header/app-header.tsx`
  - `components/layout/header/mobile/default-header.tsx`
  - `app/[locale]/(main)/search/page.tsx`
  - `.codex/skills/spec-tailwind/scripts/scan.mjs`
  - `agents/README.md`
  - `components/shared/filters/filter-hub.tsx`
  - `components/shared/filters/filter-modal.tsx`
  - `components/layout/header/cart/mobile-cart-dropdown.tsx`
  - `components/mobile/drawers/cart-drawer.tsx`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| STRUCT-001 | High | `app/[locale]/(main)/search/page.tsx:286` | `/search` mobile renders a page-level `SearchHeader` *and* the global sticky `MobileDefaultHeader` (which includes its own search row) → stacked “header under header” feel. | Decide ownership: either (A) remove mobile `SearchHeader` in `/search` and keep the global header search row, or (B) keep `SearchHeader` and make AppHeader hide/replace its sub-search row on `/search`. |
| STRUCT-002 | Medium | `components/layout/header/app-header.tsx:93` | `hideSubheader` exists in `AppHeaderProps` but isn’t used anywhere, which is API/context bloat. | Either implement `hideSubheader` (actually hide the second row on mobile default header) or delete the prop entirely. |
| STRUCT-003 | Medium | `.codex/skills/spec-tailwind/scripts/scan.mjs:78` | TW4 scan checks only `bg|text|border-(primary|muted|accent)/NNN`, so it misses token opacity hacks like `border-border/50` and `text-muted-foreground/60` currently in header/search. | Expand the scan to catch `*-border/*`, `*-foreground/*`, `bg-background/*`, etc. (or add a second “token opacity” scan). |
| STRUCT-004 | Medium | `components/shared/filters/filter-hub.tsx:765` | Dupes report shows large cloned blocks between `FilterHub` and `FilterModal`, which is one of the biggest “too many components” drivers. | Extract shared filter helpers/components and collapse to one modal implementation; keep the other as a thin wrapper (or delete). |
| STRUCT-005 | Medium | `components/mobile/drawers/cart-drawer.tsx:101` | Dupes report shows clones between cart drawer UI and header cart dropdown UI (parallel implementations). | Extract a shared “cart items list” composite and reuse across both; keep drawer/dropdown as shells. |
| STRUCT-006 | Low | `agents/README.md:1` | `agents/` is explicitly archived (“DO NOT USE THESE TRIGGERS”) but still present, which increases repo surface area and confusion/context. | Delete `agents/` from the repo (or move it under `.codex/audit/archive/` / `docs-site/` if you want to preserve history). |

### Acceptance Checks
- [ ] `pnpm -s knip` (review unused files/exports; **do not** delete drawer files while HUMAN is actively working on them)
- [ ] `pnpm -s dupes` (use as input for consolidation tasks; do not “fix everything” at once)

### Risks
- Consolidating filters/cart has a non-trivial UX blast radius; do it in small batches with `pnpm -s typecheck` + `pnpm -s lint` + `pnpm -s styles:gate`.

