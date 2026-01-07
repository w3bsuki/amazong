# Issues (Prioritized)

## P0 (Blockers / High Risk)
- Cache Components correctness: audit `'use cache'` usage, ensure `cacheLife()` + `cacheTag()` pairing and two-arg `revalidateTag(tag, profile)`.
- Supabase security: enable leaked password protection; confirm all writes are RLS-covered; ensure `createAdminClient` not exposed to client.
- Stripe readiness: products/prices + webhook secrets set in env; webhook handler idempotent.
- Middleware defaults: geo cookie defaults to BG; verify intended. Add coverage to prevent middleware running on static assets beyond existing matcher.

## P1 (High Priority)
- Design system drift: 13 gradients and 189 arbitrary Tailwind values outstanding; typography (AGENT-1), spacing/layout (AGENT-2), colors/theming (AGENT-3) audits not executed.
- i18n routing enforcement: ensure all localized links use `@/i18n/routing`; eliminate `next/navigation` usage on localized routes.
- Data fetching hygiene: remove `select('*')` and over-broad joins; add field projections for list views; clamp pagination/filter inputs.
- Cache invalidation and ISR cost: add `generateStaticParams()` for `[locale]` and key segments; tag responses for targeted revalidation.
- Client/server split: migrate unnecessary `"use client"` components to server; move data fetching out of client components.

## P2 (Medium Priority)
- Accessibility: focus states, aria labels, keyboard navigation on dialogs/menus; verify for auth, checkout, seller flows.
- Observability: add structured error logging around APIs/actions; avoid leaking secrets; ensure global error/not-found coverage.
- Performance tooling: bundle analyzer runs on large pages; lazy-load heavy charts/visuals.
- Tailwind scan noise: reduce false positives in palette/gradient scan scripts; keep reports actionable.
- Playwright config: auto-pick free port for E2E to reduce flakiness.

## P3 (Nice to Have / Cleanup)
- Chat mobile scroll + avatar bug (tracked in `TASK-fix-chat-mobile-scroll-and-avatars.md`).
- Update documentation after audits (design tokens, caching rules, Supabase playbook).
- Add more unit coverage for middleware/proxy behavior (i18n + geo + session).
