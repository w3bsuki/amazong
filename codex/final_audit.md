# Final Codebase Audit (V1 readiness)
Date: 2026-01-17

## Scope
Full repo scan for duplicate code, over‑engineering, tech debt, dead code, dead imports, hardcoding, folder structure drift, and production readiness risks.

## Executive summary (highest impact)
- **Structural drift**: documented shared layer `components/common/**` does not exist; the current tree uses `components/shared/**`. This creates confusion about boundaries and ownership.
- **Duplicate logic**: category tree building and deprecated‑category filters are implemented in multiple places, increasing bug surface and maintenance cost.
- **Hardcoded policies**: caching TTLs and breakpoints are hardcoded in multiple files, making tuning risky and inconsistent.
- **Cleanup debt**: backups, temp files, and reports are present at repo root and can mask real sources of truth.
- **Testing gaps vs production checklist**: manual acceptance items are not automated, and smoke tests verify page loads but not critical flows like add‑to‑cart or checkout.

## Addendum — Full coverage audit
Folder-by-folder sweep with new findings:
- [codex/codebase-audit-2026-01-17-full.md](codex/codebase-audit-2026-01-17-full.md)

---

## 1) Structure & boundaries
**Finding:** `components/common/**` is documented but not present; the repository instead uses `components/shared/**`.
- Docs: [docs/ENGINEERING.md](docs/ENGINEERING.md)
- Actual folder tree: [components/](components)

**Impact:** boundary rules are unclear (risk of cross‑route imports and accidental coupling). This also makes onboarding harder.

**Recommendation:** either create `components/common/**` and migrate shared composites, or update the docs to match current structure and codify the rules in linting.

---

## 2) Duplicate implementations / logic drift
**Duplicate category tree building**
- API route implementation: [app/api/categories/route.ts](app/api/categories/route.ts)
- Shared data implementation: [lib/data/categories.ts](lib/data/categories.ts)

**Impact:** two separate trees can diverge on filtering/sorting rules and cache behavior. One bug fix must be done twice.

**Recommendation:** extract `buildCategoryTree()` into `lib/` and reuse in the API route, or remove the API variant if unused.

**Duplicate deprecated-category filtering**
- Search filters: [components/shared/search/search-filters.tsx](components/shared/search/search-filters.tsx)
- Subcategory circles: [components/category/subcategory-circles.tsx](components/category/subcategory-circles.tsx)

**Impact:** category suppression rules can drift across surfaces.

**Recommendation:** move to a shared helper (e.g., `lib/categories/is-valid-category.ts`).

**Parallel demo routes**
- Desktop demo route: [app/[locale]/(main)/demo/desktop/page.tsx](app/[locale]/(main)/demo/desktop/page.tsx)
- Mobile demo route: [app/[locale]/(demo)/demo/mobile/page.tsx](app/[locale]/(demo)/demo/mobile/page.tsx)
- Migration plan indicates consolidation is pending: [PLAN-replace-main-with-demo.md](PLAN-replace-main-with-demo.md)

**Impact:** two demo implementations increase drift and complicate production readiness.

**Recommendation:** complete the consolidation plan or deprecate one route group.

---

## 3) Tech debt / hardcoding / over‑engineering
**Hardcoded caching policy duplicated in config + route**
- Global cache profiles: [next.config.ts](next.config.ts)
- API header TTLs: [app/api/categories/route.ts](app/api/categories/route.ts)

**Impact:** tuning cache freshness requires multiple edits and can introduce mismatches.

**Recommendation:** centralize TTLs in a single config or derive headers from `cacheLife` profiles.

**Hardcoded breakpoint**
- Mobile breakpoint is fixed to `768` in: [hooks/use-mobile.ts](hooks/use-mobile.ts)

**Impact:** breakpoint drift from design tokens; changes must be made in code + CSS separately.

**Recommendation:** source breakpoints from tokens or CSS custom properties.

**Toast system with extreme timeout + reducer side effects**
- Very long delay (`TOAST_REMOVE_DELAY = 1000000`) and side effects inside reducer. Also effect re‑subscribes on every state update. See: [hooks/use-toast.ts](hooks/use-toast.ts)

