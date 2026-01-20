# TypeScript Full Audit — 2026-01-20

## Evidence

- Typecheck: pass (`pnpm -s exec tsc -p tsconfig.json --noEmit`)
- Safety gate: `codex-xhigh/typescript/ts-gate-2026-01-20.log` (❌ 66 new unsafe patterns)
- Knip: `codex-xhigh/typescript/knip-2026-01-20.log` (unused files/deps/exports)
- Quick counts (TS/TSX only, excluding deps/artifacts):
  - `any`: 89 matching lines
  - `as any`: 29 matching lines
  - `@ts-ignore` / `@ts-expect-error`: 0 matches

## What `ts:gate` is

`pnpm -s ts:gate` runs `scripts/ts-safety-gate.mjs`, comparing the repo against `scripts/ts-safety-gate.baseline.json` and failing on *new* unsafe patterns (`any`, `as any`, non-null assertions, etc.).

## Findings (prioritized)

### Critical

- [ ] `ts:gate` drift: 66 new unsafe patterns
  - Evidence: `codex-xhigh/typescript/ts-gate-2026-01-20.log`
  - Fix approach: repair in the touched files (preferred) vs intentionally accept and update baseline (`pnpm -s ts:gate:baseline`).

### High

- [ ] Non-null assertions and `as any` exist in core flows (checkout, payments, inventory, mobile drawers). Fix where these values can be truly absent; otherwise add explicit guards and/or narrow types.
  - Example drift entries:
    - `app/[locale]/(checkout)/_actions/checkout.ts:106:37` (non-null)
    - `app/api/payments/webhook/route.ts:55:27` (as-any)

### Medium

- [ ] Knip: unused files (49) — delete after verifying route usage (demo + legacy UI surfaces are common offenders).
- [ ] Knip: unused exports (15) + unused exported types (5) — remove or consolidate to reduce API surface.
- [ ] Knip: configuration hints — entry patterns likely need refinement after deletions (`knip.json`, `middleware.entry.ts`).

### Low

- [ ] Standardize “safe patterns”:
  - Prefer `unknown` + refinement over `any`
  - Prefer early returns over non-null assertions
