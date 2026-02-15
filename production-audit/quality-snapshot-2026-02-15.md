# QUALITY.md — Domain Quality Grades

> Per-domain health snapshot. Updated after audits, hardening batches, and launches.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + after hardening batches |

## Grading Key

| Grade | Meaning |
|-------|---------|
| 🟢 Green | Production-ready. Tests exist, types clean, no known critical gaps. |
| 🟡 Yellow | Functional but has known gaps, limited test coverage, or open TODOs. |
| 🔴 Red | Risky. Missing enforcement, known vulnerabilities, or untested critical paths. |

---

## Domain Grades

| Domain | Grade | Tests | Type Safety | Notes |
|--------|-------|-------|-------------|-------|
| **Auth** | 🟢 | 3 unit + E2E smoke | 0 `as any` | Session lifecycle, middleware, onboarding all covered. No TODOs. |
| **Payments** | 🟢 | 4 unit + E2E smoke | 0 `as any` | Fee breakdown + webhook idempotency + webhook secret parsing are unit-tested. Deferred work tracked in `TASKS.md` (BACKLOG-005, BACKLOG-006). |
| **Database** | 🟡 | 1 unit (middleware) | 0 `as any` | 85 migrations. 39/46 RLS tables have policies (85%). 7 tables have RLS enabled but no policies (mix of reference data + normalized product tables). Notifications INSERT policy hardening drafted (pending human approval). |
| **API Surface** | 🟢 | 2 unit (proxy) + E2E | 0 `as any` | Boundary validation added to all webhook/mutation routes. Server actions return typed Envelopes. |
| **Frontend/UI** | 🟢 | 17 component tests | 0 `as any`, 0 `@ts-ignore` | Token enforcement via `styles:gate`. Design contract + anti-slop rules in DESIGN.md. |
| **i18n** | 🟢 | 1 parity test | 0 `as any` | 117/117 top-level keys match across en/bg. Parity test enforces this in CI. |
| **Routes** | 🟢 | E2E smoke (19 specs) | Clean | Route-private conventions enforced. No cross-group imports. |
| **Accessibility** | 🟡 | Partial | — | Touch targets enforced (44px+ default). Focus-visible present. Screen reader labels and WCAG 2.1 AA audit still in progress (R17.4, R17.5). |

---

## Codebase-Wide Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Unit test files | 45 | 🟢 |
| E2E test files | 19 | 🟢 |
| `as any` in prod code | 0 | 🟢 |
| `@ts-ignore` in prod code | 0 | 🟢 |
| `@ts-nocheck` in prod code | 0 | 🟢 |
| Open TODOs in prod code | 0 | 🟢 |
| Feature completion (REQUIREMENTS.md) | 103/119 (87%) | 🟡 |
| RLS policy coverage | 39/46 tables (85%) | 🟢 |
| Docs freshness (30d threshold) | 56 fresh, 0 stale | 🟢 |

---

## RLS Gap Detail

Tables with RLS enabled but no policies found in migrations:

| Table | Risk | Notes |
|-------|------|-------|
| `badge_definitions` | Low | Read-only reference data |
| `brands` | Low | Read-only reference data |
| `category_attributes` | Low | Read-only reference data |
| `product_attributes` | Medium | Used by sell/PDP surfaces; policy review recommended (public read + seller write) |
| `product_images` | Medium | Used by sell/PDP surfaces; policy review recommended (public read + seller write) |
| `shipping_zones` | Low | Read-only reference data |
| `user_badges` | Medium | User-facing display surface; policy review recommended |

**Action:** Notifications INSERT policy is currently too broad in production migrations due to `authenticated` table privileges. Draft hardening migration exists; follow `docs/GUIDE.md` high-risk pause policy before applying.

---

## Tracked Follow-ups (Backlog)

Converted from code TODOs to tracked tasks in `TASKS.md`:

| Task | Scope | Priority |
|------|-------|----------|
| `BACKLOG-005` | Checkout buyer blocking/warning (buyer protection UX) | Medium |
| `BACKLOG-006` | Buyer confirmation email on checkout completion | Low |
| `BACKLOG-007` | PDP mobile seller bio surface (when profile bio exists) | Low |
| `BACKLOG-008` | PDP report modal/flow (trust & safety) | Medium |

---

## How To Update This File

1. Re-run quality data collection (test counts, grep for `as any`/TODOs, RLS audit).
2. Update grades based on findings.
3. Bump `Last verified` date.
4. Run `pnpm -s docs:check` to validate structure.

*Last updated: 2026-02-13*
