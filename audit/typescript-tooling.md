# TypeScript + Tooling Audit — 2026-01-24

## Current state snapshot

- TypeScript: `5.9.3` (`package.json`)
- ESLint: `eslint@9.39.2` + `eslint.config.mjs`
- Unit tests: Vitest (`vitest.config.ts`)
- E2E: Playwright (`playwright.config.ts`)
- Dead code: Knip (`knip.json`)
- Duplication detection: jscpd via `pnpm dupes`

## TS config

- `tsconfig.json`:
  - `strict: true`
  - `exactOptionalPropertyTypes: true`
  - `noUncheckedIndexedAccess: true`
  - `moduleResolution: "bundler"`
  - Path alias: `@/* -> ./*`

## Baseline signals (run locally)

### Tailwind scans

- `pnpm -s styles:scan` → 0 palette findings, 0 arbitrary findings.

### Knip (dead code)

`pnpm -s knip` results (high-signal items):

- Unused dependencies: `@ai-sdk/gateway`, `@radix-ui/react-toggle`
- Unused exports (examples):
  - Sidebar exports in `components/layout/sidebar/sidebar.tsx`
  - Table exports in `components/ui/table.tsx`
  - Toast exports in `components/ui/toast.tsx`
  - Duplicate export report for `components/shared/page-shell.tsx` (`PageShell|default`)

### Build gates

- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (warnings only)
- `pnpm -s test:unit` ✅
- `pnpm -s test:e2e:smoke` ✅ (1 skipped)

### jscpd (duplication)

`pnpm -s dupes` summary:

- Total clones found: `310`
- Files analyzed: `1124`
- Total lines analyzed: `150087`
- Duplicated lines: `5410` (`3.6%`)
- Notable clone clusters:
  - Product card list vs grid card: `components/shared/product/product-card-list.tsx` ↔ `components/shared/product/product-card.tsx`
  - Filters modal/list/hub overlap: `components/shared/filters/*`
  - Drawer/dropdown overlap: cart + wishlist patterns across `components/mobile/drawers/*` and `components/layout/header/cart/*`

## Findings (Phase 1) — lane format

### Critical (blocks release)

- [x] Issue: Knip unresolved import (`./buyer-protection-badge`)  
  Impact: Blocks clean dead-code analysis and can hide runtime bundler issues  
  Evidence: `components/shared/product/product-card.tsx`  
  Fix: Remove unused import (badge rendered via `ProductCardPrice`)  
  Batch: 0 (done)

### High (next sprint)

- [ ] Issue: Unused dependencies (`@ai-sdk/gateway`, `@radix-ui/react-toggle`)  
  Impact: Bundle size + dependency surface area  
  Evidence: `package.json` (Knip unused deps)  
  Fix: Remove if truly unused (verify no dynamic/edge usage), update lockfile  
  Batch: 1 (2 files: `package.json`, `pnpm-lock.yaml`)
- [ ] Issue: Duplicate export `PageShell|default`  
  Impact: Confusing API + dead exports, complicates tree-shaking  
  Evidence: `components/shared/page-shell.tsx` (Knip duplicate exports)  
  Fix: Keep one export shape (named OR default) and update imports  
  Batch: 2 (≤13 files, scoped to `PageShell` consumers)
- [ ] Issue: Unused exports/types (sidebar/table/toast/breadcrumb/sheet, AI schema types)  
  Impact: Noise + larger maintenance surface; hides real dead code  
  Evidence: Knip unused exports list (`components/layout/sidebar/sidebar.tsx`, `components/ui/*`, `lib/ai/schemas/*`)  
  Fix: Remove exports or add usage; prefer deleting dead code over re-exporting  
  Batch: 3+ (small, by component family)
- [ ] Issue: High clone density in product cards + filters + drawers  
  Impact: High LOC duplication and drift risk; slows feature work  
  Evidence: `cleanup/dupes-report.txt` (310 clones)  
  Fix: Extract shared builders/components; keep UI contracts stable  
  Batch: 4+ (focus: product cards → filters → drawers)

### Deferred (backlog)

- [ ] Issue: Config consolidation across docs/test folders  
  Impact: Drift and duplicated maintenance  
  Evidence: `docs/`, `docs-site/`, `docs-final/` (repo)  
  Fix: Pick SSOT + archive extras  
  Batch: later (docs-only)

## Suggested cleanup gates

```bash
pnpm -s lint
pnpm -s typecheck
pnpm -s test:unit
pnpm -s test:e2e:smoke
pnpm -s knip
pnpm -s dupes
```
