# Treido Brutal Codebase Audit & LOC Reduction Plan
Date: 2026-02-24  
Scope: full-codebase LOC reduction plan with no intended logic/UI/UX regressions.

## Brutal Verdict
- Cutting this codebase from ~100k to ~50k while keeping behavior and UX the same is not realistic in a safe refactor.
- For runtime app code, a realistic target is ~20% to ~35% reduction.
- A near-50% reduction requires high-risk architectural rewrite patterns (config-driven UI, heavy generators, or reducing tests), which materially increases regression probability.

## What Was Audited (Iteration Log)
### Iteration 1: Baseline Metrics (corrected)
- Initial PowerShell counts underreported LOC.
- Recomputed with a Node-based line counter on tracked files.
- Baseline used for planning:
  - `total_ts_tsx`: 148,699
  - `runtime_core`: 132,571
  - `tests_e2e`: 12,231
  - `generated`: 3,126 (`lib/supabase/database.types.ts`)
  - `tooling`: 771

### Iteration 2: Automated Duplication and Architecture Scans
- `pnpm -s architecture:scan`:
  - client-boundary: 266/976 (27.25%)
  - oversized files: 97 files >300 LOC, 12 files >500 LOC
  - routes: 86 pages, 31 routes missing loading file
  - duplicates summary: 145 clone groups, 1.22% duplicated lines
- `pnpm -s dupes`:
  - 145 clone groups, 1,969 duplicated lines total (1.22%)
- Implication:
  - Exact copy-paste is real but not massive enough to get near 50% reduction alone.

### Iteration 3: UI/Route Audit (Subagent)
- Highest concentration in route-heavy UI areas:
  - `app/[locale]/(account)`: 20,386 LOC
  - `app/[locale]/(main)`: 20,126 LOC
  - `app/[locale]/(sell)`: 9,607 LOC
  - `app/[locale]/(business)`: 9,042 LOC
- Main repeated patterns:
  - repeated page shells, breadcrumb blocks, loading skeletons
  - desktop/mobile split components with overlapping logic
  - repeated filter/search layout composition

### Iteration 4: Server/API/Domain Audit (Subagent)
- Main repeated patterns:
  - repeated product guards and activation checks across `app/actions/products-*`
  - repeated order-item fetch/ownership checks in order actions
  - repeated API response wrappers and visibility filters in `app/api/products/*`
  - repeated param parsing and shipping filter wiring
- Risk callout:
  - payment/subscription/auth consolidation is high impact and must be approval-gated.

### Iteration 5: Tests + Tooling Audit (Subagent)
- Main repeated patterns:
  - duplicated Next.js/i18n mocks in multiple unit tests
  - duplicated e2e setup/retry helpers in specs
  - duplicated scanner boilerplate across Tailwind/style gate scripts
- Tooling findings:
  - style scanner scripts can be merged into a shared runner with check-specific config.

### Iteration 6: Synthesis
- Combined bottom-up opportunities into scenario-based reduction models (safe, aggressive, extreme).

## Baseline Snapshot
### Runtime Footprint (TS/TSX)
| Metric | LOC |
|---|---:|
| Runtime core (`app`,`components`,`lib`,`hooks`,`i18n`,`supabase/functions`) | 132,571 |
| Tests + e2e | 12,231 |
| Generated types | 3,126 |
| Tooling configs | 771 |
| Total TS/TSX tracked | 148,699 |

## Additional Context
| Metric | Value |
|---|---:|
| Route files (`page|loading|not-found`) | 149 |
| Route file LOC total | 14,832 |
| Runtime files >300 LOC | 97 |
| Runtime files >500 LOC | 12 |
| Detected clone groups | 145 |
| Duplicated lines | 1,969 (1.22%) |

## Reduction Potential Model (No Feature Cuts)
All estimates below are net LOC reduction after refactor (shared abstractions included).

