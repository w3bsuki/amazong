# PRD.md — Product Requirements Document

> Single source of truth for what Treido is, why it exists, and what "done" means.

---

## Document Info

| Attribute | Value |
|-----------|-------|
| **Product** | Treido |
| **Version** | 1.0 |
| **Status** | Active Development |
| **Owner** | Product Team |
| **Last Updated** | 2026-02-01 |
| **Audience** | Engineers, AI agents, product stakeholders, investors |

---

## Executive Summary

**Treido** is a modern, full-featured e-commerce marketplace platform—similar to eBay, Etsy, and Mercari—designed to connect buyers and sellers across multiple categories. The platform supports both **personal accounts** (C2C peer-to-peer selling) and **business accounts** (B2C professional sellers), with integrated payments, buyer protection, real-time messaging, and a modern mobile-first experience.

---

## Scope & Launch Definition

### Target Market (V1)
- **Geography:** Bulgaria-first launch (BG primary, EN secondary)
- **Categories:** All general merchandise (electronics, fashion, home, collectibles, etc.)
- **Users:** Individual sellers (C2C) and small-to-medium businesses (B2C)

### V1 MVP Definition

**IN SCOPE (Must Ship):**
- ✅ User authentication (email/password, OAuth)
- ✅ Personal & Business account types
- ✅ Listing creation, editing, management
- ✅ Full-text search + category browsing + filters
- ✅ Shopping cart + Stripe Checkout
- ✅ Buyer Protection escrow payments
- ✅ Stripe Connect seller payouts
- ✅ Order lifecycle management
- ✅ Real-time messaging
- ✅ Reviews & ratings
- ✅ Basic dispute resolution
- ✅ Mobile-responsive web app

