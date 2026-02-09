# Monetization

## Goal

Generate sustainable platform revenue through a Vinted-style hybrid fee model: personal sellers keep 100% of the item price while buyers pay a transparent Buyer Protection fee; business sellers pay a small commission that decreases with higher subscription tiers. Secondary revenue comes from subscriptions and optional listing boosts.

## Current Status

- Requirements: 11/12 complete (R6: 6/6 + R14: 5/6) — see REQUIREMENTS.md §R6, §R14
- Production: 🟡 Partial — analytics dashboard in progress

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| **R6: Stripe Connect / Payouts** | | |
| R6.1 | Connect onboarding flow | ✅ |
| R6.2 | Individual accounts | ✅ |
| R6.3 | Business accounts | ✅ |
| R6.4 | Payout eligibility gating | ✅ |
| R6.5 | Payout status display | ✅ |
| R6.6 | Delayed payout release (escrow) | ✅ |
| **R14: Business Dashboard** | | |
| R14.1 | Dashboard access gating | ✅ |
| R14.2 | Business profile setup | ✅ |
| R14.3 | Business listings view | ✅ |
| R14.4 | Business orders view | ✅ |
| R14.5 | Analytics dashboard | 🟡 In progress (basic) |
| R14.6 | Subscription management | ✅ |

## Implementation Notes

### Fee Model

**Buyer Protection fee** (charged to buyer, per order):

```
buyer_fee = min(item_price × percent + fixed, cap)
```

**Seller fee** (business accounts only):

```
seller_fee = item_price × seller_fee_percent
```

### Fee Table (locked for V1)

| Account | Plan | Seller Fee | Buyer Protection |
|---------|------|------------|------------------|
| Personal | Free | 0% | 4% + €0.50 (cap €15) |
| Personal | Plus | 0% | 3.5% + €0.40 (cap €14) |
| Personal | Pro | 0% | 3% + €0.30 (cap €12) |
| Business | Free | 1.5% | 3% + €0.35 (cap €12) |
| Business | Pro | 1% | 2.5% + €0.25 (cap €10) |
| Business | Enterprise | 0.5% | 2% + €0.20 (cap €8) |

**Source of truth:** `supabase/migrations/20260120000000_buyer_protection_fees.sql`

### Worked Example (€50 item, Personal Free seller)

- Buyer pays: `€50 + (4% × €50) + €0.50 = €52.50`
- Seller receives: `€50.00` (0% seller fee)
- Platform collects: `€2.50` (covers Stripe processing + support + fraud loss buffer)

### Revenue Streams

1. **Buyer Protection fees** — primary; scales with GMV
2. **Subscriptions** — stabilizes revenue; see [plans.md](./plans.md) for tier details
3. **Boosts / Promotions** — optional a-la-carte visibility boosts (24h / 7d / 30d)

### Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/dashboard` | (business) | business | Dashboard home |
| `/dashboard/accounting` | (business) | business | Accounting / finances |
| `/dashboard/analytics` | (business) | business | Business analytics |
| `/dashboard/customers` | (business) | business | Customer management |
| `/dashboard/discounts` | (business) | business | Discount management |
| `/dashboard/inventory` | (business) | business | Inventory management |
| `/dashboard/marketing` | (business) | business | Marketing tools |
| `/dashboard/orders` | (business) | business | Order management |
| `/dashboard/orders/:orderId` | (business) | business | Order detail |
| `/dashboard/products` | (business) | business | Product management |
| `/dashboard/products/:id/edit` | (business) | business | Edit product |
| `/dashboard/settings` | (business) | business | Business settings |
| `/dashboard/upgrade` | (business) | business | Upgrade plan |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/boost/checkout` | POST | Boost product checkout session |
| `/api/connect/onboarding` | POST | Stripe Connect onboarding |
| `/api/connect/dashboard` | POST | Stripe Connect dashboard link |
| `/api/connect/webhook` | POST | Connect webhook |
| `/api/subscriptions/checkout` | POST | Subscription checkout |
| `/api/subscriptions/portal` | POST | Billing portal link |
| `/api/subscriptions/webhook` | POST | Subscriptions webhook |
| `/api/sales/export` | GET | Export sales data (CSV) |

### Server Actions

- `boosts.ts` — Product boost creation and management
- `subscriptions.ts` — Subscription lifecycle

### DB Tables

| Table | Purpose |
|-------|---------|
| `subscription_plans` | Tier definitions (free → enterprise) with Stripe Price IDs, fee percentages, listing limits |
| `subscriptions` | Active seller subscriptions with billing period, Stripe subscription ID |
| `listing_boosts` | Paid promotions with boost type, duration, and Stripe session |
| `private_profiles` | Stripe customer ID, VAT number, business details |

### Cron Jobs

- `expire-boosts` — Daily job to expire listing boosts past their end date

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| R14.5: Analytics dashboard | 🟡 In progress | Basic metrics visible; advanced analytics (conversion, GMV, cohort) deferred |
| Boost pricing finalization | 🟡 Pending | 24h/7d/30d pricing and credit allocations per plan need business sign-off |
| Team seats | ⬜ Deferred | Business Enterprise feature — not implemented |
| API access | ⬜ Deferred | Business Enterprise feature — not implemented |
| Tax/invoicing automation | ⬜ Deferred | Manual process for V1; automated VAT invoicing deferred |

## Cross-References

- [PAYMENTS.md](../PAYMENTS.md) — Stripe Connect, escrow lifecycle, webhook processing, payout release rules
- [plans.md](./plans.md) — Subscription tier details, pricing, listing limits
- [DATABASE.md](../DATABASE.md) — subscription_plans, subscriptions, listing_boosts tables
- [PRD.md](../PRD.md) §5.1–5.6 — Business model, fee formulas, unit economics
- `docs/business/monetization.mdx` — Detailed monetization model rationale (includes plan pricing)

---

*Last updated: 2026-02-08*
