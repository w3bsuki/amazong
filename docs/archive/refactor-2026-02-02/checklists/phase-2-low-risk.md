# Phase 2 Checklist: Low-Risk Cleanup

> Status: 🔜 Ready to Execute | Risk: 🟢 Low

---

## Pre-Flight Check

- [ ] All gates passing: `pnpm -s typecheck ; pnpm -s lint ; pnpm -s styles:gate ; pnpm -s ts:gate`
- [x] Phase 1 audits complete
- [x] Masterplan reviewed

---

## 🔴 CRITICAL: Delete Orphaned Project

- [ ] Delete `temp-tradesphere-audit/` (entire folder — 26 files causing 47 TS errors!)
- [ ] Verify typecheck passes after deletion

```powershell
Remove-Item -Recurse -Force temp-tradesphere-audit/
pnpm -s typecheck  # Should now pass
```

---

## Dead Code Removal

### Files to Delete
- [ ] `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx` (700+ lines, unused)
- [ ] `components/shared/auth/social-input.tsx` (only consumer is above modal)
- [ ] `tmp-delete-test.txt` (temp file)

### Unused Exports to Remove
- [ ] `FieldLegend` from `components/shared/field.tsx`
- [ ] `FieldSet` from `components/shared/field.tsx`
- [ ] `CategoryMiniBar` from `components/mobile/category-nav/`

### Verification
```bash
pnpm -s typecheck
pnpm -s lint
```

---

## Critical Duplicates (Safe to Fix)

### ProductGrid Consolidation
- [ ] Audit `components/grid/ProductGrid` vs `components/shared/product/ProductGrid`
- [ ] Determine canonical location (likely `shared/product/`)
- [ ] Update all imports
- [ ] Delete duplicate
- [ ] Verify gates

### SubcategoryCircles Consolidation
- [ ] Audit `components/category/SubcategoryCircles` vs `components/mobile/SubcategoryCircles`
- [ ] Keep `category/` version
- [ ] Update imports
- [ ] Delete mobile duplicate
- [ ] Verify gates

---

## Simple Type Fixes

### Categories Page `any` Parameters
- [ ] `app/[locale]/(main)/categories/[categorySlug]/page.tsx`
- [ ] Add proper types from `getCategoryContext`
- [ ] Remove 4 `any` parameters
- [ ] Verify typecheck

### Remove @ts-ignore
- [ ] Find and fix the single `@ts-ignore` in Edge Function
- [ ] Add proper types for `.overlaps()` method

---

## Verification Gate

After all Phase 2 changes:
```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
```

---

## Exit Criteria

- [ ] All dead code removed
- [ ] Unused exports removed
- [ ] Critical duplicates consolidated
- [ ] Simple type fixes applied
- [ ] All gates passing
- [ ] Unit tests passing

---

## Next Phase

When complete, proceed to Phase 3: Structural Refactor

---

*Checklist created: 2026-02-02*
