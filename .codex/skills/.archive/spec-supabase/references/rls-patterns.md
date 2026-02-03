# RLS Patterns (Supabase Postgres) - Audit Guide

RLS is the primary authorization layer. App-side checks are not enough.

## Minimum Bar (Treido)

- RLS enabled on all user-data tables
- explicit policies for each allowed operation
- default-deny posture (no policy means no access)
- policies reference auth in a stable way:
  - prefer `(SELECT auth.uid())` in predicates (evaluated once per query) per `.codex/project/ARCHITECTURE.md`

## Policy Shapes To Expect

### Row ownership

Typical:
- user can read/update rows where `user_id = (SELECT auth.uid())`

Audit for:
- missing `WITH CHECK` on inserts/updates (allows writing rows for other users)
- `USING` condition present but `WITH CHECK` missing or different

### Public reads vs authenticated reads

If a table is public-read (e.g. categories):
- policy should be explicit and narrow
- writes should remain protected

Audit for:
- accidental world-readable user data
- policies that allow `anon` unexpectedly

### Admin bypass patterns

Admin access should be:
- via server-only service role client
- limited to server actions/route handlers with explicit authorization checks

Audit for:
- service role usage in any client bundle or shared UI code
- "admin" policies that are too broad (if role-based auth exists)

## Common RLS Pitfalls

- Using `auth.uid()` directly in multiple places; inside joins/subqueries it can behave unexpectedly. Prefer `(SELECT auth.uid())`.
- Policies that allow `anon` due to permissive `USING (true)` patterns.
- Missing foreign key constraints leading to orphan rows that are still readable.
- Over-reliance on `auth.jwt()` claims without enforcing their issuance and refresh semantics.
- Storage buckets with permissive `INSERT`/`UPDATE` policies (world-writable uploads).

## Evidence Collection Tips

For each RLS issue, cite:
- the migration file and line where the table/policy is defined
- the policy name + command (`SELECT/INSERT/...`)
- the precise predicate difference needed (`USING` vs `WITH CHECK`)

Suggested acceptance checks:
- validate access matrix with at least one "anon vs authed vs owner" scenario (conceptual if no local DB)

