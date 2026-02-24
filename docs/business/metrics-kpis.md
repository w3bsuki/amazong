# Metrics & KPIs — Treido

> How we measure success. What numbers matter, what targets to hit.

---

## North Star Metric

**Completed transactions per month.**

This proves supply (sellers listing), demand (buyers buying), infrastructure (payments working), and retention (both sides returning).

---

## Buyer Funnel KPIs

| Stage | Metric | Definition | Beta Target | Launch Target |
|------:|--------|-----------|-------------|---------------|
| Awareness | Sessions | Unique visits | Track | Track |
| Intent | Search rate | % sessions that search | Track | Track |
| Consideration | PDP views | Product detail page views | Track | Track |
| Conversion | Checkout start rate | Checkout starts / PDP views | 1–3% | 2–5% |
| Payment | Paid conversion | Paid orders / checkout starts | Track | Track |
| Fulfillment | Delivered rate | Delivered / paid | >90% | >95% |
| Success | Completion rate | Completed / paid | >85% | >90% |

## Seller Supply KPIs

| Metric | Definition | Beta Target | Launch Target |
|--------|-----------|-------------|---------------|
| Active listings | Live listings on platform | 100+ | 1,000+ |
| New listings/week | Created per week | 20+ | 100+ |
| Seller activation | % signups who list ≥1 item | 30%+ | 20%+ |
| Listing completion | % started → published | 60%+ | 70%+ |
| Seller retention (30d) | % who list again in 30 days | Track | Track |
| Time-to-first-sale | Days from first listing to first sale | Track | Track |
| Sell-through rate | Orders / active listings | Track | Track |

## Transaction KPIs

| Metric | Definition | Beta Target | Launch Target |
|--------|-----------|-------------|---------------|
| Completed transactions/month | Orders reaching `completed` | 10+ | 100+ |
| GMV (Gross Merchandise Value) | Total value of goods sold (€) | Track | Track |
| Average order value (AOV) | Mean transaction amount | Track (~€15–30) | Track |
| Take rate | Treido revenue / GMV | Track | Track |

## Trust KPIs (Non-Negotiable)

| Metric | Definition | Target |
|--------|-----------|--------|
| Dispute rate | Disputed / paid orders | < 2% (beta), < 1% (launch) |
| Refund rate | Refunded / paid orders | Track |
| Chargeback rate | Chargebacks / paid orders | < 0.5% |
| Time-to-resolution | Avg days to resolve dispute | < 3 days |
| Fraud incidents | Confirmed fraud cases | 0 |

## Revenue KPIs

| Metric | Definition | Target |
|--------|-----------|--------|
| MRR | Monthly recurring (subscriptions) | Track from day 1 |
| Transaction revenue | Buyer protection fees earned | Track from day 1 |
| Boost revenue | Boost purchases | Track from day 1 |
| Total revenue | All streams | Track |
| CAC | Cost to acquire active user | Track when running ads |
| LTV | Revenue per user over lifetime | Calculate at 6 months |
| LTV/CAC | Ratio (healthy > 3) | Target > 3 |

---

## Operational Cadence

| Frequency | What |
|-----------|------|
| Daily | Webhook lag, payment failures, dispute queue |
| Weekly | North star + funnel + supply + trust review |
| Monthly | Unit economics, revenue mix, risk review |

## Stop-the-Line Triggers

- Payout release bug (any) → SEV-0
- Webhook lag above threshold → investigate immediately
- Chargeback rate spike → freeze new payouts, investigate
- Fraud pattern detected → restrict affected accounts

---

## Measurement Tools

| Tool | Tracks |
|------|--------|
| Supabase | Transactions, users, listings, orders (DB queries) |
| Vercel Analytics | Page views, web vitals, traffic sources |
| Stripe Dashboard | Revenue, payouts, disputes, chargebacks |
| **TBD** | Product analytics (PostHog or Plausible — decision needed) |

---

*Last updated: 2026-02-23*
*Status: Metrics defined. Targets set for beta and launch phases.*
