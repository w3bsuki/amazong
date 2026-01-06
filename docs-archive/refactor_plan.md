# 🚀 Amazong Marketplace - Complete Production Refactor Plan

> **Created:** January 4, 2026  
> **Target:** Production-ready launch on treido.eu  
> **Estimated Total:** 10-15 hours  
> **Source:** Consolidated from `/docs/production/*.md`

---

## 📊 Quick Status Overview

| Phase | Status | Priority | Time |
|-------|--------|----------|------|
| 0. File Cleanup | ⚠️ Partial | 🟡 Medium | 1-2 hrs |
| 1. Next.js 16 | ✅ Done | - | - |
| 2. Supabase | ✅ Done (1 action) | 🔴 Critical | 10 min |
| 3. Tailwind v4 | ⚠️ Partial | 🟡 Medium | 2-3 hrs |
| 4. shadcn/ui | ✅ Done | - | - |
| 5. i18n | ✅ Done | - | - |
| 6. Testing | ⚠️ Partial | 🟡 Medium | 2-3 hrs |
| 7. Performance | ⬜ Audit Needed | 🔴 Critical | 2-3 hrs |
| 8. Security | ⚠️ Dashboard Action | 🔴 Critical | 1 hr |
| 9. Go-Live | ⬜ Ready | 🔴 Critical | 1-2 hrs |

---

## 🎯 SPRINT 1: Cleanup & Testing (Day 1)

### Phase 0: File Cleanup [1-2 hrs]

**Goal:** Remove bloat before production

#### 0.1 Delete Output Files
- [ ] `e2e-smoke-output.txt`, `e2e-smoke-output-2.txt`, `e2e-smoke-output-3.txt`
- [ ] `lint-output.txt`, `typecheck-output.txt`, `unit-test-output.txt`
- [ ] `tsc-files.txt`, `knip-output.json`

#### 0.2 Delete Old Reports
- [ ] `playwright-report-*/` timestamped folders (keep `playwright-report/`)

#### 0.3 Delete cleanup/ Folder
- [ ] Remove entire `cleanup/` folder (14+ audit folders, superseded by `/docs/production/`)

#### 0.4 Delete Old Root Plans
- [ ] `PRODUCTION_CLEANUP_PLAN.md`
- [ ] `PRODUCTION_CHECKLIST.md`
- [ ] `PRODUCT_PAGE_MASTERPLAN.md`
- [ ] `MOBILE_PRODUCT_PAGE_MASTERPLAN.md`
- [ ] `FULL_TESTING_PLAN.md`

#### 0.5 Merge Vitest Configs
- [ ] Add `server.deps.inline: ['next-intl']` to `vitest.config.ts`
- [ ] Delete `vitest.config.mts`

#### 0.6 Add removeConsole to next.config.ts
```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
},
```

#### 0.7 Delete console.log Statements
- [ ] `app/[locale]/(sell)/sell/_lib/categories.ts:119`
- [ ] `app/[locale]/(business)/dashboard/_lib/categories.ts:108`
- [ ] `app/api/subscriptions/webhook/route.ts:85,156` (or convert to proper logging)

#### 0.8 Update .gitignore
Add:
```gitignore
e2e-smoke-output*.txt
lint-output.txt
typecheck-output.txt
unit-test-output.txt
tsc-files.txt
knip-output.json
playwright-report-*/
test-results-*/
cleanup/
```

#### 0.9 Delete Obsolete Scripts
- [ ] `scripts/mobile-audit.mjs`
- [ ] `scripts/cleanup-phase1.ps1`
- [ ] Move `scripts/migrations.sql` → `supabase/migrations/`

#### 0.10 Knip Unused Files Review
- [ ] Review: `components/auth/auth-form-field.tsx`
- [ ] Review: `components/providers/auth-state-listener.tsx`
- [ ] Review: `app/[locale]/(main)/seller/dashboard/_components/seller-dashboard-client.tsx`
- [ ] Review: `app/[locale]/(main)/seller/dashboard/_lib/types.ts`

**Checkpoint 0:** `pnpm typecheck && pnpm build && pnpm test:unit`

---

### Phase 6: Testing [2-3 hrs]

**Goal:** 10/10 E2E passing, coverage expansion

#### 6.1 Fix Failing E2E Test
File: `app/[locale]/(sell)/sell/` - Performance API error

Option A (Fix in component):
```typescript
useEffect(() => {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.mark('SellPage:mount')
    } catch (e) {
      console.debug('Performance API unavailable:', e)
    }
  }
}, [])
```

Option B (Filter in test): Add to `IGNORED_CONSOLE_PATTERNS`

#### 6.2 Configure Coverage Thresholds
Add to `vitest.config.ts`:
```typescript
coverage: {
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 60,
  },
}
```

