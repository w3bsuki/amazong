# Codex Agents Guide

This file is the local operating guide for running future Treido audit/refactor sessions.

## Mission

- Reduce complexity aggressively without breaking production behavior.
- Keep the codebase launch-safe while improving maintainability and speed.

## Primary References

- `codex/00-baseline-metrics.md`
- `codex/09-refactor-roadmap-50pct.md`
- `codex/TODO.md`
- `codex/10-agent-playbook.md`

## Run Order Per Session

1. Read baseline + roadmap + TODO.
2. Choose one domain scope only.
3. Run subagent audits for that scope.
4. Implement smallest safe batch.
5. Run required verification.
6. Update codex docs with outcomes and new metrics.

## Non-Negotiables

- No auth/payment/schema/RLS risky changes without explicit human approval.
- No cross-route-private import violations.
- Keep `components/ui/*` primitive-only.
- Prefer server-first and reduce unnecessary `"use client"`.

## Verification

- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`
- Add `pnpm -s test:unit` and `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` when business logic or user flows are changed.
