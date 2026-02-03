# Verification Policy (Treido)

Verification is a gate, not a vibe.

## Always (after every batch)

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

If any fail: stop, fix, re-run.

## Risk-based tests

Run the smallest test that proves correctness for the risk:

### UI-only refactors

- `pnpm -s test:unit` when components/hooks/utils changed

### Auth / checkout / payments / webhooks

- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
- consider unit tests for parsing/validation logic when added

### Supabase schema / RLS / policies

- run Supabase advisors via MCP when applicable
- regenerate types when schema changes

## “Done” definition

For a batch to be considered shipped:

- gates are green
- risk-based tests are green (when applicable)
- user-facing strings remain next-intl compliant
- Tailwind rails remain clean (`styles:gate`)