**Impact:** surprising UX (toasts persist for ~16.7 minutes) and unnecessary subscription churn.

**Recommendation:** move side effects out of reducer, shorten delay, and fix the `useEffect` dependency list.

---

## 4) Dead code / stale references / cleanup debt
**Stale doc references**
- TODO file references do not exist in repo: [components/shared/filters/filter-modal.tsx](components/shared/filters/filter-modal.tsx), [components/mobile/category-nav/quick-filter-row.tsx](components/mobile/category-nav/quick-filter-row.tsx)

**Impact:** comments point to dead docs, undermining decision‑traceability.

**Recommendation:** update references to the correct doc or remove.

**Backup / legacy CSS files**
- [app/globals.css.backup](app/globals.css.backup)
- [app/globals.css.old](app/globals.css.old)
- [app/legacy-vars.css](app/legacy-vars.css)

**Impact:** multiple sources of truth for styles; increases risk of editing the wrong file.

**Recommendation:** delete or archive outside repo if no longer used.

**Temp / artifact files committed in repo root**
- [temp_log_entry.md](temp_log_entry.md)
- [temp_search_overlay.txt](temp_search_overlay.txt)
- [duplicate-hashes.txt](duplicate-hashes.txt)
- [tsc.err.txt](tsc.err.txt)
- [tsc.out.txt](tsc.out.txt)
- [cleanup/arbitrary-scan-report.txt](cleanup/arbitrary-scan-report.txt)
- [cleanup/palette-scan-report.txt](cleanup/palette-scan-report.txt)
- [playwright-report/](playwright-report/)
- [playwright-report-tmp/](playwright-report-tmp/)
- [playwright-report-tmp2/](playwright-report-tmp2/)
- [playwright-report-tmp3/](playwright-report-tmp3/)

**Impact:** noise in repo, harder auditing, potential accidental re‑use of stale data.

**Recommendation:** remove or move into a dedicated `artifacts/` folder and gitignore it.

---

## 5) i18n and user‑visible strings
**Unlocalized user string**
- The demo page includes a hardcoded English string. See: [app/[locale]/(main)/demo/desktop/page.tsx](app/[locale]/(main)/demo/desktop/page.tsx)

**Impact:** violates repo rule “All user strings via next‑intl” and produces inconsistent localization.

**Recommendation:** move to `messages/en.json` and `messages/bg.json`, then use `useTranslations()`.

---

## 6) Testing & production readiness gaps
**Manual acceptance items not automated**
- Production checklist calls out add‑to‑cart, email verification link, and Stripe checkout as manual steps. See: [docs/PRODUCTION.md](docs/PRODUCTION.md)

**Impact:** critical paths are not regression‑tested in CI.

**Recommendation:** add E2E flows for add‑to‑cart and checkout; add a test covering email verification link behavior.

**Smoke tests are page‑load only**
- Smoke tests validate route load and basic visibility but do not assert add‑to‑cart or checkout. See: [e2e/smoke.spec.ts](e2e/smoke.spec.ts)

**Impact:** tests pass even if conversion flows are broken.

**Recommendation:** extend smoke or add a dedicated “critical commerce flow” spec.

**Potential flakiness patterns in auth E2E**
- Auth tests use `Date.now()` for identities and multiple retries/timeouts, which can be noisy under parallelism or slow environments. See: [e2e/auth.spec.ts](e2e/auth.spec.ts)

**Recommendation:** centralize unique test users with retry‑safe IDs and reduce time‑based waits where possible.

---

## Suggested next steps (low‑risk, high‑ROI)
1. **Cleanup pass**: remove backup/temp/artifact files; update stale `TODO1.md` references.
2. **Unify category tree helpers**: move `buildCategoryTree()` into `lib/` and reuse in API route.
3. **Consolidate deprecated‑category filtering**: create one helper and use across filters.
4. **i18n sweep for visible strings**: start with the demo route string and extend via linting.
5. **Add critical E2E coverage**: add add‑to‑cart + checkout tests to align with the production checklist.

---

## Notes
This audit was intentionally scoped to provide actionable findings with concrete file references and does not include speculative issues without evidence.
