---
name: treido-architect
description: Architecture/design support for Treido (feature design, module boundaries, data flow, caching, Supabase/Stripe integration). Triggers on "ARCH:" prefix or when asked to propose an architecture or migration plan.
---

# Treido Architect

## On Any "ARCH:" Prompt

1. Restate the goal, constraints, and success criteria (perf, security, UX, i18n, rollout).
2. Map the affected surfaces (routes, server actions, DB tables/RLS, UI screens, payments).
3. Propose 2-3 options with tradeoffs; pick one and justify it.
4. Provide an incremental rollout plan (milestones, flags, migrations, verification gates).
5. Call out risks (security, data integrity, cache invalidation, payment idempotency) and mitigations.

## Output Template

```markdown
## Goal
- ...

## Constraints
- ...

## Proposed Design
- Data flow:
- Module boundaries:
- API contracts:

## Alternatives Considered
- Option A:
- Option B:

## Rollout Plan
1. Step (1-3 files / migration)
2. Verification: typecheck / unit / e2e smoke

## Risks & Mitigations
- ...
```

## Docs (load when needed)

| Topic | File |
|------|------|
| Engineering rules | `docs/ENGINEERING.md` |
| Backend guide | `docs/BACKEND.md` |
| Frontend guide | `docs/FRONTEND.md` |
| Production checklist | `docs/PRODUCTION.md` |

## Examples

### Example prompt
`ARCH: design caching for seller analytics dashboards`

### Expected behavior
- Provide options with tradeoffs, pick one, and outline a rollout plan.
- Call out risks and mitigations.
