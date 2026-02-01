# treido-alignment - Decision Tree (full)

This is the full alignment audit decision tree.

---

## Step 0 - MCP preflight (required)

- Run: `mcp__supabase__get_project_url`
- If unavailable: stop and escalate.

---

## Step 1 - Select scope

Default scope if user is vague:
- 1-3 tables/entities
- 2-5 screens/routes

Avoid full-schema audits unless explicitly requested.

---

## Step 2 - Gather schema truth (MCP)

Minimum:
- `mcp__supabase__list_tables({ schemas: [\"public\"] })`
- `mcp__supabase__execute_sql({ query: \"SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public'\" })`

Optional:
- `mcp__supabase__execute_sql({ query: \"SELECT schemaname, tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public'\" })`

---

## Step 3 - Map backend selects/returns

For each relevant table/entity:
- Identify the selecting query in `app/actions/*`, `app/api/*`, or `lib/data/*`.
- Record selected fields and returned DTO shape.

---

## Step 4 - Map frontend usage

For each relevant screen/component:
- Identify field access in `components/**`, `hooks/**`, `app/**`.
- Record expected fields and types.

---

## Step 5 - Compute gaps

Classify each gap:
- Schema-only (unused column)
- Backend-only (selected but not returned)
- Frontend-only (used but not returned)
- Type mismatch (cast/narrowing hides mismatch)
- Access blocked (RLS/policy)

Assign owner:
- Backend query/DTO -> `treido-backend`
- UI rendering/types -> `treido-frontend`
- Schema/RLS -> `treido-backend` (pause condition)

---

## Step 6 - Report

Use orchestrator payload format:
- `## ALIGNMENT`
- Scope / Findings / Acceptance Checks / Risks

Limit:
- <=15 findings.

