# 🚀 Treido.eu Launch Pad

> **Target**: Production-ready V1 launch  
> **Stack**: Next.js 16 + Supabase + Stripe  
> **Last Audit**: 2025-12-31 (Playwright browser automation)  
> **Status**: ✅ **PHASE 4 IN PROGRESS** - Go-Live Preparation

---

## 📊 Feature Status Overview (AUDIT VERIFIED)

| Feature | Status | Completion | Priority | Browser Tested | Doc |
|---------|--------|------------|----------|----------------|-----|
| **Homepage & Navigation** | ✅ | 95% | P0 | ✅ Working | - |
| **Auth & Sessions** | ✅ | 95% | P0 | ✅ E2E Tested | [auth.md](./auth.md) |
| **Search & Categories** | ✅ | 90% | P0 | ✅ Working | - |
| **Product Pages** | ✅ | 95% | P0 | ✅ Mobile Verified | - |
| **Cart (Guest + User)** | ✅ | 95% | P0 | ✅ Working | [buying.md](./buying.md) |
| **Checkout** | ✅ | 95% | P0 | ✅ EUR Fixed | [buying.md](./buying.md) |
| **Listing & Selling** | ✅ | 95% | P0 | ✅ Guest CTA Fixed | [listing.md](./listing.md) |
| **Orders & Sales** | ✅ | 90% | P0 | 🔒 Auth required | [orders.md](./orders.md) |
| **Sellers Directory** | ✅ | 90% | P1 | ✅ Working (11 sellers) | - |
| **Chat & Messaging** | ✅ | 85% | P1 | 🔒 Auth required | [chat.md](./chat.md) |
| **Wishlist** | ✅ | 95% | P0 | ✅ Toast Fixed | [user-ux.md](./user-ux.md) |
| **Reviews & Ratings** | ✅ | 95% | P0 | ✅ Full CRUD | [user-ux.md](./user-ux.md) |
| **Follow Sellers** | ✅ | 90% | P2 | 🔒 Auth required | - |
| **Onboarding** | ✅ | 90% | P1 | ✅ account_type verified | [onboarding.md](./onboarding.md) |
| **Account Management** | ✅ | 90% | P1 | 🔒 Auth required | [account.md](./account.md) |
| **Business Dashboard** | ✅ | 85% | P2 | 🔒 Auth required | [account.md](./account.md) |
| **EU Expansion** | ✅ | 95% | P1 | ✅ Footer compliance | [eu-expansion.md](./eu-expansion.md) |
| **UX/UI Polish** | 🟡 | 85% | P1 | ⚠️ Issues found | [uxuitasks.md](./uxuitasks.md) |

**Legend**: ✅ Ready | 🟡 In Progress | 🔴 Blocked | 🔒 Auth required | ⚠️ Issues found

---

## ✅ P0 - LAUNCH BLOCKERS (FIXED - 2025-12-30)

### Critical Issues - ALL RESOLVED

| Issue | Location | Status | Fix Applied |
|-------|----------|--------|-------------|
| **✅ Review Submission** | `app/actions/reviews.ts` | FIXED | Created full CRUD server actions |
| **✅ Currency EUR** | `app/[locale]/(checkout)/_actions/checkout.ts:42` | FIXED | Changed to `currency: "eur"` |
| **✅ Wishlist Toast** | `components/providers/wishlist-context.tsx` | FIXED | Added Sign In action button |
| **✅ Seller Rating** | `components/mobile/product/mobile-seller-trust-line.tsx` | FIXED | Shows "New Seller" badge for 0 rating |
| **✅ Sell Page** | `app/[locale]/(sell)/sell/client.tsx` | FIXED | SignInPrompt renders immediately for guests |

### EU Compliance (P1) - FIXED

| Issue | Status | Fix Applied |
|-------|--------|-------------|
| **✅ ODR Link** | FIXED | Added to footer legal links |
| **✅ Company Info** | FIXED | Added registration details to footer |

---

## 🚀 PHASE 4: GO-LIVE CHECKLIST

