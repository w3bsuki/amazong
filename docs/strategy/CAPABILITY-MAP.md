# CAPABILITY-MAP — Treido

> Purpose: Show where we are, what phase each capability belongs to, what it depends on, and how we measure progress.
> Status scale: `Not Started` → `Scaffolded` → `MVP` → `Production` → `Advanced`

## Phases

- Phase 0: Launch hardening (V1 BG)
- Phase 1: Liquidity + conversion growth
- Phase 2: AI Listings MVP
- Phase 3: AI Business Operator MVP
- Phase 4: Buyer Agent + EU expansion
- Phase 5: Fulfillment intelligence + autonomy pilots

## Capability Matrix

| Capability | Current Status | Target Phase | Dependencies | Key Metrics |
|---|---|---|---|---|
| Auth/session hardening (`getUser`, route guards) | MVP | 0 | Supabase auth patterns | auth success rate, unauthorized access incidents |
| Stripe checkout + escrow lifecycle | MVP | 0 | Stripe Connect, order lifecycle | paid conversion, payout success, failure rate |
| Webhook idempotency + replay safety | Scaffolded | 0 | payment event contracts | duplicate order rate (target 0), replay no-op rate |
| Refund/dispute operational flow | Scaffolded | 0 | trust workflow, case policy | dispute resolution time, refund correctness |
| Environment separation (dev/prod payments) | Scaffolded | 0 | env contract, deploy checks | prod env audit pass |
| Core browse/search/filter journey | MVP | 0 | product index, category hierarchy | search success rate, no-result rate |
| Sell flow quality and completion | Scaffolded | 0 | form UX, media upload, validation | listing completion rate, time-to-publish |
| Account/profile reliability | Scaffolded | 0 | auth + profile actions | settings success rate, mobile break rate |
| Business dashboard baseline (non-AI) | Scaffolded | 1 | products/orders analytics views | dashboard DAU, feature usage depth |
| Transactional email + trust communications | Not Started | 1 | checkout/order event triggers | email delivery rate, support contact deflection |
| Data sanity pipeline (listing quality guard) | Not Started | 1 | catalog rules, moderation checks | invalid listing rate, moderation time |
| Commerce Graph canonical entities | MVP | 1 | listing/order/chat schemas | data contract pass rate |
| Commerce event ledger | Not Started | 1 | event schema + append store | event completeness, replay reliability |
| AI gateway (Vercel AI SDK multi-provider) | Scaffolded | 2 | provider adapters, routing policy | success rate, p95 latency, fallback rate |
| Prompt registry + versioning | Not Started | 2 | storage + config contract | % requests with pinned prompt version |
| AI listing autofill (photo → draft) | Scaffolded | 2 | multimodal extraction + taxonomy | autofill acceptance rate, publish speed |
| AI description/title generation | Not Started | 2 | prompt templates + schema checks | edit distance, policy violation rate |
| AI pricing suggestion engine | Not Started | 2 | transaction comps, demand signals | suggestion adoption rate, sell-through uplift |
| AI quality eval harness | Not Started | 2 | golden sets + scoring pipeline | offline pass rate, online quality drift |
| AI safety/policy guardrails | Not Started | 2 | policy layer + moderation | blocked unsafe output %, incident count |
| AI business insights cards | Not Started | 3 | KPI pipelines + recommendation engine | recommendation CTR, outcome lift |
| Inventory/demand forecasting | Not Started | 3 | event ledger + time-series features | forecast MAPE, stockout reduction |
| Agentic business actions (approved execution) | Not Started | 3 | action policy matrix + audit log | action acceptance, rollback rate |
| Buyer conversational assistant | Not Started | 4 | retrieval + ranking + trust signals | assistant conversion lift, satisfaction |
| Offer/negotiation assistant | Not Started | 4 | offer workflow + policy controls | offer acceptance rate, margin impact |
| Buyer auto-buy (bounded autonomy) | Not Started | 4 | hard constraints + approval logic | auto-buy success rate, override rate |
| Personalization/recommendation ranking | Scaffolded | 4 | behavior features + graph edges | CTR, repeat session rate |
| Generative storefront/campaign assets | Not Started | 4 | listing graph + generation templates | asset usage, conversion uplift |
| Carrier orchestration layer | Not Started | 5 | shipping integrations, tracking events | on-time delivery rate, exception rate |
| ETA prediction + delay recovery | Not Started | 5 | shipment telemetry + ML pipeline | ETA error, late-delivery reduction |
| AI support + dispute triage copilot | Not Started | 5 | support events + policy engine | first-response time, resolution time |
| Autonomous delivery partnerships | Not Started | 5 | density, regulation, partner contracts | pilot completion rate, cost per delivery |

## Phase Exit Signals

| Phase | Minimum Exit Signals |
|---|---|
| 0 | Launch blockers closed, launch gates green, core journeys stable |
| 1 | Listing and transaction growth with healthy trust metrics |
| 2 | AI listing MVP with measurable publish-speed and quality gains |
| 3 | Business AI recommendations and approved actions create measurable outcome lift |
| 4 | Buyer agent improves conversion/retention without trust regressions |
| 5 | Fulfillment intelligence improves delivery/support economics and reliability |

---

*Owner: Orchestrator*
*Update cadence: weekly*
*Primary source links: TASKS.md, docs/launch/TRACKER.md, docs/state/NOW.md*
