# Phase 18: Cross-Cutting Concerns

| Field | Value |
|-------|-------|
| **Scope** | i18n (BG locale sweep), accessibility (axe-core WCAG 2.1 AA), performance (LCP, CLS), hydration verification, error pages |
| **Routes** | All P0/P1 routes in `/bg/` locale, error pages, global sweeps |
| **Priority** | P1 |
| **Dependencies** | All phases 1–17 (runs last) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Mixed — follows auth requirements of underlying routes |
| **Status** | 📝 Planned |

---

## Source Files

| File | Purpose |
|------|---------|
| `app/global-error.tsx` | Root error boundary (client component) — `min-h-dvh flex-col items-center justify-center p-4`, buttons: `flex-col gap-3 sm:flex-row sm:justify-center` |
| `app/global-not-found.tsx` | Root 404 page (server component) — PageShell wrapper, `mx-auto max-w-md text-center`, buttons: `flex-col gap-3 sm:flex-row` |
| `app/[locale]/_components/error-boundary-ui.tsx` | Reusable ErrorBoundaryUI — `min-h-(--page-section-min-h) flex items-center justify-center px-4`, `max-w-md`, buttons: `flex-col sm:flex-row gap-3` |
| `e2e/fixtures/axe-test.ts` | axe-core Playwright fixture — WCAG 2.1 Level A + AA, excludes `.stripe-element`, `[data-testid="third-party-widget"]`, `[data-testid="cookie-consent"]` |
| `e2e/accessibility.spec.ts` | Accessibility E2E spec using axe fixture |
| `hooks/use-mobile.ts` | `useIsMobile` hook — `useSyncExternalStore` with `getServerSnapshot() => false`, source of HYDRA-002 |
| `i18n/` | next-intl configuration |
| `messages/en/` | English translation files |
| `messages/bg/` | Bulgarian translation files |

### ErrorBoundaryUI Props

```
error, reset, title, description, ctaIcon, ctaLabel, ctaHref, logPrefix
```

**Icon map:** house · storefront · cart · heart · search · users · tag · folder · user · credit-card

**E2E detection:** `assertNoErrorBoundary(page)` — verifies no error boundary is rendered.

---

## Prerequisites

- Dev server running at `http://127.0.0.1:3000`
- Both `/en/` and `/bg/` locales served
- axe-core fixture available in `e2e/fixtures/axe-test.ts`
- Admin + regular user accounts for mixed-auth route sweeps
- Phases 1–17 completed (this phase runs last as the final sweep)

---

## Known Bugs

### HYDRA-002 — useIsMobile SSR Flash

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Component** | `hooks/use-mobile.ts` — `useIsMobile` |
| **Behavior** | `useSyncExternalStore` with `getServerSnapshot() => false` causes content flash on mobile: SSR renders desktop layout, then client hydration switches to mobile. Visible as a layout shift on first paint. |
| **Affected Components** | `sidebar.tsx`, `product-quick-view-drawer.tsx`, `category-modal/index.tsx` |
| **Related** | `suppressHydrationWarning` used on price elements in wishlist-drawer to mask price format hydration mismatches |

---

## Scenarios

### i18n — Bulgarian Locale Sweep

#### S18.1 — BG Locale: Homepage Renders with Bulgarian Translations

> Verify the homepage in `/bg/` renders fully translated Bulgarian content.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/bg/` | Homepage loads with Bulgarian UI text |
| 2 | Verify header navigation labels are in Bulgarian | All nav items (categories, search placeholder, account links) display BG translations |
| 3 | Verify hero/banner text is in Bulgarian | Main heading, subheading, CTA button text are translated |
| 4 | Verify footer text is in Bulgarian | Footer links, copyright, legal text are in BG |
| 5 | Check `<html lang="bg">` attribute | Document lang attribute is `bg` |

📸 **Screenshot checkpoint:** Homepage in `/bg/` locale on Pixel 5.

---

#### S18.2 — BG Locale: Key User Flows

> Verify critical user flows render correctly in Bulgarian locale.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/bg/auth/login` | Login form labels, button text, error messages in Bulgarian |
| 2 | Navigate to `/bg/categories` | Category names and UI chrome in Bulgarian |
| 3 | Use search in `/bg/` | Search placeholder, results labels, filters in Bulgarian |
| 4 | Navigate to a PDP in `/bg/` | Product details labels (price, description, add to cart) in Bulgarian |
| 5 | Open cart drawer in `/bg/` | Cart labels, subtotal text, checkout button in Bulgarian |

