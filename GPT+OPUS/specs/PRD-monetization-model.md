# PRD: Treido Monetization Model

**Version**: Draft 0.1  
**Date**: January 13, 2026  
**Status**: 🟡 OPUS PROPOSING — Awaiting Codex Review

---

## 1. Executive Summary

Treido is a Bulgarian C2C marketplace competing with OLX.bg (free, ad-supported) and Bazar.bg (free). This document defines how Treido will generate revenue.

**Primary Revenue Streams**:
1. Final Value Fees (commission on sales)
2. Subscription Plans (monthly/yearly)
3. Listing Boosts (promoted listings)
4. Featured Placements (homepage/category visibility)

---

## 2. Market Context

### Bulgarian Market Realities
- Average salary: ~€800/month (~1,560 BGN)
- OLX.bg dominates with free listings, ad revenue
- Bazar.bg is free, smaller market share
- eBay model (commissions + subscriptions) unfamiliar locally

### Competitive Positioning
Treido differentiates on:
- Trust features (verification badges, seller ratings)
- Better UX (modern design, mobile-first)
- Business seller tools (inventory, analytics)
- Lower commission for subscribers

---

## 3. Revenue Model

### 3.1 Final Value Fee (Commission)

**When charged**: On successful sale (payment confirmed)

**Current Rates**:
| Tier | Commission |
|------|------------|
| Free | 12% |
| Plus | 10% |
| Pro | 8% |
| Power | 6% |
| Unlimited | 5% |
| Business tiers | 3-10% |

**Discussion Points for Codex**:
1. Is 12% too high for free tier in Bulgaria?
2. Should we cap commission at a maximum amount (e.g., €50)?
3. Should different categories have different rates?

### 3.2 Subscription Plans

**Current Structure**:

| Plan | Monthly | Yearly | Target User |
|------|---------|--------|-------------|
| Free | €0 | €0 | Casual sellers (1-5 items) |
| Plus | €9.99 | €99 | Active hobbyists (10-20 items) |
| Pro | €29.99 | €299 | Side-hustlers (50+ items) |
| Power | €59.99 | €599 | Power sellers |
| Unlimited | €149.99 | €1,499 | Full-time resellers |
| Business Starter | €49.99 | €499 | Small businesses |
| Business Pro | €99.99 | €999 | Medium businesses |
| Business Enterprise | €199.99 | €1,999 | Large operations |

**Discussion Points for Codex**:
1. €149.99/month = 9.6% of average Bulgarian salary—too expensive?
2. Should we have a "Pay as you go" option instead of subscriptions?
3. Are business tiers priced appropriately?

### 3.3 Listing Boosts

**Concept**: Sellers pay to promote listings higher in search results.

**Current Implementation**:
- `listing_boosts` table exists
- `products.is_boosted` + `boost_expires_at` fields exist
- No pricing defined yet

**Proposed Pricing**:
| Duration | Price |
|----------|-------|
| 24 hours | €0.99 |
| 7 days | €4.99 |
| 30 days | €14.99 |

**Discussion Points for Codex**:
1. Should boost pricing be category-dependent?
2. Should subscribers get free boosts included?

### 3.4 Featured Placements

**Concept**: Premium homepage and category page placements.

**Current State**:
- `products.is_featured` + `featured_until` fields exist
- No pricing or allocation system

**Proposed Model**:
- Auction-based for high-traffic slots
- Fixed price for guaranteed category placement
- Included in higher subscription tiers

---

## 4. Alternative Models Considered

### Model A: Pure Commission (No Subscriptions)
- **Pros**: Simpler, lower barrier to entry
- **Cons**: Less predictable revenue, no seller lock-in
- **Verdict**: Consider as fallback if subscriptions don't sell

### Model B: Freemium + Ads
- **Pros**: Works for OLX
- **Cons**: Ad revenue requires massive scale
- **Verdict**: Not viable at our current size

### Model C: Transaction Fee Only
- **Pros**: Fair—only pay when you sell
- **Cons**: No recurring revenue
- **Verdict**: Could combine with low subscription fee

---

## 5. Open Questions for Codex

1. **Pricing Strategy**: Should we enter market with aggressive low pricing, then raise later? Or establish premium positioning from start?

2. **Free Tier Limits**: Current free tier has no listing limit. Should we cap at 5-10 listings?

3. **Commission Cap**: Should we cap commission at a fixed amount (e.g., max €50 per sale) to attract high-value items?

4. **Currency**: We show EUR but Bulgaria uses BGN. Should pricing be in BGN with EUR equivalent?

5. **Launch Promotion**: Should we offer 3-6 months free Pro tier to early adopters?

---

## 6. Revenue Projections (Placeholder)

*To be completed after pricing decisions are finalized.*

| Scenario | Monthly Revenue | Assumptions |
|----------|-----------------|-------------|
| Conservative | €X | X sellers, Y% conversion |
| Base | €X | - |
| Optimistic | €X | - |

---

## 7. Next Steps

1. **Codex**: Review pricing, challenge assumptions
2. **Human**: Validate with Bulgarian market research
3. **Opus**: Implement agreed pricing in Stripe + Supabase
4. **Both**: Create launch promotion strategy

---

*This PRD will be updated based on Codex feedback and human input.*