#### 6.3 Add Missing Unit Tests
- [ ] `lib/supabase/server.ts` - auth helpers
- [ ] `lib/supabase/client.ts` - singleton pattern
- [ ] Cart utilities (if exists)
- [ ] Form validation schemas

#### 6.4 Verify E2E Suite
- [ ] Run `pnpm test:e2e` - all 10 tests pass
- [ ] Run `pnpm test:a11y` - zero critical violations

**Checkpoint 6:** `pnpm test:e2e && pnpm test:unit`

---

## 🎯 SPRINT 2: Performance & Security (Day 2)

### Phase 7: Performance Audit [2-3 hrs]

**Goal:** LCP ≤2.5s, INP ≤200ms, CLS ≤0.1

#### 7.1 Run Lighthouse
```bash
pnpm build
pnpm test:lighthouse
```

#### 7.2 Bundle Analysis
```bash
ANALYZE=true pnpm build
```

Check:
- [ ] First Load JS < 100KB per route
- [ ] No duplicate dependencies
- [ ] Heavy libs (recharts, framer-motion) lazy loaded

#### 7.3 Image Audit
- [ ] All images use `<Image>` from next/image
- [ ] LCP images have `priority` prop
- [ ] Responsive images have `sizes` attribute

```bash
# Find raw img tags
grep -r "<img" --include="*.tsx" app/ components/
```

#### 7.4 i18n Static Rendering
- [ ] All pages call `setRequestLocale(locale)`
- [ ] All pages have `generateStaticParams()` for locales

#### 7.5 Verify Cache Profiles
- [ ] Data fetching uses `'use cache'` + `cacheLife('profile')`
- [ ] `cacheTag()` applied for invalidation
- [ ] Dynamic content wrapped in `<Suspense>`

**Checkpoint 7:** Lighthouse Performance ≥80

---

### Phase 8: Security [1 hr]

**Goal:** Zero Supabase security warnings

#### 8.1 CRITICAL: Enable Leaked Password Protection
- [ ] Supabase Dashboard → Authentication → Settings → Enable "Leaked Password Protection"

#### 8.2 Verify RLS Policies
All policies must use `(SELECT auth.uid())` pattern:
```sql
-- Check for bare auth.uid() usage
SELECT schemaname, tablename, policyname, qual
FROM pg_policies 
WHERE schemaname = 'public'
AND qual ~ 'auth\.uid\(\)' AND qual !~* 'select\s+auth\.uid\(\)';
```

#### 8.3 Already Fixed ✅
- [x] `function_search_path_mutable` on `set_notification_preferences_updated_at`
- [x] `notification_preferences` RLS optimized
- [x] `cart_items.product_id` index added
- [x] Duplicate wishlists index removed
- [x] `storage.objects` delete policy optimized

#### 8.4 Verify Env Vars
- [ ] `SUPABASE_SERVICE_ROLE_KEY` NOT in client bundles
- [ ] All secrets use non-`NEXT_PUBLIC_` prefix
- [ ] Production env vars set in Vercel Dashboard

**Checkpoint 8:** Supabase Advisors → Security → 0 warnings

---

## 🎯 SPRINT 3: Polish & Launch (Day 2-3)

### Phase 3: Tailwind v4 Polish [2-3 hrs] (Optional)

**Goal:** Fix ~1000 palette violations in high-traffic components

#### 3.1 Top Offenders to Fix
| File | Violations |
|------|------------|
| `(main)/seller/dashboard/_components/seller-dashboard-client.tsx` | ~39 |
| `(business)/_components/products-table.tsx` | ~37 |
| `(account)/account/orders/_components/account-orders-grid.tsx` | ~36 |
| `(account)/account/selling/page.tsx` | ~33 |
| `(admin)/_components/admin-recent-activity.tsx` | ~31 |

#### 3.2 Replace Pattern
```tsx
// ❌ Hardcoded
<div className="bg-[#f3f4f6] text-[#1f2937] border-[#e5e7eb]">

// ✅ Semantic tokens
<div className="bg-surface-card text-foreground border-border">
```

#### 3.3 Run Palette Scan
```bash
pnpm -s exec node scripts/scan-tailwind-palette.mjs
```

Target: < 50 violations (from 1019)

**Checkpoint 3:** Palette scan shows significant reduction

---

### Phase 9: Go-Live [1-2 hrs]

**Goal:** Final production verification and launch

#### 9.1 Pre-Deployment
```bash
# Final local verification
pnpm build && pnpm start
# Test critical flows locally
```

#### 9.2 Supabase Production (if not already done)
- [ ] Verify production project exists (Pro plan recommended)
- [ ] Apply any pending migrations: `supabase db push`
- [ ] Enable Point-in-time Recovery
- [ ] Enable Daily Backups
- [ ] Verify Auth config:
  - Site URL matches production domain
  - Redirect URLs configured
  - Leaked Password Protection: Enabled
  - Email Templates: Bulgarian

