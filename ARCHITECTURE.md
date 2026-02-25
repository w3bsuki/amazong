# Architecture Contract — Treido

This file defines the **practical architecture rules** that keep Treido safe, maintainable, and compatible with our mechanical gates.

Deeper platform vision lives in:
- `docs/architecture/TARGET-PLATFORM.md`
- `docs/architecture/AI-PLATFORM.md`

## Ownership (Directories)

| Layer | Owns | Must NOT |
|------|------|----------|
| `app/` | Route composition (layouts/pages), route-private code (`_components/`, `_actions/`, `_lib/`, `_providers/`) | Cross-route shared UI or domain logic |
| `components/ui/` | shadcn/ui primitives | Import `app/`, `lib/data/`, or route-private code |
| `components/shared/` | Cross-route composites | Import route-private code |
| `components/layout/` | App shells (header, bottom nav, chrome) | Import route-private code |
| `components/providers/` | Client contexts (UI state) | Make direct DB calls |
| `lib/` | Domain logic, validation, typed queries, utilities | Import `components/` or `app/` |
| `hooks/` | Client hooks (UI behavior) | Contain domain/business logic |

## Route Privacy (Non-Negotiable)

Folders named `_components/`, `_actions/`, `_lib/`, `_providers/` are **private to their route group**.
Do not import across route groups. Extract to `components/shared/`, `components/layout/`, `lib/`, or `hooks/`.

This is mechanically enforced by `pnpm -s architecture:gate` and unit tests.

## Server-First by Default

- Server Components by default.
- Use `"use client"` only when needed, and keep client components prop-driven.

## High-Risk Surfaces (Rules)

- **Auth:** security decisions use `getUser()` (server-verified), not `getSession()`.
- **Webhooks:** verify Stripe payload via `constructEvent()` before any DB write.
- **Styling:** semantic tokens only (`bg-background`, `text-foreground`). No palette classes or arbitrary values.

## Gates

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
pnpm -s architecture:gate
pnpm -s knip
```

