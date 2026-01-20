# Inventory (What Matters for Production)

This is a **focus map** of the most production-critical surfaces + known hotspots.

## P0/P1 user flows to verify end-to-end
Reference: `docs/launch/CHECKLIST-QA.md` and `docs/launch/FEATURES.md`.

1) Auth (signup/login/reset) + redirects
2) Onboarding (account type, profile, seller intent, Stripe payouts if required)
3) Sell (create listing, images, attributes, publish/edit)
4) Buy/checkout (if in-scope) + order creation + stock correctness
5) Orders (buyer + seller views, status updates)
6) Chat created by order + updates + notifications
7) Reviews/ratings (submit, view, delete, helpful votes)
8) Plans/subscriptions + upgrades/downgrades + gating business routes

## Known hotspots (evidence already exists)
- Production execution + P0 blockers: `codex/MASTER-PLAN.md`
- Supabase drift/risks (functions/RLS/triggers): `codex/supabase-audit-2026-01-17.md`
- Frontend boundary violations (components importing actions): `codex/AUDIT-core-app.md`
- i18n bypass/hardcoded strings: `docs/launch/PLAN-I18N.md` + `codex/MASTER-PLAN.md`
- Layout over-engineering history: `REFACTOR-LAYOUT-ARCHITECTURE.md`

## “Don’t lose time here” rules
- Don’t refactor for beauty unless it unblocks a P0/P1 flow.
- Don’t add new plan files in the repo root; add notes to `TODO.md` or this folder.
- Prefer deleting dead code over reorganizing (repo rail).

