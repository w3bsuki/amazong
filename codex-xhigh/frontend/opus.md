# Opus Frontend Audit — 2026-01-20

Deep-dive execution playbook for frontend architecture, component hygiene, and production readiness.

---

## Audit Scope

This audit covers:
- **Components**: 217 TSX files across 17 subdirectories
- **App routes**: 370 TSX files including pages, layouts, error boundaries
- **Hooks**: 12 reusable hooks in `hooks/`
- **Lib utilities**: 54 pure utilities and data access modules
- **Demo surfaces**: 32+ demo files (high debt)

---

## Executive Summary

### Critical Issues
1. **49 unused files** identified by Knip (concentrated in duplicate UI surfaces)
2. **Demo bloat**: 32+ demo pages generating styling violations
3. **Large "god files"** in server actions (orders.ts 863 LOC, products.ts 669 LOC)
4. **Duplicate filter implementations** (6+ filter components with overlapping logic)
5. **Header variant explosion** (7+ header variants across mobile/desktop)

### Architecture Wins (What's Working)
1. `components/ui/` boundary respected — no app imports detected
2. Token system centralized in `globals.css`
3. Data access centralized in `lib/supabase/` and `lib/data/`
4. Route-private code properly isolated with `_components/`, `_actions/`, `_lib/`

---

## Companion Files

| File | Purpose |
|------|---------|
| [opus_audit.md](./opus_audit.md) | Comprehensive checklist by domain |
| [opus_keep.md](./opus_keep.md) | Patterns and code to preserve |
| [opus_remove.md](./opus_remove.md) | Candidates for deletion |
| [opus_structure.md](./opus_structure.md) | Target architecture |
| [opus_hotspots.md](./opus_hotspots.md) | High-risk areas requiring attention |
| [opus_boundaries.md](./opus_boundaries.md) | Import rules and violations |

---

## Metrics Snapshot

```
components/
├── ui/           38 files  — shadcn primitives ✅
├── shared/       51 files  — mixed quality, filter bloat
├── layout/       22 files  — header variants need consolidation
├── mobile/       17 files  — some unused per Knip
├── desktop/      13 files  — 6 unused per Knip
├── providers/    10 files  — clean
├── dropdowns/     6 files  — 1 unused export
├── sections/      5 files  — 4 unused per Knip
├── promo/         1 file   — unused
├── category/      3 files  — clean
├── seller/        1 file   — clean
├── orders/        1 file   — clean
├── pricing/       1 file   — clean
├── auth/          2 files  — clean
├── navigation/    1 file   — clean
├── charts/        1 file   — clean
```

---

## Quick Actions

### Immediate (Safe Deletions)
```bash
# Delete 49 unused files identified by Knip
# See opus_remove.md for full list
```

### High Priority
1. Consolidate header variants → single adaptive header
2. Consolidate filter implementations → single FilterHub
3. Remove demo surfaces after confirming out-of-scope

### Medium Priority
1. Split god-file server actions into domain modules
2. Extract shared filter logic to `lib/filters/`
3. Audit mobile product components (11 unused per Knip)

---

## Verification Gates

```bash
# Must pass after any deletion/refactor
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Navigation

- **Tasks/gates**: `TODO.md`
- **Execution board**: `codex-xhigh/EXECUTION-BOARD.md`
- **Design system**: `docs/DESIGN.md`
- **Engineering rules**: `docs/ENGINEERING.md`
