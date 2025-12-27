# Treido/Amazong onboarding refactor plan (Personal vs Business)

Date: 2025-12-26

## Goals

1. Make personal vs business onboarding **intentionally different** while keeping a **single unified account + identity**.
2. Fix the current UX/logic where seller type is chosen only inside `/sell` and business onboarding is not clearly separated.
3. Support **upgrade/downgrade** between personal ↔ business safely.
4. Keep the codebase maintainable: clear state machine, minimal duplicated UI, no “mystery flags”.

Non-goals (for this iteration)
- Building full VAT validation / government registry integration.
- Multi-store per account.

---

## Current state (what exists today)

### Identity onboarding (after email confirm)
- Email confirm route: `app/auth/confirm/route.ts`
  - Exchanges session, checks `profiles.onboarding_completed`, redirects to `/en/auth/welcome` if not completed.
- Welcome wizard: `app/[locale]/(auth)/_components/welcome-client.tsx`
  - Sets `display_name`, `bio`, `avatar_url`, `onboarding_completed=true`.
  - Does **not** choose personal/business.

### Sign-up
- UI: `app/[locale]/(auth)/_components/sign-up-form.tsx`
- Server action: `app/[locale]/(auth)/_actions/auth.ts`
  - Sign-up includes `name`, `username`, `email`, `password`.
  - Best-effort profile update sets `username`, `display_name`.

### Seller activation (/sell)
- Server route: `app/[locale]/(sell)/sell/page.tsx`
- Client: `app/[locale]/(sell)/sell/client.tsx`
  - If `profiles.username` exists but `profiles.is_seller=false`, shows `SellerOnboardingWizard`.
- Wizard: `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx`
- Action: `app/[locale]/(sell)/_actions/sell.ts` → `completeSellerOnboarding()`
  - Updates `profiles.account_type` to personal/business.
  - Sets `profiles.is_seller=true`.
  - Sets `display_name`, `bio`.
  - **Does not set `profiles.role='seller'`** (potential inconsistency with legacy `/api/stores`).

### Dashboards
- Personal-ish seller dashboard: `app/[locale]/(main)/seller/dashboard/*` (client-side)
- Business dashboard: `app/[locale]/(business)/dashboard/*`
  - Gated by `lib/auth/business.ts`:
    - `requireBusinessSeller()` → `profiles.account_type === 'business'`
    - `requireDashboardAccess()` → also requires paid subscription tier.

### Database signals in Supabase (already good foundations)
- `profiles.account_type` (default personal)
- `profiles.is_seller` (default false)
- `profiles.onboarding_completed` (default false)
- Business fields: `business_name`, `vat_number`, `website_url`, `social_links`, `is_verified_business`
- Business verification table: `business_verification` (documents/status)
- Plans table: `subscription_plans` has `account_type` (personal/business)

---

## Key decision: where should Personal/Business be selected?

### Recommended approach (best balance: UX + flexibility)

1. **At sign-up:** optional “I plan to sell as…” selector
   - Default: Personal.
   - Can be skipped (keeps sign-up conversion high).
   - Saves *intent / preference* early and allows personalized onboarding messaging.

2. **At seller activation time:** required confirmation when they actually become a seller
   - When user first goes to `/sell` (or clicks “Start selling”), we finalize seller activation.
   - If they selected business at sign-up, we preselect business in seller onboarding.

Why not force at sign-up?
- Forcing personal/business at sign-up increases friction and is often premature.
- Many users sign up to browse/buy first.

Why not only at `/sell`?
- It prevents personalizing onboarding/welcome and creates “surprise complexity” when user tries to sell.

---

## Target architecture (production-ready)

We treat onboarding as **3 separate flows**:

### Flow A — Welcome / identity onboarding (all users)
- Purpose: avatar + display_name + basic bio.
- Storage: `profiles.onboarding_completed` (already exists).
- Route: `/{locale}/auth/welcome` (already exists).

### Flow B — Seller activation onboarding (required before listing)
- Purpose: convert a user into a seller (`is_seller=true`, `role='seller'`), and collect seller-facing profile.
- Trigger: first visit to `/sell` or clicking “Become a seller”.
- Output:
  - Personal seller: social-style profile.
  - Business seller: professional storefront profile + optional verification info.

### Flow C — Business dashboard onboarding (optional but recommended)
- Purpose: set up a business “Shopify-like” dashboard experience.
- Trigger: business account tries to access `/dashboard` or clicks “Set up business dashboard”.
- Output:
  - Setup checklist completion
  - Plan suggestion / upgrade

Important: **Business dashboard access remains subscription-gated** (current behavior), but onboarding should not be blocked by payment.

---

## Data model plan

### Option 1 (recommended): one onboarding table
Create a new table to track onboarding progress cleanly without adding many columns to `profiles`.

`user_onboarding`
- `user_id uuid primary key references profiles(id)`
- `welcome_completed_at timestamptz null`
- `seller_completed_at timestamptz null`
- `seller_flow text not null default 'none'` (enum-ish: none | personal | business)
- `seller_step text null` (e.g. choose_type | profile | business_details | plan)
- `business_dashboard_completed_at timestamptz null`
- `metadata jsonb not null default '{}'` (store marketing opt-ins, referral, etc.)

RLS
- Read/write allowed only for `auth.uid() = user_id`.

### Option 2 (fastest): a few columns on `profiles`
Add columns:
- `seller_onboarding_completed boolean default false`
- `seller_onboarding_completed_at timestamptz null`
- `seller_onboarding_step text null`
- `business_onboarding_completed boolean default false`

Note: Option 2 is fine short-term but will become messy as steps evolve.

