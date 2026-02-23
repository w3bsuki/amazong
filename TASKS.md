# Tasks — Active

> Single task queue. Codex picks tasks here, executes, and checks boxes.
> Each task is self-contained: description + context + acceptance criteria.
> Completed tasks get checked off. Fully shipped work gets removed periodically.

---

## How to Use This File

**Codex:** Read AGENTS.md first. Find your assigned task below. Load the context docs listed. Execute. Check the boxes when done.
**Orchestrator (me):** Creates tasks from audits, planning, and human requests. Verifies completion. Removes shipped work.
**Human:** Picks which task to send to Codex. Bridges orchestrator and Codex.

---

## Launch Blockers

> These must be resolved before going live. Sensitive — Codex flags approach, human approves.

- [ ] **LAUNCH-001:** Verify Stripe webhook idempotency — no duplicate orders on replay
  - Context: `docs/features/checkout-payments.md`
  - Done: replay same `checkout.session.completed` event twice → second is no-op, order count unchanged

- [ ] **LAUNCH-002:** Test refund/dispute flow end-to-end
  - Context: `docs/features/checkout-payments.md`
  - Done: trigger refund from Stripe dashboard → order status updates → buyer notified

- [ ] **LAUNCH-003:** Verify Stripe environment separation (prod keys + webhook secrets)
  - Context: `docs/features/checkout-payments.md`, `docs/STACK.md`
  - Done: prod and dev use separate Stripe accounts, no test keys in prod env

- [ ] **LAUNCH-004:** Enable leaked password protection + re-run Supabase Security Advisor
  - Context: `docs/features/auth.md`
  - Done: Supabase Security Advisor returns no critical findings

## Broken Areas

> Known broken areas from launch readiness assessment. Need audit + fix.

- [ ] **FIX-001:** Search is broken — needs investigation and repair
  - Context: `docs/features/search-filters.md`
  - Done: search returns relevant results, filters work, no console errors, mobile + desktop

- [ ] **FIX-002:** Sell flow UX is terrible — needs redesign
  - Context: `docs/features/sell-flow.md`
  - Done: seller can list a product end-to-end with clear UX, image upload works, form validation helpful

- [ ] **FIX-003:** Account settings broken on mobile, incomplete on desktop
  - Context: `docs/features/auth.md`, `docs/DESIGN.md`
  - Done: all settings accessible on mobile (375px), no overflow, no broken interactions

## Refactor

> Merged from refactor/CURRENT.md. Domains 1-5, 7 complete. Domain 6 blocked.

- [ ] **REFACTOR-001:** Domain 6 — lib/, actions/, api/ refactoring (auth/payment sensitive)
  - Context: `refactor/domains/06-lib-actions-api.md`
  - BLOCKED: Contains payment/auth action refactors. Needs human approval before execution.
  - Done: domain refactored per plan, verification passes, no auth/payment regressions

## Backlog

> Nice-to-haves. Not blocking launch but improve the product.

- [ ] **BACKLOG-001:** Checkout buyer protection UX (blocking/warning)
  - Context: `docs/features/checkout-payments.md`
  - Done: buyer protection fee visible before payment, clear explanation text

- [ ] **BACKLOG-002:** Buyer confirmation email on checkout completion
  - Context: `docs/features/checkout-payments.md`
  - Done: email sent with order summary, delivery estimate, seller info

- [ ] **BACKLOG-003:** PDP mobile seller bio surface
  - Context: `docs/features/product-cards.md`, `docs/DESIGN.md`
  - Done: seller name, avatar, rating, join date visible on mobile PDP

- [ ] **BACKLOG-004:** PDP report modal/flow (trust & safety)
  - Done: report button opens modal, user selects reason + submits, report stored in DB

- [ ] **BACKLOG-005:** Verify product data sanity — no test/dummy listings
  - Done: audit shows only real listings, categories make sense

## Mobile UI/UX Perfection Pass

> Full codebase audit + rework to make mobile (375px) feel polished, consistent, and premium.

- [x] **MOBILE-001:** Full mobile UI/UX audit and alignment pass
  - Context: `docs/DESIGN.md`, `docs/STACK.md`, `docs/features/product-cards.md`
  - Scope: every mobile-visible route and component at 375px viewport
  - See: `docs/MOBILE-UX-PERFECTION.md` for detailed spec and audit checklist
  - Done: all acceptance criteria in the spec doc are met, `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` pass

## Motion & Structure Pass

> Framer Motion animations + structural improvements. Second Codex pass after MOBILE-001.

- [x] **MOTION-001:** Motion & structure pass — Framer Motion polish + code improvements
  - Context: `docs/MOTION-STRUCTURE-SPEC.md`, `docs/DESIGN.md`, `docs/STACK.md`
  - Scope: MotionConfig provider, product grid stagger, drawer content entrance, category tab transitions, badge animations, sell flow improvement, CSS animation utilities
  - See: `docs/MOTION-STRUCTURE-SPEC.md` for full spec (Parts 1-8)
  - Done: all checkboxes in the spec doc are checked, `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` pass
  - NOT in scope: auth, payments, DB, drawer drag/slide, route transitions, new dependencies

## Audit Queue

> Tasks will be added here after each Playwright visual/functional audit.
> Next audit: full mobile (375px) + desktop (1280px) of all major flows.

*(Empty — first audit pending)*

---

## Codex Prompts (ready to paste)

**Single task:**
```
Read AGENTS.md. Then do task LAUNCH-001 from TASKS.md.
```

**Broken area batch:**
```
Read AGENTS.md. Do all unchecked tasks in the "Broken Areas" section of TASKS.md, top to bottom.
```

**Backlog item:**
```
Read AGENTS.md. Then do task BACKLOG-003 from TASKS.md.
```

---

*Last updated: 2026-02-23*
