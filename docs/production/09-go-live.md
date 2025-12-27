# Phase 9: Production Go-Live Runbook

> **Priority:** 🔴 Critical  
> **Estimated Time:** 2-4 hours  
> **Goal:** Zero-downtime launch with verified rollback capability  
> **Tech Stack:** Next.js 16 + Supabase + Vercel + Stripe + next-intl

---

## 📋 Pre-Flight Checklist

### Previous Phases Complete
| Phase | Status | Required |
|-------|--------|----------|
| 0. File Cleanup | ⬜ | Recommended |
| 1. Next.js 16 Audit | ⬜ | **Required** |
| 2. Supabase Security | ⬜ | **Required** |
| 3. Tailwind v4 | ⬜ | Recommended |
| 4. shadcn/ui | ⬜ | Recommended |
| 5. i18n (next-intl) | ⬜ | **Required** |
| 6. Testing | ⬜ | **Required** |
| 7. Performance | ⬜ | **Required** |
| 8. Security | ⬜ | **Required** |

### Quality Gates (Must Pass)

```bash
# All must exit 0
pnpm lint                    # Zero errors
pnpm typecheck               # Zero TypeScript errors
pnpm test:unit               # All unit tests pass
pnpm test:e2e                # All E2E tests pass
pnpm build                   # Production build succeeds
```

### Git State
- [ ] All changes committed (clean working directory)
- [ ] All tests passing on `main` branch
- [ ] No pending PRs blocking launch

---

## 🔐 Environment Variables

### Vercel Dashboard → Settings → Environment Variables

**Production-Only Variables** (set for Production target):

| Variable | Type | Example |
|----------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain | `eyJ...` (publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | Sensitive | `eyJ...` (secret!) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Plain | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Sensitive | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Sensitive | `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | Plain | `https://amazong.bg` |

**Best Practices:**
- ✅ Use "Sensitive" type for secrets (hides from logs)
- ✅ Never use `NEXT_PUBLIC_` for secret keys
- ✅ Preview environment should use staging/test credentials
- ✅ Development environment uses local `.env.local`

### Verification

```bash
# Pull env vars to verify (development only!)
vercel env pull --environment=production

# Check for sensitive vars NOT exposed to client
grep -E "^NEXT_PUBLIC_.*SECRET|^NEXT_PUBLIC_.*SERVICE" .env.local
# Should return nothing
```

---

## 🗄️ Supabase Production Checklist

### Project Configuration
- [ ] **Plan:** Pro or higher (not Free tier for production)
- [ ] **Region:** eu-central-1 (Frankfurt) - closest to Bulgaria
- [ ] **Point-in-time Recovery:** Enabled (Pro+ feature)
- [ ] **Daily Backups:** Enabled

### Security Advisors (Run Before Launch!)

```bash
# Supabase Dashboard → Database → Advisors → Security
# (AI-agent option) mcp_supabase_get_advisors({ type: "security" })
# Must resolve ALL warnings before launch
```

**Critical Checks:**
- [ ] No `function_search_path_mutable` warnings
- [ ] Leaked password protection enabled
- [ ] All RLS policies use `(select auth.uid())` pattern (not bare `auth.uid()`)

### Database
- [ ] All migrations applied: `supabase db push`
- [ ] RLS enabled on ALL user-facing tables
- [ ] Indexes on foreign keys and RLS columns
- [ ] Connection pooling: Transaction mode for serverless

### Auth Configuration

| Setting | Value | Location |
|---------|-------|----------|
| Site URL | `https://amazong.bg` | Auth → URL Configuration |
| Redirect URLs | `https://amazong.bg/**` | Auth → URL Configuration |
| Leaked Password Protection | Enabled | Auth → Settings |
| Email Templates | Customized (BG) | Auth → Email Templates |

### Storage
- [ ] Product images bucket created
- [ ] RLS policies for upload/read
- [ ] CDN enabled for public buckets

---

## 💳 Stripe Production

### Account Verification
- [ ] Business details verified
- [ ] Bank account connected & verified
- [ ] Tax settings configured for Bulgaria

### Webhook Setup

**URL:** `https://amazong.bg/api/webhooks/stripe`

**Events to subscribe:**
```
checkout.session.completed
checkout.session.expired
payment_intent.succeeded
payment_intent.payment_failed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
```

**Webhook Secret:** Copy to `STRIPE_WEBHOOK_SECRET` env var

### Verification
- [ ] Test webhook endpoint receives events
- [ ] Signature verification working
- [ ] Products/Prices synced

---

## 🌐 Domain & DNS

### DNS Records (for Vercel)

```dns
# Apex domain
Type: A
Name: @
Value: 76.76.21.21

# www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Vercel Domain Settings
- [ ] Domain added in Project → Settings → Domains
- [ ] Primary domain set (apex or www)
- [ ] Redirect configured (www → apex or vice versa)
- [ ] SSL certificate auto-provisioned (wait 1-10 mins)

### Verification
```bash
# Check DNS propagation
dig amazong.bg +short
# Should return: 76.76.21.21

# Check SSL
curl -I https://amazong.bg
# Should return: HTTP/2 200
```

---

## ☁️ Vercel Project Settings

### Build Configuration

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node.js Version | 20.x |

### Function Configuration
- [ ] Region: `fra1` (Frankfurt) - closest to Bulgaria
- [ ] Function timeout: Default (10s) or increase if needed

### Security Headers (via `next.config.ts` or `vercel.json`)

```typescript
// next.config.ts - Already configured in Phase 8
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];
```

---

## 🚀 Deployment

### Pre-Deployment

```bash
# 1. Final local test
pnpm build && pnpm start
# Visit localhost:3000 and test critical flows

