---
title: CI Configuration & Test Tasks
impact: medium
impactDescription: Proper CI setup ensures tests run reliably in all environments
tags: [ci, tasks, parallelization, coverage]
---

# ci.md — CI Configuration & Test Tasks

> CI configuration, VS Code tasks, and parallelization settings for Treido testing.

## Test Scripts

### All Available Scripts (`package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `test:unit` | `vitest run` | Run all unit tests |
| `test:unit:watch` | `vitest` | Watch mode |
| `test:unit:coverage` | `vitest run --coverage` | With coverage |
| `test:e2e` | Playwright chromium | E2E without a11y |
| `test:e2e:smoke` | Playwright smoke.spec.ts | Smoke tests only |
| `test:e2e:auth` | Playwright auth.spec.ts | Auth tests only |
| `test:e2e:all` | Playwright all browsers | Full cross-browser |
| `test:e2e:headed` | Playwright --headed | With visible browser |
| `test:a11y` | Playwright accessibility | A11y tests only |
| `test:ci` | unit + build + playwright | Full CI pipeline |
| `test:all` | lint + typecheck + all tests | Complete validation |

---

## VS Code Tasks

### Available Tasks (`.vscode/tasks.json`)

| Task | Action |
|------|--------|
| `Unit Tests (pnpm test:unit)` | Run all unit tests |
| `Run E2E Tests` | Full E2E suite |
| `E2E Smoke (reuse existing server)` | Quick smoke with dev server |
| `E2E Seller Routes (reuse existing server)` | Seller route tests |

### Task Execution

Use Command Palette: `Tasks: Run Task` → select task

---

## Reuse Existing Server (`test-reuse-server`)

### Why Use It

- **Faster local runs** — No server startup delay
- **Preserves compilation cache** — Turbopack/webpack hot modules stay warm
- **Interactive development** — Test against your running dev server

### How to Enable

```bash
# Environment variable
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Or use VS Code task
# "E2E Smoke (reuse existing server)"
```

### When NOT to Use

- CI pipelines (always start fresh)
- Testing build output (`TEST_PROD=true`)
- Cross-browser testing (needs consistent state)

---

## Parallelization (`test-ci-parallel`)

### Playwright Settings

| Environment | Workers | Reason |
|-------------|---------|--------|
| Local | Auto (parallel) | Fast feedback |
| CI | 1 (sequential) | Stability, resource limits |

### Vitest Settings

Vitest runs tests in parallel by default. No special CI configuration needed.

### Configuration

```ts
// playwright.config.ts
workers: process.env.CI ? 1 : undefined,
retries: process.env.CI ? 2 : 0,
```

---

## CI Pipeline Structure

### Recommended Pipeline Order

1. **Lint** — `pnpm lint`
2. **Typecheck** — `pnpm typecheck`
3. **Unit tests** — `pnpm test:unit`
4. **Build** — `pnpm build`
5. **E2E tests** — `pnpm test:e2e`
6. **A11y tests** — `pnpm test:a11y` (optional)

### Fast Feedback (Pre-commit)

```bash
pnpm lint && pnpm typecheck && pnpm test:unit
```

### Full CI (PR/Main)

```bash
pnpm test:ci  # Runs: unit → build → e2e
```

---

## Coverage Configuration

### Thresholds (`vitest.config.ts`)

| Metric | Threshold |
|--------|-----------|
| Lines | 80% |
| Functions | 70% |
| Branches | 60% |
| Statements | 80% |

### Coverage Reports

```bash
pnpm test:unit:coverage
```

Outputs to:
- `coverage/` — HTML report
- Console — Text summary

### Excluded from Coverage

Files requiring runtime environment:
- `lib/supabase/**`
- `lib/stripe.ts`
- `lib/data/**`
- `lib/ai/**`
- `lib/auth/**`

---

## Environment Variables

### E2E Test Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TEST_USER_EMAIL` | For auth tests | Test account email |
| `TEST_USER_PASSWORD` | For auth tests | Test account password |
| `BASE_URL` | No (default: localhost:3000) | Override base URL |
| `REUSE_EXISTING_SERVER` | No | Skip server startup |
| `TEST_PROD` | No | Test production build |

### CI-Specific Variables

| Variable | Purpose |
|----------|---------|
| `CI` | Detects CI environment |
| `PW_OUTPUT_DIR` | Test artifact directory |
| `PW_HTML_REPORT_DIR` | HTML report location |

---

## Artifact Handling

### Generated Artifacts

| Path | Content |
|------|---------|
| `test-results/` | Screenshots, videos, traces |
| `playwright-report/` | HTML report |
| `coverage/` | Coverage reports |

### CI Artifact Upload

```yaml
# Example GitHub Actions
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Retry Configuration

### E2E Retries

```ts
// playwright.config.ts
retries: process.env.CI ? 2 : 0,
```

- **CI**: 2 retries on failure (handles flakiness)
- **Local**: 0 retries (fast feedback)

### When Retries Trigger

- Network timeouts
- Flaky assertions
- Resource contention

### What to Fix (Don't Just Retry)

- Deterministic failures
- Missing `await` statements
- Incorrect selectors

---

## Debugging CI Failures

### View Playwright Report

```bash
pnpm playwright show-report
```

### View Trace Files

```bash
pnpm playwright show-trace test-results/*/trace.zip
```

### Common CI Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Timeout | Slow compilation | Increase timeout or warm routes |
| Flaky selector | DOM not ready | Add `waitForHydration()` |
| Auth failure | Missing env vars | Set `TEST_USER_*` secrets |
| Port conflict | Previous run didn't clean up | Auto-port selection handles this |

---

## Gates (Risk-Based)

### Always Run

```bash
pnpm typecheck
pnpm lint
pnpm styles:gate
```

### Risk-Based (After Changes)

```bash
pnpm test:unit                              # After logic changes
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke  # After UI changes
```

### Maintenance

```bash
pnpm knip    # Find unused code
pnpm dupes   # Find duplicate dependencies
```
