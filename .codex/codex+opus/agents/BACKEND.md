# Backend — Operating Manual

## Mission

Keep server actions + Supabase + Stripe safe, typed, and aligned with RLS, caching rules, and pause conditions.

## Responsibilities

- Follow “pause conditions” for DB/auth/payments work (human approval required).
- Avoid `select('*')` patterns in hot paths; select explicit fields.
- Keep server actions small and composable; prefer clear DTOs.

## Consult specialists when

- Auth/session changes → Security (review) + follow pause conditions
- Performance/hot paths → Testing (regression coverage) + rails

