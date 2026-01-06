# Production Plan (“Last 5%”)

Goal: ship safely with fewer regressions and lower Vercel/Supabase cost.

Execution checklist: `tasks.md`

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

### Stripe (payments must work)

- [ ] Create Stripe products/prices for paid tiers.
- [ ] Set price IDs in Supabase `subscription_plans`.
- [ ] Configure webhook endpoint: `https://treido.eu/api/subscriptions/webhook`
- [ ] Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` in Vercel.
- [ ] Verify checkout end-to-end (at least once in production env).

### Supabase security

- [ ] Supabase security advisors show **0 warnings** (or explicitly accepted + documented).
- [ ] Enable **Leaked Password Protection** in Supabase Auth settings.
- [ ] Confirm middleware uses `getUser()` validation for protected routes.

Reference: `supabase_tasks.md`

## Go-live checklist (domain + env)

- [ ] `NEXT_PUBLIC_APP_URL=https://treido.eu` in Vercel production env.
- [ ] DNS + TLS verified for `treido.eu` and `www.treido.eu`.
- [ ] Verify auth links (email confirmation/reset) redirect to the correct domain.

## Green gates (must be boring)

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] Pre-release: `REUSE_EXISTING_SERVER=true pnpm test:e2e` + `pnpm build`

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
