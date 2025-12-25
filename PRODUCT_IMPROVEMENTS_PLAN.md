# PRODUCT_IMPROVEMENTS_PLAN.md — Post-Refactor Product Improvements (UI/UX, Behavior, Performance)

This document is the **product-improvement plan** to execute **after** the structural refactor in `FULL_REFACTOR_PLAN.md` / `STRUCTURE.md` is complete.

**Intent**: once architecture is stable and guardrails are enforced, we can safely ship **behavior/UI** changes that are harder to reason about during refactors.

If anything conflicts with `STRUCTURE.md`, `STRUCTURE.md` wins.

Note:
- **Critical UX correctness/alignment fixes** (UI that currently does not match backend semantics, or tabs that “lie”) can be executed **before** broad cleanup/refactor as small, gated batches.
- Track those in `UX.md` under “UX alignment truth fixes.”

---

## Why this is separate from the refactor

During refactor phases we optimize for:
- Low blast radius
- Easy rollback
- Fast verification (typecheck/lint + targeted tests)

Product improvements optimize for:
- Better user experience (UI composition, copy, flows)
- Better business outcomes (conversion, retention)
- Better performance (LCP/INP/CLS), caching, correctness

Keeping these tracks separate prevents ambiguity: regressions can be attributed to either refactor or product change, not both.

---

## Principles

- **Ship in small slices**: each batch should be reversible and measurable.
- **Measure outcomes**: every change should have a metric, even if it’s just “support tickets reduced” or “E2E failures decreased”.
- **Accessibility is not optional**: improvements must not regress a11y.
- **Internationalization-safe**: copy and formatting must remain consistent across locales.
- **Respect guardrails**: route ownership and import boundaries remain enforced.

---

## Gates (required after every batch)

Minimum:
- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- Lint: `pnpm -s lint`

Recommended (especially for navigation/auth/checkout/caching changes):
- Build: `pnpm -s build`
- E2E: `pnpm test:e2e`

Rule: **No batch is done until gates pass.**

---

## Scope

### In scope
- UI composition and layout refinements (structure, hierarchy, clarity)
- Validation messages and form UX (inline errors, help text, focus management)
- Navigation patterns (discoverability, reducing steps, consistent back behavior)
- Caching strategy and data freshness (including Next.js data/cache decisions)
- Performance improvements (LCP/INP/CLS, bundle reduction, image strategy)
- Accessibility improvements (ARIA, keyboard navigation, reduced motion)
- Error handling UX (empty states, retries, meaningful errors)
- Content consistency (copy, tone, capitalization, pluralization)

### Out of scope (unless explicitly approved)
- New major features / net-new product areas
- Large visual rebrand / new design system tokens

---

## Execution Phases (post-refactor)

### Phase A — Measurement & Baselines
Deliverables:
- Define baseline KPIs:
  - Performance: LCP/INP/CLS, TTFB, route-level timings
  - Behavior: funnel conversion (where applicable), drop-off points
  - Reliability: error rate, failed actions, E2E flakiness
- Establish a lightweight “before vs after” capture:
  - Lighthouse runs via existing config (`lighthouserc.js`)
  - Playwright E2E stability metrics (pass rate, flaky tests)

Acceptance criteria:
- Baseline numbers recorded and versioned in the repo (append-only).


### Phase B — Navigation & Information Architecture
Deliverables:
- Normalize navigation patterns across major sections:
  - consistent breadcrumb/back behavior
  - consistent “active” states in nav
  - reduce duplicate entry points
- Fix inconsistent route affordances (modal routes vs full page where appropriate).

Acceptance criteria:
- No regressions in E2E suites.
- Reduced user confusion signals (support reports, session recordings if available).


### Phase C — Forms & Validation UX
Deliverables:
- Standardize form behavior:
  - error placement and wording
  - focus-on-error
  - disabled/loading states
- Improve validation messages:
  - actionable, specific, localized
  - consistent terminology across the app

