# Feature: Authentication

## What it does
Email/password signup + login, Google OAuth, password reset, email confirmation.
Post-signup onboarding wizard. Session management via HTTP-only cookies.

## Key files
- `components/auth/login-form-body.tsx` — Reusable login form (used in both page and drawer)
- `components/providers/auth-state-manager.tsx` — Client-side auth state + session sync
- `components/mobile/drawers/auth-drawer.tsx` — Mobile auth drawer (login/signup in sheet)
- `app/[locale]/(auth)/` — Auth route group (login, register, forgot-password pages)
- `app/[locale]/(auth)/_actions/` — Server actions for login/signup
- `app/auth/confirm/route.ts` — Email confirmation callback handler
- `app/api/auth/sign-out/route.ts` — Sign-out route handler (POST for mutation, GET for redirect)
- `lib/supabase/middleware.ts` — Session refresh in middleware (`updateSession()`)
- `lib/auth/require-auth.ts` — Server-side auth guards (`requireAuth`, `requireAuthOrFail`)
- `proxy.ts` — Entry middleware, delegates to updateSession for protected routes

## How it works
**Server path:** Request → `proxy.ts` → `updateSession()` → refreshes cookies for protected routes → App Router
**Client path:** `AuthStateManager` mounts → reads session → subscribes to `onAuthStateChange` → triggers refresh on route changes away from `/auth/*`

**Login flow:** User submits form → server action validates with Zod → `supabase.auth.signInWithPassword()` → cookies set → `AuthStateManager` picks up state change → UI updates

**Drawer login:** When auth happens in a drawer (no route change), `onSuccess` callback triggers `refreshSession({ forceRetry: true })` to force state sync without a page navigation.

**Session refresh:** Throttled to 30s window. Force-retry bypasses throttle with a small delay for cookie propagation.

## Conventions
- `getUser()` for all security checks (never `getSession()`)
- Sign-out is POST-only for mutation safety; GET redirects
- Redirect targets validated with `safeNextPath()` in confirm route
- Onboarding: `profiles.onboarding_completed` gates incomplete users to `/onboarding`

## Dependencies
- `@supabase/ssr` for cookie-based session management
- react-hook-form + zod for form validation
- `next-intl` for localized auth strings

## Last modified
- 2026-02-16: Documented during docs system creation
