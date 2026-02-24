# Tasks — Active (Phase-Aligned)

> Single execution queue. Phase-aligned with `docs/strategy/CAPABILITY-MAP.md`.
> Codex picks tasks here, executes, and checks boxes.
> Each task: description + context + acceptance criteria.

---

## How to Use This File

**Codex:** Read AGENTS.md first → Read `docs/state/NOW.md` → Find your assigned task below. Load listed context docs. Execute. Check boxes.
**Orchestrator:** Creates tasks from audits/planning. Verifies completion. Archives shipped work.
**Human:** Picks which task to send to Codex. Bridges orchestrator and Codex.

## Task Metadata

Tasks use format: `PH<phase>-<area>-<number>`. Example: `PH0-LAUNCH-001`.
Phase alignment tells agents WHY this task matters in the bigger picture.

---

## Phase 0 — Launch Hardening (Current)

> V1 Bulgaria launch readiness. Close blockers, fix broken areas, harden trust surface.

### 0.1 Launch Blockers (Human Approval Required)

- [ ] **PH0-LAUNCH-001:** Verify Stripe webhook idempotency — no duplicate orders on replay
  - Context: `docs/features/checkout-payments.md`
  - Capability: Webhook idempotency + replay safety
  - Done: replay same `checkout.session.completed` event twice → second is no-op, order count unchanged

- [ ] **PH0-LAUNCH-002:** Test refund/dispute flow end-to-end
  - Context: `docs/features/checkout-payments.md`
  - Capability: Refund/dispute operational flow
  - Done: trigger refund from Stripe dashboard → order status updates → buyer notified

- [ ] **PH0-LAUNCH-003:** Verify Stripe environment separation (prod keys + webhook secrets)
  - Context: `docs/features/checkout-payments.md`, `docs/STACK.md`
  - Capability: Environment separation (dev/prod payments)
  - Done: prod and dev use separate Stripe accounts, no test keys in prod env

- [ ] **PH0-LAUNCH-004:** Enable leaked password protection + re-run Supabase Security Advisor
  - Context: `docs/features/auth.md`
  - Capability: Auth/session hardening
  - Done: Supabase Security Advisor returns no critical findings
  - Note (2026-02-23): `password_hibp_enabled` is `false`; enabling via API failed with `402 Payment Required` (Pro plan+). Security Advisor: 1 warning, 0 critical.

### 0.2 Core Journey Breakages

- [ ] **PH0-FIX-002:** Sell flow UX is terrible — needs redesign
  - Context: `docs/features/sell-flow.md`
  - Capability: Sell flow quality and completion
  - Done: seller can list a product end-to-end with clear UX, image upload works, form validation helpful

- [ ] **PH0-FIX-003:** Account settings broken on mobile, incomplete on desktop
  - Context: `docs/features/auth.md`, `docs/DESIGN.md`
  - Capability: Account/profile reliability
  - Done: all settings accessible on mobile (375px), no overflow, no broken interactions

### 0.3 Trust/Compliance Hardening

- [ ] **PH0-REFACTOR-001:** Domain 6 — lib/, actions/, api/ refactoring (auth/payment sensitive)
  - Context: `refactor/domains/06-lib-actions-api.md`
  - BLOCKED: Contains payment/auth action refactors. Needs human approval before execution.
  - Note (2026-02-23): Completed safe `lib/` hardening pass. Full gate passes.
  - Done: domain refactored per plan, verification passes, no auth/payment regressions

- [ ] **PH0-TRUST-001:** Checkout buyer protection UX (blocking/warning)
  - Context: `docs/features/checkout-payments.md`
  - Capability: Stripe checkout + escrow lifecycle
  - Done: buyer protection fee visible before payment, clear explanation text

- [ ] **PH0-TRUST-002:** PDP report modal/flow (trust & safety)
  - Done: report button opens modal, user selects reason + submits, report stored in DB

- [ ] **PH0-TRUST-003:** Verify product data sanity — no test/dummy listings
  - Done: audit shows only real listings, categories make sense

### 0.4 Phase 0 Exit Criteria

- All launch blockers closed (PH0-LAUNCH-001..004)
- Core journeys stable (sell, browse, checkout, account)
- Launch gates green (`pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`)
- P2 sections (12-15) audited or deprioritized with rationale

---

## Phase 1 — Liquidity + Conversion (Next)

> Post-launch. Grow supply, improve buyer conversion, build trust signals.

### 1.1 Supply Seeding & Listing Velocity

*(Tasks to be created post-launch based on GTM wedge category decisions)*

### 1.2 Buyer Conversion & Trust UX

- [ ] **PH1-BUYER-001:** Buyer confirmation email on checkout completion
  - Context: `docs/features/checkout-payments.md`
  - Capability: Transactional email + trust communications
  - Done: email sent with order summary, delivery estimate, seller info

- [ ] **PH1-BUYER-002:** PDP mobile seller bio surface
  - Context: `docs/features/product-cards.md`, `docs/DESIGN.md`
  - Done: seller name, avatar, rating, join date visible on mobile PDP

### 1.3 Seller Retention Foundations

*(Tasks to be created when Phase 1 begins)*

### 1.4 Phase 1 Exit Criteria

- Listing and transaction growth with healthy trust metrics
- Business dashboard baseline functional
- Commerce Graph canonical entity contracts stable

---

## Phase 2 — AI Listings MVP

> AI-powered listing creation. Photo → draft in seconds.

### 2.1 AI Platform Foundations

*(Tasks created when Phase 2 begins. See `docs/architecture/AI-PLATFORM.md` for architecture.)*

### 2.2 Photo-to-Listing Autofill

### 2.3 Pricing Suggestions MVP

### 2.4 Phase 2 Exit Criteria

- AI listing MVP with measurable publish-speed and quality gains
- Prompt registry and eval harness operational
- Guardrails and schema validation enforced

---

## Phase 3 — AI Business Operator MVP

*(See `docs/strategy/CAPABILITY-MAP.md` for capability inventory)*

## Phase 4 — Buyer Agent + EU Expansion

*(See `docs/strategy/CAPABILITY-MAP.md` for capability inventory)*

## Phase 5 — Fulfillment Intelligence + Autonomy Pilots

*(See `docs/strategy/CAPABILITY-MAP.md` for capability inventory)*

---

## Completed Recently

- [x] **FIX-001:** Search repair — search returns relevant results, filters work *(2026-02-24)*
- [x] **MOBILE-001:** Full mobile UI/UX audit and alignment pass *(2026-02-21)*
- [x] **MOTION-001:** Motion & structure pass — Framer Motion polish *(2026-02-21)*
- [x] **REFACTOR-002:** hooks/ production audit/refactor *(2026-02-23)*

---

## Codex Prompts (ready to paste)

**Single task:**
```
Read AGENTS.md. Then do task PH0-LAUNCH-001 from TASKS.md.
```

**Phase 0 batch:**
```
Read AGENTS.md. Do all unchecked tasks in "Phase 0" of TASKS.md, top to bottom.
```

**Specific area:**
```
Read AGENTS.md. Read docs/architecture/AI-PLATFORM.md. Then do task PH2-AI-001 from TASKS.md.
```

---

*Last updated: 2026-02-24*