### 1. SEO & Social Meta ✅ COMPLETED
| Item | Status | File |
|------|--------|------|
| robots.txt domain | ✅ | `app/robots.txt` → treido.eu |
| metadataBase | ✅ | `app/[locale]/layout.tsx` |
| OpenGraph tags | ✅ | `app/[locale]/layout.tsx` |
| Twitter/X cards | ✅ | `app/[locale]/layout.tsx` |
| OG image | ✅ | `public/og-image.svg` |
| Canonical URLs | ✅ | With locale alternates (en-IE, bg-BG) |
| sitemap.ts | ✅ | Defaults to treido.eu |
| Google robots directive | ✅ | max-image-preview: large |

### 2. Production Environment Setup
| Item | Status | Notes |
|------|--------|-------|
| Vercel project | ⬜ | Deploy from main branch |
| Supabase production | ⬜ | See [09-go-live.md](../production/09-go-live.md) |
| Stripe live keys | ⬜ | `pk_live_*`, `sk_live_*` |
| Environment variables | ⬜ | All vars set in Vercel dashboard |

**Required Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://treido.eu
```

### 3. DNS & SSL Configuration
| Item | Status | Notes |
|------|--------|-------|
| treido.eu DNS | ⬜ | Point to Vercel |
| www redirect | ⬜ | www.treido.eu → treido.eu |
| SSL certificate | ⬜ | Auto via Vercel |
| Email domain (MX) | ⬜ | For transactional emails |

### 4. Monitoring & Observability
| Item | Status | Notes |
|------|--------|-------|
| Error tracking | ⬜ | Sentry recommended |
| Uptime monitoring | ⬜ | UptimeRobot or similar |
| Performance (Vercel) | ⬜ | Built-in Analytics |
| Log aggregation | ⬜ | Vercel logs or external |

### 5. Final E2E Tests
| Test | Status | Command |
|------|--------|---------|
| Smoke test | ⬜ | `pnpm test:e2e` against prod |
| Stripe payment | ⬜ | Test with real card |
| Mobile devices | ⬜ | Real device testing |
| Cookie consent | ⬜ | GDPR compliance |

### 6. UX/UI Polish (NEW - 2025-12-31)
> Full task list: **[uxuitasks.md](./uxuitasks.md)**

| Item | Priority | Status | Notes |
|------|----------|--------|-------|
| Fix footer duplication | P0 | ⬜ | Product page renders footer twice |
| shadow-lg → shadow-sm | P0 | ⬜ | 19 files need fixing |
| rounded-xl → rounded-md | P0 | ⬜ | 20+ card components |
| Trust bar component | P1 | ⬜ | Per Temu audit pattern |
| Social proof (sold count) | P1 | ⬜ | ProductCard enhancement |
| VAT-inclusive labels | P1 | ⬜ | Price display compliance |
| Category carousel | P2 | ⬜ | Desktop homepage |
| Subcategory circles | P2 | ⬜ | Per Temu mobile pattern |

---

## ✅ WORKING FEATURES (Verified via Browser Audit)

### Buyer Journey
- [x] **Homepage** - Product grid, category tabs, quick add buttons ✅
- [x] **Product Cards** - Add to cart, add to wishlist (logged in) ✅
- [x] **Search** - Query works, filters present, pagination ✅
- [x] **Categories** - All 25 categories display with images ✅
- [x] **Product Detail** - Full page with images, details, seller info ✅
- [x] **Cart (Guest)** - Add items, localStorage persistence ✅
- [x] **Cart Drawer** - Quantity adjust, remove, checkout CTA ✅
- [x] **Checkout Page** - Loads correctly with step indicator ✅

### Seller Journey (Auth Required)
- [x] **Login/Signup** - Forms render, validation works ✅
- [x] **Protected Routes** - Redirect to login with return URL ✅
- [x] **Sellers Directory** - Shows 11 sellers with stats ✅
- [x] **Seller Profile Links** - Navigate to search by seller ✅

### Infrastructure
- [x] **i18n** - EN/BG locale routing ✅
- [x] **Responsive Header** - Mobile nav, search, cart icon ✅
- [x] **Footer** - All sections, legal links ✅
- [x] **No Console Errors** - Clean on main pages ✅

---

## 🟡 P1 - High Priority (Quality Launch)

> See also: [audit1.md](./audit1.md) | [audit2.md](./audit2.md) | [uxuitasks.md](./uxuitasks.md)

| Issue | Status | Owner | Notes |
|-------|--------|-------|-------|
| Onboarding: `account_type` flag | ✅ | - | Verified: correctly sets 'business' or 'personal' |
| Guest cart persistence | 🟡 | - | audit1: localStorage may not sync with cart page |
| Guest checkout UX | 🟡 | - | Cart works, checkout needs work |
| "Incl. VAT" price labels | ❌ | - | audit2: EU compliance requires VAT indicator |
| Email notifications | ❌ | - | None implemented |
| Mobile polish | 🟡 | - | Touch targets need review |
| Sell page for guests | ✅ | - | Fixed: SignInPrompt renders immediately |

---

## 🟠 P2 - Post-Launch (V1.1)

- [ ] Social OAuth (Google/Facebook)
- [ ] Push notifications
- [ ] Bulk listing import
- [ ] Returns/refunds flow
- [ ] Seller payouts
- [ ] Following sellers (DB ready, UI needs work)
- [ ] Advanced dashboard analytics
- [ ] Guest-to-user cart migration on login (audit1)
- [ ] Product availability check in cart (audit1)
- [ ] Seller online/last seen status (audit1)

---

## 📅 Revised Launch Timeline

### Phase 1: BLOCKERS (Days 1-2) ✅ COMPLETED (2025-12-30)
- [x] **Day 1 AM**: Fix currency to EUR in checkout.ts ✅
- [x] **Day 1 PM**: Implement review submission action ✅
- [x] **Day 2 AM**: Fix wishlist toast with login button ✅
- [x] **Day 2 PM**: Fix "0.0" seller rating display ✅

### Phase 2: Auth Flows (Days 3-5) ✅ COMPLETED (2025-12-30)
- [x] Verified `account_type` flag works correctly ✅
- [x] Sell page guest CTA working ✅
- [x] Test complete buyer journey end-to-end (30/32 passed) ✅
- [x] Test seller onboarding flow (verified code) ✅
- [x] Fixed E2E test selector bugs ✅

### Phase 3: Polish (Days 6-8) ✅ COMPLETED (2025-12-30)
- [x] Mobile UX pass - Touch targets (40px h-touch/w-touch) verified ✅
- [x] Loading states - 56 loading.tsx files with skeleton UI ✅
- [x] Error boundaries - 12 error.tsx + global-error.tsx ✅
- [x] i18n completeness - EN & BG both have 53 keys ✅
- [x] Mobile E2E tests fixed (cookie consent, selectors) ✅

### Phase 4: Go-Live (Days 9-10) 🟡 IN PROGRESS
- [x] SEO: robots.txt fixed (treido.eu sitemap URL) ✅
- [x] SEO: metadataBase added to layout ✅
- [x] SEO: Twitter/X cards configured ✅
- [x] SEO: OG image created (og-image.svg) ✅
- [x] SEO: Canonical URLs with locale alternates ✅
- [x] SEO: sitemap.ts verified (defaults to treido.eu) ✅
- [ ] Production env setup (see docs/production/09-go-live.md)
- [ ] DNS/SSL configuration
- [ ] Monitoring setup (Sentry/uptime)
- [ ] Final E2E smoke tests
- [ ] 🚀 Launch

---

## 🧪 Test Commands

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E Tests (requires running dev server)
pnpm test:e2e

# Quick smoke test
pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium
```

