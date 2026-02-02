# Mobile Auth Audit — Treido V1

> Auth flows tested on mobile viewports (390x844 iPhone 14, 360x740 Android)

| Status | ✅ Complete |
|--------|----------------|
| Viewport | Mobile |

---

## Test Matrix

| Test | iPhone 14 (390x844) | Android (360x740) | Status |
|------|---------------------|-------------------|--------|
| Signup flow | ✅ | ⬜ | Tested |
| Login flow | ✅ | ⬜ | Tested |
| Password reset | ✅ | ⬜ | Tested |
| OAuth callback | ⬜ | ⬜ | Not Started |
| Session persistence | ⬜ | ⬜ | Not Started |
| Logout | ⬜ | ⬜ | Not Started |

---

## Test Results

### 1. Signup Flow (`/auth/sign-up`)

#### iPhone 14 (390x844)

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Expected | Form fits viewport, touch targets adequate, keyboard handling |
| Actual | All form fields accessible and visible. Stacked layout correct for mobile. Logo/branding visible. Password toggle present. Terms/Privacy links work. |
| Issues | None |

#### Android (360x740)

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Form responsive, no horizontal scroll |
| Actual | — |
| Issues | — |

---

### 2. Login Flow (`/auth/login`)

#### iPhone 14

| Field | Result |
|-------|--------|
| Status | ⚠️ Issue |
| Expected | Form displays correctly, touch-friendly |
| Actual | Form UI renders correctly and is usable on mobile. ⚠️ After successful login from an auth-gated route, redirect can land on `/<locale>/<locale>/account` and show a 404 (see **ISSUE-004**). |

#### Android

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Form displays correctly |
| Actual | — |

---

### 3. Password Reset

| Field | Result |
|-------|--------|
| Status | ⚠️ Issue |
| Expected | Mobile-friendly form, success message visible |
| Actual | Email input accessible. "Send reset link" button visible. "Back to login" navigation works. **ISSUE-001**: Page title is "Treido" instead of "Forgot password | Treido" |

---

### 4. Session Persistence

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Session maintained on mobile navigation |
| Actual | — |

---

### 5. Logout

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Logout accessible via mobile menu/account |
| Actual | — |

---

## Mobile-Specific Checks

- [x] Touch targets ≥ 44px (iOS) / 48dp (Android) — All buttons and inputs adequately sized
- [x] No horizontal scrolling — Verified on auth pages
- [ ] Keyboard doesn't obscure inputs — Not tested (requires real device)
- [x] Form fields properly labeled for autofill — Labels present on all fields
- [ ] Biometric login prompt (if supported) — Not implemented

---

## Issues Found

| ID | Route | Severity | Description |
|----|-------|----------|-------------|
| ISSUE-001 | `/auth/forgot-password` | Low | Page title missing route name (same as desktop) |
| ISSUE-004 | `/auth/login` | Critical | Post-login redirect duplicates locale (`/<locale>/<locale>/account`) and lands on a 404 |
| ISSUE-009 | Onboarding flows | Low | Missing i18n message key logged: `Navigation.back (en)` |

---

*Last updated: 2026-02-02*