### Required consistency fix
When seller onboarding completes, set:
- `profiles.is_seller = true`
- `profiles.role = 'seller'` (or consider multi-role later; for now this matches the schema)

---

## Backend changes

### 1) Sign-up: capture account type intent (optional)
Update `SignUpForm` + `signUp()` action:
- Add form field: `accountType` (personal|business) optional.
- Save to Supabase user metadata (`options.data.account_type_intent`) and/or update `profiles.account_type` best-effort via admin client.

Rules
- Do NOT set `is_seller=true` at sign-up.
- Do NOT require business fields at sign-up.

### 2) Seller activation API (server action)
Refactor `completeSellerOnboarding()` in `app/[locale]/(sell)/_actions/sell.ts`:
- Always sets `is_seller=true` and `role='seller'`.
- Personal path updates:
  - `display_name`, `bio`, maybe `social_links` (instagram/tiktok/etc) if you choose.
- Business path updates:
  - `business_name` (required), `website_url`, `vat_number` (optional), `social_links`.
  - Optionally upsert row in `business_verification` with submitted data.

Validation
- Personal display_name min 2 chars.
- Business business_name min 2 chars.
- URLs should be validated/normalized.

### 3) Business dashboard onboarding endpoint(s)
Add server actions under `app/[locale]/(business)/dashboard/_actions/*` or `app/[locale]/(business)/_actions/*`:
- `completeBusinessDashboardOnboarding()`
- `getBusinessPlanSuggestions()` (filter `subscription_plans` by `account_type='business'`)

---

## Frontend changes (routes + UX)

### 1) Sign-up: add account type intent (optional)
- Update UI in `app/[locale]/(auth)/_components/sign-up-form.tsx`
- Keep it lightweight: two pills/cards (“Personal”, “Business”).
- Copy: “You can change this later.”

### 2) Seller onboarding: split by flow
Replace the current combined wizard with:
- `SellerOnboardingWizardPersonal`
- `SellerOnboardingWizardBusiness`

Routing behavior in `app/[locale]/(sell)/sell/client.tsx`:
- If not seller:
  - If `profiles.account_type` already set → go directly to the appropriate wizard.
  - Else show a *beautiful* selector screen first.

Personal seller onboarding (social profile)
- Steps (suggested):
  1) Pick seller style (optional if already known)
  2) Profile basics (display name, bio)
  3) Social links (optional)
  4) Personal plan suggestion (from `subscription_plans account_type='personal'`)

Business seller onboarding (professional storefront)
- Steps (suggested):
  1) Business details (business_name, website/socials)
  2) Compliance (VAT/EIK optional; upload docs optional)
  3) Payout/Invoice readiness (placeholder if not built)
  4) Business plan suggestion (and/or link to dashboard upgrade)

### 3) Business dashboard onboarding page (new)
Add: `app/[locale]/(business)/dashboard/onboarding/page.tsx`
- Use `requireBusinessSeller()` (NOT `requireDashboardAccess()`) so free business sellers can complete setup.
- At the end, route user to:
  - If they have dashboard access → `/dashboard`
  - Else → `/dashboard/upgrade`

### 4) Account settings: upgrade/downgrade entry points
Add a page in account settings:
- `/{locale}/account/seller-type`
  - Shows current `account_type`, `is_seller`, `tier`.
  - Upgrade personal → business:
    - Switch account_type to business
    - Start business seller onboarding (or business dashboard onboarding)
  - Downgrade business → personal:
    - If active subscription: block or require cancel first
    - Disable dashboard access naturally (tier changes)
    - Keep verification records but hide business branding

---

## Upgrade/downgrade rules (important)

### Personal → Business
- Allowed anytime.
- Keep username the same.
- Preserve existing seller stats, products, reviews.
- Set `account_type='business'`.
- Optional: set `tier='free'` if you want business tiers to be separate.

### Business → Personal
- Allowed only if:
  - No active paid subscription (or user cancels first).
- Set `account_type='personal'`.
- Set `is_verified_business=false`.
- Keep business_verification row for audit, but do not show it publicly.

---

## Analytics & tracking (minimum viable)

Track these events (server-side if possible):
- `onboarding_welcome_completed`
- `onboarding_seller_started` (with flow personal/business)
- `onboarding_seller_completed`
- `onboarding_business_dashboard_started/completed`
- `account_type_changed`

---

## Migration / rollout steps

1) Add data model (Option 1 table or Option 2 columns).
2) Backfill:
   - If `profiles.onboarding_completed=true` → mark welcome completed.
   - If `profiles.is_seller=true` → mark seller onboarding completed.
3) Ship UI changes behind a feature flag (optional):
   - `NEXT_PUBLIC_ONBOARDING_V2=true`.
4) Remove legacy/deprecated paths later:
   - `app/api/stores/route.ts` (already marked deprecated)

---

## Acceptance criteria

- New user can sign up without choosing seller type.
- New user can optionally choose “Business” at sign-up and see business-appropriate copy.
- First time going to `/sell`:
  - Personal: sees personal seller onboarding; becomes seller; can create listing.
  - Business: sees business seller onboarding; becomes seller; can create listing.
- Business seller can access `/dashboard/onboarding` even without paid plan.
- `/dashboard` remains paid-gated.
- Switching account type is possible from account settings with safe guards.
- No regressions for existing sellers: they can still list immediately.

---

## Notes / known inconsistencies to fix during refactor

- `completeSellerOnboarding()` currently sets `is_seller=true` but not `role='seller'`.
- `/auth/confirm` redirects to `/en/*` hardcoded; consider locale-aware redirect later.
- Business dashboard checklist currently infers setup from `bio/avatar/products`; we should explicitly store completion once onboarding exists.