#### 9.3 Stripe Production (if not already done)
- [ ] Business details verified
- [ ] Webhook URL configured for production domain
- [ ] Webhook secret in Vercel env vars

#### 9.4 Vercel (✅ Already Set Up)
Verify these are correct:
- [ ] Production env vars set (especially `SUPABASE_SERVICE_ROLE_KEY` as Sensitive)
- [ ] Function region: `fra1` (Frankfurt) for EU
- [ ] Domain configured with SSL

#### 9.5 Deploy
```bash
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
git push origin main  # Auto-deploy
```

#### 9.6 Post-Deploy Verification
| Check | URL | Expected |
|-------|-----|----------|
| Home (EN) | `/en` | Loads |
| Home (BG) | `/bg` | Loads in Bulgarian |
| Product | `/en/product/[slug]` | Renders |
| Auth | `/en/auth` | Sign in works |
| Protected | `/en/account` | Redirects when logged out |
| API | `/api/health` | Returns 200 |

**Checkpoint 9:** Site live, all smoke tests pass

---

## ✅ QUALITY GATES (Must Pass Before Launch)

### Gate A: CI Checks
```bash
pnpm lint          # Zero errors
pnpm typecheck     # Zero errors
pnpm test:unit     # All pass
pnpm test:e2e      # All pass
pnpm build         # Success
```

### Gate B: E2E Completeness
- No skipped tests in launch-critical suite
- All 10 smoke tests passing

### Gate C: Performance
| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥80 |
| Lighthouse Accessibility | ≥90 |
| Lighthouse SEO | ≥90 |
| LCP | ≤2.5s |
| INP | ≤200ms |
| CLS | ≤0.1 |

### Gate D: Security
- Supabase advisors: 0 security warnings
- Leaked password protection: Enabled
- RLS: Verified on all user tables
- Client bundle: No `SUPABASE_SERVICE_ROLE_KEY`

### Gate E: Operational Readiness
- DNS + TLS verified
- Vercel production env vars set
- Supabase production backups enabled
- Basic uptime monitoring configured

---

## 🔗 Reference Documentation

| Phase | Doc |
|-------|-----|
| File Cleanup | `docs/production/00-file-cleanup.md` |
| Next.js 16 | `docs/production/01-nextjs.md` |
| Supabase | `docs/production/02-supabase.md` |
| Tailwind v4 | `styling/03-tailwind.md` |
| shadcn/ui | `styling/04-shadcn.md` |
| i18n | `docs/production/05-i18n.md` |
| Testing | `docs/production/06-testing.md` |
| Performance | `docs/production/07-performance.md` |
| Security | `docs/production/08-security.md` |
| Go-Live | `docs/production/09-go-live.md` |
| Master Plan | `docs/production/MASTER_PLAN.md` |
| Cleanup | `docs/CLEANUP_PLAN.md` |

---

## 📋 FULL TODO CHECKLIST

### Sprint 1 - Day 1
- [ ] Delete output files (0.1)
- [ ] Delete old reports (0.2)
- [ ] Delete cleanup/ folder (0.3)
- [ ] Delete old root plans (0.4)
- [ ] Merge vitest configs (0.5)
- [ ] Add removeConsole (0.6)
- [ ] Delete console.log statements (0.7)
- [ ] Update .gitignore (0.8)
- [ ] Delete obsolete scripts (0.9)
- [ ] Review knip unused files (0.10)
- [ ] Fix E2E Performance API error (6.1)
- [ ] Add coverage thresholds (6.2)
- [ ] Add missing unit tests (6.3)
- [ ] Verify E2E suite passes (6.4)

### Sprint 2 - Day 2
- [ ] Run Lighthouse audit (7.1)
- [ ] Analyze bundle (7.2)
- [ ] Audit images (7.3)
- [ ] Verify i18n static rendering (7.4)
- [ ] Verify cache profiles (7.5)
- [ ] Enable Leaked Password Protection (8.1)
- [ ] Verify RLS policies (8.2)
- [ ] Verify env vars (8.4)

### Sprint 3 - Day 2-3
- [ ] Fix top Tailwind violators (3.1-3.3) [Optional]
- [ ] Pre-deployment verification (9.1)
- [ ] Verify Supabase production config (9.2)
- [ ] Verify Stripe webhook (9.3)
- [ ] Verify Vercel env vars (9.4)
- [ ] Deploy & tag release (9.5)
- [ ] Post-deploy verification (9.6)

---

## 🆘 Rollback Plan

### Instant Rollback (< 1 min)
1. Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → **Promote to Production**

### Code Rollback
```bash
git revert HEAD --no-edit
git push origin main
```

### Database Rollback
Supabase Dashboard → Database → Backups → Restore to specific time

---

**Start here:** Phase 0.1 - Delete output files
