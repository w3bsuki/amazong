# 09-AUTH.md — Authentication Flows

> Supabase Auth implementation with cookie-based sessions and role-based access control.

| Scope | Authentication & Authorization |
|-------|-------------------------------|
| Audience | AI agents, developers |
| Type | How-To |

---

## Quick Reference

| Aspect | Implementation |
|--------|----------------|
| Provider | Supabase Auth (PKCE flow) |
| Session Storage | HTTP-only cookies via `@supabase/ssr` |
| Roles | `buyer`, `seller`, `admin` |
| Account Types | `personal`, `business` |
| OAuth | Infrastructure ready, UI not implemented |

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/supabase/server.ts` | Server-side clients (`createClient`, `createAdminClient`) |
| `lib/supabase/client.ts` | Browser-side client singleton |
| `lib/supabase/middleware.ts` | Session validation & route protection |
| `proxy.ts` | Next.js middleware entry point |
| `lib/auth/require-auth.ts` | Server action auth helpers |
| `lib/auth/admin.ts` | Admin role verification |
| `lib/auth/business.ts` | Business seller verification |
| `lib/validations/auth.ts` | Zod schemas for auth forms |
| `components/providers/auth-state-manager.tsx` | Client-side auth context |

---

## Auth Flows

### Email/Password Signup

```
User → SignUp Form → signUp() action → Supabase sends email
                                              ↓
Profile created ← handle_new_user trigger ← /auth/confirm (PKCE exchange)
       ↓
