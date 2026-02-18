# Tasks — Active

> Only open tasks. Completed work lives in git history.
> Each task has done criteria — verify before marking complete.

---

## Launch Readiness

| Area | Status | Notes |
|------|--------|-------|
| Auth (signup/login/reset/OAuth) | **Working** | Flows complete, `getUser()` enforced |
| Onboarding | **Working** | Wizard complete |
| Browse/Search/Filters | **Broken** | Search needs work, filters functional |
| Product Cards + Grid | **Working** | Mobile + desktop cards, grid responsive |
| PDP (Product Detail Page) | **Needs cleanup** | Functional but mobile polish needed |
| Sell Flow | **Broken** | Form works but UX is terrible — needs redesign |
| Cart + Wishlist | **Working** | Add/remove, drawers, persistence |
| Checkout + Payments | **Working** | Stripe Checkout functional, webhook idempotency unverified |
| Orders (buyer + seller) | **Working** | Lifecycle works, tracking functional |
| Chat/Messaging | **Semi-decent** | Real-time works, needs desktop polish |
| Plans + Subscriptions | **Scaffolded** | Pricing page exists, Stripe subscriptions wired |
| Boosts | **Working** | Purchase + display functional |
| Reviews | **Working** | Submit + display on PDP |
| Public Profiles | **Working** | `/[username]` with listings + reviews |
| Business Dashboard | **In progress** | Core CRUD, analytics scaffolded |
| Admin Panel | **Scaffolded** | Basic management, needs polish |
| Account/Settings | **Broken on mobile** | Desktop incomplete too |
| i18n (en/bg) | **Working** | Key parity enforced by test |
| Codebase health | **Refactoring** | 839 files, target <700. Batch 3 of 8. |

**Critical blockers before launch:** Search broken, Sell flow UX terrible, Account broken on mobile, 4 security items below.

---

## Gates

```bash
# After every change:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

# Business logic:
pnpm -s test:unit

# User flows:
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

## Launch Blockers

- [ ] **LAUNCH-001:** Verify Stripe webhook idempotency — no duplicate orders on replay
  - Done: replay same `checkout.session.completed` event twice, second is no-op, order count unchanged
- [ ] **LAUNCH-002:** Test refund/dispute flow end-to-end
  - Done: trigger refund from Stripe dashboard, verify order status updates, buyer notified
- [ ] **LAUNCH-003:** Verify Stripe environment separation (prod keys + webhook secrets)
  - Done: prod and dev use separate Stripe accounts, no test keys in prod env
- [ ] **LAUNCH-004:** Enable leaked password protection + re-run Supabase Security Advisor
  - Done: Supabase Security Advisor returns no critical findings

## Backlog

- [ ] **LAUNCH-007:** Verify product data sanity — no test/dummy listings, categorization sane
  - Done: manual audit shows only real listings, categories make sense
- [ ] **BACKLOG-005:** Checkout buyer blocking/warning (buyer protection UX)
  - Done: buyer protection fee visible before payment, clear explanation text
- [ ] **BACKLOG-006:** Buyer confirmation email on checkout completion
  - Done: email sent with order summary, delivery estimate, seller info
- [ ] **BACKLOG-007:** PDP mobile seller bio surface
  - Done: seller name, avatar, rating, join date visible on mobile PDP
- [ ] **BACKLOG-008:** PDP report modal/flow (trust & safety)
  - Done: report button opens modal, user can select reason + submit, report stored in DB

## Codebase Refactor

Active refactoring tracked in `refactor/CURRENT.md`.
Batches 0-2 complete. Batch 3 (large-screen decomposition) active.
For refactor execution order, metrics, and task status, `refactor/CURRENT.md` is authoritative.
`TASKS.md` remains launch-readiness SSOT and should not be used as the refactor queue.

*Last updated: 2026-02-18*
