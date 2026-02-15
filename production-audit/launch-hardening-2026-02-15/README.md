# Launch Hardening Program (2026-02-15)

## Goal

Close the final launch-critical 10% by auditing every feature domain, fixing the highest-impact regressions, and proving stability with required QA gates.

## Working Contract

- Loop: frame -> implement -> verify -> report
- Batch size: small, scope-bound
- Verification baseline for every code batch:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
- Risk-based verification:
  - `pnpm -s test:unit`
  - `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
- High-risk pause required before finalizing changes in:
  - auth/session/access control
  - payments/webhooks/billing/payouts
  - DB schema/migrations/RLS

## Files In This Folder

- `feature-inventory.md` - full feature map with maturity and evidence
- `gap-audit.md` - launch blockers and severity-ranked gap matrix
- `phase-plan.md` - dependency-ordered implementation phases
- `TASKS.md` - clean execution checklist for this program

## Current Program Status

- Feature inventory: complete
- Gap audit: complete
- Phase plan: complete
- Execution: started (Phase 1 low-risk fixes first)