Acceptance criteria:
- No decrease in completion rates on key forms.
- a11y checks: error messages announced correctly; keyboard-only completion works.


### Phase D — Data Freshness & Caching Strategy
Deliverables:
- Decide a per-domain caching strategy:
  - what should be “always fresh” vs “cached with revalidation”
  - avoid caching user-private data incorrectly
- Normalize data fetching:
  - eliminate duplicate fetches
  - consistent loading UX

Acceptance criteria:
- No stale/private-data leakage.
- Improved real-user performance or reduced server load.


### Phase E — Performance & Media
Deliverables:
- Image strategy:
  - reduce `img` usage where it harms LCP
  - ensure correct sizes/priority usage where applicable
- Bundle reduction:
  - identify heavy client components, split into smaller islands where it improves INP

Acceptance criteria:
- Performance metrics improve for top routes; no major regressions elsewhere.


### Phase F — Accessibility & Polish
Deliverables:
- Resolve high-signal a11y warnings and keyboard traps.
- Normalize focus rings, aria attributes, and roles.

Acceptance criteria:
- E2E accessibility tests stable.

---

## Workstreams (how we actually execute)

### 1) UI Composition Improvements
Tactics:
- Consolidate duplicated layouts into shared shells (when it reduces inconsistency).
- Improve hierarchy: headings, section grouping, spacing rhythm.

Outputs:
- Before/after snapshots (or story-style notes).


### 2) Copy & Validation
Tactics:
- Create a “copy style guide” appendix in this doc or a separate one.
- Convert vague errors (e.g. “Invalid input”) into actionable ones.

Outputs:
- A shared dictionary for key terms (seller/buyer/order/status names).


### 3) Navigation Patterns
Tactics:
- Standardize:
  - link targets and back behavior
  - modal route UX vs page route UX

Outputs:
- A short navigation spec: what the header/sidebar should do on each route group.


### 4) Caching & Data
Tactics:
- Inventory data fetches per route.
- Define cache policy per domain object:
  - Catalog items vs user profile vs orders

Outputs:
- A cache policy table.


### 5) Performance
Tactics:
- Attack top offenders first:
  - large client bundles
  - excessive image payload
  - repeated layout shifts

Outputs:
- A prioritized list of routes with perf budgets.


### 6) Accessibility
Tactics:
- Fix warnings with best ROI:
  - missing ARIA required props
  - role misuse
  - keyboard trap issues

Outputs:
- a11y checklist integrated into PR template or this plan.

---

## Change Management

### Batch size
- Prefer 1–3 user-visible improvements per batch.
- Keep each batch scoped to a single route group or domain when possible.

### Rollout
- If the app has feature flags, use them for risky navigation/caching changes.
- Otherwise:
  - ship behind environment toggles where feasible
  - or ship with quick rollback path (single PR revert)

### Documentation
- Every batch should update this file with:
  - what changed
  - how it was tested
  - what metric is expected to improve

---

## Suggested “First Batches” (post-refactor)

Pick one and run it end-to-end:

1) **Reduce route-level a11y warnings**
- Address the highest-impact ARIA role issues and keyboard navigation in one route group.

2) **Improve validation messages in a single funnel**
- Make copy consistent, add focus-on-error, ensure screen-reader announcement.

3) **Navigation consistency pass**
- Standardize link behavior and active states in header/sidebar for one section.

4) **Image/LCP pass on top landing routes**
- Replace worst offenders, add sizes/priority correctness.

---

## Open Questions (to resolve before Phase B)

- What are the top 3 funnels to optimize (sell, checkout, onboarding, plans, etc.)?
- Which routes are business-critical and require the strictest performance budgets?
- Do we have analytics instrumentation already, or should we add minimal event tracking?

---

## Appendix — Definition of “Done” for product changes

A product-improvement batch is “done” when:
- Gates pass (typecheck + lint; and build/E2E where appropriate)
- The change is documented in this plan
- There is a measurable expected outcome (even if qualitative)
- There is a rollback path
