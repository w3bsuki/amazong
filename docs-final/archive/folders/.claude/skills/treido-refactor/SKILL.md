---
name: treido-refactor
description: Safe, incremental refactoring for Treido. Triggers on "REFACTOR:" prefix, tech debt cleanup, splitting large files, or restructuring modules without changing behavior.
---

# Treido Refactor

## On Any "REFACTOR:" Prompt

1. Clarify the pain point (build time, duplication, boundary violations, testability) and define "done".
2. Choose an incremental path: each step touches 1-3 files and is shippable independently.
3. Preserve behavior and public contracts (routes, payloads, UI, translations, env usage).
4. Prefer deleting dead code over reorganizing.
5. After each step, run gates; if something breaks, revert that step and re-split.

## Guardrails

- No "rewrite" refactors; split into small batches.
- Keep route-private code inside its group (don't import across `app/[locale]/(group)/_*`).
- Keep `components/ui/` as shadcn primitives only.

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Examples

### Example prompt
`REFACTOR: split the mega product card component`

### Expected behavior
- Break the work into small, shippable steps (1–3 files each).
- Preserve behavior and boundaries, then run the gates.
