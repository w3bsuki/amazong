# Codex — Onboarding Spec (first-login, mobile-first)

## Outcome
After first login, every user completes onboarding:
1) Choose account type: Personal / Business
2) Profile basics (branched)
3) Username claim (with change limit notice)
4) Finish → “Start browsing” / “Start selling”

## Current implementation anchors (to evolve, not replace)
- Onboarding trigger/provider: `app/[locale]/(main)/_providers/onboarding-provider.tsx`
- Onboarding UI: `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx`
- Server action: `app/actions/onboarding.ts`
- Email-confirm redirect trigger: `app/auth/confirm/route.ts` (redirects to `/?onboarding=true`)

## Current reality vs target (important)
Today:
- Onboarding modal only renders when `profile.username` exists (provider guard).
- Onboarding UI expects `accountType` is already set at signup.
- Server action does **not** persist `account_type` (and assumes username already exists for avatar generation).

Target:
- Onboarding should open when `onboarding_completed` is false **even if username is null**.
- Onboarding must collect and persist `account_type` (and username if we move it into onboarding).
- All onboarding copy should move to `next-intl` (no inline translation objects).

## Entry conditions (when onboarding must open)
Open onboarding when any required field is missing:
- `profiles.onboarding_completed` is false, OR
- `profiles.account_type` is null, OR
- `profiles.username` is null (if username becomes required), OR
- Required business fields missing (business only; see below)

## Step 1 — Choose account type
**UI pattern:** 2-card selection + one CTA.
- Personal: “Buy & sell as an individual”
- Business: “Tools for professional selling”

Rules:
- Default should be **no selection** (force explicit choice).
- “Upgrade anytime” copy is allowed, but don’t overpromise for v1.

## Step 2A — Personal profile (required)
Fields:
- Display name (required)
- Avatar (required: upload OR generated avatar)
- Location (required; city-level)

Derived:
- Store name defaults to display name (editable later in profile settings).

## Step 2B — Business profile (required)
Fields:
- Business name (required)
- VAT number (optional; consider v2 unless legally required at launch)
- Website (optional)
- Physical store location (optional in v1 unless “local store” is core trust)
- Social links (v1: Instagram + one “other link”; v2: Facebook + expanded set)
- Logo (required: upload OR generated placeholder)

## Step 3 — Username claim (required unless already set)
Rules:
- Valid chars: `[a-z0-9_]` (existing constraint in sign-up form)
- Minimum 3 chars
- Show availability check

Change policy (v1):
- Can change **once** after initial claim
- Premium can change more (requires product decision + plan integration)

Data needs (implementation planning):
- Store `username_change_count` (or `username_last_changed_at`) on profile
- Gate “extra changes” by subscription status

## Step 4 — Completion
Show:
- Profile preview (avatar + username + account type)
- Primary CTA: “Start browsing”
- Secondary CTA: “Start selling” (deep link to `/sell`)

## Notes on modal vs dedicated onboarding route
The current onboarding is a dialog. For a native feel:
- Mobile: treat it as **full-screen** (sheet-like), no accidental dismissal until completion.
- Desktop: dialog is fine, but it should still feel like a clear flow.

If the dialog becomes limiting, phase 2 can migrate to a dedicated route group (e.g. `(onboarding)`), keeping the same state machine.

## Implementation checklist (file-level)
These are the concrete places we’ll touch when we start implementing:
- Sign-up form: remove account type selection (and possibly username) in `app/[locale]/(auth)/_components/sign-up-form.tsx`
- Onboarding trigger rules: update guards in `app/[locale]/(main)/_providers/onboarding-provider.tsx`
- Onboarding state machine + steps (add account type step, add username step if needed): `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx`
- Persist onboarding fields (must include `account_type`): `app/actions/onboarding.ts`
- Move onboarding strings to `messages/en.json` + `messages/bg.json` (next-intl rail)
