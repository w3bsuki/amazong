# codex_ideas.md — Treido AI Agent Iteration Log

Last updated: 2026-02-17

## Iteration 01 (Codex): AI-First Shopping Without Killing Browse UX

### 1) Executive Decision

Do not replace Treido with chat-only.

Build a second surface: `ai.treido.eu` as a hybrid AI shopping experience:
- chat-first assistant,
- fast browse/feed tab,
- listing cards + filters rendered inline from agent results.

Keep the existing marketplace UI as `treido.eu` for scroll/browse behavior and conversion safety.

### 2) Why This Direction

You identified the key truth correctly: many users browse for fun, not only intent shopping.

Pure chat loses:
- discovery loops,
- impulse buying via feed scrolling,
- trust signals from familiar e-commerce layouts.

Hybrid wins:
- intent shoppers use agent chat,
- browse shoppers keep feed behavior,
- both use the same backend, listings, auth, and checkout.

### 3) What Already Exists (Real Head Start)

Current repo already has production-relevant AI building blocks:

- `app/[locale]/(main)/assistant/page.tsx`
- `app/[locale]/(main)/assistant/_components/assistant-playground.tsx`
- `app/api/assistant/chat/route.ts` (auth-gated, streaming, tool-enabled)
- `lib/ai/tools/assistant-tools.ts` (`searchListings`, `getListing`)
- `lib/ai/models.ts` + `lib/ai/env.ts` (provider/model routing + fallback)

Important note:
- `supabase/functions/ai-shopping-assistant/index.ts` is a second, separate assistant stack.
- Running two assistant backends long-term will fragment behavior and increase bugs.

Decision for future implementation:
- keep one primary agent backend (recommended: Next.js `app/api/assistant/*` path),
- either delete or clearly limit Supabase edge function to a specialized role.

### 4) Architecture Recommendation

Use one Next.js app now, not a new repo:

- Add route group: `app/[locale]/(agent)/...`
- Map subdomain: `ai.treido.eu` -> `/(agent)` routes via Vercel routing
- Reuse existing Supabase, Stripe, next-intl, auth cookies
- Reuse existing listing/product components where possible

Why this is best now:
- fastest to ship,
- least duplication,
- shared deployment and observability,
- lower operational risk for launch.

Split into separate project/monorepo later only if at least one trigger appears:
- independent deployment cadence is blocking team velocity,
- agent traffic/runtime needs diverge strongly,
- code boundaries become hard to enforce inside one app.

### 5) Product Shape (MVP)

`ai.treido.eu` initial IA:

1. `Chat` tab (default): conversational shopping assistant
2. `Browse` tab: newest/promoted/nearby feed
3. `Saved` tab: shortlist/wishlist from agent interactions

Agent UX rules:
- ask short clarifying questions when intent is incomplete,
- always ground recommendations in tool results,
- show listing cards quickly (not long paragraphs),
- let users pivot to browse/feed anytime.

### 6) Tooling Plan (Agent Capabilities)

Existing tools:
- `searchListings(query, limit)`
- `getListing(id)`

Add next (priority order):

1. `getNewestListings({ category?, city?, limit })`
2. `getPromotedListings({ category?, city?, limit })`
3. `searchNearbyListings({ userLat, userLng, radiusKm, query? })`
4. `getCategoryTree()`
5. `getPriceBands({ category })`
6. `saveShortlistItem({ listingId })` / `removeShortlistItem({ listingId })`

Later (post-MVP):
- compare listings,
- conversational checkout guidance,
- seller/negotiation helpers,
- post-purchase tracking assistant.

### 7) Model and Cost Strategy

Start with cheap + fast model for 80% of turns.

Proposed routing:
- primary: small/fast model (`google/gemini-2.0-flash-lite` already configured as default)
- fallback: secondary provider (already wired in `lib/ai/models.ts`)
- promote to stronger model only for complex comparison/extraction tasks

Cost controls:
- strict tool-first behavior,
- short assistant responses,
- capped history window,
- per-user/day soft limits,
- telemetry on token and tool usage.

### 8) Discoverability for Other AIs (A2A)

Goal: Treido should be easy for third-party agents to discover and query.

Phase MVP:
- stable public read endpoints for catalog/search,
- strict schemas and docs for query parameters and response shapes,
- rate-limited but reliable public access.

Phase 2:
- publish `/.well-known/ai-plugin.json`-style metadata and/or equivalent manifest(s),
- expose a documented machine-consumable capability descriptor,
- consider an MCP-compatible endpoint after core API quality is stable.

Important:
- discoverability is mostly reliability + schema quality + indexing, not only “having AI”.

### 9) Roadmap

#### Phase 0 (Week 1): Stabilize Foundation
- Choose one assistant backend as primary.
- Consolidate tool contracts and schemas.
- Add structured telemetry for prompts, tool calls, latency, and failures.
- Define MVP success metrics.

Ship criteria:
- deterministic behavior for top shopping intents,
- no duplicated assistant logic paths.

#### Phase 1 (Week 2): Launch Hybrid Agent Surface
- Create `/(agent)` route group and minimal shell.
- Add `Chat` + `Browse` tabs.
- Reuse existing product card UI in chat result strips.
- Wire newest/promoted/nearby tools.

