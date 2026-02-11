# PRODUCTION.md — Production Readiness Tracker

> What's shipped, what's blocked, and what's needed for launch.

| Scope | Production deployment & launch readiness |
|-------|------------------------------------------|
| Audience | AI agents, developers, ops |
| Type | Reference + Checklist |
| Last verified | 2026-02-11 |

---

## Feature Readiness

Progress: **103/119 features (~87%)** across 18 categories.

| # | Area | Status | Done | Total | Blockers / Notes |
|---|------|--------|------|-------|------------------|
| 1 | Auth & Accounts | ✅ Ready | 8 | 8 | All complete |
| 2 | Cart & Checkout | ✅ Ready | 8 | 8 | Launch replay verification pending (`LAUNCH-001`) |
| 3 | Orders (Buyer) | 🟡 Partial | 5 | 6 | Cancel pre-shipment in progress |
| 4 | Orders (Seller) | 🟡 Partial | 5 | 6 | Refund processing admin-assisted |
| 5 | Selling / Listings | 🟡 Partial | 7 | 8 | Listing analytics missing (business tier) |
| 6 | Stripe Connect | ✅ Ready | 6 | 6 | All complete |
| 7 | Marketplace Discovery | 🟡 Partial | 6 | 7 | Saved searches client-only (localStorage) |
| 8 | Product Pages | 🟡 Partial | 7 | 8 | Related items deferred to V1.1 |
| 9 | Wishlist | 🟡 Partial | 4 | 5 | Sharing UI not exposed |
| 10 | Messaging | ✅ Ready | 7 | 7 | All complete |
| 11 | Reviews & Ratings | ✅ Ready | 8 | 8 | All complete |
| 12 | Profiles & Account | 🟡 Partial | 4 | 6 | Notifications UI partial, email notif N/A |
| 13 | Trust & Safety | 🟡 Partial | 4 | 6 | Admin moderation basic, prohibited manual |
| 14 | Business Dashboard | 🟡 Partial | 5 | 6 | Analytics dashboard basic |
| 15 | Admin | 🟡 Partial | 2 | 5 | Metrics, user mgmt, moderation WIP |
| 16 | i18n | ✅ Ready | 5 | 5 | EN + BG complete |
| 17 | Accessibility | 🟡 Partial | 3 | 5 | Screen reader labels, WCAG AA in progress |
| 18 | Infrastructure | ✅ Ready | 6 | 6 | Vercel, Supabase, Stripe, health, revalidation |

→ Full feature breakdown: `REQUIREMENTS.md` (root)

---

## Launch Policy (Soft Launch — 2026-02-12)

| Policy | Value |
|--------|-------|
| Launch mode | Controlled soft launch |
| Hard blockers | All 🔴 P0 issues + `LAUNCH-001..007` in `TASKS.md` |
| Test ownership | Hybrid (AI automation + human manual verification) |
| Tracking SSOT | `production-audit/` (`master.md` + phase files) |
| Test environments | Full validation on preview URL, production smoke only post-deploy |

---

## Infrastructure Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Supabase production project | ✅ | Pro plan, region matched to Vercel |
| RLS enabled on all user-data tables | ✅ | Verified via `pg_tables` |
| Stripe live mode configured | ✅ | 4 webhook endpoints registered |
| Stripe webhooks idempotent | ⬜ | Duplicate event test pending |
| Domain + SSL (treido.eu) | ✅ | Vercel managed |
| CDN (Vercel Edge Network) | ✅ | Default |
| Error tracking (Sentry) | ✅ | Vercel integration, 100% sample rate |
| Sentry alerting configured | ⬜ | Spike > 10/min → Slack/Email |
| Support playbooks (top 10 scenarios) | ⬜ | Partial — see §Support Playbooks |
| LCP < 2s on core pages | ⬜ | Lighthouse audit pending |
| No secrets in logs (security audit) | ✅ | Code review passed |
| Rate limiting on auth endpoints | ✅ | Vercel / Supabase |
| HTTPS only | ✅ | Vercel default |
| HttpOnly cookies | ✅ | Supabase SSR |
| No PII in client logs | ✅ | Code review passed |
| Leaked password protection | ⬜ | WARN-level — enable HaveIBeenPwned in Supabase Auth |

