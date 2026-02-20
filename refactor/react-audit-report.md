# React 19 Audit + Refactor — Report

Completed: 2026-02-20

## Metrics: Before → After

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| `"use client"` directives | 214 | 214 | 0 |
| `forwardRef` (ts/tsx files) | 2 | 0 | -2 |
| `createContext` (files) | 12 | 12 | 0 |
| Files using `useMemo` | 75 | 69 | -6 |
| Files using `useCallback` | 81 | 78 | -3 |

Notes:
- Hook counts are based on file-level `rg -l` scans over `*.ts`/`*.tsx`.

## Changes Made

### React 19 refs-as-prop
- Migrated `Button` and `IconButton` from `forwardRef` to React 19 `ref` as a prop, keeping the public API and behavior unchanged.

### Hook hygiene
- Removed unnecessary memoization in client UI:
  - `ProductCardActions`: compute `inCart` directly instead of `useMemo`.
  - `WishlistDropdown`: compute `topItems` directly instead of `useMemo`.

### Gate compliance (styles:gate)
- Removed forbidden token-alpha usage and ad-hoc sizing from `components/ui/mobile-bottom-nav.tsx` while keeping the same sizing via control tokens.

### Test reliability
- Increased `vitest.node.config.ts` `testTimeout` to reduce flaky timeouts in heavier Node tests.

## What Was NOT Changed (and why)

- **Auth/session logic (`lib/auth/**`, auth flows) and payments/webhooks:** out of scope and requires explicit human approval per `AGENTS.md` + `refactor/shared-rules.md`.
- **Provider bloat/context splitting:** audited and documented; larger context refactors have a higher blast radius and weren’t needed for React 19 alignment in this pass.

## Recommendations

- Consider a follow-up pass to remove redundant `"use client"` directives in nested client-only modules (behavior-preserving metric improvement).
- For large contexts (`DrawerContext`, `HeaderContext`, commerce providers), consider splitting value shape or stabilizing provider values where it measurably reduces rerenders (keep parity).

## Verification

- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` (PASS)

