---
name: treido-spec
description: Spec-driven development skill (one-page spec + task breakdown + acceptance criteria). Triggers on "SPEC:" prefix and feature planning requests.
version: 1.0.0
---

# Treido Spec (Spec-Driven Development)

Use this skill to turn a vague request into an execution-ready pack: scope, acceptance criteria, risks, and a decomposed task list that can be handed to role skills/agents.

## Entry Criteria (ask if missing)

- Outcome: what should the user be able to do?
- Constraints: “no schema changes”, “no new deps”, preserve URLs/UI, etc.
- Surfaces: which routes/screens are involved (or “unknown”).
- Success criteria: UX + correctness + perf + tests.

## On Any "SPEC:" Prompt

1. Load the relevant canonical docs:
   - UI/i18n: `docs/FRONTEND.md` + `docs/DESIGN.md`
   - Data/auth/payments: `docs/BACKEND.md` + `docs/ENGINEERING.md`
   - Tests/gates: `docs/TESTING.md`
2. Write a one-page spec using the template below.
3. Decompose into shippable steps:
   - Each step is 1–3 files (or one migration) and can be verified independently.
   - Every step includes verification (gates + any targeted tests).
4. Generate copy/paste prompts for execution roles:
   - `FRONTEND:` for UI work
   - `BACKEND:` for server actions/route handlers
   - `SUPABASE:` for RLS/migrations audits
   - `TAILWIND:` / `SHADCN:` for styling system hygiene
   - `I18N:` / `NEXTJS:` / `TS:` / `TEST:` / `PERF:` / `A11Y:` / `STRIPE:` as needed

## Spec Template

```markdown
# Spec: <title>

## Goal
- …

## Non-Goals
- …

## Users / Roles
- …

## UX (happy path + edge states)
- Screens/routes:
- States: loading / empty / error / unauthorized

## Data + Auth
- Tables (if any):
- RLS expectations:
- Supabase client choice:

## Caching + Invalidation (if relevant)
- Cache profile/tag:
- Invalidation points:

## i18n
- New keys:
- Routing notes:

## Acceptance Criteria (testable)
- [ ] …
- [ ] …

## Risks / Gotchas
- …

## Task Breakdown (shippable)
1. …
2. …

## Verification
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
```

## Output Template (Execution Pack)

```markdown
## Spec Summary
- …

## Task Breakdown
1. …

## Prompts (copy/paste)
### FRONTEND
FRONTEND: …

### BACKEND
BACKEND: …

### SUPABASE
SUPABASE: …
```

## Examples

### Example prompt
`SPEC: plan saved searches for buyers`

### Expected behavior
- Produce a one-page spec, task breakdown, and role prompts.
- Include verification gates and acceptance criteria.
