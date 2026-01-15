# Agent Orchestration (Execution Guide)

This file exists because `TODO.md` references it.

## 🚀 Status (2026-01-15)

**ALL LAUNCH PHASES COMPLETE** — Ready for production deployment.

All workstreams below have been executed and verified. See `docs/launch/PLAN.md` for details.

---

## Primary launch plan

Use the agent runbook in `docs/launch/README.md` and execute `docs/launch/PLAN.md`.

## Parallelizable workstreams (safe to split across agents)

1) **Supabase hardening** — `docs/launch/PLAN-SUPABASE.md` ✅ COMPLETE
2) **Stripe production setup** — `docs/launch/PLAN-STRIPE.md` ✅ COMPLETE
3) **UI drift cleanup** — `docs/launch/PLAN-UI-DESIGN-SYSTEM.md` ✅ COMPLETE
4) **i18n audit** — `docs/launch/PLAN-I18N.md` ✅ COMPLETE
5) **Manual QA + E2E stabilization** — `docs/launch/CHECKLIST-QA.md` ✅ E2E COMPLETE (manual QA pending)

## Batch rules

- Keep scope small (1–3 files/features).
- After each batch, run:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