📸 **Screenshot checkpoints:** Each flow step on Pixel 5.

---

#### S18.3 — Missing Translation Keys

> Verify no raw translation keys are visible in the UI.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate through all P0/P1 routes in `/bg/` locale | No visible `namespace.key` patterns (e.g., `common.addToCart`, `auth.loginButton`) |
| 2 | Check dynamically loaded content (drawers, modals, toasts) | Toast messages, drawer headers, modal text are all translated |
| 3 | Trigger error states (invalid form input, empty search) | Error/validation messages display in Bulgarian, not raw keys |
| 4 | Scan page source for untranslated patterns | `page.evaluate` — search DOM text content for dot-separated key patterns |

📸 **Screenshot checkpoint:** Any detected raw keys (should be none).

---

#### S18.4 — Currency & Date Formatting (BG Locale)

> Verify EUR currency and date values format correctly with Bulgarian locale conventions.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to a PDP in `/bg/` | Price displays with Bulgarian number formatting (e.g., `12,99 €` or locale-appropriate EUR format) |
| 2 | Check cart subtotal in `/bg/` | Subtotal uses same BG-locale EUR formatting |
| 3 | Check order dates (if visible) | Dates use BG locale format (e.g., `09.02.2026` or `9 февруари 2026`) |
| 4 | Compare same product price in `/en/` vs `/bg/` | Same numeric value, different locale formatting conventions |

📸 **Screenshot checkpoint:** Price comparison `/en/` vs `/bg/` on same product.

---

### Accessibility — axe-core WCAG 2.1 AA

#### S18.5 — axe-core Scan: Homepage

> Run axe-core accessibility audit on the homepage.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/` on Pixel 5 viewport | Homepage fully loaded |
| 2 | Run axe-core with tags `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']` | Scan completes |
| 3 | Exclude `.stripe-element`, `[data-testid="third-party-widget"]`, `[data-testid="cookie-consent"]` | Excluded elements not scanned |
| 4 | Verify 0 violations | No WCAG 2.1 AA violations on homepage |
| 5 | If violations found: log with `violationFingerprints()` and `formatViolations()` | Each violation documented with node path, impact, and fix hint |

📸 **Screenshot checkpoint:** axe-core results summary (pass or violation details).

---

#### S18.6 — axe-core Scan: Top Routes (PDP, Search, Categories)

> Run axe-core on high-traffic routes beyond the homepage.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to a PDP (`/en/product/{slug}`) | Page fully loaded |
| 2 | Run axe-core scan (same config as S18.5) | 0 violations |
| 3 | Navigate to `/en/search?q=test` | Search results loaded |
| 4 | Run axe-core scan | 0 violations |
| 5 | Navigate to `/en/categories` | Categories page loaded |
| 6 | Run axe-core scan | 0 violations |
| 7 | Use `attachAccessibilityResults()` for each | Results attached to Playwright report |

📸 **Screenshot checkpoint:** axe-core results per route.

---

#### S18.7 — Touch Targets: Systematic ≥44px Check

> Verify all interactive elements meet the 44×44px minimum touch target size.

| Step | Action | Expected |
|------|--------|----------|
| 1 | On homepage: measure all CTA buttons via `getBoundingClientRect()` | All buttons ≥44px in both width and height |
| 2 | Check header nav icons (search, cart, account) | Each icon button ≥44×44px touch target |
| 3 | Check bottom tab bar items (if applicable) | Each tab ≥44px height, tappable area covers full width segment |
| 4 | On PDP: check "Add to Cart" button, quantity controls | All ≥44×44px |
| 5 | In drawers (cart, search): check close button, action buttons | Close (×) button ≥44×44px, action buttons ≥44px height |
| 6 | Document any elements below 44px | List element, actual size, route |

📸 **Screenshot checkpoints:** Annotated measurements on undersized elements (if any).

---

#### S18.8 — Focus Management: Keyboard Tab Order

