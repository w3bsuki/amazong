# Supabase Audit Checklist

Start with: `docs/BACKEND.md` and `docs/PRODUCTION.md`.

## Migrations
- [ ] Production has the required migrations applied (avatars bucket, stock fix, order status fix).
- [ ] No duplicated function definitions drifting over time (e.g. `validate_username`).

## RLS
- [ ] RLS enabled on all user-facing tables.
- [ ] Public read policies (`USING (true)`) are explicitly justified.
- [ ] Policies use `(select auth.uid())` where applicable for perf.

## Triggers & correctness
- [ ] Exactly one stock decrement mechanism is active.
- [ ] Order status updates create correct chat/system events (and don’t explode writes).

## Advisors
- [ ] Security advisor warnings resolved or explicitly accepted (record decisions in `codex-xhigh/logs/`).
- [ ] Performance advisor changes are not applied blindly (verify query patterns first).
