# Production Push — Baseline Snapshot

> REF-CLEANUP-001 — Baseline snapshot + guardrail metrics.
> Snapshot date: 2026-02-25

## Guardrail Baselines (Updated)

- `scripts/architecture-gate.baseline.json` (used by `pnpm -s architecture:gate`)
- `scripts/ts-safety-gate.baseline.json` (used by `pnpm -s ts:gate`)

## Environment

- Node: `v22.20.0`
- pnpm: `9.15.4`

## Metrics

From `pnpm -s architecture:scan`:

- client-boundary: `269/1151` (`23.37%`)
- oversized: `>300=66`, `>500=3`
- routes: `pages=86`, `missingLoading=0`, `missingMetadata=0`
- duplicates: `clones=53`, `duplicatedLines=628`, `percentage=0.4%`

Repo counters (prod-ish; excludes `__tests__/`, `test/`, `e2e/`, `*.test.*`, `*.spec.*`):

- `as unknown as`: `34` (production) / `46` (including tests)
- `console.*`: `111`
- `pb-20`: `14`
- `generateStaticParams` occurrences: `19`

Knip baseline (for REF-CLEANUP-005/006 follow-ups):

- `refactor/production-push/baseline-knip-2026-02-25.txt`

## Regenerate

```bash
pnpm -s architecture:scan
pnpm -s ts:gate

# prod-ish counters
rg "as unknown as" app components lib hooks -g"*.ts" -g"*.tsx" -g"!**/*.test.*" -g"!**/*.spec.*" -g"!**/__tests__/**" -g"!**/test/**" -g"!**/e2e/**"
rg "console\\.(log|debug|info|warn|error)" app components lib hooks -g"*.ts" -g"*.tsx" -g"!**/*.test.*" -g"!**/*.spec.*" -g"!**/__tests__/**" -g"!**/test/**" -g"!**/e2e/**"
rg "\\bpb-20\\b" app components lib hooks -g"*.ts" -g"*.tsx" -g"!**/*.test.*" -g"!**/*.spec.*" -g"!**/__tests__/**" -g"!**/test/**" -g"!**/e2e/**"
rg "generateStaticParams" app -g"*.ts" -g"*.tsx"
```
