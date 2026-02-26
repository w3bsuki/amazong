# NORTH-STAR — Treido

> Purpose: Define where Treido is going and what must be true for us to get there.
> Horizon: 2026+ (multi-phase, Europe-first expansion).

## Vision

Treido becomes the default AI-first commerce platform for individuals and SMBs in Europe: list in seconds, sell with trust, run operations with AI, and buy with confidence.
We combine marketplace demand, secure transaction rails, and business automation in one system so sellers do not need Shopify, buyers do not need luck, and small businesses do not need an operations team.
Every major product decision must increase trust, liquidity, and automation at the same time.

## Core Capabilities

### 1) Trust Kernel

What it looks like when fully built:
- Identity verification, KYC/KYB, payment verification, fraud detection, escrow, disputes, refunds, and payout controls are unified in one policy-driven trust system.
- Every high-risk action is traceable with immutable event logs and explainable decisions.
- Disputes and refunds are fast, consistent, and partially automated with human override.

What makes it better than competitors:
- Stronger buyer and seller safety than classifieds.
- Lower complexity than enterprise commerce stacks for SMBs.
- Better dispute clarity and speed than most marketplaces.

Infrastructure required:
- Verified identity + account trust graph.
- Risk rules engine + ML risk scoring.
- Event ledger for payments/disputes/refunds.
- Case management workflow + SLA timers.
- Compliance controls for GDPR/DSA/AI obligations.

### 2) Commerce Graph

What it looks like when fully built:
- A canonical graph connects users, listings, intents, searches, messages, orders, shipments, disputes, and outcomes.
- Every entity has lifecycle states and event history.
- The graph supports real-time decisions and offline learning.

What makes it better than competitors:
- Better recommendations, pricing, and fraud prevention because decisions are grounded in full transaction context, not isolated tables.
- Faster iteration: every new AI feature plugs into the same graph contract.
- Superior compounding effect: each transaction improves the whole system.

Infrastructure required:
- Canonical entity schemas and lifecycle contracts.
- Event streaming + append-only event store.
- Feature views for ranking, pricing, forecasting, support.
- Data quality SLAs and replay/backfill pipelines.
- Governance for retention, privacy, and access.

### 3) AI Listings + Generative Merchandising

What it looks like when fully built:
- Seller uploads photos or video and receives near-complete listing draft in seconds: title, category, attributes, condition, price range, description, shipping defaults.
- AI proposes variants and quality improvements before publish.
- Generative creative tools produce storefront snippets, ads, and seasonal campaign assets from listing data.

What makes it better than competitors:
- Faster listing throughput with higher data quality than manual form-first marketplaces.
- Better merchandising outcomes than generic text-only assistants.
- Works for both casual sellers and professional catalogs.

Infrastructure required:
- Multimodal ingestion pipeline (image/video/text).
- Category ontology + attribute extraction.
- Pricing recommendation service with confidence bands.
- Prompt/version registry + schema-validated outputs.
- Human-in-the-loop review and correction capture.

### 4) AI Business Operator (Seller Copilot)

What it looks like when fully built:
- Business dashboard shows actionable AI recommendations: price moves, stock alerts, promotion suggestions, margin warnings, demand forecasts, response automation.
- AI can execute approved actions (price update, campaign launch, stock reorder suggestion) with explicit guardrails.
- Sellers move from reactive reporting to proactive operations.

What makes it better than competitors:
- Replaces fragmented tools (analytics app + CRM + spreadsheet + support macros) with one decision layer tied directly to transactions.
- SMBs get enterprise-grade operating leverage without data teams.
- Recommendations are grounded in marketplace demand, not only store-local data.

Infrastructure required:
- KPI and forecasting pipelines on Commerce Graph.
- Agent action framework with approval policy matrix.
- Explainability layer for recommendations.
- Experimentation layer for recommendation impact.
- Role-based controls and audit trails.

### 5) AI Buyer Agent

What it looks like when fully built:
- Buyer can state intent in natural language and the agent finds, compares, explains tradeoffs, watches price changes, and suggests best timing.
- Agent can draft offers, negotiate within user constraints, and prepare checkout.
- Optional auto-buy executes only inside strict user controls (budget, seller trust threshold, return policy constraints).

What makes it better than competitors:
- Better than search/filter UX for complex purchase decisions.
- More transparent and controllable than black-box recommendation feeds.
- Higher buyer confidence through explainable comparisons and trust signals.

Infrastructure required:
- Intent parser + retrieval/ranking pipeline.
- Comparison synthesis and policy-safe generation.
- Offer/negotiation workflow primitives.
- Agent memory scoped per user and consent.
- Action safety limits and explicit confirmations.

### 6) Fulfillment + Service Intelligence Network

What it looks like when fully built:
- Unified delivery orchestration across carriers with ETA quality, exception handling, and proactive recovery.
- AI support handles routine inquiries, return eligibility checks, and dispute evidence collection.
- Autonomous delivery is introduced only in constrained pilots where density, economics, and regulation permit.

What makes it better than competitors:
- Better post-purchase experience than marketplaces that stop at payment.
- Lower support burden with faster resolution quality.
- Logistics intelligence improves trust and repeat purchase rates.

Infrastructure required:
- Carrier integration hub + tracking normalization.
- Delivery event quality scoring and delay prediction.
- Support case AI + policy engine integration.
- Dispute evidence pipeline tied to order/shipment graph.
- Regulatory-compliant autonomy partnership framework.

## Competitive Moat (Defensible Advantage)

Treido's moat is the combination, not any single feature:
- Marketplace liquidity + Trust Kernel + Commerce Graph.
- AI systems trained on real end-to-end commerce outcomes, not only content generation tasks.
- Policy-aware agent execution tied to transaction safety controls.
- Fast local adaptation (language, regulation, category behavior) with reusable platform primitives.
- Compounding data flywheel: more transactions → better trust, pricing, ranking, and automation → more transactions.

## User Promise

What users should say about Treido:
- "I can list and sell faster here than anywhere else."
- "Payments and disputes feel safe and fair."
- "Treido's AI actually helps me run my business, not just write text."
- "I trust recommendations because they are clear and explainable."
- "This feels like having a store platform and marketplace in one place."

## Strategic Rules (Decision Filter)

A major initiative is aligned only if it improves at least 2 of 3:
- Trust
- Liquidity
- Automation

A major initiative is rejected if it does any of:
- Increases GMV but weakens trust controls.
- Adds AI output without measurable quality evaluation.
- Adds complexity without improving seller or buyer outcomes.
- Consumes roadmap capacity without strengthening long-term moat.

---

*Owner: Orchestrator + Human*
*Review cadence: monthly (strategy), weekly (execution alignment)*
*Last updated: 2026-02-26*