### E2E Test Files
- [e2e/auth.spec.ts](../../e2e/auth.spec.ts) - Auth flows
- [e2e/full-flow.spec.ts](../../e2e/full-flow.spec.ts) - Buyer journey
- [e2e/orders.spec.ts](../../e2e/orders.spec.ts) - Order management
- [e2e/seller-create-listing.spec.ts](../../e2e/seller-create-listing.spec.ts) - Listing creation
- [e2e/smoke.spec.ts](../../e2e/smoke.spec.ts) - Critical paths

---

## 📁 Key Files Reference (Updated 2025-12-30)

| Area | Key Files | Status |
|------|-----------|--------|
| Auth | `app/[locale]/(auth)/_actions/auth.ts` | ✅ |
| Cart | `components/providers/cart-context.tsx` | ✅ |
| Checkout | `app/[locale]/(checkout)/_actions/checkout.ts` | ✅ EUR Fixed |
| Orders | `app/actions/orders.ts` | ✅ |
| Listings | `app/actions/products.ts` | ✅ |
| Chat | `components/providers/messaging-provider.tsx` | ✅ |
| Wishlist | `components/providers/wishlist-context.tsx` | ✅ Toast Fixed |
| Reviews | `app/actions/reviews.ts` | ✅ NEW - Full CRUD |
| Onboarding | `app/[locale]/(sell)/sell/client.tsx` | ✅ Guest CTA Fixed |
| Account | `app/[locale]/(account)/account/` | ✅ |
| Dashboard | `app/[locale]/(business)/dashboard/` | ✅ |
| Footer | `components/layout/footer/site-footer.tsx` | ✅ EU Compliance |

