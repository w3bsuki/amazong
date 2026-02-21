# Product Context

> What Treido is, who it's for, what ships at V1.
> For full product spec with competitive analysis and future roadmap: `docs/archive/PRD-full.md`

---

## What Treido Is

A marketplace where individuals and businesses buy and sell products with secure card payments. Runs at treido.eu. Anyone can list something for sale. Businesses get a Shopify-like backend without needing developers.

**Currency:** EUR · **Languages:** English, Bulgarian · **Hosting:** Vercel

### What Makes It Different

1. **Secure payments.** Stripe card payments — no cash scams, no failed pickups.
2. **Business backend without Shopify.** Full dashboard (products, orders, analytics) with Treido as the storefront.
3. **AI-first future.** Photo → auto-fill listing in 10 seconds. AI shopping agents. (V2+)
4. **Premium UX.** Calm, scannable, touch-confident. Modal browsing on desktop.
5. **EU-native.** EUR, GDPR, multi-language. Launching Bulgaria, expanding Europe.

### Brand Personality

Premium & Clean. Feels like Stripe meets a modern marketplace — calm confidence, not visual noise. Trust, simplicity, professionalism. NOT playful (Vinted), NOT dense (Amazon), NOT cluttered (OLX).

---

## Users

| Persona | Need | Frustration |
|---------|------|-------------|
| **Casual seller** (Maria, 22) | List items fast on phone, get paid | OLX has no card payments, buyers flake |
| **Small business** (Stefan, 38) | Online storefront without Shopify + dev | Can't afford separate website |
| **Buyer** (Ivan, 28) | Find deals, pay with card, get order tracking | No checkout flow on OLX/Facebook |

---

## Core Journeys

**Browse → Buy:** Homepage/search → product modal (desktop) or PDP (mobile) → cart → checkout (auth required) → Stripe payment → order confirmation → track → receive → review.

**List an Item:** Click "Sell" → upload photos → title, description, category (L1→L4), price, condition → publish. Target: under 2 minutes.

**Business Setup:** Sign up → business account type → business profile → connect Stripe → dashboard → add products → manage orders.

**Order Lifecycle:** `pending` → `confirmed` (seller) → `shipped` (seller + tracking) → `delivered` (buyer) → `completed` (payout). Auto-complete after 14 days if buyer silent.

---

## Revenue Model

| Stream | How |
|--------|-----|
| **Subscriptions** | Free/Pro/Business tiers. Higher tier = more listings, boosts, AI features, lower fees. |
| **Transaction fees** | % of each sale via Stripe Connect. Rate varies by plan tier. DB-configured, not hardcoded. |
| **Boosts** | Paid listing visibility upgrades purchased via Stripe Checkout. |

**Payouts:** Stripe Connect Express. Direct payout after delivery.

---

## V1 Feature Inventory

Auth · Onboarding · Browsing + Search + Filters · PDP · Sell flow · Cart + Wishlist · Checkout + Stripe payments · Orders · Chat · Plans + Subscriptions · Boosts · Reviews · Public profiles · Business dashboard · Admin panel · i18n (en/bg).

## Glossary

| Term | Meaning |
|------|---------|
| **listing** | Product posted for sale |
| **PDP** | Product Detail Page |
| **envelope** | Standard `{ data, error }` return from server actions |
| **boost** | Paid visibility upgrade |
| **payout** | Money sent to seller (vs "payment" = buyer pays) |
| **dashboard** | Business seller interface at `/dashboard` |

---

*Last verified: 2026-02-21*
