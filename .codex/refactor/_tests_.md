# Folder: `__tests__/`

Status: Done — **KEEP** (Vitest unit tests)

## Decision (TL;DR)

Keep `__tests__/`.
- It’s small (26 tests) and tightly aligned with the stack (Vitest + Testing Library).
- It contains **high-leverage regression tripwires** (i18n key parity, middleware matchers/session behavior).
- It is referenced by docs and config, so it’s not random cruft.

## What it is

This is the repo’s **unit test suite** run by **Vitest** (`pnpm test:unit`). It mostly tests:
- pure utility functions (`lib/*` style logic),
- Next.js middleware helpers (proxy + Supabase session),
- a small amount of UI/hook behavior via Testing Library.

It is **not** Playwright E2E (that lives in `e2e/`).

## How it runs (evidence)

- Script entrypoint: `pnpm test:unit` → `vitest run` (`package.json:39`)
- Vitest includes this folder explicitly (`vitest.config.ts:25-31`):
  - `__tests__/**/*.{test,spec}.{ts,tsx}`
  - plus colocated tests in `lib/`, `hooks/`, `components/`
- Environment is `jsdom` with shared setup (`vitest.config.ts:22-33` and `test/setup.ts:1-35`)

Note: `test/` is **not** a second unit test folder here — it currently only contains `test/setup.ts` (shared setup file).

## Inventory (current contents)

Totals:
- `26` test files (`25` `.ts`, `1` `.tsx`)
- Hook tests live under `__tests__/hooks/` (6 files)

These tests are currently the **only** unit tests in the repo (there are no `*.test.*` files under `lib/`, `hooks/`, or `components/` yet, even though the config supports it).

### What each test covers (grouped)

| Area | Files (examples) | Why it matters |
|------|-------------------|----------------|
| i18n parity | `__tests__/i18n-messages-parity.test.ts` | Prevents silent production regressions from missing translation keys. |
| Middleware correctness | `__tests__/proxy-middleware.test.ts`, `__tests__/proxy-matcher.test.ts` | App Router middleware is easy to break during refactors; matcher/cookies/headers must stay stable. |
| Supabase session behavior | `__tests__/supabase-middleware-session.test.ts` | Guards auth redirects and locale-aware login flow. |
| Currency + formatting | `__tests__/currency.test.ts`, `__tests__/format-price.test.ts`, `__tests__/stripe-locale.test.ts` | Prevents “subtle UI correctness” bugs in a marketplace (pricing, locale URLs). |
| Product utils | `__tests__/product-card-hero-attributes.test.ts`, `__tests__/products-normalize.test.ts` | Dedupe-safe checks for normalization logic. |
| URL/image utils | `__tests__/url-utils.test.ts`, `__tests__/normalize-image-url.test.ts`, `__tests__/image-utils.test.ts` | Stops broken images/links from creeping in. |
| Validation/auth | `__tests__/validations-auth.test.ts` | Guards auth DTO/validation invariants. |
| Hooks | `__tests__/hooks/*` | Ensures hook behavior doesn’t regress during UI cleanup. |
| Component (a11y contract) | `__tests__/product-price.test.tsx` | Enforces accessible labels in a user-facing component. |

**i18n / next-intl**
- `__tests__/i18n-messages-parity.test.ts` validates message key parity between `messages/en.json` and `messages/bg.json`.

**Middleware / routing correctness**
- `__tests__/proxy-middleware.test.ts` mocks `next-intl/middleware` and Supabase session update; verifies cookie/header behavior and matcher rules.
- `__tests__/proxy-matcher.test.ts` focuses on matcher logic.
- `__tests__/supabase-middleware-session.test.ts` verifies locale-aware redirect behavior when Supabase env vars are missing.

**Pricing / currency / formatting**
- `__tests__/currency.test.ts`, `__tests__/format-price.test.ts`, `__tests__/product-card-hero-attributes.test.ts`, etc.

**URL + image normalization**
- `__tests__/url-utils.test.ts`, `__tests__/normalize-image-url.test.ts`, `__tests__/image-utils.test.ts`

**Hooks**
- `__tests__/hooks/use-mobile.test.ts` tests `useIsMobile` behavior.
- `__tests__/hooks/use-product-search.test.ts` tests debounce + fetch + localStorage flows.
- `__tests__/hooks/use-recently-viewed.test.ts`, `__tests__/hooks/use-toast.test.ts`, etc.

**Component**
- `__tests__/product-price.test.tsx` tests an accessibility contract for `ProductPrice`.

## Is it good / aligned with our stack?

Mostly yes:
- Uses the repo’s chosen unit test runner (Vitest) and React Testing Library (`vitest.config.ts:22-31`, `package.json:39`).
- Has valuable “regression tripwires” for **next-intl parity** and middleware behavior.
- UI test checks accessibility label semantics (`__tests__/product-price.test.tsx:6-22`) which aligns with our quality goals.

Also aligned with repo docs:
- `docs/00-INDEX.md` lists unit tests under `__tests__/`.
- `docs/10-I18N.md` explicitly references several `__tests__/*` files as part of i18n correctness checks.

## Issues / improvements (low risk)

1) **Global `jsdom` for all tests** (`vitest.config.ts:23`)
   - Many tests are pure functions and could run in `node` for speed.
   - Optional refactor: keep `jsdom` only for UI/hook tests using per-file environment or config matching.

2) **At least one non-asserting test** in `__tests__/hooks/use-mobile.test.ts`
   - The “updates value when resized” test sets up events but never asserts on the outcome (it currently can’t fail).

3) **Some tests are time-dependent**
   - Example: delivery date logic in `__tests__/currency.test.ts` uses `new Date()`; this is usually fine but can become flaky.
   - Optional refactor: use fake timers and pinned dates for determinism.

## Risks (if we removed it)

- We’d lose safety checks that directly protect:
  - locale routing and `next-intl` key parity,
  - middleware matchers/cookie behavior (high-risk during refactor),
  - auth redirect behavior when env/config changes.

## Keep / Move / Delete (recommendation)

**Keep (for now)**
- Keep `__tests__/` as the unit-test bucket while we’re doing aggressive deletes elsewhere.
- Keep the parity + middleware tests: they protect “easy to break” behavior.

**Move (later, for repo cleanliness)**
- Consider moving hook tests out of `__tests__/hooks/` into colocated `hooks/*.test.ts` since Vitest already includes `hooks/**/*.{test,spec}.{ts,tsx}` (`vitest.config.ts:25-29`).
- Consider colocating component tests with the component folder (same logic: `components/**/*.{test,spec}.{ts,tsx}` is included).

**Delete**
- Don’t delete this folder. It’s actively used, small, and provides high leverage safety during refactors.
- The only near-term “delete” candidates are individual tests that don’t assert anything (fix or remove when we start doing verified batches).

## Verification commands

- Unit tests: `pnpm -s test:unit`
- Unit tests with coverage: `pnpm -s test:unit:coverage`
- Full local safety net: `pnpm -s lint && pnpm -s typecheck && pnpm -s test:unit`

## Subagent prompt (copy/paste) — deeper pass

```text
AUDIT FOLDER: __tests__/
Goal: dedupe/standardize tests and remove dead coverage while preserving safety for refactors.
Output: Inventory + keep/move/delete + verification.
```
