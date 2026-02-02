# PROMPT-GUIDE.md — How to Prompt AI Agents

> **Master guide for humans.** Use this every time you prompt an AI agent on Treido.

| Scope | Human → AI communication |
|-------|-------------------------|
| Audience | Developers, product owners |
| Type | How-To |

---

## TL;DR (5 Rules)

1. **Pick a lane** — UI, Frontend, Backend, Supabase, or Full (`ORCH:`)
2. **Cite docs** — Always reference the relevant `/docs/*.md` files
3. **Follow the loop** — AUDIT → IMPL → VERIFY
4. **State done criteria** — What does "done" look like?
5. **Name paths** — Be specific about files/routes you want changed

---

## The Treido Prompt Packet

**Copy this template every time you prompt:**

```
<LANE: ORCH | UI | FRONTEND | BACKEND | SUPABASE | VERIFY>

Goal:
<What you want to achieve in 1-2 sentences>

Context:
<Relevant paths, links, or reproduction steps>

Docs to follow:
<List the /docs/*.md files that apply>

Deliverables:
<Exact outputs expected — files, behavior, etc.>

Verification:
<Gates or tests to run: typecheck, lint, styles:gate, test:unit>
```

### Example Prompts

**UI Polish:**
```
UI:

Goal: Fix the mobile product card spacing and ensure consistent shadows

Context:
- components/shared/product/product-card.tsx
- See current mobile view at /en/category/electronics

Docs to follow:
- /docs/04-DESIGN.md (spacing tokens, shadow rules)
- /docs/03-ARCHITECTURE.md (component boundaries)

Deliverables:
- Updated product-card.tsx with proper spacing
- No arbitrary Tailwind values

Verification:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

**New Page:**
```
FRONTEND:

Goal: Create the /account/notifications page

Context:
- Similar to /account/orders structure
- Route group: (account)

Docs to follow:
- /docs/05-ROUTES.md (route conventions)
- /docs/04-DESIGN.md (UI patterns)
- /docs/10-I18N.md (translations)

Deliverables:
- app/[locale]/(account)/account/notifications/page.tsx
- messages/en.json + messages/bg.json entries

Verification:
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

**Database Change:**
```
BACKEND:

Goal: Add a "saved_searches" table for users

Context:
- Users want to save search queries and get notifications
- Similar to wishlist pattern

Docs to follow:
- /docs/06-DATABASE.md (schema conventions)
- /docs/03-ARCHITECTURE.md (RLS requirements)

Deliverables:
- Migration SQL
- RLS policies
- TypeScript types

Verification:
Test RLS with different user roles
```

**Full Audit:**
```
ORCH:

Goal: Full audit of the checkout flow

Context:
- Users reporting intermittent errors
- app/[locale]/(checkout)/**

Docs to follow:
- /docs/08-PAYMENTS.md
- /docs/07-API.md
- /docs/03-ARCHITECTURE.md

Deliverables:
- Merged audit file in .codex/audit/
- Prioritized tasks in .codex/TASKS.md

Verification:
All gates + E2E smoke tests
```

---

## Work Routing Matrix

| Work Type | Required Docs | Audit Skills | Executor | Verify | Typical Output |
|-----------|---------------|--------------|----------|--------|----------------|
| **UI polish** | [04-DESIGN](./04-DESIGN.md) | `spec-tailwind` + `spec-shadcn` | `treido-ui` | Gates | Component fixes |
| **New component** | [04-DESIGN](./04-DESIGN.md), [03-ARCH](./03-ARCHITECTURE.md) | `spec-tailwind` + `spec-shadcn` | `treido-frontend` | Gates | New files |
| **New page/route** | [05-ROUTES](./05-ROUTES.md), [03-ARCH](./03-ARCHITECTURE.md) | `spec-nextjs` | `treido-frontend` | Gates + E2E | Page + route |
| **Server action** | [07-API](./07-API.md), [03-ARCH](./03-ARCHITECTURE.md) | `spec-nextjs` + `spec-supabase` | `treido-backend` | Gates + Unit | Action file |
| **Webhook** | [08-PAYMENTS](./08-PAYMENTS.md), [07-API](./07-API.md) | `spec-supabase` | `treido-backend` | Gates + Unit | Handler file |
| **DB/RLS** | [06-DATABASE](./06-DATABASE.md) | `spec-supabase` | `treido-backend` | RLS tests | Migration |
| **Auth flow** | [09-AUTH](./09-AUTH.md) | `spec-supabase` + `spec-nextjs` | `treido-backend` | E2E | Auth changes |
| **i18n** | [10-I18N](./10-I18N.md) | — | `treido-frontend` | Gates | Message files |
| **Full audit** | [00-INDEX](./00-INDEX.md) (all) | ALL specialists | Both lanes | All gates | Audit + tasks |
| **Verify only** | — | — | `treido-verify` | Specified | Report |

