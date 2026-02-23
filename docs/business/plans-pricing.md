# Plans & Pricing — Treido

> Subscription tiers, feature gates, and pricing strategy.
> Source of truth for what each plan includes and what it costs.
> Technical implementation: Stripe Subscriptions via `docs/features/checkout-payments.md`.

---

## Open Decisions

These correspond to PRD open questions OPEN-001 and OPEN-006:

- **[DECISION NEEDED]** Monthly price for each tier (EUR)
- **[DECISION NEEDED]** Transaction fee % per tier
- **[DECISION NEEDED]** Listing limits per tier
- **[DECISION NEEDED]** Boost allocation per tier
- **[DECISION NEEDED]** Annual billing discount (if any)

---

## Tier Structure

Three tiers. Free gets people in. Pro converts serious sellers. Business serves shops.

### Free Tier

**Target:** Casual sellers (Maria persona). List a few items, try the platform.

| Feature | Limit |
|---------|-------|
| Active listings | **[DECISION NEEDED]** (suggestion: 50) |
| Buyer protection fee | **[DECISION NEEDED]** (suggestion: 3% flat — charged to buyer, not seller) |
| Boosts included | 0 |
| AI autofill | No |
| Analytics | Basic (views only) |
| Support | Community / self-serve |
| Badge | None |

### Pro Tier

**Target:** Regular sellers, side-hustlers. Enough volume to justify a monthly fee.

| Feature | Limit |
|---------|-------|
| Price | **[DECISION NEEDED]** €/month (suggestion: €4.99-9.99) |
| Active listings | **[DECISION NEEDED]** (suggestion: 50-100) |
| Buyer protection fee | **[DECISION NEEDED]** (suggestion: 2.5-3% flat — charged to buyer) |
| Boosts included | **[DECISION NEEDED]** (suggestion: 3-5/month) |
| AI autofill | Yes |
| Analytics | Full (views, clicks, conversion) |
| Support | Priority email |
| Badge | "Pro Seller" |

### Business Tier

**Target:** Small businesses (Stefan persona). Full Shopify-like backend.

| Feature | Limit |
|---------|-------|
| Price | **[DECISION NEEDED]** €/month (suggestion: €14.99-29.99) |
| Active listings | **[DECISION NEEDED]** (suggestion: 500-unlimited) |
| Buyer protection fee | **[DECISION NEEDED]** (suggestion: 2.5% flat — charged to buyer, lowest tier) |
| Boosts included | **[DECISION NEEDED]** (suggestion: 10-20/month) |
| AI autofill | Yes + batch mode |
| Analytics | Full + export |
| Dashboard | Full business dashboard |
| Support | Priority + chat |
| Badge | "Verified Business" |
| Custom URL | `/[business-name]` storefront |

---

## Pricing Strategy

### Principles

1. **Free must be useful.** People need to sell at least a few items without paying. This is how OLX wins — free listings. We can't compete without a free tier.
2. **Pro must feel worth it.** The gap between free and pro should be clear: more listings, lower fees, boosts, AI. The monthly cost should be recoverable from 1-2 sales.
3. **Business must replace Shopify.** Stefan pays €30+/month for Shopify. We should be cheaper with comparable value for his use case (no custom themes, but real storefront + payments).
4. **Buyer protection fees fund operations.** Every sale generates revenue via a buyer-side fee (Vinted model). Free sellers still produce revenue per transaction. This is better than seller-side fees for growth — sellers see 100% of their price, buyers accept small protection fee for payment security.

### Reference: Competitor Pricing

| Platform | Model |
|----------|-------|
| OLX Bulgaria | Limited free listings per subcategory (some categories: 1/year for business). Paid listing packages when limit exhausted. Promoted/VIP listings. No transaction fees. |
| Bazar.bg | Free listings (more generous limits), VIP packages, promoted listings. No transaction fees. |
| Vinted | Free to list, **5% + €0.70** buyer protection fee (buyer-side). Effective rate ~8.5% on €20 items, ~6% on €50 items, drops toward 5% on expensive items. Items >€500: ~2% + fixed fee. |
| Facebook Marketplace | Free to list (in BG: no checkout, no fees) |
| Shopify | €36/month (Basic), 2% transaction fee |
| Etsy | €0.18/listing + 6.5% transaction + 3% payment |

### Pricing Tensions

- Too high free-tier fees → nobody lists → marketplace is empty → no buyers
- Too low pro fees → no revenue → can't sustain
- Too generous free tier → no reason to upgrade → no subscription revenue
- Bulgaria market has lower purchasing power than Western EU → price accordingly

---

## Feature Gate Implementation

Features are gated by plan tier in the database. The `plans` table stores tier → feature mapping.

**How it works in code:**
- Plan tier stored on user profile
- Server actions check tier before allowing gated operations
- Client shows upgrade prompts for gated features
- Stripe Customer Portal for plan management

**See:** `docs/features/checkout-payments.md` for technical implementation.

---

## Billing

- **Billing cycle:** Monthly (annual TBD)
- **Payment method:** Stripe Checkout → Subscription
- **Cancellation:** Immediate access until end of billing period
- **Upgrade/downgrade:** Prorated via Stripe
- **Trial:** **[DECISION NEEDED]** (suggestion: 14-day Pro trial for new users)

---

*Last updated: 2026-02-23*
*Status: Skeleton — awaiting pricing decisions*
