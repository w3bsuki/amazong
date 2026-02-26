# AGENTS.md — Treido (AI Execution Contract)

Treido is a mobile-first marketplace evolving into an AI-first commerce platform.
Stack: Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Supabase, Stripe, next-intl (en/bg).

## Canonical Session Boot

Use `docs/index.md` as the single docs router and load order authority.

1. Read `docs/index.md`.
2. Read `docs/state/NOW.md`.
3. Read `TASKS.md` (active queue only).
4. Load only the domain docs needed for the task.

If a framework/API detail is unclear, use official docs from `docs/STACK.md` (or context7).

## Execution Loop

1. Plan briefly before editing when touching multiple files.
2. Work in small batches that can be verified.
3. Finish scoped tasks end-to-end where feasible.
4. Keep docs synchronized with the change in the same session.

## Non-Negotiable Safety Rules

- Auth decisions use `getUser()`, not `getSession()`.
- Stripe webhooks must call `constructEvent()` before any DB write.
- `_components/`, `_actions/`, `_lib/`, `_providers/` are route-group-private.
- Do not use `select('*')` on hot paths.
- Use the correct Supabase client by context (`docs/STACK.md`).
- AI endpoints require schema validation, guardrails, pinned prompt versions, and telemetry.

Sensitive zones: auth/session, payments/webhooks, DB migrations/RLS, destructive operations. Prefer additive changes, explicit evidence, and rollback notes.

## Verification Matrix (Risk-Based)

Run the smallest sufficient verification set for the change:

| Change type | Required verification |
|---|---|
| Docs-only (no code behavior change) | `pnpm -s docs:gate` |
| UI/code change (non-sensitive) | `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` |
| Sensitive change (auth/payments/DB/RLS/webhooks) | Core gates above + targeted tests for touched flow + evidence in `CHANGELOG` |

## Docs Update Contract

- If active scope changes: update `TASKS.md`.
- If current truth changes: update `docs/state/NOW.md`.
- For significant outcomes: append a concise entry to `docs/state/CHANGELOG.md`.
- For durable directional decisions: append to `docs/DECISIONS.md`.

## Conventions

- Server Components by default; use `"use client"` only when necessary.
- Zod at boundaries (forms, actions, webhooks, route handlers).
- Use `requireAuth()` in server actions.
- Use `Link`/`redirect` from `@/i18n/routing`, never `next/link`.
- Keep primitives in `components/ui/`, shared composites in `components/shared/`, shells in `components/layout/`.
- For UI work, load `designs/ui-ux-dream-weaver/UI_UX_GUIDE.md` before implementing.

*Last updated: 2026-02-26*
