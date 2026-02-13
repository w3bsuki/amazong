# PLANS.md — Planning & Priorities

> Current priorities, active initiatives, and planning context.
> For execution details on specific plans, see `docs/exec-plans/active/`.

| Last updated | 2026-02-12 |
|--------------|------------|

---

## Current Phase

**Production hardening.** The app is functionally complete for core flows (auth, browse,
sell, buy, checkout, orders, chat, subscriptions). Focus is now on:

1. Polish & mobile UX quality
2. Production audit evidence (production-audit/)
3. Reliability gaps (error handling, edge cases)
4. Documentation alignment

---

## Active Priorities (ordered)

| Priority | Area | Description | Tracking |
|----------|------|-------------|----------|
| P0 | Production | Complete production audit phases | `production-audit/` |
| P0 | Reliability | Error boundaries, loading states, edge cases | TASKS.md |
| P1 | UX | Mobile polish, touch confidence, animation | TASKS.md |
| P1 | Testing | E2E coverage for buyer flows | TASKS.md |
| P2 | Observability | Structured logging, error tracking | QUALITY_SCORE.md |
| P2 | Admin | Basic admin panel for moderation | QUALITY_SCORE.md |
| P3 | Growth | Notification system (email + in-app) | REQUIREMENTS.md |

---

## Planning Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Sprint queue | `TASKS.md` (root) | ≤20 active tasks |
| Feature requirements | `REQUIREMENTS.md` (root) | 119 features with R{n}.{m} IDs |
| Execution plans | `docs/exec-plans/active/` | Multi-step initiatives |
| Completed plans | `docs/exec-plans/completed/` | Historical reference |
| Tech debt | `docs/exec-plans/tech-debt-tracker.md` | Known debt inventory |
| Quality grades | `docs/QUALITY_SCORE.md` | Domain maturity heat map |
| Production status | `docs/PRODUCTION.md` | Launch readiness checklist |

---

## Decision Framework

For prioritization decisions:

1. **Safety/correctness** > features (fix bugs before adding features)
2. **Core flows** > edge cases (auth, buy, sell, checkout must work)
3. **Mobile** > desktop (majority of target users)
4. **Mechanical enforcement** > documentation (tests > prose)
5. **Revenue-enabling** > nice-to-have (buyer protection, subscriptions)

---

*Last updated: 2026-02-12*
