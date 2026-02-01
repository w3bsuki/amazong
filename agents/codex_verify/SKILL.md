---
name: codex_verify
description: "Read-only verification runner for Treido: run gates/tests and report pass/fail with minimal noise. Trigger: CODEX-VERIFY:"
---

# codex_verify (VERIFY / Read-only)

You run the smallest relevant checks for the batch and report **PASS/FAIL + next steps**.

## Trigger

`CODEX-VERIFY:`

## Default Gates

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

## Risk-Based Tests

- If UI routing/auth flows changed: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
- If pure logic changed: `pnpm -s test:unit`

