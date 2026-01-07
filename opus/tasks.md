# Tasks — Treido Marketplace Production Readiness

> **Generated**: January 2026  
> **Purpose**: Phased execution plan for production launch  
> **Approach**: Methodical, gate-verified, low-risk batches

---

## 📋 Execution Phases

```
Phase 1: Security & Blockers     (Days 1-2)   ← Ship stoppers
Phase 2: Design System Cleanup   (Days 3-5)   ← Visual consistency
Phase 3: Backend Optimization    (Days 6-7)   ← Performance
Phase 4: Architecture Polish     (Days 8-9)   ← Code quality
Phase 5: Final Verification      (Day 10)     ← Launch readiness
```

---

## 🔴 Phase 1: Security & Blockers (Ship Stoppers)

**Gate**: Must complete before any public launch

### Task 1.1: Supabase Security Audit
```
Effort: 2-4 hours
Risk: Low (dashboard only)
Files: None (dashboard)
```

**Steps**:
1. Run Supabase security advisors:
   ```
   mcp_supabase_get_advisors({ type: "security" })
   ```
2. Document all warnings
3. Fix critical RLS gaps
4. Enable "Leaked Password Protection" in Auth settings
5. Verify protected table policies

**Verification**:
- [ ] Security advisors show 0 critical warnings
- [ ] Leaked password protection enabled

---

### Task 1.2: Stripe Configuration
```
Effort: 1-2 hours
Risk: Low (external service)
Files: None (Stripe/Supabase dashboard)
```

**Steps**:
1. Create products in Stripe for each tier:
   - Basic (free)
   - Premium (monthly/yearly)
   - Business (monthly/yearly)
2. Copy price IDs to Supabase `subscription_plans` table
3. Configure webhook endpoint: `https://treido.eu/api/subscriptions/webhook`
4. Set environment variables in Vercel:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`

**Verification**:
- [ ] Test checkout flow creates Stripe session
- [ ] Webhook receives test events

---

### Task 1.3: Environment Verification
```
Effort: 30 minutes
Risk: Low
Files: None (Vercel dashboard)
```

**Steps**:
1. Verify `NEXT_PUBLIC_APP_URL=https://treido.eu`
2. Verify DNS for `treido.eu` and `www.treido.eu`
3. Verify TLS certificate
4. Test auth email links point to correct domain

**Verification**:
- [ ] Site loads on production URL
- [ ] Auth emails have correct links

---

## 🟡 Phase 2: Design System Cleanup

**Gate**: `tsc --noEmit` + `e2e:smoke`

### Task 2.1: Remove Gradients (13 files)
```
Effort: 2-3 hours
Risk: Low (visual only)
Files: 9 files
```

**Batch 2.1a: High Priority (4 files)**
```typescript
// Replace patterns like:
// ❌ bg-gradient-to-r from-blue-500 to-blue-600
// ✅ bg-cta-trust-blue OR bg-primary
```

- [ ] `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx`
- [ ] `components/ui/toast.tsx`
- [ ] `app/[locale]/(main)/page.tsx`
- [ ] `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx`

**Batch 2.1b: Medium Priority (5 files)**
- [ ] `app/[locale]/(main)/wishlist/shared/[token]/page.tsx`
- [ ] `app/[locale]/(main)/wishlist/[token]/page.tsx`
- [ ] `components/layout/cookie-consent.tsx`
- [ ] `components/sections/start-selling-banner.tsx`
- [ ] `components/shared/filters/mobile-filters.tsx`

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

### Task 2.2: Arbitrary Values - Top Offenders
```
Effort: 4-6 hours
Risk: Low (visual only)
Files: 10-15 files per batch
```

**Batch 2.2a: High-Traffic Pages**
- [ ] `sidebar.tsx` - Replace with container tokens
- [ ] `drawer.tsx` - Replace with container tokens
- [ ] `plan-card.tsx` - Replace with typography/spacing tokens

**Batch 2.2b: Business Dashboard**
- [ ] `products-table.tsx`
- [ ] `chat/loading.tsx`
- [ ] `sidebar-menu.tsx`

