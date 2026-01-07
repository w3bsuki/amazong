# Refactor Execution Guide

## Principles
- No rewrites or redesigns; prefer small, verifiable slices (1–3 files/behavior per batch when possible).
- Respect boundaries: route-owned code stays in its group; components/ui are primitives only; keep app hooks out of primitives.
- Tailwind rules: no gradients; avoid arbitrary values; flat cards (border + rounded-md, shadow-sm max); use tokens from app/globals.css.
- Caching rules: pair `'use cache'` with cacheLife(<profile>) and cacheTag(); never include per-user data in cached paths; revalidateTag(tag, profile) only.
- Security: no secrets in logs; Supabase admin client server-only; enforce RLS and input validation on writes.

## Workflow
1) Pick a task from tasks.md within the current phase; keep scope tight.
2) Read relevant context (agents.md, docs/DESIGN.md, docs/ENGINEERING.md, docs/PRODUCTION.md) before changing code.
3) Implement with minimal, purposeful comments where logic is non-obvious; avoid noisy commentary.
4) Verification (minimum per batch):
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
   - Run targeted Playwright specs when touching auth/checkout/seller/payments.
5) Document outcome: what changed, why, how verified; update issues.md/tasks.md when closing items.

## Frontend Playbook
- Use @/i18n/routing Link/useRouter for localized routes; ensure locale-agnostic hrefs; keep strings in messages/en.json + bg.json.
- Prefer Server Components for data fetching/render; only mark "use client" where interactivity is required.
- Remove gradients and arbitrary values; align typography (text-sm body, text-base prices, text-xs meta, text-2xs tiny badges) and spacing (gap-2 mobile, gap-3 desktop).
- Enforce component boundaries: primitives-only in components/ui; move composites to components/common or route-owned _components.
- Accessibility: ensure focus rings, aria labels/roles, keyboard navigation for dialogs/menus; verify dark/light parity on priority pages.

## Backend Playbook
- Use createStaticClient for cached/public reads; createClient for cookie-aware server components/actions; createRouteHandlerClient for route handlers; createAdminClient only for server-internal ops.
- Add generateStaticParams for [locale] and key dynamic segments to reduce ISR writes.
- Replace select('*') with field projections; clamp pagination/filter inputs; validate mutations with zod (or equivalent).
- Stripe: ensure currency/price alignment; webhook idempotency; signature verification; env vars correct per environment; localize return/cancel URLs.
- Middleware: keep matcher excluding static assets; confirm geo default/cookie duration; test proxy for i18n + geo + session update.

## Testing and Perf
- Run bundle analyzer (`ANALYZE=true pnpm build`) when adding heavy deps or touching large pages.
- For caching/data changes, add unit tests around tags, params, and validation.
- Stabilize lists with consistent keys; memoize heavy renders; lazy-load charts/visuals.

## Documentation and Handoffs
- Update tasks.md and issues.md as items progress; note accepted exceptions (e.g., intentional BG default) in PR notes.
- Keep scan reports current (cleanup/*); record gradient/arbitrary counts after fixes.
- Provide concise handoff notes: files touched, behavior change, verification, follow-ups.
