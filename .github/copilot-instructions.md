# Copilot Instructions (Treido)

## Canonical contract

- Follow root `AGENTS.md` as the single source of truth for non-negotiables.
- Root `AGENTS.md` includes execution rules, boundaries, and output contract.

## Default mode

- Implement directly for normal tasks (UI, styling, components, refactoring, tests, docs).
- The current implementer owns planning, decisions, and code edits.

## UI & Design work

- Read `docs/DESIGN.md` for token contracts, frontend defaults, and layout rules.
- Apply the Design Thinking checklist before building any new UI surface.
- Apply the Anti-Slop Rules during implementation.
- Typography, color, and motion must use semantic tokens — never bypass.

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based (when touching business logic):
```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

## Reference (read only when needed)

- Boundaries/pause rules: `AGENTS.md`
- Domain contracts: `docs/DOMAINS.md`
- Decision log: `docs/DECISIONS.md`
