# GATES.md — Quality Gate Runbook

Use this as the canonical gate runbook for refactor and launch-hardening work.

## Core Refactor Gate

Run after each logical batch/domain:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Pass condition: all commands exit `0`.

## Architecture Metrics Gate

Read-only scan:

```bash
pnpm -s architecture:scan
```

Regression gate against baseline:

```bash
pnpm -s architecture:gate
```

Use `architecture:gate:baseline` only when intentionally rebaselining metrics.

## Dead Code Gate

Canonical command:

```bash
pnpm -s knip
```

Notes:
- Do not use `pnpm -s exec knip --reporter compact` in this environment; it can fail with a path reporter error.
- If `knip` reports removals, grep-verify usage before deletion.

## Duplicate Code Audit

```bash
pnpm -s dupes
```

Use for prioritization; dedupe only when behavior parity is clear and risk is acceptable.

## Style Contract Gate

```bash
pnpm -s styles:gate
```

This enforces semantic-token-only styling and other scanner policies.

## Full Program-End Gate

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit && pnpm build
```

## Artifact Capture

Recommended at major checkpoints:

```bash
pnpm -s architecture:scan --write .tmp/architecture-entry.json
pnpm -s dupes > .tmp/dupes-entry.txt
```

*Last updated: 2026-02-18*
