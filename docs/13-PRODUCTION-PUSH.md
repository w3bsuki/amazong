# 13-PRODUCTION-PUSH.md — Treido V1 Ship Plan

> Single place to drive the production push: audits → tasks → verify → deploy.

| Started | 2026-02-02 |
|---|---|
| Status | Active |
| Execution SSOT | `.codex/TASKS.md` |
| Audit SSOT | `.codex/audit/*` |
| Launch Ops SSOT | `12-LAUNCH.md` |

---

## Quick Links

| Need | Location |
|---|---|
| Active task queue | `.codex/TASKS.md` |
| Audit index | `.codex/audit/README.md` |
| Playwright audit | `.codex/audit/playwright/2026-02-02/00-INDEX.md` |
| Feature alignment audit | `.codex/audit/2026-02-02_feature-alignment-audit.md` |
| Next.js audit | `.codex/audit/2026-02-02_nextjs16-audit-report.md` |
| Tailwind v4 audit | `.codex/audit/2026-02-02_tailwind-v4-audit-report.md` |
| TypeScript audit | `.codex/audit/2026-02-02_typescript_audit.md` |
| Launch checklist / ops | `12-LAUNCH.md` |

---

## Current State (Snapshot)

| Metric | Value |
|---|---|
| Feature completion | ~87% documented (`02-FEATURES.md`), ~92% actual (see feature alignment audit) |
| Backend readiness | ✅ Production-ready (per audits) |
| Known UX blockers | See Playwright audit issues + `.codex/TASKS.md` |

---

## Blockers (Must Address Before Deploy)

### P0 — Hard Blockers

- ✅ Deleted orphaned `temp-tradesphere-audit/` prototype folder (2026-02-02).

### P1 — Ship Blockers

- Fix public routes gated by onboarding (`/search`, `/cart`, `/categories`) — see Playwright `ISSUE-002`.
- Fix missing error boundaries for business dashboard subroutes (see `.codex/TASKS.md`).
- Fix non-i18n-compliant inline translations and wrong Link imports (see `.codex/TASKS.md`).

---

## Phases (Execution Order)

### Phase 0 — Audits (Done)

Audits are complete and consolidated under `.codex/audit/`.

### Phase 1 — Critical Path (Frontend + Routing)

Goal: remove launch blockers with minimal behavioral change.

Primary inputs:
- `.codex/audit/2026-02-02_nextjs16-audit-report.md`
- `.codex/audit/playwright/2026-02-02/issues/frontend.md`

### Phase 2 — Alignment (Docs ↔ Code)

Goal: update `02-FEATURES.md` to match reality (docs are conservative).

Primary input:
- `.codex/audit/2026-02-02_feature-alignment-audit.md`

### Phase 3 — UI Rails Polish (TW4 + shadcn)

Goal: remove remaining rails violations and boundary drift in small batches.

Primary inputs:
- `.codex/audit/2026-02-02_tw4-shadcn-parallel-audit.md`
- `.codex/audit/2026-02-02_shadcn-structure-audit.md`

### Phase 4 — Verify + Ship

Goal: run the smallest sufficient verification suite and deploy.

Verify:
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`
- `pnpm -s test:unit`
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

Deploy:
- Follow `12-LAUNCH.md` (Vercel + Supabase + Stripe checklist).

---

## Definition of Done

- All gates pass (typecheck/lint/styles).
- E2E smoke passes.
- Playwright audit issues are resolved or explicitly deferred (with rationale in `.codex/TASKS.md`).
- `02-FEATURES.md` reflects actual shipped V1 scope.

---

*Last updated: 2026-02-02*
