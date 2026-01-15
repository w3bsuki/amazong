# Monetization Model (Treido.eu)

**Last updated:** 2026-01-14

Treido is launching in Bulgaria into a market where OLX.bg / Bazar.bg are **classifieds-first**: people browse → message → arrange shipping/payment between themselves.

This doc defines a monetization model that matches that reality:

- **V1 (classifieds-first):** monetize with **paid promotions** (boosts/featured), not commissions
- **V2 (payments):** add card payments + payouts (Stripe Connect), monetize with a clear fee model

Related:
- Scope contract: `docs/roadmap/v1.md`, `docs/roadmap/v2.md`
- Plan catalog: `docs/business/plans.md`

## Principles (non-negotiable)

- **Earn on value-add:** visibility, trust, convenience (not “tax the baseline” too early).
- **Simple pricing:** avoid stacking 3–4 hidden fees per action.
- **Phase-gated risk:** do not enable marketplace payouts without Stripe Connect readiness.
- **Prevent bypass:** if we charge on “checkout”, users will route around us unless the platform provides obvious buyer value.

## Revenue Streams (by phase)

### V1 Primary — Paid promotions

Users are already trained to pay for visibility (TOP/urgent/featured). This is the core V1 business model.

### V1 Optional — Subscriptions

Subscriptions should exist for:

- businesses that want `/dashboard`
- sellers that want included boosts + higher listing limits

Do not lead V1 with a complex tier ladder.

### V2 — Transaction fees (only when buyer pays on-platform)

If buyers pay by card on-platform, we can monetize per-transaction — but the model must be acceptable in Bulgaria.

## V1: Classifieds-First (Launch)

### What the product is

- Listing + discovery + chat
- Buyers/sellers arrange shipping & payment off-platform

### What we charge (V1)

- Paid promotions (boosts/featured placements)
- Optional subscriptions (mainly for business dashboards + included boosts)

### What we do NOT charge (V1)

- No final value fee / commission on sales (no on-platform payment)

### Promotions catalog (recommended SKUs)

Keep a small menu that matches OLX-style mental models:

| Product | Purpose | Duration | Price (EUR) | Notes |
|--------|---------|----------|-------------|------|
| Boost | Higher rank in search/category | 24h | €0.99 | Default “try it” upsell |
| Boost | Higher rank in search/category | 7d | €4.99 | Most common |
| Boost | Higher rank in search/category | 30d | €14.99 | Power sellers |
| Urgent badge | “urgent” trust/attention | 3d | €0.49 | Cosmetic + CTR |
| Category top | Slot on category page | 24h | €1.49 | Inventory-limited |
| Homepage featured | Slot on homepage | 24h | €2.99 | Inventory-limited |

Implementation note: V1 promotion payments can use Stripe Checkout without Stripe Connect, since no seller payouts exist.

## V2: Card Payments + Marketplace Payouts

### V2 goal

Enable **optional** on-platform payments that win on trust + convenience (not force).

### Recommended fee model (V2)

Choose **Buyer Protection Fee (Vinted-like)** as the default:

- **Seller fee:** 0% (seller receives full item price, minus any explicitly seller-paid services)
- **Buyer fee:** “Buyer Protection” fee for using checkout + dispute handling

Why this fits Bulgaria:

- Sellers are used to “free listings”; seller commissions are easy to bypass via chat.
- Buyers will pay if protection/convenience is clear (card payment, receipts, dispute path).

Recommended initial buyer fee:

- **4% + 1.00 BGN** (displayed transparently), **cap at 39 BGN**

This fee is sized to cover payment processing + support overhead on low-ticket items.

### How subscriptions fit V2

Subscriptions remain “tools + growth”:

- Included boosts/month
- Higher listing limits
- Business tooling (`/dashboard`)

Do not rely on “fee discount ladders” as the primary subscription value prop.

## Decisions & Open Questions

### Already agreed

- V1 launch mode is classifieds-first (see `GPT+OPUS/decisions/DEC-003-monetization-v1.md`).

### Must decide before enabling V2 checkout

- Buyer fee exact pricing and caps (test against local price sensitivity)
- Whether seller pays any portion of processing fees
- Category exceptions (e.g., very high-ticket items) and maximum fee caps
- Currency: display BGN with EUR equivalents where needed
