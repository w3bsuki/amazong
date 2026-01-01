# TypeScript Refactor Tasks (Deepthink)

## ✅ COMPLETED (2026-01-01)

### Environment Variable Safety
- Created `lib/env.ts` with type-safe environment variable helpers
- Functions like `getStripeSecretKey()`, `getSupabaseUrl()` throw early with clear errors
- Replaced all `process.env.X!` non-null assertions in webhook routes with validated getters

### Result Type Helpers  
- Created `lib/result.ts` with discriminated union `Result<T, E>` types
- Includes `ok()`, `err()`, `isOk()`, `isErr()` helpers
- `ActionResult<T>` type for consistent server action return types
- `tryAsync()` and `tryCatch()` for wrapping potentially throwing code

### API Route Type Safety
- Fixed `app/api/subscriptions/webhook/route.ts` - removed unsafe `as unknown as` casts
- Fixed `app/api/checkout/webhook/route.ts` - uses centralized `stripe` instance
- Fixed `app/api/payments/webhook/route.ts` - proper env validation
- Fixed `app/api/stores/route.ts` - uses `createAdminClient()` instead of direct SDK
- Fixed `app/api/products/route.ts` - uses `createAdminClient()` 
- Fixed `app/api/products/create/route.ts` - uses `createAdminClient()`
- Fixed `app/api/categories/[slug]/attributes/route.ts` - uses database types

### Notifications Component
- Fixed `components/dropdowns/notifications-dropdown.tsx` 
- Removed `as any` casts using proper typed queries
- Uses generated database types for `notification_preferences` table

### `as any` Cast Cleanup (2026-01-01)
- **Reduced from 38 to 6 intentional casts** (+ 2 false positives in comments)
- Fixed product API routes (`feed`, `nearby`, `deals`, `promoted`, `newest`, `search`)
- Fixed wishlist page RPC types using proper `Database["public"]["Functions"]` types
- Fixed seller dashboard types - added `slug` and `username` to type definitions
- Fixed attributes-field.tsx - typed API response properly
- Fixed sell/client.tsx - typed `accountType` as `"personal" | "business" | null`
- Fixed AI routes - proper error handling with `instanceof Error` checks
- Fixed lib/data/products.ts - created `NormalizedCategory` type for self-referencing chain
- Updated `Product.categories.parent` to accept `unknown` (Supabase returns arrays for nested joins)

### Remaining Intentional `as any` Casts (Documented)
All remaining casts have eslint-disable comments explaining the reason:

1. **PerformanceMeasureGuard.tsx** - `globalThis.performance` typing varies across environments
2. **notifications-content.tsx** (2x) - `notification_preferences` table may not be in generated types
3. **newest/route.ts** (2x) - Custom RPC functions not in generated Supabase types
4. **ai/chat/route.ts** - AI SDK tool type compatibility issue

### TypeScript Configuration ✓
- Already has strict mode enabled with all recommended options

### ESLint Safety Rules ✓
- TypeScript safety rules already configured as warnings for gradual adoption

---

## Goals
- Raise type safety to eliminate unsound `any`/assertions, align React+Next ergonomics, and ensure generated DB types drive data access.
- Keep developer speed via lintable rules and codemods instead of ad-hoc fixes.

