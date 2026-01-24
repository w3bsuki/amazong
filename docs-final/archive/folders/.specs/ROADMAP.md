# Production Launch Roadmap

> **Goal**: Launch Treido as a production-ready eBay/Vinted competitor for Bulgarian market
> **Current State**: 95% code complete, needs alignment, audit, and polish
> **Target**: Production-ready with all core flows verified

---

## Master Phases

| Phase | Focus | Specs | Status |
|-------|-------|-------|--------|
| **P0** | Release Blockers | 3 | 🔴 Not Started |
| **P1** | Auth & Onboarding | 4 | 🔴 Not Started |
| **P2** | Seller Experience | 5 | 🔴 Not Started |
| **P3** | Buyer Experience | 5 | 🔴 Not Started |
| **P4** | Payments & Orders | 4 | 🔴 Not Started |
| **P5** | Architecture Audit | 4 | 🔴 Not Started |
| **P6** | Performance & Polish | 3 | 🔴 Not Started |

---

## P0: Release Blockers (Ship Stability)

> **Spec folder**: `.specs/active/p0-*` or `.specs/queue/p0-*`
> **Priority**: CRITICAL — Must fix before any other work

| Spec | Description | Status |
|------|-------------|--------|
| `p0-turbopack-crash` | Fix crash after sign-in (missing client manifest) | ⏳ Queue |
| `p0-stripe-connect-500` | Fix `/api/connect/onboarding` 500 error | ⏳ Queue |
| `p0-e2e-checkout-order` | E2E: cart → checkout → order created | ⏳ Queue |

---

## P1: Auth & Onboarding

> **Goal**: Seamless signup → onboarding → profile setup
> **Spec folder**: `.specs/queue/p1-*`

| Spec | Description | Status |
|------|-------------|--------|
| `p1-audit-signup` | Audit full signup flow (email, OAuth, verification) | ⏳ Queue |
| `p1-audit-signin` | Audit signin (cookies, session, redirects) | ⏳ Queue |
| `p1-audit-onboarding` | Audit post-signup onboarding (Personal vs Business) | ⏳ Queue |
| `p1-audit-profile` | Audit profile setup (avatar, bio, verification) | ⏳ Queue |

### Key Checkpoints
- [ ] User can sign up with email
- [ ] User can sign up with Google/OAuth
- [ ] Email verification works
- [ ] Session cookies set correctly
- [ ] Onboarding flow completes
- [ ] Profile editable after setup

---

## P2: Seller Experience

> **Goal**: Seller can list, manage, fulfill orders, get paid
> **Spec folder**: `.specs/queue/p2-*`

| Spec | Description | Status |
|------|-------------|--------|
| `p2-audit-listing` | Audit listing creation (photos, details, pricing) | ⏳ Queue |
| `p2-audit-seller-dashboard` | Audit seller dashboard (listings, orders, stats) | ⏳ Queue |
| `p2-audit-order-fulfillment` | Audit seller order actions (shipped, tracking) | ⏳ Queue |
| `p2-audit-payouts` | Audit Stripe Connect payouts flow | ⏳ Queue |
| `p2-feature-ai-listing` | AI-enhanced listing assistant (V1.1 optional) | ⏳ Queue |

### Key Checkpoints
- [ ] Seller can create listing with photos
- [ ] Listing appears in search/browse
- [ ] Seller can edit/delete listing
- [ ] Seller can mark order as shipped
- [ ] Seller can see payout status
- [ ] Stripe Connect onboarding works

---

## P3: Buyer Experience

> **Goal**: Buyer can browse, search, filter, buy, track
> **Spec folder**: `.specs/queue/p3-*`

| Spec | Description | Status |
|------|-------------|--------|
| `p3-audit-browse` | Audit homepage, categories, discovery | ⏳ Queue |
| `p3-audit-search` | Audit search, filters, sorting | ⏳ Queue |
| `p3-audit-pdp` | Audit product detail page (gallery, info, CTA) | ⏳ Queue |
| `p3-audit-cart-checkout` | Audit cart → checkout flow | ⏳ Queue |
| `p3-audit-order-tracking` | Audit buyer order tracking + history | ⏳ Queue |

### Key Checkpoints
- [ ] Homepage loads with categories
- [ ] Search returns relevant results
- [ ] Filters work correctly
- [ ] PDP shows all product info
- [ ] Add to cart works
- [ ] Checkout completes payment
- [ ] Order appears in buyer history

