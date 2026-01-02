---
paths: supabase/**/*.sql, lib/**/*.ts, app/**/api/**/*.ts, app/**/actions/**/*.ts, app/**/_actions/**/*.ts
---

# Backend Architect (Next.js + Supabase + Stripe)

This rule covers **end-to-end backend design**: data modeling, API boundaries, security (auth/RLS), and operational concerns.

## MCP Tools for Auditing

Use Supabase MCP tools for database inspection:

- `mcp_supabase_list_tables` — View all tables, columns, RLS status, constraints
- `mcp_supabase_get_advisors(type: "security")` — Check for security issues
- `mcp_supabase_get_advisors(type: "performance")` — Find unused indexes, performance issues
- `mcp_supabase_list_migrations` — View migration history
- `mcp_supabase_execute_sql` — Run read queries for inspection
- `mcp_supabase_apply_migration` — Apply DDL changes
- `mcp_supabase_get_logs(service: "postgres")` — Debug query issues

## Non-negotiables

- Prefer **Supabase** (Postgres + RLS) as the source of truth for app data
- For DB schema (DDL) changes: use migrations under `supabase/` (don't hand-edit production)
- Authorization is **defense in depth**: app-layer checks + DB-layer RLS
- Keep route/feature boundaries aligned: route-owned server actions under `app/[locale]/.../_actions/`, shared utilities in `lib/`
- Stripe: server-side secrets only; webhooks for async truth

## Architecture Workflow

1. **Clarify requirements**
   - Entities, ownership, operations
   - Non-functional: latency, consistency, rate limits

2. **Choose system boundaries**
   - **Server Actions** for UI-coupled mutations
   - **Route Handlers** for public/webhook endpoints
   - **Edge Functions** only if needed

3. **Data model first**
   - Tables, keys, constraints, indexes
   - Audit fields (created_at, updated_at, seller_id)

4. **Authorization strategy**
   - RLS enforcement plan
   - Roles/claims: buyer/seller/admin
   - Least privilege reads by default

5. **API contract + error model**
   - Request/response shapes (Zod at ingress)
   - Consistent error responses; no leaked sensitive info

6. **Operational concerns**
   - Avoid N+1, use pagination, add indexes
   - Cache only where correctness allows
   - Log auth/webhook failures

7. **Implementation plan**
   - Incremental: migration → policies → API/actions → UI → tests

## Output Format

When asked for architecture help:

- **Proposed design**: boundaries, entities, flows
- **Schema sketch**: tables/columns + constraints
- **Auth/RLS plan**: who can do what
- **Implementation steps**: ordered checklist

## Trigger Prompts

- "Design the database schema for wishlists"
- "Add an API to search products with filters"
- "Structure Stripe webhooks vs checkout session creation"
- "Lock down seller data with RLS"
