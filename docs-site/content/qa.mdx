# QA.md — Verification Matrix

> Run only the checks that match changed surface area.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever scripts/CI change |

## Gate Matrix

| Change Surface | Required Commands |
|---|---|
| Any code change | `pnpm -s typecheck` + `pnpm -s lint` + `pnpm -s styles:gate` |
| Business logic / integrations | `pnpm -s test:unit` |
| User flow / route behavior | `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` |
| Docs structure or contracts | `pnpm -s docs:check` |
| Release candidate | `pnpm -s lint && pnpm -s typecheck && pnpm -s styles:gate && pnpm -s test:unit && pnpm -s build` |

## When To Run Unit

Run `pnpm -s test:unit` when logic changes in `app/actions/**`, `app/api/**`, `lib/**`, or `hooks/**`.

## When To Run E2E

Run smoke E2E when route-level behavior, checkout/auth flow, or end-to-end state transitions are modified.

## Manual Checks

- Validate acceptance behavior described in the task goal.
- Confirm no scope creep into excluded files/features.
- For risky integrations, capture reproducible evidence in `production-audit/**`.

## Release Checks

- Execute release candidate command from Gate Matrix.
- Run `pnpm -s docs:advisory` to gather non-blocking docs signals.

*Last updated: 2026-02-13*
