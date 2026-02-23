# Business Knowledge Base — Treido

> Domain knowledge for Treido as a **business**, not as code.
> These docs are the single source of truth for pricing, strategy, revenue, and operations.
> AI agents load these via the routing table in `AGENTS.md` — only when working on business topics.

---

## What Lives Here

| Doc | Purpose | Status |
|-----|---------|--------|
| [plans-pricing.md](plans-pricing.md) | Subscription tiers, features per tier, pricing strategy | Skeleton — needs decisions |
| [monetization.md](monetization.md) | Revenue streams, fee structure, unit economics | Skeleton — needs decisions |
| [go-to-market.md](go-to-market.md) | Launch strategy, phasing, channels, markets | Skeleton — needs strategy |
| [competitors.md](competitors.md) | Market landscape, positioning vs OLX/Vinted/etc. | Skeleton — needs research |
| [metrics-kpis.md](metrics-kpis.md) | Success metrics, targets, measurement | Skeleton — needs targets |
| [legal-compliance.md](legal-compliance.md) | GDPR, EU marketplace regs, ToS scope | Skeleton — needs review |

## How to Use

**Agents:** Read only the doc(s) relevant to the question. Don't load all 6 for a pricing question.

**Human:** Fill in the `[DECISION NEEDED]` markers. These are the open questions from PRD.md that need your input.

**Updating:** When a decision is made, update both the business doc AND the PRD open questions table. Keep them in sync.

## Codex Skills (Optional)

If you're using Codex Skills, invoke one of these personas:

- `$treido-business-strategist`
- `$treido-finance-analyst`
- `$treido-marketing-manager`
- `$treido-operations-manager`

---

## Relationship to Other Docs

- `docs/PRD.md` — Product *what*. Business docs are the *how* and *why* of the money side.
- `docs/features/checkout-payments.md` — Technical implementation of payments. Business docs own the strategy.
- `TASKS.md` — Launch blockers reference these docs for business context.

---

*Last updated: 2026-02-23*
