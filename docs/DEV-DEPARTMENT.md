# DEV-DEPARTMENT.md — Ownership (V4)

> Treido is a single-user chat with a minimal set of always-on rails. “Roles” are just a routing mental model.

| Scope | Ownership + how we ship |
|-------|--------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Principles

- **Small batches**: 1–3 files per implementation batch + verification
- **Rails first**: Tailwind tokens, next-intl, shadcn boundaries, cached-server rules, no secrets/PII
- **Pause on high risk**: DB/auth/payments/destructive operations require explicit approval
- **Stable docs in `docs/`**; runtime state (optional) in `.codex/`

---

## Domains (Routing)

| Domain | Skill | Owns |
|--------|-------|------|
| Rails (always-on) | `treido-rails` | Non-negotiables + pause conditions |
| UI/UX design | `treido-design` | Hierarchy, spacing, states, polish |
| Mobile UX | `treido-mobile-ux` | Touch, safe areas, dvh/viewport, native feel |
| Next.js 16 | `treido-nextjs-16` | App Router, caching, RSC/client boundaries |
| Tailwind v4 | `treido-tailwind-v4` | Token rails + forbidden patterns |
| shadcn/ui | `treido-shadcn-ui` | UI primitives boundaries + composition |
| Supabase | `treido-supabase` | SSR clients, queries, RLS mindset |
| Stripe | `treido-stripe` | Webhooks, idempotency, payments safety |
| Structure | `treido-structure` | File placement + boundaries |
| Skill system | `treido-skillsmith` | `.codex/skills/**` + docs + tooling |

---

## Optional Runtime State

- `.codex/TASKS.md` — active task queue (only if you want a backlog)
- `.codex/DECISIONS.md` — decision log (only if you need traceability)
- `.codex/SHIPPED.md` — shipped log

---

## See Also

- [AGENTS.md](./AGENTS.md) — entry point + non-negotiables
- [WORKFLOW.md](./WORKFLOW.md) — default shipping loop
- [SKILLS.md](./SKILLS.md) — skill inventory

