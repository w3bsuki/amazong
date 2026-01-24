# Audit Spec: P0 Turbopack Crash After Sign-In

> Created: 2026-01-23
> Status: Queue
> Owner: Claude (impl) | Codex (verify)
> Audit Type: architecture
> Priority: P0 — RELEASE BLOCKER

---

## Audit Scope

**What we're auditing:**
- Turbopack crash that occurs after user signs in
- Missing client manifest / `OnboardingProvider` issue
- Server/client boundary violations in auth flow

**Why:**
- **Launch blocker** — Users cannot sign in without crash
- Breaks core user journey
- Referenced in `docs/desktop_uiux_audit.md`

**Success criteria:**
- User can sign in without Turbopack crash
- No console errors related to client manifest
- Auth flow works with both Turbopack and Webpack

---

## Audit Checklist

### Category 1: OnboardingProvider

| Item | Current State | Target | Status |
|------|---------------|--------|--------|
| OnboardingProvider location | Unknown | Proper client boundary | ⏳ |
| Client directive | Unknown | `'use client'` where needed | ⏳ |
| Import chain | Unknown | No server→client leaks | ⏳ |

**Findings:**
- TBD (run audit first)

**Fixes Required:**
- [ ] TBD

---

### Category 2: Auth Layout/Route Structure

| Item | Current State | Target | Status |
|------|---------------|--------|--------|
| Layout client/server | Unknown | Correct boundaries | ⏳ |
| Redirect handling | Unknown | No hydration errors | ⏳ |
| Session provider | Unknown | Proper SSR handling | ⏳ |

**Findings:**
- TBD

**Fixes Required:**
- [ ] TBD

---

## Routes / Files in Scope

### Routes
- `/auth/callback` — OAuth callback
- `/auth/confirm` — Email confirmation
- `/(main)/` layout — Main app shell post-auth
- `/onboarding` — Post-signup onboarding

### Files (Likely Involved)
- `app/[locale]/(main)/layout.tsx`
- `components/providers/onboarding-provider.tsx` (if exists)
- `app/auth/*`
- `middleware.ts` or `proxy.ts`

---

## Audit Methodology

### Tools Used
- [ ] Manual reproduction: sign in → observe crash
- [ ] Browser console: check for client manifest errors
- [ ] `grep_search` for OnboardingProvider usage
- [ ] `pnpm dev` (Turbopack) vs `pnpm dev --webpack`
- [ ] `pnpm -s exec tsc --noEmit` (type errors in area)

### Reproduction Steps
1. Start dev server: `pnpm dev`
2. Navigate to `/en/auth/login`
3. Sign in with test credentials
4. Observe crash/error

### Pass Criteria
- Sign in completes without crash
- No console errors
- Gates pass

---

## Tasks (Fixes)

### Phase 1: Investigation
- [ ] **Task 1**: Reproduce the crash and capture exact error
  - Run: `pnpm dev`, sign in, copy console error
  - Output: Exact error message + stack trace
- [ ] **Task 2**: Search for OnboardingProvider and trace imports
  - Files: `grep_search "OnboardingProvider"`
  - Output: Import chain analysis

### Phase 2: Fix
- [ ] **Task 3**: Fix client/server boundary violation
  - Files: TBD based on investigation
  - Change: Add `'use client'` or restructure imports
- [ ] **Task 4**: Verify fix works in both Turbopack and Webpack
  - Run: `pnpm dev` AND `pnpm dev --webpack`

### Phase 3: Verify
- [ ] **Task 5**: Run full gates
  - `tsc --noEmit`, `e2e:smoke`

---

## Verification

### Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] `pnpm -s lint` (0 errors)

### Manual QA
- [ ] Sign in with email works (Turbopack)
- [ ] Sign in with OAuth works (Turbopack)
- [ ] No console errors after sign in
- [ ] Onboarding flow accessible

---

## Agent Prompts

### Investigation
```
TREIDO: Investigate Turbopack crash after sign-in
1. Reproduce crash with `pnpm dev`
2. Capture exact error message
3. Search for OnboardingProvider imports
4. Identify server/client boundary violation
Output: Findings in .specs/active/p0-turbopack-crash/context.md
```

### Fix
```
FRONTEND: Fix client/server boundary causing Turbopack crash
Files: <identified files>
Constraint: No behavior change, just fix boundary
Verify: Sign in works in both Turbopack and Webpack
```
