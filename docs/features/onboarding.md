# Onboarding

## Goal

Guide new users from signup through email verification to profile setup and their first listing or purchase. The onboarding flow diverges into buyer and seller paths based on user intent, ensuring both persona types reach their first value moment quickly. Account management (profile editing, settings, addresses, security) is included as the ongoing extension of onboarding.

## Current Status

- Requirements: 12/14 complete (R1: 8/8 + R12: 4/6) — see REQUIREMENTS.md §R1, §R12
- Production: 🟡 Partial — in-app notifications UI partial; email notifications not started

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| **R1: Authentication & Accounts** | | |
| R1.1 | Email/password signup with verification | ✅ |
| R1.2 | Email/password login with session management | ✅ |
| R1.3 | Email confirmation flow | ✅ |
| R1.4 | OAuth (Google) callback | ✅ |
| R1.5 | Password reset flow | ✅ |
| R1.6 | Session persistence (cookie-based) | ✅ |
| R1.7 | Post-signup onboarding wizard | ✅ |
| R1.8 | Protected route gating (middleware) | ✅ |
| **R12: Profiles & Account** | | |
| R12.1 | Public profile page | ✅ |
| R12.2 | Profile editing | ✅ |
| R12.3 | Account settings | ✅ |
| R12.4 | Address book | ✅ |
| R12.5 | Notifications (in-app) | 🟡 In progress (DB exists, UI partial) |
| R12.6 | Email notifications | ⬜ Not started (backend only) |

## Implementation Notes

### Onboarding Flow

```
Sign Up → Email Verification → Welcome Page → Profile Setup
  ├─ Buyer path: browse → first purchase
  └─ Seller path: Stripe Connect onboarding → first listing
```

- **Post-signup wizard** (R1.7): collects display name, avatar, interests/intent
- **Seller onboarding**: triggered when user clicks "Sell" — Stripe Connect flow required before first listing

### Auth Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/auth/login` | (auth) | public | Login page |
| `/auth/sign-up` | (auth) | public | Registration |
| `/auth/sign-up-success` | (auth) | public | Registration success (check email) |
| `/auth/forgot-password` | (auth) | public | Password reset request |
| `/auth/reset-password` | (auth) | public | Set new password |
| `/auth/welcome` | (auth) | public | Welcome page |
| `/auth/error` | (auth) | public | Auth error page |

Auth callbacks: `/auth/callback` (OAuth), `/auth/confirm` (email verification)

### Account Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/account` | (account) | auth | Account dashboard |
| `/account/profile` | (account) | auth | Profile settings |
| `/account/settings` | (account) | auth | General settings |
| `/account/security` | (account) | auth | Security (password, 2FA) |
| `/account/addresses` | (account) | auth | Address book |
| `/account/notifications` | (account) | auth | Notification preferences |
| `/account/billing` | (account) | auth | Billing info |
| `/account/payments` | (account) | auth | Payment methods |
| `/account/following` | (account) | auth | Followed sellers |

### Server Actions

- `onboarding.ts` — Onboarding wizard steps, completion tracking
- `profile.ts` — Profile updates (display name, avatar, bio)
- `username.ts` — Username selection and validation

### DB Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile with `onboarding_completed`, `is_seller`, `tier`, display name, avatar, bio |
| `user_addresses` | Address book entries (shipping, billing) |
| `private_profiles` | Sensitive data: email, phone, Stripe customer ID, VAT number |
| `notifications` | In-app notifications (types: purchase, order_status, review, follow, price_drop) |

### Key DB Functions

- `handle_new_user()` — Creates profile and private_profile on auth.users insert
- `is_admin()` — Role check function for admin gating
- `create_notification()` — Creates in-app notification entries
- `notify_order_status_change()` — Triggers notification on order status transitions

### Auth Architecture

- **Session**: Supabase Auth with cookie-based sessions
- **Middleware**: Next.js middleware checks session and redirects unauthenticated users from protected routes
- **OAuth**: Google provider via Supabase Auth callback
- **Role gating**: `public` → `auth` → `seller` → `business` → `admin` hierarchy enforced per route

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| R12.5: In-app notifications | 🟡 In progress | `notifications` table exists; notification preferences UI partial; real-time push not implemented |
| R12.6: Email notifications | ⬜ Not started | Backend infrastructure only; no transactional email templates yet |
| Social login (Apple, Facebook) | ⬜ Deferred | Only Google OAuth in V1 |
| 2FA / MFA | ⬜ Deferred | Security settings page exists but MFA not wired |
| Progressive onboarding | ⬜ Deferred | Contextual prompts for incomplete profiles |

## Cross-References

- [AUTH.md](../AUTH.md) — Auth flows, session management, role system, security
- [DATABASE.md](../DATABASE.md) — profiles, private_profiles, user_addresses, notifications tables
- [ROUTES.md](../ROUTES.md) — (auth) and (account) route groups
- [selling.md](./selling.md) — Seller onboarding → Stripe Connect → first listing
- [PAYMENTS.md](../PAYMENTS.md) — Stripe Connect onboarding for sellers

---

*Last updated: 2026-02-08*
