# Task Writing (Treido Orchestrator)

Tasks are the control plane. Bad tasks create churn; good tasks ship fast.

## A good task is:

- **Atomic**: executable in a 1–3 file batch
- **Owned**: exactly one of the 4 core skills
- **Verifiable**: concrete commands + observable acceptance checks
- **Scoped**: explicit file list; explicit non-goals

## Canonical task template

Prefer this shape (works with linting heuristics and keeps diffs small):

```md
- [ ] <ID>: <short summary>
  - Priority: <Critical | High | Medium | Low>
  - Owner: <treido-frontend | treido-backend | treido-orchestrator>
  - Verify: `<commands>` · `<commands>`
  - Files: `<path>` · `<path>`
  - Audit: `.codex/audit/YYYY-MM-DD_<context>.md` (<FINDING_IDs>)
```

Notes:

- Include `Audit:` only when the task is a direct promotion from an audit finding.
- Use `Verify:` for commands; use “Acceptance” bullets only when commands can’t express the outcome.

## IDs (stable + sortable)

Use a lane prefix and monotonic numbers:

- Frontend UI bundle: `FE-UI-###`, `FE-UX-###`
- Backend: `BE-###` or reuse the audit finding ID prefix (`TS-###`, `SUPABASE-###`) when it’s clearly lane-owned

## Acceptance checks (what to prefer)

Prefer checks you can run:

- Type safety: `pnpm -s typecheck`
- Lint: `pnpm -s lint`
- Tailwind rails: `pnpm -s styles:gate`
- Unit tests: `pnpm -s test:unit`
- E2E smoke: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

Prefer “observable outcomes” only for UI behavior:

- “Drawer body scroll stays locked on iOS Safari”
- “Empty state renders localized copy”

## Dedupe rules

If two findings point at the same root cause:

- keep one task with the broader fix
- mention both finding IDs in the `Audit:` line

If a task would touch more than 3 files:

- split it
- make the first task unblock the rest (e.g., extract a shared helper first)

