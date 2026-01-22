# Supabase Full Audit — 2026-01-20

## Evidence

- Lane summary: `codex-xhigh/supabase/AUDIT-2026-01-20.md`
- Full execution log: `codex-xhigh/logs/2026-01-20-supabase.md`
- Canonical source of truth: `supabase/migrations/*`

## Findings (prioritized)

### Critical

- [ ] Supabase Dashboard: enable leaked password protection
  - Reference: `docs/PRODUCTION.md`
  - Board: `codex-xhigh/EXECUTION-BOARD.md` (`P1-SUPA-05`)

### High

- [ ] Performance advisor “RLS initplan” warnings are deferred; keep deferred unless query patterns justify the change (see `codex-xhigh/logs/2026-01-20-supabase.md`).

### Verified (already done)

- Required migrations applied in production (avatars bucket, stock fix, order status fix).
- Security advisor actionable warnings resolved (accepted items documented).
- Storage buckets/policies verified (`avatars`, `product-images`).
- Function drift risk removed (`validate_username` single canonical definition).
