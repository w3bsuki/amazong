# SKILLS.md — Treido Skill Fleet

> Canonical skill inventory generated from `.codex/skills/*`.

| Scope | AI skills and routing surfaces |
|-------|--------------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Active Skills (18)

| Skill | Description | File |
|------|-------------|------|
| `treido-accessibility` | Accessibility specialist for Treido. Use for WCAG 2.2 AA compliance, ARIA patterns, keyboard navigation, focus management, and screen reader support. | `.codex/skills/treido-accessibility/SKILL.md` |
| `treido-auth-supabase` | Supabase Auth + Next.js App Router specialist for Treido. Use for session/cookie flows, protected routes, and choosing the correct Supabase client. Not for payments or DB migrations/RLS changes. | `.codex/skills/treido-auth-supabase/SKILL.md` |
| `treido-backend` | Backend orchestrator for Treido. Use to route data/auth/payments work to the right specialist (Supabase, auth, Stripe, caching/Next.js server patterns). | `.codex/skills/treido-backend/SKILL.md` |
| `treido-design` | UI/UX design specialist for Treido (Next.js + shadcn/ui + Tailwind v4 tokens). Use for layout, hierarchy, component specs, states, and native-app-feel reviews. Not for DB/auth/Stripe implementation. | `.codex/skills/treido-design/SKILL.md` |
| `treido-frontend` | Frontend orchestrator for Treido. Use to route UI work to the right specialist (Next.js, Tailwind, shadcn/ui, design, mobile UX, accessibility, i18n). | `.codex/skills/treido-frontend/SKILL.md` |
| `treido-i18n` | next-intl i18n specialist for Treido. Use for translation structure, hardcoded-string detection, locale hygiene, and RTL/formatting concerns. | `.codex/skills/treido-i18n/SKILL.md` |
| `treido-mobile-ux` | Mobile UX specialist for Treido. Use for viewport (dvh/safe-area), touch targets, mobile navigation/drawers, gestures, and “native app feel” behavior. Not for desktop-only UI. | `.codex/skills/treido-mobile-ux/SKILL.md` |
| `treido-nextjs-16` | Next.js 16 App Router specialist for Treido. Use for routing, layouts, Server vs Client Components, caching ('use cache'), and request entrypoints (proxy.ts). Not for styling. | `.codex/skills/treido-nextjs-16/SKILL.md` |
| `treido-rails` | Treido non-negotiables and safety rails. Use for pause conditions (DB/auth/payments), security/PII rules, i18n, Tailwind token rails, and caching constraints. | `.codex/skills/treido-rails/SKILL.md` |
| `treido-shadcn-ui` | shadcn/ui specialist for Treido. Use for Radix composition, CVA variants, component boundaries, and token-safe Tailwind v4 usage. Not for product/business logic. | `.codex/skills/treido-shadcn-ui/SKILL.md` |
| `treido-skillsmith` | Skill-system maintainer for Treido. Use to create/merge/trim skills, enforce treido-* naming, and keep `.codex/skills` minimal and consistent. | `.codex/skills/treido-skillsmith/SKILL.md` |
| `treido-stripe` | Stripe integration specialist for Treido. Use for Checkout sessions, PaymentIntents, webhooks, idempotency, and go-live safety. Not for UI styling. | `.codex/skills/treido-stripe/SKILL.md` |
| `treido-structure` | Treido project structure specialist. Use for file placement, boundaries, naming, and import organization. Not for feature implementation. | `.codex/skills/treido-structure/SKILL.md` |
| `treido-supabase` | Supabase + Postgres specialist for Treido. Use for RLS-safe query shape, selecting the correct client, and performance hygiene (explicit selects, avoid select('*')). Not for UI styling. | `.codex/skills/treido-supabase/SKILL.md` |
| `treido-tailwind-v4` | Tailwind CSS v4 specialist for Treido. Use for styling, token usage, and globals.css theme mappings. Not for component logic or data. | `.codex/skills/treido-tailwind-v4/SKILL.md` |
| `treido-tailwind-v4-shadcn` | Tailwind v4 + shadcn/ui specialist for Treido. Use for token/theme architecture, shadcn integration gotchas, and migration issues. Not for app logic or DB. | `.codex/skills/treido-tailwind-v4-shadcn/SKILL.md` |
| `treido-testing` | Testing specialist for Treido (Playwright + Next.js). Use for writing/debugging E2E tests, deflaking, selectors, auth state, parallel execution, and CI stability. | `.codex/skills/treido-testing/SKILL.md` |
| `treido-ui-ux-pro-max` | UI/UX design intelligence tuned for Treido (Next.js + shadcn/ui + Tailwind v4 tokens). Use for high-polish UI specs, layout/typography/interaction review, and “native app feel” guidance. | `.codex/skills/treido-ui-ux-pro-max/SKILL.md` |

---

## Routing

- Start from `docs/AGENT-MAP.md` for intent-to-skill routing.
- Apply `treido-rails` constraints for all implementation tasks.

---

*Last updated: 2026-02-06*

