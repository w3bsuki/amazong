# Production Push (Operational Plan)

> Domain: `treido.eu` / `www.treido.eu`  
> Goal: ship safely, reduce regressions + cost, and keep changes small  
> Use this doc as the day-to-day runbook; deeper details live in the linked docs.

## Non‑Negotiables (Rails)

- No rewrites, no redesigns. Ship in small, verifiable batches.
- Don’t touch secrets. Don’t log keys/JWTs/full request bodies.
- Every non-trivial batch must pass:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Source of Truth Docs

- Master checklist: `docs/production/MASTER_PLAN.md`
- Blocking launch tasks: `docs/production/10-production-blockers.md`
- UI drift plan: `docs/UI_AUDIT_PLAN.md`
- Supabase ops checklist: `supabase_tasks.md`
- Deep dives: `docs/production/00-file-cleanup.md`, `docs/production/07-performance.md`, `docs/production/08-security.md`, `docs/production/09-go-live.md`

## Execution Order (Practical)

1) **Blockers (Dashboard + env + payments)**
   - Track work in `docs/production/10-production-blockers.md`.
   - Anything requiring Supabase/Stripe/Vercel dashboard changes: do it first, then re-verify auth + checkout flows.

2) **Green gates (CI-style)**
   - Minimum per-batch: typecheck + E2E smoke.
   - Pre-release: `REUSE_EXISTING_SERVER=true pnpm test:e2e` and `pnpm build`.

3) **Security gate (Supabase)**
   - Target: **0 security advisor warnings**.
   - Track status in `supabase_tasks.md`.

4) **Performance + Vercel cost**
   - Focus: middleware scope, ISR write explosions, over-fetching.
   - Track work in `docs/production/07-performance.md`.

5) **UI drift (high-traffic surfaces first)**
   - Home, Search, Product, Auth, Checkout, Account.
   - Drive work using `cleanup/palette-scan-report.txt` + `cleanup/arbitrary-scan-report.txt` and `docs/UI_AUDIT_PLAN.md`.

6) **Cleanup (post-stability)**
   - Remove dead code/files, resolve/triage TODOs, remove accidental console logs.
   - Track work in `docs/production/00-file-cleanup.md`.

## Batch Template (Copy/Paste)

**Batch name:** …  
**Scope (1–3 files/features):** …  
**Risk:** low / med / high  
**Verification:** `tsc` + `e2e:smoke` (+ specific spec if relevant)

**Done when:**
- No behavior/style regressions on touched screens
- Typecheck passes
- E2E smoke passes
- Any dashboard tasks are recorded (what changed + who did it + date)

## “Perfect code” Reality Check

Aim for production-grade reliability, not “audit everything before shipping”.
If a change risks a cascade (large refactor, broad styling rewrite), split it into smaller slices and defer the rest to post-launch cleanup with a tracked issue.

