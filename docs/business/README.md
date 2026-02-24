# Business Knowledge Base — Treido

> Domain knowledge for Treido as a **business**, not as code.
> These docs are the single source of truth for pricing, strategy, revenue, and operations.
> AI agents load these via the routing table in `AGENTS.md` — only when working on business topics.

---

## What Lives Here

| Doc | Purpose | Status |
|-----|---------|--------|
| [plans-pricing.md](plans-pricing.md) | 6 tiers (Personal Free/Plus/Pro + Business Free/Pro/Enterprise), limits, fees | Decided (subscription prices TBD) |
| [monetization.md](monetization.md) | Hybrid Buyer Protection model, fee table, unit economics, escrow payout | Decided |
| [go-to-market.md](go-to-market.md) | Launch phases, channels, positioning, messaging | Decided (wedge categories TBD) |
| [competitors.md](competitors.md) | Market landscape, positioning vs OLX/Vinted/Bazar/Shopify | Complete |
| [metrics-kpis.md](metrics-kpis.md) | Funnel KPIs, trust metrics, targets, operational cadence | Decided |
| [legal-compliance.md](legal-compliance.md) | GDPR, DSA, KYC/KYB, compliance checklist | Requirements mapped |

## How to Use

**Agents:** Read only the doc(s) relevant to the question. Don't load all 6 for a pricing question.

**Human:** Fill in the `[DECISION NEEDED]` markers. These are the open questions from PRD.md that need your input.

**Updating:** When a decision is made, update both the business doc AND the PRD open questions table. Keep them in sync.

## Agent Skill

One unified business agent skill handles all strategy/finance/marketing/operations questions:

- `.agents/skills/treido-business-agent/SKILL.md`

---

## Relationship to Other Docs

- `docs/PRD.md` — Product *what*. Business docs are the *how* and *why* of the money side.
- `docs/features/checkout-payments.md` — Technical implementation of payments. Business docs own the strategy.
- `TASKS.md` — Launch blockers reference these docs for business context.

---

*Last updated: 2026-02-23*
