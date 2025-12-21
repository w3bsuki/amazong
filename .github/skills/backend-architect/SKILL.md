---
name: backend-architect
description: Design and evolve backend architecture for this Next.js 16 + Supabase + Stripe repo. Use when the user asks to add/modify APIs, database schemas, auth/authorization, data flows, integrations, performance/caching, or to propose a clean end-to-end backend approach.
---

# Backend Architect (Next.js + Supabase + Stripe)

This skill focuses on **end-to-end backend design**: data modeling, API boundaries, security (auth/RLS), and operational concerns (performance, observability), while staying aligned with this repo’s conventions.

## Non-negotiables for this repo

- Prefer **Supabase** (Postgres + RLS) as the source of truth for app data.
- For any DB schema (DDL) changes: use migrations under `supabase/` (don’t hand-edit production tables ad-hoc).
- Treat authorization as **defense in depth**:
  - App-layer checks (session/user ID validation)
  - DB-layer RLS policies where applicable
- Keep route/feature boundaries aligned with `STRUCTURE.md` (route-owned server actions under `app/[locale]/.../_actions/`, shared utilities in `lib/`).
- For payments: respect Stripe best practices (server-side secret usage only; webhooks for async truth).

## Architecture workflow

1. **Clarify requirements (briefly)**
   - Entities: what data exists? who owns it?
   - Operations: create/update/read flows, admin vs user capabilities
   - Non-functional: latency, consistency, rate limits, compliance needs

2. **Choose the system boundaries**
   - **Server Actions** vs **Route Handlers** (`app/[locale]/api/...`) vs **Edge Functions** (only if needed).
   - Prefer Server Actions for UI-coupled mutations; prefer Route Handlers for public/webhook style endpoints.

3. **Data model first**
   - Define tables, keys, and constraints.
   - Decide indexes based on query patterns.
   - Decide audit fields (created_at, updated_at, seller_id, etc.).

4. **Authorization strategy**
   - Decide what must be enforced in RLS.
   - Define roles/claims: buyer/seller/admin.
   - Ensure reads are safe by default (least privilege).

5. **API contract + error model**
   - Define request/response payload shapes.
   - Prefer typed boundaries (Zod) at ingress.
   - Use consistent error responses; do not leak sensitive info.

6. **Operational concerns**
   - Performance: avoid N+1, use server-side pagination, add indexes.
   - Caching: only where correctness allows; tag/invalidate strategically.
   - Observability: log important events (auth failures, webhook failures).

7. **Implementation plan**
   - Small, incremental steps: migration → policies → API/actions → UI integration → tests.

## Output format when designing

When the user asks for architecture help, respond with:

- **Proposed design**: bullets: boundaries, key entities, main flows
- **Schema sketch**: tables/columns + important constraints
- **Auth/RLS plan**: who can do what
- **Implementation steps**: ordered checklist

## Resources (add only if needed)

- `references/…` — longer API/schema conventions when this skill grows.
- `scripts/…` — deterministic helpers (e.g., schema diff, policy audit) if you add them later.

## Examples (prompts that should trigger)

- “Design the database schema for wishlists and sharing.”
- “Add an API to search products with filters and pagination.”
- “How should we structure Stripe webhooks vs checkout session creation?”
- “Lock down seller data access with RLS.”