Ship criteria:
- users can both converse and browse from same surface,
- mobile UX is smooth and fast.

#### Phase 2 (Week 3): Personalization + Shortlist
- Add shortlist/saved flow.
- Improve prompt orchestration for refinement loops.
- Add “show similar”, “under budget”, “near me” quick actions.

Ship criteria:
- measurable increase in click-through from chat results.

#### Phase 3 (Week 4+): External Agent Access
- Harden public search/read API contracts.
- Publish machine-readable capability metadata.
- Add partner-facing docs and quotas.

Ship criteria:
- third-party agent can complete search -> detail retrieval reliably.

### 10) KPIs to Judge if This Is Actually Better

Track separately for `treido.eu` and `ai.treido.eu`:

- search-to-listing-click rate,
- listing-click-to-checkout-start rate,
- checkout-start-to-purchase rate,
- session length and return rate,
- average tool calls per successful shopping session,
- cost per successful agent-assisted session.

If AI surface cannot beat baseline on conversion or retention, keep it as assistive mode, not primary.

### 11) Key Risks

1. Over-chatting: assistant talks too much, shows too few products.
2. Tool quality gaps: weak retrieval means bad recommendations.
3. Dual-stack drift: Next.js assistant and Supabase assistant diverge.
4. Mobile UX regression: chat UI can become slower than normal browse.
5. Premature platform expansion: MCP/A2A before core shopping UX works.

### 12) Immediate Next Actions (Practical)

1. Decide primary assistant backend (`app/api/assistant/*` recommended).
2. Create `app/[locale]/(agent)/` shell with `Chat` and `Browse` tabs.
3. Implement `getNewestListings` and `getPromotedListings` tools first.
4. Run limited internal dogfood with realistic shopping tasks.
5. Compare conversion + engagement vs current `/(main)/assistant`.

---

## Iteration 02 (Codex): Synthesis of `opus_ideas.md` + `codex_ideas.md`

Date: 2026-02-17

### What Opus gets right

1. Correct strategic frame: keep two surfaces (`treido.eu` browse, `ai.treido.eu` assistant).
2. Correct architecture default: same app, new route group first.
3. Correct UX warning: pure chat is weak for discovery; need browse/feed and visual results.
4. Strong external-discovery ambition: OpenAPI + machine-readable capability exposure.

### What needed tightening

1. Scope is too broad for first ship (includes many Phase 3+ capabilities too early).
2. Some items assume ideal infra before proving shopping conversion lift.
3. Discoverability stack is oversized for MVP if core retrieval/ranking quality is not solved first.
4. Dual-assistant-path risk was not explicitly closed (Next API + Supabase function drift).

### Combined decision (recommended)

Ship a constrained Hybrid Agent MVP with hard boundaries:

1. Keep existing marketplace as primary revenue surface.
2. Launch AI surface as complementary assistant with optional browse tab.
3. Prioritize retrieval quality, ranking quality, and mobile speed over protocol expansion.
4. Defer MCP/plugins/partner integrations until conversion and trust metrics are healthy.

### Critical gaps both docs should explicitly enforce

1. Ranking policy:
- Define how promoted listings blend with relevance.
- Add disclosure behavior for sponsored/promoted placements.

2. Reliability policy:
- No quote/availability guarantees without fresh tool data.
- Handle stale inventory and out-of-stock transitions gracefully.

3. Permission model:
- Public read APIs must stay strictly read-only and RLS-safe.
- Separate anonymous, authenticated buyer, seller, and admin tool scopes.

4. Decision-quality testing:
- Add an eval suite for top shopping intents (cars, electronics, budget queries, nearby, condition-sensitive requests).
- Track failed-answer classes (hallucination, wrong filters, poor ranking, no-result when results exist).

5. Latency and cost SLOs:
- Define max acceptable end-to-first-product latency on mobile.
- Define target cost per assisted session and degrade gracefully under load.

### Simplified execution path (recommended)

#### Gate 0: Harden current assistant first (in existing route)
1. Improve tool coverage for newest/promoted/nearby.
2. Add telemetry and eval harness.
3. Measure real session outcomes against baseline browse/search.

#### Gate 1: Launch `/(agent)` + `ai.treido.eu`
1. Chat + Browse tabs only.
2. Inline listing cards and quick refinement actions.
3. Anonymous browsing allowed; auth required for shortlist/cart/checkout.

#### Gate 2: Conversion optimization
1. Improve ranking and personalization.
2. Add shortlist memory and better comparison flows.
3. Validate KPI lift before expanding protocol surface.

#### Gate 3: External AI discoverability
1. Publish stable, versioned read API + schema.
2. Add machine-readable capability metadata.
3. Add MCP or other adapters only after API reliability and governance are stable.

### Default answer to your core question

"Should we replace frontend with an AI agent?"

No. Replace only a subset of journeys. Keep both interaction modes and let users switch instantly.

That gives you future-facing AI UX without sacrificing browse-led conversion and trust.

---

## Iteration Template (Use for next updates)

For each new idea cycle, append:

```md
## Iteration NN (Codex): <title>
Date:
What changed:
What we validated:
What failed:
Decision:
Next experiment:
```
