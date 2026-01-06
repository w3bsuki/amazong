# 🔐 Auth & Sessions

> **Status**: 🟡 85% Complete
> **Priority**: P0

---

## ✅ Working Features

- [x] Email/password login
- [x] Email/password signup with username validation
- [x] Email verification via Supabase (PKCE + token_hash flows)
- [x] Password reset flow
- [x] Session management via Supabase cookies
- [x] Account type selection at signup (personal/business)
- [x] Protected routes redirect to login
- [x] Persistent sessions across page reloads

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
_None identified_

### P1 - High Priority
- [ ] **Logout doesn't always clear session properly** - Verify cookie cleanup
- [ ] **Email verification link expiry** - Test and document expected behavior
- [ ] **Error messages** - Ensure all auth errors have user-friendly messages

### P2 - Nice to Have
- [ ] Social OAuth (Google, Facebook) - Not MVP
- [ ] "Remember me" checkbox functionality
- [ ] Rate limiting on login attempts

---

## 🧪 Test Cases

### Manual QA
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | Signup with new email | Verification email sent, redirect to check-email | ⬜ |
| 2 | Login with valid credentials | Redirect to account/dashboard | ⬜ |
| 3 | Login with wrong password | Show error, don't reveal if email exists | ⬜ |
| 4 | Click email verification link | Account verified, can login | ⬜ |
| 5 | Reset password flow | Email sent, can set new password | ⬜ |
| 6 | Access protected route logged out | Redirect to login with return URL | ⬜ |
| 7 | Session persists on refresh | Stay logged in | ⬜ |
| 8 | Logout | Clear session, redirect to home | ⬜ |

### Automated (E2E)
- [e2e/auth.spec.ts](../../e2e/auth.spec.ts) - 734 lines of auth tests

---

## 📁 Key Files

```
app/
├── auth/
│   └── confirm/route.ts          # Email confirmation handler
├── [locale]/(auth)/
│   ├── _actions/auth.ts          # Server actions (login, signup, reset)
│   ├── _components/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── welcome-client.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── forgot-password/page.tsx
lib/
└── supabase/
    ├── client.ts
    └── server.ts
```

---

## 📝 Implementation Notes

### Session Flow
1. User logs in via `_actions/auth.ts` → `signInWithPassword`
2. Supabase sets `sb-*` cookies automatically
3. Server components read session via `createClient()` from `lib/supabase/server.ts`
4. Middleware checks auth state for protected routes

### Email Verification
- Uses Supabase PKCE flow
- Confirmation route: `/auth/confirm?token_hash=...&type=signup`
- Handles both `token_hash` (new) and legacy `code` params

---

## 🎯 Acceptance Criteria for Launch

- [ ] All 8 manual QA scenarios pass
- [ ] E2E auth tests pass: `pnpm test:e2e -- auth.spec.ts`
- [ ] No console errors during auth flows
- [ ] Mobile-friendly auth forms
- [ ] i18n working for all auth pages (EN/BG)
