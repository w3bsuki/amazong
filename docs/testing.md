# Testing Context

> Test conventions, configs, patterns, what to test.
> Run tests: `pnpm -s test:unit` (unit) · `pnpm -s test:e2e:smoke` (E2E)

---

## Test Infrastructure

### Three Vitest Configs

| Config | Environment | Includes | When to use |
|--------|-------------|----------|-------------|
| `vitest.config.ts` | jsdom | `__tests__/**/*.test.tsx`, `components/**/*.test.tsx` | React component tests, anything needing DOM |
| `vitest.hooks.config.ts` | jsdom | `__tests__/hooks/**/*.test.ts` | React hook tests |
| `vitest.node.config.ts` | node | `__tests__/**/*.test.ts`, `lib/**/*.test.ts` | Pure logic, server-side utils, no DOM |

All share `vitest.shared-config.ts`: path aliases (`@/`), `server-only`/`client-only` shims, `next-intl` inlined, setup file `test/setup.ts`.

### E2E Tests

Playwright (`playwright.config.ts`). Custom runner: `scripts/run-playwright.mjs`.
- `e2e/smoke.spec.ts` — core user flows
- `e2e/seller-routes.spec.ts` — seller-specific routes
- Reuse existing dev server: `REUSE_EXISTING_SERVER=true BASE_URL=http://127.0.0.1:3000`

---

## Test Directories

```
__tests__/           → Unit tests (main)
__tests__/hooks/     → Hook tests
__tests__/api/       → API/integration tests
e2e/                 → Playwright E2E tests
test/                → Shared test utilities
test/setup.ts        → Global test setup
test/shims/          → server-only / client-only shims
```

---

## What to Test

### Always unit test
- **Pure functions** in `lib/` — format-price, URL utils, validation, shipping calc
- **Server action logic** — envelope returns, error cases, edge cases
- **Architecture boundaries** — `architecture-boundaries.test.ts` enforces route privacy, `getSession()` ban, `select('*')` ban, webhook signature ordering
- **i18n key parity** — `i18n-messages-parity.test.ts` ensures en/bg stay in sync

### Component tests (jsdom)
- Render with expected props, verify key elements present
- User interaction flows (click, form submit)
- Conditional rendering (loading, error, empty states)
- Use `@testing-library/react` + `@testing-library/user-event`

### Architecture/structural tests
These are mechanical enforcement — they grep the codebase for violations:
- No cross-route-group `_components/` imports
- No `getSession()` in security-critical paths
- No `select('*')` in non-test code
- Webhook handlers call `constructEvent()` before DB writes

### E2E tests
- Critical user flows: auth, browse, checkout, sell
- Run against actual dev server

---

## Test Patterns

### Mocking Supabase
```ts
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({ from: vi.fn(), auth: { getUser: vi.fn() } }),
  createStaticClient: () => ({ from: vi.fn() }),
}))
```

### Mocking next-intl
```tsx
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
```

### Testing server actions
Test the function directly. Mock Supabase client, verify envelope return shape:
```ts
const result = await myAction(input)
expect(result).toEqual({ data: expected, error: null })
```

### Component test structure
```tsx
import { render, screen } from '@testing-library/react'

it('renders product card with title', () => {
  render(<ProductCard product={mockProduct} />)
  expect(screen.getByText('Test Product')).toBeInTheDocument()
})
```

---

## Naming Conventions

| Type | Location | Pattern |
|------|----------|---------|
| Unit tests | `__tests__/<name>.test.ts(x)` | Match the module being tested |
| Hook tests | `__tests__/hooks/<name>.test.ts` | Match the hook name |
| E2E tests | `e2e/<flow>.spec.ts` | Describe the user flow |
| Test utilities | `test/<name>.ts` | Helper functions, fixtures |

---

## Running Tests

```bash
pnpm -s test:unit              # All unit tests (all 3 vitest configs)
pnpm vitest run -c vitest.config.ts    # Only jsdom tests
pnpm vitest run -c vitest.node.config.ts  # Only node tests
pnpm -s test:e2e:smoke         # E2E smoke tests
```

---

*Last verified: 2026-02-21*
