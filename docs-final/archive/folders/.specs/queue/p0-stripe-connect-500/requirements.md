# Audit Spec: P0 Stripe Connect Onboarding 500

> Created: 2026-01-23
> Status: Queue
> Owner: Claude (impl) | Codex (verify)
> Audit Type: backend
> Priority: P0 — RELEASE BLOCKER

---

## Audit Scope

**What we're auditing:**
- `/api/connect/onboarding` returning 500 error
- Stripe Connect account creation/onboarding flow
- Environment variable configuration

**Why:**
- **Launch blocker** — Sellers cannot complete onboarding
- Breaks seller signup → selling flow
- Referenced in `docs/desktop_uiux_audit.md`, `docs/BACKEND.md`

**Success criteria:**
- Seller can complete Stripe Connect onboarding
- API returns proper redirect URL
- No 500 errors in happy path

---

## Audit Checklist

### Category 1: API Route

| Item | Current State | Target | Status |
|------|---------------|--------|--------|
| Route handler exists | Yes | Working | ⏳ |
| Error handling | Unknown | Proper error messages | ⏳ |
| Stripe API call | Unknown | Correct parameters | ⏳ |
| Return URL config | Unknown | Correct environment URL | ⏳ |

### Category 2: Environment

| Item | Current State | Target | Status |
|------|---------------|--------|--------|
| STRIPE_SECRET_KEY | Unknown | Set correctly | ⏳ |
| NEXT_PUBLIC_APP_URL | Unknown | Set correctly | ⏳ |
| Stripe Connect enabled | Unknown | Enabled in dashboard | ⏳ |

---

## Routes / Files in Scope

### Routes
- `/api/connect/onboarding` — Creates Connect account + onboarding link

### Files
- `app/api/connect/onboarding/route.ts`
- `lib/stripe.ts` (if exists)
- `.env.local` (check vars)

---

## Tasks

### Phase 1: Investigation
- [ ] **1.1** Call API endpoint — capture exact error
- [ ] **1.2** Check server logs for error details
- [ ] **1.3** Verify environment variables set
- [ ] **1.4** Check Stripe dashboard for Connect configuration

### Phase 2: Fix
- [ ] **2.1** Fix identified issue
- [ ] **2.2** Test in development
- [ ] **2.3** Document required prod env vars

### Phase 3: Verify
- [ ] **3.1** Run gates
- [ ] **3.2** Manual test: seller onboarding flow
- [ ] **3.3** Codex review

---

## Verification

### Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

### Manual QA
- [ ] Navigate to seller dashboard
- [ ] Click "Complete setup" or similar
- [ ] Stripe onboarding opens (not 500 error)
- [ ] Can complete onboarding (test mode)
