# Production Launch Checklist

> Final checklist before deploying to production.

---

## Pre-Flight (T-48h)

### Code Quality Gates

- [ ] `pnpm -s typecheck` — All TypeScript errors resolved
- [ ] `pnpm -s lint` — All ESLint errors resolved
- [ ] `pnpm -s styles:gate` — All Tailwind violations resolved
- [ ] `pnpm -s test:unit` — All unit tests passing
- [ ] `pnpm build` — Production build succeeds

### E2E Tests

- [ ] `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` — Smoke tests pass
- [ ] Manual checkout flow verification
- [ ] Manual seller flow verification
- [ ] Manual chat flow verification

### Security

- [ ] No secrets in client bundle (verify with build output)
- [ ] All webhook routes verify signatures
- [ ] RLS enabled on all user tables
- [ ] HTTPS enforced

---

## Environment (T-24h)

### Supabase

- [ ] Production project created
- [ ] All migrations applied
- [ ] RLS policies verified
- [ ] Connection pooler configured
- [ ] Backup schedule enabled

### Stripe

- [ ] Live mode API keys configured
- [ ] Webhook endpoints registered:
  - [ ] `/api/checkout/webhook`
  - [ ] `/api/payments/webhook`
  - [ ] `/api/subscriptions/webhook`
  - [ ] `/api/connect/webhook`
- [ ] Test transactions verified
- [ ] Connect verified

### Vercel

- [ ] Production environment variables set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
  - [ ] `STRIPE_CONNECT_WEBHOOK_SECRET`
- [ ] Domain configured (treido.eu)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error tracking (Sentry) enabled

---

## Monitoring (T-12h)

- [ ] Sentry project configured
- [ ] Error alerts set up
- [ ] Uptime monitoring configured
- [ ] Stripe webhook failure alerts
- [ ] Database connection alerts

---

## Final Verification (T-2h)

### Core Flows

- [ ] **Signup:** Create new account → Email confirmation
- [ ] **Login:** Email/password → Session created
- [ ] **Browse:** Homepage → Category → Product → Cart
- [ ] **Checkout:** Cart → Payment → Order confirmation
- [ ] **Seller:** Onboarding → Connect setup → Create listing
- [ ] **Messages:** Start conversation → Send message
- [ ] **Settings:** Update profile → Change password

### Locale Switching

- [ ] EN → BG switching works
- [ ] BG → EN switching works
- [ ] All pages render in both locales

### Mobile

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Checkout works
- [ ] Tab bar visible

---

## Launch (T-0)

### Deploy

```bash
vercel --prod
```

### Verify

- [ ] Site accessible at production URL
- [ ] No console errors
- [ ] Performance acceptable (LCP < 2s)

### Monitor (T+15min intervals for first hour)

- [ ] Error rate < 0.1%
- [ ] Response time < 2s p95
- [ ] No Stripe webhook failures
- [ ] No auth failures

---

## Post-Launch (T+1h)

- [ ] Full error log review
- [ ] Payment success rate check
- [ ] New user signup verification
- [ ] Full E2E test run

---

## Post-Launch (T+24h)

- [ ] Metrics review
- [ ] Dispute rate check
- [ ] Support ticket review
- [ ] Team debrief

---

## Rollback Plan

If critical issues found:

```bash
# List recent deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

Database rollback: Apply reverse migration via Supabase Dashboard.

---

## Contacts

| Role | Contact |
|------|---------|
| On-call Engineer | TBD |
| Stripe Support | dashboard.stripe.com |
| Supabase Support | supabase.com/support |
| Vercel Support | vercel.com/support |

---

*Last updated: 2026-02-02*
