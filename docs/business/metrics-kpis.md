# Metrics & KPIs — Treido

> How we measure success. What numbers matter, what targets to hit.
> Updated as we move through launch phases.

---

## North Star Metric

**Completed transactions per month.**

This is the single number that proves Treido works. It means:
- Sellers are listing (supply)
- Buyers are finding and buying (demand)
- Payments work (infrastructure)
- Both sides come back (retention)

---

## Primary Metrics

### Supply Metrics (Sellers)

| Metric | Definition | Target (Beta) | Target (Launch) |
|--------|-----------|---------------|----------------|
| Active listings | Total live listings on platform | **[TBD]** 100+ | **[TBD]** 1000+ |
| New listings/week | Listings created per week | **[TBD]** 20+ | **[TBD]** 100+ |
| Seller activation rate | % of signups who list ≥1 item | **[TBD]** 30%+ | **[TBD]** 20%+ |
| Listing completion rate | % of started listings that get published | **[TBD]** 60%+ | **[TBD]** 70%+ |
| Seller retention (30d) | % of sellers who list again within 30 days | **[TBD]** | **[TBD]** |

### Demand Metrics (Buyers)

| Metric | Definition | Target (Beta) | Target (Launch) |
|--------|-----------|---------------|----------------|
| Monthly active buyers | Unique users who purchase | **[TBD]** 20+ | **[TBD]** 200+ |
| Conversion rate | % of product views → purchase | **[TBD]** 1-3% | **[TBD]** 2-5% |
| Cart abandonment rate | % of cart additions without checkout | Track | Reduce over time |
| Average order value (AOV) | Mean transaction amount (€) | Track | Track |
| Buyer retention (30d) | % of buyers who buy again within 30 days | **[TBD]** | **[TBD]** |

### Transaction Metrics

| Metric | Definition | Target (Beta) | Target (Launch) |
|--------|-----------|---------------|----------------|
| Completed transactions/month | Orders that reach delivered/completed | **[TBD]** 10+ | **[TBD]** 100+ |
| GMV (Gross Merchandise Value) | Total value of goods sold (€) | Track | Track |
| Take rate | Treido revenue / GMV | Track | Depends on pricing |
| Dispute rate | % of transactions with disputes | < 2% | < 1% |

### Revenue Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| MRR (Monthly Recurring Revenue) | Subscription revenue | Track from day 1 |
| Transaction revenue | Platform fees earned | Track from day 1 |
| Boost revenue | Boost purchases | Track from day 1 |
| Total revenue | All streams combined | **[TBD]** |
| CAC (Customer Acquisition Cost) | Cost to acquire one active user | Track when running ads |
| LTV (Lifetime Value) | Revenue per user over lifetime | Calculate at 6 months |
| LTV/CAC ratio | Should be > 3 for healthy business | Target: > 3 |

---

## Secondary Metrics

### Platform Health

| Metric | Definition | Why It Matters |
|--------|-----------|---------------|
| DAU/MAU ratio | Daily active / Monthly active users | Engagement indicator |
| Session duration | Time spent per visit | Content quality |
| Pages per session | How much they browse | Discovery quality |
| Search success rate | % of searches leading to click | Search quality |
| Support tickets/week | Volume of issues reported | Platform stability |

### Trust & Safety

| Metric | Definition | Target |
|--------|-----------|--------|
| Review submission rate | % of completed orders with reviews | > 30% |
| Average seller rating | Mean star rating | > 4.0 |
| Report rate | % of listings reported | < 1% |
| Fraud incidents | Confirmed fraud cases | 0 |
| Chargeback rate | % of payments charged back | < 0.5% |

---

## Measurement Tools

| Tool | What It Tracks |
|------|---------------|
| Supabase | Transactions, users, listings, orders (DB queries) |
| Vercel Analytics | Page views, web vitals, traffic sources |
| Stripe Dashboard | Revenue, payouts, disputes, chargebacks |
| **[DECISION NEEDED]** | Product analytics (Mixpanel? PostHog? Plausible?) |

---

## Reporting Cadence

| Frequency | What |
|-----------|------|
| Daily | Transactions, new listings, new users (automated dashboard TBD) |
| Weekly | Revenue summary, key metrics review |
| Monthly | Full metrics review, trend analysis, strategic decisions |

---

*Last updated: 2026-02-23*
*Status: Skeleton — targets need to be set after pricing decisions*
