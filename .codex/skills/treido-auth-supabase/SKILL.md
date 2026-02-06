---
name: treido-auth-supabase
description: Supabase Auth + Next.js App Router specialist for Treido. Use for session/cookie flows, protected routes, and choosing the correct Supabase client. Not for payments or DB migrations/RLS changes.
---

# treido-auth-supabase

Treido auth specialist for App Router + Supabase SSR session handling.

## When to Apply

- Login/signup/reset/callback flow changes.
- Protected route logic and redirect behavior.
- Session cookie handling between server/client boundaries.
- Choosing the correct Supabase client for auth-sensitive code.

## When NOT to Apply

- Payment flow or webhook implementation.
- Schema migration and RLS policy authoring (use `treido-supabase`).
- Pure UI polish with no auth behavior change.

## Non-Negotiables

- Use `@supabase/ssr` patterns and Treido client helpers.
- Keep session tokens in secure cookie flow; do not manually persist sensitive tokens in UI state.
- Avoid auth-sensitive logic inside cached server functions.
- Treat auth changes as high-risk and pause for explicit approval before execution.

## Treido Guidance

- Request routing convention uses `proxy.ts`.
- Validate locale-safe redirects (`/bg`, `/en`) and avoid duplicated locale segments.
- Keep protected routes consistent with product onboarding/access rules.

## Output Template

```md
## Surface
- <auth route/action/client helper>

## Risk
- <session/redirect/access control risk>

## Verification
- <manual auth flows + tests>
```

## References

- `docs/AUTH.md`
- `docs/ARCHITECTURE.md`
- `docs/ROUTES.md`
- `docs/AGENTS.md`
- `docs/WORKFLOW.md`
