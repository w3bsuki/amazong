# 00-INDEX.md — Treido Documentation Hub

> **Agent Entry Point.** Start here to find any doc.

| Scope | Entire Treido platform |
|-------|------------------------|
| Audience | AI agents, developers |
| Type | Index |

---

## Quick Links

| Need | Doc |
|------|-----|
| **How to prompt AI** | [PROMPT-GUIDE.md](./PROMPT-GUIDE.md) |
| **Agent entry point** | [AGENTS.md](./AGENTS.md) |
| **Agent workflow** | [WORKFLOW.md](./WORKFLOW.md) |
| Agent fleet roadmap | [agents/AGENTS_PHASES.md](./agents/AGENTS_PHASES.md) |
| Docs system plan | [DOCS-PLAN.md](./DOCS-PLAN.md) |
| What is Treido? | [01-PRD.md](./01-PRD.md) |
| What's built? | [02-FEATURES.md](./02-FEATURES.md) |
| How is it structured? | [03-ARCHITECTURE.md](./03-ARCHITECTURE.md) |
| How to style? | [04-DESIGN.md](./04-DESIGN.md) |
| What routes exist? | [05-ROUTES.md](./05-ROUTES.md) |
| Database schema? | [06-DATABASE.md](./06-DATABASE.md) |
| Server actions? | [07-API.md](./07-API.md) |
| Payments? | [08-PAYMENTS.md](./08-PAYMENTS.md) |
| Auth flows? | [09-AUTH.md](./09-AUTH.md) |
| i18n setup? | [10-I18N.md](./10-I18N.md) |
| AI Skills? | [11-SKILLS.md](./11-SKILLS.md) |
| Launch checklist? | [12-LAUNCH.md](./12-LAUNCH.md) |
| Production push plan | [13-PRODUCTION-PUSH.md](./13-PRODUCTION-PUSH.md) |

---

## Doc Map

| # | Doc | Type | Purpose | Status |
|---|-----|------|---------|--------|
| — | [PROMPT-GUIDE.md](./PROMPT-GUIDE.md) | How-To | How to prompt AI | ✅ |
| — | [AGENTS.md](./AGENTS.md) | Reference | Agent entry + rails | ✅ |
| — | [WORKFLOW.md](./WORKFLOW.md) | Reference | Agent workflow | ✅ |
| — | [DOCS-PLAN.md](./DOCS-PLAN.md) | Reference | Documentation system plan | ✅ |
| 0 | [00-INDEX.md](./00-INDEX.md) | Index | Entry point | ✅ |
| 1 | [01-PRD.md](./01-PRD.md) | Concept | Product vision & scope | ✅ |
| 2 | [02-FEATURES.md](./02-FEATURES.md) | Reference | Feature checklist | ✅ |
| 3 | [03-ARCHITECTURE.md](./03-ARCHITECTURE.md) | Concept | System design | ✅ |
| 4 | [04-DESIGN.md](./04-DESIGN.md) | Concept | UI/UX rules | ✅ |
| 5 | [05-ROUTES.md](./05-ROUTES.md) | Reference | Route map | ✅ |
| 6 | [06-DATABASE.md](./06-DATABASE.md) | Reference | Schema & RLS | ✅ |
| 7 | [07-API.md](./07-API.md) | Reference | Endpoints & actions | ✅ |
| 8 | [08-PAYMENTS.md](./08-PAYMENTS.md) | How-To | Stripe flows | ✅ |
| 9 | [09-AUTH.md](./09-AUTH.md) | How-To | Auth implementation | ✅ |
| 10 | [10-I18N.md](./10-I18N.md) | Reference | Locale setup | ✅ |
| 11 | [11-SKILLS.md](./11-SKILLS.md) | Reference | AI agents | ✅ |
| 12 | [12-LAUNCH.md](./12-LAUNCH.md) | Reference | Launch ops | ✅ |
| 13 | [13-PRODUCTION-PUSH.md](./13-PRODUCTION-PUSH.md) | Plan | V1 ship plan | ✅ |

---

## Project At-a-Glance

```
Product:  Treido — Bulgarian-first marketplace (C2C + B2B/B2C)
Stack:    Next.js 16 + React 19 + Tailwind v4 + Supabase + Stripe
Status:   ~86% V1 complete (see 02-FEATURES.md)
```

### Core Flows

```
┌─────────────────────────────────────────────────────────────────┐
│                        TREIDO PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│  BUYER FLOW                                                     │
│  Browse → Search → View → Cart → Checkout → Order → Review     │
├─────────────────────────────────────────────────────────────────┤
│  SELLER FLOW                                                    │
│  Auth → Onboard → Connect Setup → Create Listing → Manage       │
│  Orders → Ship → Get Paid                                       │
├─────────────────────────────────────────────────────────────────┤
│  BUSINESS FLOW                                                  │
│  Register → Verify → Subscribe → Dashboard → Analytics          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Operational State (Runtime)

| Resource | Location | Purpose |
|----------|----------|--------|
| Active tasks | `.codex/TASKS.md` | Current work queue |
| Shipped log | `.codex/SHIPPED.md` | Completed work |
| Decisions | `.codex/DECISIONS.md` | ADR log |
| Skills | `.codex/skills/` | Full skill definitions |
| Debate thread | `.codex/CONVERSATION.md` | Active discussion |

## Other Resources

| Resource | Location |
|----------|----------|
| UI refactor docs | `docs/archive/uirefactor/` (historical) |
| Refactor snapshots | `docs/archive/refactor-2026-02-02/` |
| Production snapshots | `docs/archive/production-2026-02-02/` |
| Public docs | `docs-site/` (customer-facing) |
| E2E tests | `e2e/` |
| Unit tests | `__tests__/` |

---

## Glossary

| Term | Definition |
|------|------------|
| **RLS** | Row Level Security (Supabase) |
| **PDP** | Product Detail Page |
| **Connect** | Stripe Connect (payouts) |
| **BP Fee** | Buyer Protection Fee |
| **SSOT** | Single Source of Truth |
| **C2C** | Consumer to Consumer |
| **B2B/B2C** | Business to Business/Consumer |

---

*Last updated: 2026-02-02*
