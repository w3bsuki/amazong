# PRODUCTION-TEST-PLAN.md — Release Certification Plan

> Execution checklist for the soft launch on **2026-02-12**.

| Scope | Release testing and sign-off |
|-------|------------------------------|
| Audience | AI agents, QA, developers, release owner |
| Type | Execution plan + evidence contract |
| Last updated | 2026-02-11 |

---

## 1. Launch Rules

- Launch mode: controlled soft launch.
- Hard blockers: all 🔴 P0 defects and `LAUNCH-001..007` in `TASKS.md`.
- Tracking SSOT: `production-audit/master.md` + `production-audit/01..18`.
- Test split: hybrid (AI automation + human manual verification).
- Environment policy:
  - Full verification on preview URL.
  - Production smoke only after deploy.

---

## 2. Required Test Accounts

- Buyer account
- Seller account
- Business account
- Admin account

Each account must be pre-provisioned before Phase 3 begins.

---

## 3. Phase Execution Order

### Phase 0 — Command Center

1. Resolve doc consistency:
   - `docs/PRODUCTION.md`
   - `docs/ROUTES.md`
   - `docs/guides/deployment.md`
   - `production-audit/master.md`
2. Confirm test account availability.
3. Confirm preview environment keys and webhook secrets.

### Phase 1 — P0 Critical Path

Run `production-audit` phases 1-8 in order:

1. Shell & navigation
2. Landing / homepage
3. Auth
4. Categories
5. Search / quick-view
6. PDP
7. Cart / checkout
8. Sell form

Mandatory P0 verification during Phase 1:
- `AUTH-001`
- `SELL-001`
- `CAT-001`

Desktop core-flow pass (parallel):
- `/`
- `/search`
- `/:username/:productSlug`
- `/cart`
- `/checkout`
- `/auth/login`
- `/auth/sign-up`
- `/sell`
- `/account`

### Phase 2 — `LAUNCH-*` Closure

- `LAUNCH-001` webhook replay idempotency
- `LAUNCH-002` refund/dispute E2E
- `LAUNCH-003` environment separation
- `LAUNCH-004` leaked password protection + advisor recheck
- `LAUNCH-005` support playbooks minimum set
- `LAUNCH-006` cart badge/server truth
- `LAUNCH-007` product data sanity

### Phase 3 — Gates + Go/No-Go

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
pnpm build
```

Targeted suites as needed:

```bash
pnpm -s test:e2e e2e/auth.spec.ts
pnpm -s test:e2e e2e/seller-create-listing.spec.ts
pnpm -s test:e2e e2e/orders.spec.ts
pnpm -s test:e2e e2e/mobile-ux-audit.spec.ts
pnpm -s test:e2e e2e/mobile-ux-audit-detailed.spec.ts
pnpm -s test:a11y
```

Go only if:
- No P0 open
- `LAUNCH-001..007` complete or explicitly waived
- Required gates pass

### Phase 4 — Post-Deploy Smoke

Run 30-60 minute production smoke:
- signup/login/session reflect
- browse/search/PDP
- cart/checkout real transaction
- sell publish flow
- chat send/receive

Rollback immediately on new P0.

---

## 4. Evidence Contract (Required)

Use one row per executed scenario in each phase file:

| Scenario ID | Auto Result | Manual Result | Owner | Build/Commit | Screenshot/Video | Defect ID | Severity | Retest Result | Sign-off |
|-------------|-------------|---------------|-------|--------------|------------------|-----------|----------|---------------|---------|
| Sx.y | ⬜ | ⬜ | — | — | — | — | — | — | — |

Result values:
- `Pass`
- `Fail`
- `Blocked`
- `N/A`

---

## 5. Manual + AI Collaboration Format

For every manual response, submit:

- `Phase`
- `Scenario IDs`
- `Device/Browser`
- `Result: Pass/Fail`
- `Observed issue`
- `Evidence link/screenshot`

AI workflow:
1. Triage result
2. Reproduce with automation
3. Patch/fix (if in scope)
4. Retest and update evidence row
5. Update `production-audit/master.md` execution table

---

## 6. Must-Pass Scenario Set

1. `AUTH-001`: auth state reflects immediately after login
2. `SELL-001`: sell wizard publishes from review step
3. `CAT-001`: product cards show L0 root category
4. `LAUNCH-006`: cart badge equals server/cart truth
5. `LAUNCH-001`: webhook replay does not duplicate orders
6. `LAUNCH-002`: refund/dispute completes without manual DB intervention
7. `LAUNCH-004`: leaked password protection enabled, advisor warning cleared
8. Mobile + desktop core routes have no blocking layout/runtime errors

---

## 7. References

- `docs/PRODUCTION.md`
- `production-audit/master.md`
- `TASKS.md`
- `docs/TESTING.md`
