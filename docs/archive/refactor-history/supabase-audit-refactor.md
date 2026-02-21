# Supabase Audit + Refactor (Client & Queries)

> **For Codex CLI.** Audit Supabase client selection + query patterns for correctness and performance.
> Focus: correct client per context, projections (no wide selects), hot-path query efficiency, and type safety with `Database` types.
> **Does NOT touch:** DB schema/migrations/RLS (`supabase/`), auth/session/access control logic, payments/webhooks/Stripe internals. Stop and ask for approval if unavoidable.

---

## Prerequisites

1. Read `AGENTS.md` — Supabase client contract + security constraints (`getUser()` only).
2. Read `docs/STACK.md` — Supabase client table + caching rules.
3. Read `docs/DECISIONS.md` — `getSession()` ban, webhook ordering, `select('*')` ban.
4. Read `refactor/shared-rules.md` — batch + deletion discipline.

Optional: fetch latest Supabase JS v2 guidance via Context7 (client creation, Realtime, typing) if available.

---

## Phase 1: AUDIT (read-only — use subagents for bulk discovery)

Catalog findings:
- Client selection:
  - `createStaticClient()` only inside deterministic cached reads (`"use cache"`) — no cookies/headers/date
  - `createClient()` for user-specific server reads/actions
  - `createRouteHandlerClient(request)` for `app/api/**`
  - `createBrowserClient()` only in client-side modules
- Query hygiene:
  - No `select('*')` in hot paths (already mechanically enforced — confirm zero)
  - Projections: only select needed columns
  - Avoid wide joins in list views
  - Correct `.single()` / `.maybeSingle()` usage
  - Error handling consistency
- Typing:
  - Prefer `Database` types (`lib/supabase/database.types.ts`) and avoid `as unknown as ...` for query results when possible.

Output: structured findings grouped by folder (`app/`, `lib/data/`, `hooks/`).

---

## Phase 2: PLAN

Propose safe batches with file counts:
- **Batch A:** mechanical client selection fixes (no behavioral change)
- **Batch B:** projection tightening in non-sensitive list queries (keep output shape identical)
- **Batch C:** type-safety improvements for query results (minimal, no runtime parsing changes)

---

## Phase 3: EXECUTE

After each batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Rules:
- No DB/RLS/migration edits. No auth/session logic edits. No payments/webhook edits.
- Pixel + behavior parity.
- Prefer small, verifiable refactors.

---

## Phase 4: REPORT

After execution, generate `refactor/supabase-audit-report.md`:

```markdown
# Supabase Audit + Refactor — Report

Completed: YYYY-MM-DD

## Findings
[Grouped list]

## Changes Made
[Categorized list]

## What Was NOT Changed (and why)
[DB/auth/payments-sensitive items]

## Recommendations
[Follow-ups]
```

