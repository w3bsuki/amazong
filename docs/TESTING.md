# Testing Guide - Amazong Marketplace

> **Last Updated:** December 17, 2025  
> **Test Framework:** Playwright + Axe-Core + Lighthouse CI

---

## ⚠️ ABSOLUTE RULES - READ BEFORE TOUCHING ANY TEST

### Rule #1: NEVER Make Tests Less Strict to Pass

```
❌ FORBIDDEN: Adjusting test thresholds to make failing tests pass
❌ FORBIDDEN: Adding exceptions/ignores for real errors
❌ FORBIDDEN: Commenting out failing assertions
❌ FORBIDDEN: Increasing timeouts to hide slow performance
❌ FORBIDDEN: Skipping tests that "sometimes fail"

✅ REQUIRED: Fix the actual bug in the application code
✅ REQUIRED: If a test fails, the CODE is wrong, not the test
✅ REQUIRED: Document WHY if you must add a temporary skip (with ticket #)
```

### Rule #2: Tests Are Production Quality Gates

Tests exist to **prevent broken code from reaching production**. A failing test means:
- A real user would experience a bug
- Accessibility standards are violated
- Performance is unacceptable
- SEO will suffer

### Rule #3: Never Trust "It Works on My Machine"

If tests pass locally but fail in CI:
- The CI environment is closer to production
- Fix the code to work in both environments
- NEVER disable CI checks

### Rule #4: Hydration Errors Are Critical Bugs

React hydration mismatches are **not warnings to ignore**. They cause:
- Performance degradation (full re-renders)
- Visual flickering for users
- Broken interactivity
- SEO penalties (content mismatch)

**FIX THEM. DO NOT SUPPRESS THEM.**

### Rule #5: Console Errors Are Failures

Any `console.error` in production is unacceptable. Our tests capture these because:
- They indicate runtime issues
- They clutter browser devtools
- They often precede crashes
- Professional applications have zero console errors

---

## 📋 Test Phases Overview

| Phase | Command | Purpose | Blocking? |
|-------|---------|---------|-----------|
| 1 | `pnpm test:e2e` | Smoke tests - routes load, no crashes | YES |
| 2 | `pnpm test:a11y` | Accessibility - WCAG 2.1 AA compliance | YES |
| 3 | `pnpm test:lighthouse` | Performance - Core Web Vitals | YES |
| 4 | `pnpm test:e2e:all` | Cross-browser - Firefox, WebKit, Mobile | YES for release |

**All phases must pass before any production deployment.**

---

## Phase 1: Smoke Tests (E2E)

### Purpose
Verify that critical user journeys work without crashes or errors.

### Command
```bash
pnpm test:e2e
```

### What It Tests
- ✅ Critical routes load (`/en`, `/bg`, `/en/categories`, `/en/search`, `/en/cart`)
- ✅ Page landmarks exist (`<header>`, `<main>`, `<footer>`)
- ✅ No console.error messages
- ✅ No React hydration mismatches
- ✅ No error boundaries triggered
- ✅ Auth-gated pages redirect or show login CTA
- ✅ Mobile viewport rendering
- ✅ Basic performance sanity (page loads < 10s)

### File Location
```
e2e/smoke.spec.ts
```

### Failure Scenarios

| Error | Meaning | Fix |
|-------|---------|-----|
| Console errors on X | JavaScript errors on page | Debug and fix the JS error |
| Hydration mismatch | Server/client HTML differs | Remove `typeof window` checks, use proper hydration patterns |
| Locator not found | Element missing from DOM | Check component renders correctly |
| Timeout | Page took too long | Fix slow queries, optimize loading |

### Running Individual Tests
```bash
# Run only homepage test
pnpm exec playwright test -g "homepage loads"

# Run with visible browser
pnpm test:e2e:headed

# Run and see trace on failure
pnpm exec playwright test --trace on
```

### Phase 1 Findings (Dec 2025)
- **E2E mode env:** Playwright starts the dev server with `NEXT_PUBLIC_E2E=true` so the app can avoid remote network dependencies (e.g. external images) during smoke runs.
- **Run smoke serially:** Local Phase 1 runs are forced to **1 worker** to avoid dev-server instability under parallel compilation (observed as intermittent `Internal Server Error` / React Client Manifest errors during parallel navigation).
- **Better 404 debugging:** Smoke tests still fail on `console.error`, but they now also capture **404 response URLs** to make “Failed to load resource” errors actionable.

If Phase 1 fails intermittently, first re-run with `--workers=1` and confirm nothing else is already listening on `http://localhost:3000`.

---

## Phase 2: Accessibility Tests (WCAG)

### Purpose
Ensure the application is usable by people with disabilities and meets legal accessibility requirements (WCAG 2.1 Level AA).

### Command
```bash
pnpm test:a11y
```

