# Rules (Canonical)

This file tells agents (and humans) which docs to read for a task, and the non-negotiable rails to follow.

## What to read (decision tree)

- UI/UX changes: `docs/FRONTEND.md` + `docs/DESIGN.md` + `docs/ENGINEERING.md`
- Styling/tokens cleanup: `docs/DESIGN.md`
- Supabase/data/caching/server actions: `docs/BACKEND.md` + `docs/ENGINEERING.md`
- Feature navigation (routes/actions/DB/tests): `docs/FEATURES.md`
- Tests/gates: `docs/TESTING.md`
- Production/deployment: `docs/PRODUCTION.md`
- Product scope/roadmap decisions: `docs/PRODUCT.md`

## Rails (non-negotiable)

- No secrets in logs (keys/JWTs/full request bodies/PII).
- All user-facing strings via `next-intl` (`messages/en.json` + `messages/bg.json`).
- No gradients; no arbitrary Tailwind values unless unavoidable.
- Small, verifiable batches (no rewrites / no redesigns).

## Required gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
