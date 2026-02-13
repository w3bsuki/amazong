# QUALITY_SCORE.md — Domain Quality Grades

> Grades each product domain and architectural layer, tracking gaps over time.
> Modeled after OpenAI's quality scoring pattern from Harness Engineering.

| Last reviewed | 2026-02-12 |
|---------------|------------|
| Grading scale | A (production-ready) · B (functional, minor gaps) · C (works, known issues) · D (incomplete) · F (broken/missing) |

---

## Product Domains

| Domain | Grade | Test Coverage | Docs | UX Polish | Notes |
|--------|-------|---------------|------|-----------|-------|
| Auth (signup/login) | B | Unit ✓ E2E ✓ | AUTH.md ✓ | Good | OAuth not yet live |
| Onboarding | C | Unit partial | features/onboarding.md ✓ | Basic | Needs mobile polish |
| Search & Discovery | B | Unit ✓ | features/search-discovery.md ✓ | Good | Full-text + filters working |
| Product Detail | B | Unit ✓ | — | Good | Missing review aggregation |
| Cart & Checkout | B | Unit ✓ | PAYMENTS.md ✓ | Good | Stripe checkout working |
| Selling / Listings | B | Unit ✓ E2E ✓ | features/selling.md ✓ | Good | Image upload stable |
| Orders | C | Unit partial | — | Basic | Status tracking simple |
| Chat / Messaging | C | Unit partial | features/chat.md ✓ | Basic | Real-time needs work |
| Subscriptions / Plans | C | Unit partial | features/monetization.md ✓ | Basic | Stripe sub lifecycle working |
| Profile / Settings | B | Unit ✓ | — | Good | — |
| Wishlists | C | Unit partial | — | Basic | Production audit pending |
| Admin Panel | D | — | — | Minimal | Scaffolded, not production-ready |
| Notifications | D | — | — | Minimal | Basic in-app only |

---

## Architectural Layers

| Layer | Grade | Notes |
|-------|-------|-------|
| Type Safety | A | Strict TypeScript, Zod validation at boundaries |
| Database Schema | B | 60+ tables, RLS enabled, 870+ migrations |
| API / Server Actions | B | Consistent patterns, auth guards |
| UI Component Library | B | shadcn/ui + shared composites, token-compliant |
| i18n | B | Full coverage en/bg, parity test exists |
| Testing (Unit) | C | 80%+ on touched files, but coverage uneven |
| Testing (E2E) | C | Smoke suite + seller routes, gaps in buyer flows |
| Observability | D | Basic error logging only, no structured telemetry |
| CI / Deployment | C | Vercel deploy, manual gates, no automated PR checks |
| Documentation | A- | Canonical docs reset complete (EP-002), docs-site generated-only, freshness + contract gates active; metadata backfill still in progress |

---

## Improvement Priorities

Based on grades, ordered by impact:

1. **Observability (D→B)** — Add structured logging, error tracking
2. **Admin Panel (D→C)** — Basic CRUD for user/product management
3. **Notifications (D→C)** — Email notifications for orders
4. **E2E Coverage (C→B)** — Buyer flow E2E tests
5. **CI Automation (C→B)** — PR-level gate checks

---

## Update Cadence

- Review grades weekly during sprint planning
- Update after completing any feature or infrastructure work
- Agents should check this before starting a task to understand domain maturity

---

*Last updated: 2026-02-12*
