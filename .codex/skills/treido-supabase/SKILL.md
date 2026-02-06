---
name: treido-supabase
description: Supabase + Postgres specialist for Treido. Use for RLS-safe query shape, selecting the correct client, and performance hygiene (explicit selects, avoid select('*')). Not for UI styling.
---

# treido-supabase

Treido Supabase/Postgres specialist for query safety, RLS-aware patterns, and performance hygiene.

## When to Apply

- Designing or reviewing Supabase query shape in app/server code.
- Performance-sensitive query tuning (indexes, filters, payload size).
- Choosing static/user/admin Supabase client in server code.
- Reviewing schema and policy impact of backend changes.

## When NOT to Apply

- Pure UI styling or layout concerns.
- Stripe payment flow design with no DB impact.
- Generic Next.js layout/routing work with no data layer decisions.

## Non-Negotiables

- Avoid `select('*')` in hot paths; project explicit fields.
- Respect RLS assumptions for user-scoped data.
- Use the minimum-privilege client for each context.
- Treat schema/RLS changes as high-risk and require explicit approval.

## Treido Query Hygiene

- Keep API payloads narrow and stable.
- Avoid unbounded scans for list endpoints.
- Prefer indexed filters/sorts for user-facing search/list routes.

## Output Template

```md
## Query Plan
- <client choice + select fields + filters>

## Risk
- <rls / perf / policy risk>

## Verification
- <queries/tests/manual checks>
```

## References

- `docs/DATABASE.md`
- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/AGENTS.md`
- `docs/WORKFLOW.md`
- `.codex/skills/treido-supabase/references/_sections.md`
