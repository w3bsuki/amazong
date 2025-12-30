# 🚀 Treido.eu Launch Pad

> **Target**: Production-ready V1 launch
> **Stack**: Next.js 16 + Supabase + Stripe
> **Last Updated**: 2025-12-30

---

## 📊 Feature Status Overview

| Feature | Status | Completion | Priority | Doc |
|---------|--------|------------|----------|-----|
| **Auth & Sessions** | 🟡 | 85% | P0 | [auth.md](./auth.md) |
| **Onboarding** | 🟡 | 70% | P1 | [onboarding.md](./onboarding.md) |
| **Listing & Selling** | 🟢 | 90% | P0 | [listing.md](./listing.md) |
| **Buying & Cart** | 🟡 | 85% | P0 | [buying.md](./buying.md) |
| **Orders & Sales** | 🟢 | 90% | P0 | [orders.md](./orders.md) |
| **Chat & Messaging** | 🟡 | 85% | P1 | [chat.md](./chat.md) |
| **User UX** (Reviews/Wishlist) | 🔴 | 60% | P0 | [user-ux.md](./user-ux.md) |
| **Account Management** | 🟡 | 85% | P1 | [account.md](./account.md) |
| **EU Expansion** | 🟡 | 80% | P1 | [eu-expansion.md](./eu-expansion.md) |

**Legend**: 🔴 Blocked/Critical Issues | 🟡 In Progress | 🟢 Ready for QA

---

## 🔴 P0 - Launch Blockers

These MUST be fixed before launch:

- [ ] **Reviews**: Submission flow not implemented (only display works)
- [ ] **Currency**: USD hardcoded in Stripe checkout - must be EUR
- [ ] **Cookie Banner**: i18n keys broken (shows raw translation keys)
- [ ] **Wishlist UX**: Login prompt toast lacks clickable login action

---

## 🟡 P1 - High Priority

Should be fixed for quality launch:

- [ ] **Onboarding**: `is_business_seller` flag not set correctly
- [ ] **Seller Ratings**: Shows "0.0" for new sellers (should show "New Seller")
- [ ] **Guest Checkout**: Limited experience for non-logged-in buyers
- [ ] **Email Notifications**: None implemented for orders/messages
- [ ] **Mobile Polish**: Touch targets, animations need cleanup

---

## 🟠 P2 - Post-Launch (V1.1)

Nice to have, can ship after launch:

- [ ] Social OAuth (Google/Facebook login)
- [ ] Push notifications for messages
- [ ] Bulk listing import for power sellers
- [ ] Returns/refunds flow
- [ ] Seller payout mechanism

---

## 📅 Launch Timeline

### Phase 1: Trust & Stability (Days 1-3)
- [ ] Fix cookie banner i18n
- [ ] Currency consistency (EUR everywhere)
- [ ] Remove/hide placeholder content
- [ ] Fix broken links

### Phase 2: Core Commerce (Days 4-8)
- [ ] Implement review submission
- [ ] Fix wishlist login UX
- [ ] Order email notifications
- [ ] Test all payment flows

### Phase 3: Polish (Days 9-12)
- [ ] Mobile UX fixes
- [ ] Loading states/skeletons
- [ ] Performance audit
- [ ] Accessibility pass

### Phase 4: Go-Live (Days 13-14)
- [ ] Production env setup
- [ ] DNS/SSL configuration
- [ ] Monitoring setup
- [ ] Final smoke tests
- [ ] Launch! 🎉

---

## 🧪 Testing Checklist

### Automated (E2E)
```bash
pnpm test:e2e
```
- [e2e/auth.spec.ts](../../e2e/auth.spec.ts) - Auth flows
- [e2e/full-flow.spec.ts](../../e2e/full-flow.spec.ts) - Complete user journeys
- [e2e/orders.spec.ts](../../e2e/orders.spec.ts) - Order management
- [e2e/smoke.spec.ts](../../e2e/smoke.spec.ts) - Critical paths

### Manual QA Required
- [ ] Complete buyer journey (browse → cart → checkout → order received)
- [ ] Complete seller journey (signup → onboard → list → sell → manage sale)
- [ ] Chat between buyer/seller
- [ ] Review submission after purchase
- [ ] Mobile responsive check on real devices

---

## 📁 Key Files Reference

| Area | Key Files |
|------|-----------|
| Auth | `app/[locale]/(auth)/_actions/auth.ts`, `app/auth/confirm/route.ts` |
| Cart | `lib/cart-store.ts`, `app/[locale]/(checkout)/` |
| Orders | `app/actions/orders.ts`, `lib/order-status.ts` |
| Listings | `app/actions/products.ts`, `lib/listing-limits.ts` |
| Chat | `components/providers/messaging-provider.tsx` |
| Wishlist | `lib/wishlist-store.ts` |
| Reviews | `app/actions/reviews.ts` |
| Account | `app/[locale]/(account)/account/` |
| Dashboard | `app/[locale]/(business)/dashboard/` |

---

## 📝 Notes

- Existing plans to review: [cleanup/onboarding-refactor-plan.md](../../cleanup/onboarding-refactor-plan.md)
- Design system: [docs/design-system/](../design-system/)
- Master fix plan: [docs/MASTER_FIX_PLAN.md](../MASTER_FIX_PLAN.md)