### What It Tests
- ✅ Full page axe-core scans (WCAG 2.1 AA)
- ✅ Color contrast ratios
- ✅ Keyboard navigation
- ✅ Focus visibility
- ✅ Form labels and ARIA
- ✅ Heading hierarchy (h1 → h2 → h3)
- ✅ Image alt text
- ✅ Link accessible names
- ✅ Skip links
- ✅ Mobile touch target sizes (≥24px)

### File Location
```
e2e/accessibility.spec.ts
e2e/fixtures/axe-test.ts
```

### WCAG Tags Tested
```typescript
['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
```

### Failure Scenarios

| Error | Meaning | Fix |
|-------|---------|-----|
| color-contrast | Text unreadable for low vision users | Increase contrast ratio |
| image-alt | Images have no alt text | Add descriptive alt attributes |
| link-name | Links have no accessible name | Add text or aria-label |
| button-name | Buttons have no accessible name | Add text or aria-label |
| label | Form inputs have no label | Add `<label>` or aria-label |
| heading-order | Skipped heading levels (h1→h3) | Use sequential heading levels |

### Checking Specific Pages
```bash
# Run accessibility tests only
pnpm exec playwright test --project=accessibility

# Run on specific page pattern
pnpm exec playwright test -g "Homepage" --project=accessibility
```

### Manual Testing Supplement
Automated tests catch ~30-50% of accessibility issues. **You must also:**
- Test with screen reader (NVDA/VoiceOver)
- Test keyboard-only navigation
- Test at 200% zoom
- Test with high contrast mode

---

## Phase 3: Lighthouse CI (Performance)

### Purpose
Ensure the application meets Core Web Vitals thresholds for good user experience and SEO.

### Command
```bash
# Full run (starts server, runs audits)
pnpm test:lighthouse

# Local run (if server already running)
pnpm test:lighthouse:local
```

### Prerequisites
```bash
# `pnpm test:lighthouse` builds automatically.
# If you're using `pnpm test:lighthouse:local`, you must build first.
pnpm build
```

### What It Tests

#### Core Web Vitals (Google Ranking Factors)
| Metric | Threshold | What It Measures |
|--------|-----------|------------------|
| LCP | < 4000ms | Largest Contentful Paint - main content visible |
| CLS | < 0.1 | Cumulative Layout Shift - visual stability |
| FCP | < 2500ms | First Contentful Paint - something appears |
| TBT | < 600ms | Total Blocking Time - proxy for interactivity |

#### Category Scores
| Category | Minimum | Purpose |
|----------|---------|---------|
| Performance | 70% (error), 80% (target) | Page speed |
| Accessibility | 85% (error) | WCAG compliance |
| Best Practices | 90% (warn) | Security, modern APIs |
| SEO | 90% (error) | Search engine optimization |

### File Location
```
lighthouserc.js
```

### URLs Tested
```javascript
[
  'http://localhost:3000/en',
  'http://localhost:3000/en/categories',
  'http://localhost:3000/en/search?q=phone',
  'http://localhost:3000/en/cart',
]
```

### Failure Scenarios

| Error | Meaning | Fix |
|-------|---------|-----|
| LCP > 4000ms | Main content too slow | Optimize images, reduce JS, add preloading |
| CLS > 0.1 | Layout shifts | Add size attributes to images, reserve space |
| Low performance score | Overall slow | Bundle analysis, code splitting |
| Low accessibility score | WCAG issues | Run Phase 2 tests, fix violations |
| errors-in-console | JS errors detected | Fix JavaScript errors |

### Viewing Reports
```bash
# Reports uploaded to temporary public storage
# URL shown in terminal output

# Or generate local report
pnpm exec lhci collect && pnpm exec lhci assert
# Reports in ./lighthouse-reports/
```

---

## Phase 4: Cross-Browser Testing

### Purpose
Ensure the application works in all major browsers, not just Chrome.

### Command
```bash
pnpm test:e2e:all
```

### Browsers Tested
| Browser | Engine | Device |
|---------|--------|--------|
| Chromium | Blink | Desktop |
| Firefox | Gecko | Desktop |
| WebKit | WebKit | Desktop (Safari engine) |
| Mobile Chrome | Blink | Pixel 5 viewport |
| Mobile Safari | WebKit | iPhone 12 viewport |

### When To Run
- Before any production release
- After major UI changes
- After updating browser-specific CSS
- After adding new polyfills

### File Location
```
playwright.config.ts (projects configuration)
```

### Failure Scenarios

| Error | Meaning | Fix |
|-------|---------|-----|
| Firefox only fails | Gecko-specific bug | Check CSS/JS compatibility |
| WebKit only fails | Safari-specific bug | Test on real Safari, check webkit prefixes |
| Mobile fails | Responsive design bug | Check viewport, touch targets |

---

## 🚀 Complete Test Suite

### For Development (Fast Feedback)
```bash
pnpm test:e2e
```

### Before Pull Request
```bash
pnpm test:e2e && pnpm test:a11y
```

