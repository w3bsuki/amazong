# Verify Playbook (Treido)

Verify is read-only QA after a batch lands.

## Always-run gates

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Or via helper:

```bash
node .codex/skills/treido-verify/scripts/run-gates.mjs
```

## Risk-based tests (minimum set)

Pick the smallest test that matches the risk:

- UI-only changes: `pnpm -s test:unit` (when components/hooks/utils changed)
- Auth/checkout/payments/webhooks: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
- Supabase/RLS/migrations: run MCP advisors + regenerate types when schema changed

## Plan consistency checks (optional, read-only)

Lint the control plane:

```bash
node .codex/skills/treido-verify/scripts/lint-plan.mjs
```

## Output contract for VERIFY reports

Return:

- Gates run + pass/fail
- Tests run (if any) + pass/fail
- If failures: the smallest set of files/task IDs to fix next

