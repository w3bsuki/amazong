# Phase 3: Auth Flows

> Comprehensive mobile audit of all authentication routes, the mobile auth drawer (tabbed login/signup bottom sheet), onboarding wizard, session persistence, and username availability checking.

| Field | Value |
|-------|-------|
| **Scope** | All 7 auth routes, mobile auth drawer (tabbed login/signup), onboarding wizard (6 routes), session persistence, username availability check |
| **Routes** | `/auth/login`, `/auth/sign-up`, `/auth/sign-up-success`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/welcome`, `/auth/error` + 6 onboarding routes + auth drawer |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell & Navigation) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No (testing auth flows themselves) |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Source Files

| Area | File | Key exports / selectors |
|------|------|------------------------|
| Auth layout | `app/[locale]/(auth)/layout.tsx` | `<PageShell variant="muted">`, `<main id="main-content" role="main">` — no header/footer |
| Login page | `app/[locale]/(auth)/auth/login/page.tsx` | Renders `<LoginForm>` with redirect support via `?redirect=` / `?next=` search params |
| LoginForm wrapper | `app/[locale]/(auth)/_components/login-form.tsx` | Wraps `<AuthCard>` + `<LoginFormBody>`, footer links `min-h-8` |
| LoginFormBody | `components/auth/login-form-body.tsx` | Fields: `#email` (type=email), `#password` (type=password); `#remember-me` (Checkbox); forgot-password link `min-h-11`; show/hide toggle `size-11`; `<SubmitButton>` |
| Sign-up page | `app/[locale]/(auth)/auth/sign-up/page.tsx` | Renders `<SignUpForm>` |
| SignUpFormBody | `components/auth/sign-up-form-body.tsx` | Fields: `#name`, `#username`, `#email`, `#password`, `#confirmPassword`; password toggle `size-11`; `data-testid="username-availability"` (3 states) |
| AuthCard | `components/auth/auth-card.tsx` | `min-h-dvh` centered, `<Card>` max-w-sm, logo via `<Image src="/icon.svg">`, `<h1>` title |
| SubmitButton | `components/auth/submit-button.tsx` | `<Button type="submit" size="lg" className="w-full">`, SpinnerGap pending state |
| Forgot password | `app/[locale]/(auth)/_components/forgot-password-form.tsx` | `<AuthCard>` + email field `#email`, `<SubmitButton>`, success state with Check icon |
| Reset password | `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx` | `react-hook-form` + zod; fields `#password`, `#confirmPassword`; session validation; 3 states: loading / invalid-session / success / form |
| Sign-up success | `app/[locale]/(auth)/auth/sign-up-success/sign-up-success-client.tsx` | CheckCircle icon, EnvelopeSimple, "Resend email" button, links to login/home |
| Welcome | `app/[locale]/(auth)/_components/welcome-client.tsx` | 4-step wizard (welcome → avatar → profile → complete); `framer-motion` AnimatePresence; boring-avatars |
| Error page | `app/[locale]/(auth)/auth/error/page.tsx` | WarningCircle icon, error code display, "Try Again" → login, "Back to Home" → `/` |
| Auth drawer | `components/mobile/drawers/auth-drawer.tsx` | `data-testid="mobile-auth-drawer"`; `DrawerContent.max-h-dialog.rounded-t-2xl`; tablist `role="tablist"` with `role="tab"` buttons; panels `role="tabpanel"` |
| Minimal header | `components/layout/header/mobile/minimal-header.tsx` | `MobileMinimalHeader` — `border-b border-border-subtle bg-background pt-safe`, centered "treido." logo, `h-(--control-primary)`, `md:hidden` |
| Onboarding layout | `app/[locale]/(onboarding)/layout.tsx` | `<PageShell variant="muted">`, centered `max-w-md` |
| Onboarding entry | `app/[locale]/(onboarding)/onboarding/page.tsx` | Redirects to `/onboarding/account-type` |
| Onboarding shell | `app/[locale]/(onboarding)/onboarding/_components/onboarding-shell.tsx` | Sticky header with back button + progress bar, sticky footer with CTA, `min-h-dvh flex flex-col` |
| Account type | `app/[locale]/(onboarding)/onboarding/account-type/page.tsx` | `role="radiogroup"`, `AccountTypeCard` (personal / business), Continue button |
| Drawer context | `components/providers/drawer-context.tsx` | `openAuth({ mode, entrypoint })` — triggers AuthDrawer from tab bar profile tap (unauthenticated) |

---

## Prerequisites

- **Auth state:** Logged out (fresh session, no cookies).
- **Overlay dismissal:** Cookie consent + geo modal dismissed (Phase 1 prerequisite).
- **Test accounts:**
  - Fresh email for sign-up test (e.g. `test-audit-{timestamp}@example.com`).
  - Existing account for login test (seeded or previously created).
  - Username known to be taken (e.g. `admin`) and one known to be available.
- **Environment:** Supabase auth enabled, email confirmation flow active (or test mode with auto-confirm).
- **Password reset:** Requires valid recovery session from email link — may need to test via direct token injection or mock.

---

## Routes Under Test

