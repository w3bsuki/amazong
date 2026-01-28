# PRD — Treido Marketplace

> **This is the master product requirements document.** It defines what Treido is, what we're building, and what "done" looks like.

---

## 1. Vision

**Treido** is a Bulgarian-first marketplace for safe C2C and B2B commerce.

Think **eBay/Vinted meets StockX** — modern, premium UI with on-platform payments and buyer protection. We keep transactions on-platform via:

- Transparent **Buyer Protection** fee
- Predictable dispute outcomes  
- Fast payouts with **Stripe Connect**
- Low friction for personal sellers (**0% seller fee**)

---

## 2. Target Users

| User Type | Job to be Done |
|-----------|----------------|
| **Personal Seller (C2C)** | List quickly, sell fast, get paid safely |
| **Personal Buyer (C2C)** | Buy with confidence, avoid scams, get support if anything goes wrong |
| **Business Seller (B2B/B2C)** | Sell at scale with tooling, predictable fees, invoicing readiness, and trust signals |

---

## 3. Business Model

### Revenue Streams

| Source | Personal Sellers | Business Sellers |
|--------|------------------|------------------|
| Seller Fee | 0% | Small % (tiered by plan) |
| Buyer Protection Fee | ✅ (% + fixed, capped) | ✅ (% + fixed, capped) |
| Subscriptions | – | ✅ (unlock tools, reduce fees) |
| Boosts/Promotions | Optional | Optional |

### Anti-Goals

- ❌ **No COD** (cash on delivery) — fraud surface too high
- ❌ **No off-platform IBAN payments** — defeats buyer protection
- ❌ We are **not** an unmoderated public forum

---

## 4. V1 Scope (Launch)

### Core Features

| Category | Features |
|----------|----------|
| **Auth** | Email/password signup, login, email confirmation, password reset, session persistence |
| **Profiles** | Public profile, profile editing (avatar, username, bio), account settings |
| **Listings** | Create/edit listing, photo upload, categories, attributes, publish/unpublish |
| **Discovery** | Home feed, category pages, search with filters & sorting, saved searches (future) |
| **Product Pages** | Gallery, pricing, seller info, reviews, wishlist |
| **Wishlist** | Add/remove, wishlist page |
| **Cart** | Add to cart, update quantities, cart persistence |
| **Checkout** | Stripe checkout, Buyer Protection fee, webhooks, order creation |
| **Orders (Buyer)** | Orders list, order detail, status tracking, report issue |
| **Orders (Seller)** | Seller orders list, status updates (confirm/shipped/delivered), refunds |
| **Messaging** | Buyer ↔ seller chat, unread indicators, report/block |
| **Payouts** | Stripe Connect onboarding, payout eligibility, delayed release (escrow-style) |
| **Reviews** | Product reviews, seller feedback, ratings display |
| **Trust & Safety** | Report product, report user, block user, moderation surfaces |
| **Business Dashboard** | Dashboard access gating, business analytics, subscription management |
| **i18n** | English & Bulgarian, locale-aware routing |

### Hard Launch Gates

- ✅ Webhook idempotency (no duplicate orders)
- ✅ Refund/dispute flow tested end-to-end
- ✅ Support playbooks written
- ✅ Stripe environment separation (test vs live)
- ✅ RLS enabled on all user tables
- ✅ No secrets in logs

### Explicit Non-Scope (V1)

| Feature | Why Deferred |
|---------|--------------|
| COD | Fraud risk |
| International expansion | Tax complexity |
| AI assistants | V2 feature |
| Mobile apps | V3 feature |
| Complex logistics | Need carrier partnerships |

---

## 5. Roadmap

### V1 — Launch ✈️
- Full marketplace with Buyer Protection
- Stripe payments + Stripe Connect payouts
- Ratings/reviews (minimum viable)
- Trust & safety basics

### V1.1–V1.3 — Post-Launch Polish
- Shipping/tracking automation
- Better dispute tooling
- Seller onboarding improvements
- Performance & SEO optimization
- Reputation iteration (badges, levels)

### V2 — AI & Growth 🚀
- AI Listing Assistant (title/description/category suggestions)
- AI Search/Shopping Assistant
- Advanced business analytics
- Internationalization expansion

### V3 — Scale 📈
- Mobile apps (Capacitor or native)
- Ops automation (fraud scoring, moderation queues)
- B2B networking features
- Logistics partnerships

---

## 6. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payments | Stripe + Stripe Connect |
| i18n | next-intl |
| Testing | Vitest (unit) + Playwright (E2E) |

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Supply activation | New listings/day |
| Conversion | PDP → checkout → paid |
| Dispute rate | < 2% |
| Chargeback rate | < 0.5% |
| Seller payout success | > 95% |
| Support resolution time | < 48h |

---

## 8. Related Documents

| Document | Purpose |
|----------|---------|
| [FEATURES.md](FEATURES.md) | Feature implementation status (✅/🚧/⬜) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture & boundaries |
| [DESIGN.md](DESIGN.md) | UI design system rules (Tailwind v4 + tokens) |

### Detailed PRDs (docs-site)

- [PRD: Platform Vision](/docs-site/content/business/specs/prd-platform.mdx)
- [PRD: V1 Launch Scope](/docs-site/content/business/specs/prd-v1-launch-scope.mdx)
- [PRD: Payments & Escrow](/docs-site/content/business/specs/prd-payments-escrow.mdx)
- [PRD: Monetization Model](/docs-site/content/business/specs/prd-monetization-model.mdx)
- [PRD: Trust & Safety](/docs-site/content/business/specs/prd-trust-safety.mdx)
- [PRD: Reputation & Badges](/docs-site/content/business/specs/prd-reputation-badges-ratings.mdx)
- [PRD: AI Assistants](/docs-site/content/business/specs/prd-ai-assistants.mdx)

---

## 9. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01 | No COD at launch | Fraud risk too high, support burden |
| 2026-01 | Stripe Connect Express | Fastest onboarding, handles KYC |
| 2026-01 | Buyer pays protection fee | Keeps seller fees low to avoid off-platform leakage |
| 2026-01 | Personal sellers: 0% fee | Maximize supply growth |

---

*Last updated: 2026-01-25*