| Workstream | Low | Base | High | Risk |
|---|---:|---:|---:|---|
| Route/page shell + loading skeleton consolidation | 3,000 | 5,000 | 7,000 | Low |
| Product card/search/filter composition unification | 1,500 | 3,000 | 4,500 | Medium |
| Server actions/API helper extraction (non-payment/auth critical paths) | 1,200 | 2,500 | 4,000 | Medium |
| Shared hook utilities (`abort`, storage, fetch state) | 300 | 800 | 1,200 | Low |
| Unit/e2e fixture and mock dedupe | 1,500 | 2,800 | 4,000 | Low |
| Script/tooling dedupe (style scans + architecture scan helpers) | 600 | 1,000 | 1,400 | Low |
| **Safe subtotal** | **8,100** | **15,100** | **22,100** |  |
| Payments/subscriptions action+route unification | 800 | 1,800 | 3,000 | High |
| Auth/business guard consolidation | 700 | 1,500 | 2,500 | High |
| Route-template system for account/business/admin page families | 2,000 | 4,500 | 7,000 | Medium |
| Schema-driven form composition (sell/onboarding/account) | 2,500 | 5,000 | 8,000 | High |
| **Aggressive add-on subtotal** | **6,000** | **12,800** | **20,500** |  |
| **Total (safe + aggressive)** | **14,100** | **27,900** | **42,600** |  |

## Scenario Outcomes
Based on `runtime_core = 132,571`.

| Scenario | Expected Reduction | Estimated Runtime LOC After |
|---|---:|---:|
| Safe | 8k to 22k | 124k to 110k |
| Safe + aggressive (recommended max without rewrite) | 14k to 43k | 119k to 90k |
| Extreme rewrite mode | 50k+ possible | <85k possible but high regression risk |

## Can We Hit 50k?
- If your baseline assumption is 100k and target is 50k: that is a 50% cut.
- For this codebase shape and current constraints, 50% is not a credible safe target.
- Realistic "clean but stable" target is closer to 90k to 110k runtime LOC.
- Sub-80k is possible only with rewrite-level transformations and stricter feature-generation architecture, not normal refactor.

## Highest-Value Clusters To Attack First
| Cluster | Why It Matters | Examples |
|---|---|---|
| Account/Main/Sell/Business route families | Highest LOC concentration + repeated layout patterns | `app/[locale]/(account)`, `app/[locale]/(main)`, `app/[locale]/(sell)`, `app/[locale]/(business)` |
| Product card variants + search/category UI shells | Desktop/mobile overlap and repeated metadata wiring | `components/shared/product/card/*`, search/category layout components |
| Product/order/payment actions and product API endpoints | Repeated guards, parsing, response wrappers | `app/actions/products-*`, `app/actions/orders-*`, `app/api/products/*` |
| Test mocks/fixtures and e2e helpers | Fast LOC wins, low risk | `__tests__/product-card-*.test.tsx`, `e2e/profile.spec.ts`, `e2e/reviews.spec.ts` |
| Scanner and gate scripts | Repeated CLI/report scaffolding | `scripts/scan-tailwind-*.mjs`, `scripts/architecture-scan.mjs` |

## Phased Execution Plan
### Phase 0: Guardrails and Baseline Lock (1-2 days)
- Freeze baseline metrics script and store results in CI artifact.
- Define LOC budget per directory (`app`, `components`, `lib`, `hooks`).
- Define non-negotiable behavior checks:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
  - `pnpm -s test:unit`

### Phase 1: Low-Risk Quick Wins (1-2 weeks)
- Consolidate loading skeleton/page-shell primitives.
- Centralize test mocks/fixtures.
- Consolidate Tailwind/style scan boilerplate.
- Target: 5k to 10k net reduction.

### Phase 2: Medium-Risk Structural Cleanup (2-4 weeks)
- Unify product card shared logic and repeated filter/search layout scaffolding.
- Extract non-critical server/API helper patterns.
- Target: additional 6k to 12k net reduction.

### Phase 3: High-Risk Domain Consolidation (approval-gated, 2-4 weeks)
- Payments/auth/subscriptions dedupe only with strict regression tests and staged rollout.
- Target: additional 3k to 8k net reduction.

### Phase 4: Aggressive Architecture Track (optional)
- Move repeated route patterns toward config-driven composition.
- Consolidate repetitive form flows with schema-driven renderers.
- Target: additional 8k to 15k net reduction.

## Hard Risk Gates (Must Be Human-Approved Before Execution)
- Auth/session logic changes
- Payments/webhooks/subscriptions changes
- DB schema/migrations/RLS changes
- Destructive data operations

## Brutal Recommendations
- Set official target to `runtime_core <= 100k` first. This is hard but realistic.
- Treat `<= 90k` as stretch target requiring aggressive but controlled refactors.
- Do not set `50k` as a delivery target unless you explicitly authorize rewrite-level risk.
- Optimize for maintainability and blast-radius reduction first, LOC second.

## Notes
- This audit intentionally did not modify existing product logic.
- Existing unrelated worktree changes were left untouched.