**OUT OF SCOPE (Post-V1):**
- ❌ Native mobile apps (iOS/Android) — V3
- ❌ Auctions/bidding — V3
- ❌ Shipping label generation — V1.2
- ❌ Automated returns processing — V2
- ❌ Cross-border tax/VAT calculation — V2
- ❌ AI-powered recommendations — V2
- ❌ Saved payment methods (beyond Stripe's) — V1.1
- ❌ Seller storefronts/custom pages — V1.2
- ❌ API for third-party integrations — V2

### Launch Criteria
To declare V1 "launch-ready," ALL of the following must be true:
1. All P0 features implemented and passing E2E tests
2. Stripe webhooks idempotent (verified via duplicate event test)
3. RLS enabled on all user-data tables
4. Support playbooks documented for top 10 scenarios
5. Error monitoring (Sentry) active with alerting
6. Performance: LCP < 2s on core pages
7. Security audit passed (no secrets in logs)

---

## 1. Vision & Mission

### Vision
To become the leading trusted online marketplace where anyone—from individual sellers clearing out their closet to established businesses—can buy and sell with confidence, protected by modern payment infrastructure and a world-class user experience.

### Mission
Build a marketplace that:
1. **Empowers sellers** of all sizes to reach customers globally
2. **Protects buyers** with escrow-style payments and dispute resolution
3. **Delivers premium UX** that rivals the best consumer apps
4. **Scales efficiently** from C2C transactions to enterprise B2B commerce

---

## 2. Problem Statement

### Market Problems

| Problem | User Impact | Business Opportunity |
|---------|-------------|---------------------|
| **Trust deficit in marketplaces** | Buyers fear scams; sellers fear non-payment | Buyer Protection creates confidence |
| **Poor mobile experience** | Friction in listing/buying on mobile | Mobile-first design captures majority traffic |
| **Business sellers underserved** | No professional tooling, analytics, or bulk features | Subscription revenue from power sellers |
| **Fragmented payments** | Off-platform payments (cash, bank transfers) lack protection | Integrated payments enable monetization + trust |
| **Discovery challenges** | Hard to find specific items; poor search/filtering | AI-powered search + personalization |

### Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Differentiation |
|------------|-----------|------------|---------------------|
| **eBay** | Global scale, auction model, established trust | Dated UX, high fees, complex for sellers | Modern UX, simpler fee structure, mobile-first |
| **Etsy** | Strong brand for handmade/vintage | Limited categories, seller-focused | Broader categories, stronger buyer protection |
| **Mercari** | Mobile-first, simple UX | Limited internationally, basic features | More robust business tools, better B2B support |
| **Facebook Marketplace** | Massive reach, no fees | No buyer protection, no payments | Full payment integration, buyer protection |
| **Vinted** | Fashion-focused, 0% seller fees | Single category | Multi-category, business account support |

---

## 3. Solution Overview

### Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              TREIDO PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   PERSONAL      │  │    BUSINESS     │  │        BUYERS           │  │
│  │   SELLERS       │  │    SELLERS      │  │                         │  │
│  │                 │  │                 │  │  • Browse & Search      │  │
│  │  • Quick list   │  │  • Bulk listing │  │  • Buyer Protection     │  │
│  │  • 0% fees      │  │  • Analytics    │  │  • Real-time Chat       │  │
│  │  • Easy payouts │  │  • Subscriptions│  │  • Order Tracking       │  │
│  │  • Basic stats  │  │  • VAT support  │  │  • Reviews & Ratings    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      CORE PLATFORM SERVICES                      │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  Payments (Stripe)  │  Auth  │  Messaging  │  Search  │  Trust   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Value Proposition Matrix

| Stakeholder | Value Delivered |
|-------------|-----------------|
| **Personal Sellers** | List for free (0% fees), simple UX, fast payouts, exposure to buyers |
| **Business Sellers** | Professional tools, bulk management, analytics, reduced fees via subscriptions |
| **Buyers** | Safe transactions, buyer protection, easy discovery, real-time communication |
| **Platform** | Transaction fees, subscriptions, boosts, premium features |

---

## 4. User Personas & Jobs-to-be-Done

### 4.1 Personal Seller (C2C)

**Profile:** Individual selling personal items—pre-owned electronics, clothing, collectibles, household items.

| Job to be Done | Acceptance Criteria |
|----------------|---------------------|
| List items quickly | < 3 min to publish with photos (mobile or desktop) |
| Get discovered | Items appear in search, feeds, and category pages |
| Receive payments safely | Payout within 48h of confirmed delivery |
| Track sales lifecycle | Clear status: listed → sold → shipped → delivered → paid |
| Communicate with buyers | Real-time chat with notifications |

**User Story:**
> As a personal seller, I want to photograph my item with my phone, add a description, set a price, and publish—all in under 3 minutes—so I can convert my unused items to cash without friction.

### 4.2 Business Seller (B2B/B2C)

**Profile:** Professional seller, small business, or retail operation selling at volume.

| Job to be Done | Acceptance Criteria |
|----------------|---------------------|
| Manage inventory at scale | Bulk upload (CSV/API), inventory tracking, multi-variant products |
| Analyze performance | Dashboard: revenue, orders, conversion rates, top products |
| Reduce transaction costs | Subscription tiers unlock lower fees (e.g., Pro plan = 2% vs 3%) |
| Build credibility | Verified business badge, reviews aggregation, storefront page |
| Generate invoices | VAT-compliant transaction records, exportable reports |

**User Story:**
> As a business seller, I want a dashboard showing my weekly revenue, best-sellers, and conversion funnel so I can make data-driven decisions about pricing and inventory.

### 4.3 Buyer

**Profile:** Consumer looking to purchase items across categories with confidence.

| Job to be Done | Acceptance Criteria |
|----------------|---------------------|
| Find items easily | Search returns relevant results < 500ms; filters by price, condition, location |
| Buy with confidence | Buyer Protection fee visible; funds held until delivery confirmed |
| Communicate with sellers | Real-time messaging; response time indicators |
| Track purchases | Order status visible from payment → shipping → delivery |
| Resolve issues | Clear dispute process; support response < 24h |

**User Story:**
> As a buyer, I want to know my payment is protected until I receive the item in the condition described, so I can shop on Treido without fear of fraud.

---

## 5. Business Model

### 5.1 Revenue Streams

| Stream | Who Pays | Description | Target Revenue Mix |
|--------|----------|-------------|-------------------|
| **Buyer Protection Fee** | Buyer | % of transaction + fixed fee (capped) | 60% |
| **Business Seller Fee** | Business accounts | % per transaction (tiered by plan) | 15% |
| **Subscriptions** | Business sellers | Monthly plans unlock features + reduced fees | 15% |
| **Boosts** | Any seller | Pay for increased visibility | 8% |
| **Premium Features** | Power users | Advanced analytics, priority support | 2% |

### 5.2 Fee Formulas

**Buyer Protection Fee (paid by buyer):**
```
BP_Fee = min($1.50 + (item_price × 0.05), $25)
```
- Minimum: $1.50
- Maximum (cap): $25.00
- Rationale: Covers fraud losses, payment processing, and support costs while remaining affordable

**Business Seller Fee (paid by business accounts):**
```
Seller_Fee = item_price × tier_rate

Where tier_rate =
  - Starter (Free plan): 3.0%
  - Pro ($29/mo): 2.0%
  - Enterprise ($99/mo): 1.5%
```

**Personal Seller Fee:** `$0` (always free to maximize supply)

### 5.3 Worked Examples

#### Example 1: Personal Seller — $50 Item
| Line Item | Amount | Who Pays |
|-----------|--------|----------|
| Item Price | $50.00 | Buyer |
| Buyer Protection Fee | $1.50 + ($50 × 5%) = **$4.00** | Buyer |
| Seller Fee | **$0.00** | — |
| **Buyer Pays Total** | **$54.00** | |
| **Seller Receives** | **$50.00** | |
| **Treido Revenue** | **$4.00** | (7.4% take rate) |

#### Example 2: Business Seller (Pro Plan) — $200 Item
| Line Item | Amount | Who Pays |
|-----------|--------|----------|
| Item Price | $200.00 | Buyer |
| Buyer Protection Fee | $1.50 + ($200 × 5%) = **$11.50** | Buyer |
| Seller Fee (Pro = 2%) | $200 × 2% = **$4.00** | Seller |
| **Buyer Pays Total** | **$211.50** | |
| **Seller Receives** | **$196.00** | |
| **Treido Revenue** | **$15.50** | (7.3% take rate) |

#### Example 3: Business Seller + Boost — $100 Item
| Line Item | Amount | Who Pays |
|-----------|--------|----------|
| Item Price | $100.00 | Buyer |
| Buyer Protection Fee | $1.50 + ($100 × 5%) = **$6.50** | Buyer |
| Seller Fee (Starter = 3%) | $100 × 3% = **$3.00** | Seller |
| Boost Fee (7-day) | **$5.00** | Seller |
| **Buyer Pays Total** | **$106.50** | |
| **Seller Receives** | **$92.00** | |
| **Treido Revenue** | **$14.50** | (13.6% effective take rate) |

### 5.4 Unit Economics & Contribution Margin

| Cost Category | % of GMV | Notes |
|---------------|----------|-------|
| Stripe processing | ~2.9% + $0.30 | Per-transaction payment fees |
| Chargebacks/fraud | ~0.3% | Target <0.5% chargeback rate |
| Support costs | ~0.5% | Customer service, dispute handling |
| Hosting/infra | ~0.2% | Vercel, Supabase, CDN |
| **Total COGS** | **~4.0%** | |

**Target Take Rate:** 7-8% of GMV (Buyer Protection + Seller Fees)
**Target Contribution Margin:** ~3-4% of GMV after COGS

**Comparison to Competitors:**
| Platform | Seller Fee | Buyer Fee | Total Take Rate |
|----------|-----------|-----------|-----------------|
| **Treido** | 0-3% | 5-7% | ~7-8% |
| eBay | 10-15% | 0% | 10-15% |
| Etsy | 6.5% + listing | 0% | ~8-10% |
| Mercari | 10% | 0% | 10% |
| Vinted | 0% | 5%+ | ~5-8% |

### 5.5 Subscription Tier Economics

| Plan | Price/Month | Seller Fee | Break-even GMV/Month |
|------|-------------|------------|---------------------|
| **Starter** | $0 | 3.0% | — |
| **Pro** | $29 | 2.0% | $2,900 (saves $29 at 1% lower fee) |
| **Enterprise** | $99 | 1.5% | $6,600 (saves $99 at 1.5% lower fee) |

**Recommendation Matrix:**
- GMV < $2,900/mo → Stay on Starter
- GMV $2,900 - $6,600/mo → Upgrade to Pro
- GMV > $6,600/mo → Upgrade to Enterprise

### 5.6 Strategic Principles (Anti-Goals)

| We Will NOT Do | Rationale |
|----------------|-----------|
| ❌ Cash on Delivery (COD) | High fraud risk, no buyer protection possible |
| ❌ Off-platform payments | Defeats escrow model, eliminates trust guarantees |
| ❌ Race-to-bottom on fees | Need revenue to fund Trust & Safety operations |
| ❌ Unmoderated marketplace | Legal liability, trust erosion, brand damage |

---

## 6. Feature Requirements (V1)

### 6.1 Authentication & Account Management

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Email/password signup | P0 | Account created, email verification sent |
| Email/password login | P0 | Session persisted via secure cookies |
| OAuth (Google, Apple) | P1 | Single-click signup, account merge support |
| Password reset | P0 | Reset link valid for 1 hour |
| Email verification | P0 | Unverified users cannot sell |
| Account type selection | P0 | Personal vs Business choice during onboarding |
| Profile management | P0 | Edit name, photo, bio, location |
| Stripe Connect onboarding | P0 | Required for sellers to receive payouts |

### 6.2 Listings & Catalog

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Create listing | P0 | Title, description, photos (up to 10), price, category, condition |
| Photo upload | P0 | Drag-drop + mobile capture, auto-resize, CDN delivery |
| Category selection | P0 | Hierarchical categories with dynamic attributes |
| Condition selection | P0 | New, Like New, Good, Fair, Parts/Not Working |
| Edit listing | P0 | All fields editable while not sold |
| Delete/unpublish | P0 | Soft delete, removed from search |
| Draft listings | P1 | Save incomplete listings for later |
| Bulk upload (Business) | P1 | CSV import for inventory |
| Inventory management | P1 | Stock quantities, variants (size, color) |

### 6.3 Discovery & Search

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Home feed | P0 | Personalized recommendations + recent listings |
| Category pages | P0 | Browse by category with filters |
| Full-text search | P0 | < 500ms response, typo tolerance |
| Filters | P0 | Price range, condition, location, seller type |
| Sorting | P0 | Relevance, price (low/high), newest, popularity |
| Saved searches | P1 | Email alerts when matching items listed |
| AI-powered search | P2 | Natural language queries ("red vintage jacket under $50") |

### 6.4 Product Detail Page (PDP)

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Image gallery | P0 | Swipe navigation, pinch-zoom, thumbnails |
| Price display | P0 | Item price + Buyer Protection fee breakdown |
| Seller info card | P0 | Avatar, name, rating, member since, response time |
| Add to Cart | P0 | Immediate feedback, cart badge update |
| Add to Wishlist | P0 | Heart toggle, persisted to account |
| Share | P1 | Native share + copy link |
| Report listing | P0 | Reason selection + optional details |
| Related items | P1 | "You might also like" recommendations |

### 6.5 Cart & Checkout

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Persistent cart | P0 | Server-side, survives logout |
| Cart management | P0 | Update quantities, remove items |
| Multi-seller cart | P0 | Group items by seller, separate shipping |
| Checkout summary | P0 | Itemized totals, Buyer Protection fee visible |
| Stripe Checkout | P0 | Secure redirect, saved cards, Apple/Google Pay |
| Webhook handling | P0 | Idempotent processing, order created on success |
| Order confirmation | P0 | Email + in-app notification |

**Critical Requirement: Idempotency**
> Given the same Stripe webhook event ID, the system MUST create exactly one order—even if the webhook fires multiple times.

### 6.6 Orders & Fulfillment

| Feature | Priority | User | Acceptance Criteria |
|---------|----------|------|---------------------|
| Orders list | P0 | Both | All orders with status badges, filters |
| Order detail | P0 | Both | Items, counterparty info, status, actions |
| Mark as shipped | P0 | Seller | Requires tracking number |
| Mark as delivered | P0 | Seller | Triggers buyer confirmation window |
| Confirm receipt | P0 | Buyer | Releases funds to seller |
| Auto-confirm | P0 | System | 72h after "delivered" if no action |
| Report issue | P0 | Buyer | Opens dispute, blocks payout release |
| Cancel order | P0 | Both | Pre-shipment only, automatic refund |

**Order State Machine:**
```
PENDING ─→ CONFIRMED ─→ SHIPPED ─→ DELIVERED ─→ COMPLETED
              │            │           │
              ▼            ▼           ▼
          CANCELLED    DISPUTED    REFUNDED
```

### 6.7 Payments & Payouts

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Stripe Checkout | P0 | Credit/debit cards, Apple Pay, Google Pay |
| Buyer Protection escrow | P0 | Funds held until delivery confirmed + 24h |
| Stripe Connect onboarding | P0 | Express accounts, KYC handled by Stripe |
| Payout scheduling | P0 | Auto-release on confirmation, manual for disputes |
| Refund processing | P0 | Full/partial refunds, reason logged |
| Transaction history | P0 | Buyers and sellers can view all transactions |

**Payout Release Logic:**
1. Buyer confirms receipt → payout released after 24h buffer
2. No buyer action → auto-release 72h after "delivered" status
3. Dispute opened → funds frozen until resolution
4. Dispute resolved (seller wins) → release payout
5. Dispute resolved (buyer wins) → refund buyer

### 6.8 Messaging

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Start conversation | P0 | From listing page or order |
| Chat list | P0 | Sorted by recency, unread indicators |
| Real-time messages | P0 | < 1s delivery latency |
| Image attachments | P1 | Upload + inline preview |
| Read receipts | P2 | Show when message was read |
| Block user | P0 | Hides messages, prevents new contact |
| Report conversation | P0 | Flag for moderation |

### 6.9 Reviews & Ratings

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Product review | P0 | 1–5 stars + text, photos optional |
| Seller rating | P0 | Post-order review of seller experience |
| Buyer rating | P1 | Sellers rate buyers after order |
| Review display (PDP) | P0 | Average rating, count, recent reviews |
| Profile ratings | P0 | Aggregated seller/buyer score |
| Review validation | P0 | Must be order participant, no duplicates |

### 6.10 Trust & Safety

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Report listing | P0 | Reason categories, queued for moderation |
| Report user | P0 | Same flow, escalation for serious violations |
| Block user | P0 | Bidirectional blocking |
| Dispute resolution | P0 | Standard reasons, evidence upload, admin review |
| Moderation queue | P0 | Admin dashboard for triage and action |
| Seller verification | P1 | ID verification for badge |

**Dispute Types & Resolution:**

| Dispute Type | Default Resolution | Evidence Required |
|--------------|-------------------|-------------------|
| Item Not Received | Buyer refund if no valid tracking | Tracking number with delivery confirmation |
| Significantly Not As Described | Case-by-case review | Photos comparing listing vs received |
| Counterfeit/Fake | Buyer refund | Photos + authenticity documentation |
| Damaged in Transit | Case-by-case | Photos of packaging and item |
| Harassment/Abuse | Warning or ban | Screenshots of communication |

### 6.11 Business Dashboard

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| Dashboard home | P0 | Summary: revenue, orders, conversion |
| Sales analytics | P1 | Charts: daily/weekly/monthly trends |
| Listing management | P0 | Bulk actions, status filters |
| Inventory tracking | P1 | Stock levels, low-stock alerts |
| Subscription management | P0 | View plan, upgrade/downgrade |
| Payout history | P0 | All payouts with status |
| Export data | P1 | CSV export for accounting |

### 6.12 Internationalization

| Feature | Priority | Acceptance Criteria |
|---------|----------|---------------------|
| English locale | P0 | 100% coverage of all strings |
| Additional locales | P1 | Framework supports adding more |
| Locale routing | P0 | `/en/`, `/bg/`, etc. URL prefixes |
| Currency display | P0 | Primary currency + conversion display |
| Date/time formatting | P0 | Locale-appropriate formats |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load (LCP) | < 2.0s | Core Web Vitals |
| Time to Interactive | < 3.0s | Lighthouse |
| Search response | < 500ms | Server metrics |
| Checkout redirect | < 1.0s | Stripe latency |
| Real-time messaging | < 1.0s delivery | WebSocket monitoring |

### 7.2 Reliability & Availability

| Metric | Target |
|--------|--------|
| Uptime SLA | 99.9% |
| Data durability | 99.999% |
| Backup frequency | Daily with 30-day retention |
| Recovery Time Objective (RTO) | < 4 hours |
| Recovery Point Objective (RPO) | < 1 hour |

### 7.3 Security

| Requirement | Implementation |
|-------------|----------------|
| Row Level Security (RLS) | All user data tables protected |
| Secrets management | No secrets in code/logs, env-only |
| Webhook verification | Stripe signature validation required |
| HTTPS only | TLS 1.3, HSTS enabled |
| Auth token security | HttpOnly, Secure, SameSite cookies |
| Input validation | Server-side validation on all inputs |
| Rate limiting | API endpoints protected |

### 7.4 Accessibility

| Requirement | Target |
|-------------|--------|
| WCAG compliance | 2.1 AA for core flows |
| Keyboard navigation | Full support |
| Screen reader support | Semantic HTML, ARIA labels |
| Touch targets | ≥ 44px minimum |
| Color contrast | 4.5:1 minimum ratio |

### 7.5 Mobile & Responsive

| Requirement | Target |
|-------------|--------|
| Viewport support | 320px – 1440px+ |
| Mobile-first design | Touch-optimized UI |
| Offline resilience | Graceful degradation |
| PWA support | Installable, push notifications |

---

## 8. Launch Checklist

### 8.1 Technical Gates

| Gate | Validation Method | Status |
|------|-------------------|--------|
| Webhook idempotency | E2E test: duplicate event → single order | ✅ |
| Refund flow | E2E test: dispute → refund → balance update | ✅ |
| Dispute flow | E2E test: open → evidence → resolution | ✅ |
| Stripe env separation | Test/live keys isolated | ✅ |
| RLS coverage | All user tables protected | ✅ |
| No secrets in logs | Security audit passed | ✅ |
| Error monitoring | Sentry configured + alerting | ✅ |
| Performance baselines | Core Web Vitals passing | ✅ |

### 8.2 Operational Gates

| Gate | Validation Method | Status |
|------|-------------------|--------|
| Support playbooks | Documented for common scenarios | ✅ |
| Incident response runbook | Documented and tested | ✅ |
| On-call rotation | Defined and staffed | ✅ |
| Monitoring dashboards | Key metrics visible | ✅ |
| Backup verification | Restore tested | ✅ |

---

## 9. Success Metrics

### 9.1 Metric Hierarchy (North Star → Leading Indicators)

```
                    ┌─────────────────┐
                    │   GMV (North    │
                    │     Star)       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼────┐         ┌────▼────┐
   │ Active  │         │  Avg     │         │ Repeat  │
   │ Buyers  │         │  Order   │         │Purchase │
   │         │         │  Value   │         │  Rate   │
   └────┬────┘         └──────────┘         └────┬────┘
        │                                        │
   ┌────▼────────────────┐              ┌────────▼────┐
   │ Search → PDP →      │              │ D30 Buyer   │
   │ Cart → Checkout     │              │ Retention   │
   │ Conversion Funnel   │              │             │
   └─────────────────────┘              └─────────────┘
```

### 9.2 Primary Metrics (Weekly Review)

| Metric | Definition | Denominator | Window | V1 Target | Baseline |
|--------|------------|-------------|--------|-----------|----------|
| **GMV** | Total value of completed orders | — | Monthly | $100K | $0 |
| **Active Buyers** | Unique users with ≥1 purchase | All registered users | 30-day rolling | 2,000 | 0 |
| **Active Sellers** | Unique users with ≥1 active listing | All registered users | 30-day rolling | 1,000 | 0 |
| **Take Rate** | (BP fees + Seller fees + Boosts) / GMV | GMV | Monthly | 7-8% | — |

### 9.3 Growth Metrics

| Metric | Definition | V1 Target | Measurement Window |
|--------|------------|-----------|-------------------|
| **New Signups** | New accounts created | 500/week | Weekly |
| **New Listings/Day** | Listings published | 100+/day | Daily |
| **Active Listings** | Published, not sold | 10,000+ | Point-in-time |
| **Seller Activation Rate** | (New sellers with ≥1 sale) / (New sellers) | > 25% | 30-day cohort |
| **Time to First Listing** | Median days from signup to first listing | < 2 days | Cohort |
| **Time to First Sale** | Median days from first listing to first sale | < 14 days | Cohort |

### 9.4 Engagement Funnel (Buyer Journey)

| Funnel Step | Definition | V1 Target | Measurement |
|-------------|------------|-----------|-------------|
| **Visit → Search** | Sessions with ≥1 search | > 60% | Analytics |
| **Search → PDP View** | Searches resulting in PDP click | > 40% | Analytics |
| **PDP → Add to Cart** | PDP views resulting in cart add | > 15% | Analytics |
| **Cart → Checkout Start** | Cart sessions starting checkout | > 50% | Analytics |
| **Checkout → Purchase** | Checkout starts completing purchase | > 70% | Stripe |
| **End-to-End Conversion** | Unique visitors → purchasers | > 5% | Calculated |

### 9.5 Retention Metrics

| Metric | Definition | V1 Target | Measurement |
|--------|------------|-----------|-------------|
| **D7 Buyer Return** | Buyers returning within 7 days | > 30% | Cohort |
| **D30 Buyer Retention** | Buyers active again within 30 days | > 40% | Cohort |
| **Repeat Purchase Rate** | Buyers with 2+ orders | > 20% | 90-day window |
| **D30 Seller Return** | Sellers returning within 30 days | > 50% | Cohort |

### 9.6 Trust & Quality Metrics (Guardrails)

| Metric | Definition | V1 Target | Alert Threshold |
|--------|------------|-----------|-----------------|
| **Dispute Rate** | Disputes / total orders | < 2% | > 3% |
| **Chargeback Rate** | Chargebacks / transactions | < 0.5% | > 0.75% |
| **Refund Rate** | Refunds / total orders | < 5% | > 8% |
| **Fraud Rate** | Fraudulent listings detected / total | < 1% | > 2% |
| **Payout Success Rate** | Successful payouts / attempts | > 98% | < 95% |
| **On-Time Shipping** | Shipped within 3 days of order | > 85% | < 75% |

### 9.7 Support Metrics

| Metric | Definition | V1 Target | Measurement |
|--------|------------|-----------|-------------|
| **First Response Time** | Time to first support reply | < 4h | Support tool |
| **Resolution Time (SLA)** | Tickets resolved | > 95% in < 48h | Support tool |
| **CSAT Score** | Customer satisfaction rating | > 4.0/5.0 | Post-ticket survey |
| **Ticket Volume** | Support tickets per 1K orders | < 50 | Ratio |

### 9.8 Financial Metrics (Monthly Review)

| Metric | Definition | V1 Target | Measurement |
|--------|------------|-----------|-------------|
| **Net Revenue** | Total fees collected | $7-8K/month (at $100K GMV) | Stripe |
| **Contribution Margin** | Net Revenue - COGS | ~$3-4K/month | Calculated |
| **CAC** | Customer Acquisition Cost | TBD | Marketing spend / new customers |
| **LTV** | Customer Lifetime Value | TBD | Revenue per customer over time |
| **LTV:CAC Ratio** | LTV / CAC | > 3:1 | Calculated |

---

## 10. Risk Analysis

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **High dispute rate** | Medium | High | Clear policies, evidence requirements, seller limits for new accounts |
| **Fraud (fake listings)** | Medium | High | Seller verification, listing limits, AI fraud detection |
| **Stripe account issues** | Low | Critical | Monitor Stripe health metrics, maintain dispute rate, have backup processor plan |
| **Off-platform payment leakage** | High | Medium | Strong value prop communication, visible buyer protection, in-app payment prompts |
| **Scaling bottlenecks** | Low | Medium | CDN for assets, database indexing, caching layer |
| **Category spam/quality** | Medium | Medium | Moderation queue, user reporting, automated detection |

---

## 11. Roadmap

### Phase 1: Foundation (V1.0) — Launch
- Core marketplace functionality
- C2C and B2C account types
- Stripe payments + buyer protection
- Basic trust & safety
- Mobile-responsive web

### Phase 2: Growth (V1.1-1.3) — +1-3 months
- Shipping tracking integration
- Saved searches + notifications
- Enhanced seller analytics
- SEO optimization
- Seller verification badges
- Performance optimization

### Phase 3: Scale (V2.0) — +6 months
- AI-powered search & recommendations
- Advanced fraud detection
- Expanded payment methods
- API for third-party integrations
- Enhanced business tools
- Multi-currency support

### Phase 4: Platform (V3.0) — +12 months
- Native mobile apps (iOS/Android)
- Logistics partnerships
- Advanced B2B features
- International expansion
- Auction/bidding features
- White-label/API marketplace

---

## 12. Operations & Compliance

### 12.1 KYC/AML Requirements

| User Type | Verification Required | Provider | Trigger |
|-----------|----------------------|----------|---------|
| Personal Seller | Email verification | Supabase Auth | Before first listing |
| Personal Seller (High Volume) | ID verification | Stripe Identity | > $5K GMV/month |
| Business Seller | Business verification | Stripe Connect | Account setup |
| Business Seller (Enterprise) | Enhanced due diligence | Manual review | Enterprise plan signup |

### 12.2 Tax & Compliance

| Requirement | V1 Approach | Future Enhancement |
|-------------|-------------|-------------------|
| Sales tax (US) | Not collected (marketplace exemption) | Avalara integration (V2) |
| VAT (EU) | Buyer responsibility | Automated VAT handling (V2) |
| 1099-K reporting | Stripe handles for US sellers | — |
| Sanctions screening | Stripe handles | — |

### 12.3 Payment Data Boundaries (PCI Compliance)

| Data Type | Where Stored | Access |
|-----------|--------------|--------|
| Full card numbers | **Never** (Stripe only) | N/A |
| Last 4 digits | Stripe (surfaced via API) | Display only |
| Bank account details | Stripe Connect | Never stored locally |
| Transaction IDs | Supabase | Internal reference |

### 12.4 Dispute & Chargeback SOPs

**Dispute Escalation Path:**
```
User Report → Auto-triage → Support L1 → Support L2 → Legal/Escalation
    │              │             │            │
    ▼              ▼             ▼            ▼
 < 1 hour      < 4 hours     < 24 hours   < 72 hours
```

**Chargeback Response Process:**
1. Stripe webhook received (`charge.dispute.created`)
2. Auto-freeze seller payout
3. Pull evidence: order details, tracking, messages, photos
4. Submit to Stripe within 24 hours
5. Track outcome, update internal records

### 12.5 Moderation & Enforcement Policy

| Violation Type | First Offense | Second Offense | Third Offense |
|----------------|---------------|----------------|---------------|
| Prohibited item | Listing removed, warning | 7-day suspension | Permanent ban |
| Counterfeit | Listing removed, warning | 30-day suspension | Permanent ban |
| Harassment | Warning | 14-day suspension | Permanent ban |
| Payment circumvention | Warning | 30-day suspension | Permanent ban |
| Fraud (confirmed) | Immediate ban | — | — |

### 12.6 Support Staffing Model (V1)

| Role | Headcount | Coverage | Responsibilities |
|------|-----------|----------|------------------|
| Support L1 | 2 FTE | 12h/day (business hours) | Tickets, basic disputes, FAQ |
| Support L2 | 1 FTE | On-call | Complex disputes, escalations |
| Trust & Safety | 0.5 FTE | On-call | Fraud review, policy violations |

**Estimated Ticket Volume (at $100K GMV):**
- ~1,500 orders/month (avg $67/order)
- ~75 tickets/month (5% ticket rate)
- ~30 disputes/month (2% dispute rate)

### 12.7 Appeals Process

1. User submits appeal via support
2. Different agent reviews (not original reviewer)
3. Decision within 5 business days
4. Final decision communicated with rationale
5. No further appeals for same violation

---

## 13. Technical Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 16 (App Router) + React 19 | RSC, streaming, modern patterns |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Design system, rapid development |
| **Database** | Supabase (PostgreSQL) | RLS, real-time, managed |
| **Auth** | Supabase Auth | OAuth, sessions, email flows |
| **Storage** | Supabase Storage | CDN, image transforms |
| **Payments** | Stripe + Stripe Connect | Checkout, payouts, disputes |
| **Search** | PostgreSQL FTS (V1), Algolia (V2) | Scalable path |
| **i18n** | next-intl | Type-safe, message catalogs |
| **Testing** | Vitest + Playwright | Unit + E2E coverage |
| **Monitoring** | Sentry + Vercel Analytics | Errors, performance |
| **Hosting** | Vercel | Edge network, auto-scaling |

---

## 14. Key Decisions Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2026-01 | No COD support | Fraud risk, support burden, no protection possible | COD with verification |
| 2026-01 | Stripe Connect Express | Fast onboarding, KYC handled, lower friction | Standard accounts |
| 2026-01 | Buyer pays protection fee | Keeps seller fees low, maximizes supply | Seller pays, split fee |
| 2026-01 | 0% personal seller fee | Maximize supply, competitive advantage | Small fee (like eBay) |
| 2026-01 | Supabase for backend | PostgreSQL, RLS, real-time, good DX | Firebase, PlanetScale |
| 2026-01 | Server Components first | Performance, SEO, bundle size | Full client-side |
| 2026-01 | Multi-category approach | Broader market, network effects | Vertical focus (fashion-only) |

---

## 15. Glossary

| Term | Definition |
|------|------------|
| **C2C** | Consumer-to-Consumer (peer-to-peer selling) |
| **B2C** | Business-to-Consumer (professional sellers to individual buyers) |
| **GMV** | Gross Merchandise Value (total value of goods sold) |
| **RLS** | Row Level Security (database access control) |
| **PDP** | Product Detail Page |
| **Buyer Protection** | Escrow-style payment holding until delivery confirmed |
| **Stripe Connect** | Stripe's marketplace payment solution for multi-party transactions |

---

## See Also

- [REQUIREMENTS.md](../REQUIREMENTS.md) — Feature requirements & status
- [ARCHITECTURE.md](../ARCHITECTURE.md) — System design
- [PAYMENTS.md](./PAYMENTS.md) — Stripe integration details

---

*Last updated: 2026-02-01*

