# DEV-DEPARTMENT.md — Ownership (V4)

> Treido ships through a single implementation workflow. “Departments” are responsibility zones, not separate executors.

| Scope | Ownership + how we ship |
|-------|--------------------------|
| Audience | Developers, maintainers |
| Type | Reference |

---

## Principles

- **Small batches**: 1–3 files per implementation batch + verification
- **Rails first**: Tailwind tokens, next-intl, shadcn boundaries, cached-server rules, no secrets/PII
- **Pause on high risk**: DB/auth/payments/destructive operations require explicit approval
- **Stable docs in `docs/`**; runtime state (optional) in `.codex/`

---

## Domains (Routing)

| Domain | Ownership | Owns |
|--------|-----------|------|
| Styling | Current implementer | Tailwind v4 semantic token rails + shadcn-safe patterns |
| UI/UX design | Current implementer | Hierarchy, spacing, states, polish |
| Next.js App Router | Current implementer | Route/layout boundaries, Server vs Client, cache-safe request patterns |
| Data + auth | Current implementer | Supabase client selection, query shape, auth/session boundaries |
| Payments | Current implementer | Checkout/webhooks/idempotency safety |
| Testing | Current implementer | Playwright + Next.js reliability and CI stability |
| Accessibility | Current implementer | WCAG 2.2 AA semantics, keyboard/focus, screen-reader support |

---

## Optional Runtime State

- `.codex/TASKS.md` — active task queue (only if you want a backlog)
- `.codex/DECISIONS.md` — decision log (only if you need traceability)
- `.codex/SHIPPED.md` — shipped log

---

## See Also

- [AGENTS.md](./AGENTS.md) — entry point + non-negotiables
- [WORKFLOW.md](./WORKFLOW.md) — default shipping loop