| # | Route | URL Pattern | Key Elements |
|---|-------|-------------|--------------|
| 1 | Login | `/en/auth/login` | AuthCard, LoginFormBody (email, password, remember-me, forgot-password link) |
| 2 | Sign Up | `/en/auth/sign-up` | AuthCard, SignUpFormBody (name, username, email, password, confirm password) |
| 3 | Sign Up Success | `/en/auth/sign-up-success` | Success card, CheckCircle, "Check your email", resend button |
| 4 | Forgot Password | `/en/auth/forgot-password` | AuthCard, email field, submit, success confirmation |
| 5 | Reset Password | `/en/auth/reset-password` | AuthCard, password + confirm fields, session validation |
| 6 | Welcome | `/en/auth/welcome` | 4-step wizard (welcome → avatar → profile → complete) |
| 7 | Error | `/en/auth/error?error=access_denied` | Error card, WarningCircle, error message, retry/home buttons |
| 8 | Auth Drawer | (overlay, no route) | Bottom-sheet with tabbed login/signup, `data-testid="mobile-auth-drawer"` |
| 9 | Onboarding Entry | `/en/onboarding` | Redirect → `/en/onboarding/account-type` |
| 10 | Onboarding: Account Type | `/en/onboarding/account-type` | Personal/Business radio cards, Continue button |
| 11 | Onboarding: Profile | `/en/onboarding/profile` | Display name, bio, avatar upload |
| 12 | Onboarding: Business Profile | `/en/onboarding/business-profile` | Business-specific fields |
| 13 | Onboarding: Interests | `/en/onboarding/interests` | Interest/category selection |
| 14 | Onboarding: Complete | `/en/onboarding/complete` | Completion confirmation, next-step CTAs |

---

## Test Scenarios

### S3.1: Sign-Up Form — Fields Render on Mobile

**Steps:**
1. Navigate to `/en/auth/sign-up`.
2. Wait for `AuthCard` to render — assert `<h1>` with sign-up title is visible.
3. Assert `<Image src="/icon.svg">` logo is visible at top of card.
4. Assert all 5 input fields are visible within the viewport:
   - `page.locator('#name')` — type=text, autoComplete=name
   - `page.locator('#username')` — type=text, autoComplete=username
   - `page.locator('#email')` — type=email, autoComplete=email
   - `page.locator('#password')` — type=password, autoComplete=new-password
   - `page.locator('#confirmPassword')` — type=password, autoComplete=new-password
5. Assert each field has a visible `<label>` via `FieldLabel`.
6. Assert the submit button (`<button type="submit">`) is visible with `size="lg"` and `className="w-full"`.
7. Scroll down — assert legal text ("By creating an account…") with links to `/terms` and `/privacy`.
8. Assert "Already have an account?" CTA with sign-in link is visible.

**Expected:** All fields, labels, submit button, legal text, and sign-in CTA render correctly on 393px viewport without horizontal overflow or clipped elements.

**Screenshot checkpoint:** `phase-3-S3.1-signup-form-fields.png`

---

### S3.2: Sign-Up Form — Client-Side Validation