## Configuration Hardening
- Enable `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, and `noFallthroughCasesInSwitch`; consider `exactOptionalPropertyTypes` after fixing call sites.
- Revisit `skipLibCheck: true` and plan to remove once external deps are green; document blockers.
- Audit `allowJs: true`; if JS is legacy-only, migrate or narrow `include` to drop JS files.
- Keep `moduleResolution: bundler`; verify path alias `@/*` resolves cleanly in tooling (tsc, eslint, jest/vitest, playwright).

## Safety Sweep (Codebase)
- Search and replace unsound patterns: `any`, `as any`, `<any>`, and non-null `!` assertions; convert to `unknown` + type guards.
- Add explicit return types for exported functions/modules; tighten callbacks in `map/filter/reduce` with generics where inference is poor.
- Replace broad `as Type` assertions with discriminated unions or tagged results; prefer `satisfies` for config objects.
- Enforce typed events/refs in React components; add prop types (including children) and constraints for generics.

## Runtime Validation
- Standardize on Zod (or existing schema lib) for API routes, server actions, and forms; infer types from schemas to avoid duplication.
- Add boundary validation for external inputs: query params, cookies/headers, webhook payloads, and Supabase RPC params.

## Supabase Typing
- Confirm `types/database.types.ts` remains the single source of truth; script regeneration via `pnpm supabase gen types ...` in CI.
- Wrap Supabase client creation with typed helpers (e.g., `createClient<Database>()`), and update queries to use generated row/insert types.
- Add narrow result mappers for RPCs/views; avoid `any` casting on `select`/`eq` chains.

## Utility & Model Layer
- Introduce shared result helpers: `Result<T>` or `Either` style to avoid exception-based flows.
- Add const assertions for string/enum collections; derive union types from them.
- Provide reusable type guards for user/session/category/product objects to reduce repetitive checks.

## Tooling & Automation
- Add lint rules (eslint `@typescript-eslint/no-explicit-any`, `no-unsafe-argument`, `no-non-null-assertion`) with gradual opt-in and per-folder ignore as needed.
- Create codemod/check script to fail CI on new `any`/`!` additions; track count trend.
- Wire `pnpm -s exec tsc -p tsconfig.json --noEmit` into pre-push or PR CI; add a fast `pnpm typecheck:changed` for local use.

## Rollout Plan
1) Turn on `noUncheckedIndexedAccess` behind a PR-flag; fix surfaced sites.
2) Add lint guards for `any`/`!`; fix top offenders.
3) Introduce schema validation on critical entry points (auth, checkout, listing creation) and propagate inferred types.
4) Type Supabase client and queries end-to-end; regenerate DB types and document the command.
5) Enable `exactOptionalPropertyTypes` once call sites are cleaned; drop `skipLibCheck` last.

## Acceptance Criteria
- Zero `any`/non-null assertions in app code except documented exceptions.
- All exported functions/components carry explicit return/prop types.
- API/server actions validate inputs; inferred types drive handlers.
- Supabase queries compile against generated `Database` types; regeneration documented and automated.
- Typecheck and lint gates run in CI and locally with clear commands.

---

# Executable Rollout Plan (2026-01)

This section turns the wishlist above into a staged, low-risk rollout that can be executed and verified.

## Global Constraints
- Do not loosen `tsconfig.json` strictness (keep `exactOptionalPropertyTypes: true`).
- Prefer “warnings first” for new lint rules; only tighten once the baseline is stable.
- Avoid repo-wide rewrites; fix top offenders to establish patterns.

## Stage 0 — Baseline + Safety Gates (Low Risk)

### 0.1 Add TypeScript-safety ESLint rules (warnings)
**Work**
- Install and wire `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` into `eslint.config.mjs` (ESLint v9 flat config).
- Enable these as warnings:
	- `@typescript-eslint/no-explicit-any`
	- `@typescript-eslint/no-non-null-assertion`
	- `@typescript-eslint/no-unsafe-argument`
- Add a small override strategy so tests/scripts can opt out initially.

**Acceptance**
- `pnpm -s lint` runs successfully.
- New rules produce warnings (not errors) in app code.

### 0.2 Add “no new any/!” gate (baseline-based)
**Work**
- Add a lightweight script (TypeScript AST-based) that scans:
	- `app/`, `components/`, `lib/`, `hooks/`
	- Excludes tests (`__tests__`, `e2e`, `*.test.*`, `*.spec.*`)
- Track and commit a baseline so existing debt doesn’t fail CI.
- Fail if new `any`/`as any` or non-null assertions are introduced beyond the baseline.

**Acceptance**
- `pnpm -s ts:gate` passes on main.
- If a new `as any` is added in a scanned folder, `pnpm -s ts:gate` fails with a clear message.

## Stage 1 — Fix a Top Hotspot (Sell Flow)

### 1.1 Remove `as any` from unified sell form submission handling
**Work**
- In the unified sell form, replace `result as any` access with a typed/discriminated return from the server action.
- Keep UX behavior identical (toasts, redirects, success screen).

**Acceptance**
- `pnpm -s typecheck` passes.
- No new warnings/errors introduced in the sell route.

### 1.2 Runtime validation at the boundary (already Zod-backed)
**Work**
- Ensure listing creation server action validates args and infers types from Zod schemas.
- Prefer returning a minimal, well-typed payload to the client.

**Acceptance**
- Invalid payloads return a stable error shape.

## Stage 2 — Add 1–2 Critical Boundary Validations

Pick 1–2 only (small slice):
- Subscription checkout server action (validate planId/billingPeriod with Zod; infer types).
- Payments actions (validate ids with Zod; keep error paths stable).

**Acceptance**
- Malformed inputs return a safe error and do not throw server-side.

## Stage 3 — Supabase Typing Source of Truth

### 3.1 Make `types/database.types.ts` the canonical Database type
**Work**
- Ensure Supabase helpers import `Database` from `types/database.types.ts`.
- Provide a compatibility re-export (if needed) so existing imports keep working.

**Acceptance**
- `pnpm -s typecheck` passes.
- No `Database` type duplication drift.

## Verification Commands
- `pnpm -s lint`
- `pnpm -s typecheck`
- Optional: `pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium`
