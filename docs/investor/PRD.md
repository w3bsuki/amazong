# 📋 AMAZONG: Product Requirements Document (PRD)
> **Version:** 1.0  
> **Last Updated:** December 2024  
> **Status:** For Investor Review

---

## 1. Executive Summary

**Amazong** is a hybrid B2C/C2C e-commerce marketplace designed for the Bulgarian market. We combine the **trust and reliability** of eMag with the **community and accessibility** of OLX, while adding unique differentiators: **AI-powered engagement** ("Nano Banana") and **integrated charity commerce** ("Karma Commerce").

### The Opportunity
*   **Market Size:** €2.34 Billion (2024), growing 15-20% YoY
*   **Gap:** No platform effectively serves both individual sellers AND small businesses with low fees and high trust
*   **Target:** Capture 3-5% market share (€70-117M GMV) within 3 years

---

## 2. Problem Statement

### For Sellers
| Segment | Current Pain Points |
|:--------|:--------------------|
| **Individuals** | OLX/Facebook has no payment protection → high fraud risk. No professional storefront. |
| **Small Businesses** | eMag charges 15-20% commission + €29/mo fees. Too expensive for low-margin goods. |
| **Craftspeople** | No local Etsy equivalent. Forced to use Instagram/Facebook with no checkout. |

### For Buyers
| Segment | Current Pain Points |
|:--------|:--------------------|
| **Trust-Seekers** | OLX/Bazar feels "sketchy." No verified sellers, no escrow. |
| **Value-Seekers** | eMag dominated by big brands. Hard to find local/unique products. |
| **Eco-Conscious** | No platform promotes second-hand or charity-linked commerce. |

---

## 3. Target Users

### 3.1 Primary Personas

#### Seller Persona 1: "The Attic Alchemist" (Individual)
*   **Demographics:** 22-35 y/o, urban, tech-savvy
*   **Motivation:** Cash out unused items (clothes, electronics, furniture)
*   **Current Behavior:** Uses OLX but frustrated by scams and haggling
*   **Needs:** Simple listing, secure payment, fair fees

#### Seller Persona 2: "The Local Hero" (Small Business)
*   **Demographics:** 35-55 y/o, owns a small shop (pet store, boutique, crafts)
*   **Motivation:** Expand to online without massive investment
*   **Current Behavior:** Uses Facebook Page or struggles on eMag
*   **Needs:** Low commission, verified badge, professional storefront

#### Buyer Persona 1: "The Deal Hunter" (Gen Z)
*   **Demographics:** 18-28 y/o, mobile-first, social-media native
*   **Motivation:** Find unique/trendy items cheap
*   **Current Behavior:** Scrolls TikTok for inspiration, uses Temu/Shein
*   **Needs:** Fun discovery experience, fast checkout, quick shipping

#### Buyer Persona 2: "The Conscious Consumer" (Millennial)
*   **Demographics:** 28-42 y/o, values sustainability
*   **Motivation:** Support local, reduce waste, give to causes
*   **Current Behavior:** Prefers buying second-hand but hates the hassle
*   **Needs:** Trust, transparency, feel-good commerce

---

## 4. Product Vision & Goals

### Vision Statement
> "To become Bulgaria's most trusted and engaging marketplace where every transaction creates value—for sellers, buyers, and the community."

### North Star Metric
**Gross Merchandise Value (GMV)** — Total value of goods sold through the platform.

### Success Metrics (Year 1)

| Metric | Target | Rationale |
|:-------|:-------|:----------|
| **GMV** | €2.5M | ~0.1% market share, proves viability |
| **Verified Sellers** | 500 | Critical mass for category coverage |
| **MAU (Buyers)** | 25,000 | Sustainable demand for seller retention |
| **Repeat Purchase Rate** | 30% | Indicates trust and stickiness |
| **CAC** | <€15 | Must beat industry avg of €29 to be viable |

---

## 5. Feature Specifications

### 5.1 MVP Features (Version 1.0) — Launch