# 2. Ensure clean git state
git status  # Should be clean

# 3. Tag the release
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

### Deploy to Production

```bash
# Option A: Auto-deploy via GitHub push
git push origin main

# Option B: Manual Vercel deploy
vercel --prod
```

### Post-Deployment Verification (15 min)

| Check | URL | Expected |
|-------|-----|----------|
| Home page | `/en` | Loads, no errors |
| Home page (BG) | `/bg` | Loads in Bulgarian |
| Product page | `/en/product/[slug]` | Product renders |
| Auth | `/en/auth` | Sign in works |
| Protected route | `/en/account` | Redirects when logged out |
| API health | `/api/health` | Returns 200 |

**Browser Console Checks:**
- [ ] No JavaScript errors
- [ ] No failed network requests
- [ ] No hydration mismatches

---

## 📊 Monitoring (Essential Only)

### Vercel Analytics (Built-in)
- [ ] Enable in Project → Analytics
- [ ] Web Vitals tracking active
- [ ] Real Experience Score visible

### Vercel Logs
- [ ] Functions tab shows no errors
- [ ] Build logs clean

### Supabase Monitoring
- [ ] Database → Logs shows no errors
- [ ] Auth → Logs shows successful signups

### Uptime Monitoring (Pick One)
- **Free:** UptimeRobot, Better Uptime
- **Paid:** Vercel Speed Insights, Checkly

Configure to monitor:
- `https://amazong.bg` (home)
- `https://amazong.bg/en` (app route)
- `https://amazong.bg/api/health` (API)

---

## 🔙 Rollback Plan

### Instant Rollback (< 1 minute)

1. Go to Vercel Dashboard → Deployments
2. Find the previous successful deployment
3. Click "..." → **Promote to Production**

This instantly switches traffic with zero downtime.

### Code Rollback

```bash
# Revert the last commit
git revert HEAD --no-edit
git push origin main

# Or reset to a specific commit
git reset --hard [commit-hash]
git push origin main --force-with-lease
```

### Database Rollback

If migrations broke something:
```bash
# Supabase Pro: Point-in-time Recovery
# Dashboard → Database → Backups → Restore to specific time
```

---

## 🎯 Launch Day Checklist

### T-30 minutes
- [ ] Team available on Slack/Discord
- [ ] Vercel Dashboard open
- [ ] Supabase Dashboard open
- [ ] Stripe Dashboard open

### T-0: Deploy
- [ ] Push to main or run `vercel --prod`
- [ ] Watch build logs for errors
- [ ] Confirm deployment URL is live

### T+5 minutes: Smoke Test
- [ ] Home page loads (both locales)
- [ ] Can browse products
- [ ] Can sign up new user
- [ ] Can sign in existing user
- [ ] Protected routes work

### T+15 minutes: Transaction Test
- [ ] Add product to cart
- [ ] Complete test purchase (use Stripe test card if in test mode)
- [ ] Verify order appears in seller dashboard
- [ ] Verify webhook processed

### T+30 minutes: Full Verification
- [ ] All E2E tests pass against production
- [ ] No elevated error rates in logs
- [ ] Core Web Vitals in green
- [ ] Social previews work (share a product link)

### T+2 hours: All Clear
- [ ] No critical errors reported
- [ ] Performance stable
- [ ] Ready to announce launch

---

## 🆘 Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P1** | Site down, payments broken | Immediate |
| **P2** | Major feature broken | < 1 hour |
| **P3** | Minor bug, workaround exists | < 24 hours |

### Quick Fixes

**Site completely down:**
1. Check Vercel status: status.vercel.com
2. Check Supabase status: status.supabase.com
3. If our issue: Instant rollback via Vercel Dashboard

**Payments not working:**
1. Check Stripe Dashboard for errors
2. Verify webhook endpoint receiving events
3. Check `STRIPE_WEBHOOK_SECRET` env var

**Auth not working:**
1. Check Supabase Auth logs
2. Verify Site URL and Redirect URLs in Supabase
3. Check browser cookies being set

**Database errors:**
1. Check Supabase Database logs
2. Verify RLS policies not blocking
3. Check connection pool not exhausted

---

## ✅ Go-Live Complete!

### Immediate Post-Launch (24-48 hours)
1. Monitor error rates closely
2. Respond to user feedback quickly
3. Keep rollback ready

### Week 1
1. Review Vercel Analytics for performance
2. Check Supabase usage metrics
3. Gather user feedback

### Ongoing
1. Set up automated alerts
2. Regular security updates
3. Performance optimization based on real data

---

## 📝 Launch Notes

| Time | Event | Action Taken |
|------|-------|--------------|
| | | |
| | | |

---

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/[team]/amazong
- **Supabase Dashboard:** https://supabase.com/dashboard/project/[ref]
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Status Pages:**
  - Vercel: https://status.vercel.com
  - Supabase: https://status.supabase.com
  - Stripe: https://status.stripe.com
