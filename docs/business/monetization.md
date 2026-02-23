# Monetization Model — Treido

> How Treido makes money. Revenue streams, fee structure, unit economics.
> This doc owns the *business model*. For technical payment implementation, see `docs/features/checkout-payments.md`.

---

## Revenue Streams

Three primary streams, ordered by expected contribution at maturity:

### 1. Buyer Protection Fee (Primary)

Every sale on Treido incurs a buyer-side protection fee (% of sale price), charged ON TOP of the item price (Vinted model). Sellers receive 100% of their listed price minus only Stripe processing fees.

| Plan of *seller* | Buyer protection fee | Notes |
|------|-------|-------|
| Free | **[DECISION NEEDED]** (suggestion: 3% flat) | Standard rate for all buyers purchasing from free sellers |
| Pro | **[DECISION NEEDED]** (suggestion: 2.5-3% flat) | Could match free or be slightly lower |
| Business | **[DECISION NEEDED]** (suggestion: 2.5% flat) | Lowest — incentivizes upgrading |

**How it works (buyer-side fee model):**
- Seller lists item at €X
- Buyer sees: item price €X + buyer protection fee (e.g., 3% = €X × 0.03) + shipping
- Stripe processes total payment
- Treido takes buyer protection fee as revenue via Stripe Connect `application_fee_amount`
- Seller receives: item price − Stripe processing fee (~1.5% + €0.25 EU)
- **Key advantage:** Sellers see their full price — no "hidden" platform deductions

**Comparison to Vinted:** Vinted charges 5% + €0.70 fixed. Treido at 3% flat is significantly cheaper, especially on items under €50.

**Payout model:** **[DECISION NEEDED]**
- Option A: Direct payout after delivery confirmation (current leaning)
- Option B: Escrow — hold funds until buyer confirms receipt (safer, more complex)
- Option C: Hybrid — escrow for new sellers, direct for trusted sellers

### 2. Subscriptions (Secondary)

Monthly recurring revenue from Pro and Business tiers.

- See [plans-pricing.md](plans-pricing.md) for tier details and pricing
- Revenue = (Pro subscribers × Pro price) + (Business subscribers × Business price)
- Expected: small at launch, grows as seller base matures

### 3. Boosts (Tertiary)

One-time purchases for listing visibility upgrades.

| Boost Type | Duration | Price |
|------------|----------|-------|
| Standard | **[DECISION NEEDED]** (e.g., 7 days) | **[DECISION NEEDED]** (e.g., €1.99) |
| Premium | **[DECISION NEEDED]** (e.g., 30 days) | **[DECISION NEEDED]** (e.g., €4.99) |

**How boosts work:**
- Boosted listings appear higher in search/browse
- Visual badge indicates boost to buyers (trust signal)
- Plan tiers include free monthly boosts; extras purchasable
- Purchased via Stripe Checkout (one-time payment)

---

## Unit Economics

### Per-Transaction Economics (Example)

Assuming a €25 product sale, 3% buyer protection fee:

| Line item | Amount |
|-----------|--------|
| Item price | €25.00 |
| Buyer protection fee (3%) | +€0.75 |
| **Buyer pays total** | **€25.75** |
| Stripe fee on €25.75 (1.5% + €0.25) | −€0.64 |
| **Seller receives** | **€24.36** (item price − Stripe fee) |
| **Treido revenue** | **€0.75** |

Vinted comparison on same €25 item: buyer pays €25 + 5% + €0.70 = **€26.95** (Treido saves buyer €1.20)

### Revenue Projections

**[DECISION NEEDED]** — Fill in when pricing is decided:

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly active sellers | ? | ? | ? |
| Monthly transactions | ? | ? | ? |
| Avg transaction value (€) | ? | ? | ? |
| Transaction fee revenue | ? | ? | ? |
| Subscription revenue | ? | ? | ? |
| Boost revenue | ? | ? | ? |
| **Total MRR** | ? | ? | ? |

---

## Cost Structure

| Cost Category | Details |
|---------------|---------|
| **Stripe fees** | ~1.5% + €0.25 per transaction (EU cards), higher for non-EU |
| **Vercel hosting** | Pro plan ~$20/month, scales with traffic |
| **Supabase** | Pro plan ~$25/month, scales with DB/storage |
| **Domain** | treido.eu — ~€10/year |
| **AI costs** | OpenAI/Anthropic API for autofill (V2) |
| **Support** | Manual initially, then automated |

### Break-Even Analysis

**[DECISION NEEDED]** — Calculate when monthly revenue covers monthly costs.

Fixed monthly costs (estimated): ~€50-100/month at launch
Variable: Stripe fees scale with volume

---

## Future Revenue Opportunities (V2+)

- **Promoted search results** — sellers pay for top placement in search
- **Affiliate/referral program** — users earn credit for bringing new sellers
- **API access** — businesses integrate Treido listings into their own sites
- **International expansion fees** — multi-currency, multi-country
- **AI premium features** — advanced listing optimization, pricing suggestions

---

*Last updated: 2026-02-23*
*Status: Skeleton — awaiting pricing/fee decisions*
