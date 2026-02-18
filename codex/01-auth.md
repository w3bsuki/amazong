# [1] Auth

> Sign up · Sign in · Forgot/reset password · OAuth · Email confirmation · Sign out · Session

## What Must Work

- Email/password sign-up with email confirmation
- Sign-in with email/password
- OAuth (Google, etc.) via Supabase
- Forgot password → reset email → reset password
- Sign-out via POST (never GET)
- Session stored in HTTP-only cookies via `@supabase/ssr`
- Middleware redirects unauthenticated users from protected routes
- `getUser()` only — never `getSession()` for server-side auth
- All server actions use `requireAuth()` from `lib/auth/require-auth.ts`

## Files to Audit

```
app/[locale]/(auth)/                    → Pages + _actions/ + _components/
app/auth/callback/route.ts             → OAuth callback
app/auth/confirm/route.ts              → Email confirmation
app/api/auth/sign-out/route.ts         → Sign-out endpoint

components/auth/                        → login-form-body, sign-up-form-body, submit-button
components/providers/auth-state-manager.tsx

lib/auth/                               → require-auth, admin, business, server-actions
lib/supabase/                           → client, server, middleware, shared
lib/validation/auth.ts

proxy.ts                                → Middleware entry
```

## Instructions

1. Read every file listed above
2. Audit for: dead code, duplication, over-engineering, unused exports, files that should merge
3. Refactor — same features, less code, no duplication
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, RLS policies, Supabase dashboard config.
