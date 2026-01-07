# Execution Guide

## Principles
- Keep changes small and focused; avoid broad rewrites.
- Preserve UI and behavior; no redesigns.
- Use Tailwind tokens from app/globals.css; avoid gradients and arbitrary values.
- Use next-intl for all user-facing strings; keep en.json and bg.json in sync.
- Use the correct Supabase client per context (server, route handler, cached read).

## Workflow
1) Pick one item from issues.md or one step from tasks.md.
2) Define a small scope (1-3 files where possible) and a clear done-when.
3) Implement the change; keep the diff minimal and easy to review.
4) Verify with tsc + e2e smoke (and targeted tests when touching auth/checkout/seller flows).
5) Update issues.md and tasks.md as items close.

## Frontend tips
- Replace next/link and next/navigation in localized routes with @/i18n/routing helpers.
- Split heavy client components into server shells plus small client islands.
- Prioritize fixing design drift on high-traffic pages first.

## Backend tips
- Use createRouteHandlerClient for auth-protected route handlers and createStaticClient for public data.
- Avoid select("*"); project only the fields needed by the UI.
- Keep webhooks idempotent and return 200 after signature verification.
- Use lib/stripe-locale to build return URLs with locale prefixes.

## Documentation
- Keep frontend.md and backend.md updated after major refactors.
- Use issues.md to track remaining problems and tasks.md for phased execution.