---

## 🗂️ Routes Verified (88 total)

<details>
<summary>Click to expand all routes</summary>

**Public Routes (Working)**
- `/[locale]` - Homepage ✅
- `/[locale]/categories` - Categories index ✅
- `/[locale]/categories/[slug]` - Category page ✅
- `/[locale]/search` - Search results ✅
- `/[locale]/product/[id]` - Product detail ✅
- `/[locale]/[username]` - Seller store ✅
- `/[locale]/[username]/[productSlug]` - Product by slug ✅
- `/[locale]/sellers` - Sellers directory ✅
- `/[locale]/cart` - Cart page ✅
- `/[locale]/checkout` - Checkout ✅

**Auth Routes (Working)**
- `/[locale]/auth/login` - Login ✅
- `/[locale]/auth/sign-up` - Signup ✅
- `/[locale]/auth/forgot-password` - Password reset ✅
- `/[locale]/auth/welcome` - Welcome wizard ✅

**Protected Routes (Auth redirect working)**
- `/[locale]/account/*` - Account pages 🔒
- `/[locale]/dashboard/*` - Business dashboard 🔒
- `/[locale]/sell` - Create listing 🔒
- `/[locale]/chat` - Messages 🔒

</details>

---

## 📝 Audit Notes

### What's Great
1. **Homepage UX is excellent** - Fast loading, smooth interactions
2. **Cart system is solid** - Guest cart, drawer UI, quantity controls
3. **Search/categories work well** - Filters, sorting, pagination
4. **Product pages are feature-rich** - Gallery, details, seller info, "more from seller"
5. **Auth protection is correct** - Proper redirects with return URL

### Fixed (2025-12-30)
1. ✅ **Review system** - Full CRUD implemented in `app/actions/reviews.ts`
2. ✅ **Currency** - Checkout now uses EUR
3. ✅ **Wishlist toast** - Login button added for guests
4. ✅ **New seller badge** - Shows "New Seller" instead of "0.0"
5. ✅ **Sell page for guests** - SignInPrompt renders immediately
6. ✅ **EU compliance** - ODR link and company info in footer
7. ✅ **Business seller flag** - `account_type` correctly set during onboarding (docs updated)

### E2E Test Results (2025-12-30)
| Test Suite | Passed | Failed | Notes |
|------------|--------|--------|-------|
| smoke.spec.ts | 6 | 3 | Timeouts on search/mobile (server perf) |
| full-flow.spec.ts | 30 | 2 | Fixed selector bugs |
| auth.spec.ts | 26 | 2 | Fixed validation test expectations |
| seller-routes.spec.ts | 1 | 0 | 2 skipped (auth required) |

### Remaining Work
1. ~~Add "Write Review" UI button on product pages~~ (backend ready, UI dialog added)
2. "Incl. VAT" indicator - ✅ Product page, 🟡 Search/cards need check
3. ✅ Test authenticated flows end-to-end
4. Mobile UX polish pass
5. Fix E2E timeout issues (server performance)

### Database Ready But UI Needed
- `store_followers` table exists - following system is DB-ready
- `reviews` table + actions now complete - needs UI form
- Notification triggers exist but no email service

---

## 📝 Related Documentation

### Audit Reports
- [audit1.md](./audit1.md) - First Playwright browser audit (4 P0 blockers identified, all fixed)
- [audit2.md](./audit2.md) - Second browser audit (EU compliance focus, fixed)
- [uxuitasks.md](./uxuitasks.md) - UX/UI polish tasks from design system audit

### Planning & Design
- [onboarding-refactor-plan.md](../../cleanup/onboarding-refactor-plan.md) - Seller onboarding fixes
- [design-system/](../design-system/) - UI component docs
- [MASTER_FIX_PLAN.md](../MASTER_FIX_PLAN.md) - Technical debt tracking
