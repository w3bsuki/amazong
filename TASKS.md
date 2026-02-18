# Tasks — Active

> Only open tasks. Completed work lives in git history.

## Gates

```bash
# After every change:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

# Business logic:
pnpm -s test:unit

# User flows:
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# Weekly + before deploy:
pnpm -s knip && pnpm -s dupes
```

## 🔥 Launch Blockers

- [ ] LAUNCH-001: Verify Stripe webhook idempotency (no duplicate orders on replay)
- [ ] LAUNCH-002: Test refund/dispute flow end-to-end
- [ ] LAUNCH-003: Verify Stripe environment separation (prod keys + webhook secrets)
- [ ] LAUNCH-004: Enable leaked password protection + re-run Supabase Security Advisor

## 📋 Active

- [ ] LAUNCH-007: Verify product data sanity (no test/dummy listings; categorization sane)
- [ ] BACKLOG-005: Checkout buyer blocking/warning (buyer protection UX)
- [ ] BACKLOG-006: Buyer confirmation email on checkout completion
- [ ] BACKLOG-007: PDP mobile seller bio surface
- [ ] BACKLOG-008: PDP report modal/flow (trust & safety)

## 🔧 Codebase Refactor

Active refactoring tracked in `refactor/CURRENT.md`.
Phases 1-2 complete. Phase 3 (Data & Performance) is next.
Full knowledge base in `REFACTOR.md`. Session history in `refactor/log.md`.

*Last updated: 2026-02-17*
