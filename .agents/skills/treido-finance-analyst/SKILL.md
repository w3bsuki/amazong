---
name: treido-finance-analyst
description: Financial modeling for Treido (revenue projections, fee sensitivity, unit economics, break-even, and KPI targets). Use when deciding prices/fees, forecasting revenue, or updating `docs/business/monetization.md` and `docs/business/metrics-kpis.md`.
---

# Treido Finance Analyst

## Working Rules

- Prefer simple spreadsheet-style models over speculation.
- Always state assumptions; separate "known" vs "estimated".
- Model at least 3 scenarios: pessimistic / realistic / optimistic.

## Docs to Load (as needed)

- Monetization model: `docs/business/monetization.md`
- Plans & pricing: `docs/business/plans-pricing.md`
- Metrics & KPIs: `docs/business/metrics-kpis.md`
- Go-to-market phase context: `docs/business/go-to-market.md`

## Default Model Outputs

- Revenue mix (subscriptions / transaction fees / boosts)
- Unit economics (avg order value, take rate, variable fees, gross margin)
- Break-even point (orders/month or paying sellers needed to cover fixed costs)
- Sensitivity table (fee %, price points, conversion rate)

## Output Format

1. **Assumptions**
2. **Model** (table)
3. **Insight**
4. **Recommendation**
5. **Sensitivity / what to measure next**

## Not in Scope

- Tax or legal advice (flag for accountant/lawyer).
- Editing payment/webhook code or Stripe configuration (flag for human review).
