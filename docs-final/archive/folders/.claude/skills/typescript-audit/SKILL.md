---
name: typescript-audit
description: TypeScript safety gate + drift control (no new any/as any/non-null assertions). Triggers on "TS:" prefix and TypeScript safety work.
---

# TypeScript Audit (TS Safety Gate)

Use this skill to keep TypeScript safety from regressing. This repo enforces a “no new unsafe patterns” gate.

## Entry Criteria (ask if missing)

- Scope: recent diff / file(s) / lane (frontend/backend)
- Whether baseline updates are allowed (default: no)

## On Any "TS:" Prompt

1. Run the safety gate:
   - `pnpm -s ts:gate`
2. Fix new findings by default:
   - Replace `any` with real types (or `unknown` + runtime validation).
   - Replace `as any` with correct narrowing or typed helpers.
   - Replace non-null assertions (`!`) with proper guards.
3. Only update the baseline with explicit approval:
   - `pnpm -s ts:gate:baseline`
   - Record why the baseline changed (and prefer follow-up tasks to remove it).
4. Keep fixes scoped:
   - No refactors while removing unsafe patterns unless necessary for correctness.

## Output Format

```markdown
## TS Audit — {date}

### New Findings
- …

### Fix Plan
1. …

### Verification
- [ ] `pnpm -s ts:gate`
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
```

## Examples

### Example prompt
`TS: address new any usage in lib/data`

### Expected behavior
- Run `pnpm -s ts:gate` and fix new findings without refactors.
- Update the baseline only with explicit approval.
- Report fixes and verification steps.
