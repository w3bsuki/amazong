# DEC-003 — Launch Mode & Monetization v1 (Classifieds-first)

**Date**: 2026-01-13  
**Status**: 🟢 AGREED (Human confirmed)

## Context
Platform-facilitated checkout enforces commission only when buyers pay on-platform. Users can transact offline via chat. Stripe Connect (seller payouts) is not implemented (0 rows in payout status table). Shipping "full marketplace payouts" without Connect creates major compliance/ops risk.

## Decision (Launch Mode)
We launch **Mode A: Classifieds-first**:
- Core launch product: listings + search + category browse + chat.
- Monetization v1: **seller-paid promotions** (boosts/featured placements).
- We **defer buyer checkout + order/commission flows** until Stripe Connect is implemented and verified.

## Currency
- Keep payments in **EUR** (current Stripe implementation), but show **BGN equivalents** in UI where relevant (clearly labeled approximate).

## Monetization v1 Revenue Streams

### Primary: Paid Promotions
1. **Listing Boosts** — Promote listings higher in search results
   - 24 hours: €0.99
   - 7 days: €4.99
   - 30 days: €14.99
   
2. **Featured Placements** — Homepage/category page visibility
   - Pricing TBD based on demand

### Secondary (Deferred): Commission
- Commission on platform-facilitated checkout (deferred until Connect)
- Rates as defined in `subscription_plans` table when enabled

### Tertiary (Deferred): Subscriptions
- Keep subscription capability in codebase
- Do not lead with complex tier ladder at launch
- Enable after validating boost/promotion demand

## Consequences
- Lower compliance risk and faster launch.
- Validates market demand before adding marketplace payout complexity.
- "Buy on platform" becomes a post-launch milestone tied to Connect readiness.

## Post-Launch Roadmap
1. **Week 2-3**: Implement Stripe Connect Express
2. **Week 4**: Enable checkout with commission
3. **Week 5+**: Evaluate subscription tier activation based on seller feedback