**Steps:**
1. Navigate to `/en/auth/sign-up`.
2. Leave all fields empty and attempt form submission — assert submit button is `disabled` (client-side `canSubmit` guard: name ≥ 2 chars, username ≥ 3 chars, email contains @, password ≥ 8 chars, confirmPassword matches).
3. Fill `#name` with "A" (1 char) — button remains disabled.
4. Fill `#name` with "Al" (2 chars) — still disabled (other fields empty).
5. Fill `#username` with "ab" (2 chars) — still disabled.
6. Fill `#username` with "abc" (3 chars) — still disabled (email/password empty).
7. Fill `#email` with "invalid" — still disabled (no @).
8. Fill `#email` with "test@example.com" — still disabled (password empty).
9. Fill `#password` with "short" (5 chars) — still disabled.
10. Fill `#password` with "ValidPass1" (meets all requirements) — still disabled (confirm empty).
11. Fill `#confirmPassword` with "Mismatch1" — still disabled (doesn't match).
12. Fill `#confirmPassword` with "ValidPass1" — button becomes enabled.
13. Assert no server-side error banner is shown (the rounded-xl destructive div).

**Expected:** Submit button toggles enabled/disabled based on `canSubmit` logic. No field-level error messages until server action returns.

**Screenshot checkpoint:** `phase-3-S3.2-signup-validation-disabled.png` (with all fields empty), `phase-3-S3.2-signup-validation-enabled.png` (valid input)

---

### S3.3: Username Availability Check — 3 Indicator States

**Steps:**
1. Navigate to `/en/auth/sign-up`.
2. Focus `#username` and type "ab" (2 chars) — assert no indicator appears (`usernameIndicator` returns null for < 3 chars).
3. Type "abc" (3 chars) — wait 500ms (debounce timeout).
4. Assert `[data-testid="username-availability"]` appears with:
   - **Checking state:** `SpinnerGap` icon with `animate-spin`, `role="status"`, `aria-live="polite"`, screen-reader text via `.sr-only`.
5. Wait for server response — assert indicator transitions to one of:
   - **Available:** `CheckCircle` icon with `text-success`, `role="status"`, `aria-live="polite"`.
   - **Unavailable:** `X` icon with `text-destructive`, `role="status"`, `aria-live="polite"`.
6. Clear field, type "admin" — wait for response — assert unavailable state (X icon, destructive color).
7. Clear field, type a unique username (e.g. `audituser{timestamp}`) — wait for response — assert available state (CheckCircle, green).
8. Assert indicator is positioned inside the username input's `relative` container at `absolute right-3 top-1/2 -translate-y-1/2`.

**Expected:** Debounced 500ms check fires, shows spinner during check, then green check or red X. ARIA `role="status"` + `aria-live="polite"` announces state changes to screen readers.

**Screenshot checkpoint:** `phase-3-S3.3-username-checking.png`, `phase-3-S3.3-username-available.png`, `phase-3-S3.3-username-unavailable.png`

---

### S3.4: Password Strength Meter — 4 Requirement Indicators

**Steps:**
1. Navigate to `/en/auth/sign-up`.
2. Focus `#password` — assert no strength meter is visible (only visible when `password` is non-empty).
3. Type "a" — assert strength meter appears:
   - Progress bar: `h-1 w-full bg-muted rounded-full` with inner div showing color + width.
   - Strength label text: `text-xs text-muted-foreground` showing password strength level.
   - Requirements grid: `grid grid-cols-2 gap-x-2 gap-y-1` with 4 items.
4. Assert 4 requirement indicators visible:
   - "At least 8 characters" — `X` icon (unmet, `text-muted-foreground`).
   - "One uppercase letter" — `X` icon (unmet).
   - "One lowercase letter" — `Check` icon (met, `text-foreground`).
   - "One number" — `X` icon (unmet).
5. Type "A" → now "aA" — assert uppercase requirement shows `Check` (met).
6. Type "1" → now "aA1" — assert number requirement shows `Check` (met).
7. Type "bcdef" → now "aA1bcdef" (8 chars) — assert length requirement shows `Check` (met). All 4 indicators now show `Check`.
8. Assert strength bar color transitions:
   - Score ≤ 2: `bg-destructive`, `w-1/4`
   - Score 3-4: `bg-status-warning`, `w-2/4`
   - Score 5: `bg-status-success`, `w-3/4`
   - Score 6+: `bg-status-success`, `w-full`

**Expected:** Strength meter renders below password field with real-time updates. 4 requirement checks toggle between met/unmet icons. Bar color and width reflect overall strength score.

**Screenshot checkpoint:** `phase-3-S3.4-password-weak.png`, `phase-3-S3.4-password-strong.png`

---

### S3.5: Login Form — Fields and Remember-Me Checkbox

**Steps:**
1. Navigate to `/en/auth/login`.
2. Assert `AuthCard` renders with `<h1>` sign-in title and logo.
3. Assert `#email` field visible — type=email, autoComplete=email, placeholder text, label "Email or phone".
4. Assert `#password` field visible — type=password, autoComplete=current-password, label "Password".
5. Assert password show/hide toggle: button with `aria-label` ("Show password" / "Hide password"), `size-11` touch target, positioned `absolute right-0 top-1/2`.
6. Click toggle — assert `#password` type changes to "text". Click again — type returns to "password".
7. Assert `#remember-me` checkbox visible — `<Checkbox>` component with associated `<label>` text, `gap-2`, container `min-h-11`.
8. Check the checkbox — assert `checked` state is `true`.
9. Assert "Forgot password?" link visible — `href="/auth/forgot-password"`, `min-h-11 flex items-center` (44px touch target).
10. Assert submit button: `<SubmitButton>` → `<Button type="submit" size="lg" className="w-full">`.
11. Assert footer links (Terms, Privacy, Help) — each `min-h-8 px-2 flex items-center` (**AUTH-003 flag: 32px, not 44px**).
12. Assert "New to Treido?" divider + "Create account" link/button is visible.

**Expected:** Login form renders cleanly on mobile. All interactive elements visible, password toggle works, remember-me checkbox functional.

**Screenshot checkpoint:** `phase-3-S3.5-login-form-fields.png`

---

### S3.6: Login Form Submission — Session Persistence (AUTH-001 Verification)

**Steps:**
1. Navigate to `/en/auth/login`.
2. Fill `#email` with valid test account email.
3. Fill `#password` with valid test account password.
4. Click submit button — assert button shows pending state (SpinnerGap + "Signing in…").
5. Wait for action to complete. Observe:
   - **Expected (no AUTH-001):** User is redirected to homepage or callback URL. Auth state updates — tab bar profile icon changes from "Sign In" to user avatar. Account drawer shows authenticated state.
   - **AUTH-001 present:** Login succeeds (no error), but UI does not reflect auth state. Tab bar still shows unauthenticated profile icon. Hard refresh (`location.reload()`) is required to see auth state.
6. If login succeeds without redirect, navigate to `/en` — check if `MobileHomepageHeader` shows authenticated state (user avatar in header).
7. Check cookie/localStorage for session token presence.

**Expected:** After successful login, UI immediately reflects authenticated state without requiring hard refresh. **Flag AUTH-001 if manual refresh is needed.**

**Screenshot checkpoint:** `phase-3-S3.6-login-pending.png`, `phase-3-S3.6-login-success-state.png`

---

### S3.7: Auth Drawer — Opens from Tab Bar Profile Icon (Unauthenticated)

**Steps:**
1. Navigate to `/en` (homepage), ensure logged out.
2. Locate the tab bar profile icon: `page.getByTestId('mobile-tab-profile')`.
3. Tap the profile icon — this triggers `openAuth({ mode: "login", entrypoint: "account_drawer" })` via the account drawer for unauthenticated users, or directly opens the auth drawer.
4. Assert `[data-testid="mobile-auth-drawer"]` becomes visible.
5. Assert drawer structure:
   - `DrawerContent` has classes `max-h-dialog rounded-t-2xl`.
   - `DrawerHeader` has `border-b border-border-subtle px-inset py-2.5`.
   - Title text visible (`DrawerTitle.text-sm.font-semibold`).
   - Close button (X icon) visible with `aria-label` for close.
   - Tab bar with `role="tablist"` containing 2 `role="tab"` buttons.
6. Assert default mode is "login" — `#auth-drawer-tab-login` has `aria-selected="true"`.
7. Assert login panel visible: `#auth-drawer-panel-login` with `role="tabpanel"`.
8. Assert `DrawerFooter` with `border-t border-border-subtle px-inset py-3 pb-safe-max` and "Create account" button.

**Expected:** Auth drawer opens as bottom sheet with tabbed interface, defaulting to login mode.

**Screenshot checkpoint:** `phase-3-S3.7-auth-drawer-login-tab.png`

---

### S3.8: Auth Drawer — Tab Switching Between Login and Signup

**Steps:**
1. Open auth drawer (from S3.7).
2. Assert login tab is active: `#auth-drawer-tab-login` has `aria-selected="true"`, `aria-controls="auth-drawer-panel-login"`, `tabIndex=0`. Active styling: `bg-background text-foreground shadow-2xs`.
3. Assert signup tab is inactive: `#auth-drawer-tab-signup` has `aria-selected="false"`, `tabIndex=-1`. Inactive styling: `text-muted-foreground`.
4. Tap signup tab (`#auth-drawer-tab-signup`) — assert:
   - `#auth-drawer-tab-signup` now has `aria-selected="true"`, `tabIndex=0`, active styling.
   - `#auth-drawer-tab-login` now has `aria-selected="false"`, `tabIndex=-1`, inactive styling.
   - Login panel hidden, signup panel `#auth-drawer-panel-signup` with `role="tabpanel"` visible.
   - `SignUpFormBody` renders inside panel.
5. Assert tab container: `grid grid-cols-2 gap-1 rounded-xl border border-border-subtle bg-surface-subtle p-1`.
6. Assert each tab button has `min-h-(--spacing-touch-md)` → 44px touch target.
7. Tap login tab again — assert switch back to login mode.
8. Tap footer "Sign In" button (in signup mode) — assert switches to login mode.
9. Tap footer "Create account" button (in login mode) — assert switches to signup mode.

**Expected:** Tab switching is instantaneous, ARIA states update correctly, panel content swaps, footer CTA adapts to current mode.

**Screenshot checkpoint:** `phase-3-S3.8-auth-drawer-signup-tab.png`

---

### S3.9: Auth Drawer — Form Submission Inside Drawer

**Steps:**
1. Open auth drawer in login mode.
2. Fill email and password fields within the drawer's `LoginFormBody`.
3. Submit the form — assert pending state on submit button.
4. If login succeeds:
   - Assert `handleLoginSuccess` fires: `refreshSession()` is called, drawer closes (`onOpenChange(false)`), then account drawer opens after 80ms timeout.
   - Assert the auth drawer is no longer visible.
5. Open auth drawer, switch to signup mode.
6. Fill all sign-up fields within the drawer's `SignUpFormBody`.
7. Submit — assert pending state.
8. If sign-up succeeds:
   - Assert `didSignUpSucceed` is set to `true`.
   - Assert tab bar is hidden (tabs only render when `!didSignUpSucceed`).
   - Assert success panel renders: `#auth-drawer-panel-signup-success` with CheckCircle icon, "Check your email" text, success description.
   - Assert footer changes: "Go to Sign In" button + "Continue browsing" button.
9. Tap "Go to Sign In" — assert switches to login mode, `didSignUpSucceed` resets.
10. Tap "Continue browsing" — assert drawer closes.

**Expected:** Form submission works within the drawer context. Login closes drawer and refreshes session. Sign-up shows in-drawer success state with email confirmation message.

**Screenshot checkpoint:** `phase-3-S3.9-auth-drawer-signup-success.png`

---

### S3.10: Auth Drawer — Safe Area Padding and Shape

**Steps:**
1. Open auth drawer on iPhone 12 viewport (390×844).
2. Assert `DrawerContent` has `rounded-t-2xl` — top corners are rounded (16px radius), bottom corners are square (flush to viewport bottom).
3. Assert `DrawerFooter` has `pb-safe-max` — bottom padding accommodates the iOS home indicator.
4. Measure `DrawerFooter` computed padding-bottom:
   - On a device with safe area (iPhone 12): should be ≥ 34px (home indicator height).
   - On Pixel 5 (no home indicator): `pb-safe-max` resolves to minimal padding.
5. Assert `DrawerBody` has `px-inset py-3 pb-2` — side padding consistent with inset spec.
6. Assert `DrawerHeader` `px-inset py-2.5` — side padding matches body.
7. Assert no content is clipped below the drawer footer.
8. Assert drawer can be swiped down to dismiss (Vaul drawer behavior).
9. Assert drawer backdrop tap dismisses the drawer.

**Expected:** Drawer respects safe area insets, has proper rounded corners at top, and content is not hidden behind the home indicator.

**Screenshot checkpoint:** `phase-3-S3.10-auth-drawer-safe-area-iphone.png`, `phase-3-S3.10-auth-drawer-safe-area-pixel.png`

---

### S3.11: Forgot Password Form — Submit and Confirmation

**Steps:**
1. Navigate to `/en/auth/forgot-password`.
2. Assert `AuthCard` renders with title, description, and logo.
3. Assert `#email` field visible — type=email, autoComplete=email, label "Email address".
4. Assert `<SubmitButton>` with label "Send reset link" is visible.
5. Assert footer "Back to login" link with `<ArrowLeft>` icon visible.
6. Submit with empty email — assert HTML5 validation blocks submission (`required` attribute).
7. Fill `#email` with "test@example.com" and submit.
8. Assert button shows pending state: SpinnerGap + "Sending…".
9. On success (`state.success === true`), assert:
   - Form is replaced by success view.
   - Success icon: `size-16 bg-primary-subtle rounded-full` with `Check` icon.
   - Title: "Check your email" heading (`text-2xl font-bold`).
   - Description: reset link sent message.
   - "Back to login" link with ArrowLeft icon.
10. Assert no horizontal overflow in either state.

**Expected:** Email is submitted, confirmation screen replaces form with "check your email" message and link back to login.

**Screenshot checkpoint:** `phase-3-S3.11-forgot-password-form.png`, `phase-3-S3.11-forgot-password-success.png`

---

### S3.12: Reset Password Form — New Password and Confirm Fields

**Steps:**
1. Navigate to `/en/auth/reset-password` (requires valid recovery session — may show loading/error state in audit).
2. Assert initial loading state: `SpinnerGap` spinner with "Loading…" text centered.
3. If no valid session:
   - Assert invalid session view: `Lock` icon in `size-16 bg-destructive-subtle rounded-full`, "Link expired" heading, "Request new link" link → `/auth/forgot-password`.
4. If valid session (test with mock or pre-set session):
   - Assert `AuthCard` renders with title "Set new password" and description.
   - Assert `#password` field — type=password, autoComplete=new-password, label "New password".
   - Assert `#confirmPassword` field — type=password, autoComplete=new-password, label "Confirm password".
   - Assert both fields have show/hide toggle buttons.
   - Assert password requirements hint: list with 4 items (8+ chars, uppercase, lowercase, number).
   - Assert submit button: "Update password", disabled until form valid (`react-hook-form` + zod).
5. Fill `#password` with "NewPass123", `#confirmPassword` with "NewPass123" — assert button becomes enabled.
6. Submit — assert pending state: SpinnerGap + "Updating…".
7. On success, assert: `Check` icon in `bg-success/15 rounded-full`, "Password updated" title, redirect to login after 3 seconds.

**Expected:** Reset password form validates in real-time via `react-hook-form`, submits via Supabase `updateUser`, shows success state with auto-redirect.

**Screenshot checkpoint:** `phase-3-S3.12-reset-password-form.png`, `phase-3-S3.12-reset-password-expired.png`

---

### S3.13: Sign-Up Success Page — Email Confirmation Message

**Steps:**
1. Navigate to `/en/auth/sign-up-success` (typically arrives after successful registration).
2. Assert success card renders:
   - Icon: `CheckCircle.size-8.text-success` inside `size-14 bg-success/15 rounded-full`.
   - Title: sign-up success title (`text-xl font-semibold`).
   - Description: success description text.
3. Assert email instruction block: `bg-selected border border-selected-border rounded-md` with `EnvelopeSimple` icon and "Check your email" + instructions text.
4. Assert CTA buttons:
   - "Go to Sign In" button → navigates to `/auth/login` — `h-10 bg-primary text-primary-foreground`.
   - "Back to Home" button → navigates to `/` — `h-10 bg-background border border-border`.
5. Assert "Didn't receive email?" text with "Resend email" button (uses `sessionStorage.getItem("lastSignupEmail")`).
6. Assert footer section: `bg-muted border-t border-border rounded-b-md` with Terms / Privacy / Help links + copyright.
7. Verify on 393px viewport — no horizontal overflow, all text readable, buttons full-width.

**Expected:** Success page displays email confirmation instructions with clear CTAs. Resend button is functional (relies on sessionStorage email).

**Screenshot checkpoint:** `phase-3-S3.13-signup-success.png`

---

### S3.14: Touch Targets on All Auth Form Elements (AUTH-003 Verification)

**Steps:**
1. Navigate to `/en/auth/login`.
2. Measure computed height of each interactive element:
   - `#email` input → expect ≥ 44px (Input component default height).
   - `#password` input → expect ≥ 44px.
   - Password show/hide toggle → `size-11` = 44px ✓.
   - `#remember-me` checkbox container → `min-h-11` = 44px ✓.
   - "Forgot password?" link → `min-h-11 flex items-center` = 44px ✓.
   - Submit button → `size="lg"` → expect ≥ 44px.
   - **Footer links (Terms, Privacy, Help) → `min-h-8` = 32px ✗ — below 44px spec.**
   - "Create account" button → `size="lg"` → expect ≥ 44px.
3. Navigate to `/en/auth/sign-up`.
4. Measure:
   - All 5 input fields → expect ≥ 44px each.
   - Password show/hide toggles → `size-11` = 44px ✓.
   - Submit button → ≥ 44px ✓.
   - Legal text links (Terms, Privacy) → inline `<Link>` with no explicit min-height — **likely < 44px**.
   - "Already have account?" sign-in link → `h-auto p-0` button variant="link" — **likely < 44px**.
5. In auth drawer (from S3.7):
   - Tab buttons → `min-h-(--spacing-touch-md)` = 44px ✓.
   - Close icon button → `size="icon-compact"` — measure actual size, may be < 44px.
6. Flag all elements below 44px for AUTH-003.

**Expected:** Most form elements meet 44px. **Known failures:** LoginForm footer links at `min-h-8` (32px), legal text links in sign-up form, sign-in CTA link in sign-up form. These confirm AUTH-003.

**Screenshot checkpoint:** `phase-3-S3.14-touch-targets-login.png`, `phase-3-S3.14-touch-targets-signup.png`

---

### S3.15: Onboarding Wizard Entry — Route Gating (ONB-002 Verification)

**Steps:**
1. Ensure user is logged out (clear all cookies/session).
2. Navigate to `/en/onboarding` — assert redirect to `/en/onboarding/account-type` (server-side `redirect()` in page.tsx).
3. Assert onboarding page renders (check for `OnboardingShell` structure: sticky header with progress bar, centered content, sticky footer).
4. **ONB-002 check:** Does the page render content without auth? Or does it redirect to `/auth/login`?
   - If page renders: **ONB-002 confirmed** — onboarding accessible without auth, this is a bug.
   - If redirect to login: ONB-002 fixed — proper route guarding.
5. Navigate to `/en/onboarding/profile` directly — check if accessible without auth.
6. Navigate to `/en/onboarding/complete` directly — check if accessible without auth.
7. For each accessible onboarding route, assert no crash / white screen occurs even though user data is missing.

**Expected:** Onboarding routes should require authentication. **Flag ONB-002 if any route renders without auth.**

**Screenshot checkpoint:** `phase-3-S3.15-onboarding-no-auth.png`

---

### S3.16: Onboarding — Step Navigation (Account Type → Profile → Complete)

**Steps:**
1. Log in with a test account (use session from S3.6 or create one).
2. Navigate to `/en/onboarding/account-type`.
3. Assert `OnboardingShell` renders:
   - Sticky header: step label ("Step 1 of 4/5"), progress bar (`<Progress>` component).
   - Title: account type title (`text-2xl sm:text-3xl font-bold`).
   - Subtitle description.
4. Assert 2 `AccountTypeCard` components visible in `role="radiogroup"`:
   - "Personal" card.
   - "Business" card.
5. Assert Continue button is disabled (no selection).
6. Tap "Personal" card — assert selected state (visual highlight).
7. Assert Continue button becomes enabled.
8. Tap Continue — assert navigation to `/en/onboarding/profile?type=personal`.
9. Assert profile step renders with different content.
10. Assert back button (ArrowLeft) in sticky header navigates back to account-type.
11. **ONB-001 check:** Inspect computed styles for hardcoded values vs design tokens:
    - `OnboardingShell`: `bg-background`, `border-b border-border`, `pt-safe` — verify these use tokens.
    - `AccountTypeCard`: check if colors/spacing use semantic tokens or hardcoded hex/rem.
    - Progress bar: check if `<Progress>` uses `bg-primary` or hardcoded color.
12. Continue through remaining steps to completion screen.

**Expected:** Wizard navigates between steps with progress bar updating. Back navigation works. **Flag ONB-001 if hardcoded styles found.**

**Screenshot checkpoint:** `phase-3-S3.16-onboarding-account-type.png`, `phase-3-S3.16-onboarding-profile.png`, `phase-3-S3.16-onboarding-complete.png`

---

### S3.17: Minimal Header Renders on Auth Pages

**Steps:**
1. Navigate to `/en/auth/login`.
2. Assert the auth layout renders `<PageShell variant="muted">` with `<main id="main-content" role="main">`.
3. Check for `MobileMinimalHeader` presence. The auth layout itself has **no header** (only PageShell + main). However, `AppHeader` renders `MobileMinimalHeader` for `variant="minimal"` routes.
4. Determine if auth routes use `minimal` header variant:
   - If `MobileMinimalHeader` visible: assert `border-b border-border-subtle bg-background pt-safe`, `h-(--control-primary)` height, centered "treido." text link to `/`.
   - If no header renders (auth layout directly uses PageShell without AppHeader): flag as a design decision — auth pages are standalone cards without header chrome.
5. Navigate to `/en/auth/sign-up`, `/en/auth/forgot-password` — check consistency across all auth routes.
6. Assert no duplicate headers (minimal header + another header variant overlapping).
7. Assert the `<main id="main-content">` element fills the viewport (`min-h-dvh` is on AuthCard, not main).

**Expected:** Auth pages either render MobileMinimalHeader (centered logo, no nav) or are headerless standalone cards. Consistent behavior across all 7 auth routes.

**Screenshot checkpoint:** `phase-3-S3.17-auth-header-login.png`, `phase-3-S3.17-auth-header-signup.png`

---

### S3.18: Auth Error Page — Error Display and Recovery

**Steps:**
1. Navigate to `/en/auth/error?error=access_denied`.
2. Assert error card renders:
   - Error icon: `WarningCircle.size-8.text-destructive` inside `size-14 bg-destructive-subtle rounded-full`.
   - Title: error title (`text-xl font-semibold`).
   - Subtitle: error subtitle (`text-sm text-muted-foreground`).
3. Assert error details box: `bg-destructive-subtle border border-destructive/20 rounded-lg` with error message and error code.
4. Assert "Try Again" button → navigates to `/auth/login` — `w-full h-10 bg-primary`.
5. Assert "Back to Home" button → navigates to `/` — `w-full h-10 bg-background border` with ArrowLeft icon.
6. Assert "Need help? Contact support" link at bottom → `/help`.
7. Assert footer: `bg-muted border-t border-border rounded-b-md` with Terms / Privacy / Help links.
8. Test with different error codes:
   - `/en/auth/error?error=server_error` — verify different error message.
   - `/en/auth/error?error_description=Custom%20message` — verify custom description displayed.
   - `/en/auth/error` (no params) — verify generic error message.
9. Assert all elements fit within 393px viewport without overflow.

**Expected:** Error page displays contextual error message with clear recovery actions. Footer links and support CTA are visible.

**Screenshot checkpoint:** `phase-3-S3.18-auth-error-access-denied.png`, `phase-3-S3.18-auth-error-generic.png`

---

### S3.19: Welcome Page — Post-Auth 4-Step Wizard

**Steps:**
1. Log in with a newly created test account.
2. Navigate to `/en/auth/welcome`.
3. Assert loading state: `SpinnerGap.size-8.text-primary.animate-spin` centered.
4. After profile fetches, assert Step 1 (welcome):
   - Progress dots: 4 dots, first is active (`w-8 bg-primary`), others inactive.
   - Framer Motion animated card with `bg-primary` hero section, Confetti icons, CheckCircle icon.
   - Welcome message with user's display name.
   - "Get Started" button (`h-12 bg-primary`) and "Skip for now" text button.
5. Tap "Get Started" — assert Step 2 (avatar picker):
   - AnimatePresence transition (slide animation `x: 20` → `x: 0`).
   - Avatar preview (boring-avatars) centered.
   - 6 avatar variant buttons in `grid grid-cols-6 gap-2`.
   - Color palette selector in `grid grid-cols-6 gap-2`.
   - Camera icon for photo upload.
   - Back + Continue buttons in footer.
6. Select an avatar variant — assert selected state `border-primary bg-muted`.
7. Tap Continue — assert Step 3 (profile info):
   - Display name input (`h-11`).
   - Bio textarea with 200-char counter.
   - Back + "Save & Continue" buttons.
8. Fill display name, tap "Save & Continue" — assert Step 4 (complete):
   - Check icon in `bg-selected rounded-full`.
   - "You're all set!" heading.
   - 3 action cards: "Browse Products" → `/`, "Start Selling" → `/sell`, "View Your Profile" → `/:username`.
   - Each card: `bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border`.
9. Tap "Browse Products" — assert navigation to homepage.

**Expected:** 4-step wizard flows sequentially with smooth animations, avatar/profile customization works, completion screen offers clear next actions.

**Screenshot checkpoint:** `phase-3-S3.19-welcome-step1.png`, `phase-3-S3.19-welcome-step2-avatar.png`, `phase-3-S3.19-welcome-step3-profile.png`, `phase-3-S3.19-welcome-step4-complete.png`

---

## Known Bugs to Verify

| Bug ID | Description | Expected Behavior | Actual Behavior | Severity | Verification Steps |
|--------|-------------|-------------------|-----------------|----------|--------------------|
| AUTH-001 | Login doesn't reflect auth state without hard refresh | UI updates immediately after successful login (tab bar, header, drawers show authenticated state) | Fixed: forced retry bypasses refresh throttle and drawer login explicitly calls `refreshSession({forceRetry:true})` + `router.refresh()` | P0 | `components/providers/auth-state-manager.tsx`, `components/mobile/drawers/auth-drawer.tsx` |
| AUTH-002 | Auth forms need shadcn component refactor | Form fields use consistent shadcn primitives (Input, Button, Field) | Fixed for primary auth surfaces: forms are built on `Input`, `Button`, `Field`, with consistent tokens and spacing | P1 | `components/auth/login-form-body.tsx`, `components/auth/sign-up-form-body.tsx`, `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx` |
| AUTH-003 | Auth forms have mobile responsiveness / touch target issues | All interactive elements ≥ 44px touch target | Partially fixed: most controls meet 44px, but auth drawer close button still uses `icon-compact` (36px) | P1 | `components/mobile/drawers/auth-drawer.tsx`, `components/ui/icon-button.tsx` |
| ONB-001 | Onboarding wizard uses hardcoded styles instead of design tokens | All styling via semantic tokens (bg-background, text-foreground, etc.) | Fixed in audited onboarding shell/cards: semantic tokens in use, no raw `#hex` / `text-white` / `bg-white` patterns detected | P1 | `app/[locale]/(onboarding)/onboarding/_components/onboarding-shell.tsx`, `app/[locale]/(onboarding)/onboarding/_components/account-type-card.tsx` |
| ONB-002 | Onboarding routes accessible without auth | Unauthenticated users redirected to `/auth/login` | Fixed: onboarding layout now gates via `supabase.auth.getUser()` and redirects to login with `next` | P1 | `app/[locale]/(onboarding)/layout.tsx` |

---

## Evidence Log (v2)

Fixed columns. Add one row per scenario run (or per sub-scenario if needed).

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| S3.1 | code trace | `app/[locale]/(auth)/auth/sign-up/page.tsx`, `components/auth/sign-up-form-body.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S3.2 | code trace | `components/auth/sign-up-form-body.tsx` validation + field errors | Pass | — | — | Codex | 2026-02-11 |
| S3.3 | code trace | `data-testid="username-availability"` state handling in sign-up form body | Pass | — | — | Codex | 2026-02-11 |
| S3.4 | code trace | Password strength requirements rendered in sign-up form body | Pass | — | — | Codex | 2026-02-11 |
| S3.5 | code trace | `app/[locale]/(auth)/_components/login-form.tsx`, `components/auth/login-form-body.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S3.6 | code trace | Auth refresh flow in `components/providers/auth-state-manager.tsx` + drawer submit in `components/mobile/drawers/auth-drawer.tsx` | Pass | AUTH-001 | P0 | Codex | 2026-02-11 |
| S3.7 | code trace | Auth drawer open state and tabbed content wiring | Pass | — | — | Codex | 2026-02-11 |
| S3.8 | code trace | Drawer tab switching logic in `components/mobile/drawers/auth-drawer.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S3.9 | code trace | Drawer login submit calls `onLoginSuccess` refresh path | Pass | AUTH-001 | P0 | Codex | 2026-02-11 |
| S3.10 | code trace | Drawer safe-area classes and container structure | Pass | — | — | Codex | 2026-02-11 |
| S3.11 | code trace | `app/[locale]/(auth)/_components/forgot-password-form.tsx` submit/success states | Pass | — | — | Codex | 2026-02-11 |
| S3.12 | code trace | `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx` session+reset flow | Pass | — | — | Codex | 2026-02-11 |
| S3.13 | code trace | Sign-up success screen + resend flow in `sign-up-success-client.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S3.14 | code trace | Most controls are touch-safe, but drawer close button uses `icon-compact` (36px) | Partial | AUTH-003 | P1 | Codex | 2026-02-11 |
| S3.15 | code trace | Onboarding auth gate in `app/[locale]/(onboarding)/layout.tsx` | Pass | ONB-002 | P1 | Codex | 2026-02-11 |
| S3.16 | code trace | Onboarding shell/cards flow components audited | Pass | ONB-001 | P1 | Codex | 2026-02-11 |
| S3.17 | code trace | Auth layout uses `PageShell variant=\"default\"`; route auto-detection keeps `/auth/*` in default header path | Partial | AUTH-UX-004 | P2 | Codex | 2026-02-11 |
| S3.18 | code trace | Auth error page render + navigation actions | Pass | AUTH-002 | P1 | Codex | 2026-02-11 |
| S3.19 | code trace | Welcome wizard logic in `app/[locale]/(auth)/_components/welcome-client.tsx` | Pass | — | — | Codex | 2026-02-11 |

Method suggestions: `runtime` | `code trace` | `manual` (keep it consistent within a phase).


---

## Findings

> Filled during audit execution.

| # | Severity | Component | Description | Screenshot | Repro Steps |
|---|----------|-----------|-------------|------------|-------------|
| AUTH-003 | P1 | Auth drawer close affordance | Drawer close button uses `IconButton size=\"icon-compact\"` (36px) which is below the 44px touch-target requirement. | N/A | Open auth drawer and inspect close button sizing in `components/mobile/drawers/auth-drawer.tsx` |
| AUTH-UX-004 | P2 | Auth header consistency | Auth routes resolve to default header behavior; minimal-header expectation is not explicitly enforced by auth layout. | N/A | Compare `app/[locale]/(auth)/layout.tsx` with route detection in `app/[locale]/_components/app-header.tsx` |
| AUTH-DOC-001 | P3 | Phase document source map | `components/auth/auth-card.tsx` is referenced in this phase doc, but current implementation path is `app/[locale]/(auth)/_components/auth-card.tsx`. Audit scriptability risk only (no runtime impact). | N/A | Open Source Files table and resolve path |

---

## Summary

| Metric | Value |
|--------|-------|
| Routes tested | 14 (7 auth + 1 drawer + 6 onboarding) |
| Scenarios executed | 19 |
| Passed | 17 |
| Partial | 2 |
| Failed | 0 |
| Findings | 3 (P1:1, P2:1, P3:1) |
| Known bugs verified | 5/5 |
| Known bugs still open | 1 (AUTH-003 partial) |
| Status | ✅ Complete (code audit) |
