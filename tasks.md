# Production Execution Checklist

This file exists because `docs/PRODUCTION.md` references it.

Start with:
- `docs/launch/README.md`
- `docs/launch/PLAN.md`

## Gates (run after changes)

- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Hard blockers (must be green before launch)

- Supabase security advisors are green (or accepted + documented).
- Stripe verified end-to-end in the real deployment environment (if taking payments).
- Core user flows pass manual QA: `docs/launch/CHECKLIST-QA.md`.

