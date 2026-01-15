# Production Readiness Audit: Treido Marketplace

**Date**: January 13, 2026  
**Status**: 🟡 OPUS DRAFT — Awaiting Codex Review

---

## Executive Summary

Treido is a Bulgarian C2C marketplace built on Next.js 16 + Supabase + Stripe. Core functionality works, but several areas need attention before production launch.

**Launch Readiness: ~75%**

| Area | Status | Blocking? |
|------|--------|-----------|
| Core Marketplace (browse/search/buy) | ✅ Working | No |
| Authentication | ✅ Working | No |
| Stripe Payments | ⚠️ Needs verification | **Yes** |
| Seller Onboarding | ⚠️ Incomplete | **Yes** |
| Subscription Plans | ⚠️ Needs validation | Maybe |
| Category Taxonomy | ⚠️ Oversized | Maybe |
| UI/UX Polish | ⚠️ 80% done | No |
| i18n (en/bg) | ✅ Working | No |
| Mobile Responsive | ✅ Working | No |

---

## 🔴 Blockers (Must Fix Before Launch)

### 1. Stripe Production Verification
**Issue**: Stripe integration exists but needs end-to-end verification in production environment.

**Current State**:
- Stripe products/prices exist (9 plans configured)
- Webhook endpoints defined
- Missing: Production environment variables verification

**Action Required**:
- [ ] Verify `STRIPE_SECRET_KEY` in Vercel production
- [ ] Verify `STRIPE_WEBHOOK_SECRET` in Vercel production
- [ ] Test checkout flow end-to-end in production
- [ ] Test subscription cancellation/reactivation

**Owner**: Opus (execute) + Human (Stripe dashboard access)

---

### 2. Seller Onboarding Incomplete
**Issue**: New sellers can list products but onboarding flow is fragmented.

**Current State**:
- `profiles.onboarding_completed` field exists but not enforced
- Shipping settings setup (`seller_shipping_settings`) table exists but empty
- Payout setup (`seller_payout_status`) table exists but empty
- No guided onboarding wizard

**Action Required**:
- [ ] Create onboarding checklist component
- [ ] Wire shipping settings form
- [ ] Wire Stripe Connect onboarding for payouts
- [ ] Gate listing creation behind onboarding completion

**Owner**: Needs PRD first

---

### 3. Business Account Setup
**Issue**: Database supports business accounts but UI flow incomplete.

**Current State**:
- `profiles.account_type` = 'personal' | 'business'
- `business_verification` table exists with 2 records
- No UI for business registration/VAT verification

**Action Required**:
- [ ] Create business registration form
- [ ] Create VAT verification flow (VIES API?)
- [ ] Different plan display for business accounts

**Owner**: Needs PRD first

---

## 🟡 Important (Should Fix Before Launch)

### 4. Subscription Pricing Validation
**Issue**: Current pricing may not fit Bulgarian market.

**Current Plans**:
```
Personal: Free (12%) → Plus €9.99 (10%) → Pro €29.99 (8%) → Power €59.99 (6%) → Unlimited €149.99 (5%)
Business: Free (10%) → Starter €49.99 (7%) → Pro €99.99 (5%) → Enterprise €199.99 (3%)
```

**Concerns**:
- OLX.bg and Bazar.bg are free (ad-supported)
- Bulgarian average salary ~€800/month
- €149.99/month is expensive for casual sellers

**Questions**:
1. Should we lower prices for Bulgarian market?
2. Should we have a "pay per listing" model instead?
3. Should free tier allow more listings with higher commission?

**Owner**: Needs market research + decision

---

### 5. Category Taxonomy Cleanup
**Issue**: 13,139 categories is excessive for launch.

**Current Distribution** (need to query):
- L0 (root): ~15 categories
- L1-L5: Deep hierarchy, many empty

**Options**:
1. Launch with L0-L2 only
2. Prune empty L3-L5 categories
3. Keep all but hide in UI until populated

**Owner**: Codex to propose taxonomy strategy

---

### 6. UI/UX Polish
**Issue**: Design system 80% complete, some inconsistencies remain.

**Known Issues**:
- 13 gradient violations (should be 0)
- 189 arbitrary Tailwind values (target <20)
- Some dark mode gaps

**Tracking**: See `TODO.md` Phase 1-2 tasks

**Owner**: Opus (systematic cleanup)

---

## 🟢 Working (Monitor Only)

### 7. Core Marketplace
- Product listing and search: ✅
- Category navigation: ✅ (works, but taxonomy bloated)
- Product detail pages: ✅
- Cart and checkout: ✅
- Order management basics: ✅

### 8. Authentication
- Email/password signup: ✅
- Email verification: ✅
- Password reset: ✅
- Session management: ✅

### 9. Messaging
- Buyer-seller chat: ✅
- Conversation threading: ✅
- (Some mobile scroll issues noted)

### 10. Internationalization
- English: ✅
- Bulgarian: ✅
- Locale routing: ✅

---

## 📊 Database Health

| Table | Rows | Notes |
|-------|------|-------|
| profiles | 25 | Test users |
| products | 247 | Test listings |
| categories | 13,139 | Needs pruning |
| category_attributes | 7,113 | Dynamic form fields |
| orders | 7 | Test orders |
| subscription_plans | 9 | All active |
| badge_definitions | 59 | Gamification ready |

---

## 🎯 Recommended Launch Sequence

### Phase 0: Blockers (Week 1)
1. Verify Stripe production configuration
2. Create minimal seller onboarding flow
3. Decide on business account MVP

### Phase 1: Polish (Week 2)
4. Clean up category taxonomy
5. Fix remaining UI/UX violations
6. Verify all critical paths E2E

### Phase 2: Soft Launch (Week 3)
7. Deploy to production
8. Invite beta sellers
9. Monitor and iterate

---

## Next Steps

1. **Codex**: Review this audit, challenge priorities
2. **Opus**: Query category distribution for taxonomy decision
3. **Human**: Confirm Stripe dashboard access for production verification
4. **Both**: Create PRDs for seller onboarding and business accounts

---

*This audit will be updated as issues are resolved.*
