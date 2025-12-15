# 🚀 PHASE 5: DEPLOYMENT PREPARATION

> **Priority:** 🔴 Critical - Final steps before going live  
> **Estimated Time:** 1-2 hours  
> **Target:** Production deployment on Vercel

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Must Complete Before Deploy
- [ ] Phase 0 (Security) - DONE
- [ ] Phase 1 (Cleanup) - Critical items DONE
- [ ] Phase 2 (Refactor) - Blockers DONE
- [ ] Phase 3 (Performance) - Verified
- [ ] Phase 4 (Testing) - Critical paths PASSED

---

## 🔑 ENVIRONMENT VARIABLES

### Required Variables
Set these in Vercel Dashboard → Settings → Environment Variables

```env
# ========================================
# SUPABASE (REQUIRED)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]  # SECRET

# ========================================
# STRIPE (REQUIRED)
# ========================================
# Use LIVE keys for production!
STRIPE_SECRET_KEY=sk_live_[key]               # SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[key]

# Webhooks - Use production endpoint URLs
STRIPE_WEBHOOK_SECRET=whsec_[secret]          # For /api/checkout/webhook
STRIPE_SUBSCRIPTION_WEBHOOK_SECRET=whsec_[secret]  # For /api/subscriptions/webhook

# ========================================
# APPLICATION (REQUIRED)
# ========================================
NEXT_PUBLIC_APP_URL=https://yourdomain.com    # Your production domain
NEXT_PUBLIC_URL=https://yourdomain.com        # Alias

# ========================================
# OPTIONAL
# ========================================
REVALIDATION_SECRET=[random-string]           # For manual cache invalidation
```

### Environment Variable Checklist
- [ ] All `NEXT_PUBLIC_*` vars set (safe for client)
- [ ] All secret vars set (server only)
- [ ] Using LIVE Stripe keys (not test)
- [ ] Production domain configured
- [ ] Different values from development

### Generate Secrets
```powershell
# Generate random secrets
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## 🌐 DOMAIN & DNS CONFIGURATION

### Option A: Vercel Domain (Recommended for Start)
1. Use Vercel's default domain: `project-name.vercel.app`
2. Configure custom domain later

### Option B: Custom Domain
1. Buy domain from registrar (Namecheap, Cloudflare, etc.)
2. In Vercel Dashboard → Domains → Add Domain
3. Configure DNS records as instructed:

```dns
# For root domain (example.com)
Type: A
Name: @
Value: 76.76.21.21

# For www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### DNS Checklist
- [ ] Domain purchased/available
- [ ] DNS records configured
- [ ] SSL certificate auto-provisioned (Vercel handles this)
- [ ] Both www and non-www work

---

## 💳 STRIPE CONFIGURATION

### Webhook Endpoints
Create these webhooks in Stripe Dashboard → Developers → Webhooks

#### Webhook 1: Checkout Webhook
```
Endpoint URL: https://yourdomain.com/api/checkout/webhook
Events:
  - checkout.session.completed
  - checkout.session.async_payment_succeeded
  - checkout.session.async_payment_failed
```

#### Webhook 2: Subscription Webhook
```
Endpoint URL: https://yourdomain.com/api/subscriptions/webhook
Events:
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.paid
  - invoice.payment_failed
```

### Stripe Checklist
- [ ] Switch to LIVE mode (not test)
- [ ] Create webhook endpoints with production URLs
- [ ] Copy webhook secrets to Vercel env vars
- [ ] Verify products/prices exist in live mode
- [ ] Configure tax settings (if applicable)

---

## 📊 SUPABASE CONFIGURATION

### Production Database
- [ ] Supabase project on Pro plan (for better limits)
- [ ] Database region near users (EU for Bulgaria focus)
- [ ] Connection pooling enabled
- [ ] Point-in-time recovery enabled

### RLS Verification
```sql
-- Run in Supabase SQL Editor
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All should show 't' for rowsecurity
```

### Supabase Checklist
- [ ] Project on appropriate plan
- [ ] RLS enabled on all tables
- [ ] Indexes on frequently queried columns
- [ ] Storage buckets configured
- [ ] Auth email templates customized

---

## 🏗️ VERCEL PROJECT SETUP