---

## P4: Payments & Orders

> **Goal**: Payments work end-to-end, orders have clear lifecycle
> **Spec folder**: `.specs/queue/p4-*`

| Spec | Description | Status |
|------|-------------|--------|
| `p4-audit-stripe-checkout` | Audit Stripe Checkout integration | ⏳ Queue |
| `p4-audit-webhooks` | Audit webhook handling (idempotency, verification) | ⏳ Queue |
| `p4-audit-order-lifecycle` | Audit order statuses + transitions | ⏳ Queue |
| `p4-audit-reviews` | Audit post-purchase reviews/ratings | ⏳ Queue |

### Key Checkpoints
- [ ] Stripe Checkout creates session
- [ ] Webhook receives payment confirmation
- [ ] Order created with correct status
- [ ] Seller notified of new order
- [ ] Buyer can leave review after delivery
- [ ] Review appears on seller profile

---

## P5: Architecture Audit

> **Goal**: Clean boundaries, no technical debt blockers
> **Spec folder**: `.specs/queue/p5-*`

| Spec | Description | Status |
|------|-------------|--------|
| `p5-audit-nextjs` | Audit App Router, caching, server/client boundaries | ⏳ Queue |
| `p5-audit-typescript` | Audit TypeScript safety (no `any` in critical paths) | ⏳ Queue |
| `p5-audit-supabase` | Audit RLS policies, performance advisors | ⏳ Queue |
| `p5-audit-dependencies` | Audit unused deps, Knip cleanup | ⏳ Queue |

### Key Checkpoints
- [ ] No client → server action imports
- [ ] Caching used correctly
- [ ] RLS policies cover all tables
- [ ] TypeScript strict in critical paths
- [ ] Unused files deleted

---

## P6: Performance & Polish

> **Goal**: Fast, accessible, polished UX
> **Spec folder**: `.specs/queue/p6-*`

| Spec | Description | Status |
|------|-------------|--------|
| `p6-audit-performance` | Lighthouse audit, bundle size, LCP | ⏳ Queue |
| `p6-audit-a11y` | Accessibility audit (WCAG 2.1 AA) | ⏳ Queue |
| `p6-audit-i18n` | i18n completeness (en ↔ bg parity) | ⏳ Queue |

### Key Checkpoints
- [ ] Lighthouse Performance > 80
- [ ] No critical a11y violations
- [ ] All UI strings translated
- [ ] Mobile touch targets correct

---

## Execution Order

### Week 1: P0 (Release Blockers)
1. `p0-turbopack-crash`
2. `p0-stripe-connect-500`
3. `p0-e2e-checkout-order`

### Week 2: P1 + P4 (Auth + Payments)
1. `p1-audit-signup`
2. `p1-audit-signin`
3. `p4-audit-stripe-checkout`
4. `p4-audit-webhooks`

### Week 3: P2 + P3 (Seller + Buyer)
1. `p2-audit-listing`
2. `p3-audit-browse`
3. `p3-audit-cart-checkout`
4. `p2-audit-order-fulfillment`

### Week 4: P5 + P6 (Architecture + Polish)
1. `p5-audit-nextjs`
2. `p5-audit-supabase`
3. `p6-audit-i18n`
4. `p6-audit-a11y`

---

## Agent Assignment

| Phase | Claude (Impl) | Codex (Verify) |
|-------|---------------|----------------|
| P0 | Fix blockers | Run gates, verify fixes |
| P1 | Audit + fix auth | Review auth security |
| P2 | Audit + fix seller | Review seller flows |
| P3 | Audit + fix buyer | Review buyer UX |
| P4 | Audit + fix payments | Review Stripe integration |
| P5 | Audit + fix arch | Review boundaries |
| P6 | Audit + fix perf | Run Lighthouse, a11y tools |

---

## Progress Tracking

### Completed Specs
_Move here when done_

### Current Sprint
_Max 3 specs in `.specs/active/`_

### Blocked
_Specs waiting on human/external_

---

## Quick Start

```bash
# Claude: Create P0 spec
SPEC: Create p0-turbopack-crash audit spec for Turbopack crash after sign-in

# Claude: Start working on spec
TREIDO: Fix Turbopack crash following .specs/active/p0-turbopack-crash/tasks.md

# Codex: Verify spec completion
/verify active/p0-turbopack-crash

# Codex: Move to completed
/complete p0-turbopack-crash
```
