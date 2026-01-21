# Supabase Advisor Results - 2026-01-21

## Security Advisors (2 warnings)

### 1. Leaked Password Protection Disabled (WARN)
**Detail:** Supabase Auth prevents the use of compromised passwords by checking against HaveIBeenPwned.org. Enable this feature.
**Remediation:** https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
**Action Required:** Enable in Supabase Dashboard → Auth → Settings

### 2. Materialized View in API (WARN)
**Detail:** Materialized view `public.category_stats` is selectable by anon or authenticated roles.
**Remediation:** https://supabase.com/docs/guides/database/database-linter?lint=0016_materialized_view_in_api
**Action:** This is intentional for performance - category stats are public data.

---

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

---

## Summary of Required Actions

1. **Dashboard:** Enable leaked password protection
2. **Migration:** Fix admin table RLS policies (consolidate duplicates, wrap auth in SELECT)
3. **Migration:** Drop duplicate indexes on admin tables
4. **Monitor:** Unused indexes (defer cleanup until post-launch data)
