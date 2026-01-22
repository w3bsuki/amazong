# Supabase Advisor Results — 2026-01-21 (Performance)

## Performance Advisors (Multiple warnings)

### Critical: Multiple Permissive Policies (WARN)
Tables `admin_docs`, `admin_notes`, `admin_tasks` have **duplicate permissive policies**:
- Each has both named policies (e.g., "Admins can read admin docs") AND a catch-all `admin_*_admin_only` policy
- This causes ALL policies to execute for each query (performance penalty)

**Fix:** Drop duplicate policies, keep only ONE admin-only policy per table.

### Critical: Auth RLS Initplan (WARN)
Tables `admin_docs`, `admin_notes`, `admin_tasks` RLS policies re-evaluate `auth.uid()` for each row.

**Fix:** Replace `auth.uid()` with `(SELECT auth.uid())` in policy definitions.

### INFO: Unindexed Foreign Keys
- `admin_docs.author_id_fkey` - no covering index
- `admin_notes.author_id_fkey` - no covering index  
- `admin_tasks.assigned_to_fkey` - no covering index
- `admin_tasks.created_by_fkey` - no covering index

**Action:** Add indexes if these tables grow and JOINs become slow (currently low traffic admin tables).

### INFO: Duplicate Indexes (WARN)
- `admin_docs`: `{admin_docs_category_idx, idx_admin_docs_category}` - duplicates
- `admin_docs`: `{admin_docs_status_idx, idx_admin_docs_status}` - duplicates
- `admin_notes`: `{admin_notes_is_pinned_idx, idx_admin_notes_pinned}` - duplicates
- `admin_tasks`: `{admin_tasks_priority_idx, idx_admin_tasks_priority}` - duplicates
- `admin_tasks`: `{admin_tasks_status_idx, idx_admin_tasks_status}` - duplicates

**Fix:** Drop the duplicate indexes.

### INFO: Unused Indexes (36 indexes)
Most are on admin tables or low-traffic tables. Key ones to consider:
- `idx_listing_boosts_stripe_session` - unused
- `idx_listing_boosts_product_id` - unused
- Various admin table indexes - all unused

**Action:** Keep for now - most are on tables with < 20 rows. Monitor after launch.
