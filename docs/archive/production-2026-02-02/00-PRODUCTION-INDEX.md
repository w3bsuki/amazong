# Production Push Plan — Treido V1 Launch

> **Goal:** Finalize codebase for production deployment. Align frontend/backend, complete refactors, achieve launch readiness.

| Status | Pre-Production |
|--------|----------------|
| Started | 2026-02-02 |
| Target | Production Launch |

---

## Quick Links

| Need | File |
|------|------|
| Master plan | [01-MASTERPLAN.md](./01-MASTERPLAN.md) |
| Feature alignment | [audits/feature-alignment.md](./audits/feature-alignment.md) |
| Frontend audit | [audits/frontend.md](./audits/frontend.md) |
| Backend audit | [audits/backend.md](./audits/backend.md) |
| UI/UX gaps | [audits/ui-ux.md](./audits/ui-ux.md) |
| Type safety | [audits/typescript.md](./audits/typescript.md) |
| Blocking issues | [blockers.md](./blockers.md) |
| Launch checklist | [checklist.md](./checklist.md) |

---

## Current State Summary

From `/docs/02-FEATURES.md`:

**Progress: 103/119 features (~87%)**

| Category | Done | WIP | Todo | % |
|----------|------|-----|------|---|
| Auth & Accounts | 8 | 0 | 0 | 100% |
| Cart & Checkout | 8 | 0 | 0 | 100% |
| Orders (Buyer) | 5 | 1 | 0 | 83% |
| Orders (Seller) | 5 | 1 | 0 | 83% |
| Selling | 7 | 0 | 1 | 88% |
| Payouts | 6 | 0 | 0 | 100% |
| Discovery | 6 | 1 | 0 | 86% |
| Product Pages | 7 | 0 | 1 | 88% |
| Wishlist | 4 | 0 | 1 | 80% |
| Messaging | 7 | 0 | 0 | 100% |
| Reviews | 8 | 0 | 0 | 100% |
| Profiles | 4 | 1 | 1 | 67% |
| Trust & Safety | 4 | 2 | 0 | 67% |
| Business Dashboard | 5 | 1 | 0 | 83% |
| Admin | 2 | 3 | 0 | 40% |
| i18n | 5 | 0 | 0 | 100% |
| Accessibility | 3 | 2 | 0 | 60% |
| Infrastructure | 6 | 0 | 0 | 100% |

---

## Production Push Phases

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| 1 | Parallel Audits | 🔄 In Progress | Subagent audits across all domains |
| 2 | Alignment | ⬜ Not Started | Fix frontend/backend mismatches |
| 3 | Refactor Completion | ⬜ Not Started | Complete remaining refactor items |
| 4 | UI/UX Polish | ⬜ Not Started | Visual consistency, a11y |
| 5 | Testing | ⬜ Not Started | Full E2E coverage verification |
| 6 | Launch Prep | ⬜ Not Started | Final gates, deployment readiness |

---

## Key Constraints

From project rails (`.github/copilot-instructions.md`):

### Non-Negotiable
- **Tailwind v4:** Semantic tokens only (no palette/gradients/arbitrary)
- **shadcn boundaries:** Primitives in `ui/`, composites in `shared/`
- **i18n:** All strings via `next-intl`
- **Routing:** Use `proxy.ts`, no root `middleware.ts`
- **Supabase:** RLS everywhere

### Human Approval Required
- Database schema/migrations/RLS
- Auth/access control changes
- Payments/Stripe/billing
- Data deletion

---

## Folder Structure

```
/production/
├── 00-PRODUCTION-INDEX.md    # This file
├── 01-MASTERPLAN.md          # Detailed production plan
├── audits/                   # Domain-specific audit outputs
│   ├── feature-alignment.md  # Docs vs codebase alignment
│   ├── frontend.md           # Frontend audit results
│   ├── backend.md            # Backend audit results
│   ├── ui-ux.md              # UI/UX gaps
│   └── typescript.md         # Type safety issues
├── blockers.md               # Launch blocking issues
└── checklist.md              # Final launch checklist
```

---

*Created: 2026-02-02*
