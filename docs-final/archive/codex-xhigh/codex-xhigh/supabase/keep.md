# Supabase — Keep

- RLS-first posture + migrations-only workflow.
- Tables as the primary API (keep RPC usage minimal and justified).
- Storage buckets and policies aligned with upload routes.
- Idempotent webhook/service-role writes scoped to server-only routes/actions.