**Token Reference**:
| Pattern | Replace With |
|---------|-------------|
| `w-[560px]` | `w-(--container-modal)` |
| `w-[400px]` | `w-(--container-modal-sm)` |
| `h-[42px]` | `h-10` or `h-11` |
| `h-[36px]` | `h-touch-lg` |
| `text-[13px]` | `text-sm` |
| `text-[11px]` | `text-xs` or `text-tiny` |
| `gap-[6px]` | `gap-1.5` |
| `rounded-[4px]` | `rounded-md` |

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
pnpm -s exec node scripts/scan-tailwind-palette.mjs  # check violations reduced
```

---

### Task 2.3: Dark Mode Gaps
```
Effort: 1-2 hours
Risk: Low
Files: app/globals.css
```

**Steps**:
1. Audit tokens without `.dark {}` overrides
2. Add missing dark mode values
3. Test dark mode toggle on key pages

**Verification**:
- [ ] Home page looks correct in dark mode
- [ ] Product page looks correct in dark mode
- [ ] Account dashboard looks correct in dark mode

---

## 🟢 Phase 3: Backend Optimization

**Gate**: `tsc --noEmit` + `e2e:smoke` + unit tests for touched code

### Task 3.1: Performance Advisors
```
Effort: 1-2 hours
Risk: Low (audit only)
Files: None initially
```

**Steps**:
1. Run Supabase performance advisors:
   ```
   mcp_supabase_get_advisors({ type: "performance" })
   ```
2. Document recommendations
3. Evaluate each recommendation (keep/fix/ignore)
4. Create index migration if needed

**Verification**:
- [ ] Advisors reviewed
- [ ] Decisions documented

---

### Task 3.2: Route Handler Field Projection
```
Effort: 2-3 hours
Risk: Low
Files: app/api/**
```

**Audit these endpoints**:
- [ ] `/api/products/feed/route.ts`
- [ ] `/api/products/newest/route.ts`
- [ ] `/api/products/deals/route.ts`
- [ ] `/api/products/nearby/route.ts`
- [ ] `/api/products/category/[slug]/route.ts`

**Pattern to apply**:
```typescript
// ❌ Before
.select('*')

// ✅ After
.select('id, title, price, images, slug, rating, review_count')
```

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

### Task 3.3: Standardize Error Responses
```
Effort: 1-2 hours
Risk: Low
Files: app/api/**
```

**Pattern to enforce**:
```typescript
import { errorResponse, cachedJsonResponse } from '@/lib/api/response-helpers'

// Use consistently
return errorResponse("Not found", 404)
return cachedJsonResponse({ products }, "products")
```

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```

---

## 🔵 Phase 4: Architecture Polish

**Gate**: `tsc --noEmit` + `e2e:smoke`

### Task 4.1: Add MessageProvider
```
Effort: 30 minutes
Risk: Low
Files: locale-providers.tsx
```

**Steps**:
1. Create or import MessageProvider for chat context
2. Add to provider stack in `locale-providers.tsx`
3. Test chat functionality

**Verification**:
- [ ] Chat page loads without errors
- [ ] Messages sync correctly

---

### Task 4.2: Client Directive Audit
```
Effort: 2-4 hours
Risk: Low
Files: Various components
```

**Files to review**:
- [ ] `lib/category-icons.tsx` - Remove `'use client'` if possible
- [ ] Simple display components in `components/shared/`
- [ ] Any component with `'use client'` that only renders JSX

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

### Task 4.3: Dead Code Removal
```
Effort: 2-4 hours
Risk: Medium
Files: Various
```

**Steps**:
1. Run knip to identify unused exports:
   ```bash
   pnpm exec knip
   ```
2. Review each finding
3. Remove confirmed dead code
4. Test thoroughly

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
pnpm test:unit
```

---

### Task 4.4: E2E Port Handling
```
Effort: 1-2 hours
Risk: Low
Files: playwright.config.ts, scripts/run-playwright.mjs
```

**Steps**:
1. Implement dynamic port selection
2. Update scripts to use available port
3. Test E2E runs don't conflict

**Verification**:
```bash
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
pnpm test:e2e
```

---

## ✅ Phase 5: Final Verification

### Task 5.1: Full Test Suite
```
Effort: 30 minutes (runtime)
Risk: None
```

**Commands**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e
pnpm build
```

**All must pass.**

---

### Task 5.2: Manual Acceptance (15 minutes)
```
Effort: 15 minutes
Risk: None
```

**Checklist**:
- [ ] Home loads in `/en` and `/bg`
- [ ] Search works (query + filters)
- [ ] Product page loads
- [ ] Add to cart works
- [ ] Sign up + email verification works
- [ ] Checkout creates Stripe session
- [ ] Dark mode toggle works
- [ ] Mobile layout correct

---

### Task 5.3: Production Deployment
```
Effort: 30 minutes
Risk: Medium
```

**Steps**:
1. Push to main branch
2. Verify Vercel deployment succeeds
3. Smoke test production URL
4. Monitor Vercel logs for errors
5. Check Supabase logs for anomalies

---

## 📊 Task Summary

| Phase | Tasks | Effort | Risk |
|-------|-------|--------|------|
| 1: Security | 3 | 4-7 hrs | Low |
| 2: Design | 3 | 7-11 hrs | Low |
| 3: Backend | 3 | 4-7 hrs | Low |
| 4: Polish | 4 | 6-12 hrs | Low-Med |
| 5: Verify | 3 | 1-2 hrs | None |
| **Total** | **16** | **22-39 hrs** | **Low** |

---

## 📅 Suggested Timeline

| Day | Phase | Focus |
|-----|-------|-------|
| 1 | Phase 1 | Security & blockers |
| 2 | Phase 1 | Stripe & env verification |
| 3-4 | Phase 2 | Gradient removal |
| 5-6 | Phase 2 | Arbitrary values (batches) |
| 7 | Phase 3 | Backend optimization |
| 8 | Phase 4 | Architecture polish |
| 9 | Phase 4 | Dead code, E2E fixes |
| 10 | Phase 5 | Final verification & deploy |

---

## 🔗 Related Documents

- [frontend.md](./frontend.md) - Frontend patterns audit
- [backend.md](./backend.md) - Backend patterns audit
- [issues.md](./issues.md) - All identified issues
- [guide.md](./guide.md) - Execution guide
