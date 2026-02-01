# Audit — 2026-02-01 — Full project refactor + improvement

## Scope
- Goal: clean up codebase, fix priority audit findings, keep gates green (typecheck, lint, styles:gate, knip).
- Bundle: Full (NEXTJS + TW4 + SHADCN + KNIP)

## Baseline (Phase 0)

### Commands
- [x] `pnpm -s typecheck`
- [x] `pnpm -s lint`
- [x] `pnpm -s styles:gate`
- [x] `pnpm -s knip`

### Result
- Status: PASS (2026-02-01)
- Notes:
  - `lint`: 0 errors, 523 warnings
  - `styles:gate`: PASS (0 palette/arbitrary/hex/oklch/missing token offenders)
  - `knip`: 4 unused exports + 4 duplicate exports + 1 config hint
    - Unused exports:
      - `components/layout/desktop-shell.server.tsx:115`
      - `components/layout/desktop-shell.tsx:214`
      - `components/grid/grid-container.tsx:65`
      - `components/grid/product-grid.tsx:229`
    - Config hint: `proxy.ts` listed in `knip.json` as redundant entry pattern

### Checkpoint (after Phase 2–4 changes)
- Status: PASS (2026-02-01)
- Notes:
  - `knip`: clean (no unused/duplicate exports; no config hints)

## KNIP

### Scope
- Files:
  - `knip.json`
  - `components/layout/desktop-shell.server.tsx`
  - `components/layout/desktop-shell.tsx`
  - `components/grid/grid-container.tsx`
  - `components/grid/product-grid.tsx`
  - `.codex/TASKS.md`
- Lines: see Findings

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| KNIP-001 | Medium | `components/layout/desktop-shell.server.tsx`:115 | `pnpm -s knip` reports unused default export (`DesktopShell`) | Remove default export or delete file if it only exports this component; update any imports if they exist. |
| KNIP-002 | Medium | `components/layout/desktop-shell.tsx`:214 | `pnpm -s knip` reports unused default export (`DesktopShell`) | Remove default export or delete file if it only exports this component; update any imports if they exist. |
| KNIP-003 | Medium | `components/grid/grid-container.tsx`:65 | `pnpm -s knip` reports unused default export (`GridContainer`) | Remove default export or delete file if it only exports this component; update any imports if they exist. |
| KNIP-004 | Medium | `components/grid/product-grid.tsx`:229 | `pnpm -s knip` reports unused default export (`ProductGrid`) | Remove default export or delete file if it only exports this component; update any imports if they exist. |
| KNIP-005 | Medium | `.codex/TASKS.md`:39 | Task queue lists knip‑confirmed unused files/folders for deletion (ORCH‑CLN‑010) | Delete the listed files/folders after verifying no dynamic imports or runtime references remain. |
| KNIP-006 | Medium | `.codex/TASKS.md`:45 | Task queue lists knip‑confirmed unused exports for removal (ORCH‑CLN‑011) | Remove the listed exports after validating no indirect usage; re-run knip to confirm clean. |
| KNIP-007 | Low | `knip.json`:10 | Knip config hint: `proxy.ts` entry is redundant | Remove `proxy.ts` from `entry` if covered by other entry patterns; keep if it is an intentional explicit entry. |