onboarding_completed=false → redirect to /onboarding
```

| Step | Location | Action |
|------|----------|--------|
| 1 | `app/[locale]/(auth)/_components/sign-up-form.tsx` | User fills form |
| 2 | `app/[locale]/(auth)/_actions/auth.ts` | `signUp()` calls `supabase.auth.signUp()` |
| 3 | Email | User clicks confirmation link |
| 4 | `app/auth/confirm/route.ts` | PKCE code exchanged for session |
| 5 | DB trigger | `handle_new_user` creates `profiles` row |
| 6 | Middleware | Redirects to `/onboarding` if `onboarding_completed=false` |

### Email/Password Login

| Step | Location | Action |
|------|----------|--------|
| 1 | `app/[locale]/(auth)/_components/login-form.tsx` | User fills form |
| 2 | `app/[locale]/(auth)/_actions/auth.ts` | `login()` calls `signInWithPassword()` |
| 3 | Response | Session stored in HTTP-only cookies |
| 4 | Redirect | Navigate to `next` param or `/` |

### Password Reset

| Step | Location | Action |
|------|----------|--------|
| 1 | `app/[locale]/(auth)/_components/forgot-password-form.tsx` | User requests reset |
| 2 | `app/[locale]/(auth)/_actions/auth.ts` | `requestPasswordReset()` action |
| 3 | Email | User clicks reset link |
| 4 | `app/[locale]/(auth)/auth/reset-password/` | User enters new password |
| 5 | Client | `supabase.auth.updateUser({ password })` |

### Sign Out

| Step | Location | Action |
|------|----------|--------|
| 1 | Client | POST to `/api/auth/sign-out` |
| 2 | `app/api/auth/sign-out/route.ts` | `supabase.auth.signOut()` |
| 3 | Response | Cookies cleared, redirect to `/` |

---

## Protected Routes

### Middleware-Level Gating

Defined in `lib/supabase/middleware.ts`:

| Pattern | Requirement |
|---------|-------------|
| `/account/*` | Authenticated |
| `/sell/*` | Authenticated |
| `/sell/orders/*` | Authenticated |
| `/chat/*` | Authenticated |
| `/protected/*` | Authenticated (legacy) |

### Server-Side Patterns

```typescript
// Basic auth check (returns null if not authenticated)
const auth = await requireAuth()
if (!auth) return authFailure()

// Throws if not authenticated
const { user, profile } = await requireAuthOrFail()

// Admin-only routes
await requireAdmin()  // Throws if not admin

// Business seller routes
await requireBusinessSeller()
await requireDashboardAccess()  // Requires paid tier
```

---

## Role & Permission System

### Roles vs Account Types

| Field | Values | Purpose |
|-------|--------|---------|
| `profiles.role` | `buyer`, `seller`, `admin` | Access control |
| `profiles.is_seller` | `boolean` | Seller permissions |
| `profiles.account_type` | `personal`, `business` | Feature tiers |

### Business Subscription Tiers

| Tier | Dashboard Access | Features |
|------|-----------------|----------|
| `free` | ❌ | Basic selling |
| `starter` | ✅ | Analytics |
| `professional` | ✅ | Advanced analytics |
| `enterprise` | ✅ | Full features |

---

## Database Integration

### handle_new_user Trigger

Location: `supabase/migrations/20260103000000_fix_handle_new_user_account_type.sql`

```
AFTER INSERT ON auth.users
→ Creates profiles row (username, full_name, account_type)
→ Creates buyer_stats row
→ Creates user_verification row
```

### Key Tables

| Table | Auth Relationship |
|-------|-------------------|
| `profiles` | 1:1 with `auth.users` via `id` |
| `buyer_stats` | 1:1 with `profiles` |
| `user_verification` | 1:1 with `profiles` |
| `seller_stats` | 1:1 for sellers |

---

## Client-Side Auth

### AuthStateManager Context

Location: `components/providers/auth-state-manager.tsx`

```typescript
// Required auth (throws if not authenticated)
const { user, profile, isLoading } = useAuth()

// Optional auth (returns null if not authenticated)
const auth = useAuthOptional()
```

### Auth State Changes

The context listens to `supabase.auth.onAuthStateChange()` for:
- `SIGNED_IN` / `SIGNED_OUT`
- `TOKEN_REFRESHED`
- `USER_UPDATED`

### Session Refresh

To prevent session drift, `AuthStateManager` explicitly refreshes sessions:
- On initial app load
- When navigating away from `/auth` routes
- On tab visibility change
- Every 10 minutes for authenticated users

Refreshes are throttled to avoid excessive calls.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Admin operations |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Email redirect URLs |
| `AUTH_COOKIE_DOMAIN` | Production | Cross-subdomain auth |
| `SUPABASE_FETCH_TIMEOUT_MS` | Optional | Request timeout (default 8000) |

---

## Security Implementation

| Concern | Implementation |
|---------|----------------|
| JWT Validation | Server uses `getUser()` not `getSession()` |
| PKCE | Email confirmations use PKCE code exchange |
| Error Sanitization | `sanitizeAuthError()` prevents info leakage |
| Open Redirects | `safeNextPath()` validates redirect paths |
| Reserved Usernames | Blocked list prevents impersonation |
| CSRF | Sign-out requires POST method |
| Rate Limiting | Server handles Supabase rate limit errors |

---

## Auth Routes

| Route | Purpose |
|-------|---------|
| `/[locale]/auth/login` | Login page |
| `/[locale]/auth/sign-up` | Registration |
| `/[locale]/auth/sign-up-success` | Post-signup confirmation |
| `/[locale]/auth/forgot-password` | Request password reset |
| `/[locale]/auth/reset-password` | Set new password |
| `/[locale]/auth/error` | Auth error display |
| `/auth/callback` | OAuth callback handler |
| `/auth/confirm` | Email verification handler |
| `/api/auth/sign-out` | Sign-out endpoint |

---

## OAuth Status

| Provider | Status | Notes |
|----------|--------|-------|
| Google | ⬜ Planned | Callback handler exists, no UI |
| Apple | ⬜ Planned | Callback handler exists, no UI |

Infrastructure at `/auth/callback` is ready. OAuth buttons not yet added to login/signup forms.

---

## i18n

Auth translations in `messages/[locale].json` under `"Auth"` namespace (~100 keys):
- Form labels, placeholders, validation errors
- Password strength indicators
- Success/error messages

---

## See Also

- [06-DATABASE.md](./06-DATABASE.md) — profiles table, RLS policies
- [05-ROUTES.md](./05-ROUTES.md) — protected route groups
- [07-API.md](./07-API.md) — auth-related server actions

---

*Last updated: 2026-02-04*
