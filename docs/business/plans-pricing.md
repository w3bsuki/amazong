# Plans & Pricing — Treido

> Subscription tiers, feature gates, and pricing strategy.
> Source of truth for what each plan includes and costs.
> Technical implementation: Stripe Subscriptions via `docs/features/checkout-payments.md`.

---

## Tier Structure

Two account types × three plan levels = **6 tiers**.

### Personal Account Plans

For individuals selling personal items, secondhand goods, casual selling.

| Feature | Free | Plus | Pro |
|---------|------|------|-----|
| **Price** | €0 | **TBD** (~€2.99–4.99/mo) | **TBD** (~€6.99–9.99/mo) |
| Active listings | 30 | 150 | 500 |
| Seller fee | 0% | 0% | 0% |
| Buyer protection rate | 4% + €0.50 (cap €15) | 3.5% + €0.40 (cap €14) | 3% + €0.30 (cap €12) |
| Boost credits/month | 0 | 2× 24h | 5× 24h |
| Analytics | None | Basic | Full |
| Priority support | No | No | Yes |
| Badge | None | None | "Pro Seller" |

### Business Account Plans

For registered businesses, shops, professional sellers.

| Feature | Business Free | Business Pro | Business Enterprise |
|---------|--------------|-------------|---------------------|
| **Price** | €0 | **TBD** (~€9.99–14.99/mo) | **TBD** (~€24.99–29.99/mo) |
| Active listings | 100 | 2,000 | Unlimited |
| Seller fee | 1.5% | 1% | 0.5% |
| Buyer protection rate | 3% + €0.35 (cap €12) | 2.5% + €0.25 (cap €10) | 2% + €0.20 (cap €8) |
| Boost credits/month | 0 | 20× 24h | 50× 24h |
| `/dashboard` access | No | Yes | Yes (full) |
| Team seats | — | Up to 3 | Unlimited |
| Analytics | None | Full | Full + export |
| Priority support | No | Yes | Yes + dedicated |
| Badge | None | "Business" | "Verified Business" |

---

## Pricing Strategy

### Model: Hybrid Buyer Protection

Revenue comes primarily from **buyer protection fees**, not seller commissions. Personal sellers pay 0%. This removes incentive to take deals off-platform (the #1 failure mode of C2C marketplaces that charge seller commissions).

Subscriptions are the **secondary** revenue stream. They unlock:
- More listings
- Lower buyer protection fees (making the seller's items cheaper for buyers)
- Boost credits
- Professional tools (dashboard, analytics, team seats)

### Pricing Principles

1. **Free must be useful.** 30 personal listings or 100 business listings is enough to start. This is how OLX wins — free access. We can't compete without it.
2. **Paid plans reduce buyer fees.** The #1 subscription incentive: upgrading makes your items cost less for buyers (lower buyer protection %). Unique and powerful.
3. **Business tiers replace Shopify.** Stefan pays ~€36/month for Shopify. Our Business Pro at ~€14.99 with comparable value (storefront + payments + dashboard) is a clear win.
4. **Bulgaria pricing.** Lower purchasing power than Western EU. Keep personal plans under €10, business plans under €30.

### Competitor Reference

| Platform | Model | Our Advantage |
|----------|-------|---------------|
| OLX Bulgaria | Paid listing packages, promoted listings. No payments. | We have payments + free listings up to 30 |
| Bazar.bg | Free listings, VIP packages. No payments. | Modern UX + integrated payments |
| Vinted | 5% + €0.70 buyer protection. Fashion only. | General marketplace, lower buyer fees |
| Facebook Marketplace | Free, no checkout (BG). | Real checkout + tracking |
| Shopify | €36/mo + 2% transaction. | Cheaper, marketplace traffic included |
| Etsy | €0.18/listing + 6.5% + 3% payment. | 0% personal seller fee |

---

## Feature Gates

Features gated by plan tier in the database (`subscription_plans` table).

**How it works:**
- Plan tier stored on user profile
- Server actions check tier before gated operations
- Client shows upgrade prompts for gated features
- Stripe Customer Portal for plan management
- Fee components stored on order at purchase time (no retroactive changes)

---

## Billing

| Aspect | Decision |
|--------|----------|
| Cycle | Monthly (annual TBD — if offered, ~20% discount) |
| Payment | Stripe Checkout → Subscription |
| Cancellation | Access until end of billing period |
| Upgrade/downgrade | Prorated via Stripe |
| Trial | **TBD** (suggestion: 14-day Pro trial for new users) |
| Currency | EUR (Stripe) |

---

## Open Questions

| ID | Question | Status |
|----|----------|--------|
| PLAN-001 | Exact monthly price per paid tier | Undecided — needs market testing |
| PLAN-002 | Annual billing discount | Undecided — suggest 20% |
| PLAN-003 | Free trial duration and tier | Undecided — suggest 14-day Pro |
| PLAN-004 | AI autofill (which tiers?) | Deferred to V2 |

---

*Last updated: 2026-02-23*
*Status: Tier structure and limits decided. Subscription prices pending market testing.*