> Verify focus order and management on auth forms and drawers.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/auth/login` | Login form visible |
| 2 | Tab through form fields | Focus order: email → password → submit button (logical top-to-bottom) |
| 3 | Verify focus ring is visible on each element | Focus indicator visible and meets WCAG 2.4.7 |
| 4 | Open cart drawer | Focus moves into drawer |
| 5 | Tab through drawer content | Focus is trapped within drawer — does not escape to background |
| 6 | Close drawer (Escape key or close button) | Focus returns to the trigger element |
| 7 | Open search drawer | Same focus trap and return behavior |

📸 **Screenshot checkpoint:** Focus ring visibility on form fields and drawer elements.

---

### Performance — LCP & CLS

#### S18.9 — LCP: Homepage < 2.5s

> Measure Largest Contentful Paint on the homepage via PerformanceObserver.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Set up PerformanceObserver for `largest-contentful-paint` via `page.evaluate` | Observer registered before navigation |
| 2 | Navigate to `/en/` on Pixel 5 viewport | Page loads |
| 3 | Wait for page load event + 1s settling time | LCP entry captured |
| 4 | Read LCP value from PerformanceObserver entries | LCP < 2.5s (Good threshold) |
| 5 | Record LCP element (tag, src/text) | Document what the LCP element is (hero image, heading, etc.) |

📸 **Screenshot checkpoint:** Console output with LCP value and element.

---

#### S18.10 — CLS: Homepage < 0.1

> Measure Cumulative Layout Shift on the homepage via PerformanceObserver.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Set up PerformanceObserver for `layout-shift` entries via `page.evaluate` | Observer registered before navigation |
| 2 | Navigate to `/en/` on Pixel 5 viewport | Page loads |
| 3 | Wait for page load + 3s settling (account for lazy-loaded content) | Layout shift entries captured |
| 4 | Sum layout shift values where `hadRecentInput === false` | CLS < 0.1 (Good threshold) |
| 5 | If CLS > 0.1: identify shifting elements from entries | Document which elements cause shifts |

📸 **Screenshot checkpoint:** Console output with CLS value and contributing elements.

---

#### S18.11 — LCP & CLS on Category, Search, PDP Pages

> Extend performance measurement to other high-traffic routes.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Measure LCP + CLS on `/en/categories` | LCP < 2.5s, CLS < 0.1 |
| 2 | Measure LCP + CLS on `/en/search?q=test` | LCP < 2.5s, CLS < 0.1 |
| 3 | Measure LCP + CLS on a PDP (`/en/product/{slug}`) | LCP < 2.5s, CLS < 0.1 |
| 4 | Record LCP elements and CLS sources per route | Document per-route breakdown |
| 5 | Note any routes with CLS > 0.1 due to HYDRA-002 flash | Cross-reference with S18.15 findings |

📸 **Screenshot checkpoint:** Performance summary table per route.

---

### Error Handling — Error Pages

#### S18.12 — global-error.tsx: Root Error Boundary

> Trigger the root error boundary and verify mobile layout.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Trigger a root-level error (inject via `page.evaluate` or navigate to a route that throws) | `global-error.tsx` renders |
| 2 | Verify layout: `min-h-dvh`, centered content, `p-4` padding | Error content centered on mobile, full viewport height |
| 3 | Verify buttons stack vertically on mobile | Buttons use `flex-col gap-3` layout (not `sm:flex-row` at 393px) |
| 4 | Verify "Try Again" button is functional | Tapping calls `reset()`, attempts re-render |
| 5 | Verify no horizontal overflow | Content fits within 393px viewport |

📸 **Screenshot checkpoint:** global-error.tsx rendered on Pixel 5.

---

#### S18.13 — global-not-found.tsx: 404 Page

> Navigate to a non-existent route and verify the 404 page.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/nonexistent-route-xyz` | 404 page renders via `global-not-found.tsx` |
| 2 | Verify PageShell wrapper renders correctly | Standard page shell (header/footer present if applicable) |
| 3 | Verify content is centered: `mx-auto max-w-md text-center` | 404 message centered, constrained to max-width |
| 4 | Verify buttons stack vertically on mobile | `flex-col gap-3` layout at 393px width |
| 5 | Verify "Go Home" or equivalent CTA links to `/en/` | CTA navigates back to homepage |

📸 **Screenshot checkpoint:** 404 page on Pixel 5.

---

#### S18.14 — ErrorBoundaryUI: Route-Level Error Boundaries

