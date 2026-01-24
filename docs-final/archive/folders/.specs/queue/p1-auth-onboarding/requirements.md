# Audit Spec: P1 Full Auth & Onboarding Audit

> Created: 2026-01-23
> Status: Queue
> Owner: Claude (impl) | Codex (verify)
> Audit Type: ux + security + architecture

---

## Audit Scope

**What we're auditing:**
The complete authentication and onboarding journey:
1. **Signup** — Email, OAuth (Google), email verification
2. **Signin** — Email/password, OAuth, "Remember me", session cookies
3. **Onboarding** — Post-signup flow (Personal vs Business, profile setup)
4. **Profile** — Avatar, bio, verification status

**Why:**
- First impression for all users
- Security-critical (auth, sessions, cookies)
- Must work flawlessly for launch

**Success criteria:**
- All auth flows work without errors
- Session cookies set correctly
- Onboarding captures required user data
- Profile editable and displays correctly

---

## Requirements (EARS Notation)

### R1: Email Signup
**WHEN** a guest submits the signup form with valid email/password
**THE SYSTEM SHALL** create account, send verification email, redirect to verification prompt

**Acceptance Criteria:**
- [ ] Form validates email format
- [ ] Password requirements enforced (min length, etc.)
- [ ] Verification email sent within 30 seconds
- [ ] User redirected to "check your email" page

### R2: OAuth Signup (Google)
**WHEN** a guest clicks "Continue with Google"
**THE SYSTEM SHALL** complete OAuth flow, create account if new, redirect to onboarding

**Acceptance Criteria:**
- [ ] Google OAuth popup opens
- [ ] Account created with correct email
- [ ] User redirected to onboarding (if new) or dashboard (if existing)

### R3: Email Signin
**WHEN** a user submits signin form with valid credentials
**THE SYSTEM SHALL** authenticate, set session cookie, redirect to previous page or dashboard

**Acceptance Criteria:**
- [ ] Session cookie set with correct expiry
- [ ] "Remember me" affects cookie duration
- [ ] Redirect preserves locale (`/en` vs `/bg`)
- [ ] Invalid credentials show error (not 500)

### R4: Session Management
**WHEN** a user is signed in
**THE SYSTEM SHALL** maintain session across page navigations and browser refresh

**Acceptance Criteria:**
- [ ] Session persists across page loads
- [ ] Session expires correctly when cookie expires
- [ ] Sign out clears session completely

### R5: Onboarding Flow
**WHEN** a new user completes auth
**THE SYSTEM SHALL** guide them through onboarding (account type, profile basics)

**Acceptance Criteria:**
- [ ] Personal vs Business selection works
- [ ] Selection persisted to `profiles` table
- [ ] Can skip optional fields
- [ ] Onboarding completes and redirects to dashboard

### R6: Profile Management
**WHEN** a user accesses profile settings
**THE SYSTEM SHALL** allow editing avatar, bio, and viewing verification status

**Acceptance Criteria:**
- [ ] Avatar upload works (Supabase storage)
- [ ] Bio saves and displays
- [ ] Verification badges display correctly

---

## UX States

| Screen | Loading | Empty | Error | Success | Unauthorized |
|--------|---------|-------|-------|---------|--------------|
| Signup | Spinner on submit | N/A | Inline errors | Redirect to verify | N/A |
| Signin | Spinner on submit | N/A | "Invalid credentials" | Redirect to prev/dashboard | N/A |
| Onboarding | Spinner on save | Default values | Toast error | Complete + redirect | Redirect to signin |
| Profile | Skeleton | Default avatar | Toast error | Save success toast | Redirect to signin |

---

## Routes / Files in Scope

### Routes
- `/auth/login` — Signin form
- `/auth/signup` — Signup form  
- `/auth/callback` — OAuth callback
- `/auth/confirm` — Email confirmation
- `/auth/forgot-password` — Password reset
- `/onboarding` — Post-signup onboarding
- `/account/profile` — Profile settings

### Files
- `app/[locale]/auth/*` — Auth pages
- `app/auth/*` — Auth callbacks (non-locale)
- `components/auth/*` — Auth form components
- `app/[locale]/onboarding/*` — Onboarding flow
- `app/[locale]/(account)/account/*` — Account pages
- `lib/supabase/*` — Supabase client
- `hooks/use-auth.ts` or similar

---

## Audit Checklist

### Auth Forms
| Item | Status |
|------|--------|
| Signup form renders without errors | ⏳ |
| Signup form validation works | ⏳ |
| Signup submits successfully | ⏳ |
| Signin form renders without errors | ⏳ |
| Signin form validation works | ⏳ |
| Signin submits successfully | ⏳ |
| OAuth buttons work | ⏳ |
| Forgot password flow works | ⏳ |

### Session/Cookies
| Item | Status |
|------|--------|
| Session cookie set on signin | ⏳ |
| Cookie has correct attributes (HttpOnly, Secure, SameSite) | ⏳ |
| "Remember me" affects expiry | ⏳ |
| Sign out clears cookie | ⏳ |
| Session persists across refresh | ⏳ |

### Onboarding
| Item | Status |
|------|--------|
| Onboarding page loads for new users | ⏳ |
| Personal/Business selection works | ⏳ |
| Selection saved to DB | ⏳ |
| Can complete onboarding | ⏳ |
| Redirects correctly after completion | ⏳ |

### Profile
| Item | Status |
|------|--------|
| Profile page loads | ⏳ |
| Avatar upload works | ⏳ |
| Bio edit saves | ⏳ |
| Verification status displays | ⏳ |

### Security
| Item | Status |
|------|--------|
| No secrets in client code | ⏳ |
| RLS policies on `profiles` table | ⏳ |
| Password not logged | ⏳ |
| CSRF protection (if applicable) | ⏳ |

---

## Tasks

### Phase 1: Manual Audit
- [ ] **1.1** Test signup with email — document any issues
- [ ] **1.2** Test signup with Google — document any issues
- [ ] **1.3** Test signin with email — check cookies
- [ ] **1.4** Test "Remember me" behavior
- [ ] **1.5** Test sign out — verify cookie cleared
- [ ] **1.6** Test onboarding flow — all steps
- [ ] **1.7** Test profile editing — avatar, bio

### Phase 2: Fix Issues
- [ ] **2.x** Fix identified issues (add tasks as found)

### Phase 3: E2E Coverage
- [ ] **3.1** Verify `e2e/auth.spec.ts` covers all critical paths
- [ ] **3.2** Add missing test coverage

### Phase 4: Verify
- [ ] **4.1** All audit checklist items ✅
- [ ] **4.2** Gates pass
- [ ] **4.3** E2E auth tests pass

---

## Verification

### Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] `e2e/auth.spec.ts` passes

### Manual QA
- [ ] Fresh signup → onboarding → dashboard works
- [ ] Existing user signin works
- [ ] OAuth signin works
- [ ] Sign out works
- [ ] Profile editable