| Feature | Description | Priority |
|:--------|:------------|:---------|
| **User Auth** | Email/password + Google OAuth. Email verification. | P0 |
| **Seller Onboarding** | Create account → Verify identity (optional for "Verified" badge) → Create storefront | P0 |
| **Product Listing** | Title, description, category, price, images (up to 10), tags, condition (new/used) | P0 |
| **Product Discovery** | Category browse, search (full-text), filters (price, condition, location) | P0 |
| **Shopping Cart** | Add/remove items, quantity, saved cart | P0 |
| **Checkout & Payment** | Stripe integration (Credit/Debit, Apple Pay, Google Pay). Escrow-style hold. | P0 |
| **Order Management** | Buyer: order history, tracking. Seller: order dashboard, fulfillment status. | P0 |
| **Reviews & Ratings** | Post-purchase ratings (1-5 stars) for both product and seller | P0 |
| **Seller Tiers** | Basic (Free, 10%), Premium (€9.99/mo, 7%), Business (€29.99/mo, 5%) | P0 |
| **Boosted Listings** | Pay to feature product in "Recommended" section | P1 |
| **Wishlist** | Save products for later | P1 |
| **Messaging** | In-app buyer↔seller chat | P1 |

### 5.2 V2 Features (Post-Launch, 6-12 Months)

| Feature | Description | Priority |
|:--------|:------------|:---------|
| **Karma Commerce** | Sellers toggle charity % per listing. Buyer sees impact ("This purchase fed 2 shelter dogs"). | P0 |
| **Verified Sellers** | ID verification + business registration for "Local Hero" badge | P0 |
| **Advanced Analytics** | Seller dashboard with views, conversion rate, top products | P1 |
| **Bulk Listing Tools** | CSV upload for inventory | P1 |
| **API Access** | For Business tier sellers to sync with POS/ERP | P2 |
| **Mobile Apps** | iOS + Android native apps | P1 |
| **"Nano Banana" AI** | AI-generated product descriptions, smart pricing suggestions | P2 |

---

## 6. Technical Architecture (High-Level)

### 6.1 Stack Overview
| Layer | Technology |
|:------|:-----------|
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Shadcn/UI |
| **Backend** | Next.js API Routes + Supabase (PostgreSQL, Auth, Storage) |
| **Payments** | Stripe Connect (Marketplace mode with escrow) |
| **Hosting** | Vercel (Frontend) + Supabase Cloud (Backend) |
| **CDN/Images** | Supabase Storage + Cloudflare CDN |
| **Analytics** | PostHog (self-hosted) or Mixpanel |
| **Monitoring** | Sentry (Error Tracking), Vercel Analytics |

### 6.2 Key Database Entities
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    users     │    │   sellers    │    │   products   │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ id           │───<│ user_id      │───<│ seller_id    │
│ email        │    │ tier         │    │ title        │
│ display_name │    │ commission   │    │ price        │
│ avatar_url   │    │ verified     │    │ category_id  │
│ created_at   │    │ store_name   │    │ condition    │
└──────────────┘    │ store_url    │    │ tags[]       │
                    └──────────────┘    │ images[]     │
                                        │ charity_%    │
                                        └──────────────┘
```

### 6.3 Security & Compliance
*   **GDPR Compliant:** Data stored in EU (Supabase EU region). User data deletion on request.
*   **PCI DSS:** Stripe handles all card data. No card numbers stored on our servers.
*   **Row-Level Security (RLS):** Supabase RLS policies enforce data isolation.

---

## 7. Go-to-Market Summary
*See `LAUNCH_ROADMAP.md` for detailed phasing.*

*   **Phase 1 (Months 1-3):** "Soft Open" — Invite-only seller onboarding (500 target). No paid marketing.
*   **Phase 2 (Months 4-6):** "Nano Explosion" — Activate AI content engine, influencer campaigns.
*   **Phase 3 (Months 7-12):** "Trust Seal" — Push Karma Commerce, PR for social impact.

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|:-----|:-----------|:-------|:-----------|
| **Low Seller Adoption** | Medium | High | "0% Commission for 6mo" launch offer |
| **Fraud/Disputes** | Medium | High | Stripe dispute handling + escrow release rules |
| **eMag Competitive Response** | Low | Medium | Focus on niches (used goods, local crafts) they ignore |
| **Technical Scalability** | Low | Medium | Supabase + Vercel auto-scale; load testing pre-launch |

---

## 9. Open Questions (For Investor Discussion)

1.  **Charity Partner Selection:** Should we launch with 1 flagship partner (e.g., Animal Rescue Sofia) or multiple category-specific partners?
2.  **Geographic Scope:** Focus solely on Bulgaria first, or include neighboring markets (North Macedonia, Serbia)?
3.  **Mobile App Timing:** Prioritize native apps for V2, or focus on PWA for cost efficiency?

---

**Document Owner:** [Founder Name]  
**Reviewers:** [Investor Name], [Advisor Name]