---

## Security

| Check | Status |
|-------|--------|
| RLS policies tested (E2E) | ✅ |
| No secrets in client bundle | ✅ |
| Webhook signature validation | ✅ |
| HTTPS only | ✅ |
| HttpOnly cookies | ✅ |
| Rate limiting | ✅ |
| No PII in logs | ✅ |
| Leaked password protection (HaveIBeenPwned) | ⬜ |

**Supabase Advisors (2026-02-08):**
- Security WARN: Leaked password protection disabled → enable before launch
- Performance INFO: 23 unused indexes across 13 tables → cleanup candidates

---

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.0s | ⬜ Pending Lighthouse audit |
| TTI | < 3.0s | ⬜ Pending |
| Search response | < 500ms | ⬜ Pending monitoring |
| Lighthouse score | > 90 | ⬜ Pending |
| Bundle size | Analyzed | ✅ `next/image` optimized |

---

## Environment Configuration

### Required Variables (All Environments)

| Variable | Description | Where Set |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Vercel + .env.local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key | Vercel + .env.local |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server-only) | Vercel only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Vercel + .env.local |
| `STRIPE_SECRET_KEY` | Stripe secret key | Vercel only |
| `STRIPE_WEBHOOK_SECRET` | Order webhook signing | Vercel only |
| `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` | Subscription webhook signing | Vercel only |
| `STRIPE_CONNECT_WEBHOOK_SECRET` | Connect webhook signing | Vercel only |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Canonical URL | Auto-detect |
| `AI_ASSISTANT_ENABLED` | Enable AI features | `false` |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key | — |
| `AI_CHAT_MODEL` | Chat model | `openai/gpt-4o-mini` |
| `AI_VISION_MODEL` | Vision model | `google/gemini-2.0-flash` |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI/MCP | — |
| `SHADCNBLOCKS_API_KEY` | Premium components | — |

### Environment Separation

| Environment | Stripe Mode | Supabase | Domain |
|-------------|-------------|----------|--------|
| Development | Test (`sk_test_*`) | Local or staging | localhost:3000 |
| Preview | Test | Staging | *.vercel.app |
| Production | Live (`sk_live_*`) | Production | treido.eu |

**Critical:** Never use `sk_live_*` keys in development.

---

## Stripe Webhook Endpoints

| Endpoint | Events | Secret Variable |
|----------|--------|-----------------|
| `/api/checkout/webhook` | `checkout.session.completed`, `payment_intent.*` | `STRIPE_WEBHOOK_SECRET` |
| `/api/payments/webhook` | `checkout.session.completed` (boosts), `payment_method.detached` | `STRIPE_WEBHOOK_SECRET` |
| `/api/subscriptions/webhook` | `checkout.session.completed`, `customer.subscription.*`, `invoice.*` | `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` |
| `/api/connect/webhook` | `account.updated`, `account.application.deauthorized` | `STRIPE_CONNECT_WEBHOOK_SECRET` |

Webhook secrets support rotation (comma-separated): both old and new secrets validate during transition.

---

## Deployment

### Vercel (Primary)

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node Version | 22.x (Vercel runtime), 20.x (local dev/install baseline) |
| Analytics | Enabled |
| Speed Insights | Enabled |

```bash
# Production deploy
vercel --prod

# Preview deploy (auto on PR)
vercel
```

### Database Indexes (verify exist)

| Table | Index |
|-------|-------|
| `products` | `idx_products_search` (FTS) |
| `products` | `idx_products_category` |
| `products` | `idx_products_seller` |
| `orders` | `idx_orders_user` |
| `orders` | `idx_orders_stripe_pi` (unique) |

---

## SEO

