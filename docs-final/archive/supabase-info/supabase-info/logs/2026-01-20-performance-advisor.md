# Performance Advisor (INFO only)

**Unused indexes (28 INFO-level, no WARN):**
- Admin tables (`admin_docs`, `admin_tasks`, `admin_notes`) — new, not yet used
- FK indexes on low-traffic tables — will be used as traffic grows
- Recently-added indexes (`last_active`, `fulfillment_status`) — pre-production

**RLS initplan warnings (3 WARN):**
- `admin_docs_admin_only`, `admin_tasks_admin_only`, `admin_notes_admin_only`
- These use `auth.uid()` instead of `(select auth.uid())`
- Impact: Low (admin-only tables, very few rows)
- Status: DEFERRED (not blocking launch)