---

## Decision Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                    WHAT DO YOU NEED?                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ UI/Style │          │ Backend │          │ Full    │
   │ Changes  │          │  Data   │          │ Audit   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ UI: or  │          │BACKEND: │          │ ORCH:   │
   │FRONTEND:│          │         │          │         │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ 04-DESIGN.md │    │ 06-DATABASE  │    │ 00-INDEX.md  │
│ 03-ARCH.md   │    │ 07-API.md    │    │ (all docs)   │
└──────┬───────┘    │ 08-PAYMENTS  │    └──────┬───────┘
       │            └──────┬───────┘           │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ spec-tailwind│    │ spec-supabase│    │ ALL specs    │
│ spec-shadcn  │    │ spec-nextjs  │    │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ treido-ui or │    │treido-backend│    │ Both lanes   │
│treido-frontend│   │              │    │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                    ┌─────────────┐
                    │treido-verify│
                    │   + gates   │
                    └─────────────┘
```

---

## Lane Triggers

| Lane | Trigger | When to Use |
|------|---------|-------------|
| Orchestrator | `ORCH:` | Multi-lane work, full audits, complex tasks |
| UI Design | `UI:` or `DESIGN:` | Pixel-perfect, visual polish, modern UI |
| Frontend | `FRONTEND:` | Components, routes, client-side logic |
| Backend | `BACKEND:` | Server actions, webhooks, DB operations |
| Verify | `VERIFY:` | Run gates, tests, validate changes |

### Specialist Triggers (Audit-Only)

| Specialist | Trigger | Domain |
|------------|---------|--------|
| Next.js | `SPEC-NEXTJS:AUDIT` | App Router, RSC, caching |
| Tailwind | `SPEC-TAILWIND:AUDIT` | Tailwind v4 tokens |
| shadcn | `SPEC-SHADCN:AUDIT` | shadcn/ui boundaries |
| Supabase | `SPEC-SUPABASE:AUDIT` | RLS, queries, migrations |
| TypeScript | `SPEC-TYPESCRIPT:AUDIT` | Type safety |

---

## What "Done" Looks Like

### UI Lane ✓
- [ ] No arbitrary Tailwind values
- [ ] Uses design tokens from `04-DESIGN.md`
- [ ] Mobile-first responsive
- [ ] `pnpm -s styles:gate` passes
- [ ] `pnpm -s typecheck` passes
- [ ] `pnpm -s lint` passes

### Frontend Lane ✓
- [ ] Server Components by default
- [ ] `"use client"` only when needed
- [ ] i18n strings in `messages/*.json`
- [ ] Route follows `05-ROUTES.md` conventions
- [ ] All gates pass

### Backend Lane ✓
- [ ] RLS policies in place
- [ ] No `select('*')` in hot paths
- [ ] Webhooks idempotent + signature-verified
- [ ] Zod validation on inputs
- [ ] Unit tests for critical paths
- [ ] All gates pass

### Full Audit ✓
- [ ] Merged audit in `.codex/audit/`
- [ ] Tasks in `.codex/TASKS.md`
- [ ] No P0/P1 findings unaddressed
- [ ] Verify report attached

---

## Anti-Patterns (Don't Do This)

| Bad | Why | Good |
|-----|-----|------|
| "Fix the UI" | Too vague | "Fix spacing in product-card.tsx per 04-DESIGN.md" |
| No paths specified | Agent guesses wrong | "components/shared/product/product-card.tsx" |
| Skip verification | Broken code ships | "Run: pnpm -s typecheck && pnpm -s lint" |
| Mix lanes | Conflicts | Use `ORCH:` for multi-lane work |
| No docs cited | Rules ignored | "Follow /docs/04-DESIGN.md" |
| "Make it pretty" | Subjective | "Apply shadcn card pattern with semantic tokens" |

---

## Quick Reference Commands

```bash
# All gates (run after every change)
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

# Unit tests
pnpm -s test:unit

# E2E smoke (requires dev server)
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# Weekly cleanup
pnpm -s knip && pnpm -s dupes
```

---

## File Locations

| What | Where |
|------|-------|
| Project docs | `/docs/` |
| Active tasks | `.codex/TASKS.md` |
| Shipped work | `.codex/SHIPPED.md` |
| Decisions | `.codex/DECISIONS.md` |
| Skills | `.codex/skills/` |
| Debate | `.codex/CONVERSATION.md` |

---

## See Also

- [AGENTS.md](./AGENTS.md) — Agent entry point + rails
- [WORKFLOW.md](./WORKFLOW.md) — Phase lifecycle
- [00-INDEX.md](./00-INDEX.md) — All docs index

---

*Last updated: 2026-02-01*