### Before Release
```bash
pnpm test:prod
```
This runs: `build → e2e → a11y → lighthouse`

### CI Pipeline
```bash
pnpm test:ci
```
This runs: `build + all playwright tests + lighthouse`

---

## 📁 File Structure

```
amazong/
├── playwright.config.ts     # Playwright configuration
├── lighthouserc.js          # Lighthouse CI configuration
├── e2e/
│   ├── smoke.spec.ts        # Phase 1: Smoke tests
│   ├── accessibility.spec.ts # Phase 2: WCAG tests
│   └── fixtures/
│       └── axe-test.ts      # Shared axe-core fixture
├── playwright-report/       # HTML test reports (git-ignored)
├── test-results/            # Test artifacts (git-ignored)
└── docs/
    └── TESTING.md           # This file
```

---

## 🔧 Debugging Failed Tests

### View HTML Report
```bash
pnpm exec playwright show-report
```

### Run With Visible Browser
```bash
pnpm exec playwright test --headed
```

### Run Single Test
```bash
pnpm exec playwright test -g "test name pattern"
```

### Debug Mode (Step Through)
```bash
pnpm exec playwright test --debug
```

### View Trace
```bash
pnpm exec playwright test --trace on
# Then open trace in report
```

### Check Screenshots
Failed tests save screenshots to:
```
test-results/<test-name>/test-failed-1.png
```

---

## 🚫 Anti-Patterns (NEVER DO THESE)

### ❌ Suppressing Hydration Warnings
```typescript
// NEVER DO THIS
const IGNORED_CONSOLE_PATTERNS = [
  /Hydration failed/i,  // ← REMOVE THIS, FIX THE BUG
]
```

### ❌ Increasing Timeouts to Hide Slowness
```typescript
// NEVER DO THIS
test('slow test', async ({ page }) => {
  await page.goto('/slow-page', { timeout: 60000 }) // ← FIX THE PAGE
})
```

### ❌ Skipping Flaky Tests
```typescript
// NEVER DO THIS
test.skip('flaky test', async () => { // ← FIX THE FLAKINESS
  // ...
})
```

### ❌ Lowering Score Thresholds
```javascript
// NEVER DO THIS in lighthouserc.js
'categories:performance': ['warn', { minScore: 0.5 }], // ← FIX PERFORMANCE
```

### ❌ Adding Exclusions for Real Issues
```typescript
// NEVER DO THIS
new AxeBuilder({ page })
  .exclude('.my-broken-component') // ← FIX THE COMPONENT
```

---

## ✅ Correct Patterns

### ✅ Fix The Actual Bug
```typescript
// Component had hydration issue
// BAD: Suppress warning
// GOOD: Fix the component

// Before (broken):
const [mounted, setMounted] = useState(false)
if (typeof window !== 'undefined') setMounted(true) // ← CAUSES HYDRATION ERROR

// After (fixed):
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), []) // ← CORRECT PATTERN
```

### ✅ Document Temporary Exceptions
```typescript
// Only if TRULY unavoidable and temporary
const KNOWN_VIOLATIONS: Record<string, string> = {
  // TICKET-123: Third-party widget has contrast issue, waiting for vendor fix
  // Remove by: 2025-01-15
  'color-contrast': 'TICKET-123',
}
```

### ✅ Optimize Instead of Timeout
```typescript
// Instead of increasing timeout:
// 1. Add loading states
// 2. Optimize database queries
// 3. Add caching
// 4. Use streaming/suspense
```

---

## 📊 Test Coverage Goals

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| Route Smoke Tests | 6 routes | 10+ routes | 🟡 |
| Accessibility Pages | 5 pages | All pages | 🟡 |
| Lighthouse URLs | 4 URLs | 8+ URLs | 🟡 |
| Cross-Browser | 5 browsers | 5 browsers | ✅ |

---

## 📅 When To Run Tests

| Trigger | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---------|---------|---------|---------|---------|
| Every commit (local) | ✅ | | | |
| Pull request | ✅ | ✅ | | |
| Merge to main | ✅ | ✅ | ✅ | |
| Release candidate | ✅ | ✅ | ✅ | ✅ |
| Production deploy | ✅ | ✅ | ✅ | ✅ |

---

## 🆘 Getting Help

1. **Test fails but unclear why:** Run with `--debug` flag
2. **Accessibility violation unclear:** Check the `helpUrl` in error output
3. **Lighthouse score dropped:** Compare reports, check `unused-javascript`
4. **Flaky test:** It's not flaky, there's a race condition. Fix it.

---

## 📝 Changelog

| Date | Change |
|------|--------|
| 2025-12-17 | Initial test infrastructure created |
| 2025-12-17 | Phase 1-4 tests implemented |
| 2025-12-17 | Detected hydration mismatches, 404 errors |

---

> **Remember:** A test that always passes is useless. A test that catches bugs is invaluable.  
> **Our tests caught real bugs on day one. That's success.**
