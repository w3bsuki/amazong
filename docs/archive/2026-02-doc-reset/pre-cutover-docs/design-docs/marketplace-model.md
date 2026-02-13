# Marketplace Model — Why C2C + Light B2B

> Design decision: Treido's marketplace model and fee structure.

| Status | Verified |
|--------|----------|
| Date | 2026-02-12 |

---

## Context

Treido is a consumer-to-consumer marketplace with optional business seller features.
The model is inspired by Vinted / Wallapop with Bulgarian market specifics.

## Decision

- **Primary model:** C2C (any user can sell after completing onboarding)
- **Business extension:** Business accounts with VAT handling, bulk listings
- **Fee model:** Vinted-style hybrid
  - Buyer protection fee (charged to buyer at checkout)
  - Optional seller fees for premium placement / boosts
  - Subscription tiers for power sellers (Starter, Premium)
- **Currency:** EUR primary, BGN display-only

## Alternatives Considered

- Pure C2C (no business): Too limiting for growth
- Commission-based (take % from sellers): Harder adoption in price-sensitive market
- Listing fees: Creates friction for casual sellers

## Consequences

- Need Stripe Connect for marketplace payouts
- Escrow pattern required for buyer protection
- Subscription system adds complexity but enables monetization without per-sale fees
- Business accounts need VAT invoice generation (future)

---

*Last updated: 2026-02-12*
