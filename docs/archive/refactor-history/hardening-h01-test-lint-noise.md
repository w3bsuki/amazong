# Hardening H01 — Test Lint Noise Cleanup (Safe-Only)

Date: 2026-02-20

## Goal

Reduce ESLint warning noise originating from `__tests__/` and `e2e/` to improve signal and gate reliability, without changing runtime behavior or test intent.

## Hard Constraints

- No UI/pixel/UX changes.
- No DB/migrations/RLS changes.
- No auth/session logic changes (including `lib/auth/**`, `components/providers/auth-state-manager.tsx`).
- No payments/webhooks changes (Stripe routes + `lib/stripe*`).
- No test assertion changes (fix imports/typing only).
- Grep before deleting; never delete Next.js magic files.

## Phase 1 — Audit (NO code changes)

1. Capture current lint warning inventory for:
   - `__tests__/`
   - `e2e/`
2. Categorize warnings into:
   - Safe mechanical fixes (unused imports/vars, useless `undefined`, local eslint disables in tests).
   - Requires touching non-test runtime code (DEFER unless explicitly approved).
3. Identify any warnings that touch STOP areas (auth/payments/db) and exclude them.

### Audit Findings (2026-02-20)

Lint warnings found in test-only surfaces (safe to address in this task):

- `__tests__/url-utils.test.ts` — unused `vi` import.
- `__tests__/order-status.test.ts` — unused `OrderItemStatus` type import.
- `__tests__/geolocation.test.ts` — unused `ShippingZoneCode` type import.
- `__tests__/shipping.test.ts` — unused `ShippingRegion` type import; `unicorn/no-useless-undefined` for `parseShippingRegion(undefined)` (keep the explicit boundary test; fix via scoped lint disable).
- `__tests__/stripe-locale.test.ts` — unused `SupportedLocale` type import; `unicorn/no-useless-undefined` for explicit `undefined` boundary cases (keep; fix via scoped lint disable).
- `__tests__/supabase-middleware-session.test.ts` — `unicorn/no-useless-undefined` for `get: () => undefined` (replace with empty function body).
- `__tests__/hooks/use-product-search.test.ts` — unused `waitFor` + unused `React` import.
- `__tests__/hooks/use-toast.test.ts` — unused `toast` import.
- `__tests__/hooks/use-badges.test.ts` — `no-restricted-imports` (test imports route-private hook from `app/**`).
- `__tests__/hooks/use-home-discovery-feed.test.ts` — `no-restricted-imports` (test imports route-private hook from `app/**`).
- `__tests__/product-card-{desktop,mini,mobile}.test.tsx` — `@next/next/no-img-element` (`<img>` in `next/image` mock).
- `e2e/accessibility.spec.ts` — unused `makeAxeBuilder` destructure in two tests.
- `e2e/boost-checkout.spec.ts` — unused `trigger` locator; unused `{ locale }` option parameter in `mockBoostCheckout`.
- `e2e/modal-routing.spec.ts` — `unicorn/prefer-string-replace-all` on a global regex replace (safe to switch to `replaceAll`).

## Phase 2 — Plan (approval checkpoint)

Propose small batches (with file counts), e.g.:
- Batch A: Remove unused imports/vars in `__tests__/` (no logic changes).
- Batch B: Apply scoped eslint disables in test files where rules are irrelevant (e.g. `@next/next/no-img-element`).
- Batch C: Remove unused vars in `e2e/`.

If any batch would require moving runtime code across boundaries (e.g. route-private hooks into `/hooks`), STOP and ask for approval before proceeding.

### Planned Batches

- **Batch A (16 files):** Mechanical test-only lint cleanup (remove unused imports/vars, scoped eslint disables, tiny e2e refactors). No runtime code moves.


## Phase 3 — Execute (batch-by-batch)

After EACH batch, run:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

## Phase 4 — Report

1. Record:
   - Lint warnings before/after (focus: `__tests__/` + `e2e/`).
   - Files changed and why each change is behavior-safe.
   - Gate results (typecheck/lint/styles/test).
2. Run `pnpm -s architecture:scan`.
3. Update `refactor-with-opus/post-refactor-hardening.md`:
   - Check off **H01**
   - Add completion date + 1-line summary

---

## Execution (Completed 2026-02-20)

Batch A (16 files):

- Removed unused imports/types in `__tests__/` and `e2e/`.
- Added scoped eslint disables for test-only exceptions:
  - `no-restricted-imports` for tests that intentionally import route-private hooks.
  - `@next/next/no-img-element` for `next/image` mocks that render `<img>` in unit tests.
  - `unicorn/no-useless-undefined` for explicit `undefined` boundary cases (kept for coverage).
- Small e2e cleanup: removed unused `mockBoostCheckout` option param and unused locator; switched to `replaceAll` where semantics are unchanged.

## Verification

- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` — PASS
- Lint warnings: **213 → 190** (0 errors)
- `pnpm -s architecture:scan` — PASS (metrics unchanged)

## Notes / Deferred

- Benign stderr noise during tests remains (React DOM prop warnings from test mocks; expected console errors in badge hook tests). Track under **H06**.
