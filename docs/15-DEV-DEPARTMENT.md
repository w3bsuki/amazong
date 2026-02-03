# 15-DEV-DEPARTMENT.md — Ownership (V2)

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
| Rails (always-on) | `treido-rails` | Boundaries, pause conditions, verification gates |
| Frontend | `treido-frontend` | UI, routes, RSC/client boundaries, Tailwind tokens, i18n |
| Backend | `treido-backend` | Server actions, Supabase queries/RLS, Stripe/webhooks, caching/tagging |
| Skill system | `codex-iteration` | `.codex/skills/**` + skill tooling |

---

## Optional Runtime State

- `.codex/TASKS.md` — active task queue (only if you want a backlog)
- `.codex/DECISIONS.md` — decision log (only if you need traceability)
- `.codex/SHIPPED.md` — shipped log

---

## See Also

- [AGENTS.md](./AGENTS.md) — entry point + non-negotiables
- [WORKFLOW.md](./WORKFLOW.md) — default shipping loop
- [11-SKILLS.md](./11-SKILLS.md) — skill inventory
