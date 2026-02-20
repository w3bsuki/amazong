# Techstack Audit + Refactor — Master Checklist

> **For Codex:** Read this file at the start of every session. Update it when you finish a task.
> **For Human/Opus:** This is the single source of truth for program progress.

---

## Instructions for Codex

1. Find your assigned task below (the first unchecked `[ ]` item, or the one the human specifies).
2. Read the linked task file completely.
3. Execute the task following the protocol in that file.
4. When DONE, come back here and:
   - Change `[ ]` to `[x]`
   - Fill in the `After` column with real numbers
   - Add completion date
   - Add a 1-line summary of what changed

---

## Progress

| # | Technology | Status | Task File | Completed |
|---|-----------|--------|-----------|-----------|
| 1 | Next.js 16 (App Router) | `[x]` DONE | `refactor/nextjs-audit-refactor.md` | 2026-02-19 — routing/import alignment, loading skeleton dedupe, client-boundary 216→214 |
| 2 | React 19 | `[x]` DONE | `refactor/react-audit-refactor.md` | 2026-02-20 — forwardRef 2→0 (ref-as-prop), memo cleanup, styles:gate + Vitest timeout hardening |
| 3 | TypeScript 5.9 | `[x]` DONE | `refactor/typescript-audit-refactor.md` | 2026-02-20 — TS strictness cleanup: typed shared filters, realtime hook overload fix, marketplace badge variant alignment |
| 4 | Tailwind CSS v4 | `[x]` DONE | `refactor/tailwind-audit-refactor.md` | 2026-02-20 — Tailwind v4 audit + dead CSS utility cleanup (no token drift; styles:gate clean) |
| 5 | shadcn/ui | `[x]` DONE | `refactor/shadcn-audit-refactor.md` | 2026-02-20 — shadcn primitives audit (ui purity + variants); no gate-forced changes |
| 6 | Supabase (client/queries) | `[x]` DONE | `refactor/supabase-audit-refactor.md` | 2026-02-20 — Supabase audit (client selection + query hygiene); no behavior-risky changes applied |
| 7 | next-intl (i18n) | `[ ]` NOT STARTED | `refactor/intl-audit-refactor.md` | — |
| 8 | Testing (Vitest/Playwright) | `[ ]` NOT STARTED | `refactor/testing-audit-refactor.md` | — |
| 9 | DX & Build (ESLint/scripts/gates) | `[ ]` NOT STARTED | `refactor/dx-audit-refactor.md` | — |
| 10 | Final Cross-Cutting Sweep | `[ ]` NOT STARTED | `refactor/final-sweep.md` | — |

---

## Task Scope Summary

### 1. Next.js 16 — App Router Alignment ← READY TO RUN
- Server/Client boundary audit (`"use client"` reduction)
- Caching patterns (`"use cache"`, cache profiles, Supabase client selection)
- Route architecture (metadata, loading/error boundaries, route handler vs server action)
- Import conventions (`next/link` → `@/i18n/routing`, barrel files)
- Performance (Suspense, streaming, dynamic imports, image optimization)
- Bloat (duplicate loading.tsx, over-extracted tiny files, dead routes)

### 2. React 19 — Modern Patterns
- Server Component maximization (prop-driven clients)
- Hook patterns (custom hooks audit, unnecessary abstractions)
- Form handling (react-hook-form + Zod alignment)
- Context usage (provider bloat, unnecessary contexts)
- Ref patterns, forwardRef removal (React 19 doesn't need it)
- Event handler patterns, useCallback/useMemo audit

### 3. TypeScript 5.9 — Type Safety
- `any` elimination (replace with proper types)
- `as` cast audit (unsafe casts → type guards)
- Unused type exports
- Generic overuse (unnecessary type gymnastics)
- Zod schema alignment with TypeScript types
- `exactOptionalPropertyTypes` compliance
- Return type consistency

### 4. Tailwind CSS v4 — CSS-First Alignment
- v4 pattern compliance (CSS-first config, no JS config)
- Token enforcement audit (beyond what styles:gate catches)
- Responsive pattern consistency
- Dark mode token coverage
- Unused CSS custom properties
- Class order consistency
- Arbitrary value elimination

### 5. shadcn/ui — Component Discipline
- `components/ui/` purity (no domain logic, no data fetching)
- Component API alignment with latest shadcn patterns
- Variant consistency (CVA patterns)
- Accessibility compliance (ARIA, keyboard, focus)
- Unused shadcn components
- Component prop interface cleanup

### 6. Supabase — Client & Query Optimization
- Client selection audit (correct client per context)
- `select('*')` elimination in hot paths
- Query optimization (projections, joins, indexing hints)
- RLS policy audit (document findings, don't modify)
- Error handling patterns
- Type safety with generated types
- Connection patterns, timeout configuration

### 7. next-intl — i18n Alignment
- Key parity enforcement (en.json ↔ bg.json)
- Unused translation keys
- `setRequestLocale()` in all Server Component pages
- Navigation import audit (`@/i18n/routing` everywhere)
- Pluralization patterns
- Date/number/currency formatting consistency
- Dynamic vs static message loading

### 8. Testing — Coverage & Quality
- Test file organization audit
- Dead/stale test cleanup
- Missing test coverage for critical paths
- Test utility consolidation
- Vitest config simplification (3 configs → fewer?)
- E2E test reliability
- Structural test completeness

### 9. DX & Build — Developer Experience
- ESLint rule audit (too strict? too loose? missing rules?)
- Script consolidation (too many npm scripts?)
- Build performance
- Quality gate reliability
- Dead scripts/configs
- Dev server performance
- knip configuration accuracy

### 10. Final Cross-Cutting Sweep
- File count final reduction
- LOC final reduction
- Cross-domain duplicate detection
- Dead code final pass
- Full build verification
- Final metrics report

---

## Metrics Tracking

> Codex: Update the "After" column when you complete each task.

| Metric | Baseline (2026-02-20) | After #1 | After #2 | After #3 | After #4 | After #5 | Final |
|--------|----------------------|----------|----------|----------|----------|----------|-------|
| Source files | 937 | 937 | 940 | 945 | 945 | 945 | |
| LOC | ~131K | 128,869 | 130,095 | 130,615 | 130,615 | 130,615 | |
| `"use client"` | 216 | 214 | 214 | 224 | 224 | 224 | |
| `"use cache"` | 11 | 12 files | 12 files | 15 files | 15 files | 15 files | |
| >300L files | 93 | 88 | 87 | 87 | 87 | 87 | |
| <50L files | 248 | 252 | 249 | 251 | 251 | 251 | |
| Route handlers | 47 | 47 | 47 | 48 | 48 | 48 | |
| Loading files | 88 | 88 | 88 | 88 | 88 | 88 | |
| `any` count | TBD | | | 0 | 0 | 0 | |
| Test coverage | TBD | | | | | | |

---

## Verification Gate

After EVERY task, Codex must run:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Build must pass. Tests must pass. No regressions.

---

*Created: 2026-02-20. Codex updates this file after each completed task.*