| Item | Implementation |
|------|----------------|
| Meta tags | Per-page via `generateMetadata()` |
| Open Graph | Dynamic images |
| `sitemap.xml` | `app/sitemap.ts` |
| `robots.txt` | `app/robots.txt` |
| Canonical URLs | Auto via next-intl |
| Structured data | JSON-LD for products |
| Privacy Policy | `/[locale]/privacy` ✅ |
| Terms of Service | `/[locale]/terms` ✅ |
| Cookie Policy | `/[locale]/cookies` ✅ |
| Returns & Refunds | `/[locale]/returns` ✅ |

---

## Launch Day Runbook

### T-24 Hours

- [ ] Run full verification suite: `pnpm -s lint && pnpm -s typecheck && pnpm -s styles:gate && pnpm -s test:unit`
- [ ] Run `pnpm build` — clean production build
- [ ] Final E2E tests on production preview
- [ ] Verify Stripe live mode keys set in Vercel
- [ ] Verify all 4 webhook endpoints active in Stripe Dashboard
- [ ] Confirm Sentry monitoring alerts configured
- [ ] Team on standby

### T-0 (Launch)

- [ ] Deploy: `vercel --prod`
- [ ] Monitor error rates (15-minute intervals)
- [ ] Test checkout flow end-to-end with real card
- [ ] Test Connect payout flow
- [ ] Verify email delivery (sign-up confirmation)
- [ ] Spot-check `/api/health` returns `{ "status": "ok" }`

### T+1 Hour

- [ ] Review Sentry error logs
- [ ] Check Stripe payment success rates
- [ ] Verify new user signups work end-to-end
- [ ] Check listing creation flow
- [ ] Monitor response times (p95 < 2s)

### T+24 Hours

- [ ] Full metrics review (GMV, signups, error rate)
- [ ] Dispute / chargeback rate check
- [ ] Performance audit (Lighthouse)
- [ ] Team debrief

### Rollback

```bash
# Vercel instant rollback
vercel ls          # list deployments
vercel rollback <deployment-url>
```

Database rollback: identify breaking migration → apply reverse migration via Supabase Dashboard (test locally first).

---

## Post-Launch Monitoring

### Daily Checks

| Check | Tool | Threshold |
|-------|------|-----------|
| Error rate | Sentry | < 0.1% |
| Checkout success rate | Stripe | > 95% |
| Response time p95 | Vercel Analytics | < 2s |
| Support tickets | Zendesk | Trending |

### Weekly Reviews

| Metric | Source |
|--------|--------|
| GMV (Gross Merchandise Value) | Stripe Dashboard |
| Active users | Vercel Analytics |
| New signups | Supabase |
| Dispute rate | Stripe (target < 2%) |
| Chargeback rate | Stripe |

### Incident Response SLAs

| Severity | Description | Response Time | Escalation |
|----------|-------------|---------------|------------|
| P0 | Site down | 15 min | Immediate |
| P1 | Degraded (checkout broken) | 1 hour | Within 2h |
| P2 | Bug (non-critical) | 24 hours | Next business day |

### Key Alerts

| Alert | Threshold | Channel |
|-------|-----------|---------|
| Error spike | > 10/min | Slack / Email |
| Checkout failures | > 5% | Immediate |
| Response time | > 3s p95 | Daily digest |
| DB connection errors | Any | Immediate |

---

## Support Playbooks

| Issue | Resolution |
|-------|------------|
| Checkout fails | Check Stripe Dashboard → Payments → find failed intent |
| Payout not received | Verify Connect account status, check balance schedule |
| Order not created | Check webhook logs in Stripe → replay event |
| Login issues | Check Supabase Auth logs → verify email confirmed |
| Missing product | Check RLS policies, verify product status = 'active' |

### Escalation Path

```
User Report → Support L1 → Support L2 → Engineering → On-call
    ↓             ↓             ↓             ↓
  < 1h          < 4h          < 24h         < 4h
```

---

## See Also

- `REQUIREMENTS.md` (root) — All 119 features with status
- `docs/PAYMENTS.md` — Stripe integration details
- `docs/DATABASE.md` — Schema, RLS, indexes
- `docs/AUTH.md` — Auth flows and security
- `docs/TESTING.md` — Test strategy and QA plan

---

*Last updated: 2026-02-11*
