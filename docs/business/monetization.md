# Monetization Model — Treido

> How Treido makes money. Revenue streams, fee structure, unit economics.
> For technical payment implementation, see `docs/features/checkout-payments.md`.

---

## Model: Hybrid Buyer Protection

Treido uses a **buyer-funded** model (Vinted-style), adapted for a general marketplace with business sellers:

- **Buyers** pay a transparent Buyer Protection fee on every purchase (primary revenue)
- **Personal sellers** pay **0% seller fee** — they keep 100% of the item price
- **Business sellers** pay a small seller fee (0.5–1.5% depending on plan)
- **Escrow payout**: funds release to seller only after delivery confirmation or dispute resolution

**Why this model:**
- Seller commissions in C2C are routinely bypassed (sellers take deals off-platform) → 0% personal seller fee removes that incentive
- Buyers accept a protection fee when the value is clear (escrow + dispute handling + refund guarantee)
- Businesses can justify fees against the professional tooling they get (dashboard, analytics, team seats)

---

## Revenue Streams

Three streams, ordered by expected contribution:

### 1. Buyer Protection Fees (Primary)

Every purchase includes a buyer protection fee, shown transparently at checkout.

**Formula:**
```
buyer_fee = min(item_price × rate% + fixed_fee, cap)
```

**Fee table (plan-driven):**

| Account | Plan | Seller Fee | Buyer Protection |
|--------:|------|-----------|------------------|
| Personal | Free | 0% | 4% + €0.50 (cap €15) |
| Personal | Plus | 0% | 3.5% + €0.40 (cap €14) |
| Personal | Pro | 0% | 3% + €0.30 (cap €12) |
| Business | Free | 1.5% | 3% + €0.35 (cap €12) |
| Business | Pro | 1% | 2.5% + €0.25 (cap €10) |
| Business | Enterprise | 0.5% | 2% + €0.20 (cap €8) |

Fees are **DB-configured** (`subscription_plans` table). Runtime: `getFeesForSeller()` + `calculateTransactionFees()` in `lib/stripe-connect.ts`. Never hardcode fees.

### 2. Subscriptions (Secondary)

Monthly recurring revenue from paid plan tiers.

- Personal: Plus, Pro (prices TBD — est. €2.99–9.99/mo)
- Business: Pro, Enterprise (prices TBD — est. €9.99–29.99/mo)
- Free tiers for both account types (no subscription cost)
- See [plans-pricing.md](plans-pricing.md) for full tier details

### 3. Boosts (Tertiary)

One-time purchases for listing visibility.

| SKU | Duration | Price |
|-----|----------|-------|
| `boost_24h` | 24 hours | €0.99 |
| `boost_7d` | 7 days | €4.99 |
| `boost_30d` | 30 days | €14.99 |

- Boosted listings appear before non-boosted in feeds/search
- Must be labeled ("Boosted" / "Ad")
- Plans include free monthly boost credits (24h boosts only)
- One active boost per listing maximum
- Purchased via Stripe Checkout (one-time payment)

---

## Payout Model: Escrow

**Separate Charges and Transfers** (Stripe pattern):

1. Buyer pays platform Stripe account (item price + buyer protection fee)
2. Funds held in escrow
3. Seller ships with tracking
4. Delivery confirmed → 72h auto-confirm window → funds released to seller
5. If buyer disputes within 72h → funds held until resolution

**Key windows:**

| Window | Duration |
|--------|----------|
| Ship-by deadline | 7 days (or buyer can cancel + refund) |
| Auto-confirm after delivery | 72 hours |
| Dispute window after delivery | 72 hours |
| Seller response SLA | 48 hours with evidence |

**Refund includes buyer protection fee** when refund is due to seller fault.

---

## Unit Economics

### Example: Personal Free, €50 item

| Line Item | Amount |
|-----------|--------|
| Item price | €50.00 |
| Buyer protection (4% + €0.50) | +€2.50 |
| **Buyer pays** | **€52.50** |
| Stripe processing (~1.5% + €0.25) | −€1.04 |
| **Treido net revenue** | **€1.46** |
| **Seller receives** | **€50.00** |

### Example: Business Pro, €100 item

| Line Item | Amount |
|-----------|--------|
| Item price | €100.00 |
| Buyer protection (2.5% + €0.25) | +€2.75 |
| **Buyer pays** | **€102.75** |
| Business seller fee (1%) | −€1.00 |
| Stripe processing (~1.5% + €0.25) | −€1.79 |
| **Treido net revenue** | **€1.96** |
| **Seller receives** | **€99.00** |

### Contribution Margin (per transaction)

```
contribution = buyer_fee + seller_fee − stripe_cost − refunds_loss − support_allocation
```

### Cost Structure

| Category | Amount | Type |
|----------|--------|------|
| Stripe processing | ~1.5% + €0.25/tx (EU cards) | Variable |
| Vercel hosting | ~$20/month | Fixed |
| Supabase | ~$25/month | Fixed |
| Domain (treido.eu) | ~€10/year | Fixed |
| **Total fixed monthly** | **~€50–100** | Fixed |

### Break-Even

At ~€50 fixed monthly costs and ~€1.50 net per transaction:
- **~34 transactions/month** to cover infrastructure
- Subscription revenue reduces this further

---

## Future Revenue (V2+)

- Promoted search results (paid top placement)
- Referral program (credit for bringing sellers)
- API access (businesses embed Treido listings)
- AI premium features (listing optimization, pricing suggestions)
- International expansion (multi-currency, multi-country)

---

## Open Questions

| ID | Question | Status |
|----|----------|--------|
| MON-001 | Subscription prices per tier | Undecided — needs market testing |
| MON-002 | Currency display: EUR only or EUR + BGN? | Undecided |
| MON-003 | Annual billing discount? | Undecided — suggest 20% |

---

*Last updated: 2026-02-23*
*Status: Core model decided. Subscription prices pending.*
