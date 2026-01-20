# Test & E2E Audit (2026-01-19)

Scope:
- __tests__/ (unit)
- e2e/ (Playwright)
- test/ (misc)
- test-results/ (Playwright output)
- playwright-report*/ (HTML reports)

## Inventory

### Unit tests (__tests__/)
- General: boost-status, currency, format-price, geolocation, image-utils, normalize-image-url, order-status, product-card-hero-attributes, product-price, proxy-matcher, proxy-middleware, safe-json, shipping, stripe-locale, supabase-middleware-session, url-utils, validations-auth.
- Hooks: use-badges, use-geo-welcome, use-mobile, use-product-search, use-recently-viewed, use-toast.

### E2E (e2e/)
- accessibility.spec.ts
- account-phase5.spec.ts
- auth.spec.ts
- boost-checkout.spec.ts
- mobile-responsiveness.spec.ts
- mobile-ux-audit.spec.ts
- mobile-ux-audit-detailed.spec.ts
- orders.spec.ts
- profile.spec.ts
- reviews.spec.ts
- seller-create-listing.spec.ts
- seller-routes.spec.ts
- smoke.spec.ts
- Supporting: fixtures/, assets/, global-setup.ts

### Misc test/ folder
- test/setup.ts

### Artifacts
- test-results/.last-run.json (45 bytes, 2026-01-19)
- playwright-report/index.html (≈515 KB, 2026-01-19)
- playwright-report-tmp/index.html (≈505 KB, 2026-01-07)
- playwright-report-tmp2/index.html (≈505 KB, 2026-01-07)
- playwright-report-tmp3/index.html (≈506 KB, 2026-01-07)

## Potential duplicates / overlaps

### E2E
- mobile-ux-audit.spec.ts vs mobile-ux-audit-detailed.spec.ts
  - Names indicate overlapping coverage (one likely a stricter superset). Treat detailed as a separate, slower audit suite; consider deprecating the non-detailed version or enforcing a tag split (e.g., @audit vs @smoke) to avoid running both by default.
- mobile-responsiveness.spec.ts vs mobile-ux-audit*.spec.ts
  - Responsiveness and UX audits often overlap. Verify whether they check the same breakpoints/flows; if so, consolidate into a single audit or move the lighter checks into smoke.
- smoke.spec.ts vs domain flows (orders/reviews/profile/auth/boost-checkout)
  - Smoke likely re-tests core paths already covered by domain suites. Keep smoke minimal (1-2 critical flows) and remove duplicated assertions from domain suites.

### Unit
- format-price.test.ts, product-price.test.tsx, currency.test.ts
  - These likely overlap price formatting logic. Consider consolidating into a single pricing utilities test file to reduce redundancy.
- image-utils.test.ts and normalize-image-url.test.ts
  - Possible overlap around URL normalization. Consider merging if both cover the same helper.

## Flakiness risk hotspots

- seller-routes.spec.ts uses `retries: 3` per navigation and long timeouts (60–120s). That is a strong signal of instability (likely slow server or flaky route readiness).
- smoke.spec.ts includes multiple timeouts and comments hinting about flaky waits (custom waits for load, catching wait failures). The `.catch(() => {})` patterns can hide genuine failures.
- seller-create-listing.spec.ts depends on UI timing for username gating and rapid UI clicks; prone to race conditions in slower environments.

Recommendation: isolate these suites to a “flaky/quarantine” tag or suite (e.g., @slow/@flaky), and ensure the default CI job only runs stable, deterministic tests.

## Obsolete or low-value candidates

- test/setup.ts: check if unused. This folder is uncommon compared to __tests__/ or tests/; if not referenced by test runner config, it can be removed.
- playwright-report-tmp*, test-results/.last-run.json: transient artifacts, not needed in repo.
- account-phase5.spec.ts: “phase5” suggests a historical milestone. Verify if it still maps to current product state; if not, archive or split into current flows.

## Large artifacts to purge

- playwright-report*/index.html files (~500 KB each). All are generated artifacts and should be excluded from source control (add to gitignore if not already) and deleted from repo.
- test-results/.last-run.json should be treated as build output; keep local only.

## Recommended cleanup plan (no code changes)

1. Confirm test setup references
   - Check test runner configs for test/setup.ts usage. If unused, delete the folder and remove from repo.
2. Consolidate overlapping suites
   - Decide if mobile-ux-audit should replace mobile-ux-audit-detailed (or vice versa).
   - Trim smoke.spec.ts to the minimum “site is alive + primary path” set.
3. Stabilize flaky tests
   - Review seller-routes.spec.ts and seller-create-listing.spec.ts for deterministic waits and selectors.
   - Replace `.catch(() => {})` waits with explicit expected states and add stable `data-testid` hooks.
4. Purge artifacts
   - Delete playwright-report*, test-results/ artifacts and add to .gitignore if missing.

## Files referenced

- [e2e/README.md](e2e/README.md)
- [e2e/smoke.spec.ts](e2e/smoke.spec.ts)
- [e2e/seller-routes.spec.ts](e2e/seller-routes.spec.ts)
- [e2e/seller-create-listing.spec.ts](e2e/seller-create-listing.spec.ts)
- [test/setup.ts](test/setup.ts)
- [playwright-report/index.html](playwright-report/index.html)
- [playwright-report-tmp/index.html](playwright-report-tmp/index.html)
- [playwright-report-tmp2/index.html](playwright-report-tmp2/index.html)
- [playwright-report-tmp3/index.html](playwright-report-tmp3/index.html)
- [test-results/.last-run.json](test-results/.last-run.json)
