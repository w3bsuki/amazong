# Issues (Prioritized)

## P0 — Blockers
- Cache Components correctness: audit `'use cache'` usages for cacheLife/cacheTag pairing; remove per-user data; fix any one-arg revalidateTag calls.
- Supabase security: enable leaked password protection; validate RLS on all write paths; ensure createAdminClient never leaks to client bundles.
- Stripe readiness: currency/price alignment for checkout; webhook idempotency and signature verification; env vars set per environment.
- Middleware defaults: confirm BG geo default and 1y cookie duration are intentional; ensure matcher keeps static exclusions; add coverage for proxy behavior.

## P1 — High Priority
- Design system drift: 13 gradients, 189 arbitrary Tailwind values; typography/spacing/color audits (AGENT-1/2/3) incomplete; dark mode parity to verify.
- i18n routing: replace localized next/navigation usage with @/i18n/routing; ensure locale-agnostic hrefs and string coverage in messages/en.json + bg.json.
- Client/server split: migrate unnecessary "use client" components; move data fetching out of client components.
- Data hygiene: remove select('*') and wide joins in hot paths; add field projections; clamp pagination/filter inputs; add schema validation for mutations.
- Cache/ISR cost: add generateStaticParams for [locale] and key dynamic segments; apply granular cacheTag values.

## P2 — Medium Priority
- Accessibility: focus rings, aria labels/roles, keyboard navigation for dialogs/menus; check auth/checkout/seller flows.
- Observability: structured logging around APIs/server actions; redact secrets; ensure global error/not-found coverage.
- Performance tooling: run bundle analyzer for heavy pages; lazy-load charts/visuals; stabilize list keys and memoize heavy lists.
- Playwright config: enable free-port selection to reduce E2E flake.
- Tailwind scan scripts: reduce false positives in palette/gradient scans to keep reports actionable.

## P3 — Cleanup
- Chat mobile scroll + avatar safety (see TASK-fix-chat-mobile-scroll-and-avatars.md) if still open.
- Documentation refresh after audits (design tokens, caching rules, Supabase playbook).
- Add unit coverage for middleware/proxy behavior and critical lib helpers.