### Create Project
1. Go to vercel.com → New Project
2. Import from GitHub repository
3. Configure:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next` (default)
   - Install Command: `pnpm install`

### Build Settings
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Vercel Checklist
- [ ] Project created
- [ ] GitHub repo connected
- [ ] Environment variables set
- [ ] Build settings verified
- [ ] Team members invited (if applicable)

---

## ✅ FINAL BUILD VERIFICATION

### Local Build Test
```powershell
# Clean previous builds
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Install dependencies
pnpm install

# Run build
pnpm build

# Expected output:
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages (2257/2257)
# ✓ Collecting build traces
# ✓ Finalizing page optimization
```

### Build Output Verification
| Item | Expected | Status |
|------|----------|--------|
| TypeScript errors | 0 | |
| ESLint errors | 0 | |
| Build warnings | Acceptable | |
| Static pages | ~2200 | |
| Dynamic routes | ~57 | |

### Post-Build Checks
```powershell
# Test production server locally
pnpm start

# Visit http://localhost:3000
# Test critical paths work
```

- [ ] Build completes successfully
- [ ] Production server starts locally
- [ ] Critical paths work in production mode

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Commit All Changes
```powershell
git status
git add .
git commit -m "chore: production preparation complete"
git push origin main
```

### Step 2: Deploy to Vercel
Option A: Automatic (GitHub connected)
- Push to main branch triggers deployment

Option B: Manual
```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Step 3: Monitor Deployment
1. Watch Vercel dashboard for build logs
2. Check for any build errors
3. Wait for deployment to complete (~3-5 min)

### Step 4: Verify Deployment
```powershell
# Check site is accessible
curl -I https://yourdomain.com
# Should return 200 OK

# Check specific pages
curl -I https://yourdomain.com/api/health  # If you have one
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### Immediate Checks (First 5 Minutes)
- [ ] Homepage loads
- [ ] Images load correctly
- [ ] CSS/styles applied
- [ ] No JavaScript errors in console

### Authentication Checks
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Protected routes redirect properly

### Payment Checks
- [ ] Stripe checkout redirects correctly
- [ ] Webhook receives events (check Stripe dashboard)
- [ ] Order created after payment

### Database Checks
- [ ] Products display
- [ ] User data saves
- [ ] Orders create
- [ ] Messages send

---

## 📉 ROLLBACK PLAN

### If Something Goes Wrong
1. **Immediate Rollback** (Vercel Dashboard)
   - Go to Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Code Rollback** (Git)
   ```powershell
   git revert HEAD
   git push origin main
   ```

3. **Database Rollback** (Supabase)
   - Use point-in-time recovery
   - Contact Supabase support if needed

### Emergency Contacts
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io
- Stripe Support: https://support.stripe.com

---

## ✅ DEPLOYMENT CHECKLIST SUMMARY

### Before Deployment
- [ ] All environment variables set in Vercel
- [ ] DNS configured (if custom domain)
- [ ] Stripe webhooks created with production URLs
- [ ] Local build passes
- [ ] Critical paths tested locally

### During Deployment
- [ ] Push to main branch
- [ ] Monitor Vercel build logs
- [ ] No build errors

### After Deployment
- [ ] Site accessible
- [ ] Auth flow works
- [ ] Payments work
- [ ] Data saves correctly
- [ ] No console errors

---

## 🏁 PHASE 5 COMPLETION CRITERIA

```markdown
✅ Phase 5 Complete When:

1. [ ] Environment variables configured
2. [ ] DNS/domain configured
3. [ ] Stripe webhooks set up
4. [ ] Build passes
5. [ ] Site deployed and accessible
6. [ ] Basic functionality verified
7. [ ] Rollback plan documented

Deployment URL: [https://...]
Deployment Date: [Date/Time]
Deployed By: [Name]
```

---

## 🎉 LAUNCH ANNOUNCEMENT TEMPLATE

```markdown
# 🚀 We're Live!

Amazong Marketplace is now live at [URL].

## What's Ready
- ✅ User registration and authentication
- ✅ Product browsing and search
- ✅ Secure checkout with Stripe
- ✅ Seller tools and listings
- ✅ Messaging between buyers and sellers

## Known Limitations (Coming Soon)
- Cart sync across devices
- Advanced analytics
- Mobile app

## Report Issues
Contact: [support email]

Thank you for being an early user! 🎊
```

---

*Deployment guide verified with: Vercel documentation, Next.js 16 deployment docs*
