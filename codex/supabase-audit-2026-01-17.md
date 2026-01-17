# Supabase Backend Audit (2026-01-17)

## Scope
- Supabase backend schema, RLS, functions, triggers, cron jobs, and API usage patterns.
- Supabase MCP advisor findings (security + performance).

## Executive Summary (Top Offenders)
1. **Policy sprawl + inconsistent function definitions**: `validate_username` is redefined in three migrations with different rules/search_path, increasing drift risk and audit noise. See [supabase/migrations/20251215200000_unified_profile_system.sql](supabase/migrations/20251215200000_unified_profile_system.sql#L286-L324), [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L14-L45), [supabase/migrations/20251219000000_phase12_security_performance_audit.sql](supabase/migrations/20251219000000_phase12_security_performance_audit.sql#L54-L93).
2. **Public read policies on stats/followers**: `buyer_stats`, `seller_stats`, and `store_followers` are `USING (true)` (public) even after consolidation, which is easy to forget and may be too open. See [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L163), [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L176), [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L189).
3. **Hardcoded admin role string in policies/functions**: `role = 'admin'` appears in RLS and helper functions, coupling logic to a single string. See [supabase/migrations/20251124000000_production_ready.sql](supabase/migrations/20251124000000_production_ready.sql#L27-L31) and [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L148).
4. **Public materialized view exposure**: `category_stats` is readable by anon/auth and was flagged by advisors. Confirm this is intended. See [supabase/migrations/20260112000000_category_stats_view.sql](supabase/migrations/20260112000000_category_stats_view.sql#L19-L54).
5. **Write amplification risks**: multiple triggers + cron cleanup are heavy on write paths (notifications, order status changes, review feedback). See [supabase/migrations/20251214000000_notifications_table.sql](supabase/migrations/20251214000000_notifications_table.sql#L23-L118), [supabase/migrations/20251214100000_reviews_feedback_system.sql](supabase/migrations/20251214100000_reviews_feedback_system.sql#L132-L214), [supabase/migrations/20260110153100_fix_handle_order_item_status_change.sql](supabase/migrations/20260110153100_fix_handle_order_item_status_change.sql#L1-L70), [supabase/migrations/20260114020000_boost_expiry_cron.sql](supabase/migrations/20260114020000_boost_expiry_cron.sql#L12-L76).

---

## Supabase MCP Advisor Findings (must address)
- **Leaked password protection disabled**: enable Supabase Auth leaked password checks (advisor warning).
- **Materialized view exposed via Data APIs**: `category_stats` is selectable by anon/auth (advisor warning). See [supabase/migrations/20260112000000_category_stats_view.sql](supabase/migrations/20260112000000_category_stats_view.sql#L54).
- **Unused indexes**: advisors flagged multiple unused indexes (confirmed by index churn in cleanup/restore migrations). See [supabase/migrations/20260101170000_cleanup_over_engineered_rpcs.sql](supabase/migrations/20260101170000_cleanup_over_engineered_rpcs.sql#L94-L154) and [supabase/migrations/20260101193000_restore_foreign_key_indexes.sql](supabase/migrations/20260101193000_restore_foreign_key_indexes.sql#L1-L32).

---

## Detailed Findings

### 1) Schema / RLS / Function Drift
- **`validate_username` definition drift**: three migrations define different rules and security settings; this can cause runtime differences depending on migration order and makes audits unstable. See:
  - [supabase/migrations/20251215200000_unified_profile_system.sql](supabase/migrations/20251215200000_unified_profile_system.sql#L286-L324)
  - [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L14-L45)
  - [supabase/migrations/20251219000000_phase12_security_performance_audit.sql](supabase/migrations/20251219000000_phase12_security_performance_audit.sql#L54-L93)
- **Public read RLS on stats/followers**: `buyer_stats`, `seller_stats`, `store_followers` are globally readable with `USING (true)`; ensure these tables contain no sensitive data. See [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L163), [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L176), [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L189).
- **Hardcoded admin string**: role checks are tied to `admin`, which is brittle if roles evolve. See [supabase/migrations/20251124000000_production_ready.sql](supabase/migrations/20251124000000_production_ready.sql#L27-L31) and [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql#L148).

### 2) Over-Engineering / Churn in Migrations
- **RPC cleanup vs usage churn**: the migration explicitly removes “over‑engineered RPCs” and dozens of indexes, then later another migration re‑adds FK indexes after advisors complain, indicating oscillation and unclear baseline. See [supabase/migrations/20260101170000_cleanup_over_engineered_rpcs.sql](supabase/migrations/20260101170000_cleanup_over_engineered_rpcs.sql#L1-L154) and [supabase/migrations/20260101193000_restore_foreign_key_indexes.sql](supabase/migrations/20260101193000_restore_foreign_key_indexes.sql#L1-L32).
- **Duplicate storage bucket migrations**: `avatars` bucket + public policies are defined twice. This is noisy and a maintenance risk. See [supabase/migrations/20251215000000_avatars_storage.sql](supabase/migrations/20251215000000_avatars_storage.sql#L1-L35) and [supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql](supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql#L1-L35).

### 3) Performance / Ops Risks
- **Cron job every 5 minutes**: `cleanup_expired_boosts()` updates `listing_boosts` and `products` repeatedly and can write‑amplify on large tables. Monitor and consider adaptive scheduling. See [supabase/migrations/20260114020000_boost_expiry_cron.sql](supabase/migrations/20260114020000_boost_expiry_cron.sql#L12-L76).
- **Materialized view refresh costs**: `category_stats` uses a recursive CTE and must be refreshed externally; stale data risk and heavy refresh. See [supabase/migrations/20260112000000_category_stats_view.sql](supabase/migrations/20260112000000_category_stats_view.sql#L19-L67).
- **Trigger chains for notifications**: inserting into `messages` and `order_items` can fan out into notifications, which is expensive at scale. See [supabase/migrations/20251214000000_notifications_table.sql](supabase/migrations/20251214000000_notifications_table.sql#L69-L118).
- **Review/feedback triggers**: review and seller feedback inserts trigger notification writes and stats updates. See [supabase/migrations/20251214100000_reviews_feedback_system.sql](supabase/migrations/20251214100000_reviews_feedback_system.sql#L132-L214).
- **Order item triggers**: status-change handler inserts system messages and adds per‑row work; stock decrement trigger enforces atomic updates on insert. See [supabase/migrations/20260110153100_fix_handle_order_item_status_change.sql](supabase/migrations/20260110153100_fix_handle_order_item_status_change.sql#L1-L70) and [supabase/migrations/20260102130000_variant_id_cart_order_items.sql](supabase/migrations/20260102130000_variant_id_cart_order_items.sql#L240-L338).

### 4) App‑Side Usage Patterns (Supabase‑related tech debt)
- **Admin client at module scope** in checkout webhook (less flexible for per‑request scoping). See [app/api/checkout/webhook/route.ts](app/api/checkout/webhook/route.ts#L1-L9).
- **Service‑role admin in user deletion action**: `deleteAccount()` uses admin client; ensure extra guardrails and auditing. See [app/actions/profile.ts](app/actions/profile.ts#L470-L492).
- **Hardcoded plan select strings duplicated** in API and pages; drift risk. See [app/api/plans/route.ts](app/api/plans/route.ts#L24-L33) and [app/[locale]/(plans)/plans/page.tsx](app/[locale]/(plans)/plans/page.tsx#L13-L22).
- **Upgrade plan selects duplicated** between page + modal. See [app/[locale]/(account)/account/plans/upgrade/page.tsx](app/[locale]/(account)/account/plans/upgrade/page.tsx#L9-L12) and [app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx](app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx#L17-L20).
- **Category tree fetch duplication**: repeated selects/batching for L1–L3 in sell flow; a single RPC or view could simplify. See [app/[locale]/(sell)/sell/_lib/categories.ts](app/[locale]/(sell)/sell/_lib/categories.ts#L74-L134).
- **Wishlist cleanup RPC on every page load**: best‑effort cleanup runs on each view, adding DB write load. See [app/[locale]/(account)/account/wishlist/page.tsx](app/[locale]/(account)/account/wishlist/page.tsx#L34-L36).
- **Shared wishlist RPC used in three entrypoints**: repeated work and inconsistent caching/pagination concerns. See [app/api/wishlist/[token]/route.ts](app/api/wishlist/[token]/route.ts#L18-L22), [app/[locale]/(main)/wishlist/shared/[token]/page.tsx](app/[locale]/(main)/wishlist/shared/[token]/page.tsx#L31-L35), and [app/[locale]/(main)/wishlist/[token]/page.tsx](app/[locale]/(main)/wishlist/[token]/page.tsx#L29-L32).
- **Notifications feed query**: ordering by `created_at` and filtering by `user_id` without a composite index (relies on single‑column indexes). See [app/[locale]/(account)/account/(settings)/notifications/notifications-content.tsx](app/[locale]/(account)/account/(settings)/notifications/notifications-content.tsx#L208-L215) and [supabase/migrations/20260101193000_restore_foreign_key_indexes.sql](supabase/migrations/20260101193000_restore_foreign_key_indexes.sql#L17-L32).

### 5) Secret Handling (Supabase‑related)
- **Service role key present in local env**. Ensure `.env.local` is excluded from git and rotated if ever committed. See [.env.local](.env.local#L10). The template placeholder is in [.env.local.example](.env.local.example#L7).

---

## Recommendations (Prioritized)
1. **Unify and lock down `validate_username`**: choose one definition and delete older duplicates to avoid drift.
2. **Review public RLS policies**: confirm if `buyer_stats`, `seller_stats`, `store_followers`, and `category_stats` are intended to be public. If not, tighten.
3. **Normalize admin role checks**: replace string literals with a centralized role enum or `is_admin()` and align policies.
4. **Reduce write amplification**: batch or defer notification inserts and consider async jobs for non‑critical notifications.
5. **Formalize cron + refresh strategy**: document `category_stats` refresh cadence and ensure job status monitoring.
6. **Deduplicate plan select constants**: centralize plan projections to avoid drift.
7. **Remove duplicate avatars migrations**: collapse into one source of truth.
8. **Address leaked password protection**: enable in Supabase Auth settings.

---

## Phase Log
- **Phase 1 (Supabase surface scan)**: Supabase MCP table/schema inventory + advisor checks.
- **Phase 2 (Schema/RLS)**: Checked RLS policies, function drift, public access patterns.
- **Phase 3 (API/client usage)**: Mapped Supabase usage for admin endpoints, duplicated selects, and RPC usage.
- **Phase 4 (Perf/ops)**: Reviewed cron jobs, triggers, and write amplification patterns.

---

## Appendix: Supabase MCP Snapshot (Selected)
- Large tables: `categories` (13k+ rows), `category_attributes` (7k+ rows), `products` (247 rows) (Supabase MCP table list).
- Advisors flagged `category_stats` view exposure and disabled leaked password protection (Supabase MCP security advisors).
