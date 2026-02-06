# AGENT-MAP.md — Intent to Skill Routing

> Quick router for humans and agents. Use this when deciding which specialist to apply first.

| Intent | Primary Skill | Secondary Skills | Notes |
|-------|---------------|------------------|-------|
| Repo rails, pause conditions, safety checks | `treido-rails` | — | Always apply first |
| UI hierarchy, spacing, states, visual polish | `treido-design` | `treido-ui-ux-pro-max`, `treido-accessibility` | Product/UI only |
| Mobile behavior, touch targets, safe-area, native feel | `treido-mobile-ux` | `treido-design`, `treido-accessibility` | Mobile-first surfaces |
| App Router, RSC/client boundaries, caching | `treido-nextjs-16` | `treido-structure` | `proxy.ts` conventions |
| Tailwind v4 token compliance | `treido-tailwind-v4` | `treido-tailwind-v4-shadcn` | No palette/arbitrary/gradients |
| shadcn primitive composition and boundaries | `treido-shadcn-ui` | `treido-tailwind-v4` | `components/ui/*` only |
| i18n/next-intl copy and locale hygiene | `treido-i18n` | `treido-rails` | No hardcoded user copy |
| Supabase query shape, RLS-safe patterns | `treido-supabase` | `treido-auth-supabase` | Explicit selects on hot paths |
| Auth/session boundaries (Supabase + Next.js) | `treido-auth-supabase` | `treido-nextjs-16` | Protected routes/session flow |
| Payments/webhooks/idempotency | `treido-stripe` | `treido-backend` | Signature + idempotency required |
| Test strategy, E2E stability, deflaking | `treido-testing` | — | Verification-focused |
| File placement / module boundaries | `treido-structure` | `treido-nextjs-16` | Keep boundaries strict |
| Frontend task orchestration | `treido-frontend` | All frontend specialists | Routing skill only |
| Backend task orchestration | `treido-backend` | Supabase/Auth/Stripe | Routing skill only |
| Skill system maintenance | `treido-skillsmith` | `treido-rails` | `.codex/skills` governance |

---

## Decision Rule

1. Pick one primary skill based on the highest-risk domain.
2. Add only the minimal secondary skills needed for correctness.
3. If task crosses DB/auth/payments, apply `treido-rails` pause rules.

---

*Last updated: 2026-02-06*