### Acceptance Checks
- [ ] `pnpm -s knip`
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`
- [ ] `pnpm -s styles:gate`

### Risks
- Deleting components or exports can break dynamic imports, storybook stories, or runtime references that knip misses; verify with a quick search and a UI smoke check after deletions.
- Removing `proxy.ts` from knip entry could hide a legitimate entry point if it is not covered by other patterns; validate by re-running knip and ensuring proxy is still analyzed.

## NEXTJS

### Scope
- Files:
  - app/api/categories/route.ts
  - app/api/categories/[slug]/children/route.ts
  - app/api/categories/[slug]/attributes/route.ts
  - app/api/categories/products/route.ts
  - app/api/categories/counts/route.ts
  - app/api/categories/attributes/route.ts
  - app/[locale]/[username]/page.tsx
  - app/[locale]/(main)/categories/[slug]/page.tsx
  - app/[locale]/(main)/search/page.tsx
  - app/[locale]/(main)/todays-deals/page.tsx
  - app/[locale]/(account)/layout.tsx
  - lib/data/categories.ts
  - lib/data/products.ts
  - lib/data/profile-page.ts
  - lib/data/product-page.ts
  - lib/data/product-reviews.ts
  - lib/supabase/server.ts
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|

No findings.

### Acceptance Checks
- [ ] `rg -n "use cache" app lib --glob "*.ts" --glob "*.tsx"`
- [ ] `rg -n "\\b(cacheLife|cacheTag)\\b" app lib --glob "*.ts" --glob "*.tsx"`
- [ ] `rg -n "\\b(cookies|headers)\\(" app lib --glob "*.ts" --glob "*.tsx"`

### Risks
- None observed in current scope.

## TW4

### Scope
- Files:
  - `app/globals.css`
  - `app/utilities.css`
  - `app/shadcn-components.css`
  - `app/global-error.tsx`
  - `app/global-not-found.tsx`
  - `app/[locale]/(admin)/admin/orders/page.tsx`
  - `app/[locale]/(admin)/_components/admin-stats-cards.tsx`
  - `components/ui/switch.tsx`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | app/global-error.tsx:44 | Opacity hack on semantic token (`bg-destructive/10`) violates “no opacity hacks” rail. | Replace with an explicit semantic surface token (e.g., `bg-surface-subtle`) plus `text-destructive`, or add a dedicated semantic subtle token if needed. |
| TW4-002 | High | app/[locale]/(admin)/admin/orders/page.tsx:101 | Status badges use opacity modifiers (`bg-success/15`, `border-success/25`, etc.), same rail violation. | Replace with semantic subtle surface tokens and plain status text/border tokens; avoid `/xx` opacity modifiers. |
| TW4-003 | Medium | app/global-not-found.tsx:28 | Text opacity modifier (`text-muted-foreground/20`) is an opacity hack. | Use a semantic text token without opacity (e.g., `text-muted-foreground`) or add a “subtle” token explicitly. |
| TW4-004 | Medium | app/[locale]/(admin)/_components/admin-stats-cards.tsx:46 | Arbitrary container query value `@[250px]/card:*` violates “no arbitrary values.” | Replace with a standard breakpoint or define a named container size token/class. |
| TW4-005 | Medium | components/ui/switch.tsx:16 | Arbitrary value `h-(--switch-h)` (CSS var in class) is still an arbitrary utility. | Replace with a scale class or move to a tokenized utility defined in `app/globals.css`. |

### Acceptance Checks
- [ ] `pnpm -s styles:gate`
- [ ] `rg -n "bg-[a-z-]+/\\d+|text-[a-z-]+/\\d+|border-[a-z-]+/\\d+" app components`

### Risks
- Opacity modifiers and CSS-var arbitrary utilities appear widespread and can slip past `styles:gate`, leading to inconsistent theming and unreviewed token drift.

## SHADCN

### Scope
- Files:
  - components/ui/*
  - components/shared/*
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Medium | components/shared/dropdown-product-item.tsx:62 | Raw `<button>` used for an icon action inside a shared composite; bypasses shadcn primitive styling/a11y patterns. | Replace with `Button` (icon/ghost variant) or introduce a shared `IconButton` composite using `Button`. |
| SHADCN-002 | Medium | components/shared/filters/filter-list.tsx:67 | Raw `<input>` used for search instead of `Input` primitive; inconsistent styling/behavior with UI primitives. | Replace with `Input` from `components/ui/input` and keep token-safe classes via variant or wrapper. |
| SHADCN-003 | Medium | components/shared/filters/filter-list.tsx:93 | Raw `<button>` used for selectable rows; should compose with shadcn primitives for consistent behavior. | Swap to `Button` (ghost/secondary variant) or `Toggle`/`Checkbox` primitives for selection UI. |

### Acceptance Checks
- [ ] `node .codex/skills/spec-shadcn/scripts/scan.mjs`

### Risks
- Some raw controls may be intentional for fine-grained UX; replacing with primitives could require variant additions to avoid regressions.
