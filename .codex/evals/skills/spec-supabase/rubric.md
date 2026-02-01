# spec-supabase Evaluation Rubric

## Deterministic Checks (Pass/Fail)

| Check | Validation |
|-------|------------|
| `heading_correct` | Output starts with `## SUPABASE` |
| `sections_present` | Contains Scope, Findings, Acceptance Checks, Risks |
| `ids_sequential` | Finding IDs are `SUPABASE-001..n` with no gaps |
| `evidence_present` | Every finding has `path:line` evidence |
| `read_only` | No file patches, no TASKS.md edits suggested |
| `no_secrets` | No env values, service keys, or secrets in output |

## Qualitative Criteria (0-3 Scale)

### RLS Coverage (0-3)
- **3**: Correctly identifies missing/weak RLS policies
- **2**: Most RLS issues found, minor misses
- **1**: Some RLS issues found but significant gaps
- **0**: Fails to identify obvious RLS violations

### Query Optimization (0-3)
- **3**: Correctly identifies wildcard selects, N+1 patterns
- **2**: Most query issues found
- **1**: Some query issues found but significant gaps
- **0**: Misses obvious optimization issues

### Client Context (0-3)
- **3**: Correctly identifies client type misuse (server/client/admin)
- **2**: Most context issues found
- **1**: Some context issues found but significant gaps
- **0**: Misses obvious client misuse

### Evidence Quality (0-3)
- **3**: All findings cite exact file:line, reproducible
- **2**: Most findings have good evidence
- **1**: Evidence present but imprecise
- **0**: Missing or fabricated evidence

## Scoring

- **Deterministic**: All 6 checks must pass
- **Qualitative**: Sum of 4 criteria (0-12)
  - **10-12**: Excellent
  - **7-9**: Good
  - **4-6**: Needs improvement
  - **0-3**: Fail

## Critical Patterns to Detect

1. **RLS missing**: Tables without `enable row level security`
2. **Wildcard selects**: `select('*')` or bare `.select()` in hot paths
3. **Admin client exposure**: `SUPABASE_SERVICE_ROLE_KEY` or `createAdminClient` in client bundles
4. **Auth in cached**: `auth.uid()` or user-specific queries in `'use cache'` functions
5. **N+1 queries**: Looping queries in server components/actions

## Client Type Matrix (Reference)

| Context | Correct Client |
|---------|---------------|
| Server Components | `createClient()` from `lib/supabase/server.ts` |
| Server Actions | `createClient()` from `lib/supabase/server.ts` |
| Cached/Public reads | `createStaticClient()` (no cookies) |
| Route Handlers | `createRouteHandlerClient(request)` |
| Browser | `createClient()` from `lib/supabase/client.ts` |
| Admin ops | `createAdminClient()` (server-only!) |
