# Phase 0 Baseline — Pre-Refactor State

> Recorded: 2026-02-02 | Purpose: Track no-regression rules

---

## Gate Status (Before Refactor)

| Gate | Status | Notes |
|------|--------|-------|
| `pnpm -s typecheck` | ❌ 47 errors | All from `temp-tradesphere-audit/` (orphaned project to delete) |
| `pnpm -s lint` | ✅ Pass | — |
| `pnpm -s styles:gate` | ✅ Pass | — |
| `pnpm -s ts:gate` | ⚠️ Check | May have new findings |
| `pnpm -s build` | TBD | — |
| `pnpm -s test:unit` | TBD | — |

**Note:** Once `temp-tradesphere-audit/` is deleted, typecheck should pass cleanly.

---

## Known Issues (Pre-Existing)

1. **Orphaned Project:** `temp-tradesphere-audit/` — entire Vite+React project that shouldn't exist
2. **Dead Modal:** `post-signup-onboarding-modal.tsx` — 700+ lines, unused
3. **Unused Component:** `social-input.tsx` — orphaned dependency

---

## Codebase Metrics

| Metric | Value |
|--------|-------|
| Total TS/TSX files | ~500+ |
| Components (ui/) | ~40 |
| Components (shared/) | ~80 |
| Server Actions | ~15 |
| API Routes | ~20 |
| E2E Tests | ~15 |
| Unit Tests | ~25 |

---

## No-Regression Rules

After each phase, these must pass:
```powershell
pnpm -s typecheck   # 0 errors (after deleting orphaned project)
pnpm -s lint        # 0 errors
pnpm -s styles:gate # 0 errors
pnpm -s ts:gate     # 0 errors (or baselined)
```

Before Phase 4+:
```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Files Protected (High Risk)

Do NOT modify without explicit review:
- `proxy.ts` — Request routing core
- `lib/supabase/*` — Database clients
- `app/api/*/webhook/*` — Payment webhooks
- Auth flows — `app/[locale]/(auth)/*`

---

*Baseline recorded: 2026-02-02*
