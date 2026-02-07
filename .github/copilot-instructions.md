# Copilot Instructions (Treido)

## Canonical contract

- Follow root `AGENTS.md` as the single source of truth for non-negotiables.
- Use `docs/AGENTS.md` for detailed boundaries/output contract.

## Default mode

- Implement directly for normal tasks (UI, styling, components, refactoring, tests, docs).
- Skills are optional and only needed for specialist domains or explicit user request.
- Do not use subagents by default. Use subagents only when explicitly requested (for example, `run subagents`).

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

- Boundaries/pause rules: `docs/AGENTS.md`
- Workflow/gates: `docs/WORKFLOW.md`
- Skill index: `docs/SKILLS.md`