> Verify route-level error boundaries render with correct icons and mobile layout.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Trigger a route-level error (e.g., on a product page or category page) | `ErrorBoundaryUI` renders instead of crashing |
| 2 | Verify layout: `min-h-(--page-section-min-h)`, centered, `px-4` | Error content centered within page section |
| 3 | Verify `max-w-md` constrains content width | Content does not stretch beyond ~448px |
| 4 | Verify correct icon renders from icon map | Icon matches the route context (e.g., `cart` for cart errors, `storefront` for product errors) |
| 5 | Verify buttons: `flex-col sm:flex-row gap-3` | Buttons stack vertically at 393px mobile width |
| 6 | Verify `assertNoErrorBoundary(page)` detects this state | Helper correctly identifies error boundary presence |

📸 **Screenshot checkpoint:** ErrorBoundaryUI on a route-level error, Pixel 5.

---

### Hydration — HYDRA-002 & suppressHydrationWarning

#### S18.15 — HYDRA-002: useIsMobile Flash Duration

> Measure the layout flash caused by useIsMobile SSR → client switch.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/` on Pixel 5 viewport with Performance tracing | Page loads |
| 2 | Observe initial render (SSR) | Desktop layout briefly visible (useIsMobile returns `false` on server) |
| 3 | Measure time from first paint to mobile layout stable | Flash duration captured |
| 4 | Record visual impact: what shifts? | Document which components flash: sidebar, quick-view drawer, category modal |
| 5 | Check CLS contribution from this flash | Cross-reference with S18.10 CLS value |
| 6 | Test on affected components: open product quick-view drawer on mobile | Drawer opens correctly after hydration; initial render may flash |
| 7 | Test category modal on mobile | Modal renders correctly after hydration |

📸 **Screenshot checkpoints:** (a) SSR desktop flash frame (if capturable), (b) stable mobile layout after hydration.

---

#### S18.16 — suppressHydrationWarning: Wishlist Drawer Prices

> Verify no console hydration errors on wishlist drawer price elements.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open browser console, filter for hydration warnings | Console listener active |
| 2 | Navigate to `/en/`, ensure user has wishlist items | Homepage loaded |
| 3 | Open wishlist drawer | Drawer opens with price elements |
| 4 | Check console for hydration mismatch warnings | No hydration errors — `suppressHydrationWarning` on price elements prevents warnings |
| 5 | Verify prices display correctly after hydration | Price values match server-rendered values, formatting is correct |
| 6 | Close and re-open drawer | No additional hydration warnings on subsequent opens |

📸 **Screenshot checkpoint:** Console output showing no hydration errors during wishlist drawer interaction.

---

## Findings

| # | Sub-audit | Scenario | Device | Result | Bug | Notes |
|---|-----------|----------|--------|--------|-----|-------|
| S18.1 | i18n | BG homepage | Pixel 5 | | | |
| S18.2 | i18n | BG user flows | Pixel 5 | | | |
| S18.3 | i18n | Missing keys | Pixel 5 | | | |
| S18.4 | i18n | Currency/date | Pixel 5 | | | |
| S18.5 | a11y | axe homepage | Pixel 5 | | | |
| S18.6 | a11y | axe top routes | Pixel 5 | | | |
| S18.7 | a11y | Touch targets | Pixel 5 | | | |
| S18.8 | a11y | Focus management | Pixel 5 | | | |
| S18.9 | perf | LCP homepage | Pixel 5 | | | |
| S18.10 | perf | CLS homepage | Pixel 5 | | | |
| S18.11 | perf | LCP/CLS routes | Pixel 5 | | | |
| S18.12 | errors | global-error | Pixel 5 | | | |
| S18.13 | errors | 404 page | Pixel 5 | | | |
| S18.14 | errors | ErrorBoundaryUI | Pixel 5 | | | |
| S18.15 | hydration | HYDRA-002 flash | Pixel 5 | | HYDRA-002 | |
| S18.16 | hydration | Suppress warnings | Pixel 5 | | | |

---

## Summary

| Metric | Count |
|--------|-------|
| Total scenarios | 16 |
| Passed | — |
| Failed | — |
| Bugs found | — |
| Known bugs verified | HYDRA-002 (pending) |

### Sub-audit Breakdown

| Sub-audit | Scenarios | Passed | Failed |
|-----------|-----------|--------|--------|
| i18n (BG locale) | 4 | — | — |
| Accessibility (axe-core) | 4 | — | — |
| Performance (LCP/CLS) | 3 | — | — |
| Error handling | 3 | — | — |
| Hydration | 2 | — | — |
