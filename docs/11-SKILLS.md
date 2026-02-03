# 11-SKILLS.md — Treido Skill Fleet (V4)

> Treido-maintained skills are **specialists** and always prefixed `treido-*`. Ask in plain language; the assistant should apply the relevant specialist skills.

| Scope | AI agent knowledge |
|-------|---------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Active Skills (18 total)

### Always-on rails

| Skill | Use For |
|------|---------|
| `treido-rails` | Non-negotiables + pause conditions (PII, i18n, token rails, caching constraints) |

### UI/UX

| Skill | Use For |
|------|---------|
| `treido-design` | UI/UX design specs, hierarchy, states, “anti-slop” polish |
| `treido-ui-ux-pro-max` | Deep UI/UX guidance for building/reviewing premium UI (Tailwind v4 + shadcn/ui) |
| `treido-mobile-ux` | Touch targets, safe areas, dvh/viewport issues, native-app interaction feel |
| `treido-accessibility` | WCAG 2.2 AA, ARIA patterns, focus/keyboard navigation, screen reader support |

### Frontend stack specialists

| Skill | Use For |
|------|---------|
| `treido-nextjs-16` | App Router, RSC vs client boundaries, caching (`'use cache'`), routing conventions |
| `treido-tailwind-v4` | Tailwind v4 token usage, forbidden patterns, globals.css mapping |
| `treido-tailwind-v4-shadcn` | Tailwind v4 + shadcn integration, templates, and known gotchas |
| `treido-shadcn-ui` | `components/ui/*` boundaries, CVA variants, Radix composition |
| `treido-i18n` | next-intl copy, translation structure, and hardcoded-string detection |

### Backend stack specialists

| Skill | Use For |
|------|---------|
| `treido-supabase` | SSR clients, RLS-safe queries, explicit selects, schema/RLS guardrails |
| `treido-auth-supabase` | Supabase Auth + Next.js App Router session patterns |
| `treido-stripe` | Webhooks correctness (signature + idempotency), payment flow safety |

### Testing

| Skill | Use For |
|------|---------|
| `treido-testing` | Playwright E2E patterns, selectors, auth state, deflaking, CI stability |

### Orchestrators (routing only)

| Skill | Use For |
|------|---------|
| `treido-frontend` | Route UI tasks to the correct UI specialists |
| `treido-backend` | Route backend/auth/payments tasks to the correct specialists |

### Repo structure + maintenance

| Skill | Use For |
|------|---------|
| `treido-structure` | File placement, boundaries, naming, imports |
| `treido-skillsmith` | Skill system maintenance (skills + docs + tooling) |

---

## How to Use (No Magic Phrases)

- “Make this screen feel like a native iOS app” → `treido-mobile-ux` + `treido-design` (+ `treido-tailwind-v4`)
- “Add a cached public product fetch” → `treido-nextjs-16` + `treido-supabase`
- “Fix a Tailwind violation” → `treido-tailwind-v4`
- “Create a new UI primitive” → `treido-shadcn-ui` (+ `treido-tailwind-v4`)

---

## Where Commands Live

Skills avoid command spam by design. Verification gates and exact commands live in:

- `docs/WORKFLOW.md`

---

## Legacy Skills

Legacy skill artifacts are intentionally removed to keep the fleet small and current.

---

*Last updated: 2026-02-03*
