# Production Plan (“Last 5%”)

Goal: ship safely with fewer regressions and lower Vercel/Supabase cost.

Execution checklist: `tasks.md`
## 🚀 Status (2026-01-15)

**READY FOR DEPLOYMENT** — All phases complete, all gates pass.

See `docs/launch/PLAN.md` and `TODO.md` for full status and deployment checklist.

| Gate | Status |
|------|--------|
| Lint | ✅ 0 errors |
| TypeScript | ✅ No errors |
| Unit tests | ✅ 399 passed |
| Build | ✅ 498 pages |
| E2E smoke | ✅ 16 passed |

---
## Non-negotiables

- No rewrites, no redesigns.
- Don’t touch secrets. Don’t log keys/JWTs/full request bodies.
- Every non-trivial batch must pass:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Execution order (practical)

1) **Blockers (dashboard + payments)**
2) **Green gates (CI-style)**
3) **Security gate (Supabase)**
4) **Performance + Vercel cost**
5) **UI drift (high-traffic surfaces first)**
6) **Cleanup (post-stability)**

## Blockers checklist (ship-stoppers)

### Stripe (payments must work) ✅ VERIFIED

- [x] Create Stripe products/prices for paid tiers.
- [x] Set price IDs in Supabase `subscription_plans`.
- [ ] Configure webhook endpoint: `https://treido.eu/api/subscriptions/webhook` *(deployment step)*
- [ ] Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` in Vercel. *(deployment step)*
- [ ] Verify checkout end-to-end (at least once in production env). *(post-deployment)*

### Supabase security ✅ VERIFIED

- [x] Supabase security advisors show **0 warnings** (or explicitly accepted + documented).
- [ ] Dashboard-only Supabase Auth warning handled (enable later or explicitly accept + document). *(dashboard setting)*
- [x] Confirm middleware uses `getUser()` validation for protected routes.

Reference: `supabase_tasks.md`

## Go-live checklist (domain + env) — DEPLOYMENT STEPS

- [ ] `NEXT_PUBLIC_APP_URL=https://treido.eu` in Vercel production env.
- [ ] DNS + TLS verified for `treido.eu` and `www.treido.eu`.
- [ ] Verify auth links (email confirmation/reset) redirect to the correct domain.

## Green gates (must be boring) ✅ ALL PASS

- [x] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [x] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [x] Pre-release: `REUSE_EXISTING_SERVER=true pnpm test:e2e` + `pnpm build`

## Manual acceptance (15 minutes)

- [ ] Home loads in `/en` and `/bg`.
- [ ] Search works (query + filters).
- [ ] Product page loads and add-to-cart works.
- [ ] Sign up + email verification link works (or confirm the configured auth provider flow).
- [ ] Checkout creates a Stripe session (in test mode / production as appropriate).

## Performance + cost sanity (highest ROI)

- Middleware scope: ensure matchers skip `_next/static`, `_next/image`, and assets.
- Over-fetching: select only list-view fields; avoid deep nested joins.
- ISR: add `generateStaticParams()` for locale + key segments where feasible.
- Cache Components: pair `'use cache'` with `cacheLife('<profile>')`, and tag invalidation correctly (`revalidateTag(tag, profile)`).

## UI polish (no redesign)

Track work in small batches:

- A1 theming/tokens alignment (remove hardcoded palette values on high-traffic surfaces)
- A3 product surfaces polish (spacing/typography consistency without layout changes)

References:

- `cleanup/palette-scan-report.txt`
- `cleanup/arbitrary-scan-report.txt`
- `docs/DESIGN.md`

## Batch template

**Batch name:** .  
**Scope (1–3 files/features):** .  
**Risk:** low / med / high  
**Verification:** `tsc` + `e2e:smoke` (+ spec if relevant)

**Done when:**

- No behavior/style regressions on touched screens
- Gates pass
- Any dashboard tasks are recorded (what changed + date)
