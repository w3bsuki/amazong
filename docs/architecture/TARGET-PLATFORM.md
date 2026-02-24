# TARGET-PLATFORM — Treido

> Purpose: Define the end-state systems architecture for Treido as an AI-first commerce platform.
> Scope: Platform architecture and interactions, not implementation-level code.

## Architecture Intent

Treido is built as layered systems where trust and commerce data are foundational, and AI/agent experiences are built above those foundations with strict safety and governance.
No experience or agent capability may bypass Trust Kernel controls or Commerce Graph contracts.

## Layered Model

```
L6 Experience Layer
L5 Agent Layer
L4 AI Platform Layer
L3 Commerce Graph Layer
L2 Trust Kernel Layer
L1 Core Infrastructure Layer
L0 External Network Layer (payments, carriers, identity/compliance providers)
```

## Layer Definitions

### L1 Core Infrastructure Layer

Responsibilities:
- Runtime platform, data storage, messaging, observability, CI/CD, secrets, environment isolation.

Core concerns:
- Availability, latency, resilience, rollback safety.
- Development velocity with guardrails.

### L2 Trust Kernel Layer

Responsibilities:
- Auth and identity verification.
- Payment orchestration, escrow, payouts.
- Fraud/risk scoring.
- Disputes, refunds, policy enforcement.

Output to upper layers:
- Trust scores, decision outcomes, policy-safe action boundaries.
- Verified transaction states.

### L3 Commerce Graph Layer

Responsibilities:
- Canonical entities and lifecycle states for users, listings, intents, messages, orders, shipments, disputes.
- Event ledger and feature-ready data views.
- Data quality contracts.

Output to upper layers:
- Unified contextual signals for ranking, pricing, forecasting, and support automation.

### L4 AI Platform Layer

Responsibilities:
- Model gateway and routing.
- Prompt/version management.
- Evaluation and telemetry.
- Guardrails and action safety.
- Cost and latency controls.

Output to upper layers:
- Validated AI suggestions and policy-gated actions with traceable metadata.

### L5 Agent Layer

Responsibilities:
- Domain agents (Seller, Buyer, Support, Operations).
- Decision support and approved action orchestration.
- Human-in-the-loop controls for risky actions.

Output to upper layers:
- Task-oriented workflows and explainable decisions.

### L6 Experience Layer

Responsibilities:
- Marketplace UX (mobile/desktop), business dashboard, assistant interfaces, notifications.
- Clear user controls and explainability surfaces.
- Fast and reliable interactions with graceful degradation.

Output to users:
- Faster listing, safer checkout, better support, better operating outcomes.

### L0 External Network Layer

Responsibilities:
- External payment rails, carrier/tracking providers, identity/compliance services, AI providers.
- Partner constraints and SLAs integrated via internal contracts.

## Interaction Rules

- L6 and L5 can read/write only through L4/L3/L2 contracts.
- Any action affecting money, trust, or legal state must pass L2 policy checks.
- AI output is advisory until policy and permission checks pass.
- All major state changes emit Commerce Graph events.

## Primary Data/Control Flows

### Flow A: AI Listing Publish

1. User submits media/input in L6.
2. L5/L6 requests suggestion via L4.
3. L4 uses L3 context and returns schema-validated draft.
4. User edits/approves in L6.
5. Publish action passes L2 policy checks.
6. L3 stores entity + event; L4 logs outcome for learning.

### Flow B: Buyer Purchase + Protection

1. Buyer intent and cart actions occur in L6.
2. L3 resolves listing and seller context.
3. L2 executes payment/escrow/policy checks.
4. Order state transitions written to L3.
5. L6 shows transparent status and recovery paths.
6. L4/agents observe outcomes for optimization/support.

### Flow C: Dispute + Support Resolution

1. User files dispute via L6.
2. L2 opens case with policy clock/SLA.
3. L5 support agent gathers context from L3 and suggests resolution.
4. Human reviewer approves or overrides.
5. L2 executes refund/payout decision.
6. L3 stores final event trail.

## Cross-Cutting Requirements

- Security and privacy by design.
- Full auditability for high-impact decisions.
- i18n-ready user-facing surfaces and policy communication.
- Deterministic fallback behavior for AI/provider failures.
- Measurable KPIs at each layer boundary.

## Phase Alignment

- Phase 0-1: Harden L1-L3 and basic L6 journeys.
- Phase 2: Mature L4 for AI Listings.
- Phase 3: Expand L5 for Business Operator workflows.
- Phase 4: Add Buyer Agent with strict action limits.
- Phase 5: Extend L0 integrations for fulfillment intelligence and autonomy pilots.

## Success Criteria for Target Architecture

- Trust incidents remain low while automation increases.
- AI features improve conversion/speed without policy regressions.
- New capabilities are built by composing existing contracts, not creating ad-hoc paths.
- Operational cost per transaction improves as automation maturity increases.

---

*Owner: Orchestrator + Engineering*
*Review cadence: monthly architecture review, major milestone updates*
