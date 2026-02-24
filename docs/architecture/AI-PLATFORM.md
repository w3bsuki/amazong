# AI-PLATFORM — Treido

> Purpose: Define the technical architecture for building AI features safely, reliably, and cost-effectively on top of Treido's commerce system.
> Stack anchor: Next.js + Vercel AI SDK (multi-provider) + Supabase + Stripe.

## Goals

- Ship AI features that improve real commerce outcomes, not only text quality.
- Standardize how prompts, model selection, evaluation, guardrails, and costs are managed.
- Make AI features auditable and reversible.

## Non-Goals

- Building custom foundation models.
- Unbounded autonomous actions without policy controls.
- Feature-specific AI stacks that bypass shared platform contracts.

## Design Principles

- Product outcome first: every AI feature maps to a measurable business metric.
- Structured outputs only: schema-validated JSON for all action-oriented responses.
- Version everything: prompt, model route, eval set, policy rules.
- Human override by default for high-risk actions.
- Fail safe: degrade gracefully to deterministic UX when AI is unavailable.

## Platform Overview

```
Experience/API Surface
    → AI Feature Runtime
    → Model Gateway (Vercel AI SDK)
    → Guardrail + Policy Layer
    → Prompt Registry (versioned)
    → Provider Router (OpenAI/Anthropic/others)
    → Output Validator (Zod schema)
    → Action Executor (policy-gated)
    → AI Telemetry + Eval Logs
    → Commerce Graph Read/Write Connectors
```

## Core Components

### 1) AI Feature Runtime

Responsibilities:
- Receives typed feature requests from server actions/route handlers.
- Resolves prompt version + model route + policy profile.
- Calls gateway and returns schema-safe response envelope.

Contract:
- Input schema and output schema are mandatory.
- Every response includes metadata: `prompt_version`, `model_route`, `latency_ms`, `cost_estimate`.

### 2) Model Gateway (Vercel AI SDK)

Responsibilities:
- Unified inference interface (`generateText`, `streamText`, tool-calling as needed).
- Provider abstraction and fallback routing.
- Streaming support for UX-facing features.

Routing policy:
- Tier A models for high-complexity high-value tasks.
- Tier B models for default structured tasks.
- Tier C cheap fallback for retries/degraded mode.

Routing signals:
- Feature type.
- Latency budget.
- Cost budget.
- Quality requirements.
- Incident mode (fallback-only).

### 3) Prompt Registry + Versioning

Storage:
- Repo-backed prompt specs for reviewability.
- Runtime index in DB/config for active versions and rollout state.

Prompt ID format:
- `<feature>.<intent>.v<major>.<minor>`
- Example: `listing.autofill.v1.3`

Each prompt version contains:
- System instructions.
- Input template contract.
- Output schema reference.
- Allowed tools.
- Guardrail profile.
- Eval pack reference.
- Rollout status (`draft`, `shadow`, `canary`, `active`, `retired`).

### 4) Guardrail + Policy Layer

Pre-inference controls:
- Input sanitization and length/token controls.
- Sensitive content detection.
- PII minimization/redaction where required.

Post-inference controls:
- Strict schema validation (reject/repair/retry).
- Policy checks (prohibited content, risky claims, unsafe action suggestions).
- Confidence thresholding for action recommendations.

Action safety:
- Permission matrix by action type.
- Approval requirement by risk class.
- Complete audit log for every action attempt.

### 5) Evaluation System

Offline evaluation:
- Golden datasets per feature (localized EN/BG).
- Task-specific scoring rubrics (accuracy, usefulness, policy adherence, structure validity).
- Regression checks on every prompt/model route change.

Online evaluation:
- Real traffic metrics by feature version.
- Implicit quality signals (accept/reject/edit behavior).
- Guardrail trigger rates and escalations.

Release gates:
- Offline quality threshold met.
- Policy violation rate below threshold.
- Cost-per-success within budget.
- No critical regressions in canary cohort.

### 6) Cost + Reliability Control

Cost controls:
- Per-feature daily/monthly budgets.
- Token accounting and estimated cost logging per request.
- Dynamic downshift to cheaper model tiers when budgets exceed threshold.
- Caching for repeated deterministic sub-tasks.

Reliability controls:
- Timeout budgets and bounded retries.
- Provider fallback chain.
- Circuit breaker per provider/model route.
- Deterministic fallback UX when AI path fails.

## Integration with Commerce Graph

Read connectors:
- Listings, taxonomy, historical comps, seller profile, order history, fulfillment states, support/dispute context.
- Only least-privilege scoped reads for each feature.

Write connectors:
- AI suggestions and decision metadata.
- User acceptance/rejection/edit outcomes.
- Action execution results.
- Feedback labels for evaluation datasets.

Required event contracts:
- `ai.requested`
- `ai.responded`
- `ai.failed`
- `ai.suggestion.accepted`
- `ai.suggestion.rejected`
- `ai.action.executed`
- `ai.action.blocked`

## Feature Lifecycle

1. Define feature goal and KPI.
2. Create schema contracts and prompt v1 draft.
3. Build offline eval pack.
4. Run shadow mode (no user-visible output or no action execution).
5. Canary rollout to small cohort.
6. Promote to active if metrics pass.
7. Monitor drift, cost, and policy incidents continuously.
8. Retire or upgrade version with backward traceability.

## Security, Privacy, Compliance

- No direct storage of raw secrets in prompts.
- Minimize personal data sent to model providers.
- Separate internal traces from user-visible data.
- Log consent boundaries for agent memory and action execution.
- Preserve auditable records for high-impact decisions.

## Operational Metrics (Platform-Level)

- AI request success rate.
- Schema-valid output rate.
- Guardrail block rate.
- Median and p95 latency by feature.
- Cost per successful feature outcome.
- User acceptance rate of AI suggestions.
- Incident count by severity.

## Initial Implementation Sequence (Pragmatic)

- Step 1: AI gateway wrapper + telemetry envelope.
- Step 2: Prompt registry v1 + version pinning.
- Step 3: Offline eval harness for AI Listings.
- Step 4: Guardrail policy profiles and schema enforcement.
- Step 5: Cost budgets and automatic route downshifting.
- Step 6: Expand to Business Assistant features.

---

*Owner: Engineering (Codex execution) + Orchestrator (quality/policy governance)*
*Update cadence: every AI capability milestone*
