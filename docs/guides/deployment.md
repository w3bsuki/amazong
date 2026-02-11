# Deployment Guide

Production deployment and release operations for Treido.

| Scope | Deploy, rollback, launch checks |
|-------|----------------------------------|
| Audience | AI agents, developers, ops |
| Last updated | 2026-02-11 |

---

## Environments

| Environment | URL | Stripe Mode | Supabase | Branch |
|-------------|-----|-------------|----------|--------|
| Development | `http://localhost:3000` | Test (`sk_test_*`) | Local or staging | local |
| Preview | `*.vercel.app` | Test | Staging | PR / release branch |
| Production | `https://treido.eu` | Live (`sk_live_*`) | Production | `main` |

**Critical:** never use live Stripe keys in local development.

---

## Node + Package Manager

| Context | Version |
|---------|---------|
| Local dev/install baseline | Node 20.x + `pnpm@9.x` |
| Vercel runtime | Node 22.x |

---

## Required Environment Variables

Set these in Vercel for Preview and Production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SUBSCRIPTION_WEBHOOK_SECRET=
STRIPE_CONNECT_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

Optional feature flags / integrations:

```bash
AI_ASSISTANT_ENABLED=false
AI_GATEWAY_API_KEY=
AI_CHAT_MODEL=openai/gpt-4o-mini
AI_VISION_MODEL=google/gemini-2.0-flash
SUPABASE_ACCESS_TOKEN=
```

---

## Deploy Commands

```bash
# Preview deploy
vercel

# Production deploy
vercel --prod
```

---

## Pre-Deploy Validation

Run before promoting to production:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
pnpm build
```

Launch-go criteria are tracked in:
- `docs/PRODUCTION.md`
- `production-audit/master.md`
- `TASKS.md` (`LAUNCH-001..007`)

---

## Soft Launch Protocol (2026-02-12)

1. Validate full checklist on preview first.
2. Deploy production.
3. Run 30-60 minute production smoke:
   - signup/login/session reflect
   - browse/search/PDP
   - cart/checkout real transaction
   - sell publish flow
   - chat send/receive
4. Monitor Sentry + Stripe + webhook health and rollback immediately on P0.

---

## Rollback

```bash
# list deployments
vercel ls

# rollback
vercel rollback <deployment-url>
```

For database rollback, identify the specific migration and use a tested reverse migration plan first.

---

## See Also

- `docs/PRODUCTION.md`
- `docs/TESTING.md`
- `docs/PAYMENTS.md`
- `docs/DATABASE.md`
